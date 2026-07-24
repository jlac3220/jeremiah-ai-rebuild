// src/hooks/useProgress.js
import { useState, useEffect, useCallback } from "react";
import { storage } from "../utils/storage";
import { STUDIES } from "../config/studies";

export function useProgress() {
  const [progress, setProgress] = useState(() => storage.getProgress());

  // Reload from storage
  const reload = useCallback(() => {
    setProgress(storage.getProgress());
  }, []);

  // Update a lesson's progress
  const updateLesson = useCallback(
    (studyId, lessonId, patch) => {
      storage.setLessonProgress(studyId, lessonId, patch);
      reload();
    },
    [reload]
  );

  // Mark lesson complete
  const completeLesson = useCallback(
    (studyId, lessonId) => {
      storage.setLessonProgress(studyId, lessonId, {
        started: true,
        readingDone: true,
        scripturesDone: true,
        quizPassed: true,
        isComplete: true,
      });
      reload();
    },
    [reload]
  );

  // Reset all progress
  const resetAll = useCallback(() => {
    storage.clearProgress();
    reload();
  }, [reload]);

  // Computed stats
  const getStudyStats = useCallback(
    (studyId) => {
      const study = STUDIES[studyId];
      if (!study) return { completed: 0, total: 0, percent: 0 };

      const studyProgress = progress[studyId] || {};
      const completed = Object.values(studyProgress).filter(
        (lp) => lp?.isComplete
      ).length;
      const total = study.totalLessons;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { completed, total, percent };
    },
    [progress]
  );

  const getCoreTrackStats = useCallback(() => {
    const coreStudies = Object.values(STUDIES).filter((s) => s.isCore);
    let totalLessons = 0;
    let completedLessons = 0;

    coreStudies.forEach((study) => {
      const stats = getStudyStats(study.id);
      totalLessons += stats.total;
      completedLessons += stats.completed;
    });

    const percent =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;
    const isComplete = completedLessons >= totalLessons;

    return { totalLessons, completedLessons, percent, isComplete };
  }, [getStudyStats]);

  return {
    progress,
    reload,
    updateLesson,
    completeLesson,
    resetAll,
    getStudyStats,
    getCoreTrackStats,
  };
}
