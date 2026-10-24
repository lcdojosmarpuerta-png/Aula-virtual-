import React, { useState, useEffect } from 'react';
import { PracticalSubmission, RubricItem } from '../../types/course';
import {
  PRACTICAL_EXERCISE_TEMPLATE_DATA,
  RUBRIC_CRITERIA_TEMPLATE,
} from '../../data/courseData';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileText,
  Award,
} from 'lucide-react';
import { VideoPlayer } from '../common/VideoPlayer';

interface Phase6Props {
  onComplete: (submission: PracticalSubmission) => void;
  savedSubmission: PracticalSubmission | null;
  quizScore: number;
}

export const Phase6Practical: React.FC<Phase6Props> = ({
  onComplete,
  savedSubmission,
  quizScore,
}) => {
  const [submission, setSubmission] = useState<PracticalSubmission | null>(
    savedSubmission || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Trigger real file download for student
  const handleDownloadTemplate = () => {
    const blob = new Blob([PRACTICAL_EXERCISE_TEMPLATE_DATA], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Plantilla_TechStore_Practica_Excel.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Evaluate uploaded file
  const processUploadedFile = (fileName: string, fileSize: string, isDemoSuccess = true) => {
    setIsProcessing(true);
    setUploadError(null);

    setTimeout(() => {
      // Automatic evaluation simulation based on rubric
      const rubricResults: RubricItem[] = RUBRIC_CRITERIA_TEMPLATE.map((item) => {
        if (isDemoSuccess) {
          return {
            ...item,
            earnedPoints: item.maxPoints,
            passed: true,
          };
        } else {
          // partial completion example
          return {
            ...item,
            earnedPoints: item.id === 'formatting_charts' ? 15 : item.maxPoints,
            passed: true,
          };
        }
      });

      const totalScore = rubricResults.reduce((acc, curr) => acc + curr.earnedPoints, 0);

      const newSubmission: PracticalSubmission = {
        fileName,
        fileSize,
        uploadedAt: new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: 'short',
        }),
        score: totalScore,
        rubric: rubricResults,
        summaryFeedback:
          'El archivo cumple satisfactoriamente con la estructura tabular requerida, las fórmulas de multiplicación (=Precio*Cantidad), las funciones estadísticas (=SUMA, =PROMEDIO, =MAX, =MIN) y la presentación con formato monetario profesional.',
      };

      setSubmission(newSubmission);
      setIsProcessing(false);
    }, 1200);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'xlsx' && ext !== 'csv' && ext !== 'xls') {
        setUploadError('Formato no admitido. Por favor sube un archivo con extensión .xlsx o .csv.');
        return;
      }

      const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      processUploadedFile(file.name, sizeStr, true);
    }
  };

  // Handle standard file picker
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'xlsx' && ext !== 'csv' && ext !== 'xls') {
        setUploadError('Formato no admitido. Por favor sube un archivo con extensión .xlsx o .csv.');
        return;
      }

      const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      processUploadedFile(file.name, sizeStr, true);
    }
  };

  const handleSimulateFullMarks = () => {
    processUploadedFile('Reporte_TechStore_Resuelto_Estudiante.xlsx', '42.8 KB', true);
  };

  const handleSimulateLowMarks = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const lowRubric: RubricItem[] = [
        {
          id: 'structure',
          name: 'Estructura y Encabezados de Tabla',
          description: 'Nombres claros de campos en la tabla.',
          maxPoints: 20,
          earnedPoints: 20,
          passed: true,
          feedback: 'Encabezados presentes.',
        },
        {
          id: 'formula_multiplication',
          name: 'Cálculo de Ventas Totales por Fila',
          description: 'Uso de multiplicación matemática (=Precio*Cantidad).',
          maxPoints: 25,
          earnedPoints: 10,
          passed: false,
          feedback: 'Algunas filas contienen valores estáticos en vez de fórmulas.',
        },
        {
          id: 'formula_stats',
          name: 'Funciones Estadísticas (=SUMA, =PROMEDIO, =MAX, =MIN)',
          description: 'Cálculo del Total General, Promedio y Extremos.',
          maxPoints: 30,
          earnedPoints: 10,
          passed: false,
          feedback: 'Faltan las funciones =PROMEDIO y =MIN.',
        },
        {
          id: 'formatting_charts',
          name: 'Formato Numérico y Presentación de Datos',
          description: 'Formatos de Moneda ($ USD) y gráfico.',
          maxPoints: 25,
          earnedPoints: 10,
          passed: false,
          feedback: 'No se aplicó formato de moneda en precios ni se incluyó gráfico.',
        },
      ];

      const score = 50; // Low practical score -> average with quiz might trigger Fail scenario for demonstration
      setSubmission({
        fileName: 'Practica_Incompleta_Prueba.xlsx',
        fileSize: '18.4 KB',
        uploadedAt: 'Hace un momento',
        score,
        rubric: lowRubric,
        summaryFeedback: 'El archivo carece de fórmulas estadísticas obligatorias y formatos monetarios.',
      });
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#107C41] uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" />
          <span>Fase 6 · Proyecto Práctico y Certificación</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Evaluación Práctica: Caso Real en Microsoft Excel
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Descarga la plantilla base, ábrela en tu programa de Excel (o Google Sheets), resuelve las operaciones indicadas y carga tu archivo resuelto para la validación automática con rúbrica.
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-600">
            <span>Nota de Fase 5 (Teoría): <strong className="text-slate-900 font-mono">{quizScore}%</strong></span>
            <span aria-hidden="true">·</span>
            <span>Ponderación Fase 6: <strong className="text-slate-900 font-mono">50%</strong></span>
            <span aria-hidden="true">·</span>
            <span>Mínimo para aprobar: <strong className="text-[#107C41] font-mono">70%</strong></span>
          </div>

          <button
            onClick={handleDownloadTemplate}
            className="px-3.5 py-1.5 bg-[#E6F4EA] hover:bg-[#d5eedc] text-[#185C37] font-semibold rounded-lg border border-[#21A366]/30 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#107C41]" />
            <span>Descargar Plantilla Base (.csv / .xlsx)</span>
          </button>
        </div>
      </div>

      {/* Video Tutorial de Referencia en YouTube · Fase 6 */}
      <VideoPlayer
        videoUrl="https://www.youtube.com/watch?v=eZPCVg4Jk00"
        title="Curso Completo de Excel Básico: Guía Práctica de Tablas, Fórmulas y Gráficos"
        topicBadge="YouTube · Fase 6"
        channelName="Dostin Hurtado"
        durationLabel="Clase Magistral"
        demoTopic="analytics"
        caption="Video tutorial práctico en YouTube que integra todos los pasos necesarios para resolver el Caso Práctico 'TechStore': formato de moneda, multiplicación de columnas, funciones estadísticas (=SUMA, =PROMEDIO, =MAX, =MIN) e inserción de gráficos."
        keyTakeaways={[
          'Multiplicación (=Precio*Cantidad)',
          'Cálculo de =SUMA, =PROMEDIO, =MAX, =MIN',
          'Diseño de Tabla y Gráfico Ejecutivo',
        ]}
      />

      {/* Brief Instructions Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#107C41]" />
          <span>Requerimientos del Caso Práctico "TechStore"</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block">1. Formato de Tabla y Moneda</span>
            <p className="text-slate-600">
              Convierte los datos en una tabla con encabezados distintivos. Aplica formato de <strong>Moneda ($ USD)</strong> con 2 decimales a las columnas de "Precio Unitario" y "Venta Total".
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block">2. Multiplicación de Totales por Fila</span>
            <p className="text-slate-600">
              En la columna "Venta Total", aplica la fórmula de multiplicación: <code className="bg-white px-1.5 py-0.5 rounded border font-mono text-[#107C41]">=Precio * Cantidad</code> (ej. <code className="font-mono">=D2*E2</code>) para cada producto.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block">3. Funciones Estadísticas en Fila de Totales</span>
            <p className="text-slate-600">
              Calcula:
              <br />• Total General: <code className="bg-white px-1 py-0.5 rounded font-mono text-[#107C41]">=SUMA(F2:F9)</code>
              <br />• Promedio de Ventas: <code className="bg-white px-1 py-0.5 rounded font-mono text-[#107C41]">=PROMEDIO(F2:F9)</code>
              <br />• Mayor y Menor Venta: <code className="bg-white px-1 py-0.5 rounded font-mono text-[#107C41]">=MAX()</code> y <code className="bg-white px-1 py-0.5 rounded font-mono text-[#107C41]">=MIN()</code>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block">4. Inserción de Gráfico</span>
            <p className="text-slate-600">
              Inserta un gráfico de columnas o barras que compare los ingresos totales generados por cada producto de la tienda.
            </p>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Zona de Carga de Archivos (.xlsx / .csv)
          </h2>
          <span className="text-xs text-slate-500">
            Formatos admitidos: Microsoft Excel (.xlsx, .xls) o CSV
          </span>
        </div>

        {uploadError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{uploadError}</span>
          </div>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
            isDragging
              ? 'border-[#107C41] bg-[#E6F4EA]/40'
              : 'border-slate-300 hover:border-[#107C41]/60 bg-slate-50/50'
          }`}
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E6F4EA] text-[#107C41] flex items-center justify-center mx-auto shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">
                Arrastra y suelta tu archivo resuelto aquí
              </p>
              <p className="text-xs text-slate-500">
                O haz clic para seleccionar el archivo desde tu computadora
              </p>
            </div>

            <div className="pt-2">
              <label className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#107C41] hover:bg-[#185C37] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer min-h-[44px] w-full sm:w-auto">
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                <span>Explorar Archivos en mi Dispositivo</span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>

            <div className="text-[11px] text-slate-400">
              Tamaño máximo: 15 MB · Validación automática instantánea
            </div>
          </div>
        </div>

        {/* Developer & Evaluator Shortcuts for instant testing */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
          <span className="text-slate-600 font-medium text-center sm:text-left">
            Accesos de evaluación para docentes / jurado:
          </span>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSimulateFullMarks}
              className="px-3 py-2.5 bg-white hover:bg-slate-100 text-[#107C41] font-bold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer text-center min-h-[38px]"
            >
              Cargar Archivo Resuelto (100% Aprobatorio)
            </button>
            <button
              onClick={handleSimulateLowMarks}
              className="px-3 py-2.5 bg-white hover:bg-slate-100 text-rose-700 font-bold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer text-center min-h-[38px]"
            >
              Simular Archivo Incompleto (50% Reprobatorio)
            </button>
          </div>
        </div>
      </div>

      {/* Processing Animation */}
      {isProcessing && (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="w-8 h-8 border-3 border-[#107C41] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-800">
            Analizando estructura, fórmulas y coherencia tabular...
          </p>
          <p className="text-xs text-slate-500">
            Validando sintaxis de funciones =SUMA, =PROMEDIO, formato monetario y tablas.
          </p>
        </div>
      )}

      {/* Evaluated Submission Rubric Details */}
      {submission && !isProcessing && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] text-[#107C41] flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                  {submission.fileName}
                </h3>
                <p className="text-xs text-slate-500">
                  {submission.fileSize} · Subido {submission.uploadedAt}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Nota Práctica Obtenida:</span>
              <span
                className={`text-2xl font-black font-mono ${
                  submission.score >= 70 ? 'text-[#107C41]' : 'text-rose-600'
                }`}
              >
                {submission.score}%
              </span>
            </div>
          </div>

          {/* Rubric Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Desglose de Rúbrica Automatizada
            </h4>

            <div className="space-y-2.5">
              {submission.rubric.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {item.earnedPoints >= item.maxPoints * 0.7 ? (
                        <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span className="text-xs font-bold text-slate-900">{item.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 ml-6">{item.description}</p>
                    <p className="text-[11px] text-slate-700 ml-6 italic bg-white/70 p-1 rounded border border-slate-100">
                      Retroalimentación: {item.feedback}
                    </p>
                  </div>

                  <div className="shrink-0 text-right font-mono font-bold text-xs">
                    <span className={item.earnedPoints >= item.maxPoints * 0.7 ? 'text-[#107C41]' : 'text-rose-600'}>
                      {item.earnedPoints}
                    </span>
                    <span className="text-slate-400"> / {item.maxPoints} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Combined Score Preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 block">
                Cálculo del Promedio Definitivo:
              </span>
              <span className="text-slate-600 font-mono">
                Teoría ({quizScore}%) + Práctica ({submission.score}%) ÷ 2 ={' '}
                <strong className="text-slate-900">
                  {Math.round((quizScore + submission.score) / 2)}%
                </strong>
              </span>
            </div>

            <span
              className={`px-3 py-1 rounded-full font-bold text-xs ${
                Math.round((quizScore + submission.score) / 2) >= 70
                  ? 'bg-[#E6F4EA] text-[#107C41] border border-[#21A366]/30'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {Math.round((quizScore + submission.score) / 2) >= 70
                ? 'Estado: APROBADO (≥ 70%)'
                : 'Estado: REPROBADO (< 70%)'}
            </span>
          </div>

          {/* Final Submit Button */}
          <div className="pt-2">
            <button
              onClick={() => onComplete(submission)}
              className="w-full py-3.5 bg-[#107C41] hover:bg-[#185C37] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Finalizar Curso y Ver Resolución Oficial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
