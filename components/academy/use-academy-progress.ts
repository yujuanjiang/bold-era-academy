"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocalAuth } from "@/components/auth/use-local-auth";
import type { Course, Lesson } from "@/lib/academy-data";
import { supabase } from "@/lib/supabase-client";

type LessonProgressRow = {
  course_id: string;
  lesson_id: string;
};

function lessonKey(courseId: string, lessonId: string) {
  return `${courseId}:${lessonId}`;
}

export function useAcademyProgress() {
  const { currentUser } = useLocalAuth();
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    if (!supabase || !currentUser) {
      return;
    }

    let isMounted = true;

    supabase
      .from("lesson_progress")
      .select("course_id, lesson_id")
      .eq("user_id", currentUser.id)
      .then(({ data, error }) => {
        if (!isMounted) {
          return;
        }

        if (error) {
          setCompletedLessonIds([]);
          return;
        }

        const completedKeys = ((data ?? []) as LessonProgressRow[]).map((row) =>
          lessonKey(row.course_id, row.lesson_id)
        );

        setCompletedLessonIds(completedKeys);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const completedLessonKeys = useMemo(
    () => new Set(completedLessonIds),
    [completedLessonIds]
  );

  async function completeLesson(courseId: string, lessonId: string) {
    if (!supabase || !currentUser) {
      return;
    }

    const key = lessonKey(courseId, lessonId);
    setCompletedLessonIds((current) =>
      current.includes(key) ? current : [...current, key]
    );

    const { error } = await supabase.from("lesson_progress").upsert(
      {
        user_id: currentUser.id,
        course_id: courseId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,course_id,lesson_id",
      }
    );

    if (error) {
      setCompletedLessonIds((current) => current.filter((item) => item !== key));
    }
  }

  async function resetProgress() {
    if (!supabase || !currentUser) {
      return;
    }

    const previousCompletedLessonIds = completedLessonIds;
    setCompletedLessonIds([]);

    const { error } = await supabase
      .from("lesson_progress")
      .delete()
      .eq("user_id", currentUser.id);

    if (error) {
      setCompletedLessonIds(previousCompletedLessonIds);
    }
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
