"use client";

import { useMemo, useSyncExternalStore } from "react";

import type { Course, Lesson } from "@/lib/academy-data";

const storageKey = "bold-era-academy-progress-v1";
const emptyProgressJson = JSON.stringify({ completedLessonIds: [] });
const progressUpdatedEvent = "bold-era-academy-progress-updated";

type StoredProgress = {
  completedLessonIds: string[];
};

function lessonKey(courseId: string, lessonId: string) {
  return `${courseId}:${lessonId}`;
}

function readProgress(): StoredProgress {
  if (typeof window === "undefined") {
    return { completedLessonIds: [] };
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return { completedLessonIds: [] };
    }

    const parsed = JSON.parse(stored) as Partial<StoredProgress>;
    return {
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds
        : [],
    };
  } catch {
    return { completedLessonIds: [] };
  }
}

function getProgressSnapshot() {
  if (typeof window === "undefined") {
    return emptyProgressJson;
  }

  return window.localStorage.getItem(storageKey) ?? emptyProgressJson;
}

function subscribeToProgress(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(progressUpdatedEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(progressUpdatedEvent, callback);
  };
}

function writeProgress(progress: StoredProgress) {
  window.localStorage.setItem(storageKey, JSON.stringify(progress));
  window.dispatchEvent(new Event(progressUpdatedEvent));
}

export function useAcademyProgress() {
  const progressJson = useSyncExternalStore(
    subscribeToProgress,
    getProgressSnapshot,
    () => emptyProgressJson
  );
  const progress = useMemo(() => readProgressJson(progressJson), [progressJson]);

  const completedLessonKeys = useMemo(
    () => new Set(progress.completedLessonIds),
    [progress.completedLessonIds]
  );

  function completeLesson(courseId: string, lessonId: string) {
    const nextCompleted = new Set(readProgress().completedLessonIds);
    nextCompleted.add(lessonKey(courseId, lessonId));

    writeProgress({
      completedLessonIds: Array.from(nextCompleted),
    });
  }

  function resetProgress() {
    writeProgress({ completedLessonIds: [] });
  }

  function isLessonComplete(courseId: string, lesson: Lesson) {
    return (
      lesson.status === "complete" ||
      completedLessonKeys.has(lessonKey(courseId, lesson.id))
    );
  }

  function completedCount(course: Course) {
    return course.lessons.filter((lesson) => isLessonComplete(course.id, lesson))
      .length;
  }

  function firstAvailableLesson(course: Course) {
    return (
      course.lessons.find((lesson) => !isLessonComplete(course.id, lesson)) ??
      course.lessons[0]
    );
  }

  return {
    completeLesson,
    resetProgress,
    isLessonComplete,
    completedCount,
    firstAvailableLesson,
  };
}

function readProgressJson(progressJson: string): StoredProgress {
  try {
    const parsed = JSON.parse(progressJson) as Partial<StoredProgress>;
    return {
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds
        : [],
    };
  } catch {
    return { completedLessonIds: [] };
  }
}
