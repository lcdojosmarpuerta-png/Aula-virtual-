import React from 'react';
import { User, CourseProgress } from '../../types/course';
import {
  AlertCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

interface FailedScreenProps {
  user: User;
  progress: CourseProgress;
  onRestartCourse: () => void;
}

export const FailedScreen: React.FC<FailedScreenProps> = ({
  user,
  progress,
  onRestartCourse,
}) => {
  const finalScore = progress.finalScore ?? 0;
  const quizScore = progress.quizScore ?? 0;
  const practicalScore = progress.practicalScore ?? 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 border border-slate-200 text-center space-y-6">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">
            Resultado de Evaluación
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Curso No Aprobado
          </h2>
          <p className="text-sm text-slate-500">
            Estimado(a) <strong>{user.fullName}</strong>, tu promedio final no alcanzó el puntaje mínimo requerido.
          </p>
        </div>

        {/* Score breakdown card */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 text-left">
          <div className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-200 pb-2">
            <span>Evaluación Teórica (Fase 5):</span>
            <span className="font-mono font-bold text-slate-800">{quizScore}%</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-200 pb-2">
            <span>Evaluación Práctica (Fase 6):</span>
            <span className="font-mono font-bold text-slate-800">{practicalScore}%</span>
          </div>

          <div className="flex items-center justify-between text-sm pt-1">
            <span className="font-bold text-slate-900">Promedio Final Obtenido:</span>
            <span className="font-black font-mono text-rose-600 text-lg">
              {finalScore}% <span className="text-xs font-normal text-slate-400">/ 100%</span>
            </span>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 bg-rose-50/60 p-2.5 rounded-lg border border-rose-100 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              Nota mínima requerida para acreditación: <strong>70%</strong>. Te faltaron {70 - finalScore}% para aprobar.
            </span>
          </div>
        </div>

        {/* Motivational message */}
        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-slate-700 leading-relaxed text-left">
          <div className="flex items-center gap-1.5 font-bold text-[#185C37] mb-1">
            <Sparkles className="w-4 h-4 text-[#107C41]" />
            <span>¡No te desanimes! El aprendizaje es un proceso continuo.</span>
          </div>
          <p>
            Te invitamos a repasar con calma el entorno de trabajo, los formatos y las fórmulas esenciales (=SUMA, =PROMEDIO, =MAX, =MIN) para superar el reto en tu próximo intento.
          </p>
        </div>

        {/* Single Action Button: Reiniciar Curso desde el Inicio */}
        <div className="pt-2">
          <button
            onClick={onRestartCourse}
            className="w-full py-3.5 px-6 bg-[#107C41] hover:bg-[#185C37] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar Curso desde el Inicio</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-2">
            Esta acción restablecerá tu avance a la Fase 1 y desbloqueará nuevamente cada fase de forma secuencial.
          </p>
        </div>
      </div>
    </div>
  );
};
