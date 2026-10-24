import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  CheckCircle2,
  ArrowRight,
  Filter,
  ArrowUpDown,
  Search,
  Sparkles,
  Table as TableIcon,
} from 'lucide-react';
import { VideoPlayer } from '../common/VideoPlayer';

interface Phase4Props {
  onComplete: () => void;
  isCompleted: boolean;
}

interface ProductSale {
  id: string;
  name: string;
  category: 'Equipos' | 'Periféricos' | 'Audio' | 'Accesorios';
  units: number;
  revenue: number;
}

const INITIAL_SALES_DATA: ProductSale[] = [
  { id: 'P01', name: 'Laptop Ultrabook 15"', category: 'Equipos', units: 18, revenue: 15300 },
  { id: 'P02', name: 'Monitor 4K IPS 27"', category: 'Periféricos', units: 32, revenue: 10240 },
  { id: 'P03', name: 'Teclado Mecánico Pro', category: 'Accesorios', units: 64, revenue: 4160 },
  { id: 'P04', name: 'Auriculares Noise-Cancelling', category: 'Audio', units: 45, revenue: 5400 },
  { id: 'P05', name: 'Mouse Inalámbrico Ergo', category: 'Accesorios', units: 80, revenue: 2800 },
  { id: 'P06', name: 'Altavoz Bluetooth Studio', category: 'Audio', units: 28, revenue: 3360 },
];

