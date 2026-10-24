import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../../types/course';
import { QUIZ_QUESTIONS } from '../../data/courseData';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Shuffle,
} from 'lucide-react';
import { VideoPlayer } from '../common/VideoPlayer';

interface Phase5Props {
  onComplete: (score: number, answers: Record<number, number>) => void;
  savedScore: number | null;
  savedAnswers: Record<number, number>;
  isCompleted: boolean;
}

const QUESTIONS_PER_ATTEMPT = 8;

// Generate a random selection of questions and shuffle each question's options
const generateRandomQuizSet = (bank: QuizQuestion[], count: number): QuizQuestion[] => {
  const pool = [...bank];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const selected = pool.slice(0, Math.min(count, pool.length));

  // Also shuffle the options within each question while preserving the correct answer index
  return selected.map((q) => {
    const indexedOptions = q.options.map((optText, idx) => ({
      optText,
      isCorrect: idx === q.correctAnswer,
    }));

    for (let i = indexedOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
    }

    return {
      ...q,
      options: indexedOptions.map((item) => item.optText),
      correctAnswer: indexedOptions.findIndex((item) => item.isCorrect),
    };
  });
};

export const Phase5Quiz: React.FC<Phase5Props> = ({
  onComplete,
  savedScore,
  savedAnswers,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    generateRandomQuizSet(QUIZ_QUESTIONS, QUESTIONS_PER_ATTEMPT)
  );
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(savedScore !== null);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(savedScore);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Always start at top of page when entering Phase 5
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Generate fresh random questions whenever entering the phase if not submitted
  useEffect(() => {
    if (savedScore === null) {
      setQuestions(generateRandomQuizSet(QUIZ_QUESTIONS, QUESTIONS_PER_ATTEMPT));
      setSelectedAnswers({});
    } else if (savedAnswers && Object.keys(savedAnswers).length > 0) {
      // Reconstruct the answered questions from bank if returning to an already graded attempt
      const answeredIds = Object.keys(savedAnswers).map((id) => Number(id));
      const matched = QUIZ_QUESTIONS.filter((q) => answeredIds.includes(q.id));
      if (matched.length > 0) {
        setQuestions(matched);
        setSelectedAnswers(savedAnswers);
      }
    }
  }, [savedScore]);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setValidationError(null);
  };

  const handleShuffleNewQuestions = () => {
    if (isSubmitted) return;
    setQuestions(generateRandomQuizSet(QUIZ_QUESTIONS, QUESTIONS_PER_ATTEMPT));
    setSelectedAnswers({});
    setValidationError(null);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleSubmitQuiz = () => {
    const unanswered = questions.filter(
      (q) => selectedAnswers[q.id] === undefined
    );
    if (unanswered.length > 0) {
      setValidationError(
        `Por favor responde todas las preguntas antes de calificar. Faltan ${unanswered.length} pregunta(s).`
      );
      return;
    }

    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    setCalculatedScore(scorePercent);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
    setCalculatedScore(null);
    setValidationError(null);
    setQuestions(generateRandomQuizSet(QUIZ_QUESTIONS, QUESTIONS_PER_ATTEMPT));
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const answeredCount = questions.filter((q) => selectedAnswers[q.id] !== undefined).length;
  const totalQuestions = questions.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#107C41] uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4" />
            <span>Fase 5 · Evaluación Teórica Oficial</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#185C37] bg-[#E6F4EA] px-2.5 py-1 rounded-lg border border-[#21A366]/30">
              <Shuffle className="w-3.5 h-3.5 text-[#107C41]" />
              Banco Aleatorio de {QUIZ_QUESTIONS.length} Preguntas del Curso
            </span>
            {!isSubmitted && (
              <button
                type="button"
                onClick={handleShuffleNewQuestions}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#107C41] hover:text-[#185C37] bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                title="Generar una nueva combinación aleatoria de preguntas del tema"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Sortear Nuevas Preguntas</span>
              </button>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cuestionario Aleatorio de Conocimientos en Excel Básico
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Cada intento selecciona de forma aleatoria <strong>{totalQuestions} preguntas</strong> de nuestro banco oficial sobre el entorno de trabajo, formatos de celda, operadores matemáticos, funciones estadísticas (<code>=SUMA</code>, <code>=PROMEDIO</code>, <code>=MAX</code>, <code>=MIN</code>), tablas y gráficos. Esta evaluación equivale al <strong>50%</strong> de la nota final.
        </p>

        {/* Progress status or score badge */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
            <span>
              Respondidas: <strong className="text-slate-900">{answeredCount}</strong> de {totalQuestions}
            </span>
            <span aria-hidden="true">·</span>
            <span>Ponderación: 50% de la nota final</span>
          </div>

          {calculatedScore !== null && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Calificación Obtenida:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                  calculatedScore >= 70
                    ? 'bg-[#E6F4EA] text-[#107C41] border border-[#21A366]/30'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {calculatedScore}% {calculatedScore >= 70 ? '✓ Aprobado' : '✕ No Aprobado'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Video Tutorial de Repaso en YouTube · Fase 5 */}
      <VideoPlayer
        videoUrl="https://www.youtube.com/watch?v=Yp6oQOXakU4"
        title="Repaso Rápido en YouTube: SUMA, PROMEDIO, MÁXIMO y Fila de Totales en Excel"
        topicBadge="YouTube · Fase 5"
        channelName="Gino Capacitaciones"
        durationLabel="08:15 min"
        demoTopic="formulas"
        caption="Video tutorial de repaso en YouTube sobre las funciones clave evaluadas en este cuestionario: sintaxis de =SUMA(), =PROMEDIO(), =MAX(), =MIN() y tablas inteligentes."
        keyTakeaways={[
          'Repaso de sintaxis de fórmulas (=)',
          'Diferencia entre operadores y funciones',
          'Uso de Fila de Totales en Tablas',
        ]}
      />

      {validationError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <HelpCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Quiz Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isSubmitted && userAnswer === q.correctAnswer;

          return (
            <div
              key={`${q.id}-${qIndex}`}
              className={`bg-white rounded-2xl p-6 border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-[#21A366] ring-1 ring-[#21A366]/20'
                    : 'border-rose-300 ring-1 ring-rose-200'
                  : isAnswered
                  ? 'border-slate-300 shadow-xs'
                  : 'border-slate-200'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#107C41] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {qIndex + 1}
                  </span>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Referencia: Fase {q.phaseRef} · {q.context}
                    </span>
                  </div>
                </div>

                {isSubmitted && (
                  <div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#107C41] bg-[#E6F4EA] px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcta (+12.5 pts)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> Incorrecta (0 pts)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Question Text */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug mb-4">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((option, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  const isThisCorrect = isSubmitted && optIdx === q.correctAnswer;
                  const isThisWrong = isSubmitted && isSelected && !isThisCorrect;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-3 cursor-pointer ${
                        isSubmitted
                          ? isThisCorrect
                            ? 'bg-[#E6F4EA] border-2 border-[#107C41] text-[#185C37] font-semibold'
                            : isThisWrong
                            ? 'bg-rose-50 border-2 border-rose-500 text-rose-800'
                            : 'bg-slate-50/50 border border-slate-200 text-slate-500 opacity-60'
                          : isSelected
                          ? 'bg-[#E6F4EA] border-2 border-[#107C41] text-[#185C37] font-semibold shadow-2xs'
                          : 'bg-slate-50/70 hover:bg-slate-100 border border-slate-200 text-slate-700'
                      }`}
                    >
                      {/* Radio dot */}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#107C41] bg-[#107C41] text-white'
                            : 'border-slate-400 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <span className="flex-1">{option}</span>

                      {/* Explicit marker after submission */}
                      {isSubmitted && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-[#107C41] shrink-0" />
                      )}
                      {isSubmitted && isThisWrong && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanation after submit */}
              {isSubmitted && (
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">
                    Explicación Pedagógica:
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="text-xs text-slate-600">
          {!isSubmitted ? (
            <span>
              Asegúrate de responder las {totalQuestions} preguntas sorteadas antes de enviar la evaluación.
            </span>
          ) : (
            <span className="text-[#107C41] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Evaluación Teórica calificada con <strong>{calculatedScore}%</strong>. Ya puedes avanzar a la evaluación práctica.
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {isSubmitted && (
            <button
              onClick={handleRetake}
              className="w-full sm:w-auto px-4 py-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nuevo Intento (Preguntas Aleatorias)</span>
            </button>
          )}

          {!isSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#107C41] hover:bg-[#185C37] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <span>Enviar y Calificar Evaluación</span>
              <FileCheck2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onComplete(calculatedScore || 0, selectedAnswers)}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#107C41] hover:bg-[#185C37] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <span>Continuar a Fase 6 (Evaluación Práctica)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
