"use client";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalAuth } from "@/components/auth/use-local-auth";
import type { Course } from "@/lib/academy-data";
import { cn } from "@/lib/utils";
import { useAcademyProgress } from "./use-academy-progress";

const courseIcons = {
  brain: Brain,
  message: MessageSquare,
  bot: Bot,
  chart: BarChart3,
};

export function CourseCatalog({ courses }: { courses: Course[] }) {
  const { completedCount, firstAvailableLesson } = useAcademyProgress();
  const { currentUser } = useLocalAuth();
  const isAuthenticated = Boolean(currentUser);

  return (
    <main className="min-h-screen bg-[#f7f6fb] px-5 py-6 text-[#100d24] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Button
          asChild
          variant="ghost"
          className="mb-5 text-[#4b4264] hover:bg-[#ede8ff] hover:text-[#30108f]"
        >
          <Link href="/">
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
        </Button>

        <section className="mb-8">
          <Badge className="mb-4 rounded-lg bg-[#eee8ff] text-[#30108f] hover:bg-[#eee8ff]">
            Course catalog
          </Badge>
          <h1 className="text-4xl font-semibold tracking-normal">
            All AI courses
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#625b75]">
            Browse every available Bold Era Academy learning path and continue
            from the next open lesson.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CatalogCourseCard
              key={course.id}
              course={course}
              completedLessons={isAuthenticated ? completedCount(course) : undefined}
              nextLessonId={firstAvailableLesson(course).id}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </section>
      </div>
    </main>
  );
}

function CatalogCourseCard({
  course,
  completedLessons,
  nextLessonId,
  isAuthenticated,
}: {
  course: Course;
  completedLessons?: number;
  nextLessonId: string;
  isAuthenticated: boolean;
}) {
  const Icon = courseIcons[course.icon];
  const isGold = course.tone === "gold";
  const availableLessons = course.lessons.length;
  const progress =
    typeof completedLessons === "number"
      ? Math.round((completedLessons / availableLessons) * 100)
      : 0;

  return (
    <Card className="rounded-xl border-white bg-white py-0 shadow-lg shadow-[#24133f]/8">
      <CardContent className="flex min-h-[300px] flex-col px-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "flex size-16 items-center justify-center rounded-xl text-white shadow-lg",
              isGold
                ? "bg-[#f6b20b] shadow-[#f6b20b]/25"
                : "bg-[#4a22d4] shadow-[#4a22d4]/25"
            )}
          >
            <Icon className="size-8" />
          </div>
          <Badge
            className={cn(
              "rounded-lg px-3",
              isGold
                ? "bg-[#fff3d4] text-[#5f3b00] hover:bg-[#fff3d4]"
                : "bg-[#eee8ff] text-[#30108f] hover:bg-[#eee8ff]"
            )}
          >
            {typeof completedLessons === "number"
              ? `${completedLessons} / ${availableLessons}`
              : `${availableLessons} modules`}
          </Badge>
        </div>

        <div className="mt-6 flex-1">
          <h2 className="text-2xl font-semibold tracking-normal">
            {course.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-[#625b75]">
            {course.description}
          </p>
        </div>

        {isAuthenticated ? (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-[#625b75]">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#e7e3ef]">
              <div
                className={cn(
                  "h-full rounded-full",
                  isGold ? "bg-[#f6ad00]" : "bg-[#4a22d4]"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-lg bg-[#f7f6fb] px-4 py-3 text-sm leading-6 text-[#625b75]">
            Create an account to save progress and unlock lesson completion.
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-lg border-[#e3deef] bg-white"
          >
            <Link href={`/courses/${course.id}`}>
              Details
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            className="h-11 rounded-lg bg-[#4720d5] text-white hover:bg-[#3513b3]"
          >
            <Link
              href={
                isAuthenticated
                  ? `/courses/${course.id}/lessons/${nextLessonId}`
                  : "/login"
              }
            >
              {isAuthenticated ? "Continue" : "Register"}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
