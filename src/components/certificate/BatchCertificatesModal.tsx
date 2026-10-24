import React from 'react';
import { StudentRecord } from '../../types/course';
import {
  Printer,
  Calendar,
  ShieldCheck,
  Sparkles,
  X,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';

interface BatchCertificatesModalProps {
  students: StudentRecord[];
  onClose: () => void;
}

export const BatchCertificatesModal: React.FC<BatchCertificatesModalProps> = ({
  students,
  onClose,
}) => {
  const culminatedStudents = students.filter((s) => s.isCulminated);

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-auto overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#E6F4EA] text-[#107C41] rounded-xl">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#107C41] block">
                Emisión de Certificados en Lote ({culminatedStudents.length} Estudiantes)
              </span>
              <p className="text-xs text-slate-500">
                Imprime o guarda en un único archivo PDF todos los diplomas de los estudiantes aprobados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrintAll}
              disabled={culminatedStudents.length === 0}
              className="flex-1 sm:flex-initial justify-center px-4 py-2.5 bg-[#107C41] hover:bg-[#185C37] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer min-h-[40px]"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Todos ({culminatedStudents.length}) en PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Container */}
        <div className="p-2 sm:p-6 lg:p-8 bg-slate-100 overflow-y-auto space-y-8 flex-1">
          {culminatedStudents.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
              No hay estudiantes culminados actualmente para emitir certificados en lote.
            </div>
          ) : (
            <>
              <p className="no-print sm:hidden text-[11px] text-slate-500 text-center font-medium">
                ← Desliza horizontalmente para previsualizar cada diploma →
              </p>
              {culminatedStudents.map((student, index) => {
                const finalScore = student.finalScore ?? 100;
                const issueDate =
                  student.certificateDate ||
                  new Date().toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });
                const certId =
                  student.certificateId || `EXCEL-CERT-2026-${8000 + index}`;

                return (
                  <div
                    key={student.id}
                    className="overflow-x-auto flex flex-col items-center batch-cert-wrapper"
                  >
                    <div className="no-print w-full max-w-4xl mb-2 flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#107C41]" />
                        Diploma #{index + 1}: {student.fullName}
                      </span>
                      <span className="font-mono text-[#107C41] bg-[#E6F4EA] px-2 py-0.5 rounded-md">
                        Promedio: {finalScore}% · {certId}
                      </span>
                    </div>

                    <div
                      className="certificate-card batch-certificate-page w-full max-w-4xl min-w-[580px] sm:min-w-0 bg-white text-slate-900 p-4 sm:p-8 lg:p-12 relative border-4 sm:border-8 border-[#107C41] shadow-xl select-none"
                      style={{
                        boxShadow: '0 20px 40px -15px rgba(16, 124, 65, 0.15)',
                      }}
                    >
                      <div className="border border-[#185C37]/30 p-3 sm:p-6 lg:p-8 relative">
                        {/* Corner Ornaments */}
                        <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-[#107C41]" />
                        <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-[#107C41]" />
                        <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-[#107C41]" />
                        <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-[#107C41]" />

                        {/* Watermark Logo */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
                          <FileSpreadsheet className="w-80 h-80 text-[#107C41]" />
                        </div>

                        {/* Certificate Header */}
                        <div className="text-center relative z-10 space-y-1 mb-6">
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="h-10 w-auto bg-white rounded p-0.5 border border-slate-200 shadow-2xs">
                              <img
                                src="/assets/aistudio/VIYVIB__1__6dde5c2b.jpg"
                                alt="Logo Ministerio de Pesca y Acuicultura"
                                className="h-8 w-auto object-contain rounded"
                              />
                            </div>
                            <div className="h-6 w-px bg-slate-300" />
                            <div className="w-9 h-9 rounded-lg bg-[#107C41] text-white flex items-center justify-center shadow-xs">
                              <FileSpreadsheet className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <span className="text-[11px] font-bold tracking-wider text-[#185C37] uppercase block">
                                Ministerio del Poder Popular de Pesca y Acuicultura
                              </span>
                              <span className="text-[9px] text-slate-500 tracking-widest uppercase block">
                                Centro de Formación y Tecnología Digital
                              </span>
                            </div>
                          </div>

                          <h1 className="font-serif-title text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 uppercase">
                            Certificado de Participación y Aprobación
                          </h1>
                          <p className="text-xs tracking-widest text-[#107C41] uppercase font-semibold">
                            Acreditación de Competencias Profesionales en Hoja de Cálculo
                          </p>
                        </div>

                        {/* Certificate Body */}
                        <div className="text-center relative z-10 space-y-4 my-8">
                          <p className="text-xs sm:text-sm text-slate-500 italic">
                            Por cuanto se certifica que
                          </p>

                          <div className="py-2 border-b-2 border-[#107C41]/30 max-w-xl mx-auto">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#185C37] tracking-wide">
                              {student.fullName}
                            </h2>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed pt-2">
                            ha cumplido y aprobado satisfactoriamente todos los requerimientos teóricos y prácticos del:
                          </p>

                          <div className="bg-[#E6F4EA]/70 py-2.5 px-6 rounded-xl border border-[#21A366]/30 max-w-xl mx-auto">
                            <span className="text-base sm:text-xl font-bold text-[#107C41] tracking-tight block">
                              "Curso Introductorio de Excel Básico"
                            </span>
                            <span className="text-[11px] text-slate-600 font-medium">
                              (12 Horas Académicas · Entorno, Fórmulas, Tablas y Visualización de Datos)
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 pt-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400">Calificación Final Obtenida:</span>
                              <strong className="text-slate-900 font-mono text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {finalScore}%
                              </strong>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#107C41]" />
                              <span className="text-slate-400">Fecha de Emisión:</span>
                              <strong className="text-slate-900">{issueDate}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Signatures */}
                        <div className="relative z-10 mt-12 pt-4 grid grid-cols-2 gap-8 max-w-2xl mx-auto text-center">
                          <div className="space-y-1">
                            <div className="h-14 flex items-end justify-center">
                              <span className="font-signature text-2xl sm:text-3xl text-slate-800 tracking-wider">
                                Josmar Puerta
                              </span>
                            </div>
                            <div className="w-48 mx-auto border-t border-slate-400 pt-1.5">
                              <span className="text-xs font-bold text-slate-900 block">
                                Lcdo. Josmar Puerta
                              </span>
                              <span className="text-[11px] text-[#107C41] font-medium block">
                                Instructor
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="h-14 flex items-end justify-center">
                              <span className="font-signature text-2xl sm:text-3xl text-slate-800 tracking-wider">
                                Mirla Escalona
                              </span>
                            </div>
                            <div className="w-48 mx-auto border-t border-slate-400 pt-1.5">
                              <span className="text-xs font-bold text-slate-900 block">
                                Lcda. Mirla Escalona
                              </span>
                              <span className="text-[11px] text-[#107C41] font-medium block">
                                Directora General
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>CÓDIGO DE VERIFICACIÓN: {certId}</span>
                          <span className="flex items-center gap-1 text-[#107C41]">
                            <ShieldCheck className="w-3 h-3" /> Acreditación MinPesca Válida
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer Controls */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Cada diploma se separa automáticamente en una página horizontal independiente al imprimir o guardar como PDF.
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Cerrar Vista en Lote
          </button>
        </div>
      </div>
    </div>
  );
};
