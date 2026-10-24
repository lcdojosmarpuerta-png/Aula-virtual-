import { User, CourseProgress, StudentRecord, PhaseId } from '../types/course';
import {
  supabase,
  reportSupabaseError,
  reportSupabaseSuccess,
} from '../lib/supabase';

const USER_KEY = 'excel_lms_active_user_v1';
const PROGRESS_KEY_PREFIX = 'excel_lms_progress_v1_';
const STUDENTS_KEY = 'excel_lms_students_records_v1';

export const INITIAL_PROGRESS: CourseProgress = {
  currentPhase: 1,
  completedPhases: [],
  quizScore: null,
  quizAnswers: {},
  quizSubmitted: false,
  practicalSubmission: null,
  practicalScore: null,
  finalScore: null,
  isApproved: null,
  certificateDate: null,
  certificateId: null,
};

// Default seed students for the Teacher Dashboard
export const DEFAULT_STUDENTS: StudentRecord[] = [
  {
    id: 'std-1',
    fullName: 'María Elena Delgado Gómez',
    email: 'm.delgado@minpesca.gob.ve',
    password: 'Delgado2026*',
    registeredAt: '2026-10-18',
    progressPercent: 100,
    completedPhases: [1, 2, 3, 4, 5, 6],
    currentPhase: 6,
    isCulminated: true,
    quizScore: 95,
    practicalScore: 92,
    finalScore: 94,
    certificateDate: '19 de octubre de 2026',
    certificateId: 'EXCEL-CERT-2026-8491',
  },
  {
    id: 'std-2',
    fullName: 'Carlos Alberto Mendoza',
    email: 'carlos.mendoza@minpesca.gob.ve',
    password: 'Mendoza2026*',
    registeredAt: '2026-10-20',
    progressPercent: 100,
    completedPhases: [1, 2, 3, 4, 5, 6],
    currentPhase: 6,
    isCulminated: true,
    quizScore: 88,
    practicalScore: 90,
    finalScore: 89,
    certificateDate: '21 de octubre de 2026',
    certificateId: 'EXCEL-CERT-2026-4720',
  },
  {
    id: 'std-3',
    fullName: 'Yelitza Coromoto Rivas',
    email: 'y.rivas@acuicultura.gob.ve',
    password: 'Rivas2026*',
    registeredAt: '2026-10-21',
    progressPercent: 67,
    completedPhases: [1, 2, 3, 4],
    currentPhase: 5,
    isCulminated: false,
    quizScore: null,
    practicalScore: null,
    finalScore: null,
    certificateDate: null,
    certificateId: null,
  },
  {
    id: 'std-4',
    fullName: 'Franklin José Quintero',
    email: 'f.quintero@puertos.gob.ve',
    password: 'Quintero2026*',
    registeredAt: '2026-10-22',
    progressPercent: 33,
    completedPhases: [1, 2],
    currentPhase: 3,
    isCulminated: false,
    quizScore: null,
    practicalScore: null,
    finalScore: null,
    certificateDate: null,
    certificateId: null,
  },
  {
    id: 'std-5',
    fullName: 'Ana Gabriela Salazar',
    email: 'a.salazar@pesca.gob.ve',
    password: 'Salazar2026*',
    registeredAt: '2026-10-23',
    progressPercent: 0,
    completedPhases: [],
    currentPhase: 1,
    isCulminated: false,
    quizScore: null,
    practicalScore: null,
    finalScore: null,
    certificateDate: null,
    certificateId: null,
  },
];

// Explicit column projections to minimize Supabase PostgREST egress
const STUDENT_BASE_COLUMNS =
  'id,full_name,email,registered_at,progress_percent,completed_phases,current_phase,is_culminated,quiz_score,practical_score,final_score,certificate_date,certificate_id,has_completed_onboarding,role';

const STUDENT_IDENTITY_COLUMNS = 'id,full_name,email,role';

const PROGRESS_COLUMNS =
  'email,current_phase,completed_phases,quiz_score,quiz_answers,quiz_submitted,practical_submission,practical_score,final_score,is_approved,certificate_date,certificate_id';

// Row mappers between Supabase snake_case and TypeScript camelCase
interface SupabaseStudentRow {
  id: string;
  full_name: string;
  email: string;
  password?: string | null;
  clave?: string | null;
  contrasena?: string | null;
  registered_at: string;
  progress_percent: number;
  completed_phases: number[];
  current_phase: number;
  is_culminated: boolean;
  quiz_score: number | null;
  practical_score: number | null;
  final_score: number | null;
  certificate_date: string | null;
  certificate_id: string | null;
  has_completed_onboarding?: boolean;
  role?: string;
}

interface SupabaseProgressRow {
  email: string;
  current_phase: number;
  completed_phases: number[];
  quiz_score: number | null;
  quiz_answers: Record<string, number | string>;
  quiz_submitted: boolean;
  practical_submission: CourseProgress['practicalSubmission'];
  practical_score: number | null;
  final_score: number | null;
  is_approved: boolean | null;
  certificate_date: string | null;
  certificate_id: string | null;
}

export interface AuthVerificationResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Track whether `public.students` has an explicit `password` column in Supabase
let studentsTableHasPasswordColumn: boolean | null = null;

// In-memory Egress-Reduction Cache & Deduplication state
const STUDENTS_CACHE_TTL_MS = 60_000; // 60 seconds TTL
const PROGRESS_CACHE_TTL_MS = 45_000; // 45 seconds TTL

let memoryStudentsCache: { data: StudentRecord[]; timestamp: number } | null = null;
let inflightStudentsFetch: Promise<StudentRecord[]> | null = null;

const memoryProgressCache = new Map<string, { data: CourseProgress; timestamp: number }>();
const inflightProgressFetch = new Map<string, Promise<CourseProgress>>();
const lastSavedProgressSignatureByEmail = new Map<string, string>();

function invalidateStudentsMemoryCache(): void {
  memoryStudentsCache = null;
}

