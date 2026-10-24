import { QuizQuestion, RubricItem } from '../types/course';

export interface PhaseMeta {
  id: number;
  title: string;
  subtitle: string;
  shortDesc: string;
  duration: string;
  category: string;
}

export const PHASES_CONFIG: PhaseMeta[] = [
  {
    id: 1,
    title: 'Fase 1: Introducción al Curso',
    subtitle: 'Fundamentos, Objetivos y Metodología',
    shortDesc: 'Visión general de Microsoft Excel, importancia laboral y ruta de aprendizaje.',
    duration: '45 min',
    category: 'Orientación',
  },
  {
    id: 2,
    title: 'Fase 2: Entorno de Trabajo de Excel',
    subtitle: 'Exploración de la Interfaz y Componentes',
    shortDesc: 'Cinta de opciones, barra de fórmulas, celdas activas, filas y columnas.',
    duration: '1 h 15 min',
    category: 'Teoría Interactiva',
  },
  {
    id: 3,
    title: 'Fase 3: Formatos y Fórmulas Esenciales',
    subtitle: 'Tipos de Datos y Operaciones Matemáticas',
    shortDesc: 'Formato moneda/porcentaje, bordes, suma, resta, promedio, máximo y mínimo.',
    duration: '2 h 30 min',
    category: 'Cálculo y Fórmulas',
  },
  {
    id: 4,
    title: 'Fase 4: Análisis de Datos',
    subtitle: 'Tablas Inteligentes, Filtros y Gráficos',
    shortDesc: 'Estructuración de tablas dinámicas básicas, ordenación y gráficos visuales.',
    duration: '2 h',
    category: 'Visualización',
  },
  {
    id: 5,
    title: 'Fase 5: Evaluación Teórica',
    subtitle: 'Cuestionario de Conocimientos',
    shortDesc: 'Examen de selección simple con preguntas aleatorias y ponderación del 50%.',
    duration: '30 min',
    category: 'Examen Teórico',
  },
  {
    id: 6,
    title: 'Fase 6: Evaluación Práctica',
    subtitle: 'Caso Práctico y Certificación',
    shortDesc: 'Descarga de plantilla, aplicación de fórmulas y carga de archivo para validación.',
    duration: '1 h',
    category: 'Proyecto Práctico',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      '¿Con qué carácter obligatorio debe comenzar cualquier fórmula o función en Excel para que sea interpretada como cálculo?',
    context: 'Sintaxis básica de fórmulas en hojas de cálculo.',
    options: [
      'Con el signo igual (=)',
      'Con dos puntos (:)',
      'Con el signo arroba (@)',
      "Con una comilla simple (')",
    ],
    correctAnswer: 0,
    explanation:
      'En Microsoft Excel, toda operación o función matemática debe iniciar indispensablemente con el signo igual (=). De lo contrario, Excel tratará el contenido como texto sin procesar.',
    phaseRef: 3,
  },
  {
    id: 2,
    question:
      '¿Cuál es la función adecuada para calcular el promedio (media aritmética) de los números situados entre las celdas C2 y C15?',
    context: 'Funciones estadísticas esenciales.',
    options: [
      '=MEDIA(C2:C15)',
      '=PROMEDIO(C2:C15)',
      '=SUMA_DIVIDIDA(C2:C15)',
      '=CALCULAR.PROMEDIO(C2:C15)',
    ],
    correctAnswer: 1,
    explanation:
      'La función nativa en español para obtener la media aritmética de un rango numérico es =PROMEDIO(rango). Realiza la suma interna y la divide entre el recuento de valores.',
    phaseRef: 3,
  },
  {
    id: 3,
    question:
      '¿Qué elemento de la interfaz de usuario de Excel muestra la referencia o coordenada de la celda activa (por ejemplo, B4 o D12)?',
    context: 'Componentes del entorno de trabajo.',
    options: [
      'La Barra de Estado',
      'El Cuadro de Nombres',
      'La Cinta de Opciones',
      'El Administrador de Tareas',
    ],
    correctAnswer: 1,
    explanation:
      'El Cuadro de Nombres, ubicado justo a la izquierda de la Barra de Fórmulas, indica de forma permanente la dirección de la celda activa o el nombre del rango seleccionado.',
    phaseRef: 2,
  },
  {
    id: 4,
    question:
      'Si en la celda A1 tienes el valor 1200 y en B1 tienes 350, ¿cuál es la fórmula correcta para obtener la diferencia (resta)?',
    context: 'Operadores aritméticos elementales.',
    options: [
      '=RESTA(A1, B1)',
      '=A1 - B1',
      '=DIFERENCIA(A1:B1)',
      '=MENOS(A1; B1)',
    ],
    correctAnswer: 1,
    explanation:
      'En Excel no existe una función llamada RESTA; se utiliza directamente el operador aritmético guión medio (-), escribiendo =A1-B1.',
    phaseRef: 3,
  },
  {
    id: 5,
    question:
      '¿Qué formato de celda transforma un número decimal como 0.16 para mostrarlo visualmente como "16%" sin alterar su valor matemático?',
    context: 'Gestión de formatos numéricos.',
    options: [
      'Formato Científico',
      'Formato de Moneda',
      'Formato de Porcentaje',
      'Formato Fracción',
    ],
    correctAnswer: 2,
    explanation:
      'El Formato de Porcentaje multiplica visualmente el valor subyacente por 100 y le añade el símbolo de porcentaje (%) sin alterar el valor matemático real.',
    phaseRef: 3,
  },
  {
    id: 6,
    question: '¿Para qué sirve la función =MAX(rango) en una hoja de cálculo de Excel?',
    context: 'Funciones de análisis de valores extremos.',
    options: [
      'Para identificar el valor numérico más alto dentro del rango especificado',
      'Para fijar el tamaño máximo de una celda en píxeles',
      'Para multiplicar todos los valores por el número más alto',
      'Para limitar el número de filas visibles en la hoja',
    ],
    correctAnswer: 0,
    explanation:
      '=MAX() evalúa todos los números en el rango suministrado y devuelve el valor numérico con mayor magnitud.',
    phaseRef: 3,
  },
  {
    id: 7,
    question:
      '¿Cuál es el tipo de gráfico idóneo para representar qué porcentaje aporta cada categoría respecto a un total del 100%?',
    context: 'Principios de visualización de datos.',
    options: [
      'Gráfico de Dispersión XY',
      'Gráfico Circular o de Pastel (Pie Chart)',
      'Gráfico de Cotizaciones Bursátiles',
      'Gráfico de Superficie 3D',
    ],
    correctAnswer: 1,
    explanation:
      'El gráfico circular o de pastel está diseñado para comunicar partes proporcionales de un todo (100%), siendo ideal para presupuestos y participaciones por categoría.',
    phaseRef: 4,
  },
  {
    id: 8,
    question:
      '¿Qué ventaja principal se obtiene al aplicar "Dar formato como tabla" (Ctrl + T) sobre un rango de datos?',
    context: 'Estructuración de datos en Excel.',
    options: [
      'Bloquea permanentemente la hoja para que nadie pueda editarla',
      'Convierte el rango en una tabla estructurada con filtros automáticos, bandas de color y expansión de fórmulas',
      'Elimina automáticamente las columnas con números decimales',
      'Cierra el archivo y lo convierte en documento PDF',
    ],
    correctAnswer: 1,
    explanation:
      'La herramienta "Dar formato como tabla" (Ctrl + T) transforma datos planos en un objeto estructurado con botones de filtro en cada encabezado, filas alternadas y fórmulas automáticas.',
    phaseRef: 4,
  },
  {
    id: 9,
    question:
      '¿Cómo se identifican las Columnas y las Filas respectivamente dentro de la cuadrícula de Microsoft Excel?',
    context: 'Estructura de coordenadas en la hoja de trabajo.',
    options: [
      'Las columnas con letras (A, B, C...) y las filas con números (1, 2, 3...)',
      'Las columnas con números romanos y las filas con letras minúsculas',
      'Tanto filas como columnas se identifican únicamente con números',
      'Las columnas con símbolos matemáticos y las filas con fechas',
    ],
    correctAnswer: 0,
    explanation:
      'En Excel, el eje vertical (Columnas) se identifica mediante letras del alfabeto (A, B, C... XFD) y el eje horizontal (Filas) mediante números correlativos (1, 2, 3...).',
    phaseRef: 2,
  },
  {
    id: 10,
    question:
      '¿Cuál es la función del pequeño cuadrado verde situado en la esquina inferior derecha de la celda activa (Tirador de Relleno)?',
    context: 'Productividad y autorrelleno en la interfaz de Excel.',
    options: [
      'Permite arrastrar para copiar fórmulas o autogenerar series correlativas (como meses o días)',
      'Borra permanentemente el libro de trabajo actual',
      'Cambia el idioma de Microsoft Excel automáticamente',
      'Sirve únicamente para cerrar la ventana del programa',
    ],
    correctAnswer: 0,
    explanation:
      'El Tirador de Relleno (Fill Handle) permite arrastrar el contenido de una celda para replicar fórmulas adaptando sus referencias o completar series como Enero, Febrero, Marzo.',
    phaseRef: 2,
  },
  {
    id: 11,
    question:
      'Si deseas multiplicar el Precio Unitario ubicado en la celda D2 por la Cantidad ubicada en la celda E2, ¿qué fórmula debes escribir?',
    context: 'Operadores matemáticos en cálculos comerciales.',
    options: [
      '=D2 * E2',
      '=D2 x E2',
      '=MULTIPLICAR(D2 - E2)',
      '=D2 ^ E2',
    ],
    correctAnswer: 0,
    explanation:
      'En Excel el operador aritmético de multiplicación es el asterisco (*). Por lo tanto, la sintaxis correcta es =D2*E2.',
    phaseRef: 3,
  },
  {
    id: 12,
    question:
      '¿Qué muestra la Barra de Fórmulas (fx) cuando seleccionas una celda que contiene el resultado de una operación matemática?',
    context: 'Inspección y edición de celdas en el entorno de trabajo.',
    options: [
      'Muestra la fórmula o función subyacente escrita en la celda (por ejemplo, =SUMA(B2:B6))',
      'Muestra únicamente el nombre del autor del archivo',
      'Muestra la fecha de instalación de Windows',
      'Oculta el contenido para evitar que se vea el cálculo',
    ],
    correctAnswer: 0,
    explanation:
      'Mientras la celda en la hoja muestra el resultado calculado (ej. $ 9,900.00), la Barra de Fórmulas (fx) revela la expresión exacta que genera dicho valor.',
    phaseRef: 2,
  },
  {
    id: 13,
    question:
      '¿Qué función estadística permite encontrar instantáneamente el valor más bajo o menor dentro de un listado de precios o ventas?',
    context: 'Funciones estadísticas esenciales.',
    options: [
      '=MIN(A2:A20)',
      '=MENOR_VALOR(A2:A20)',
      '=BAJO(A2:A20)',
      '=INFERIOR(A2:A20)',
    ],
    correctAnswer: 0,
    explanation:
      'La función =MIN(rango) analiza todas las celdas numéricas del rango indicado y devuelve el valor mínimo o más pequeño registrado.',
    phaseRef: 3,
  },
  {
    id: 14,
    question:
      '¿Para qué se utilizan los Filtros Rápidos en los encabezados de una tabla de Excel?',
    context: 'Segmentación y análisis de datos.',
    options: [
      'Para mostrar únicamente las filas que cumplen con un criterio específico ocultando temporalmente el resto',
      'Para borrar definitivamente del disco duro las filas que no necesitamos',
      'Para cambiar el tipo de letra de todo el sistema operativo',
      'Para convertir textos en imágenes fotográficas',
    ],
    correctAnswer: 0,
    explanation:
      'Los filtros permiten segmentar y visualizar rápidamente subconjuntos de datos (por ejemplo, ver solo la categoría "Equipos") sin eliminar ni alterar los demás registros.',
    phaseRef: 4,
  },
  {
    id: 15,
    question:
      '¿Qué tipo de gráfico es el más recomendado para visualizar la evolución o tendencia de las ventas a lo largo de varios meses o años?',
    context: 'Visualización de tendencias temporales.',
    options: [
      'Gráfico de Líneas',
      'Gráfico Circular o de Anillos',
      'Gráfico de Radar Simple',
      'Mapa de Árbol Jerárquico',
    ],
    correctAnswer: 0,
    explanation:
      'Los gráficos de líneas conectan puntos de datos en una secuencia continua, lo que facilita observar subidas, caídas y tendencias a través del tiempo.',
    phaseRef: 4,
  },
  {
    id: 16,
    question:
      '¿Cuál es la forma correcta de sumar todas las celdas continuas desde B2 hasta B10 utilizando una función de Excel?',
    context: 'Rangos continuos y función SUMA.',
    options: [
      '=SUMA(B2:B10)',
      '=SUMA(B2-B10)',
      '=TOTAL(B2/B10)',
      '=ADICIONAR(B2;B10)',
    ],
    correctAnswer: 0,
    explanation:
      'En Excel, los dos puntos (:) definen un rango continuo desde la celda inicial hasta la celda final. Por ello, =SUMA(B2:B10) totaliza todas las celdas comprendidas en ese bloque.',
    phaseRef: 3,
  },
];

