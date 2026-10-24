import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Video,
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ExternalLink,
  Youtube,
  MonitorPlay,
} from 'lucide-react';

export interface RelatedYoutubeVideo {
  videoId: string;
  title: string;
  channel: string;
  duration?: string;
}

export interface VideoPlayerProps {
  videoUrl: string;
  caption: string;
  title?: string;
  topicBadge?: string;
  durationLabel?: string;
  channelName?: string;
  demoTopic?: 'interface' | 'formulas' | 'analytics';
  keyTakeaways?: string[];
  relatedVideos?: RelatedYoutubeVideo[];
}

// Helper to extract 11-character YouTube video ID from any YouTube URL format
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  caption,
  title = 'Video Tutorial de Referencia en YouTube · Microsoft Excel',
  topicBadge = 'Video Tutorial en YouTube',
  durationLabel = '12:45 min',
  channelName = 'Canal Educativo Oficial en YouTube',
  demoTopic = 'interface',
  keyTakeaways = [],
  relatedVideos = [],
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const initialYoutubeId = extractYouTubeId(videoUrl);
  const [selectedYoutubeId, setSelectedYoutubeId] = useState<string | null>(initialYoutubeId);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>(title);
  const [activeChannel, setActiveChannel] = useState<string>(channelName);
  const [viewMode, setViewMode] = useState<'youtube' | 'interactive'>(
    initialYoutubeId ? 'youtube' : 'interactive'
  );

  // Sync if videoUrl prop changes
  useEffect(() => {
    const parsedId = extractYouTubeId(videoUrl);
    setSelectedYoutubeId(parsedId);
    setActiveVideoTitle(title);
    setActiveChannel(channelName);
    if (parsedId) {
      setViewMode('youtube');
    }
  }, [videoUrl, title, channelName]);

  // Interactive simulator fallback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(45);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const getCuratedSegments = () => {
    if (demoTopic === 'interface') {
      return [
        {
          timeRange: [0, 15],
          chapter: '1. Anatomía de la Cinta de Opciones (Ribbon) y Pestañas',
          narration:
            'En el entorno de Microsoft Excel, la Cinta de Opciones superior organiza los comandos en pestañas como Inicio, Insertar, Fórmulas y Datos.',
          formulaBar: 'fx =Hoja1!B3',
          activeCell: 'B3',
          highlightBox: 'Pestaña Inicio → Portapapeles, Fuente, Alineación y Número',
          cells: [
            { id: 'A1', val: 'Código', style: 'header' },
            { id: 'B1', val: 'Componente', style: 'header' },
            { id: 'C1', val: 'Ubicación', style: 'header' },
            { id: 'A2', val: 'UI-01', style: 'normal' },
            { id: 'B2', val: 'Cinta Opciones', style: 'active' },
            { id: 'C2', val: 'Panel Superior', style: 'normal' },
          ],
        },
        {
          timeRange: [15, 30],
          chapter: '2. Sincronización entre Cuadro de Nombres y Barra de Fórmulas',
          narration:
            'El Cuadro de Nombres muestra la coordenada exacta de la celda activa, mientras que la Barra de Fórmulas revela el cálculo o valor real almacenado.',
          formulaBar: 'fx =SUMA(C2:C10)',
          activeCell: 'C11',
          highlightBox: 'Cuadro de Nombres [C11] + Barra de Fórmulas (fx)',
          cells: [
            { id: 'A1', val: 'Celda Activa', style: 'header' },
            { id: 'B1', val: 'Vista Celda', style: 'header' },
            { id: 'C1', val: 'Vista en fx', style: 'header' },
            { id: 'A2', val: 'Coordenada C11', style: 'active' },
            { id: 'B2', val: '$ 4,850.00', style: 'result' },
            { id: 'C2', val: '=SUMA(C2:C10)', style: 'active' },
          ],
        },
        {
          timeRange: [30, 45],
          chapter: '3. Filas, Columnas, Hojas de Trabajo y Tirador de Relleno',
          narration:
            'Las columnas se identifican por letras y las filas por números. Con el tirador de relleno en la esquina inferior derecha puedes autogenerar series rápidamente.',
          formulaBar: 'fx Enero → Febrero → Marzo',
          activeCell: 'A4',
          highlightBox: 'Intersección Columna/Fila + Tirador de Relleno (+)',
          cells: [
            { id: 'A1', val: 'Mes (Serie)', style: 'header' },
            { id: 'B1', val: 'Columna B', style: 'header' },
            { id: 'C1', val: 'Hoja Activa', style: 'header' },
            { id: 'A2', val: 'Enero → Febrero', style: 'result' },
            { id: 'B2', val: 'Autoajuste ↔', style: 'normal' },
            { id: 'C2', val: 'Hoja 1 + Hoja 2', style: 'active' },
          ],
        },
      ];
    }

    if (demoTopic === 'formulas') {
      return [
        {
          timeRange: [0, 15],
          chapter: '1. Formatos Numéricos: Moneda ($), Porcentaje (%) y Fecha',
          narration:
            'Aplicar formato de Moneda o Porcentaje transforma la presentación visual del número con separadores de miles y decimales sin alterar su valor matemático.',
          formulaBar: 'fx 12500.5',
          activeCell: 'B2',
          highlightBox: 'Formato Moneda ($ 12,500.50) y Porcentaje (16.0%)',
          cells: [
            { id: 'A1', val: 'Valor Crudo', style: 'header' },
            { id: 'B1', val: 'Formato Moneda', style: 'header' },
            { id: 'C1', val: 'Porcentaje IVA', style: 'header' },
            { id: 'A2', val: '12500.5', style: 'normal' },
            { id: 'B2', val: '$ 12,500.50', style: 'result' },
            { id: 'C2', val: '16.00%', style: 'active' },
          ],
        },
        {
          timeRange: [15, 30],
          chapter: '2. Operadores Aritméticos (+, -, *, /) y Función =SUMA()',
          narration:
            'Toda fórmula comienza con el signo igual. Usa asterisco para multiplicar precio por cantidad y la función SUMA para totalizar rangos completos.',
          formulaBar: 'fx =SUMA(B2:B6)',
          activeCell: 'B7',
          highlightBox: 'Sintaxis: =A2*B2 (Producto) | =SUMA(B2:B6) (Total)',
          cells: [
            { id: 'A1', val: 'Operación', style: 'header' },
            { id: 'B1', val: 'Fórmula Escrita', style: 'header' },
            { id: 'C1', val: 'Resultado', style: 'header' },
            { id: 'A2', val: 'Suma Rango', style: 'normal' },
            { id: 'B2', val: '=SUMA(B2:B6)', style: 'active' },
            { id: 'C2', val: '$ 9,900.00', style: 'result' },
          ],
        },
        {
          timeRange: [30, 45],
          chapter: '3. Funciones Estadísticas: =PROMEDIO(), =MAX() y =MIN()',
          narration:
            'Con PROMEDIO calculas la media aritmética del rango, mientras que MAX y MIN identifican instantáneamente el valor más alto y más bajo.',
          formulaBar: 'fx =PROMEDIO(B2:B6)',
          activeCell: 'C2',
          highlightBox: '=PROMEDIO(B2:B6) → $1,980 | =MAX() → $3,200 | =MIN() → $850',
          cells: [
            { id: 'A1', val: '=PROMEDIO()', style: 'header' },
            { id: 'B1', val: '=MAX(B2:B6)', style: 'header' },
            { id: 'C1', val: '=MIN(B2:B6)', style: 'header' },
            { id: 'A2', val: '$ 1,980.00', style: 'result' },
            { id: 'B2', val: '$ 3,200.00', style: 'result' },
            { id: 'C2', val: '$ 850.00', style: 'result' },
          ],
        },
      ];
    }

    return [
      {
        timeRange: [0, 15],
        chapter: '1. Dar Formato como Tabla Oficial en Excel (Ctrl + T)',
        narration:
          'Al presionar Control más T sobre un rango de datos, Excel lo convierte en una Tabla Oficial con encabezados fijos, bandas de color y fila de totales.',
        formulaBar: 'fx =SUBTOTALES(109;[Ingresos])',
        activeCell: 'A1',
        highlightBox: 'Atajo Ctrl + T → Tabla Estructurada con Encabezados',
        cells: [
          { id: 'A1', val: 'Categoría ▼', style: 'header' },
          { id: 'B1', val: 'Unidades ▼', style: 'header' },
          { id: 'C1', val: 'Ingresos ▼', style: 'header' },
          { id: 'A2', val: 'Equipos', style: 'active' },
          { id: 'B2', val: '18 un.', style: 'normal' },
          { id: 'C2', val: '$ 15,300.00', style: 'result' },
        ],
      },
      {
        timeRange: [15, 30],
        chapter: '2. Uso de Filtros Rápidos y Ordenamiento de Datos',
        narration:
          'Los botones desplegables en cada encabezado permiten filtrar categorías específicas y ordenar montos de mayor a menor sin desalinear las filas.',
        formulaBar: 'fx Filtro Activo: Categoría = "Equipos"',
        activeCell: 'C1',
        highlightBox: 'Datos → Filtro (Ctrl + Shift + L) y Ordenar Z→A',
        cells: [
          { id: 'A1', val: 'Filtro: Equipos', style: 'active' },
          { id: 'B1', val: 'Orden: Mayor ↓', style: 'active' },
          { id: 'C1', val: 'Total Filtrado', style: 'header' },
          { id: 'A2', val: 'Laptop Pro 15"', style: 'normal' },
          { id: 'B2', val: 'Top #1 Ventas', style: 'normal' },
          { id: 'C2', val: '$ 15,300.00', style: 'result' },
        ],
      },
      {
        timeRange: [30, 45],
        chapter: '3. Creación de Gráficos de Columnas, Líneas y Pastel',
        narration:
          'Usa gráficos de barras para comparar categorías, gráficos de líneas para tendencias en el tiempo y gráficos circulares para porcentajes de un total.',
        formulaBar: 'fx =SERIES(Hoja1!$C$1;Hoja1!$A$2:$A$6;Hoja1!$C$2:$C$6;1)',
        activeCell: 'C2',
        highlightBox: 'Insertar → Gráfico de Columnas / Circular (Alt + F1)',
        cells: [
          { id: 'A1', val: 'Barras (Magnitud)', style: 'header' },
          { id: 'B1', val: 'Líneas (Tiempo)', style: 'header' },
          { id: 'C1', val: 'Pastel (100%)', style: 'header' },
          { id: 'A2', val: 'Comparativa ✓', style: 'result' },
          { id: 'B2', val: 'Tendencia ✓', style: 'result' },
          { id: 'C2', val: 'Proporción % ✓', style: 'result' },
        ],
      },
    ];
  };

  const segments = getCuratedSegments();
  const currentSegmentIndex = segments.findIndex(
    (seg, idx) =>
      currentTime >= seg.timeRange[0] &&
      (currentTime < seg.timeRange[1] || idx === segments.length - 1)
  );
  const activeSegment = segments[currentSegmentIndex >= 0 ? currentSegmentIndex : 0];

  useEffect(() => {
    if (!isPlaying || viewMode === 'youtube') return;

    const intervalMs = 1000 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev + 1 >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, duration, viewMode]);

  const togglePlay = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const cycleSpeed = () => {
    const next = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(next);
  };

  const handleFullscreen = () => {
    if (containerRef.current && containerRef.current.requestFullscreen) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = Math.min(100, Math.round((currentTime / Math.max(1, duration)) * 100));

  const youtubeWatchUrl = selectedYoutubeId
    ? `https://www.youtube.com/watch?v=${selectedYoutubeId}`
    : 'https://www.youtube.com';

  const youtubeEmbedUrl = selectedYoutubeId
    ? `https://www.youtube.com/embed/${selectedYoutubeId}?rel=0&modestbranding=1`
    : '';

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col"
    >
      {/* Top Header Strip */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {topicBadge}
              </span>
              <span className="text-[11px] font-semibold text-[#107C41] bg-[#E6F4EA] px-2 py-0.5 rounded">
                {activeChannel}
              </span>
              <span className="text-[11px] font-mono text-slate-400">· {durationLabel}</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              {activeVideoTitle}
            </h3>
          </div>
        </div>

        {/* Mode Switcher & Direct YouTube Link */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedYoutubeId && (
            <div className="inline-flex p-1 bg-slate-200/70 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setViewMode('youtube')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'youtube'
                    ? 'bg-white text-red-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>Video YouTube</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('interactive')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'interactive'
                    ? 'bg-[#107C41] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span>Resumen Guiado</span>
              </button>
            </div>
          )}

          {selectedYoutubeId && (
            <a
              href={youtubeWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
              title="Abrir este video tutorial directamente en YouTube"
            >
              <span>Ver en YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Optional Related YouTube Videos Selector Bar */}
      {relatedVideos.length > 1 && (
        <div className="px-5 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Video className="w-3.5 h-3.5 text-[#107C41]" />
            <span>Videos de la Fase:</span>
          </span>
          {relatedVideos.map((vid, idx) => {
            const isSelected = selectedYoutubeId === vid.videoId;
            return (
              <button
                key={vid.videoId}
                type="button"
                onClick={() => {
                  setSelectedYoutubeId(vid.videoId);
                  setActiveVideoTitle(vid.title);
                  setActiveChannel(vid.channel);
                  setViewMode('youtube');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#107C41] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="font-mono text-[10px] opacity-80">#{idx + 1}</span>
                <span className="truncate max-w-[220px]">{vid.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Video Stage: Either Embedded YouTube Player or Interactive Guided View */}
      {viewMode === 'youtube' && selectedYoutubeId ? (
        <div className="relative bg-slate-950 aspect-video max-h-[440px] w-full overflow-hidden">
          <iframe
            key={selectedYoutubeId}
            src={youtubeEmbedUrl}
            title={activeVideoTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="relative bg-slate-950 aspect-video max-h-[380px] w-full flex flex-col justify-between overflow-hidden select-none">
          {/* Subtle Excel Grid Backdrop */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#107C41_1px,transparent_1px),linear-gradient(to_bottom,#107C41_1px,transparent_1px)] bg-[size:3rem_3rem]" />

          {/* Animated Curated Lesson Visual Stage */}
          <div className="relative z-10 p-4 sm:p-6 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#107C41]/90 text-white text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                {activeSegment.chapter}
              </span>
              <span className="text-[11px] font-mono text-emerald-300 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-800">
                {isPlaying ? '● REPRODUCIENDO RESUMEN' : '⏸ EN PAUSA'}
              </span>
            </div>

            {/* Simulated Live Excel Demonstration Frame */}
            <div className="my-auto max-w-2xl w-full mx-auto bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
              <div className="bg-[#107C41] text-white px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold">
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Microsoft Excel · Resumen Interactivo del Tema</span>
                </span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">
                  {activeSegment.highlightBox}
                </span>
              </div>

              <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 bg-white border border-slate-300 rounded font-bold text-[#185C37]">
                  {activeSegment.activeCell}
                </span>
                <span className="text-slate-600 font-semibold truncate">
                  {activeSegment.formulaBar}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 grid grid-cols-3 gap-1.5 text-xs font-mono">
                {activeSegment.cells.map((cell) => (
                  <div
                    key={cell.id}
                    className={`p-2 rounded border transition-all ${
                      cell.style === 'header'
                        ? 'bg-slate-200/80 border-slate-300 text-slate-800 font-bold'
                        : cell.style === 'result'
                        ? 'bg-[#E6F4EA] border-2 border-[#107C41] text-[#185C37] font-extrabold'
                        : cell.style === 'active'
                        ? 'bg-amber-50 border-2 border-amber-500 text-slate-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-[9px] text-slate-400">{cell.id}</div>
                    <div className="truncate">{cell.val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-2.5 px-3.5 text-xs text-slate-100 flex items-center gap-2.5 shadow-lg">
              <span className="px-1.5 py-0.5 rounded bg-[#107C41] text-white font-mono text-[10px] font-bold shrink-0">
                NOTA CLAVE
              </span>
              <p className="leading-relaxed line-clamp-2">{activeSegment.narration}</p>
            </div>
          </div>

          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#107C41]/95 hover:bg-[#185C37] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer z-20 ring-4 ring-white/20"
              aria-label="Reproducir resumen interactivo"
            >
              <Play className="w-7 h-7 fill-current ml-0.5" />
            </button>
          )}

          <div className="relative z-20 bg-slate-900/95 border-t border-slate-800 px-4 py-2.5 space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleScrub}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#21A366]"
                aria-label="Línea de tiempo"
              />
              <span className="text-[11px] font-mono text-slate-300 shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)} ({progressPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-300"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cycleSpeed}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] cursor-pointer"
                >
                  {playbackSpeed}x
                </button>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-300"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Caption & Curated Educational Summary Footer */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3">
        <div className="flex items-start gap-2.5">
          <BookOpen className="w-4 h-4 text-[#107C41] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            {caption}
          </p>
        </div>

        {keyTakeaways.length > 0 && (
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {keyTakeaways.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#107C41] shrink-0" />
                <span className="truncate">{point}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