export const Phase4Analytics: React.FC<Phase4Props> = ({
  onComplete,
  isCompleted,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Filtered & sorted data
  const filteredData = useMemo(() => {
    return INITIAL_SALES_DATA.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    }).sort((a, b) => {
      return sortOrder === 'desc' ? b.revenue - a.revenue : a.revenue - b.revenue;
    });
  }, [activeCategory, searchTerm, sortOrder]);

  const totalRevenue = useMemo(
    () => filteredData.reduce((acc, curr) => acc + curr.revenue, 0),
    [filteredData]
  );
  const totalUnits = useMemo(
    () => filteredData.reduce((acc, curr) => acc + curr.units, 0),
    [filteredData]
  );
  const maxRevenue = useMemo(
    () => Math.max(...INITIAL_SALES_DATA.map((d) => d.revenue)),
    []
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#107C41] uppercase tracking-wider mb-2">
          <BarChart3 className="w-4 h-4" />
          <span>Fase 4 · Análisis y Visualización</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Análisis de Datos: Tablas, Filtros y Gráficos
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Transforma datos planos en decisiones gerenciales. Aprende a convertir rangos en Tablas Oficiales de Excel, filtrar información en segundos y seleccionar el tipo de gráfico ideal según tu objetivo comunicacional.
        </p>
      </div>

      {/* Video Tutorial de Referencia en YouTube · Fase 4: Análisis de Datos */}
      <VideoPlayer
        videoUrl="https://www.youtube.com/watch?v=ksc12e8OMyQ"
        title="Curso de Excel - Capítulo 2: Gráficos Estadísticos, Tablas y Filtros"
        topicBadge="YouTube · Fase 4"
        channelName="Dostin Hurtado"
        durationLabel="15:10 min"
        demoTopic="analytics"
        caption="Video tutorial en YouTube donde aprenderás paso a paso a dar Formato como Tabla Oficial (Ctrl + T), aplicar filtros rápidos y ordenamiento de datos, e insertar gráficos estadísticos de barras, líneas y pastel."
        keyTakeaways={[
          'Formato como Tabla Oficial (Ctrl + T)',
          'Filtros por Categoría y Orden Z→A',
          'Gráficos de Barras, Líneas y Pastel',
        ]}
        relatedVideos={[
          {
            videoId: 'ksc12e8OMyQ',
            title: 'Capítulo 2: Creación de Gráficos Estadísticos en Excel',
            channel: 'Dostin Hurtado',
          },
          {
            videoId: 'AIipB0FFw7Y',
            title: 'Capítulo 10: Filtros Rápidos y Tablas en Excel',
            channel: 'Dostin Hurtado',
          },
          {
            videoId: 'BER2KhixV0Y',
            title: 'Diseño y Formato de Gráficos de Barras y Pastel',
            channel: 'Dostin Hurtado',
          },
        ]}
      />

      {/* 3 Interactive Learning Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] text-[#107C41] flex items-center justify-center font-bold">
            <TableIcon className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">1. Formato como Tabla (Ctrl+T)</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Convierte datos ordinarios en un objeto de tabla inteligente con encabezados fijos al desplazarte, estilos de bandas alternadas, cálculos automáticos y fila de totales con un clic.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] text-[#107C41] flex items-center justify-center font-bold">
            <Filter className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">2. Filtros y Ordenamiento</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Aísla registros específicos por criterios (ej. solo categoría "Equipos" o ventas mayores a $5,000) y ordena de la A a la Z o por valor numérico de mayor a menor sin alterar la integridad de tus filas.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] text-[#107C41] flex items-center justify-center font-bold">
            <PieChart className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">3. Gráficos Estadísticos</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Columnas/Barras:</strong> Comparar magnitudes discretas.<br />
            <strong>Líneas:</strong> Analizar tendencias a lo largo del tiempo.<br />
            <strong>Circular/Pastel:</strong> Exponer proporciones porcentuales de un total 100%.
          </p>
        </div>
      </div>

      {/* Interactive Data & Chart Visualizer Studio */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Studio Top Controls */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#107C41]" />
              <h2 className="text-base font-bold text-slate-900">
                Visualizador Interactivo de Reportes y Gráficos
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Prueba la interactividad aplicando filtros y alternando el tipo de gráfico generado
            </p>
          </div>

          {/* Chart Type Selector */}
          <div className="grid grid-cols-3 sm:flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs w-full sm:w-auto">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
                chartType === 'bar'
                  ? 'bg-[#107C41] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span>Barras</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
                chartType === 'line'
                  ? 'bg-[#107C41] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5 shrink-0" />
              <span>Líneas</span>
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
                chartType === 'pie'
                  ? 'bg-[#107C41] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 shrink-0" />
              <span>Pastel</span>
            </button>
          </div>
        </div>

        {/* Filter bar and search */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 touch-pan-x">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#107C41]" />
              Filtro:
            </span>
            {['all', 'Equipos', 'Periféricos', 'Audio', 'Accesorios'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 min-h-[36px] ${
                  activeCategory === cat
                    ? 'bg-[#E6F4EA] text-[#185C37] font-bold ring-1 ring-[#107C41]/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar artículo..."
                className="w-full pl-8 pr-3 py-2 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#107C41] min-h-[38px]"
              />
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0 min-h-[38px]"
              title="Cambiar orden por ingresos"
            >
              <ArrowUpDown className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">{sortOrder === 'desc' ? 'Mayor a Menor' : 'Menor a Mayor'}</span>
              <span className="xs:hidden">{sortOrder === 'desc' ? 'Desc' : 'Asc'}</span>
            </button>
          </div>
        </div>

        {/* Content Split: Table on Left, Chart on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Table side */}
          <div className="lg:col-span-7 p-4 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#107C41] text-white font-bold">
                  <th className="p-2.5 rounded-tl-lg">ID</th>
                  <th className="p-2.5">Descripción de Producto</th>
                  <th className="p-2.5">Categoría</th>
                  <th className="p-2.5 text-right">Cant.</th>
                  <th className="p-2.5 text-right rounded-tr-lg">Ingreso Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-emerald-50/50 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                    }`}
                  >
                    <td className="p-2.5 text-slate-500 font-bold">{item.id}</td>
                    <td className="p-2.5 font-sans font-medium text-slate-900">{item.name}</td>
                    <td className="p-2.5 font-sans">
                      <span className="text-[11px] text-[#185C37] bg-[#E6F4EA] px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-2.5 text-right text-slate-700">{item.units}</td>
                    <td className="p-2.5 text-right font-bold text-[#107C41]">
                      $ {item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Table Total Row */}
              <tfoot>
                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td colSpan={3} className="p-2.5 uppercase tracking-wider font-sans text-xs">
                    Fila de Totales (=SUMA)
                  </td>
                  <td className="p-2.5 text-right font-mono">{totalUnits} un.</td>
                  <td className="p-2.5 text-right font-mono text-[#185C37] text-sm">
                    $ {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Dynamic SVG Chart side */}
          <div className="lg:col-span-5 p-5 flex flex-col justify-between bg-slate-50/40">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {chartType === 'bar'
                    ? 'Gráfico de Columnas: Ventas por Artículo'
                    : chartType === 'line'
                    ? 'Gráfico de Tendencia de Ingresos'
                    : 'Distribución Porcentual (Pastel)'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {filteredData.length} series
                </span>
              </div>

              {/* BAR CHART VIEW */}
              {chartType === 'bar' && (
                <div className="space-y-3 pt-2">
                  {filteredData.map((d) => {
                    const pct = Math.round((d.revenue / maxRevenue) * 100);
                    return (
                      <div key={d.id} className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-600">
                          <span className="truncate max-w-[170px] font-medium">{d.name}</span>
                          <span className="font-mono font-bold text-[#107C41]">
                            ${d.revenue.toLocaleString()} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#107C41] to-[#21A366] h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* LINE CHART VIEW (Custom SVG) */}
              {chartType === 'line' && (
                <div className="py-2">
                  <div className="h-44 w-full relative flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120">
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#107C41" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#107C41" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area fill */}
                      <path
                        d={`M 10 110 ${filteredData
                          .map((d, i) => {
                            const x = 10 + (i * 280) / Math.max(1, filteredData.length - 1);
                            const y = 110 - (d.revenue / maxRevenue) * 90;
                            return `L ${x} ${y}`;
                          })
                          .join(' ')} L 290 110 Z`}
                        fill="url(#lineGrad)"
                      />

                      {/* Line stroke */}
                      <path
                        d={filteredData
                          .map((d, i) => {
                            const x = 10 + (i * 280) / Math.max(1, filteredData.length - 1);
                            const y = 110 - (d.revenue / maxRevenue) * 90;
                            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                          })
                          .join(' ')}
                        fill="none"
                        stroke="#107C41"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data Points */}
                      {filteredData.map((d, i) => {
                        const x = 10 + (i * 280) / Math.max(1, filteredData.length - 1);
                        const y = 110 - (d.revenue / maxRevenue) * 90;
                        return (
                          <g key={d.id}>
                            <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#107C41" strokeWidth="2.5" />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                    <span>{filteredData[0]?.id || ''}</span>
                    <span>Progreso de Series</span>
                    <span>{filteredData[filteredData.length - 1]?.id || ''}</span>
                  </div>
                </div>
              )}

              {/* PIE / DONUT CHART VIEW (Custom SVG) */}
              {chartType === 'pie' && (
                <div className="flex flex-col items-center justify-center py-2 space-y-4">
                  <div className="relative w-36 h-36">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      {/* Simple visual segmented donut representation */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="transparent"
                        stroke="#e2e8f0"
                        strokeWidth="3.8"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="transparent"
                        stroke="#107C41"
                        strokeWidth="3.8"
                        strokeDasharray="40 60"
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="transparent"
                        stroke="#21A366"
                        strokeWidth="3.8"
                        strokeDasharray="30 70"
                        strokeDashoffset="-40"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="transparent"
                        stroke="#0D4424"
                        strokeWidth="3.8"
                        strokeDasharray="20 80"
                        strokeDashoffset="-70"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="transparent"
                        stroke="#6ee7b7"
                        strokeWidth="3.8"
                        strokeDasharray="10 90"
                        strokeDashoffset="-90"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                      <span className="text-xs font-mono font-bold text-slate-900">100%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] w-full text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#107C41]" />
                      <span className="truncate">Equipos (40%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#21A366]" />
                      <span className="truncate">Periféricos (30%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0D4424]" />
                      <span className="truncate">Audio (20%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#6ee7b7]" />
                      <span className="truncate">Accesorios (10%)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 text-center">
              Visualización dinámica adaptada al estándar de Microsoft Excel 365.
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="text-xs text-slate-500">
          {isCompleted ? (
            <span className="text-[#107C41] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Has completado la Fase 4.
            </span>
          ) : (
            <span>Al continuar accederás a la Fase 5: Evaluación Teórica (Cuestionario Calificado).</span>
          )}
        </div>

        <button
          onClick={onComplete}
          className="w-full sm:w-auto px-6 py-3 bg-[#107C41] hover:bg-[#185C37] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Completar Fase 4 e Iniciar Evaluación Teórica</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