export const PRACTICAL_EXERCISE_TEMPLATE_DATA = `ID_Producto,Descripcion,Categoria,Precio_Unitario,Cantidad_Vendida,Venta_Total
PROD-101,Laptop UltraBook 15",Equipos,850.00,12,=D2*E2
PROD-102,Monitor 27" IPS 4K,Periféricos,320.00,24,=D3*E3
PROD-103,Teclado Mecánico RGB,Accesorios,65.00,45,=D4*E4
PROD-104,Mouse Inalámbrico Pro,Accesorios,35.00,60,=D5*E5
PROD-105,Disco SSD NVMe 1TB,Almacenamiento,95.00,38,=D6*E6
PROD-106,Memoria RAM DDR5 32GB,Componentes,140.00,20,=D7*E7
PROD-107,Auriculares Bluetooth,Audio,75.00,32,=D8*E8
PROD-108,Webcam Full HD 1080p,Periféricos,50.00,28,=D9*E9
TOTALES,,"",,SUMA(E2:E9),=SUMA(F2:F9)
PROMEDIO_VENTAS,,"",,,=PROMEDIO(F2:F9)
VENTA_MAXIMA,,"",,,=MAX(F2:F9)
VENTA_MINIMA,,"",,,=MIN(F2:F9)
`;