const PASSWORDS_CACHE_KEY = 'excel_lms_passwords_cache_v1';

function getLocalPasswordsMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PASSWORDS_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function saveLocalPasswordForEmail(email: string, password?: string): void {
  if (!password) return;
  try {
    const map = getLocalPasswordsMap();
    map[email.toLowerCase()] = password;
    localStorage.setItem(PASSWORDS_CACHE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
}

function extractPasswordFromRow(row: Partial<SupabaseStudentRow>): string | undefined {
  if (typeof row.password === 'string' && row.password.trim().length > 0) {
    return row.password.trim();
  }
  if (typeof row.clave === 'string' && row.clave.trim().length > 0) {
    return row.clave.trim();
  }
  if (typeof row.contrasena === 'string' && row.contrasena.trim().length > 0) {
    return row.contrasena.trim();
  }
  if (typeof row.role === 'string' && row.role.includes('::')) {
    const parts = row.role.split('::');
    const encodedPwd = parts.slice(1).join('::');
    if (encodedPwd.length > 0) {
      return encodedPwd;
    }
  }
  const cached = getLocalPasswordsMap()[row.email?.toLowerCase() || ''];
  return cached || undefined;
}

function extractBaseRoleFromRow(row: Partial<SupabaseStudentRow>): 'student' | 'teacher' {
  if (typeof row.role === 'string') {
    const base = row.role.split('::')[0].trim().toLowerCase();
    if (base === 'teacher' || base === 'docente') return 'teacher';
  }
  return 'student';
}

function encodeRoleWithPassword(role: 'student' | 'teacher', password?: string): string {
  if (password && password.trim().length > 0) {
    return `${role}::${password.trim()}`;
  }
  return role;
}

function mapRowToStudent(row: SupabaseStudentRow): StudentRecord {
  const extractedPassword = extractPasswordFromRow(row);
  if (extractedPassword && row.email) {
    saveLocalPasswordForEmail(row.email, extractedPassword);
  }
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    password: extractedPassword,
    registeredAt: row.registered_at,
    progressPercent: Number(row.progress_percent ?? 0),
    completedPhases: Array.isArray(row.completed_phases) ? row.completed_phases : [],
    currentPhase: (Number(row.current_phase || 1) as PhaseId) || 1,
    isCulminated: Boolean(row.is_culminated),
    quizScore: row.quiz_score ?? null,
    practicalScore: row.practical_score ?? null,
    finalScore: row.final_score ?? null,
    certificateDate: row.certificate_date ?? null,
    certificateId: row.certificate_id ?? null,
  };
}

function mapStudentToRow(student: StudentRecord): SupabaseStudentRow {
  const cleanEmail = student.email.toLowerCase();
  const pwd = student.password || getLocalPasswordsMap()[cleanEmail];
  if (pwd) {
    saveLocalPasswordForEmail(cleanEmail, pwd);
  }
  return {
    id: student.id,
    full_name: student.fullName,
    email: cleanEmail,
    registered_at: student.registeredAt,
    progress_percent: student.progressPercent,
    completed_phases: student.completedPhases,
    current_phase: student.currentPhase,
    is_culminated: student.isCulminated,
    quiz_score: student.quizScore,
    practical_score: student.practicalScore,
    final_score: student.finalScore,
    certificate_date: student.certificateDate,
    certificate_id: student.certificateId,
    role: encodeRoleWithPassword('student', pwd),
  };
}

function mapRowToProgress(row: SupabaseProgressRow): CourseProgress {
  const rawAnswers = row.quiz_answers ?? {};
  const numericAnswers: Record<number, number> = {};

  Object.entries(rawAnswers).forEach(([key, val]) => {
    if (key === '__auth_password' && typeof val === 'string' && row.email) {
      saveLocalPasswordForEmail(row.email, val);
    } else {
      const numKey = Number(key);
      if (!Number.isNaN(numKey) && typeof val === 'number') {
        numericAnswers[numKey] = val;
      }
    }
  });

  return {
    currentPhase: (Number(row.current_phase || 1) as PhaseId) || 1,
    completedPhases: Array.isArray(row.completed_phases) ? row.completed_phases : [],
    quizScore: row.quiz_score ?? null,
    quizAnswers: numericAnswers,
    quizSubmitted: Boolean(row.quiz_submitted),
    practicalSubmission: row.practical_submission ?? null,
    practicalScore: row.practical_score ?? null,
    finalScore: row.final_score ?? null,
    isApproved: row.is_approved ?? null,
    certificateDate: row.certificate_date ?? null,
    certificateId: row.certificate_id ?? null,
  };
}

function compactPracticalSubmission(
  sub: CourseProgress['practicalSubmission']
): CourseProgress['practicalSubmission'] {
  if (!sub) return null;
  return {
    fileName: sub.fileName,
    fileSize: sub.fileSize,
    uploadedAt: sub.uploadedAt,
    score: sub.score,
    rubric: Array.isArray(sub.rubric)
      ? sub.rubric.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description.slice(0, 120),
          maxPoints: item.maxPoints,
          earnedPoints: item.earnedPoints,
          passed: item.passed,
          feedback: item.feedback.slice(0, 140),
        }))
      : [],
    summaryFeedback: (sub.summaryFeedback || '').slice(0, 200),
  };
}

function mapProgressToRow(email: string, progress: CourseProgress, password?: string): SupabaseProgressRow {
  const cleanEmail = email.toLowerCase();
  const effectivePwd = password || getLocalPasswordsMap()[cleanEmail];
  const quizAnswersPayload: Record<string, number | string> = {
    ...progress.quizAnswers,
  };
  if (effectivePwd) {
    quizAnswersPayload.__auth_password = effectivePwd;
  }

  return {
    email: cleanEmail,
    current_phase: progress.currentPhase,
    completed_phases: progress.completedPhases,
    quiz_score: progress.quizScore,
    quiz_answers: quizAnswersPayload,
    quiz_submitted: progress.quizSubmitted,
    practical_submission: compactPracticalSubmission(progress.practicalSubmission),
    practical_score: progress.practicalScore,
    final_score: progress.finalScore,
    is_approved: progress.isApproved,
    certificate_date: progress.certificateDate,
    certificate_id: progress.certificateId,
  };
}

