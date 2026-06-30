"use client";

import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  Flame,
  LogOut,
  MessageSquare,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Course } from "@/lib/academy-data";
import { cn } from "@/lib/utils";
import { useLocalAuth } from "@/components/auth/use-local-auth";
import { useAcademyProgress } from "./use-academy-progress";

const courseIcons = {
  brain: Brain,
  message: MessageSquare,
  bot: Bot,
  chart: BarChart3,
};

export function LearningDashboard({ courses }: { courses: Course[] }) {
  const { completedCount, firstAvailableLesson } = useAcademyProgress();
  const { currentUser, signOut } = useLocalAuth();
  const isAuthenticated = Boolean(currentUser);
  const continueCourse =
    courses.find((course) => course.id === "ai-strategy-basics") ?? courses[0];
  const continueLesson = firstAvailableLesson(continueCourse);
  const completed = completedCount(continueCourse);
  const availableLessons = continueCourse.lessons.length;

  return (
    <main className="min-h-screen bg-[#f7f6fb] text-[#100d24]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4 rounded-xl border border-white bg-white/80 px-4 py-3 shadow-sm shadow-[#1d1340]/5 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#30108f] text-[#ffc533] shadow-lg shadow-[#30108f]/20">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">
                Bold Era Academy
              </p>
              <p className="text-xs text-[#676174]">AI skills, one card a day</p>
            </div>
          </div>

          <nav className="hidden items-center gap-1 rounded-lg bg-[#f4f1ff] p-1 text-sm font-medium text-[#60577a] md:flex">
            <a
              className="rounded-md bg-white px-3 py-1.5 text-[#30108f] shadow-sm"
              href="#courses"
            >
              Learn
            </a>
            {isAuthenticated && (
              <a
                className="rounded-md px-3 py-1.5 hover:bg-white/70"
                href="#courses"
              >
                My Progress
              </a>
            )}
            <Link
              className="rounded-md px-3 py-1.5 hover:bg-white/70"
              href="/courses"
            >
              Explore More
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Badge className="h-8 gap-1.5 rounded-lg bg-[#fff4cf] px-3 text-[#5f3b00] hover:bg-[#fff4cf]">
                  <Flame className="size-4 fill-[#ffb71b] text-[#ff9f0a]" />
                  7
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden rounded-lg text-[#625b75] hover:bg-[#f4f1ff] hover:text-[#30108f] sm:inline-flex"
                  onClick={signOut}
                  aria-label="Sign out"
                >
                  <LogOut className="size-4" />
                </Button>
                <Avatar size="lg" className="bg-[#30108f] text-white">
                  <AvatarFallback className="bg-[#30108f] font-semibold text-white">
                    {getInitials(currentUser?.name ?? "Builder")}
                  </AvatarFallback>
                </Avatar>
              </>
            ) : (
              <Button
                asChild
                className="h-9 rounded-lg bg-[#4720d5] text-white hover:bg-[#3513b3]"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </header>

        <section className="grid flex-1 content-center gap-8 py-8">
          <Card className="rounded-xl border-white bg-white/95 py-0 shadow-xl shadow-[#22113f]/8">
            <CardContent className="px-5 py-8 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-5xl text-center">
                <h1 className="text-3xl font-semibold tracking-normal text-[#120d28] sm:text-4xl">
                  Continue your AI journey
                </h1>
                <p className="mt-2 text-base text-[#676174]">
                  {isAuthenticated
                    ? "One lesson at a time. Big impact."
                    : "Browse practical AI courses and register when you are ready to track progress."}
                </p>
              </div>

              <div className="mx-auto mt-8 grid max-w-4xl items-center gap-8 lg:grid-cols-[220px_1fr]">
                <div className="relative mx-auto flex aspect-square w-full max-w-[220px] items-center justify-center overflow-hidden rounded-xl bg-[#30108f] shadow-lg shadow-[#30108f]/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,197,51,0.25),transparent_22%),radial-gradient(circle_at_75%_70%,rgba(255,255,255,0.18),transparent_28%)]" />
                  <div className="absolute left-7 top-8 size-1.5 rounded-full bg-[#ffc533]" />
                  <div className="absolute right-9 top-12 size-1 rounded-full bg-[#ffc533]" />
                  <div className="absolute bottom-12 left-11 size-1 rounded-full bg-white/50" />
                  <div className="relative rotate-6 rounded-lg bg-white p-4 shadow-xl">
                    <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-[#4f25dc] text-lg font-bold text-white">
                      AI
                    </div>
                    <div className="space-y-2">
                      <span className="block h-2 w-24 rounded-full bg-[#dedbea]" />
                      <span className="block h-2 w-16 rounded-full bg-[#dedbea]" />
                      <span className="block h-8 w-28 rounded-md bg-[#f0eef8]" />
                    </div>
                  </div>
                </div>

                <div className="text-center lg:text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3010b6]">
                    {continueCourse.title}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-normal text-[#100d24]">
                    {isAuthenticated ? continueLesson.title : continueCourse.description}
                  </h2>
                  {isAuthenticated ? (
                    <div className="mt-5 flex items-center gap-4">
                      <span className="min-w-fit text-base font-medium text-[#60577a]">
                        {completed} of {availableLessons}
                      </span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#e7e3ef]">
                        <div
                          className="h-full rounded-full bg-[#f6ad00]"
                          style={{
                            width: `${Math.round(
                              (completed / availableLessons) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <Badge className="mt-5 h-9 rounded-lg bg-[#fff3d4] px-4 text-[#5f3b00] hover:bg-[#fff3d4]">
                      {availableLessons} available modules
                    </Badge>
                  )}
                  <Button
                    asChild
                    className="mt-7 h-14 w-full rounded-lg bg-[#4720d5] text-base font-semibold text-white shadow-lg shadow-[#4720d5]/25 hover:bg-[#3513b3] lg:max-w-md"
                  >
                    <Link
                      href={
                        isAuthenticated
                          ? `/courses/${continueCourse.id}/lessons/${continueLesson.id}`
                          : "/login"
                      }
                    >
                      <PlayCircle className="size-5 fill-white text-white" />
                      {isAuthenticated ? "Continue Lesson" : "Register to Start"}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <section id="courses">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-normal">
                  Choose Your Next Path
                </h2>
                <p className="mt-1 text-sm text-[#676174]">
                  Swipe or scroll through bite-size AI courses.
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                className="hidden text-[#30108f] hover:bg-[#ede8ff] sm:inline-flex"
              >
                <Link href="/courses">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 hidden w-20 bg-gradient-to-l from-[#f7f6fb] to-transparent md:block" />
              <div className="flex snap-x gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    completedLessons={
                      isAuthenticated ? completedCount(course) : undefined
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>
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
}: {
  course: Course;
  completedLessons?: number;
}) {
  const Icon = courseIcons[course.icon];
  const isGold = course.tone === "gold";
  const availableLessons = course.lessons.length;

  return (
    <Card className="min-w-[280px] max-w-[340px] snap-start rounded-xl border-white bg-white py-0 shadow-lg shadow-[#24133f]/8 transition hover:-translate-y-0.5 hover:shadow-xl sm:min-w-[320px]">
      <CardContent className="flex min-h-[240px] flex-col px-6 py-6">
        <div className="flex items-start justify-between gap-6">
          <div
            className={cn(
              "flex size-16 items-center justify-center rounded-xl shadow-lg",
              isGold
                ? "bg-[#f6b20b] text-white shadow-[#f6b20b]/25"
                : "bg-[#4a22d4] text-white shadow-[#4a22d4]/25"
            )}
          >
            <Icon className="size-8" />
          </div>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-lg text-[#5f5773] hover:bg-[#f2efff] hover:text-[#30108f]"
          >
            <Link href={`/courses/${course.id}`} aria-label={`Open ${course.title}`}>
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 flex-1">
          <h3 className="text-xl font-semibold tracking-normal text-[#100d24]">
            {course.title}
          </h3>
          <p className="mt-3 min-h-12 text-base leading-7 text-[#605b74]">
            {course.description}
          </p>
        </div>

        <Badge
          className={cn(
            "mt-6 h-9 w-fit gap-2 rounded-lg px-4 text-sm font-semibold hover:bg-inherit",
            isGold
              ? "bg-[#fff3d4] text-[#3b2a00]"
              : "bg-[#eee8ff] text-[#30108f]"
          )}
        >
          <BarChart3
            className={cn(
              "size-4",
              isGold ? "text-[#f6a800]" : "text-[#4a22d4]"
            )}
          />
          {typeof completedLessons === "number"
            ? `${completedLessons} / ${availableLessons}`
            : `${availableLessons} modules`}
        </Badge>
      </CardContent>
    </Card>
  );
}
