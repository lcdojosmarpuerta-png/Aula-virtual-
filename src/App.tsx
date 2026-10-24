/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { User, CourseProgress, PhaseId, PracticalSubmission, StudentRecord } from './types/course';
import {
  getStoredUser,
  saveStoredUser,
  getStoredProgress,
  saveStoredProgress,
  resetStoredProgress,
  fetchProgressFromCloud,
  markOnboardingCompletedInCloud,
  INITIAL_PROGRESS,
} from './utils/storage';

// Layout & Auth
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomBanner } from './components/layout/BottomBanner';
import { SupabaseDiagnosticBanner } from './components/layout/SupabaseDiagnosticBanner';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingVideo } from './components/onboarding/OnboardingVideo';

// 6 Phases
import { Phase1Introduction } from './components/phases/Phase1Introduction';
import { Phase2Interface } from './components/phases/Phase2Interface';
import { Phase3Formulas } from './components/phases/Phase3Formulas';
import { Phase4Analytics } from './components/phases/Phase4Analytics';
import { Phase5Quiz } from './components/phases/Phase5Quiz';
import { Phase6Practical } from './components/phases/Phase6Practical';

// Teacher Dashboard
import { TeacherDashboard } from './components/teacher/TeacherDashboard';

// Certificate and Failed Screens
import { CertificateModal } from './components/certificate/CertificateModal';
import { FailedScreen } from './components/certificate/FailedScreen';

