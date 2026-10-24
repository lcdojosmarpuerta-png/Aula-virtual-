import { User, CourseProgress, StudentRecord } from '../types/course';

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

// Default seed students for the Teacher Dashboard demonstration
export const DEFAULT_STUDENTS: StudentRecord[] = [
  {
    id: 'std-1',
    fullName: 'María Elena Delgado Gómez',
    email: 'm.delgado@minpesca.gob.ve',
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

export function saveStoredProgress(userEmail: string, progress: CourseProgress): void {
  try {
    localStorage.setItem(
      `${PROGRESS_KEY_PREFIX}${userEmail.toLowerCase()}`,
      JSON.stringify(progress)
    );
    // Also sync with student list
    syncStudentProgress(userEmail, progress);
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

// Student records storage for Teacher Dashboard
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
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving students:', err);
  }
}

export function registerStudentInList(user: User): void {
  if (user.role === 'teacher') return;
  const current = getStoredStudents();
  const exists = current.find((s) => s.email.toLowerCase() === user.email.toLowerCase());
  if (!exists) {
    const newStudent: StudentRecord = {
      id: `std-${Date.now()}`,
      fullName: user.fullName,
      email: user.email,
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
    saveStoredStudents([newStudent, ...current]);
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
    saveStoredStudents(updated);
  }
}
