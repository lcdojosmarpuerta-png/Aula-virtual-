import React, { useState, useEffect } from 'react';
import { PHASE_TUTORIALS, TutorialStep } from '../../data/phaseTutorialsData';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Terminal,
  Copy,
  Check,
  Sparkles,
  FileSpreadsheet,
  MousePointer,
  CheckCircle2,
  ZoomIn,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

interface PhaseVisualTutorialProps {
  phaseId: number;
}

export const PhaseVisualTutorial: React.FC<PhaseVisualTutorialProps> = ({
  phaseId,
}) => {
  const tutorial = PHASE_TUTORIALS[phaseId] || PHASE_TUTORIALS[1];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset when phaseId changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsAutoPlaying(false);
  }, [phaseId]);

  // Auto-play slideshow timer
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev + 1 >= tutorial.steps.length) {
          setIsAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, tutorial.steps.length]);

  const step: TutorialStep = tutorial.steps[currentStepIndex] || tutorial.steps[0];

  const handleNext = () => {
    if (currentStepIndex < tutorial.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-[#185C37] to-[#107C41] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#21A366]/30 border border-[#21A366]/50 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              Secuencia Visual del Entorno Real · Fase {tutorial.phaseId}
            </span>
            <span className="text-xs text-emerald-100/80 font-mono">
              Paso {currentStepIndex + 1} de {tutorial.steps.length}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {tutorial.videoTitle.replace('Tutorial ', 'Guía Visual: ')}
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-2xl">
            {tutorial.videoSubtitle}
          </p>
        </div>

        {/* Step dots & Auto-Play */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isAutoPlaying
                ? 'bg-amber-400 text-slate-900'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="Reproducir secuencia de capturas automáticamente"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isAutoPlaying ? 'Pausar' : 'Auto-Secuencia'}</span>
          </button>
        </div>
      </div>

      {/* Main Split: Real Excel Screenshot / Canvas on Left, Step Instructions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column: High-Fidelity Capture of the Real Excel Application */}
        <div className="lg:col-span-7 bg-slate-100 p-4 sm:p-6 flex flex-col justify-between">
          <div className="bg-white rounded-xl border border-slate-300 shadow-md overflow-hidden relative">
            {/* Real Excel Title Bar */}
            <div className="bg-[#107C41] text-white px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold select-none">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Libro1 - Microsoft Excel</span>
                <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded font-normal">
                  Guardado en este equipo
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-emerald-100 font-mono">
                <span>[Entorno Real 2026]</span>
              </div>
            </div>

            {/* Real Ribbon Tabs */}
            <div className="bg-[#107C41] text-white px-3 pb-1 flex items-center gap-1 text-[11px] overflow-x-auto select-none border-b border-[#0D4424]">
              {(['Archivo', 'Inicio', 'Insertar', 'Disposición', 'Fórmulas', 'Datos', 'Revisar', 'Vista'] as const).map(
                (tab) => {
                  const isActiveTab = step.visualState.ribbonTab === tab;
                  return (
                    <span
                      key={tab}
                      className={`px-3 py-1 rounded-t transition-all ${
                        isActiveTab
                          ? 'bg-white text-[#107C41] font-bold shadow-xs'
                          : 'text-emerald-100/80 hover:bg-white/10'
                      }`}
                    >
                      {tab}
                    </span>
                  );
                }
              )}
            </div>

            {/* Real Toolstrip Strip with Highlight Indicator */}
            <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Acción en Pantalla:
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E6F4EA] border-2 border-[#107C41] text-[#185C37] font-bold shadow-2xs text-xs animate-pulse">
                  <MousePointer className="w-3.5 h-3.5 text-[#107C41]" />
                  <span>{step.visualState.highlightedTool}</span>
                </div>
              </div>

              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline bg-slate-200/80 px-2 py-0.5 rounded">
                Atajo: {step.commandOrShortcut}
              </span>
            </div>

            {/* Formula Bar & Name Box */}
            <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center gap-2 text-xs font-mono">
              <div className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-[#185C37] min-w-[42px] text-center text-xs">
                {step.visualState.activeCell}
              </div>
              <span className="text-slate-400 font-serif italic font-bold">fx</span>
              <div className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-0.5 text-slate-900 font-semibold text-xs truncate">
                {step.visualState.formulaBarText || ' '}
              </div>
            </div>

            {/* Real Worksheet Grid */}
            <div className="p-3 bg-white">
              <table className="w-full border-collapse border border-slate-300 text-xs font-mono select-none">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold text-center">
                    <th className="w-9 border border-slate-300 py-1 bg-slate-200 text-[11px]">#</th>
                    <th className="border border-slate-300 py-1 px-2">A</th>
                    <th className="border border-slate-300 py-1 px-2">B</th>
                    <th className="border border-slate-300 py-1 px-2">C</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2].map((rowNum) => {
                    return (
                      <tr key={rowNum}>
                        <td className="border border-slate-300 text-center bg-slate-100 text-slate-500 font-bold py-1.5">
                          {rowNum}
                        </td>
                        {['A', 'B', 'C'].map((colLetter) => {
                          const coord = `${colLetter}${rowNum}`;
                          const cellData = step.visualState.cells.find((c) => c.coord === coord);
                          const isResult = cellData?.highlight === 'result';
                          const isPrimary = cellData?.highlight === 'primary';
                          const isSecondary = cellData?.highlight === 'secondary';

                          return (
                            <td
                              key={coord}
                              className={`border border-slate-200 p-2 min-w-[80px] transition-colors relative ${
                                isResult
                                  ? 'bg-[#E6F4EA] font-black text-[#107C41] ring-2 ring-[#107C41] ring-inset'
                                  : isPrimary
                                  ? 'bg-amber-50 font-bold text-slate-900 ring-2 ring-amber-500 ring-inset'
                                  : isSecondary
                                  ? 'bg-emerald-50/70 text-slate-800'
                                  : 'text-slate-700 bg-white'
                              }`}
                            >
                              <div className="truncate text-xs">
                                {cellData?.value || '—'}
                              </div>
                              {isResult && (
                                <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#107C41]" title="Tirador de relleno" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Chart Overlay if step covers charts */}
              {step.visualState.showChartPreview === 'bar' && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-4">
                  <div className="text-xs font-sans text-slate-700">
                    <span className="font-bold text-[#185C37] block">
                      Gráfico de Columnas Incrustado en la Hoja:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Ventas comparativas automáticas vinculadas a los datos
                    </span>
                  </div>
                  <div className="flex items-end gap-2 h-10 border-b border-slate-300 pb-0.5">
                    <div className="w-5 bg-[#107C41] h-10 rounded-t" title="Equipos ($15,300)" />
                    <div className="w-5 bg-[#21A366] h-7 rounded-t" title="Periféricos ($10,240)" />
                    <div className="w-5 bg-emerald-400 h-4 rounded-t" title="Audio ($5,400)" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status / Callout */}
            <div className="bg-slate-900 text-emerald-300 px-3 py-2 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{step.visualState.overlayBadge || 'Instrucción activa de Excel'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Captura Paso {currentStepIndex + 1}
              </span>
            </div>
          </div>

          {/* Stepper Navigation bar under the screenshot */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {/* Step indicators */}
            <div className="flex items-center gap-1.5">
              {tutorial.steps.map((s, idx) => (
                <button
                  key={s.stepNumber}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentStepIndex === idx
                      ? 'bg-[#107C41] text-white shadow-xs scale-105'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s.stepNumber}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === tutorial.steps.length - 1}
              className="px-3.5 py-1.5 rounded-lg bg-[#107C41] text-white hover:bg-[#185C37] disabled:opacity-40 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Step Explanation Deck */}
        <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-slate-50/60">
          <div className="space-y-4">
            {/* Step badge */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-[#E6F4EA] text-[#185C37] font-bold text-xs border border-[#21A366]/30">
                Paso {step.stepNumber} de {tutorial.steps.length}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {step.timeRange}
              </span>
            </div>

            {/* Step Title */}
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {step.title}
            </h3>

            {/* Detailed Instructions */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-2xs">
              <span className="font-bold text-slate-900 block mb-1">
                ¿Cómo realizarlo en tu Excel?
              </span>
              {step.instruction}
            </div>

            {/* Command / Formula with Copy */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Comando / Fórmula a ingresar:
              </span>
              <div className="bg-slate-900 text-emerald-300 p-2.5 rounded-xl font-mono text-xs flex items-center justify-between gap-2 border border-slate-800">
                <div className="flex items-center gap-1.5 truncate">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{step.commandOrShortcut}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(step.commandOrShortcut)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-sans font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  {copied ? (
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
            </div>

            {/* Expected Result */}
            <div className="p-3 bg-[#E6F4EA]/70 rounded-xl border border-[#21A366]/30 text-xs text-[#185C37] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0 mt-0.5" />
              <div>
                <strong className="block">Resultado esperado:</strong>
                <span className="text-slate-700 text-[11px]">{step.expectedOutcome}</span>
              </div>
            </div>
          </div>

          {/* Quick Step Switcher list */}
          <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Objetivo: {tutorial.summaryObjective}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
