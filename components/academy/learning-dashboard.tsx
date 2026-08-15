"use client";

import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  BookOpen,
  Flame,
  LogOut,
  MessageSquare,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { MobileTabBar } from "@/components/academy/mobile-tab-bar";
import { useAcademyProgress } from "@/components/academy/use-academy-progress";
import { useRemoteCourses } from "@/components/academy/use-remote-courses";
import { useLocalAuth } from "@/components/auth/use-local-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

export function LearningDashboard({
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
  const { currentUser, signOut } = useLocalAuth();
  const [showContinueSpark, setShowContinueSpark] = useState(false);
  const isAuthenticated = Boolean(currentUser);
  const continueCourse =
    courses.find((course) => course.id === "ai-strategy-basics") ?? courses[0];
  const isContinueCourseEnrolled = isCourseEnrolled(continueCourse.id);
  const continueLesson = firstAvailableLesson(continueCourse);
  const completed = completedCount(continueCourse);
  const availableLessons = continueCourse.lessons.length;
  const progress = Math.round((completed / availableLessons) * 100);

  return (
    <main className="min-h-dvh bg-[#f5f5f7] pb-[calc(5.25rem+var(--app-safe-bottom))] pt-[var(--app-safe-top)] text-[#1c1c1e] md:pb-0">
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-30 -mx-4 border-b border-black/6 bg-[#f5f5f7]/86 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex min-h-11 items-center gap-3">
              <span
                aria-hidden="true"
                className="block size-10 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: "url('/icon.png')" }}
              />
              <span>
                <span className="block text-[1.05rem] font-semibold leading-tight">
                  Bold Era
                </span>
                <span className="block text-xs font-medium text-[#6e6e73]">
                  Academy
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Badge className="hidden h-9 gap-1.5 rounded-lg bg-[#fff4d7] px-3 text-[#6b4a00] hover:bg-[#fff4d7] sm:inline-flex">
                    <Flame className="size-4 fill-[#ff9f0a] text-[#ff9f0a]" />
                    7
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    className="hidden rounded-lg text-[#6e6e73] hover:bg-white hover:text-[#1c1c1e] sm:inline-flex"
                    onClick={signOut}
                    aria-label="Sign out"
                  >
                    <LogOut className="size-5" />
                  </Button>
                  <Link
                    href="/login"
                    aria-label="Open profile"
                    className="rounded-full outline-none transition active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-[#0a84ff]/20"
                  >
                    <Avatar size="lg" className="bg-[#0a84ff] text-white">
                      <AvatarFallback className="bg-[#0a84ff] font-semibold text-white">
                        {getInitials(currentUser?.name ?? "Builder")}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </>
              ) : (
                <Button
                  asChild
                  className="h-11 rounded-lg bg-[#0a84ff] px-4 font-semibold text-white hover:bg-[#006edb]"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              )}
            </div>
          </div>
        </header>

        <section className="grid flex-1 content-start gap-6 py-5 sm:py-8">
          <div>
            <p className="text-sm font-semibold text-[#6e6e73]">
              {isAuthenticated
                ? `Hi ${currentUser?.name.split(" ")[0] ?? "there"}`
                : "Welcome"}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal text-[#1c1c1e] sm:text-4xl">
              Today&apos;s lesson
            </h1>
          </div>

          <Card className="rounded-lg border-0 bg-white py-0 shadow-sm ring-1 ring-black/6">
            <CardContent className="px-4 py-4 sm:px-6 sm:py-6">
              <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#0a66d1]">
                    <BookOpen className="size-4" />
                    {continueCourse.title}
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-normal text-[#1c1c1e]">
                    {isAuthenticated
                      ? continueLesson.title
                      : continueCourse.description}
                  </h2>
                  <p className="mt-2 max-w-2xl text-[0.95rem] leading-6 text-[#636366]">
                    {isAuthenticated
                      ? continueLesson.summary
                      : "Start with bite-size AI lessons and save your progress as you go."}
                  </p>
                </div>

                <Button
                  asChild={!isAuthenticated || isContinueCourseEnrolled}
                  onClick={() => {
                    if (!isAuthenticated || isContinueCourseEnrolled) {
                      return;
                    }

                    enrollCourse(continueCourse.id);
                    setShowContinueSpark(true);
                    window.setTimeout(() => setShowContinueSpark(false), 900);
                  }}
                  className="h-12 rounded-lg bg-[#0a84ff] px-5 text-base font-semibold text-white hover:bg-[#006edb] md:min-w-48"
                >
                  {!isAuthenticated || isContinueCourseEnrolled ? (
                    <Link
                      href={
                        isAuthenticated
                          ? lessonHref(continueCourse.id, continueLesson.id)
                          : "/login"
                      }
                    >
                      <PlayCircle className="size-5 fill-white text-white" />
                      {isAuthenticated ? "Continue" : "Start"}
                    </Link>
                  ) : (
                    <span className="relative inline-flex items-center gap-2">
                      Enrol
                      <Sparkles className="size-5" />
                      {showContinueSpark && (
                        <span className="pointer-events-none absolute -right-6 -top-7 text-[#ffd60a]">
                          <Sparkles className="size-7 animate-[enroll-spark_0.9s_ease-out_forwards] fill-current" />
                        </span>
                      )}
                    </span>
                  )}
                </Button>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#636366]">
                  <span>Course progress</span>
                  <span>
                    {isAuthenticated && isContinueCourseEnrolled
                      ? `${completed} / ${availableLessons}`
                      : isAuthenticated
                        ? "Enroll to track"
                      : `${availableLessons} lessons`}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#e5e5ea]">
                  <div
                    className="h-full rounded-full bg-[#34c759]"
                    style={{
                      width: `${
                        isAuthenticated && isContinueCourseEnrolled
                          ? progress
                          : isAuthenticated
                            ? 0
                            : 8
                      }%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <section id="courses" className="grid gap-3">
            <div className="flex min-h-11 items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-normal">
                  Courses
                </h2>
                <p className="text-sm text-[#6e6e73]">
                  Pick up where you left off.
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                className="hidden h-10 rounded-lg text-[#0a66d1] hover:bg-white sm:inline-flex"
              >
                <Link href="/courses">
                  All
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  completedLessons={
                    isAuthenticated ? completedCount(course) : undefined
                  }
                  isAuthenticated={isAuthenticated}
                  isEnrolled={isCourseEnrolled(course.id)}
                  nextLessonId={firstAvailableLesson(course).id}
                  onEnroll={() => enrollCourse(course.id)}
                />
              ))}
            </div>
          </section>
        </section>
      </div>
      <MobileTabBar />
    </main>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function CourseCard({
  course,
  completedLessons,
  isAuthenticated,
  isEnrolled,
  nextLessonId,
  onEnroll,
}: {
  course: Course;
  completedLessons?: number;
  isAuthenticated: boolean;
  isEnrolled: boolean;
  nextLessonId: string;
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
    <Card className="min-w-[78vw] max-w-[21rem] snap-start rounded-lg border-0 bg-white py-0 shadow-sm ring-1 ring-black/6 transition active:scale-[0.99] sm:min-w-[20rem]">
      <CardContent className="flex min-h-52 flex-col px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-lg text-white",
                isGold ? "bg-[#ff9f0a]" : "bg-[#0a84ff]"
              )}
            >
              <Icon className="size-6" />
            </div>
            {isEnrolled && (
              <Badge className="h-8 rounded-lg bg-[#e7f8ed] px-3 text-xs font-semibold text-[#15803d] hover:bg-[#e7f8ed]">
                Enrolled
              </Badge>
            )}
          </div>
          <Button
            asChild
            variant="ghost"
            size="icon-lg"
            className="rounded-lg text-[#6e6e73] hover:bg-[#f2f2f7] hover:text-[#1c1c1e]"
          >
            <Link href={`/courses/${course.id}`} aria-label={`Open ${course.title}`}>
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>

        <div className="mt-5 flex-1">
          <h3 className="text-lg font-semibold tracking-normal text-[#1c1c1e]">
            {course.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#636366]">
            {course.description}
          </p>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6e6e73]">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="size-4" />
              Progress
            </span>
            <span>
              {isEnrolled && typeof completedLessons === "number"
                ? `${completedLessons} / ${availableLessons}`
                : isAuthenticated
                  ? "Enroll to track"
                  : `${availableLessons} lessons`}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#e5e5ea]">
            <div
              className={cn(
                "h-full rounded-full",
                isGold ? "bg-[#ff9f0a]" : "bg-[#34c759]"
              )}
              style={{
                width: `${
                  isEnrolled && typeof completedLessons === "number"
                    ? progress
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

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
          className={cn(
            "mt-4 h-10 rounded-lg text-sm font-semibold",
            isEnrolled
              ? "bg-[#0a84ff] text-white hover:bg-[#006edb]"
              : "bg-[#3b168c] text-white hover:bg-[#2b0f68]"
          )}
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
      </CardContent>
    </Card>
  );
}