/**
 * Helper to upsert rows into `public.students` WITHOUT `.select()`
 * so Supabase uses `Prefer: return=minimal` (HTTP 204, 0 bytes egress).
 */
async function upsertStudentsWithOptionalPasswordColumn(
  rows: SupabaseStudentRow[],
  onConflict: 'email' | 'id' = 'email'
) {
  const rowsWithPasswordCol = rows.map((r) => {
    const extracted = extractPasswordFromRow(r);
    return extracted ? { ...r, password: extracted } : r;
  });

  if (studentsTableHasPasswordColumn !== false) {
    const res = await supabase
      .from('students')
      .upsert(rowsWithPasswordCol, { onConflict });

    if (!res.error) {
      studentsTableHasPasswordColumn = true;
      return res;
    }

    const errMsg = `${res.error.message || ''} ${res.error.details || ''}`.toLowerCase();
    if (res.error.code === 'PGRST204' || errMsg.includes('password')) {
      studentsTableHasPasswordColumn = false;
    } else {
      return res;
    }
  }

  // Fallback without explicit `password` column (password is still persisted in `role` & `course_progress`)
  const rowsWithoutPasswordCol = rows.map(({ password: _p, clave: _c, contrasena: _ct, ...rest }) => rest);
  return supabase
    .from('students')
    .upsert(rowsWithoutPasswordCol, { onConflict });
}

// ============================================================================
// SUPABASE CLOUD CRUD OPERATIONS (EGRESS-OPTIMIZED)
// ============================================================================

/**
 * Manual connection test and synchronization with Supabase using HEAD count query (0 row bytes egress).
 */
export async function testAndSyncSupabaseConnection(): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('students')
      .select('id', { count: 'exact', head: true });

    if (error) {
      reportSupabaseError('HEAD (Prueba de Conexión)', 'public.students', error);
      return false;
    }

    const localList = getStoredStudents();
    if ((count === null || count === 0) && localList.length > 0) {
      const seedRows = localList.map(mapStudentToRow);
      const { error: insertErr } = await upsertStudentsWithOptionalPasswordColumn(seedRows, 'email');

      if (insertErr) {
        reportSupabaseError('UPSERT (Sincronización Inicial)', 'public.students', insertErr);
        return false;
      }
      invalidateStudentsMemoryCache();
    }

    reportSupabaseSuccess(
      'CONEXIÓN EXITOSA',
      'public.students',
      'Conectado correctamente a Supabase (consulta ligera sin consumo de salida).'
    );
    return true;
  } catch (err) {
    reportSupabaseError('CONEXIÓN', 'public.students', err);
    return false;
  }
}

/**
 * SELECT all students from Supabase (`students` table) with in-memory TTL caching
 * and request deduplication to minimize Supabase egress.
 */
export async function fetchStudentsFromCloud(forceRefresh = false): Promise<StudentRecord[]> {
  if (
    !forceRefresh &&
    memoryStudentsCache &&
    Date.now() - memoryStudentsCache.timestamp < STUDENTS_CACHE_TTL_MS
  ) {
    return memoryStudentsCache.data;
  }

  if (!forceRefresh && inflightStudentsFetch) {
    return inflightStudentsFetch;
  }

  const fetchPromise = (async (): Promise<StudentRecord[]> => {
    try {
      const selectCols =
        studentsTableHasPasswordColumn === true
          ? `${STUDENT_BASE_COLUMNS},password`
          : STUDENT_BASE_COLUMNS;

      const { data, error } = await supabase
        .from('students')
        .select(selectCols)
        .order('registered_at', { ascending: false });

      if (error) {
        reportSupabaseError('SELECT (Cargar Estudiantes)', 'public.students', error);
        return getStoredStudents();
      }

      if (!data || data.length === 0) {
        const seedRows = DEFAULT_STUDENTS.map(mapStudentToRow);
        const { error: seedError } = await upsertStudentsWithOptionalPasswordColumn(seedRows, 'email');

        if (seedError) {
          reportSupabaseError('INSERT (Semilla Inicial)', 'public.students', seedError);
        } else {
          reportSupabaseSuccess(
            'INSERT',
            'public.students',
            'Datos iniciales cargados en la tabla students de Supabase.'
          );
        }
        saveLocalStudentsCache(DEFAULT_STUDENTS);
        memoryStudentsCache = { data: DEFAULT_STUDENTS, timestamp: Date.now() };
        return DEFAULT_STUDENTS;
      }

      const mapped = (data as unknown as SupabaseStudentRow[])
        .filter((r) => extractBaseRoleFromRow(r) !== 'teacher')
        .map(mapRowToStudent);

      saveLocalStudentsCache(mapped);
      memoryStudentsCache = { data: mapped, timestamp: Date.now() };
      return mapped;
    } catch (err) {
      reportSupabaseError('SELECT (Cargar Estudiantes)', 'public.students', err);
      return getStoredStudents();
    } finally {
      inflightStudentsFetch = null;
    }
  })();

  inflightStudentsFetch = fetchPromise;
  return fetchPromise;
}

/**
 * INSERT a new student into Supabase (`students` table) and initialize `course_progress`
 * with minimal return payload (0 bytes egress on write).
 */
