export interface User {
  fullName: string;
  email: string;
  registeredAt: string;
  hasCompletedOnboarding: boolean;
  role?: 'student' | 'teacher';
}

export type PhaseId = 1 | 2 | 3 | 4 | 5 | 6;

export interface RubricItem {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  earnedPoints: number;
  passed: boolean;
  feedback: string;
}

export interface PracticalSubmission {
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  score: number;
  rubric: RubricItem[];
  summaryFeedback: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  context?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  phaseRef: number;
}

export interface CourseProgress {
  currentPhase: PhaseId;
  completedPhases: number[];
  quizScore: number | null; // 0 - 100
  quizAnswers: Record<number, number>;
  quizSubmitted: boolean;
  practicalSubmission: PracticalSubmission | null;
  practicalScore: number | null; // 0 - 100
  finalScore: number | null; // (quizScore + practicalScore) / 2
  isApproved: boolean | null;
  certificateDate: string | null;
  certificateId: string | null;
}

export interface StudentRecord {
  id: string;
  fullName: string;
  email: string;
  registeredAt: string;
  progressPercent: number;
  completedPhases: number[];
  currentPhase: number;
  isCulminated: boolean;
  quizScore: number | null;
  practicalScore: number | null;
  finalScore: number | null;
  certificateDate: string | null;
  certificateId: string | null;
}
