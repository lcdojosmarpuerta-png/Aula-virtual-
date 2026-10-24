import React, { useState } from 'react';
import { User } from '../../types/course';
import {
  FileSpreadsheet,
  CheckCircle2,
  Mail,
  User as UserIcon,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Award,
  GraduationCap,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  verifyStudentLoginInCloud,
  registerStudentWithPasswordInCloud,
  verifyTeacherAuthentication,
} from '../../utils/storage';

interface AuthModalProps {
  onSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'teacher';

const LOGIN_BG_IMAGE = '/assets/aistudio/0809ebc898c926b96763e29a80fa6789_32c370f1.jpg';

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModeSwitch = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError(null);
    setPassword('');
    setShowPassword(false);
    if (nextMode === 'teacher') {
      setEmail('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      setError('El nombre completo es obligatorio para la emisión de tu certificado.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'teacher') {
        const teacherRes = await verifyTeacherAuthentication(email, password);
        if (!teacherRes.success || !teacherRes.user) {
          setError(
            teacherRes.error ||
              'Credenciales docentes incorrectas. Ingrese manualmente su usuario y clave autorizada.'
          );
          return;
        }
        onSuccess(teacherRes.user);
        return;
      }

      if (mode === 'login') {
        const loginRes = await verifyStudentLoginInCloud(email, password);
        if (!loginRes.success || !loginRes.user) {
          setError(
            loginRes.error ||
              'Usuario o contraseña incorrectos. Verifica tus datos registrados en la base de datos.'
          );
          return;
        }
        onSuccess(loginRes.user);
        return;
      }

      // mode === 'register'
      const registerRes = await registerStudentWithPasswordInCloud(fullName, email, password);
      if (!registerRes.success || !registerRes.user) {
        setError(
          registerRes.error || 'No se pudo registrar la cuenta en la base de datos.'
        );
        return;
      }
      onSuccess(registerRes.user);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-3 sm:p-6 lg:p-8 pb-20 overflow-hidden">
      {/* Single Fixed Background Image for Login Screen */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={LOGIN_BG_IMAGE}
          alt="Fondo de Inicio de Sesión Excel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-[#0D4424]/55 to-slate-950/75 backdrop-blur-[1px]" />
      </div>

      {/* Main Login / Register Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-white/25">
        {/* Left Side: Brand, Institutional Logo & Visual Pitch (Compact on mobile) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#107C41]/95 via-[#185C37]/95 to-[#0D4424]/95 text-white p-5 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10">
            {/* Logos: MinPesca + Excel */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 bg-white/10 p-2 sm:p-2.5 rounded-xl border border-white/15 backdrop-blur-xs">
              <div className="h-9 sm:h-11 w-auto bg-white rounded-lg p-1 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/assets/aistudio/VIYVIB__1__6dde5c2b.jpg"
                  alt="Ministerio de Pesca y Acuicultura"
                  className="h-full w-auto object-contain rounded"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-emerald-200 uppercase block truncate">
                  Ministerio del Poder Popular
                </span>
                <span className="text-xs sm:text-xs font-black tracking-tight text-white block truncate">
                  de Pesca y Acuicultura
                </span>
              </div>
            </div>

            {/* Logo Aula Virtual */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white text-[#107C41] flex items-center justify-center shadow-lg font-bold shrink-0">
                <FileSpreadsheet className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black tracking-tight block">
                  AULA VIRTUAL
                </span>
                <span className="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-widest font-semibold">
                  Curso de Excel Básico
                </span>
              </div>
            </div>

            {/* Course Headline */}
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug mb-1.5 sm:mb-3 text-white">
              Capacitación en Hojas de Cálculo
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-6">
              Programa estructurado en 6 fases con videos de YouTube, ejercicios interactivos y certificado oficial institucional.
            </p>

            {/* Feature Highlights - visible on tablet & desktop */}
            <div className="hidden sm:block space-y-2.5 pt-3 border-t border-white/10">
              <div className="flex items-start gap-2.5 text-xs text-emerald-50">
                <CheckCircle2 className="w-4 h-4 text-[#21A366] shrink-0 mt-0.5" />
                <span><strong>Desbloqueo Secuencial:</strong> Avanza fase por fase para afianzar conocimientos.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-emerald-50">
                <ShieldCheck className="w-4 h-4 text-[#21A366] shrink-0 mt-0.5" />
                <span><strong>Evaluación Teórico-Práctica:</strong> Cuestionario aleatorio y proyecto en archivo real.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-emerald-50">
                <Award className="w-4 h-4 text-[#21A366] shrink-0 mt-0.5" />
                <span><strong>Certificado Oficial:</strong> Validado con firmas institucionales (70%+).</span>
              </div>
            </div>
          </div>

          {/* Institutional note */}
          <div className="relative z-10 mt-3 sm:mt-8 pt-2 sm:pt-4 border-t border-white/10 text-[10px] sm:text-[11px] text-emerald-200/90 flex items-center justify-between">
            <span>Dirección General de Formación</span>
            <span className="font-semibold text-white">Versión 2026</span>
          </div>
        </div>

        {/* Right Side: Form (Touch-optimized) */}
        <div className="lg:col-span-7 p-4 sm:p-8 lg:p-10 flex flex-col justify-center bg-white/95">
          <div className="max-w-md w-full mx-auto">
            {/* 3 Tabs: Iniciar Sesión | Crear Cuenta | Docente */}
            <div className="grid grid-cols-3 border-b border-slate-200 mb-5 text-center text-xs">
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className={`pb-2.5 sm:pb-3 font-semibold border-b-2 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center ${
                  mode === 'login'
                    ? 'border-[#107C41] text-[#107C41]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('register')}
                className={`pb-2.5 sm:pb-3 font-semibold border-b-2 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center ${
                  mode === 'register'
                    ? 'border-[#107C41] text-[#107C41]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Crear Cuenta
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('teacher')}
                className={`pb-2.5 sm:pb-3 font-semibold border-b-2 transition-colors flex items-center justify-center gap-1 cursor-pointer min-h-[44px] ${
                  mode === 'teacher'
                    ? 'border-[#107C41] text-[#107C41]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Docente</span>
              </button>
            </div>

            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {mode === 'login'
                  ? 'Ingreso de Estudiante'
                  : mode === 'register'
                  ? 'Registro de Estudiante'
                  : 'Ingreso al Panel Docente'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'login'
                  ? 'Ingresa con tu usuario/correo y contraseña registrados en la base de datos.'
                  : mode === 'register'
                  ? 'Crea tu usuario y contraseña en la base de datos para iniciar el curso.'
                  : 'Ingrese manualmente su usuario/correo institucional y contraseña docente predeterminada.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <span className="font-bold shrink-0">Error:</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" autoComplete="off">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre Completo <span className="text-[#107C41]">* (Para tu certificado)</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. María Elena Delgado Gómez"
                      className="w-full pl-9 pr-3 py-2.5 sm:py-2.5 text-base sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#107C41] focus:border-transparent transition-all min-h-[44px]"
                      required={mode === 'register'}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Verifica que esté escrito exactamente como deseas que figure en tu certificado.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {mode === 'teacher'
                    ? 'Usuario o Correo Docente'
                    : mode === 'login'
                    ? 'Usuario o Correo Electrónico'
                    : 'Correo Electrónico'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={mode === 'register' ? 'email' : 'text'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    placeholder={
                      mode === 'teacher'
                        ? 'Ingrese usuario o correo docente'
                        : mode === 'login'
                        ? 'Correo o nombre registrado'
                        : 'estudiante@correo.com'
                    }
                    className="w-full pl-9 pr-3 py-2.5 sm:py-2.5 text-base sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#107C41] focus:border-transparent transition-all min-h-[44px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {mode === 'teacher'
                    ? 'Contraseña Docente Predeterminada'
                    : mode === 'register'
                    ? 'Crear Contraseña de Acceso'
                    : 'Contraseña'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder={
                      mode === 'teacher'
                        ? 'Ingrese manualmente la contraseña docente'
                        : mode === 'register'
                        ? 'Crea tu contraseña (mín. 4 caracteres)'
                        : 'Ingresa tu contraseña registrada'
                    }
                    className="w-full pl-9 pr-10 py-2.5 sm:py-2.5 text-base sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#107C41] focus:border-transparent transition-all min-h-[44px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 sm:py-3 px-4 bg-[#107C41] hover:bg-[#185C37] disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer min-h-[48px]"
              >
                <span>
                  {isSubmitting
                    ? 'Verificando en Base de Datos...'
                    : mode === 'register'
                    ? 'Crear Cuenta y Guardar en BD'
                    : mode === 'login'
                    ? 'Verificar e Iniciar Sesión'
                    : 'Verificar Acceso Docente'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
