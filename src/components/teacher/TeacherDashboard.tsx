import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { User, StudentRecord, PhaseId } from '../../types/course';
import { getStoredStudents, saveStoredStudents, saveStoredProgress, getStoredProgress } from '../../utils/storage';
import { BatchCertificatesModal } from '../certificate/BatchCertificatesModal';
import {
  Users,
  UserCheck,
  Clock,
  Search,
  Printer,
  PlusCircle,
  FileSpreadsheet,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  Download,
  Layers,
  SlidersHorizontal,
  Trash2,
  Award,
  Check,
} from 'lucide-react';

interface TeacherDashboardProps {
  teacher: User;
  onLogout: () => void;
  onSwitchToStudentMode: () => void;
  onViewStudentCertificate: (student: StudentRecord) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onSwitchToStudentMode,
  onViewStudentCertificate,
}) => {
  const [students, setStudents] = useState<StudentRecord[]>(() => getStoredStudents());
  const [filterStatus, setFilterStatus] = useState<'all' | 'culminated' | 'in_progress' | 'not_started'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchCertsModal, setShowBatchCertsModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [exportSuccessToast, setExportSuccessToast] = useState<string | null>(null);

  // New Student Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');

  // Edit Student Form State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCompletedPhases, setEditCompletedPhases] = useState<number[]>([]);
  const [editQuizScore, setEditQuizScore] = useState<number>(90);
  const [editPracticalScore, setEditPracticalScore] = useState<number>(90);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Calculations
  const totalEnrolled = students.length;
  const totalCulminated = students.filter((s) => s.isCulminated).length;
  const totalInProgress = students.filter((s) => !s.isCulminated && s.progressPercent > 0).length;
  const totalNotStarted = students.filter((s) => s.progressPercent === 0).length;

  const finishedGrades = students
    .filter((s) => s.finalScore !== null)
    .map((s) => s.finalScore as number);
  const avgGrade =
    finishedGrades.length > 0
      ? Math.round(finishedGrades.reduce((a, b) => a + b, 0) / finishedGrades.length)
      : 0;

  // Filtered students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.certificateId && student.certificateId.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'culminated') return student.isCulminated;
    if (filterStatus === 'in_progress') return !student.isCulminated && student.progressPercent > 0;
    if (filterStatus === 'not_started') return student.progressPercent === 0;
    return true;
  });

  // Export Roster & Academic Report to native .xlsx (SheetJS)
  const handleExportToExcel = (onlyFiltered = false) => {
    const targetList = onlyFiltered ? filteredStudents : students;

    const rosterRows = targetList.map((std, idx) => ({
      'N°': idx + 1,
      'Nombre y Apellido': std.fullName,
      'Correo Electrónico': std.email,
      'Fecha de Inscripción': std.registeredAt,
      '% de Avance': `${std.progressPercent}%`,
      'Fases Completadas': `${std.completedPhases.length}/6`,
      'Detalle de Fases':
        std.completedPhases.length > 0
          ? std.completedPhases.sort((a, b) => a - b).map((p) => `Fase ${p}`).join(', ')
          : 'Ninguna',
      'Estado Académico': std.isCulminated
        ? 'CULMINADO (APROBADO)'
        : std.progressPercent > 0
        ? 'EN PROGRESO'
        : 'NO INICIADO',
      'Nota Teórica (Fase 5)': std.quizScore !== null ? `${std.quizScore}%` : 'Pendiente',
      'Nota Práctica (Fase 6)': std.practicalScore !== null ? `${std.practicalScore}%` : 'Pendiente',
      'Calificación Final': std.finalScore !== null ? `${std.finalScore}%` : 'Pendiente',
      'Código de Certificado': std.certificateId || 'No emitido',
      'Fecha de Emisión': std.certificateDate || 'No emitido',
    }));

    const summaryRows = [
      { Indicador: 'Institución', Valor: 'Ministerio del Poder Popular de Pesca y Acuicultura (MinPesca) / FONPESCA' },
      { Indicador: 'Programa Académico', Valor: 'Curso Introductorio de Excel Básico (12 Horas Académicas)' },
      { Indicador: 'Instructor Responsable', Valor: 'Lcdo. Josmar Puerta' },
      { Indicador: 'Fecha de Generación del Reporte', Valor: new Date().toLocaleString('es-ES') },
      { Indicador: 'Total Estudiantes Inscritos', Valor: totalEnrolled },
      { Indicador: 'Estudiantes Iniciados (En Progreso)', Valor: totalInProgress },
      { Indicador: 'Estudiantes Culminados (Con Certificado)', Valor: totalCulminated },
      { Indicador: 'Estudiantes No Iniciados', Valor: totalNotStarted },
      { Indicador: 'Promedio General de Aprobados', Valor: `${avgGrade}%` },
    ];

    const workbook = XLSX.utils.book_new();

    // Sheet 1: Nómina de Estudiantes
    const worksheetRoster = XLSX.utils.json_to_sheet(rosterRows);
    worksheetRoster['!cols'] = [
      { wch: 6 },
      { wch: 32 },
      { wch: 30 },
      { wch: 18 },
      { wch: 14 },
      { wch: 18 },
      { wch: 28 },
      { wch: 24 },
      { wch: 20 },
      { wch: 20 },
      { wch: 18 },
      { wch: 24 },
      { wch: 22 },
    ];
    XLSX.utils.book_append_sheet(workbook, worksheetRoster, 'Nómina de Estudiantes');

    // Sheet 2: Resumen Institucional
    const worksheetSummary = XLSX.utils.json_to_sheet(summaryRows);
    worksheetSummary['!cols'] = [{ wch: 36 }, { wch: 65 }];
    XLSX.utils.book_append_sheet(workbook, worksheetSummary, 'Resumen Institucional');

    const dateTag = new Date().toISOString().split('T')[0];
    const fileName = onlyFiltered
      ? `Nomina_Filtrada_Excel_MinPesca_${dateTag}.xlsx`
      : `Nomina_General_Excel_MinPesca_${dateTag}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    setExportSuccessToast(`Archivo "${fileName}" descargado correctamente.`);
    setTimeout(() => {
      setExportSuccessToast(null);
    }, 4500);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    const newRecord: StudentRecord = {
      id: `std-${Date.now()}`,
      fullName: newStudentName.trim(),
      email: newStudentEmail.trim().toLowerCase(),
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

    const updated = [newRecord, ...students];
    setStudents(updated);
    saveStoredStudents(updated);
    setNewStudentName('');
    setNewStudentEmail('');
    setShowAddModal(false);
  };

  const openManageStudentModal = (student: StudentRecord) => {
    setEditingStudent(student);
    setEditName(student.fullName);
    setEditEmail(student.email);
    setEditCompletedPhases([...student.completedPhases]);
    setEditQuizScore(student.quizScore ?? 90);
    setEditPracticalScore(student.practicalScore ?? 92);
    setConfirmDeleteId(null);
  };

  const toggleEditPhase = (phaseNum: number) => {
    setEditCompletedPhases((prev) =>
      prev.includes(phaseNum) ? prev.filter((p) => p !== phaseNum) : [...prev, phaseNum].sort((a, b) => a - b)
    );
  };

  const handleMarkAllPhasesCompleted = () => {
    setEditCompletedPhases([1, 2, 3, 4, 5, 6]);
  };

  const handleSaveStudentChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editName.trim() || !editEmail.trim()) return;

    const sortedPhases = Array.from(new Set(editCompletedPhases)).sort((a, b) => a - b);
    const progressPercent = Math.min(100, Math.round((sortedPhases.length / 6) * 100));
    const allSixDone = sortedPhases.length === 6;

    const quizVal = sortedPhases.includes(5) || allSixDone ? Math.max(0, Math.min(100, Number(editQuizScore))) : null;
    const pracVal = sortedPhases.includes(6) || allSixDone ? Math.max(0, Math.min(100, Number(editPracticalScore))) : null;
    const finalVal =
      quizVal !== null && pracVal !== null ? Math.round((quizVal + pracVal) / 2) : null;
    const isCulminated = allSixDone && finalVal !== null && finalVal >= 70;

    const certDate = isCulminated
      ? editingStudent.certificateDate ||
        new Date().toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null;

    const certId = isCulminated
      ? editingStudent.certificateId || `EXCEL-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`
      : null;

    const nextPhase = (sortedPhases.length < 6 ? sortedPhases.length + 1 : 6) as PhaseId;

    const updatedRecord: StudentRecord = {
      ...editingStudent,
      fullName: editName.trim(),
      email: editEmail.trim().toLowerCase(),
      completedPhases: sortedPhases,
      progressPercent,
      currentPhase: nextPhase,
      isCulminated,
      quizScore: quizVal,
      practicalScore: pracVal,
      finalScore: finalVal,
      certificateDate: certDate,
      certificateId: certId,
    };

    const updatedList = students.map((s) => (s.id === editingStudent.id ? updatedRecord : s));
    setStudents(updatedList);
    saveStoredStudents(updatedList);

    // Also synchronize individual student progress storage in case they log in
    const existingIndividual = getStoredProgress(updatedRecord.email);
    saveStoredProgress(updatedRecord.email, {
      ...existingIndividual,
      completedPhases: sortedPhases,
      currentPhase: nextPhase,
      quizScore: quizVal,
      quizSubmitted: quizVal !== null,
      practicalScore: pracVal,
      finalScore: finalVal,
      isApproved: isCulminated ? true : finalVal !== null ? false : null,
      certificateDate: certDate,
      certificateId: certId,
    });

    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    const updatedList = students.filter((s) => s.id !== studentId);
    setStudents(updatedList);
    saveStoredStudents(updatedList);
    setEditingStudent(null);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Export Toast Notification */}
      {exportSuccessToast && (
        <div className="fixed bottom-20 right-4 z-50 bg-[#107C41] text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-400/30 flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{exportSuccessToast}</span>
        </div>
      )}

      {/* Top Header Banner for Teacher */}
      <div className="rounded-2xl p-5 sm:p-8 text-white shadow-lg relative overflow-hidden border border-emerald-400/25">
        <img
          src="/assets/aistudio/c3770d5882f9fc01a11dd8abf1b4d39f_bc1b3cd0.jpg"
          alt="Fondo Gestión Académica Excel"
          className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D4424]/95 via-[#107C41]/85 to-[#107C41]/55 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
              <GraduationCap className="w-4 h-4" />
              <span>Panel de Control del Instructor · Lcdo. Josmar Puerta</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Gestión Académica de Estudiantes
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Monitorea en tiempo real el progreso del <strong>Curso Introductorio de Excel Básico</strong>, exporta la nómina oficial en formato <code>.xlsx</code>, gestiona calificaciones e imprime certificados individuales o en lote.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleExportToExcel(false)}
              className="px-4 py-2.5 bg-emerald-400/20 hover:bg-emerald-400/30 text-white border border-emerald-300/40 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer min-h-[42px]"
              title="Descargar archivo Excel (.xlsx) con la nómina completa y resumen institucional"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>Exportar Nómina (.xlsx)</span>
            </button>

            <button
              onClick={() => setShowBatchCertsModal(true)}
              className="px-4 py-2.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-300/40 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer min-h-[42px]"
              title="Previsualizar e imprimir todos los certificados de estudiantes culminados en un solo PDF"
            >
              <Layers className="w-4 h-4 text-amber-200" />
              <span>Certificados en Lote ({totalCulminated})</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-white text-[#107C41] hover:bg-emerald-50 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer min-h-[42px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Inscribir Estudiante</span>
            </button>

            <button
              onClick={onSwitchToStudentMode}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[42px]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ver Aula como Alumno</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards: Inscritos, Iniciados, Culminados, Promedio */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Inscritos */}
        <div className="bg-white/95 backdrop-blur-xs p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Inscritos
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
              {totalEnrolled}
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">Total plataforma</span>
          </div>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
            <Users className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Iniciados (En progreso) */}
        <div className="bg-white/95 backdrop-blur-xs p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Iniciados
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
              {totalInProgress}
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">En curso (1 a 5)</span>
          </div>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Culminados (Aprobados) */}
        <div className="bg-white/95 backdrop-blur-xs p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Culminados
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#107C41] font-mono">
              {totalCulminated}
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#107C41] font-medium block truncate">
              Con Certificado
            </span>
          </div>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#E6F4EA] text-[#107C41] flex items-center justify-center font-bold shrink-0">
            <UserCheck className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Promedio General */}
        <div className="bg-white/95 backdrop-blur-xs p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Promedio
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#185C37] font-mono">
              {avgGrade}%
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">De culminados</span>
          </div>
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-50 text-[#185C37] flex items-center justify-center font-bold shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Módulo de Estudiantes: Listado Actualizado con Fondo de Imagen Adjuntada */}
      <div className="relative rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden">
        {/* Background Image of Módulo de Estudiantes */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/assets/aistudio/c3770d5882f9fc01a11dd8abf1b4d39f_bc1b3cd0.jpg"
            alt="Fondo Módulo de Estudiantes"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D4424]/90 via-[#107C41]/80 to-[#0D4424]/65" />
        </div>

        {/* Table Top Controls & Search over the Excel Green Background */}
        <div className="relative z-10 p-4 sm:p-5 border-b border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 text-white">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/15 text-emerald-200">
                <Users className="w-4 h-4" />
              </span>
              <span>Módulo de Estudiantes Registrados</span>
            </h2>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Listado actualizado con avance por fases, evaluación académica, descarga Excel y certificados
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-wrap">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar nombre, correo o ID..."
                className="w-full pl-9 pr-3 py-2 text-base sm:text-xs text-slate-900 bg-white/95 backdrop-blur-xs border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 min-h-[38px]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-xs border border-white/30 rounded-lg text-xs overflow-x-auto touch-pan-x">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 min-h-[34px] ${
                  filterStatus === 'all'
                    ? 'bg-[#107C41] text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({totalEnrolled})
              </button>
              <button
                onClick={() => setFilterStatus('culminated')}
                className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 min-h-[34px] ${
                  filterStatus === 'culminated'
                    ? 'bg-[#107C41] text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Culminados ({totalCulminated})
              </button>
              <button
                onClick={() => setFilterStatus('in_progress')}
                className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 min-h-[34px] ${
                  filterStatus === 'in_progress'
                    ? 'bg-[#107C41] text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                En Progreso ({totalInProgress})
              </button>
              <button
                onClick={() => setFilterStatus('not_started')}
                className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 min-h-[34px] ${
                  filterStatus === 'not_started'
                    ? 'bg-[#107C41] text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sin Iniciar ({totalNotStarted})
              </button>
            </div>

            {/* Quick Excel Export Button in Table Bar */}
            <button
              onClick={() => handleExportToExcel(filterStatus !== 'all' || searchQuery.trim().length > 0)}
              className="px-3 py-2 bg-white text-[#107C41] hover:bg-emerald-50 border border-white/40 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 min-h-[38px] shadow-xs"
              title="Exportar vista actual a archivo Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Descargar Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="relative z-10 overflow-x-auto touch-pan-x bg-white/92 backdrop-blur-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/95 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3.5">Estudiante (Nombre y Apellido)</th>
                <th className="p-3.5">Correo Electrónico</th>
                <th className="p-3.5 text-center">% de Avances</th>
                <th className="p-3.5 text-center">Fases</th>
                <th className="p-3.5 text-center">Culminado</th>
                <th className="p-3.5 text-center">Calificación</th>
                <th className="p-3.5 text-right">Gestión y Certificado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-transparent">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No se encontraron estudiantes con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Nombre y Apellido */}
                    <td className="p-3.5 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#185C37] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {std.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="truncate max-w-xs block">{std.fullName}</span>
                          {std.certificateId && (
                            <span className="text-[10px] font-mono text-slate-400 block">
                              {std.certificateId}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Correo */}
                    <td className="p-3.5 font-mono text-slate-600 truncate max-w-xs">
                      {std.email}
                    </td>

                    {/* % de Avances con barra */}
                    <td className="p-3.5 text-center">
                      <div className="w-28 mx-auto space-y-1">
                        <div className="flex justify-between text-[10px] font-mono font-bold text-slate-700">
                          <span>{std.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              std.isCulminated
                                ? 'bg-[#107C41]'
                                : 'bg-gradient-to-r from-amber-500 to-[#21A366]'
                            }`}
                            style={{ width: `${std.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Fases completadas */}
                    <td className="p-3.5 text-center font-mono font-semibold text-slate-700">
                      {std.completedPhases.length}/6
                    </td>

                    {/* Culminado Badge */}
                    <td className="p-3.5 text-center">
                      {std.isCulminated ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#107C41] bg-[#E6F4EA] px-2.5 py-1 rounded-full border border-[#21A366]/30 whitespace-nowrap">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Sí (Aprobado)
                        </span>
                      ) : std.progressPercent > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          En progreso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                          No iniciado
                        </span>
                      )}
                    </td>

                    {/* Calificación */}
                    <td className="p-3.5 text-center font-mono font-bold">
                      {std.finalScore !== null ? (
                        <span className="text-[#107C41]">{std.finalScore}%</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Acciones: Gestionar Estudiante + Ver e Imprimir Certificado */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openManageStudentModal(std)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer whitespace-nowrap"
                          title="Editar datos, avance de fases o calificaciones del estudiante"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                          <span>Gestionar</span>
                        </button>

                        {std.isCulminated ? (
                          <button
                            onClick={() => onViewStudentCertificate(std)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#107C41] hover:bg-[#185C37] text-white rounded-lg font-bold text-[11px] transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                            title="Ver e Imprimir Certificado Oficial en PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Ver e Imprimir Certificado</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic px-2 whitespace-nowrap">
                            Sin certificado
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to manually enroll a student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#107C41]" />
                <span>Inscribir Nuevo Estudiante</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nombre Completo del Participante *
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Ej. Pedro José Ramírez Castillo"
                  className="w-full px-3 py-2.5 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#107C41] min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="p.ramirez@minpesca.gob.ve"
                  className="w-full px-3 py-2.5 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#107C41] min-h-[44px]"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#107C41] hover:bg-[#185C37] text-white rounded-lg font-bold transition-colors cursor-pointer"
                >
                  Guardar Inscripción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal to Manage / Grade an Existing Student */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 border border-slate-200 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#107C41]" />
                  <span>Gestión Académica del Estudiante</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Actualiza datos personales, fases aprobadas o calificaciones para certificar
                </p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudentChanges} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#107C41] min-h-[42px]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#107C41] min-h-[42px]"
                    required
                  />
                </div>
              </div>

              {/* Phase Completion Selector */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Fases Completadas ({editCompletedPhases.length}/6)
                  </span>
                  <button
                    type="button"
                    onClick={handleMarkAllPhasesCompleted}
                    className="text-[11px] font-bold text-[#107C41] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Marcar las 6 fases (Culminar)</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((phaseNum) => {
                    const active = editCompletedPhases.includes(phaseNum);
                    return (
                      <button
                        key={phaseNum}
                        type="button"
                        onClick={() => toggleEditPhase(phaseNum)}
                        className={`py-2 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 border transition-all cursor-pointer min-h-[38px] ${
                          active
                            ? 'bg-[#107C41] text-white border-[#107C41] shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>F{phaseNum}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Evaluation Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#E6F4EA]/50 p-3.5 rounded-xl border border-[#21A366]/30">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nota Teórica - Fase 5 (0 a 100%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editQuizScore}
                    onChange={(e) => setEditQuizScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-base sm:text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#107C41] min-h-[40px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nota Práctica - Fase 6 (0 a 100%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editPracticalScore}
                    onChange={(e) => setEditPracticalScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-base sm:text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#107C41] min-h-[40px]"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center justify-between pt-1 text-[11px] text-slate-600">
                  <span>
                    Promedio Calculado:{' '}
                    <strong className="font-mono text-[#107C41]">
                      {Math.round((Number(editQuizScore) + Number(editPracticalScore)) / 2)}%
                    </strong>
                  </span>
                  <span>
                    {editCompletedPhases.length === 6 &&
                    Math.round((Number(editQuizScore) + Number(editPracticalScore)) / 2) >= 70 ? (
                      <span className="text-[#107C41] font-bold">✓ Emitirá Certificado Oficial</span>
                    ) : (
                      <span className="text-amber-700">Requiere 6 fases y promedio ≥ 70%</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Delete Confirmation or Action Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {confirmDeleteId === editingStudent.id ? (
                  <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                    <span className="text-[11px] text-rose-700 font-semibold">¿Eliminar registro?</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteStudent(editingStudent.id)}
                      className="px-2.5 py-1 bg-rose-600 text-white rounded font-bold text-[11px] hover:bg-rose-700 cursor-pointer"
                    >
                      Sí, eliminar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 text-slate-600 hover:text-slate-900 text-[11px] cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(editingStudent.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar Estudiante</span>
                  </button>
                )}

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#107C41] hover:bg-[#185C37] text-white rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Certificates Modal */}
      {showBatchCertsModal && (
        <BatchCertificatesModal
          students={students}
          onClose={() => setShowBatchCertsModal(false)}
        />
      )}
    </div>
  );
};