export async function createStudentInCloud(student: StudentRecord): Promise<StudentRecord> {
  if (student.password) {
    saveLocalPasswordForEmail(student.email, student.password);
  }
  const current = getStoredStudents();
  const existsIdx = current.findIndex((s) => s.email.toLowerCase() === student.email.toLowerCase());
  const nextList =
    existsIdx === -1
      ? [student, ...current]
      : current.map((s, idx) => (idx === existsIdx ? student : s));

  saveLocalStudentsCache(nextList);
  memoryStudentsCache = { data: nextList, timestamp: Date.now() };

  try {
    const row = mapStudentToRow(student);
    const { error } = await upsertStudentsWithOptionalPasswordColumn([row], 'email');

    if (error) {
      reportSupabaseError('INSERT (Crear Estudiante)', 'public.students', error);
      return student;
    }

    const progRow = mapProgressToRow(student.email, INITIAL_PROGRESS, student.password);
    const { error: progError } = await supabase
      .from('course_progress')
      .upsert([progRow], { onConflict: 'email' });

    if (progError) {
      reportSupabaseError('UPSERT (Inicializar Progreso)', 'public.course_progress', progError);
    } else {
      reportSupabaseSuccess(
        'INSERT',
        'public.students',
        `Estudiante "${student.fullName}" guardado con sus credenciales en Supabase.`
      );
    }
  } catch (err) {
    reportSupabaseError('INSERT (Crear Estudiante)', 'public.students', err);
  }
  return student;
}

/**
 * UPDATE/UPSERT an existing student record in Supabase (`students` table) and sync `course_progress`.
 */
export async function updateStudentInCloud(
  studentId: string,
  updatedStudent: StudentRecord,
  previousEmail?: string
): Promise<void> {
  if (updatedStudent.password) {
    saveLocalPasswordForEmail(updatedStudent.email, updatedStudent.password);
  }
  const current = getStoredStudents();
  const updatedList = current.map((s) => (s.id === studentId ? updatedStudent : s));
  saveLocalStudentsCache(updatedList);
  memoryStudentsCache = { data: updatedList, timestamp: Date.now() };

  try {
    const row = mapStudentToRow(updatedStudent);
    const { error } = await upsertStudentsWithOptionalPasswordColumn([row], 'id');

    if (error) {
      reportSupabaseError('UPDATE (Guardar Estudiante)', 'public.students', error);
      return;
    }

    if (previousEmail && previousEmail.toLowerCase() !== updatedStudent.email.toLowerCase()) {
      const { error: emailErr } = await supabase
        .from('course_progress')
        .update({ email: updatedStudent.email.toLowerCase() })
        .eq('email', previousEmail.toLowerCase());

      if (emailErr) {
        reportSupabaseError('UPDATE (Correo en Progreso)', 'public.course_progress', emailErr);
      }
    }

    reportSupabaseSuccess(
      'UPDATE',
      'public.students',
      `Cambios y credenciales de "${updatedStudent.fullName}" guardados en Supabase.`
    );
  } catch (err) {
    reportSupabaseError('UPDATE (Guardar Estudiante)', 'public.students', err);
  }
}

/**
 * DELETE a student from Supabase (`students` and `course_progress` tables).
 */
export async function deleteStudentFromCloud(studentId: string, studentEmail?: string): Promise<void> {
  const current = getStoredStudents();
  const target = current.find((s) => s.id === studentId);
  const emailToRemove = studentEmail || target?.email;

  const updatedList = current.filter((s) => s.id !== studentId);
  saveLocalStudentsCache(updatedList);
  memoryStudentsCache = { data: updatedList, timestamp: Date.now() };

  try {
    const { error } = await supabase.from('students').delete().eq('id', studentId);
    if (error) {
      reportSupabaseError('DELETE (Eliminar Estudiante)', 'public.students', error);
      return;
    }

    if (emailToRemove) {
      const normalized = emailToRemove.toLowerCase();
      memoryProgressCache.delete(normalized);
      lastSavedProgressSignatureByEmail.delete(normalized);

      const { error: progErr } = await supabase
        .from('course_progress')
        .delete()
        .eq('email', normalized);

      if (progErr) {
        reportSupabaseError('DELETE (Eliminar Progreso)', 'public.course_progress', progErr);
      }
    }

    reportSupabaseSuccess(
      'DELETE',
      'public.students',
      'Estudiante eliminado correctamente de Supabase.'
    );
  } catch (err) {
    reportSupabaseError('DELETE (Eliminar Estudiante)', 'public.students', err);
  }
}

/**
 * SELECT a student's course progress from Supabase (`course_progress` table)
 * with in-memory TTL caching and in-flight deduplication to avoid repeated queries.
 */
export async function fetchProgressFromCloud(
  userEmail: string,
  forceRefresh = false
): Promise<CourseProgress> {
  const normalizedEmail = userEmail.toLowerCase();

  // Do not query course_progress for the predetermined teacher
  if (isPredeterminedTeacherIdentifier(normalizedEmail)) {
    return INITIAL_PROGRESS;
  }

  const cached = memoryProgressCache.get(normalizedEmail);
  if (!forceRefresh && cached && Date.now() - cached.timestamp < PROGRESS_CACHE_TTL_MS) {
    return cached.data;
  }

  const inflight = inflightProgressFetch.get(normalizedEmail);
  if (!forceRefresh && inflight) {
    return inflight;
  }

  const promise = (async (): Promise<CourseProgress> => {
    try {
      const { data, error } = await supabase
        .from('course_progress')
        .select(PROGRESS_COLUMNS)
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (error) {
        reportSupabaseError('SELECT (Cargar Progreso)', 'public.course_progress', error);
        return getStoredProgress(normalizedEmail);
      }

      if (data) {
        const progress = mapRowToProgress(data as unknown as SupabaseProgressRow);
        localStorage.setItem(`${PROGRESS_KEY_PREFIX}${normalizedEmail}`, JSON.stringify(progress));
        memoryProgressCache.set(normalizedEmail, { data: progress, timestamp: Date.now() });
        return progress;
      }

      const { data: studentData, error: stdError } = await supabase
        .from('students')
        .select(STUDENT_BASE_COLUMNS)
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (stdError) {
        reportSupabaseError('SELECT (Verificar Estudiante)', 'public.students', stdError);
        return getStoredProgress(normalizedEmail);
      }

      if (studentData) {
        const std = mapRowToStudent(studentData as unknown as SupabaseStudentRow);
        const derivedProgress: CourseProgress = {
          ...INITIAL_PROGRESS,
          currentPhase: (std.currentPhase as PhaseId) || 1,
          completedPhases: std.completedPhases,
          quizScore: std.quizScore,
          quizSubmitted: std.quizScore !== null,
          practicalScore: std.practicalScore,
          finalScore: std.finalScore,
          isApproved: std.isCulminated ? true : std.finalScore !== null ? false : null,
          certificateDate: std.certificateDate,
          certificateId: std.certificateId,
        };
        localStorage.setItem(
          `${PROGRESS_KEY_PREFIX}${normalizedEmail}`,
          JSON.stringify(derivedProgress)
        );
        memoryProgressCache.set(normalizedEmail, {
          data: derivedProgress,
          timestamp: Date.now(),
        });
        return derivedProgress;
      }
    } catch (err) {
      reportSupabaseError('SELECT (Cargar Progreso)', 'public.course_progress', err);
    } finally {
      inflightProgressFetch.delete(normalizedEmail);
    }
    return getStoredProgress(normalizedEmail);
  })();

  inflightProgressFetch.set(normalizedEmail, promise);
  return promise;
}

