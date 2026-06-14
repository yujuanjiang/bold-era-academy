import { notFound } from "next/navigation";

import { CourseDetail } from "@/components/academy/course-detail";
import { courses, getCourse } from "@/lib/academy-data";

export function generateStaticParams() {
  return courses.map((course) => ({
    courseId: course.id,
  }));
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = getCourse(courseId);

  if (!course) {
    notFound();
  }

  return <CourseDetail course={course} />;
}
