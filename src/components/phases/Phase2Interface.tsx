import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Table as TableIcon,
  MousePointerClick,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { VideoPlayer } from '../common/VideoPlayer';

interface Phase2Props {
  onComplete: () => void;
  isCompleted: boolean;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

interface ComponentExploration {
  id: string;
  name: string;
  badge: string;
  position: string;
  description: string;
  keyShortcuts: string;
  practicalTip: string;
}

export const Phase2Interface: React.FC<Phase2Props> = ({
  onComplete,
  isCompleted,
  isSidebarCollapsed,
  onToggleSidebar,
}) => {
  const [activeComponent, setActiveComponent] = useState<string>('formula-bar');
  const [selectedCell, setSelectedCell] = useState<{ col: string; row: number }>({
    col: 'B',
    row: 3,
  });
  const [cellValues, setCellValues] = useState<Record<string, string>>({
    'A1': 'Código',
    'B1': 'Producto',
    'C1': 'Precio',
    'A2': 'P-01',
    'B2': 'Laptop Pro',
    'C2': '1200',
    'A3': 'P-02',
    'B3': 'Teclado RGB',
    'C3': '65',
    'A4': 'P-03',
    'B4': 'Monitor 4K',
    'C4': '380',
  });
  const [hasInteractedWithGrid, setHasInteractedWithGrid] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const componentsList: ComponentExploration[] = [
    {
      id: 'ribbon',
      name: '1. Cinta de Opciones (Ribbon)',
      badge: 'Menú Superior',
      position: 'Parte superior de la ventana',
      description:
        'Agrupa todas las herramientas y comandos de Excel organizados lógicamente en pestañas temáticas (Inicio, Insertar, Disposición de página, Fórmulas, Datos, Revisar, Vista).',
      keyShortcuts: 'Ctrl + F1 para ocultar/mostrar la cinta.',
      practicalTip:
        'La pestaña "Inicio" concentra el 80% de las tareas cotidianas: portapapeles, fuentes, alineación, número y estilos.',
    },
    {
      id: 'name-box',
      name: '2. Cuadro de Nombres',
      badge: 'Localizador',
      position: 'Extremo izquierdo, bajo la cinta',
      description:
        'Indica en todo momento las coordenadas de la celda activa actual (por ejemplo "B3") o el nombre del rango seleccionado.',
      keyShortcuts: 'Presiona Ctrl + G para abrir el cuadro "Ir a..." y saltar a cualquier celda.',
      practicalTip:
        'Puedes escribir directamente una referencia (ej. Z100) y pulsar Enter para desplazarte instantáneamente a esa coordenada.',
    },
    {
      id: 'formula-bar',
      name: '3. Barra de Fórmulas (fx)',
      badge: 'Editor de Contenido',
      position: 'Centro superior, junto al botón fx',
      description:
        'Muestra el valor real o la fórmula subyacente que origina el resultado visible en la celda activa. Permite editar cálculos complejos.',
      keyShortcuts: 'F2 activa el modo de edición de la fórmula directamente.',
      practicalTip:
        'Una celda puede mostrar "$ 150.00", pero la barra de fórmulas revelará si proviene de un número plano o de una fórmula como "=A2*1.16".',
    },
    {
      id: 'columns',
      name: '4. Columnas (Letras A, B, C...)',
      badge: 'Eje Vertical',
      position: 'Encabezados de columna superiores',
      description:
        'Las columnas están identificadas con letras del abecedario (A a XFD, más de 16,384 columnas). Organizan los campos o atributos de una tabla.',
      keyShortcuts: 'Ctrl + Espacio selecciona toda la columna actual.',
      practicalTip:
        'Haz doble clic en la línea divisoria entre dos letras para autoajustar el ancho de columna al texto más largo.',
    },
    {
      id: 'rows',
      name: '5. Filas (Números 1, 2, 3...)',
      badge: 'Eje Horizontal',
      position: 'Encabezados de fila en el lateral izquierdo',
      description:
        'Las filas están numeradas correlativamente del 1 al 1,048,576. Cada fila representa un registro individual o renglón de información.',
      keyShortcuts: 'Shift + Espacio selecciona toda la fila completa.',
      practicalTip:
        'Mantén siempre la fila 1 para los encabezados de tus datos y congélala usando "Inmovilizar paneles".',
    },
    {
      id: 'active-cell',
      name: '6. Celda Activa y Tirador de Relleno',
      badge: 'Punto de Intersección',
      position: 'Cualquier coordenada (ej. C4)',
      description:
        'Es la intersección exacta entre una columna y una fila. Se distingue por un recuadro verde prominente y un pequeño cuadradito en la esquina inferior derecha llamado "Tirador de relleno" (Fill handle).',
      keyShortcuts: 'Flechas direccionales o Tab/Enter para desplazarse.',
      practicalTip:
        'Arrastrar el tirador de relleno hacia abajo copia fórmulas con referencias relativas o genera series correlativas automáticas (enero, febrero, etc.).',
    },
    {
      id: 'sheet-tabs',
      name: '7. Hojas de Trabajo (Pestañas)',
      badge: 'Páginas del Libro',
      position: 'Barra inferior izquierda',
      description:
        'Un libro de Excel puede contener múltiples hojas independientes o vinculadas (Hoja 1, Hoja 2...). Se pueden renombrar, colorear y reordenar.',
      keyShortcuts: 'Ctrl + AvPág y Ctrl + RePág para alternar entre hojas.',
      practicalTip:
        'Haz doble clic sobre el nombre de la pestaña para cambiarle el nombre por uno descriptivo (ej. "Ventas_2026").',
    },
  ];

  const currentCompData =
    componentsList.find((c) => c.id === activeComponent) || componentsList[0];

  const activeCellCoord = `${selectedCell.col}${selectedCell.row}`;
  const activeCellValue = cellValues[activeCellCoord] || '';

  const handleCellClick = (col: string, row: number) => {
    setSelectedCell({ col, row });
    setHasInteractedWithGrid(true);
  };

  const handleValueChange = (val: string) => {
    setCellValues((prev) => ({
      ...prev,
      [activeCellCoord]: val,
    }));
  };

  const cols = ['A', 'B', 'C', 'D', 'E'];
  const rows = [1, 2, 3, 4, 5, 6];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#107C41] uppercase tracking-wider mb-2">
            <TableIcon className="w-4 h-4" />
            <span>Fase 2 · Teoría Interactiva</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            El Entorno de Trabajo de Microsoft Excel
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Para dominar las hojas de cálculo, es fundamental conocer con exactitud la anatomía de su interfaz. Explora cada componente haciendo clic en las fichas interactivas y prueba el <strong>Simulador en Vivo</strong> interactuando con las celdas.
          </p>
        </div>

        {/* Sidebar Toggle Button for Phase 2 (Desktop only) */}
        {onToggleSidebar && (
          <div className="hidden md:block shrink-0">
            <button
              onClick={onToggleSidebar}
              className="px-4 py-2.5 rounded-xl bg-[#E6F4EA] hover:bg-[#d5eedc] text-[#185C37] font-bold text-xs flex items-center gap-2 border border-[#21A366]/30 transition-all cursor-pointer shadow-2xs whitespace-nowrap min-h-[40px]"
              title={isSidebarCollapsed ? 'Desplegar barra lateral de fases' : 'Ocultar barra lateral de fases para ampliar la pantalla'}
            >
              {isSidebarCollapsed ? (
                <>
                  <PanelLeftOpen className="w-4 h-4 text-[#107C41]" />
                  <span>Desplegar Panel de Fases</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 text-[#107C41]" />
                  <span>Ocultar Panel de Fases (Pantalla Ancha)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Video Tutorial de Referencia en YouTube · Fase 2: Entorno de Trabajo */}
      <VideoPlayer
        videoUrl="https://www.youtube.com/watch?v=PAhm2LyzZc4"
        title="Conoce el Entorno de Excel: Domina su Interfaz Paso a Paso"
        topicBadge="YouTube · Fase 2"
        channelName="El Tío Tech"
        durationLabel="11:35 min"
        demoTopic="interface"
        caption="Video tutorial en YouTube que explica detalladamente la interfaz de Microsoft Excel: Cinta de Opciones (Ribbon), Cuadro de Nombres, Barra de Fórmulas (fx), columnas, filas, celdas activas y manejo de hojas de trabajo."
        keyTakeaways={[
          'Cinta de Opciones y Pestaña Inicio',
          'Cuadro de Nombres + Barra fx (F2)',
          'Filas, Columnas y Tirador de Relleno',
        ]}
        relatedVideos={[
          {
            videoId: 'PAhm2LyzZc4',
            title: 'Conoce el Entorno de Excel: Domina su Interfaz',
            channel: 'El Tío Tech',
          },
          {
            videoId: 'yKWFMgurUnU',
            title: 'Entorno de Trabajo e Introducción a las Celdas',
            channel: 'Dostin Hurtado',
          },
        ]}
      />

      {/* Component Explorer Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {componentsList.map((comp) => {
          const isSelected = activeComponent === comp.id;
          return (
            <button
              key={comp.id}
              onClick={() => setActiveComponent(comp.id)}
              className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-[#107C41] text-white border-[#107C41] shadow-sm font-semibold'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-[11px] block truncate opacity-80">{comp.badge}</span>
              <span className="text-xs font-bold block truncate mt-0.5">{comp.name.split('. ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Component Deep Dive Card */}
      <div className="bg-[#E6F4EA] border border-[#21A366]/30 rounded-2xl p-6 transition-all">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-[#185C37] bg-white/70 px-2.5 py-0.5 rounded-full border border-[#21A366]/20">
                {currentCompData.position}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#185C37]">
              {currentCompData.name}
            </h2>
            <p className="text-sm text-slate-700 mt-2 leading-relaxed">
              {currentCompData.description}
            </p>
          </div>

          <div className="shrink-0 space-y-2 bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-[#21A366]/20 text-xs text-slate-800 min-w-[260px]">
            <div>
              <span className="font-bold text-[#185C37] block">Atajo de Teclado:</span>
              <code className="text-slate-600 font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">
                {currentCompData.keyShortcuts}
              </code>
            </div>
            <div className="pt-2 border-t border-slate-200/60">
              <span className="font-bold text-[#185C37] block">Tip de Productividad:</span>
              <span className="text-slate-600 text-[11px] leading-tight block mt-0.5">
                {currentCompData.practicalTip}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Interactive Excel Workbench Simulator */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden">
        {/* Top Window Bar (Excel Style) */}
        <div className="bg-[#107C41] text-white px-4 py-2 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px]">AutoGuardado · Sí</span>
            <span>Libro1 - Microsoft Excel (Simulador Interactivo)</span>
          </div>
          <div className="text-[11px] text-emerald-100 hidden sm:block">
            Haz clic en cualquier celda para interactuar
          </div>
        </div>

        {/* Simulated Ribbon Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 flex items-center gap-6 text-xs text-slate-700 font-medium overflow-x-auto">
          <span className="bg-white text-[#107C41] font-bold px-3 py-1 rounded shadow-2xs border-b-2 border-[#107C41]">
            Inicio
          </span>
          <span className="hover:text-slate-900 cursor-pointer">Insertar</span>
          <span className="hover:text-slate-900 cursor-pointer">Disposición de Página</span>
          <span className="hover:text-slate-900 cursor-pointer">Fórmulas</span>
          <span className="hover:text-slate-900 cursor-pointer">Datos</span>
          <span className="hover:text-slate-900 cursor-pointer">Revisar</span>
          <span className="hover:text-slate-900 cursor-pointer">Vista</span>
        </div>

        {/* Formula Bar & Name Box Row */}
        <div className="bg-white border-b border-slate-200 p-2 flex items-center gap-3 text-xs">
          {/* Cuadro de Nombres */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:inline">
              Nombre:
            </span>
            <div className="w-16 h-7 bg-slate-50 border border-slate-300 rounded px-2 font-mono font-bold text-slate-800 flex items-center justify-center text-xs">
              {activeCellCoord}
            </div>
          </div>

          <div className="h-5 w-px bg-slate-300" />

          {/* Formula symbol fx */}
          <div className="flex items-center gap-2 flex-1">
            <span className="font-serif italic font-bold text-slate-500 text-sm select-none">
              fx
            </span>
            <input
              type="text"
              value={activeCellValue}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="Escribe texto, un número o una fórmula como =SUMA()..."
              className="w-full h-7 px-2.5 bg-slate-50 border border-slate-200 rounded font-mono text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#107C41]"
            />
          </div>
        </div>

        {/* Spreadsheet Grid */}
        <div className="overflow-x-auto touch-pan-x bg-slate-50 p-2">
          <div className="sm:hidden pb-1 text-[10px] text-slate-500 font-medium flex items-center justify-between">
            <span>← Desliza las columnas A-E →</span>
            <span>Toca una celda para editar</span>
          </div>
          <table className="w-full min-w-[380px] sm:min-w-0 border-collapse border border-slate-300 bg-white text-xs select-none">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-semibold text-center">
                <th className="w-10 border border-slate-300 py-1 bg-slate-200/70 text-[11px]">
                  #
                </th>
                {cols.map((col) => (
                  <th
                    key={col}
                    className={`border border-slate-300 py-1 px-3 font-mono font-bold transition-colors ${
                      selectedCell.col === col
                        ? 'bg-[#E6F4EA] text-[#185C37]'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row} className="hover:bg-slate-50/50">
                  {/* Row header */}
                  <td
                    className={`border border-slate-300 text-center font-mono font-bold py-1.5 transition-colors ${
                      selectedCell.row === row
                        ? 'bg-[#E6F4EA] text-[#185C37]'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {row}
                  </td>

                  {/* Columns cells */}
                  {cols.map((col) => {
                    const coord = `${col}${row}`;
                    const isSelected = selectedCell.col === col && selectedCell.row === row;
                    const val = cellValues[coord] || '';

                    return (
                      <td
                        key={coord}
                        onClick={() => handleCellClick(col, row)}
                        className={`border border-slate-200 py-1.5 px-3 min-w-[90px] font-mono cursor-cell transition-all relative ${
                          isSelected
                            ? 'bg-[#E6F4EA]/40 ring-2 ring-[#107C41] ring-inset font-bold text-[#185C37] z-10'
                            : 'text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <div className="truncate">{val || <span className="text-slate-300">·</span>}</div>

                        {/* Fill Handle Indicator for active cell */}
                        {isSelected && (
                          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#107C41] border border-white cursor-crosshair z-20" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sheet Tabs Bar (Excel Bottom) */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <span className="bg-white text-[#107C41] font-bold px-3 py-1 rounded-t border-t-2 border-[#107C41] shadow-2xs">
              Hoja 1
            </span>
            <span className="px-3 py-1 hover:bg-slate-200 rounded cursor-pointer text-slate-500">
              Hoja 2
            </span>
            <button className="px-2 py-0.5 text-slate-500 hover:text-slate-900 font-bold">+</button>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Listo</span>
            <span>Zoom: 100%</span>
          </div>
        </div>
      </div>

      {/* Interactive Verification Notice */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
        <MousePointerClick className="w-5 h-5 text-[#107C41] shrink-0" />
        <div className="text-xs text-slate-700">
          <span className="font-bold">Comprobación de Práctica: </span>
          {hasInteractedWithGrid ? (
            <span className="text-[#107C41] font-semibold">
              ¡Excelente! Has interactuado con la cuadrícula y comprobado el cambio en la Barra de Fórmulas y Cuadro de Nombres.
            </span>
          ) : (
            <span>
              Haz clic en cualquier celda de la tabla superior para ver cómo el Cuadro de Nombres y la Barra de Fórmulas se sincronizan.
            </span>
          )}
        </div>
      </div>

      {/* Completion Footer */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="text-xs text-slate-500">
          {isCompleted ? (
            <span className="text-[#107C41] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Has completado la Fase 2.
            </span>
          ) : (
            <span>Al completar avanzarás a la Fase 3: Formatos y Fórmulas Esenciales.</span>
          )}
        </div>

        <button
          onClick={onComplete}
          className="w-full sm:w-auto px-6 py-3 bg-[#107C41] hover:bg-[#185C37] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Completar Fase 2 y Continuar a Fase 3</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
