import React from 'react';
import { User, CourseProgress } from '../../types/course';
import { FileSpreadsheet, Award, LogOut, RotateCcw, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  user: User;
  progress: CourseProgress;
  onLogout: () => void;
  onResetProgress?: () => void;
  onViewCertificate?: () => void;
  isTeacherMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  progress,
  onLogout,
  onResetProgress,
  onViewCertificate,
  isTeacherMode = false,
}) => {
  // Calculate percentage of phases completed (out of 6)
  const completedCount = progress.completedPhases.length;
  const progressPercent = Math.min(100, Math.round((completedCount / 6) * 100));

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Wordmark with Ministerio de Pesca Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Logo Ministerio de Pesca y Acuicultura */}
          <div className="h-8 sm:h-10 w-auto flex items-center bg-white rounded-lg p-0.5 border border-slate-200 shadow-2xs">
            <img
              src="/assets/aistudio/VIYVIB__1__6dde5c2b.jpg"
              alt="Logo Ministerio de Pesca y Acuicultura"
              className="h-7 sm:h-9 w-auto object-contain rounded"
            />
          </div>

          <div className="h-5 sm:h-6 w-px bg-slate-200" />

          {/* Excel brand icon & text */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#107C41] flex items-center justify-center text-white shadow-xs">
              <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-xs sm:text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                  Aula Virtual <span className="hidden xs:inline">Excel</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold text-[#107C41] bg-[#E6F4EA] px-1.5 py-0.5 rounded">
                  MinPesca
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 whitespace-nowrap">
                Curso Introductorio de Excel Básico
              </p>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation & Progress indicator */}
        {!isTeacherMode ? (
          <div className="flex-1 max-w-md mx-1 sm:mx-6 min-w-0">
            {/* Desktop progress bar */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1 font-medium">
                <span className="flex items-center gap-1.5 truncate">
                  <span>Fase actual: {progress.currentPhase} de 6</span>
                  {progress.isApproved && (
                    <span className="inline-flex items-center gap-1 text-[#107C41] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Aprobado
                    </span>
                  )}
                </span>
                <span className="font-mono tabular-nums text-slate-700">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-[#107C41] to-[#21A366] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Mobile compact progress badge */}
            <div className="sm:hidden flex items-center justify-center">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#E6F4EA] text-[#185C37] border border-[#21A366]/30">
                <span>Fase {progress.currentPhase}/6</span>
                <span>·</span>
                <span>{progressPercent}%</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 text-center hidden md:block">
            <span className="px-3 py-1 bg-[#E6F4EA] text-[#185C37] rounded-full text-xs font-bold border border-[#21A366]/30">
              Panel Administrativo de Control Docente
            </span>
          </div>
        )}

        {/* Zone 3: User Profile & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {progress.isApproved && onViewCertificate && !isTeacherMode && (
            <button
              onClick={onViewCertificate}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#185C37] bg-[#E6F4EA] hover:bg-[#d4edd9] border border-[#21A366]/30 rounded-lg transition-colors whitespace-nowrap cursor-pointer min-h-[36px]"
              title="Ver Certificado Oficial"
            >
              <Award className="w-4 h-4 text-[#107C41]" />
              <span>Ver Certificado</span>
            </button>
          )}

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">
              {user.fullName}
            </span>
            <span className="text-[11px] text-slate-500 truncate max-w-[140px]">
              {user.role === 'teacher' ? 'Docente / Instructor' : user.email}
            </span>
          </div>

          <div
            className="w-8 h-8 rounded-full bg-[#185C37] text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100 shrink-0"
            title={user.fullName}
          >
            {user.fullName.charAt(0).toUpperCase()}
          </div>

          <div className="flex items-center border-l border-slate-200 pl-1.5 sm:pl-2 ml-0.5 sm:ml-1 gap-0.5 sm:gap-1">
            {!isTeacherMode && onResetProgress && (
              <button
                onClick={onResetProgress}
                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                title="Reiniciar progreso del curso"
                aria-label="Reiniciar progreso"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
