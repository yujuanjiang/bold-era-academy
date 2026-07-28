import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AuthGate } from "@/components/auth/auth-gate";
import { LessonCard } from "@/components/academy/lesson-card";
import { courses, getLesson } from "@/lib/academy-data";

export function generateStaticParams() {
  return courses.flatMap((course) =>
    course.lessons.map((lesson) => ({
      courseId: course.id,
      lessonId: lesson.id,
    }))
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const { course, lesson } = getLesson(courseId, lessonId);

  if (!course || !lesson) {
    notFound();
  }

  return (
    <AuthGate>
      <Suspense fallback={null}>
        <LessonCard course={course} lesson={lesson} />
      </Suspense>
    </AuthGate>
  );
}
