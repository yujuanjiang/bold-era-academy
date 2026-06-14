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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Course, Lesson } from "@/lib/academy-data";
import { cn } from "@/lib/utils";
import { useAcademyProgress } from "./use-academy-progress";

const courseIcons = {
  brain: Brain,
  message: MessageSquare,
  bot: Bot,
  chart: BarChart3,
};

export function CourseDetail({ course }: { course: Course }) {
  const { completedCount, firstAvailableLesson, isLessonComplete } =
    useAcademyProgress();
  const completed = completedCount(course);
  const availableLessons = course.lessons.length;
  const progress = Math.round((completed / availableLessons) * 100);
  const Icon = courseIcons[course.icon];
  const isGold = course.tone === "gold";

  return (
    <main className="min-h-screen bg-[#f7f6fb] px-5 py-6 text-[#100d24] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
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

        <Card className="rounded-xl border-white bg-white py-0 shadow-xl shadow-[#24133f]/8">
          <CardContent className="grid gap-7 px-6 py-7 md:grid-cols-[auto_1fr_auto] md:items-center md:px-8">
            <div
              className={cn(
                "flex size-20 items-center justify-center rounded-xl text-white shadow-lg",
                isGold
                  ? "bg-[#f6b20b] shadow-[#f6b20b]/25"
                  : "bg-[#4a22d4] shadow-[#4a22d4]/25"
              )}
            >
              <Icon className="size-10" />
            </div>

            <div>
              <Badge
                className={cn(
                  "mb-3 rounded-lg px-3",
                  isGold
                    ? "bg-[#fff3d4] text-[#5f3b00] hover:bg-[#fff3d4]"
                    : "bg-[#eee8ff] text-[#30108f] hover:bg-[#eee8ff]"
                )}
              >
                {completed} of {availableLessons} complete
              </Badge>
              <h1 className="text-3xl font-semibold tracking-normal">
                {course.title}
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-[#625b75]">
                {course.description}
              </p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#e7e3ef]">
                <div
                  className={cn(
                    "h-full rounded-full",
                    isGold ? "bg-[#f6ad00]" : "bg-[#4a22d4]"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <Button
              asChild
              className="h-12 rounded-lg bg-[#4720d5] px-5 text-white shadow-lg shadow-[#4720d5]/20 hover:bg-[#3513b3]"
            >
              <Link
                href={`/courses/${course.id}/lessons/${
                  firstAvailableLesson(course).id
                }`}
              >
                Continue
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-normal">Lessons</h2>
              <p className="mt-1 text-sm text-[#676174]">
                Short cards you can finish during a coffee break.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {course.lessons.map((lesson, index) => {
              const previousLessons = course.lessons.slice(0, index);
              const isUnlocked =
                lesson.status !== "locked" ||
                previousLessons.every((item) => isLessonComplete(course.id, item));

              return (
                <LessonRow
                  key={lesson.id}
                  course={course}
                  lesson={lesson}
                  lessonNumber={index + 1}
                  isComplete={isLessonComplete(course.id, lesson)}
                  isUnlocked={isUnlocked}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function LessonRow({
  course,
  lesson,
  lessonNumber,
  isComplete,
  isUnlocked,
}: {
  course: Course;
  lesson: Lesson;
  lessonNumber: number;
  isComplete: boolean;
  isUnlocked: boolean;
}) {
  return (
    <Card className="rounded-xl border-white bg-white py-0 shadow-md shadow-[#24133f]/6">
      <CardContent className="grid gap-4 px-5 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-lg font-semibold",
            isComplete
              ? "bg-[#e8f8ef] text-[#118347]"
              : !isUnlocked
                ? "bg-[#f0edf5] text-[#8b849a]"
                : "bg-[#eee8ff] text-[#30108f]"
          )}
        >
          {isComplete ? (
            <CheckCircle2 className="size-5" />
          ) : !isUnlocked ? (
            <Lock className="size-5" />
          ) : (
            lessonNumber
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold tracking-normal">
              {lesson.title}
            </h3>
            <Badge className="rounded-lg bg-[#f4f1ff] text-[#4b4264] hover:bg-[#f4f1ff]">
              {lesson.kind}
            </Badge>
            <Badge className="rounded-lg bg-[#fff3d4] text-[#5f3b00] hover:bg-[#fff3d4]">
              +{lesson.xp} XP
            </Badge>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#625b75]">
            {lesson.summary}
          </p>
        </div>

        <Button
          asChild={isUnlocked}
          disabled={!isUnlocked}
          variant={isComplete ? "outline" : "default"}
          className={cn(
            "h-10 rounded-lg",
            !isComplete && isUnlocked && "bg-[#4720d5] text-white hover:bg-[#3513b3]"
          )}
        >
          {isUnlocked ? (
            <Link href={`/courses/${course.id}/lessons/${lesson.id}`}>
              {isComplete ? "Review" : "Start"}
              <PlayCircle className="size-4" />
            </Link>
          ) : (
            "Locked"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