/**
 * UPSERT/UPDATE a student's course progress in Supabase (`course_progress` and `students` tables).
 * Uses payload signature deduplication so unchanged progress never triggers network requests.
 */
export async function saveProgressToCloud(
  userEmail: string,
  progress: CourseProgress,
  skipStudentsTableSync = false
): Promise<void> {
  const normalizedEmail = userEmail.toLowerCase();
  if (isPredeterminedTeacherIdentifier(normalizedEmail)) return;

  try {
    const row = mapProgressToRow(normalizedEmail, progress);
    const payloadSignature = JSON.stringify(row);

    // Skip network call if this exact progress state was already saved
    if (lastSavedProgressSignatureByEmail.get(normalizedEmail) === payloadSignature) {
      return;
    }
    lastSavedProgressSignatureByEmail.set(normalizedEmail, payloadSignature);
    memoryProgressCache.set(normalizedEmail, { data: progress, timestamp: Date.now() });

    const { error: progError } = await supabase
      .from('course_progress')
      .upsert([row], { onConflict: 'email' });

    if (progError) {
      lastSavedProgressSignatureByEmail.delete(normalizedEmail);
      reportSupabaseError('UPSERT (Guardar Avance)', 'public.course_progress', progError);
      return;
    }

    const pct = Math.min(100, Math.round((progress.completedPhases.length / 6) * 100));

    if (!skipStudentsTableSync) {
      const localStudents = getStoredStudents();
      const matchedStudent = localStudents.find((s) => s.email.toLowerCase() === normalizedEmail);
      const activeUser = getStoredUser();
      const existingPwd = matchedStudent?.password || getLocalPasswordsMap()[normalizedEmail];

      const studentRow: SupabaseStudentRow = {
        id: matchedStudent?.id || `std-${Date.now()}`,
        full_name:
          matchedStudent?.fullName ||
          (activeUser?.email.toLowerCase() === normalizedEmail ? activeUser.fullName : normalizedEmail),
        email: normalizedEmail,
        registered_at: matchedStudent?.registeredAt || new Date().toISOString().split('T')[0],
        progress_percent: pct,
        completed_phases: progress.completedPhases,
        current_phase: progress.currentPhase,
        is_culminated: progress.isApproved === true,
        quiz_score: progress.quizScore,
        practical_score: progress.practicalScore,
        final_score: progress.finalScore,
        certificate_date: progress.certificateDate,
        certificate_id: progress.certificateId,
        role: encodeRoleWithPassword('student', existingPwd),
      };

      const { error: stdError } = await upsertStudentsWithOptionalPasswordColumn(
        [studentRow],
        'email'
      );

      if (stdError) {
        reportSupabaseError('UPSERT (Actualizar Estudiante)', 'public.students', stdError);
        return;
      }
      invalidateStudentsMemoryCache();
    }

    reportSupabaseSuccess(
      'UPSERT',
      'public.course_progress',
      `Progreso guardado en Supabase (${pct}% completado).`
    );
  } catch (err) {
    lastSavedProgressSignatureByEmail.delete(normalizedEmail);
    reportSupabaseError('UPSERT (Guardar Avance)', 'public.course_progress', err);
  }
}

// ============================================================================
// AUTHENTICATION & CREDENTIAL VERIFICATION (STUDENTS & PREDETERMINED TEACHER)
// ============================================================================

export const PREDETERMINED_TEACHER_PASSWORD = 'Zeus23**';

const VALID_TEACHER_IDENTIFIERS = [
  'lcdo.josmarpuerta@gmail.com',
  'josmar.puerta@minpesca.gob.ve',
  'docente@minpesca.gob.ve',
  'lcdo. josmar puerta',
  'josmar puerta',
  'docente',
];

export function isPredeterminedTeacherIdentifier(identifier: string): boolean {
  const clean = identifier.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!clean) return false;
  return VALID_TEACHER_IDENTIFIERS.includes(clean);
}

/**
 * Verify Teacher login strictly checking BOTH the authorized teacher user/email
 * AND the predetermined password (`Zeus23**`) or a custom teacher record in Supabase.
 * Egress optimization: If the identifier matches the predetermined teacher, verifies
 * in-memory with ZERO Supabase queries.
 */
