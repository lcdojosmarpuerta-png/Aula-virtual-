import React, { useState } from 'react';
import { CourseProgress, PhaseId } from '../../types/course';
import { PHASES_CONFIG } from '../../data/courseData';
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  FileCheck2,
  Table,
  Calculator,
  BarChart3,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  X,
} from 'lucide-react';

interface SidebarProps {
  progress: CourseProgress;
  onSelectPhase: (phaseId: PhaseId) => void;
  onShowCertificate?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  progress,
  onSelectPhase,
  onShowCertificate,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isPhase2 = progress.currentPhase === 2;
  const currentPhaseMeta =
    PHASES_CONFIG.find((p) => p.id === progress.currentPhase) || PHASES_CONFIG[0];

  // Phase icon mapping
  const getPhaseIcon = (id: number) => {
    switch (id) {
      case 1:
        return <BookOpen className="w-4 h-4" />;
      case 2:
        return <Table className="w-4 h-4" />;
      case 3:
        return <Calculator className="w-4 h-4" />;
      case 4:
        return <BarChart3 className="w-4 h-4" />;
      case 5:
        return <FileCheck2 className="w-4 h-4" />;
      case 6:
        return <Award className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  // An unlocked phase is either phase 1 or a phase whose previous phase is in completedPhases
  const isPhaseUnlocked = (id: number) => {
    if (id === 1) return true;
    return progress.completedPhases.includes(id - 1);
  };

  const handlePrevPhaseMobile = () => {
    if (progress.currentPhase > 1) {
      const prevId = (progress.currentPhase - 1) as PhaseId;
      if (isPhaseUnlocked(prevId)) {
        onSelectPhase(prevId);
      }
    }
  };

  const handleNextPhaseMobile = () => {
    if (progress.currentPhase < 6) {
      const nextId = (progress.currentPhase + 1) as PhaseId;
      if (isPhaseUnlocked(nextId)) {
        onSelectPhase(nextId);
      }
    }
  };

  return (
    <>
      {/* ============================================================== */}
      {/* MOBILE PHONE PHASE NAVIGATION BAR (< md)                       */}
      {/* Compact sticky bar + quick drawer trigger (Thumb-friendly)     */}
      {/* ============================================================== */}
      <div className="md:hidden sticky top-14 sm:top-16 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs px-3 py-2 no-print">
        <div className="flex items-center justify-between gap-2">
          {/* Quick Prev Phase Button */}
          <button
            onClick={handlePrevPhaseMobile}
            disabled={progress.currentPhase <= 1}
            className="p-2 rounded-lg text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Fase anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Current Phase Title & Drawer Trigger */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#E6F4EA]/80 hover:bg-[#E6F4EA] border border-[#21A366]/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer min-h-[40px]"
          >
            <span className="w-5 h-5 rounded-md bg-[#107C41] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              {progress.currentPhase}
            </span>
            <div className="text-left min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#185C37] truncate">
                  Fase {progress.currentPhase}: {currentPhaseMeta.subtitle}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate">
                Toca para ver las 6 fases ({progress.completedPhases.length}/6 completadas)
              </span>
            </div>
            <Layers className="w-3.5 h-3.5 text-[#107C41] shrink-0 ml-1" />
          </button>

          {/* Quick Next Phase Button */}
          <button
            onClick={handleNextPhaseMobile}
            disabled={
              progress.currentPhase >= 6 ||
              !isPhaseUnlocked(progress.currentPhase + 1)
            }
            className="p-2 rounded-lg text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Fase siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE DRAWER MODAL (< md)                                     */}
      {/* Bottom Sheet style for thumb-friendly phase selection          */}
      {/* ============================================================== */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end no-print">
          <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border-t border-slate-200 animate-fadeIn">
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 shrink-0" />

            {/* Drawer Header */}
            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#107C41]" />
                  <span>Módulos del Curso de Excel</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Desbloqueo secuencial · {progress.completedPhases.length} de 6 completadas
                </p>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                aria-label="Cerrar menú de fases"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Phase List */}
            <div className="p-3 space-y-2 overflow-y-auto flex-1">
              {PHASES_CONFIG.map((phase) => {
                const unlocked = isPhaseUnlocked(phase.id);
                const isCompleted = progress.completedPhases.includes(phase.id);
                const isActive = progress.currentPhase === phase.id;

                return (
                  <button
                    key={phase.id}
                    onClick={() => {
                      if (unlocked) {
                        onSelectPhase(phase.id as PhaseId);
                        setMobileDrawerOpen(false);
                      }
                    }}
                    disabled={!unlocked}
                    className={`w-full p-3 rounded-xl transition-all flex items-center gap-3 text-left cursor-pointer min-h-[56px] ${
                      isActive
                        ? 'bg-[#E6F4EA] text-[#185C37] ring-1 ring-[#107C41]/40 font-bold shadow-2xs'
                        : isCompleted
                        ? 'bg-slate-50/80 hover:bg-slate-100 text-slate-800'
                        : unlocked
                        ? 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
                        : 'bg-slate-100/70 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                        isCompleted
                          ? 'bg-[#107C41] text-white shadow-2xs'
                          : isActive
                          ? 'bg-[#185C37] text-white ring-2 ring-[#21A366]/40'
                          : unlocked
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : unlocked ? (
                        getPhaseIcon(phase.id)
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate">
                          Fase {phase.id}: {phase.subtitle}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {phase.duration}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {phase.shortDesc}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* Certificate button in mobile drawer if approved */}
              {progress.isApproved && onShowCertificate && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onShowCertificate();
                      setMobileDrawerOpen(false);
                    }}
                    className="w-full py-3 px-4 bg-[#107C41] hover:bg-[#185C37] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[48px]"
                  >
                    <Award className="w-4 h-4" />
                    <span>Ver e Imprimir Certificado Oficial</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DESKTOP SIDEBAR (>= md)                                         */}
      {/* Standard sticky left sidebar with collapsible mode             */}
      {/* ============================================================== */}
      <aside
        className={`hidden md:flex shrink-0 bg-white border-r border-slate-200 flex-col h-[calc(100vh-4rem)] sticky top-16 no-print overflow-y-auto transition-all duration-300 ${
          isCollapsed ? 'w-16 md:w-20' : 'w-72 lg:w-80'
        }`}
      >
        {/* Header with Desplegar / Colapsar Button */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-1">
          {!isCollapsed && (
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Módulos del Curso
                </h2>
                {isPhase2 && (
                  <span className="text-[10px] font-bold text-[#107C41] bg-[#E6F4EA] px-1.5 py-0.5 rounded">
                    Fase 2
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Desbloqueo secuencial
              </p>
            </div>
          )}

          {/* Toggle Collapse Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors cursor-pointer ${
                isCollapsed ? 'mx-auto' : ''
              }`}
              title={isCollapsed ? 'Desplegar barra lateral' : 'Colapsar barra lateral'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-[#107C41]" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Notice in Phase 2 if not collapsed */}
        {isPhase2 && !isCollapsed && onToggleCollapse && (
          <div className="mx-3 mt-2 p-2 bg-[#E6F4EA]/80 rounded-lg border border-[#21A366]/30 text-[11px] text-[#185C37] flex items-center justify-between gap-1">
            <span>Tip: Puedes ocultar esta barra para ampliar tu simulador Excel</span>
            <button
              onClick={onToggleCollapse}
              className="text-[10px] font-bold underline cursor-pointer shrink-0"
            >
              Ocultar
            </button>
          </div>
        )}

        {/* Phases Navigation */}
        <nav className={`p-2 space-y-1.5 flex-1 ${isCollapsed ? 'px-1.5' : 'p-3'}`}>
          {PHASES_CONFIG.map((phase) => {
            const unlocked = isPhaseUnlocked(phase.id);
            const isCompleted = progress.completedPhases.includes(phase.id);
            const isActive = progress.currentPhase === phase.id;

            return (
              <button
                key={phase.id}
                onClick={() => {
                  if (unlocked) {
                    onSelectPhase(phase.id as PhaseId);
                  }
                }}
                disabled={!unlocked}
                title={`Fase ${phase.id}: ${phase.subtitle}`}
                className={`w-full rounded-xl transition-all duration-200 flex items-center gap-3 relative cursor-pointer ${
                  isCollapsed ? 'p-2.5 justify-center' : 'p-3 text-left'
                } ${
                  isActive
                    ? 'bg-[#E6F4EA] text-[#185C37] shadow-xs ring-1 ring-[#107C41]/30 font-bold'
                    : unlocked
                    ? 'hover:bg-slate-50 text-slate-700'
                    : 'bg-slate-50/60 text-slate-400 cursor-not-allowed opacity-75'
                }`}
              >
                {/* Indicator Icon */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-semibold text-xs transition-colors ${
                    isCompleted
                      ? 'bg-[#107C41] text-white'
                      : isActive
                      ? 'bg-[#185C37] text-white ring-2 ring-[#21A366]/30'
                      : unlocked
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : unlocked ? (
                    getPhaseIcon(phase.id)
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>

                {/* Text details (hidden when collapsed) */}
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-xs font-semibold truncate ${
                          isActive ? 'text-[#185C37]' : unlocked ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        Fase {phase.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        {phase.duration}
                      </span>
                    </div>
                    <p
                      className={`text-xs font-medium truncate ${
                        isActive ? 'text-[#107C41]' : unlocked ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      {phase.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      {isCompleted ? (
                        <span className="text-[#107C41] font-semibold flex items-center gap-1">
                          Completada
                        </span>
                      ) : isActive ? (
                        <span className="text-[#185C37] font-semibold flex items-center gap-1">
                          <PlayCircle className="w-3 h-3" /> En curso
                        </span>
                      ) : unlocked ? (
                        <span className="text-slate-500">Disponible</span>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Bloqueada
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Course Evaluation summary in Sidebar footer */}
        {!isCollapsed ? (
          <div className="p-4 border-t border-slate-200 bg-slate-50/80">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Progreso del curso:</span>
                <span className="font-semibold text-slate-800">
                  {progress.completedPhases.length} de 6 fases
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Nota Teórica (Fase 5):</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {progress.quizScore !== null ? `${progress.quizScore}%` : 'Pendiente'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Nota Práctica (Fase 6):</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {progress.practicalScore !== null ? `${progress.practicalScore}%` : 'Pendiente'}
                </span>
              </div>

              {progress.finalScore !== null && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Promedio Final:</span>
                  <span
                    className={`font-bold font-mono px-2 py-0.5 rounded text-xs ${
                      progress.isApproved
                        ? 'bg-[#E6F4EA] text-[#107C41]'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {progress.finalScore}% {progress.isApproved ? '(Aprobado)' : '(Reprobado)'}
                  </span>
                </div>
              )}

              {progress.isApproved && onShowCertificate && (
                <button
                  onClick={onShowCertificate}
                  className="w-full mt-2 py-2 px-3 bg-[#107C41] hover:bg-[#185C37] text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Ver Certificado</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-slate-200 text-center">
            <div className="w-8 h-8 mx-auto rounded-lg bg-[#E6F4EA] text-[#107C41] flex items-center justify-center font-bold text-xs">
              {progress.completedPhases.length}/6
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
