"use client";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { MobileTabBar } from "@/components/academy/mobile-tab-bar";
import { useAcademyProgress } from "@/components/academy/use-academy-progress";
import { useRemoteCourses } from "@/components/academy/use-remote-courses";
import { useLocalAuth } from "@/components/auth/use-local-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Course } from "@/lib/academy-data";
import { lessonHref } from "@/lib/academy-routes";
import { cn } from "@/lib/utils";

const courseIcons = {
  brain: Brain,
  message: MessageSquare,
  bot: Bot,
  chart: BarChart3,
};

export function CourseCatalog({
  courses: initialCourses,
}: {
  courses: Course[];
}) {
  const courses = useRemoteCourses(initialCourses);
  const {
    completedCount,
    enrollCourse,
    firstAvailableLesson,
    isCourseEnrolled,
  } = useAcademyProgress();
  const { currentUser } = useLocalAuth();
  const isAuthenticated = Boolean(currentUser);

  return (
    <main className="min-h-dvh bg-[#f5f5f7] pb-[calc(5.25rem+var(--app-safe-bottom))] pt-[var(--app-safe-top)] text-[#1c1c1e] md:pb-0">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-30 -mx-4 border-b border-black/6 bg-[#f5f5f7]/86 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="grid min-h-11 grid-cols-[2.75rem_1fr_2.75rem] items-center">
            <Button
              asChild
              variant="ghost"
              size="icon-lg"
              className="rounded-lg text-[#0a66d1] hover:bg-white"
            >
              <Link href="/" aria-label="Back to Today">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <div className="text-center">
              <p className="text-[1.05rem] font-semibold">Courses</p>
              <p className="text-xs font-medium text-[#6e6e73]">
                {courses.length} learning paths
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CatalogCourseCard
              key={course.id}
              course={course}
              completedLessons={isAuthenticated ? completedCount(course) : undefined}
              nextLessonId={firstAvailableLesson(course).id}
              isAuthenticated={isAuthenticated}
              isEnrolled={isCourseEnrolled(course.id)}
              onEnroll={() => enrollCourse(course.id)}
            />
          ))}
        </section>
      </div>
      <MobileTabBar />
    </main>
  );
}

function CatalogCourseCard({
  course,
  completedLessons,
  nextLessonId,
  isAuthenticated,
  isEnrolled,
  onEnroll,
}: {
  course: Course;
  completedLessons?: number;
  nextLessonId: string;
  isAuthenticated: boolean;
  isEnrolled: boolean;
  onEnroll: () => void;
}) {
  const [showSpark, setShowSpark] = useState(false);
  const Icon = courseIcons[course.icon];
  const isGold = course.tone === "gold";
  const availableLessons = course.lessons.length;
  const progress =
    typeof completedLessons === "number"
      ? Math.round((completedLessons / availableLessons) * 100)
      : 0;

  return (
    <Card className="rounded-lg border-0 bg-white py-0 shadow-sm ring-1 ring-black/6">
      <CardContent className="flex min-h-64 flex-col px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-lg text-white",
              isGold ? "bg-[#ff9f0a]" : "bg-[#0a84ff]"
            )}
          >
            <Icon className="size-6" />
          </div>
          <Badge
            className={cn(
              "h-8 rounded-lg px-3 text-xs font-semibold hover:bg-inherit",
              isEnrolled
                ? "bg-[#e7f8ed] text-[#15803d]"
                : isGold
                  ? "bg-[#fff4d7] text-[#6b4a00]"
                  : "bg-[#e8f2ff] text-[#0a66d1]"
            )}
          >
            {isEnrolled && typeof completedLessons === "number"
              ? `${completedLessons} / ${availableLessons}`
              : isEnrolled
                ? "Enrolled"
                : `${availableLessons} lessons`}
          </Badge>
        </div>

        <div className="mt-5 flex-1">
          <h2 className="text-xl font-semibold tracking-normal">
            {course.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#636366]">
            {course.description}
          </p>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6e6e73]">
            <span>Progress</span>
            <span>
              {isAuthenticated && isEnrolled
                ? `${progress}%`
                : isAuthenticated
                  ? "Enroll to track"
                  : "Sign in to track"}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#e5e5ea]">
            <div
              className={cn(
                "h-full rounded-full",
                isGold ? "bg-[#ff9f0a]" : "bg-[#34c759]"
              )}
              style={{ width: `${isAuthenticated && isEnrolled ? progress : 0}%` }}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_1fr] gap-2">
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-lg border-[#d1d1d6] bg-white text-[#1c1c1e]"
          >
            <Link href={`/courses/${course.id}`}>
              Details
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild={!isAuthenticated || isEnrolled}
            onClick={() => {
              if (!isAuthenticated || isEnrolled) {
                return;
              }

              onEnroll();
              setShowSpark(true);
              window.setTimeout(() => setShowSpark(false), 900);
            }}
            className="h-11 rounded-lg bg-[#0a84ff] text-white hover:bg-[#006edb]"
          >
            {isEnrolled || !isAuthenticated ? (
              <Link
                href={
                  isAuthenticated
                    ? lessonHref(course.id, nextLessonId)
                    : "/login"
                }
              >
                {isAuthenticated ? "Start" : "Sign in"}
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center gap-1.5">
                Enrol
                <Sparkles className="size-4" />
                {showSpark && (
                  <span className="pointer-events-none absolute -right-5 -top-6 text-[#ffd60a]">
                    <Sparkles className="size-6 animate-[enroll-spark_0.9s_ease-out_forwards] fill-current" />
                  </span>
                )}
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