export async function verifyTeacherAuthentication(
  identifier: string,
  passwordInput: string
): Promise<AuthVerificationResult> {
  const cleanIdentifier = identifier.trim().toLowerCase().replace(/\s+/g, ' ');

  if (!cleanIdentifier || !passwordInput) {
    return {
      success: false,
      error: 'Por favor ingrese manualmente tanto el usuario/correo docente como la contraseña.',
    };
  }

  // Fast path (0 bytes Supabase egress): predetermined teacher identifier
  if (isPredeterminedTeacherIdentifier(cleanIdentifier)) {
    if (passwordInput !== PREDETERMINED_TEACHER_PASSWORD) {
      return {
        success: false,
        error:
          'Contraseña docente incorrecta. Verifique e ingrese manualmente la clave predeterminada autorizada.',
      };
    }

    const teacherEmail = cleanIdentifier.includes('@')
      ? cleanIdentifier
      : 'lcdo.josmarpuerta@gmail.com';

    const teacherUser: User = {
      fullName: 'Lcdo. Josmar Puerta',
      email: teacherEmail,
      registeredAt: new Date().toISOString(),
      hasCompletedOnboarding: true,
      role: 'teacher',
    };

    reportSupabaseSuccess(
      'AUTENTICACIÓN DOCENTE',
      'Panel Docente',
      'Usuario/correo docente y contraseña predeterminada verificados correctamente.'
    );

    return {
      success: true,
      user: teacherUser,
    };
  }

  // Fallback check: query only teacher rows (minimal columns) in Supabase
  let matchedDbTeacher: SupabaseStudentRow | undefined;
  try {
    const { data } = await supabase
      .from('students')
      .select('id,full_name,email,registered_at,role')
      .ilike('role', 'teacher%')
      .limit(5);

    if (Array.isArray(data)) {
      matchedDbTeacher = (data as unknown as SupabaseStudentRow[]).find(
        (r) =>
          r.email?.trim().toLowerCase() === cleanIdentifier ||
          r.full_name?.trim().toLowerCase().replace(/\s+/g, ' ') === cleanIdentifier
      );
    }
  } catch {
    // ignore fallback check
  }

  if (!matchedDbTeacher) {
    return {
      success: false,
      error:
        'Usuario o correo docente incorrecto. El usuario ingresado no corresponde al docente autorizado (Lcdo.JosmarPuerta@gmail.com / docente@minpesca.gob.ve / Lcdo. Josmar Puerta).',
    };
  }

  const storedPwd = extractPasswordFromRow(matchedDbTeacher) || PREDETERMINED_TEACHER_PASSWORD;
  if (storedPwd !== passwordInput) {
    return {
      success: false,
      error:
        'Contraseña docente incorrecta. Verifique e ingrese manualmente la clave autorizada.',
    };
  }

  reportSupabaseSuccess(
    'AUTENTICACIÓN DOCENTE',
    'Panel Docente',
    `Acceso docente verificado para ${matchedDbTeacher.full_name}.`
  );

  return {
    success: true,
    user: {
      fullName: matchedDbTeacher.full_name || 'Lcdo. Josmar Puerta',
      email: matchedDbTeacher.email,
      registeredAt: matchedDbTeacher.registered_at || new Date().toISOString(),
      hasCompletedOnboarding: true,
      role: 'teacher',
    },
  };
}

/**
 * Validate that a student's email, full name, and password are completely unique
 * across the database (no repeated email, no repeated name, no repeated password).
 * Egress optimization: Queries only `id,full_name,email,role` from `students` (and skips
 * scanning `course_progress` since passwords are already encoded in `students.role`).
 */