export const RUBRIC_CRITERIA_TEMPLATE: RubricItem[] = [
  {
    id: 'structure',
    name: 'Estructura y Encabezados de Tabla',
    description: 'Nombres claros de campos (ID, Descripción, Categoría, Precios, Cantidades y Totales).',
    maxPoints: 20,
    earnedPoints: 20,
    passed: true,
    feedback: 'Encabezados correctos y estructura tabular validada.',
  },
  {
    id: 'formula_multiplication',
    name: 'Cálculo de Ventas Totales por Fila',
    description: 'Uso de multiplicación matemática (=Precio_Unitario * Cantidad).',
    maxPoints: 25,
    earnedPoints: 25,
    passed: true,
    feedback: 'Fórmula de producto aplicada en todas las filas de artículos.',
  },
  {
    id: 'formula_stats',
    name: 'Funciones Estadísticas (=SUMA, =PROMEDIO, =MAX, =MIN)',
    description: 'Cálculo del Total General, Promedio y Extremos del rango de ventas.',
    maxPoints: 30,
    earnedPoints: 30,
    passed: true,
    feedback: 'Totales calculados con =SUMA() y medidas estadísticas implementadas correctamente.',
  },
  {
    id: 'formatting_charts',
    name: 'Formato Numérico y Presentación de Datos',
    description: 'Formatos de Moneda ($ USD) aplicados en columnas monetarias y distribución ordenada.',
    maxPoints: 25,
    earnedPoints: 25,
    passed: true,
    feedback: 'Valores monetarios con dos decimales y formato financiero limpio.',
  },
];
