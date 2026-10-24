import React, { useEffect, useState } from 'react';
import {
  subscribeToSupabaseDiagnostics,
  SupabaseDiagnosticEvent,
  clearLastSupabaseError,
  supabaseUrl,
  supabaseAnonKey,
} from '../../lib/supabase';
import { testAndSyncSupabaseConnection } from '../../utils/storage';
import { AlertTriangle, CheckCircle2, RefreshCw, X, Database } from 'lucide-react';

export const SupabaseDiagnosticBanner: React.FC = () => {
  const [event, setEvent] = useState<SupabaseDiagnosticEvent | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToSupabaseDiagnostics((incoming) => {
      setEvent(incoming);
      if (incoming.type === 'success') {
        const timer = setTimeout(() => {
          setEvent((prev) => (prev?.id === incoming.id ? null : prev));
        }, 5000);
        return () => clearTimeout(timer);
      }
    });
    return unsubscribe;
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await testAndSyncSupabaseConnection();
    } finally {
      setIsTesting(false);
    }
  };

  const handleDismiss = () => {
    clearLastSupabaseError();
    setEvent(null);
  };

  if (!event) return null;

  if (event.type === 'success') {
    return (
      <div className="fixed top-4 right-4 z-[100] max-w-md w-full px-3 no-print animate-fadeIn">
        <div className="bg-[#107C41] text-white p-3.5 rounded-xl shadow-2xl border border-emerald-300/40 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold">
                Supabase ({event.operation} en {event.table})
              </div>
              <p className="text-emerald-100 mt-0.5">{event.message}</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-emerald-200 hover:text-white p-1 cursor-pointer"
            title="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const isKeyLookingLikeUrl =
    supabaseAnonKey.startsWith('http://') || supabaseAnonKey.startsWith('https://');

  return (
    <div className="fixed top-4 inset-x-0 z-[100] max-w-2xl mx-auto px-3 no-print animate-fadeIn">
      <div className="bg-rose-950/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl shadow-2xl border-2 border-rose-500/80 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center shrink-0 text-rose-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-rose-200">
                  Error de Conexión con Supabase Detectado
                </span>
                {event.code && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-900 border border-rose-500/50 rounded-md text-rose-200">
                    Código: {event.code}
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-100 mt-0.5">
                Operación: <strong className="font-mono">{event.operation}</strong> · Tabla:{' '}
                <strong className="font-mono">{event.table}</strong> · Hora: {event.timestamp}
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-rose-300 hover:text-white p-1 rounded-lg hover:bg-rose-900/50 cursor-pointer shrink-0"
            title="Ocultar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Exact Supabase Error Message */}
        <div className="bg-black/40 border border-rose-500/30 rounded-xl p-3 font-mono text-xs text-rose-200 break-words space-y-1">
          <div>
            <span className="text-rose-400 font-bold">Mensaje de Supabase: </span>
            <span>{event.message}</span>
          </div>
          {event.details && (
            <div>
              <span className="text-rose-400 font-bold">Detalles: </span>
              <span>{event.details}</span>
            </div>
          )}
        </div>

        {/* Diagnostic explanation */}
        {(event.hint || isKeyLookingLikeUrl) && (
          <div className="bg-amber-500/15 border border-amber-400/40 rounded-xl p-3 text-xs text-amber-100 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span>Causa detectada en la configuración:</span>
            </div>
            <p className="leading-relaxed">
              {event.hint ||
                `La credencial SUPABASE_ANON_KEY proporcionada ("${supabaseAnonKey}") es una URL y no la clave pública de API. Supabase rechaza las escrituras si no recibe la clave "anon public" (que empieza por "eyJ..." o "sb_publishable_...").`}
            </p>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-rose-200/90">
          <span className="truncate font-mono">URL: {supabaseUrl}</span>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3 py-1.5 bg-white text-rose-900 hover:bg-rose-50 disabled:opacity-60 rounded-lg font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Probando...' : 'Probar Conexión con Supabase'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
