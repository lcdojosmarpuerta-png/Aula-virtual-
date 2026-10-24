import React, { useState, useEffect } from 'react';
import { User } from '../../types/course';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Youtube,
  ExternalLink,
} from 'lucide-react';

interface OnboardingVideoProps {
  user: User;
  onFinishOnboarding: () => void;
}

const SYSTEM_BG_IMAGE = '/assets/aistudio/7543c30ffce46fd7bba0f29e321ed3e0_5cc870e4.jpg';

export const OnboardingVideo: React.FC<OnboardingVideoProps> = ({
  user,
  onFinishOnboarding,
}) => {
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const youtubeId = 'yKWFMgurUnU'; // Curso Excel - Capitulo 0, Introducción para Principiantes | Dostin Hurtado

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const handleMarkWatched = () => {
    setIsVideoFinished(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 pb-24 overflow-hidden">
      {/* Second Image Fixed Background for System Pages */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={SYSTEM_BG_IMAGE}
          alt="Fondo del Sistema Excel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        {/* Header bar */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#107C41] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Inducción Obligatoria · Video Tutorial en YouTube</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              ¡Bienvenido(a), {user.fullName}!
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Observa el video introductorio de Microsoft Excel en YouTube y marca la casilla al finalizar para desbloquear la Fase 1.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial justify-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 min-h-[40px]"
            >
              <Youtube className="w-4 h-4 shrink-0" />
              <span>Abrir en YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
            <button
              onClick={handleMarkWatched}
              className="flex-1 sm:flex-initial justify-center text-xs font-semibold text-white bg-[#107C41] hover:bg-[#185C37] px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs min-h-[40px]"
            >
              Marcar video como visto
            </button>
          </div>
        </div>

        {/* Embedded YouTube Player Stage */}
        <div className="relative bg-slate-950 aspect-video w-full overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            title="Curso de Excel Básico - Introducción para Principiantes (YouTube)"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        {/* Footer with Gate: Ir a la Fase 1 */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            {isVideoFinished ? (
              <span className="text-[#107C41] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#107C41]" />
                Video tutorial marcado como visto. Ya puedes ingresar al aula y comenzar la Fase 1.
              </span>
            ) : (
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 font-medium select-none">
                <input
                  type="checkbox"
                  checked={isVideoFinished}
                  onChange={(e) => setIsVideoFinished(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#107C41] cursor-pointer"
                />
                <span>He visualizado el video introductorio de YouTube y estoy listo(a) para iniciar la Fase 1.</span>
              </label>
            )}
          </div>

          <button
            onClick={onFinishOnboarding}
            disabled={!isVideoFinished}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
              isVideoFinished
                ? 'bg-[#107C41] hover:bg-[#185C37] text-white hover:shadow-md cursor-pointer scale-102'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-75'
            }`}
          >
            <span>Ir a la Fase 1</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
