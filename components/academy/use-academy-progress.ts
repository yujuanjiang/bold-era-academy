"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocalAuth } from "@/components/auth/use-local-auth";
import type { Course, Lesson } from "@/lib/academy-data";
import { supabase } from "@/lib/supabase-client";

type LessonProgressRow = {
  course_id: string;
  lesson_id: string;
};

type CourseEnrollmentRow = {
  course_id: string;
};

function lessonKey(courseId: string, lessonId: string) {
  return `${courseId}:${lessonId}`;
}

export function useAcademyProgress() {
  const { currentUser } = useLocalAuth();
  const [progressOwnerId, setProgressOwnerId] = useState<string | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  useEffect(() => {
    if (!supabase || !currentUser) {
      return;
    }

    let isMounted = true;

    Promise.all([
      supabase
        .from("lesson_progress")
        .select("course_id, lesson_id")
        .eq("user_id", currentUser.id),
      supabase
        .from("course_enrollments")
        .select("course_id")
        .eq("user_id", currentUser.id),
    ]).then(([progressResult, enrollmentResult]) => {
      if (!isMounted) {
        return;
      }

      if (progressResult.error) {
        setCompletedLessonIds([]);
      } else {
        const completedKeys = (
          (progressResult.data ?? []) as LessonProgressRow[]
        ).map((row) => lessonKey(row.course_id, row.lesson_id));

        setCompletedLessonIds(completedKeys);
      }

      if (enrollmentResult.error) {
        setEnrolledCourseIds([]);
      } else {
        setEnrolledCourseIds(
          ((enrollmentResult.data ?? []) as CourseEnrollmentRow[]).map(
            (row) => row.course_id
          )
        );
      }

      setProgressOwnerId(currentUser.id);
    });

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const completedLessonKeys = useMemo(
    () => new Set(completedLessonIds),
    [completedLessonIds]
  );
  const enrolledCourseIdSet = useMemo(
    () => new Set(enrolledCourseIds),
    [enrolledCourseIds]
  );

  async function enrollCourse(courseId: string) {
    if (!supabase || !currentUser) {
      return;
    }

    setEnrolledCourseIds((current) =>
      current.includes(courseId) ? current : [...current, courseId]
    );
    setProgressOwnerId(currentUser.id);

    const { error } = await supabase.from("course_enrollments").upsert(
      {
        user_id: currentUser.id,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,course_id",
      }
    );

    if (error) {
      setEnrolledCourseIds((current) =>
        current.filter((item) => item !== courseId)
      );
    }
  }

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
    const previousEnrolledCourseIds = enrolledCourseIds;
    setCompletedLessonIds([]);
    setEnrolledCourseIds([]);
    setProgressOwnerId(currentUser.id);

    const [{ error: progressError }, { error: enrollmentError }] =
      await Promise.all([
        supabase.from("lesson_progress").delete().eq("user_id", currentUser.id),
        supabase
          .from("course_enrollments")
          .delete()
          .eq("user_id", currentUser.id),
      ]);

    if (progressError || enrollmentError) {
      setCompletedLessonIds(previousCompletedLessonIds);
      setEnrolledCourseIds(previousEnrolledCourseIds);
    }
  }

  function isCourseEnrolled(courseId: string) {
    return (
      Boolean(currentUser) &&
      progressOwnerId === currentUser?.id &&
      enrolledCourseIdSet.has(courseId)
    );
  }

  function isLessonComplete(courseId: string, lesson: Lesson) {
    return (
      isCourseEnrolled(courseId) &&
      (lesson.status === "complete" ||
        completedLessonKeys.has(lessonKey(courseId, lesson.id)))
    );
  }

  function completedCount(course: Course) {
    if (!isCourseEnrolled(course.id)) {
      return 0;
    }

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
    enrollCourse,
    completeLesson,
    resetProgress,
    isCourseEnrolled,
    isLessonComplete,
    completedCount,
    firstAvailableLesson,
  };
}
