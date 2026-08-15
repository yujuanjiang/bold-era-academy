"use client";

import { BookOpen, SearchX } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { LessonCard } from "@/components/academy/lesson-card";
import { useRemoteCourseContent } from "@/components/academy/use-remote-courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { courses as fallbackCourses } from "@/lib/academy-data";

export function GenericLessonReader() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const lessonId = searchParams.get("lessonId");
  const { courses, isLoading } = useRemoteCourseContent(fallbackCourses);
  const course = courses.find((courseItem) => courseItem.id === courseId);
  const lesson = course?.lessons.find((lessonItem) => lessonItem.id === lessonId);

  if (!courseId || !lessonId) {
    return (
      <LessonReaderMessage
        icon={<BookOpen className="size-6" />}
        title="Choose a lesson"
        body="Open a lesson from the course catalog to keep learning."
      />
    );
  }

  if (!course || !lesson) {
    if (isLoading) {
      return (
        <main className="grid min-h-dvh place-items-center bg-[#101012] px-5 py-10 text-white">
          <div className="text-sm font-semibold text-white/60">
            Loading lesson...
          </div>
        </main>
      );
    }

    return (
      <LessonReaderMessage
        icon={<SearchX className="size-6" />}
        title="Lesson not found"
        body="This lesson is not available yet. If you just updated the curriculum, redeploy the website and try again."
      />
    );
  }

  return <LessonCard course={course} lesson={lesson} />;
}

function LessonReaderMessage({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#f5f5f7] px-4 py-10 text-[#1c1c1e]">
      <Card className="w-full max-w-md rounded-lg border-0 bg-white py-0 text-center shadow-sm ring-1 ring-black/6">
        <CardContent className="px-6 py-8">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-[#e8f2ff] text-[#0a66d1]">
            {icon}
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-normal">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#636366]">{body}</p>
          <Button
            asChild
            className="mt-6 h-11 rounded-lg bg-[#0a84ff] text-white hover:bg-[#006edb]"
          >
            <Link href="/courses">Back to Courses</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