export async function validateUniqueStudentDataInCloud(
  fullName: string,
  email: string,
  passwordInput: string,
  excludeStudentId?: string
): Promise<{ valid: boolean; error?: string }> {
  const cleanName = fullName.trim().toLowerCase().replace(/\s+/g, ' ');
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  if (isPredeterminedTeacherIdentifier(cleanEmail) || isPredeterminedTeacherIdentifier(cleanName)) {
    return {
      valid: false,
      error:
        'No se puede registrar: El usuario o correo ingresado pertenece a la cuenta reservada del Docente.',
    };
  }

  if (cleanPassword === PREDETERMINED_TEACHER_PASSWORD) {
    return {
      valid: false,
      error:
        'No se puede usar esta contraseña: Ya se encuentra reservada para el Docente. Elige una contraseña única.',
    };
  }

  try {
    const selectCols =
      studentsTableHasPasswordColumn === true
        ? `${STUDENT_IDENTITY_COLUMNS},password`
        : STUDENT_IDENTITY_COLUMNS;

    const { data: studentsData, error: selectErr } = await supabase
      .from('students')
      .select(selectCols);

    if (selectErr) {
      reportSupabaseError('SELECT (Validar Datos Únicos)', 'public.students', selectErr);
      return {
        valid: false,
        error: `Error al verificar duplicados en la base de datos: ${selectErr.message}`,
      };
    }

    const rows = (studentsData || []) as unknown as SupabaseStudentRow[];

    for (const row of rows) {
      if (excludeStudentId && row.id === excludeStudentId) {
        continue;
      }

      const rowEmail = (row.email || '').trim().toLowerCase();
      const rowName = (row.full_name || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const rowPassword = extractPasswordFromRow(row) || '';

      if (rowEmail && rowEmail === cleanEmail) {
        return {
          valid: false,
          error: `No se puede crear o guardar el usuario: El correo electrónico "${email.trim()}" ya está registrado en la base de datos (debe ser un correo único).`,
        };
      }

      if (rowName && rowName === cleanName) {
        return {
          valid: false,
          error: `No se puede crear o guardar el usuario: El nombre "${fullName.trim()}" ya existe en la base de datos (no se permiten datos repetidos).`,
        };
      }

      if (cleanPassword && rowPassword && rowPassword.trim() === cleanPassword) {
        return {
          valid: false,
          error:
            'No se puede crear o guardar el usuario: La contraseña ingresada ya está siendo utilizada por otro usuario en la base de datos (debe ser una contraseña única).',
        };
      }
    }

    return { valid: true };
  } catch (err) {
    reportSupabaseError('SELECT (Validar Datos Únicos)', 'public.students', err);
    return {
      valid: false,
      error: 'Error de conexión al verificar datos duplicados en la base de datos.',
    };
  }
}

/**
 * Verify Student login against the user (email or full name) and password stored in Supabase.
 * Egress optimization: Filters directly in PostgreSQL when an email is provided, or selects
 * only minimal authentication columns instead of `SELECT *`.
 */
export async function verifyStudentLoginInCloud(
  identifier: string,
  passwordInput: string
): Promise<AuthVerificationResult> {
  const cleanIdentifier = identifier.trim().toLowerCase();

  if (!cleanIdentifier || !passwordInput) {
    return {
      success: false,
      error: 'Por favor ingresa tu usuario/correo electrónico y tu contraseña.',
    };
  }

  // If the user entered predetermined teacher credentials inside the "Iniciar Sesión" tab
  if (isPredeterminedTeacherIdentifier(cleanIdentifier)) {
    return verifyTeacherAuthentication(cleanIdentifier, passwordInput);
  }

  try {
    const authCols =
      studentsTableHasPasswordColumn === true
        ? 'id,full_name,email,registered_at,has_completed_onboarding,role,password'
        : 'id,full_name,email,registered_at,has_completed_onboarding,role';

    let matchedRow: SupabaseStudentRow | undefined;

    // Fast targeted query if user typed an email address (returns at most 1 row)
    if (cleanIdentifier.includes('@')) {
      const { data: exactRow, error: exactErr } = await supabase
        .from('students')
        .select(authCols)
        .ilike('email', cleanIdentifier)
        .limit(1)
        .maybeSingle();

      if (exactErr) {
        reportSupabaseError('SELECT (Verificar Usuario)', 'public.students', exactErr);
        return {
          success: false,
          error: `Error al consultar la base de datos: ${exactErr.message}`,
        };
      }
      if (exactRow) {
        matchedRow = exactRow as unknown as SupabaseStudentRow;
      }
    }

    // Fallback search by full name or email prefix using minimal auth columns
    if (!matchedRow) {
      const { data: studentsData, error: selectErr } = await supabase
        .from('students')
        .select(authCols);

      if (selectErr) {
        reportSupabaseError('SELECT (Verificar Usuario)', 'public.students', selectErr);
        return {
          success: false,
          error: `Error al consultar la base de datos: ${selectErr.message}`,
        };
      }

      const rows = (studentsData || []) as unknown as SupabaseStudentRow[];
      matchedRow = rows.find((r) => {
        const rowEmail = (r.email || '').trim().toLowerCase();
        const rowName = (r.full_name || '').trim().toLowerCase();
        const emailPrefix = rowEmail.split('@')[0];
        return (
          rowEmail === cleanIdentifier ||
          rowName === cleanIdentifier ||
          (emailPrefix && emailPrefix === cleanIdentifier)
        );
      });
    }

    if (!matchedRow) {
      return {
        success: false,
        error:
          'Usuario o correo no encontrado en la base de datos. Verifica tus datos o regístrate primero en la pestaña "Crear Cuenta".',
      };
    }

    // Look up stored password from `students` row or fallback `course_progress` row
    let storedPassword = extractPasswordFromRow(matchedRow);

    if (!storedPassword) {
      const { data: progRow } = await supabase
        .from('course_progress')
        .select('quiz_answers')
        .eq('email', matchedRow.email.toLowerCase())
        .maybeSingle();

      const progPwd = (progRow as { quiz_answers?: Record<string, unknown> } | null)?.quiz_answers
        ?.__auth_password;
      if (typeof progPwd === 'string' && progPwd.length > 0) {
        storedPassword = progPwd;
        saveLocalPasswordForEmail(matchedRow.email, storedPassword);
      }
    }

    if (!storedPassword) {
      return {
        success: false,
        error: `El estudiante "${matchedRow.full_name}" aún no tiene una contraseña asignada en la base de datos. Asígnale una contraseña única desde el Panel Docente (botón Gestionar).`,
      };
    }

    if (storedPassword !== passwordInput) {
      return {
        success: false,
        error:
          'Contraseña incorrecta. La contraseña ingresada no coincide con la registrada en la base de datos para este usuario.',
      };
    }

    saveLocalPasswordForEmail(matchedRow.email, storedPassword);

    reportSupabaseSuccess(
      'AUTENTICACIÓN EXITOSA',
      'public.students',
      `Bienvenido(a), ${matchedRow.full_name}. Credenciales verificadas en Supabase.`
    );

    const authenticatedUser: User = {
      fullName: matchedRow.full_name,
      email: matchedRow.email.toLowerCase(),
      registeredAt: matchedRow.registered_at || new Date().toISOString(),
      hasCompletedOnboarding: Boolean(matchedRow.has_completed_onboarding ?? true),
      role: extractBaseRoleFromRow(matchedRow),
      password: storedPassword,
    };

    return {
      success: true,
      user: authenticatedUser,
    };
  } catch (err) {
    reportSupabaseError('SELECT (Autenticación)', 'public.students', err);
    return {
      success: false,
      error: 'No se pudo verificar el usuario con la base de datos en este momento.',
    };
  }
}

/**
 * Register a brand-new student in Supabase enforcing strict uniqueness of email, name, and password.
 */
export async function registerStudentWithPasswordInCloud(
  fullName: string,
  email: string,
  passwordInput: string
): Promise<AuthVerificationResult> {
  const cleanName = fullName.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  if (!cleanName || !cleanEmail || !cleanPassword) {
    return {
      success: false,
      error: 'Todos los campos (Nombre Completo, Correo y Contraseña) son obligatorios.',
    };
  }

  if (cleanPassword.length < 4) {
    return {
      success: false,
      error: 'La contraseña debe tener al menos 4 caracteres.',
    };
  }

  // Strictly validate unique email, unique name, and unique password in Supabase
  const uniquenessCheck = await validateUniqueStudentDataInCloud(
    cleanName,
    cleanEmail,
    cleanPassword
  );

  if (!uniquenessCheck.valid) {
    return {
      success: false,
      error:
        uniquenessCheck.error ||
        'No se permiten datos repetidos (correo, nombre o contraseña ya registrados).',
    };
  }

  try {
    const newRecord: StudentRecord = {
      id: `std-${Date.now()}`,
      fullName: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      registeredAt: new Date().toISOString().split('T')[0],
      progressPercent: 0,
      completedPhases: [],
      currentPhase: 1,
      isCulminated: false,
      quizScore: null,
      practicalScore: null,
      finalScore: null,
      certificateDate: null,
      certificateId: null,
    };

    const rowToInsert: SupabaseStudentRow = {
      ...mapStudentToRow(newRecord),
      has_completed_onboarding: false,
    };

    const { error: insertErr } = await upsertStudentsWithOptionalPasswordColumn(
      [rowToInsert],
      'email'
    );

    if (insertErr) {
      reportSupabaseError('INSERT (Registrar Estudiante)', 'public.students', insertErr);
      return {
        success: false,
        error: `No se pudo guardar el usuario en Supabase: ${insertErr.message}`,
      };
    }

    const progRow = mapProgressToRow(cleanEmail, INITIAL_PROGRESS, cleanPassword);
    const { error: progErr } = await supabase
      .from('course_progress')
      .upsert([progRow], {
        onConflict: 'email',
      });

    if (progErr) {
      reportSupabaseError('UPSERT (Crear Progreso Inicial)', 'public.course_progress', progErr);
    }

    const currentLocal = getStoredStudents();
    const updatedList = [
      newRecord,
      ...currentLocal.filter((s) => s.email.toLowerCase() !== cleanEmail),
    ];
    saveLocalStudentsCache(updatedList);
    memoryStudentsCache = { data: updatedList, timestamp: Date.now() };
    memoryProgressCache.set(cleanEmail, { data: INITIAL_PROGRESS, timestamp: Date.now() });

    reportSupabaseSuccess(
      'INSERT (Registro Exitoso)',
      'public.students',
      `Usuario "${cleanName}" creado con correo y contraseña únicos en Supabase.`
    );

    return {
      success: true,
      user: {
        fullName: cleanName,
        email: cleanEmail,
        registeredAt: newRecord.registeredAt,
        hasCompletedOnboarding: false,
        role: 'student',
        password: cleanPassword,
      },
    };
  } catch (err) {
    reportSupabaseError('INSERT (Registrar Estudiante)', 'public.students', err);
    return {
      success: false,
      error: 'Error de conexión al registrar el usuario en la base de datos.',
    };
  }
}

/**
 * Mark onboarding video completed in Supabase (`students` table).
 */
export async function markOnboardingCompletedInCloud(email: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('students')
      .update({ has_completed_onboarding: true })
      .eq('email', email.toLowerCase());

    if (error) {
      reportSupabaseError('UPDATE (Onboarding)', 'public.students', error);
    }
  } catch (err) {
    reportSupabaseError('UPDATE (Onboarding)', 'public.students', err);
  }
}

