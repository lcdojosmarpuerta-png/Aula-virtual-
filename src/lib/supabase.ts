import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://vlpfylxacitrrtnrhkdn.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_qW3MfFoLsx2x3eCPFFqo2g_8NbygZ9G';

const rawEnvUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const rawEnvKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

export const supabaseUrl: string =
  rawEnvUrl &&
  rawEnvUrl.startsWith('https://') &&
  !rawEnvUrl.includes('YOUR_SUPABASE')
    ? rawEnvUrl
    : FALLBACK_SUPABASE_URL;

export const supabaseAnonKey: string =
  rawEnvKey &&
  !rawEnvKey.startsWith('http://') &&
  !rawEnvKey.startsWith('https://') &&
  !rawEnvKey.includes('YOUR_SUPABASE')
    ? rawEnvKey
    : FALLBACK_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export interface SupabaseDiagnosticEvent {
  id: string;
  type: 'error' | 'success';
  operation: string;
  table: string;
  message: string;
  code?: string;
  details?: string;
  hint?: string;
  timestamp: string;
}

type DiagnosticListener = (event: SupabaseDiagnosticEvent) => void;
const listeners = new Set<DiagnosticListener>();
let lastErrorEvent: SupabaseDiagnosticEvent | null = null;

export function subscribeToSupabaseDiagnostics(listener: DiagnosticListener): () => void {
  listeners.add(listener);
  if (lastErrorEvent) {
    listener(lastErrorEvent);
  }
  return () => {
    listeners.delete(listener);
  };
}

export function reportSupabaseError(
  operation: string,
  table: string,
  err: unknown
): SupabaseDiagnosticEvent {
  const errObj = err as {
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
    status?: number;
  } | null;

  const rawMessage = errObj?.message || String(err || 'Error desconocido de conexión con Supabase');
  const customHint =
    errObj?.hint ||
    'Verifica que hayas ejecutado el script SQL de creación de tablas (students y course_progress) y políticas RLS en el SQL Editor de Supabase.';

  const event: SupabaseDiagnosticEvent = {
    id: `sb-err-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'error',
    operation,
    table,
    message: rawMessage,
    code: errObj?.code || (errObj?.status ? String(errObj.status) : undefined),
    details: errObj?.details || undefined,
    hint: customHint || undefined,
    timestamp: new Date().toLocaleTimeString('es-ES'),
  };

  lastErrorEvent = event;
  console.error(`[Supabase Error - ${operation} en ${table}]:`, event);
  listeners.forEach((l) => l(event));
  return event;
}

export function reportSupabaseSuccess(
  operation: string,
  table: string,
  message: string
): SupabaseDiagnosticEvent {
  const event: SupabaseDiagnosticEvent = {
    id: `sb-ok-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'success',
    operation,
    table,
    message,
    timestamp: new Date().toLocaleTimeString('es-ES'),
  };
  lastErrorEvent = null;
  listeners.forEach((l) => l(event));
  return event;
}

export function clearLastSupabaseError(): void {
  lastErrorEvent = null;
}
