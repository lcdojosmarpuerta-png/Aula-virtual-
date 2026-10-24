import React, { useState, useEffect, useRef } from 'react';
import { PHASE_TUTORIALS, TutorialStep } from '../../data/phaseTutorialsData';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  CheckCircle2,
  Video,
  Copy,
  Check,
  Terminal,
  Sparkles,
  ChevronRight,
  BarChart3,
  FileSpreadsheet,
  ListChecks,
} from 'lucide-react';

interface PhaseVideoTutorialProps {
  phaseId: number;
}

export const PhaseVideoTutorial: React.FC<PhaseVideoTutorialProps> = ({
  phaseId,
}) => {
  const tutorial = PHASE_TUTORIALS[phaseId] || PHASE_TUTORIALS[1];
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const lastSpokenStepRef = useRef<number | null>(null);

  // Reset state if phaseId changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCompletedSteps([]);
    lastSpokenStepRef.current = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [phaseId]);

  // Determine current active step based on currentTime
  const activeStepIndex = tutorial.steps.findIndex(
    (s, idx) =>
      currentTime >= s.startTime &&
      (currentTime < s.endTime || idx === tutorial.steps.length - 1)
  );
  const currentStep: TutorialStep =
    tutorial.steps[activeStepIndex >= 0 ? activeStepIndex : 0];

  // Mark previous steps as completed as time advances
  useEffect(() => {
    const passed = tutorial.steps
      .filter((s) => currentTime >= s.endTime - 1)
      .map((s) => s.stepNumber);
    if (passed.length > 0) {
      setCompletedSteps((prev) => Array.from(new Set([...prev, ...passed])));
    }
  }, [currentTime, tutorial.steps]);

  // Optional Spanish voice synthesis when step changes during playback
  useEffect(() => {
    if (
      isPlaying &&
      voiceEnabled &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window
    ) {
      if (lastSpokenStepRef.current !== currentStep.stepNumber) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentStep.narrationText);
        utterance.lang = 'es-ES';
        utterance.rate = playbackRate;
        window.speechSynthesis.speak(utterance);
        lastSpokenStepRef.current = currentStep.stepNumber;
      }
    } else if (!isPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [isPlaying, voiceEnabled, currentStep, playbackRate]);

  // Timer interval for playback
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 1000 / playbackRate;
    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev + 1 >= tutorial.totalDuration) {
          setIsPlaying(false);
          setCompletedSteps(tutorial.steps.map((s) => s.stepNumber));
          return tutorial.totalDuration;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackRate, tutorial.totalDuration, tutorial.steps]);

  const handleTogglePlay = () => {
    if (currentTime >= tutorial.totalDuration) {
      setCurrentTime(0);
      lastSpokenStepRef.current = null;
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSelectStep = (step: TutorialStep) => {
    setCurrentTime(step.startTime);
    lastSpokenStepRef.current = null;
    setIsPlaying(true);
  };

  const handlePrevStep = () => {
    const prevIdx = Math.max(0, activeStepIndex - 1);
    setCurrentTime(tutorial.steps[prevIdx].startTime);
    lastSpokenStepRef.current = null;
  };

  const handleNextStep = () => {
    const nextIdx = Math.min(tutorial.steps.length - 1, activeStepIndex + 1);
    setCurrentTime(tutorial.steps[nextIdx].startTime);
    lastSpokenStepRef.current = null;
  };

  const handleRestart = () => {
    setCurrentTime(0);
    lastSpokenStepRef.current = null;
    setIsPlaying(true);
  };

  const handleCopyCommand = (stepNumber: number, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNumber);
    setTimeout(() => setCopiedStep(null), 1800);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(
    100,
    Math.round((currentTime / tutorial.totalDuration) * 100)
  );
  const allStepsCompleted = completedSteps.length === tutorial.steps.length;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Banner of the Video Tutorial Module */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#0F291E] to-[#185C37] text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#21A366]/25 border border-[#21A366]/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Video className="w-3.5 h-3.5" />
              Vídeo Tutorial Paso a Paso · Fase {tutorial.phaseId}
            </span>
            {allStepsCompleted && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tutorial Visto
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
            {tutorial.videoTitle}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/85 max-w-3xl">
            {tutorial.videoSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-emerald-300 block font-medium">
              Instructor Guía
            </span>
            <span className="text-xs font-bold text-white">
              {tutorial.instructorName}
            </span>
          </div>
          <button
            onClick={handleTogglePlay}
            className="px-4 py-2.5 rounded-xl bg-[#21A366] hover:bg-[#107C41] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar Tutorial</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {currentTime > 0 && currentTime < tutorial.totalDuration
                    ? 'Reanudar Tutorial'
                    : 'Reproducir Paso a Paso'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Body: Left = Video Screen Player, Right = Step-by-Step Instructions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* LEFT COLUMN (7 cols): Interactive Video Canvas & Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 text-white">
          {/* Simulated Excel Screen Canvas inside Video Player */}
          <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between relative overflow-hidden min-h-[340px]">
            {/* Background subtle grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#107C41_1px,transparent_1px),linear-gradient(to_bottom,#107C41_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />

            {/* Top Status Overlay inside Video */}
            <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#107C41] text-white text-xs font-bold shadow-xs">
                  Paso {currentStep.stepNumber} de {tutorial.steps.length}
                </span>
                <span className="text-xs font-semibold text-emerald-300 truncate max-w-[240px] sm:max-w-xs">
                  {currentStep.title}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                {currentStep.timeRange}
              </span>
            </div>

            {/* Simulated Excel Window Frame */}
            <div className="relative z-10 bg-white text-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl my-auto">
              {/* Excel Fake Ribbon Bar */}
              <div className="bg-[#107C41] text-white px-3 py-1.5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-bold">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Demostración en Vivo · Microsoft Excel</span>
                </div>
                <div className="flex items-center gap-1">
                  {(['Archivo', 'Inicio', 'Insertar', 'Fórmulas', 'Datos'] as const).map(
                    (tab) => (
                      <span
                        key={tab}
                        className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                          currentStep.visualState.ribbonTab === tab
                            ? 'bg-white text-[#107C41] font-extrabold shadow-2xs scale-105'
                            : 'text-emerald-100/80'
                        }`}
                      >
                        {tab}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Highlighted Ribbon Command Strip */}
              <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Herramienta activa:</span>
                  <span className="px-2 py-0.5 rounded bg-[#E6F4EA] text-[#185C37] font-bold border border-[#21A366]/40">
                    {currentStep.visualState.highlightedTool}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                  {currentStep.commandOrShortcut}
                </span>
              </div>

              {/* Name Box & Formula Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center gap-2 text-xs font-mono">
                <div className="px-2 py-0.5 bg-white border border-slate-300 rounded font-bold text-[#185C37] text-[11px] min-w-[42px] text-center">
                  {currentStep.visualState.activeCell}
                </div>
                <span className="text-slate-400 font-serif italic font-bold">fx</span>
                <div className="flex-1 bg-white border border-emerald-500/60 rounded px-2.5 py-0.5 text-slate-900 font-semibold text-[11px] truncate">
                  {currentStep.visualState.formulaBarText || ' '}
                </div>
              </div>

              {/* Simulated Cells Grid */}
              <div className="p-2.5 bg-slate-50">
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                  {currentStep.visualState.cells.map((cell) => {
                    const isPrimary = cell.highlight === 'primary';
                    const isSecondary = cell.highlight === 'secondary';
                    const isResult = cell.highlight === 'result';

                    return (
                      <div
                        key={cell.coord}
                        className={`p-2 rounded border transition-all duration-300 flex flex-col justify-between ${
                          isResult
                            ? 'bg-[#E6F4EA] border-2 border-[#107C41] text-[#185C37] font-bold shadow-xs scale-[1.02]'
                            : isPrimary
                            ? 'bg-amber-50 border-2 border-amber-500 text-slate-900 font-bold'
                            : isSecondary
                            ? 'bg-emerald-50/60 border border-[#21A366]/50 text-slate-800'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[9px] text-slate-400 mb-0.5">
                          <span>Celda {cell.coord}</span>
                          {isResult && (
                            <span className="text-[#107C41] font-bold">★ Resultado</span>
                          )}
                        </div>
                        <div className="truncate text-[11px] sm:text-xs">
                          {cell.value || '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Optional Chart Mini Visualization when tutorial step covers charts */}
                {currentStep.visualState.showChartPreview === 'bar' && (
                  <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px] font-sans font-bold text-[#185C37]">
                      <BarChart3 className="w-4 h-4 text-[#107C41]" />
                      <span>Vista Previa del Gráfico Generado:</span>
                    </div>
                    <div className="flex items-end gap-1.5 h-8">
                      <div className="w-4 bg-[#107C41] h-8 rounded-t" title="Equipos" />
                      <div className="w-4 bg-[#21A366] h-6 rounded-t" title="Periféricos" />
                      <div className="w-4 bg-emerald-400 h-4 rounded-t" title="Audio" />
                      <div className="w-4 bg-emerald-300 h-3 rounded-t" title="Accesorios" />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Callout Strip inside Excel Window */}
              {currentStep.visualState.overlayBadge && (
                <div className="bg-slate-900 text-emerald-300 px-3 py-1.5 text-[11px] font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {currentStep.visualState.overlayBadge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isPlaying ? '● EN REPRODUCCIÓN' : '⏸ PAUSADO'}
                  </span>
                </div>
              )}
            </div>

            {/* Closed Captions / Instructor Narration Subtitle Box */}
            <div className="relative z-10 mt-3 p-3 rounded-xl bg-slate-900/95 border border-slate-800 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
              <span className="px-1.5 py-0.5 rounded bg-[#107C41]/40 text-emerald-300 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                CC
              </span>
              <p className="flex-1">{currentStep.narrationText}</p>
            </div>
          </div>

          {/* Video Timeline & Transport Controls Bar */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
            {/* Chapter Step Scrubber Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Progreso del tutorial: {progressPercent}%</span>
                <span className="font-mono">
                  {formatTime(currentTime)} / {formatTime(tutorial.totalDuration)}
                </span>
              </div>

              {/* Segmented Timeline by Steps */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {tutorial.steps.map((step) => {
                  const isCurrent = currentStep.stepNumber === step.stepNumber;
                  const isDone = completedSteps.includes(step.stepNumber);
                  return (
                    <button
                      key={step.stepNumber}
                      onClick={() => handleSelectStep(step)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#21A366] ring-2 ring-emerald-400/50'
                          : isDone
                          ? 'bg-[#107C41]'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      title={`Ir al Paso ${step.stepNumber}: ${step.title}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleTogglePlay}
                  className="p-2 rounded-lg bg-[#107C41] hover:bg-[#21A366] text-white transition-colors cursor-pointer"
                  title={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </button>

                <button
                  onClick={handlePrevStep}
                  disabled={activeStepIndex <= 0}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
                  title="Paso anterior"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={activeStepIndex >= tutorial.steps.length - 1}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
                  title="Siguiente paso"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRestart}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Reiniciar tutorial"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Voice synthesis toggle */}
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    voiceEnabled
                      ? 'bg-[#107C41]/30 border-[#21A366] text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title="Activar/Desactivar narración por voz del paso a paso"
                >
                  {voiceEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Voz Guía: Sí</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Voz Guía: No</span>
                    </>
                  )}
                </button>

                {/* Playback speed */}
                <button
                  onClick={() =>
                    setPlaybackRate((r) => (r === 1 ? 1.5 : r === 1.5 ? 2 : 1))
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
                  title="Velocidad de reproducción"
                >
                  {playbackRate}x
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Step-by-Step Written Instructions Deck */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50/70">
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[#107C41]" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                Instrucciones Paso a Paso para Realizarlo
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-[#107C41] bg-[#E6F4EA] px-2 py-0.5 rounded">
              {completedSteps.length}/{tutorial.steps.length} completados
            </span>
          </div>

          {/* Interactive Steps List */}
          <div className="p-4 space-y-3 overflow-y-auto max-h-[460px]">
            {tutorial.steps.map((step) => {
              const isActive = currentStep.stepNumber === step.stepNumber;
              const isCompleted = completedSteps.includes(step.stepNumber);

              return (
                <div
                  key={step.stepNumber}
                  onClick={() => handleSelectStep(step)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white border-2 border-[#107C41] shadow-sm'
                      : isCompleted
                      ? 'bg-white/90 border-slate-200 hover:border-[#21A366]'
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-[#107C41] text-white'
                            : isCompleted
                            ? 'bg-[#E6F4EA] text-[#107C41]'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted && !isActive ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          step.stepNumber
                        )}
                      </span>
                      <h4
                        className={`text-xs font-bold leading-snug ${
                          isActive ? 'text-[#185C37]' : 'text-slate-900'
                        }`}
                      >
                        {step.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {step.timeRange}
                    </span>
                  </div>

                  {/* Step detailed instruction */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                    {step.instruction}
                  </p>

                  {/* Command / Formula Box + Copy Button */}
                  <div className="bg-slate-900 text-emerald-300 px-3 py-1.5 rounded-lg font-mono text-[11px] flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{step.commandOrShortcut}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) =>
                        handleCopyCommand(step.stepNumber, step.commandOrShortcut, e)
                      }
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                      title="Copiar comando o fórmula"
                    >
                      {copiedStep === step.stepNumber ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Expected result */}
                  <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                    <ChevronRight className="w-3.5 h-3.5 text-[#107C41] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-700">Resultado:</strong>{' '}
                      {step.expectedOutcome}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Objective Summary */}
          <div className="p-3.5 bg-[#E6F4EA]/60 border-t border-[#21A366]/20 text-[11px] text-[#185C37] flex items-center justify-between gap-2">
            <span>
              <strong>Meta de la Fase {tutorial.phaseId}:</strong> {tutorial.summaryObjective}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