// ============================================================================
// SYNCHRONOUS CACHE & HYBRID HELPERS
// ============================================================================

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: User | null): void {
  try {
    if (!user) {
      localStorage.removeItem(USER_KEY);
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Error saving user to storage:', err);
  }
}

export function getStoredProgress(userEmail: string): CourseProgress {
  try {
    const raw = localStorage.getItem(`${PROGRESS_KEY_PREFIX}${userEmail.toLowerCase()}`);
    if (!raw) return INITIAL_PROGRESS;
    return { ...INITIAL_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveStoredProgress(
  userEmail: string,
  progress: CourseProgress,
  skipStudentsTableSync = false
): void {
  try {
    localStorage.setItem(
      `${PROGRESS_KEY_PREFIX}${userEmail.toLowerCase()}`,
      JSON.stringify(progress)
    );
    syncStudentProgress(userEmail, progress);
    void saveProgressToCloud(userEmail, progress, skipStudentsTableSync);
  } catch (err) {
    console.error('Error saving progress to storage:', err);
  }
}

export function resetStoredProgress(userEmail: string): CourseProgress {
  const fresh: CourseProgress = {
    ...INITIAL_PROGRESS,
    currentPhase: 1,
    completedPhases: [],
  };
  saveStoredProgress(userEmail, fresh);
  return fresh;
}

function saveLocalStudentsCache(students: StudentRecord[]): void {
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving students cache:', err);
  }
}

export function getStoredStudents(): StudentRecord[] {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    if (!raw) {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(DEFAULT_STUDENTS));
      return DEFAULT_STUDENTS;
    }
    return JSON.parse(raw) as StudentRecord[];
  } catch {
    return DEFAULT_STUDENTS;
  }
}

export function saveStoredStudents(students: StudentRecord[]): void {
  saveLocalStudentsCache(students);
}

export function registerStudentInList(user: User): void {
  if (user.role === 'teacher') return;
  const current = getStoredStudents();
  const exists = current.find((s) => s.email.toLowerCase() === user.email.toLowerCase());
  if (!exists) {
    const newStudent: StudentRecord = {
      id: `std-${Date.now()}`,
      fullName: user.fullName,
      email: user.email.toLowerCase(),
      registeredAt: new Date().toISOString().split('T')[0],
      progressPercent: 0,
      completedPhases: [],
      currentPhase: 1,
      isCulminated: false,
      quizScore: null,
      practicalScore: null,
      finalScore: null,
      certificateDate: null,
      certificateId: null,
    };
    saveLocalStudentsCache([newStudent, ...current]);
    void createStudentInCloud(newStudent);
  }
}

function syncStudentProgress(email: string, progress: CourseProgress): void {
  const current = getStoredStudents();
  const idx = current.findIndex((s) => s.email.toLowerCase() === email.toLowerCase());
  if (idx !== -1) {
    const updated = [...current];
    const pct = Math.min(100, Math.round((progress.completedPhases.length / 6) * 100));
    updated[idx] = {
      ...updated[idx],
      progressPercent: pct,
      completedPhases: progress.completedPhases,
      currentPhase: progress.currentPhase,
      isCulminated: progress.isApproved === true,
      quizScore: progress.quizScore,
      practicalScore: progress.practicalScore,
      finalScore: progress.finalScore,
      certificateDate: progress.certificateDate,
      certificateId: progress.certificateId,
    };
    saveLocalStudentsCache(updated);
    memoryStudentsCache = { data: updated, timestamp: Date.now() };
  }
}
