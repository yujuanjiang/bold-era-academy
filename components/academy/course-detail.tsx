"use client";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  Lock,
  MessageSquare,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";

import { MobileTabBar } from "@/components/academy/mobile-tab-bar";
import { useAcademyProgress } from "@/components/academy/use-academy-progress";
import { useLocalAuth } from "@/components/auth/use-local-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Course, Lesson } from "@/lib/academy-data";
import { cn } from "@/lib/utils";

const courseIcons = {
  brain: Brain,
  message: MessageSquare,
  bot: Bot,
  chart: BarChart3,
};

export function CourseDetail({ course }: { course: Course }) {
  const { completedCount, firstAvailableLesson, isLessonComplete } =
    useAcademyProgress();
  const { currentUser } = useLocalAuth();
  const isAuthenticated = Boolean(currentUser);
  const completed = completedCount(course);
  const availableLessons = course.lessons.length;
  const progress = Math.round((completed / availableLessons) * 100);
  const Icon = courseIcons[course.icon];
  const isGold = course.tone === "gold";

  return (
    <main className="min-h-dvh bg-[#f5f5f7] pb-[calc(5.25rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] text-[#1c1c1e] md:pb-0">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="sticky top-0 z-30 -mx-4 border-b border-black/6 bg-[#f5f5f7]/86 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
          <div className="grid min-h-11 grid-cols-[2.75rem_1fr_2.75rem] items-center">
            <Button
              asChild
              variant="ghost"
              size="icon-lg"
              className="rounded-lg text-[#0a66d1] hover:bg-white"
            >
              <Link href="/courses" aria-label="Back to Courses">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <p className="truncate text-center text-[1.05rem] font-semibold">
              {course.title}
            </p>
          </div>
        </header>

        <section className="grid gap-5 py-5">
          <Card className="rounded-lg border-0 bg-white py-0 shadow-sm ring-1 ring-black/6">
            <CardContent className="px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex size-14 shrink-0 items-center justify-center rounded-lg text-white",
                    isGold ? "bg-[#ff9f0a]" : "bg-[#0a84ff]"
                  )}
                >
                  <Icon className="size-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge
                    className={cn(
                      "mb-2 h-8 rounded-lg px-3 text-xs font-semibold hover:bg-inherit",
                      isGold
                        ? "bg-[#fff4d7] text-[#6b4a00]"
                        : "bg-[#e8f2ff] text-[#0a66d1]"
                    )}
                  >
                    {isAuthenticated
                      ? `${completed} of ${availableLessons} complete`
                      : `${availableLessons} lessons`}
                  </Badge>
                  <h1 className="text-2xl font-semibold tracking-normal">
                    {course.title}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-[#636366]">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6e6e73]">
                  <span>Progress</span>
                  <span>{isAuthenticated ? `${progress}%` : "Sign in to save"}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#e5e5ea]">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      isGold ? "bg-[#ff9f0a]" : "bg-[#34c759]"
                    )}
                    style={{ width: `${isAuthenticated ? progress : 0}%` }}
                  />
                </div>
              </div>

              <Button
                asChild
                className="mt-5 h-12 w-full rounded-lg bg-[#0a84ff] text-base font-semibold text-white hover:bg-[#006edb]"
              >
                <Link
                  href={
                    isAuthenticated
                      ? `/courses/${course.id}/lessons/${
                          firstAvailableLesson(course).id
                        }`
                      : "/login"
                  }
                >
                  {isAuthenticated ? "Continue" : "Sign in to start"}
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <section>
            <h2 className="mb-3 px-1 text-sm font-semibold uppercase tracking-normal text-[#6e6e73]">
              Lessons
            </h2>
            <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/6">
              {course.lessons.map((lesson, index) => {
                const previousLessons = course.lessons.slice(0, index);
                const isUnlocked =
                  isAuthenticated &&
                  (lesson.status !== "locked" ||
                    previousLessons.every((item) =>
                      isLessonComplete(course.id, item)
                    ));

                return (
                  <LessonRow
                    key={lesson.id}
                    course={course}
                    lesson={lesson}
                    lessonNumber={index + 1}
                    isComplete={
                      isAuthenticated && isLessonComplete(course.id, lesson)
                    }
                    isUnlocked={isUnlocked}
                    isAuthenticated={isAuthenticated}
                    isLast={index === course.lessons.length - 1}
                  />
                );
              })}
            </div>
          </section>
        </section>
      </div>
      <MobileTabBar />
    </main>
  );
}

function LessonRow({
  course,
  lesson,
  lessonNumber,
  isComplete,
  isUnlocked,
  isAuthenticated,
  isLast,
}: {
  course: Course;
  lesson: Lesson;
  lessonNumber: number;
  isComplete: boolean;
  isUnlocked: boolean;
  isAuthenticated: boolean;
  isLast: boolean;
}) {
  const content = (
    <div
      className={cn(
        "grid min-h-20 grid-cols-[2.75rem_1fr_auto] items-center gap-3 px-4 py-3 transition",
        !isLast && "border-b border-black/6",
        (isUnlocked || !isAuthenticated) && "active:bg-[#f2f2f7]"
      )}
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-lg text-sm font-semibold",
          isComplete
            ? "bg-[#e7f8ed] text-[#15803d]"
            : !isAuthenticated || !isUnlocked
              ? "bg-[#f2f2f7] text-[#8e8e93]"
              : "bg-[#e8f2ff] text-[#0a66d1]"
        )}
      >
        {isComplete ? (
          <CheckCircle2 className="size-5" />
        ) : !isAuthenticated || !isUnlocked ? (
          <Lock className="size-5" />
        ) : (
          lessonNumber
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold tracking-normal">
            {lesson.title}
          </h3>
          <span className="shrink-0 text-xs font-semibold text-[#8e8e93]">
            +{lesson.xp}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#636366]">
          {lesson.summary}
        </p>
      </div>

      {isUnlocked || !isAuthenticated ? (
        <PlayCircle className="size-5 text-[#0a66d1]" />
      ) : (
        <Lock className="size-4 text-[#8e8e93]" />
      )}
    </div>
  );

  if (!isAuthenticated) {
    return <Link href="/login">{content}</Link>;
  }

  if (!isUnlocked) {
    return content;
  }

  return <Link href={`/courses/${course.id}/lessons/${lesson.id}`}>{content}</Link>;
}
