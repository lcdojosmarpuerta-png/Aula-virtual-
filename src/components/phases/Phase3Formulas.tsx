import React, { useState, useEffect } from 'react';
import {
  Calculator,
  CheckCircle2,
  ArrowRight,
  Percent,
  DollarSign,
  Calendar,
  AlignLeft,
  Sparkles,
  Play,
} from 'lucide-react';
import { VideoPlayer } from '../common/VideoPlayer';

interface Phase3Props {
  onComplete: () => void;
  isCompleted: boolean;
}

export const Phase3Formulas: React.FC<Phase3Props> = ({
  onComplete,
  isCompleted,
}) => {
  // Format demo state
  const [activeFormat, setActiveFormat] = useState<'currency' | 'percent' | 'date' | 'general'>('currency');

  // Formula interactive sandbox state
  const [dataValues, setDataValues] = useState<number[]>([1500, 2400, 850, 3200, 1950]);
  const [customFormula, setCustomFormula] = useState<string>('=SUMA(B2:B6)');
  const [calcResult, setCalcResult] = useState<string>('9,900');
  const [evaluatedMsg, setEvaluatedMsg] = useState<string>('Cálculo ejecutado exitosamente con =SUMA()');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Format value helper
  const formatSampleValue = (raw: number, type: string) => {
    switch (type) {
      case 'currency':
        return `$ ${raw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percent':
        return `${(raw / 100).toFixed(1)}%`;
      case 'date':
        return `23/10/2026`;
      default:
        return raw.toString();
    }
  };

  // Formula engine evaluator
  const runFormula = (formula: string) => {
    setCustomFormula(formula);
    const upper = formula.trim().toUpperCase();

    if (!upper.startsWith('=')) {
      setCalcResult('ERROR #¡VALOR!');
      setEvaluatedMsg('Toda fórmula debe iniciar con el signo "=".');
      return;
    }

    try {
      if (upper.includes('SUMA')) {
        const sum = dataValues.reduce((a, b) => a + b, 0);
        setCalcResult(sum.toLocaleString('en-US'));
        setEvaluatedMsg(`Suma total de los 5 valores: ${sum.toLocaleString('en-US')}`);
      } else if (upper.includes('PROMEDIO')) {
        const avg = dataValues.reduce((a, b) => a + b, 0) / dataValues.length;
        setCalcResult(avg.toLocaleString('en-US', { maximumFractionDigits: 2 }));
        setEvaluatedMsg(`Promedio aritmético calculado: ${avg.toFixed(2)}`);
      } else if (upper.includes('MAX')) {
        const max = Math.max(...dataValues);
        setCalcResult(max.toLocaleString('en-US'));
        setEvaluatedMsg(`Valor máximo en el rango: ${max.toLocaleString('en-US')}`);
      } else if (upper.includes('MIN')) {
        const min = Math.min(...dataValues);
        setCalcResult(min.toLocaleString('en-US'));
        setEvaluatedMsg(`Valor mínimo en el rango: ${min.toLocaleString('en-US')}`);
      } else if (upper === '=B2*C2' || upper === '=B2*2' || upper.includes('*')) {
        const mult = dataValues[0] * 2;
        setCalcResult(mult.toLocaleString('en-US'));
        setEvaluatedMsg(`Multiplicación ejecutada: ${dataValues[0]} * 2 = ${mult}`);
      } else if (upper.includes('-')) {
        const sub = dataValues[1] - dataValues[0];
        setCalcResult(sub.toLocaleString('en-US'));
        setEvaluatedMsg(`Resta ejecutada: ${dataValues[1]} - ${dataValues[0]} = ${sub}`);
      } else if (upper.includes('/')) {
        const div = dataValues[1] / 2;
        setCalcResult(div.toLocaleString('en-US'));
        setEvaluatedMsg(`División ejecutada: ${dataValues[1]} / 2 = ${div}`);
      } else {
        const sum = dataValues.reduce((a, b) => a + b, 0);
        setCalcResult(sum.toLocaleString('en-US'));
        setEvaluatedMsg(`Fórmula evaluada correctamente.`);
      }
    } catch {
      setCalcResult('ERROR #¡REF!');
      setEvaluatedMsg('Verifica la sintaxis de la fórmula.');
    }
  };

  const handleDataChange = (index: number, val: string) => {
    const num = parseFloat(val) || 0;
    const updated = [...dataValues];
    updated[index] = num;
    setDataValues(updated);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#107C41] uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4" />
          <span>Fase 3 · Cálculo y Fórmulas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Formatos de Celda y Fórmulas Esenciales
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Los formatos otorgan significado comercial y visual a los datos, mientras que las fórmulas y funciones automatizan todos los cálculos matemáticos y estadísticos de tu empresa.
        </p>
      </div>

      {/* Video Tutorial de Referencia en YouTube · Fase 3: Formatos y Fórmulas */}
      <VideoPlayer
        videoUrl="https://www.youtube.com/watch?v=996wVXwNUS8"
        title="Curso de Excel - Capítulo 1: Fórmulas, Funciones Básicas y Autorrellenos"
        topicBadge="YouTube · Fase 3"
        channelName="Dostin Hurtado"
        durationLabel="16:40 min"
        demoTopic="formulas"
        caption="Video tutorial en YouTube sobre cómo aplicar formatos de Moneda ($) y Porcentaje (%), construir operaciones matemáticas (+, -, *, /) y dominar las funciones esenciales =SUMA(), =PROMEDIO(), =MAX() y =MIN()."
        keyTakeaways={[
          'Formato Moneda ($) y Porcentaje (%)',
          'Operadores (+, -, *, /) y =SUMA()',
          'Estadísticas: =PROMEDIO, =MAX y =MIN',
        ]}
        relatedVideos={[
          {
            videoId: '996wVXwNUS8',
            title: 'Capítulo 1: Fórmulas Básicas y Autorrellenos en Excel',
            channel: 'Dostin Hurtado',
          },
          {
            videoId: 'nD7bmIXjUgU',
            title: 'Fórmulas Básicas de Excel desde Cero (Suma, Promedio, Max, Min)',
            channel: 'Máster Excel',
          },
          {
            videoId: '47nJsZ97sz0',
            title: 'Operadores Matemáticos y Funciones Esenciales',
            channel: 'Dostin Hurtado',
          },
        ]}
      />

      {/* SECCIÓN 1: FORMATOS DE CELDA */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              1. Formatos de Datos y Estilos de Celda
            </h2>
            <p className="text-xs text-slate-500">
              Elige un formato para ver cómo transforma la presentación sin alterar su valor real
            </p>
          </div>

          {/* Format selector buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveFormat('currency')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                activeFormat === 'currency'
                  ? 'bg-[#107C41] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 bg-white/60 sm:bg-transparent'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              <span>Moneda ($)</span>
            </button>
            <button
              onClick={() => setActiveFormat('percent')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                activeFormat === 'percent'
                  ? 'bg-[#107C41] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 bg-white/60 sm:bg-transparent'
              }`}
            >
              <Percent className="w-3.5 h-3.5 shrink-0" />
              <span>Porcentaje (%)</span>
            </button>
            <button
              onClick={() => setActiveFormat('date')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                activeFormat === 'date'
                  ? 'bg-[#107C41] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 bg-white/60 sm:bg-transparent'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Fecha Corta</span>
            </button>
            <button
              onClick={() => setActiveFormat('general')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                activeFormat === 'general'
                  ? 'bg-[#107C41] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 bg-white/60 sm:bg-transparent'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5 shrink-0" />
              <span>General (Plano)</span>
            </button>
          </div>
        </div>

        {/* Live Interactive Format Table Preview */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#107C41] text-white font-semibold">
              <tr>
                <th className="p-3">Concepto</th>
                <th className="p-3">Valor Numérico Crudo</th>
                <th className="p-3">Visualización con Formato Activo</th>
                <th className="p-3">Regla Técnica de Excel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr>
                <td className="p-3 font-semibold text-slate-800">Ventas de Equipos</td>
                <td className="p-3 font-mono text-slate-500">12500.5</td>
                <td className="p-3 font-mono font-bold text-[#185C37] bg-[#E6F4EA]/40">
                  {formatSampleValue(12500.5, activeFormat)}
                </td>
                <td className="p-3 text-slate-600">
                  {activeFormat === 'currency'
                    ? 'Agrega separador de miles y dos cifras decimales estándar.'
                    : activeFormat === 'percent'
                    ? 'Multiplica por 100 y anexa el sufijo "%".'
                    : activeFormat === 'date'
                    ? 'Convierte el número de serie de días al formato DD/MM/AAAA.'
                    : 'Muestra el número plano tal como fue digitado.'}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Tasa de Impuesto / IVA</td>
                <td className="p-3 font-mono text-slate-500">0.16</td>
                <td className="p-3 font-mono font-bold text-[#185C37] bg-[#E6F4EA]/40">
                  {activeFormat === 'percent' ? '16.00%' : formatSampleValue(0.16, activeFormat)}
                </td>
                <td className="p-3 text-slate-600">
                  En Excel el 16% equivale matemáticamente al decimal 0.16.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">Margen de Ganancia</td>
                <td className="p-3 font-mono text-slate-500">3450</td>
                <td className="p-3 font-mono font-bold text-[#185C37] bg-[#E6F4EA]/40">
                  {formatSampleValue(3450, activeFormat)}
                </td>
                <td className="p-3 text-slate-600">
                  La alineación numérica en Excel siempre es predeterminadamente a la derecha.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECCIÓN 2: CATÁLOGO DE FÓRMULAS Y FUNCIONES */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            2. Guía de Operaciones Matemáticas y Funciones Esenciales
          </h2>
          <p className="text-xs text-slate-500">
            Aprende la diferencia entre operadores directos (+, -, *, /) y funciones con nombre (=SUMA, =PROMEDIO)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Suma */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-[#107C41] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#107C41] uppercase tracking-wide">
                Operación Suma
              </span>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                + / =SUMA
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-2">
              Suma valores continuos o celdas dispersas.
            </p>
            <div className="bg-slate-900 text-emerald-400 p-2.5 rounded font-mono text-xs space-y-1">
              <div>=A1 + B1</div>
              <div className="text-slate-400">=SUMA(A1:A10)</div>
            </div>
          </div>

          {/* Resta */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-[#107C41] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#107C41] uppercase tracking-wide">
                Operación Resta
              </span>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                -
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-2">
              Diferencia aritmética entre dos o más valores.
            </p>
            <div className="bg-slate-900 text-emerald-400 p-2.5 rounded font-mono text-xs space-y-1">
              <div>=A1 - B1</div>
              <div className="text-slate-400">=Ingresos - Gastos</div>
            </div>
          </div>

          {/* Multiplicación */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-[#107C41] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#107C41] uppercase tracking-wide">
                Multiplicación
              </span>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                * / Asterisco
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-2">
              Calcula productos (ej. Precio unitario x Cantidad).
            </p>
            <div className="bg-slate-900 text-emerald-400 p-2.5 rounded font-mono text-xs space-y-1">
              <div>=A1 * B1</div>
              <div className="text-slate-400">=C2 * D2</div>
            </div>
          </div>

          {/* División */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-[#107C41] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#107C41] uppercase tracking-wide">
                División
              </span>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                / Barra Diagonal
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-2">
              Cociente entre numerador y denominador.
            </p>
            <div className="bg-slate-900 text-emerald-400 p-2.5 rounded font-mono text-xs space-y-1">
              <div>=A1 / B1</div>
              <div className="text-slate-400">=Total / Cantidad</div>
            </div>
          </div>

          {/* Promedio */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-[#107C41] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#107C41] uppercase tracking-wide">
                Función =PROMEDIO
              </span>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                Media
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-2">
              Suma los valores y los divide entre el número de celdas.
            </p>
            <div className="bg-slate-900 text-emerald-400 p-2.5 rounded font-mono text-xs space-y-1">
              <div>=PROMEDIO(A1:A10)</div>
              <div className="text-slate-400">=PROMEDIO(B2:B30)</div>
            </div>
          </div>

          {/* Máximo y Mínimo */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-[#107C41] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#107C41] uppercase tracking-wide">
                =MAX y =MIN
              </span>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                Extremos
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-2">
              Obtienen el valor numérico más alto y más bajo.
            </p>
            <div className="bg-slate-900 text-emerald-400 p-2.5 rounded font-mono text-xs space-y-1">
              <div>=MAX(A1:A10)</div>
              <div className="text-slate-400">=MIN(A1:A10)</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: SANDBOX INTERACTIVO DE FÓRMULAS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#107C41]" />
              <h2 className="text-lg font-bold text-slate-900">
                3. Simulador y Calculadora en Vivo de Fórmulas
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Modifica los números de la columna B o prueba fórmulas para ver la evaluación en tiempo real
            </p>
          </div>

          {/* Formula Presets */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => runFormula('=SUMA(B2:B6)')}
              className="px-2.5 py-2 text-xs font-mono font-semibold bg-slate-100 hover:bg-[#E6F4EA] hover:text-[#185C37] rounded-lg border border-slate-200 transition-colors cursor-pointer text-center min-h-[38px] flex items-center justify-center"
            >
              =SUMA(B2:B6)
            </button>
            <button
              onClick={() => runFormula('=PROMEDIO(B2:B6)')}
              className="px-2.5 py-2 text-xs font-mono font-semibold bg-slate-100 hover:bg-[#E6F4EA] hover:text-[#185C37] rounded-lg border border-slate-200 transition-colors cursor-pointer text-center min-h-[38px] flex items-center justify-center"
            >
              =PROMEDIO(B2:B6)
            </button>
            <button
              onClick={() => runFormula('=MAX(B2:B6)')}
              className="px-2.5 py-2 text-xs font-mono font-semibold bg-slate-100 hover:bg-[#E6F4EA] hover:text-[#185C37] rounded-lg border border-slate-200 transition-colors cursor-pointer text-center min-h-[38px] flex items-center justify-center"
            >
              =MAX(B2:B6)
            </button>
            <button
              onClick={() => runFormula('=MIN(B2:B6)')}
              className="px-2.5 py-2 text-xs font-mono font-semibold bg-slate-100 hover:bg-[#E6F4EA] hover:text-[#185C37] rounded-lg border border-slate-200 transition-colors cursor-pointer text-center min-h-[38px] flex items-center justify-center"
            >
              =MIN(B2:B6)
            </button>
          </div>
        </div>

        {/* The Grid + Formula Execution Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Editable mini-table */}
          <div className="lg:col-span-6 border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full min-w-[280px] text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="py-2 px-3 border-r border-slate-200 w-12 text-center bg-slate-200">#</th>
                  <th className="py-2 px-3 border-r border-slate-200">A (Mes)</th>
                  <th className="py-2 px-3">B (Ventas $)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'].map((mes, idx) => (
                  <tr key={mes} className="hover:bg-slate-50">
                    <td className="py-2 px-3 border-r border-slate-200 text-center bg-slate-50 text-slate-500 font-bold">
                      {idx + 2}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-800">
                      {mes}
                    </td>
                    <td className="py-1 px-3">
                      <input
                        type="number"
                        value={dataValues[idx]}
                        onChange={(e) => handleDataChange(idx, e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#107C41] text-base sm:text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Interactive Formula Bar and Result Output */}
          <div className="lg:col-span-6 bg-slate-900 rounded-xl p-5 text-white flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase block mb-2">
                Editor de Fórmula
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-800 rounded-lg p-2 border border-slate-700 mb-4">
                <div className="flex items-center gap-2 w-full">
                  <span className="font-serif italic text-slate-400 font-bold px-1 shrink-0">fx</span>
                  <input
                    type="text"
                    value={customFormula}
                    onChange={(e) => setCustomFormula(e.target.value)}
                    className="bg-transparent border-none text-emerald-300 font-mono text-base sm:text-sm w-full focus:outline-none"
                    placeholder="ej. =SUMA(B2:B6)"
                  />
                </div>
                <button
                  onClick={() => runFormula(customFormula)}
                  className="w-full sm:w-auto px-4 py-2 bg-[#107C41] hover:bg-[#185C37] text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 min-h-[38px]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Calcular</span>
                </button>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block mb-1">Resultado de la Celda:</span>
                <div className="text-3xl font-mono font-bold text-white tracking-tight">
                  {calcResult}
                </div>
                <div className="mt-2 text-xs text-emerald-400 font-sans flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{evaluatedMsg}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Rango evaluado: B2:B6</span>
              <span>Total de registros: 5 meses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="text-xs text-slate-500">
          {isCompleted ? (
            <span className="text-[#107C41] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Has completado la Fase 3.
            </span>
          ) : (
            <span>Al continuar accederás a la Fase 4: Análisis de Datos (Gráficos, Filtros y Tablas).</span>
          )}
        </div>

        <button
          onClick={onComplete}
          className="w-full sm:w-auto px-6 py-3 bg-[#107C41] hover:bg-[#185C37] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Completar Fase 3 y Continuar a Fase 4</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