const SYSTEM_BG_IMAGE = '/assets/aistudio/7543c30ffce46fd7bba0f29e321ed3e0_5cc870e4.jpg';
const STUDENTS_MODULE_BG_IMAGE = '/assets/aistudio/c3770d5882f9fc01a11dd8abf1b4d39f_bc1b3cd0.jpg';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<CourseProgress>(INITIAL_PROGRESS);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showFailedModal, setShowFailedModal] = useState<boolean>(false);
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<StudentRecord | null>(null);
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const mainContainerRef = useRef<HTMLElement | null>(null);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = 0;
    }
  };

  // Initialize from localStorage and sync with Supabase cloud on mount (only for logged-in students)
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      if (storedUser.role === 'teacher') {
        setIsTeacherMode(true);
      } else {
        setIsTeacherMode(false);
        const userProgress = getStoredProgress(storedUser.email);
        setProgress(userProgress);

        void fetchProgressFromCloud(storedUser.email).then((cloudProgress) => {
          setProgress(cloudProgress);
        });
      }
    }
    setIsInitialized(true);
  }, []);

  // Automatically scroll to the top whenever a module/phase starts or changes
  useEffect(() => {
    scrollToTop();
  }, [progress.currentPhase, user?.email, user?.hasCompletedOnboarding, isTeacherMode]);

  // Save progress changes whenever progress updates
  const updateProgress = (updater: (prev: CourseProgress) => CourseProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      if (user) {
        saveStoredProgress(user.email, next);
      }
      return next;
    });
  };

  // Auth Handlers
  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    saveStoredUser(authenticatedUser);
    if (authenticatedUser.role === 'teacher') {
      setIsTeacherMode(true);
    } else {
      setIsTeacherMode(false);
      const existingProgress = getStoredProgress(authenticatedUser.email);
      setProgress(existingProgress);
      void fetchProgressFromCloud(authenticatedUser.email).then((cloudProgress) => {
        setProgress(cloudProgress);
      });
    }
    scrollToTop();
  };

  const handleLogout = () => {
    setUser(null);
    saveStoredUser(null);
    setProgress(INITIAL_PROGRESS);
    setIsTeacherMode(false);
    setShowCertificateModal(false);
    setShowFailedModal(false);
    setSelectedStudentForCert(null);
    scrollToTop();
  };

  // Onboarding completion
  const handleFinishOnboarding = () => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      hasCompletedOnboarding: true,
    };
    setUser(updatedUser);
    saveStoredUser(updatedUser);
    void markOnboardingCompletedInCloud(updatedUser.email);
    scrollToTop();
  };

  // Navigation between unlocked phases
  const handleSelectPhase = (phaseId: PhaseId) => {
    updateProgress((prev) => ({
      ...prev,
      currentPhase: phaseId,
    }));
    scrollToTop();
  };

  // Phase 1 -> Phase 2
  const handleCompletePhase1 = () => {
    updateProgress((prev) => {
      const completed = Array.from(new Set([...prev.completedPhases, 1]));
      return {
        ...prev,
        completedPhases: completed,
        currentPhase: 2,
      };
    });
    scrollToTop();
  };

  // Phase 2 -> Phase 3
  const handleCompletePhase2 = () => {
    updateProgress((prev) => {
      const completed = Array.from(new Set([...prev.completedPhases, 2]));
      return {
        ...prev,
        completedPhases: completed,
        currentPhase: 3,
      };
    });
    scrollToTop();
  };

  // Phase 3 -> Phase 4
  const handleCompletePhase3 = () => {
    updateProgress((prev) => {
      const completed = Array.from(new Set([...prev.completedPhases, 3]));
      return {
        ...prev,
        completedPhases: completed,
        currentPhase: 4,
      };
    });
    scrollToTop();
  };

  // Phase 4 -> Phase 5
  const handleCompletePhase4 = () => {
    updateProgress((prev) => {
      const completed = Array.from(new Set([...prev.completedPhases, 4]));
      return {
        ...prev,
        completedPhases: completed,
        currentPhase: 5,
      };
    });
    scrollToTop();
  };

  // Phase 5 -> Phase 6
  const handleCompletePhase5 = (
    score: number,
    answers: Record<number, number>
  ) => {
    updateProgress((prev) => {
      const completed = Array.from(new Set([...prev.completedPhases, 5]));
      return {
        ...prev,
        completedPhases: completed,
        quizScore: score,
        quizAnswers: answers,
        quizSubmitted: true,
        currentPhase: 6,
      };
    });
    scrollToTop();
  };

  // Phase 6 -> Final Grading Engine & Certification
  const handleCompletePhase6 = (submission: PracticalSubmission) => {
    const quiz = progress.quizScore ?? 100;
    const practical = submission.score;
    const finalScore = Math.round((quiz + practical) / 2);
    const isApproved = finalScore >= 70;

    const certDate = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const certCode = `EXCEL-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    updateProgress((prev) => {
      const completed = Array.from(new Set([...prev.completedPhases, 6]));
      return {
        ...prev,
        completedPhases: completed,
        practicalSubmission: submission,
        practicalScore: practical,
        finalScore,
        isApproved,
        certificateDate: certDate,
        certificateId: certCode,
      };
    });

    if (isApproved) {
      setSelectedStudentForCert(null);
      setShowCertificateModal(true);
      setShowFailedModal(false);
    } else {
      setShowFailedModal(true);
      setShowCertificateModal(false);
    }
  };

  // Full reset (Required for CASO B: REPROBADO or manual restart)
  const handleRestartCourse = () => {
    if (!user) return;
    const fresh = resetStoredProgress(user.email);
    setProgress(fresh);
    setShowCertificateModal(false);
    setShowFailedModal(false);
    setSelectedStudentForCert(null);
    scrollToTop();
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white pb-14">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <BottomBanner />
      </div>
    );
  }

  // 1. Auth Module (Login / Register / Teacher) - Uses First Image as Background inside AuthModal
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <SupabaseDiagnosticBanner />
        <AuthModal onSuccess={handleAuthSuccess} />
        <BottomBanner />
      </div>
    );
  }

  // 2. Onboarding Video (Mandatory on first student login) - Uses Second Image as Background
  if (!user.hasCompletedOnboarding && user.role !== 'teacher') {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <SupabaseDiagnosticBanner />
        <OnboardingVideo
          user={user}
          onFinishOnboarding={handleFinishOnboarding}
        />
        <BottomBanner />
      </div>
    );
  }

  // 3. Teacher Dashboard View (Módulo de Estudiantes) - Uses Attached Image as Background
  if (user.role === 'teacher' && isTeacherMode) {
    return (
      <div className="relative min-h-screen flex flex-col font-sans text-slate-800 pb-16">
        <SupabaseDiagnosticBanner />
        {/* Attached Image Fixed Background for Módulo de Estudiantes */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden no-print">
          <img
            src={STUDENTS_MODULE_BG_IMAGE}
            alt="Fondo Módulo de Estudiantes Excel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header
            user={user}
            progress={progress}
            onLogout={handleLogout}
            isTeacherMode={true}
          />

          <main
            ref={mainContainerRef}
            className="flex-1 p-3 sm:p-6 lg:p-8 pb-28 sm:pb-20 max-w-7xl w-full mx-auto"
          >
            <TeacherDashboard
              teacher={user}
              onLogout={handleLogout}
              onSwitchToStudentMode={() => {
                setIsTeacherMode(false);
                scrollToTop();
              }}
              onViewStudentCertificate={(student) => {
                setSelectedStudentForCert(student);
                setShowCertificateModal(true);
              }}
            />
          </main>
        </div>

        {/* Certificate Modal when opened by Teacher for a specific student */}
        {showCertificateModal && (
          <CertificateModal
            user={user}
            progress={progress}
            studentOverride={selectedStudentForCert || undefined}
            onClose={() => {
              setShowCertificateModal(false);
              setSelectedStudentForCert(null);
            }}
          />
        )}

        <BottomBanner />
      </div>
    );
  }

  // 4. Main Student LMS Dashboard - Uses Second Image as System Background
  return (
    <div className="relative min-h-screen flex flex-col font-sans text-slate-800 pb-16">
      <SupabaseDiagnosticBanner />
      {/* Second Image Fixed Background for System Pages */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden no-print">
        <img
          src={SYSTEM_BG_IMAGE}
          alt="Fondo del Sistema Excel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          user={user}
          progress={progress}
          onLogout={handleLogout}
          onResetProgress={handleRestartCourse}
          onViewCertificate={
            progress.isApproved
              ? () => {
                  setSelectedStudentForCert(null);
                  setShowCertificateModal(true);
                }
              : undefined
          }
          isTeacherMode={false}
        />

        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
          {/* Left Sidebar with the 6 Phases (Collapsible / Desplegable) */}
          <Sidebar
            progress={progress}
            onSelectPhase={handleSelectPhase}
            onShowCertificate={
              progress.isApproved
                ? () => {
                    setSelectedStudentForCert(null);
                    setShowCertificateModal(true);
                  }
                : undefined
            }
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          {/* Central Content Stage */}
          <main
            ref={mainContainerRef}
            className="flex-1 p-3 sm:p-6 lg:p-8 pb-28 sm:pb-20 overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto">
              {progress.currentPhase === 1 && (
                <Phase1Introduction
                  onComplete={handleCompletePhase1}
                  isCompleted={progress.completedPhases.includes(1)}
                />
              )}

              {progress.currentPhase === 2 && (
                <Phase2Interface
                  onComplete={handleCompletePhase2}
                  isCompleted={progress.completedPhases.includes(2)}
                  isSidebarCollapsed={isSidebarCollapsed}
                  onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
              )}

              {progress.currentPhase === 3 && (
                <Phase3Formulas
                  onComplete={handleCompletePhase3}
                  isCompleted={progress.completedPhases.includes(3)}
                />
              )}

              {progress.currentPhase === 4 && (
                <Phase4Analytics
                  onComplete={handleCompletePhase4}
                  isCompleted={progress.completedPhases.includes(4)}
                />
              )}

              {progress.currentPhase === 5 && (
                <Phase5Quiz
                  onComplete={handleCompletePhase5}
                  savedScore={progress.quizScore}
                  savedAnswers={progress.quizAnswers}
                  isCompleted={progress.completedPhases.includes(5)}
                />
              )}

              {progress.currentPhase === 6 && (
                <Phase6Practical
                  onComplete={handleCompletePhase6}
                  savedSubmission={progress.practicalSubmission}
                  quizScore={progress.quizScore ?? 100}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* CASO A: Certificate Modal (Approved >= 70% or Teacher review) */}
      {showCertificateModal && (
        <CertificateModal
          user={user}
          progress={progress}
          studentOverride={selectedStudentForCert || undefined}
          onClose={() => {
            setShowCertificateModal(false);
            setSelectedStudentForCert(null);
          }}
        />
      )}

      {/* CASO B: Failed Screen (Score < 70%) */}
      {showFailedModal && (
        <FailedScreen
          user={user}
          progress={progress}
          onRestartCourse={handleRestartCourse}
        />
      )}

      {/* Persistent Bottom Banner: S&S Web Studio */}
      <BottomBanner />
    </div>
  );
}
