import React, { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle2,
  Award,
  ArrowRight,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PHASES_CONFIG } from '../../data/courseData';
import { VideoPlayer } from '../common/VideoPlayer';

interface Phase1Props {
  onComplete: () => void;
  isCompleted: boolean;
}

export const Phase1Introduction: React.FC<Phase1Props> = ({
  onComplete,
  isCompleted,
}) => {
  const [expandedSyllabus, setExpandedSyllabus] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const toggleSyllabus = (index: number) => {
    setExpandedSyllabus(expandedSyllabus === index ? null : index);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#107C41] via-[#185C37] to-[#144d2d] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:20px_20px]" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fase 1 · Introducción y Fundamentos</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Bienvenido al Curso Introductorio de Excel Básico
          </h1>

          <p className="text-emerald-50 text-sm leading-relaxed mb-6">
            Microsoft Excel es la herramienta estándar mundial en análisis de datos, finanzas empresariales y gestión de proyectos. A lo largo de esta aula virtual aprenderás a interactuar con soltura en el entorno de hojas de cálculo, estructurar fórmulas indispensables y generar reportes profesionales listos para la toma de decisiones.
          </p>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-emerald-200 block text-[11px]">Duración Estimada</span>
              <span className="font-bold text-white text-sm">12 Horas Académicas</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-emerald-200 block text-[11px]">Metodología</span>
              <span className="font-bold text-white text-sm">Aprender Haciendo</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-emerald-200 block text-[11px]">Nota Mínima</span>
              <span className="font-bold text-white text-sm">70% de Aprobación</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-emerald-200 block text-[11px]">Certificado</span>
              <span className="font-bold text-white text-sm">Firmas Oficiales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Tutorial de Referencia en YouTube · Fase 1 */}
      <VideoPlayer
        videoUrl="https://www.youtube.com/watch?v=W78PamXb5VA"
        title="Curso de Excel Básico - Capítulo 0: Introducción para Principiantes"
        topicBadge="YouTube · Fase 1"
        channelName="Dostin Hurtado"
        durationLabel="14:20 min"
        demoTopic="interface"
        caption="Video tutorial introductorio en YouTube sobre qué es Microsoft Excel, cómo empezar desde cero con un libro en blanco, conceptos fundamentales de celdas, filas y columnas, y primeros pasos prácticos."
        keyTakeaways={[
          'Conceptos básicos de libros y hojas en Excel',
          'Creación y guardado de archivos (.xlsx)',
          'Navegación inicial para principiantes',
        ]}
        relatedVideos={[
          {
            videoId: 'W78PamXb5VA',
            title: 'Capítulo 0: Introducción a Excel para Principiantes',
            channel: 'Dostin Hurtado',
          },
          {
            videoId: 'yKWFMgurUnU',
            title: 'Curso Excel Básico: Primeros Pasos desde Cero',
            channel: 'Dostin Hurtado',
          },
        ]}
      />

      {/* 4 Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Objetivos */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] text-[#107C41] flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Objetivos de Aprendizaje</h2>
              <p className="text-xs text-slate-500">Lo que serás capaz de lograr al culminar</p>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0 mt-0.5" />
              <span>Identificar con precisión la Cinta de Opciones, Barra de Fórmulas y Cuadro de Nombres.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0 mt-0.5" />
              <span>Aplicar formatos numéricos esenciales (Moneda, Porcentaje, Fecha y Contabilidad).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0 mt-0.5" />
              <span>Construir operaciones matemáticas y funciones clave: <code className="text-[#107C41] font-mono bg-slate-100 px-1 py-0.5 rounded">=SUMA</code>, <code className="text-[#107C41] font-mono bg-slate-100 px-1 py-0.5 rounded">=PROMEDIO</code>, <code className="text-[#107C41] font-mono bg-slate-100 px-1 py-0.5 rounded">=MAX</code> y <code className="text-[#107C41] font-mono bg-slate-100 px-1 py-0.5 rounded">=MIN</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0 mt-0.5" />
              <span>Dar formato estructurado de Tabla, filtrar información y generar gráficos representativos.</span>
            </li>
          </ul>
        </div>

        {/* Metodología */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] text-[#107C41] flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Metodología y Dinámica</h2>
              <p className="text-xs text-slate-500">Enfoque 100% interactivo y práctico</p>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0 mt-0.5" />
              <span><strong>Desbloqueo Secuencial:</strong> Debes completar cada fase en orden para asimilar el conocimiento paso a paso.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0 mt-0.5" />
              <span><strong>Simuladores en Vivo:</strong> Manipula hojas de cálculo integradas directamente en el navegador sin salir de la plataforma.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0 mt-0.5" />
              <span><strong>Evaluación Mixta:</strong> Examen teórico en Fase 5 (50%) + Proyecto práctico en Fase 6 (50%).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0 mt-0.5" />
              <span><strong>Acreditación Inmediata:</strong> Al obtener 70% o más, se emite automáticamente tu certificado digital con validación institucional.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Temario General del Curso */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Temario General del Curso (6 Fases)
            </h2>
            <p className="text-xs text-slate-500">
              Conoce el recorrido formativo estructurado para ti
            </p>
          </div>
          <span className="text-xs font-semibold text-[#107C41] bg-[#E6F4EA] px-2.5 py-1 rounded-lg">
            Plan Oficial 2026
          </span>
        </div>

        <div className="space-y-2">
          {PHASES_CONFIG.map((phase, idx) => (
            <div
              key={phase.id}
              className="border border-slate-100 rounded-lg overflow-hidden transition-colors hover:border-slate-300"
            >
              <button
                onClick={() => toggleSyllabus(idx)}
                className="w-full p-3.5 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-[#107C41] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {phase.id}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {phase.title}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {phase.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {phase.duration}
                  </span>
                  {expandedSyllabus === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedSyllabus === idx && (
                <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                  <p className="mb-2">{phase.shortDesc}</p>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-700">
                    <strong>Contenido Clave:</strong> {
                      idx === 0 ? 'Bienvenida, objetivos, ficha técnica y compromiso del estudiante.' :
                      idx === 1 ? 'Cinta de opciones, barra de fórmulas fx, cuadro de nombres, navegación con teclado y ratón.' :
                      idx === 2 ? 'Formatos de celdas (moneda, fecha, porcentaje), suma, resta, multiplicación, división, promedio, máx y mín.' :
                      idx === 3 ? 'Estructura de tablas, filtros rápidos, ordenación alfabética/numérica y creación de gráficos de barras/pastel.' :
                      idx === 4 ? 'Cuestionario de evaluación teórica de selección simple con retroalimentación automática.' :
                      'Descarga de plantilla de ejercicio, resolución en computadora y carga de archivo para evaluación con rúbrica.'
                    }
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructors & Directorial Staff */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#107C41] text-white flex items-center justify-center font-bold text-lg shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Equipo Docente e Institucional
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              <strong>Lcdo. Josmar Puerta</strong> (Instructor Principal) &amp; <strong>Lcda. Mirla Escalona</strong> (Directora General)
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 text-center sm:text-right">
          <span>Aula Virtual Acreditada · Versión 2026</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="text-xs text-slate-500">
          {isCompleted ? (
            <span className="text-[#107C41] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Has completado la Fase 1. Puedes avanzar libremente.
            </span>
          ) : (
            <span>Al hacer clic se marcará la Fase 1 como completada y se desbloqueará la Fase 2.</span>
          )}
        </div>

        <button
          onClick={onComplete}
          className="w-full sm:w-auto px-6 py-3 bg-[#107C41] hover:bg-[#185C37] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Completar Fase 1 y Continuar a Fase 2</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
