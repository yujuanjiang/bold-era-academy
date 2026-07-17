"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getLessonCards, type Course, type Lesson } from "@/lib/academy-data";
import { cn } from "@/lib/utils";
import { useAcademyProgress } from "./use-academy-progress";

export function LessonCard({
  course,
  lesson,
}: {
  course: Course;
  lesson: Lesson;
}) {
  const { completeLesson, isLessonComplete } = useAcademyProgress();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cards = getLessonCards(lesson);
  const activeCard = cards[activeCardIndex];
  const lessonIndex = course.lessons.findIndex((item) => item.id === lesson.id);
  const availableLessons = course.lessons.length;
  const isComplete = isLessonComplete(course.id, lesson);
  const isLastCard = activeCardIndex === cards.length - 1;
  const cardProgress = Math.round(((activeCardIndex + 1) / cards.length) * 100);

  return (
    <main className="min-h-dvh bg-[#101012] pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] text-white">
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 sm:px-6">
        <header className="sticky top-0 z-30 -mx-4 border-b border-white/10 bg-[#101012]/88 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
          <div className="grid min-h-11 grid-cols-[2.75rem_1fr_2.75rem] items-center">
            <Button
              asChild
              variant="ghost"
              size="icon-lg"
              className="rounded-lg text-white hover:bg-white/10"
            >
              <Link href={`/courses/${course.id}`} aria-label="Back to course">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <div className="min-w-0 text-center">
              <p className="truncate text-[1.05rem] font-semibold">
                {lesson.title}
              </p>
              <p className="text-xs font-medium text-white/55">
                Lesson {lessonIndex + 1} of {availableLessons}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {cards.map((card, index) => (
              <button
                key={card.title}
                type="button"
                aria-label={`Go to card ${index + 1}`}
                onClick={() => setActiveCardIndex(index)}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition",
                  index <= activeCardIndex ? "bg-[#0a84ff]" : "bg-white/18"
                )}
              />
            ))}
          </div>
        </header>

        <section className="grid flex-1 content-center gap-5 py-5">
          <div>
            <div className="flex items-center justify-between gap-3 text-sm font-semibold text-white/60">
              <span>{course.title}</span>
              <span>{cardProgress}%</span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">
              {activeCard.title}
            </h1>
          </div>

          <article className="rounded-lg bg-white px-5 py-6 text-[#1c1c1e] shadow-2xl shadow-black/25 sm:px-7 sm:py-7">
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-11 items-center justify-center rounded-lg bg-[#fff4d7] text-[#ff9f0a]">
                <Lightbulb className="size-6" />
              </span>
              <span className="text-sm font-semibold text-[#6e6e73]">
                Card {activeCardIndex + 1} of {cards.length}
              </span>
            </div>

            <p className="mt-6 text-[1.05rem] leading-8 text-[#2c2c2e]">
              {activeCard.body}
            </p>

            <div className="mt-6 rounded-lg bg-[#f2f2f7] p-4">
              <div className="flex items-center gap-2 font-semibold text-[#1c1c1e]">
                <Star className="size-5 fill-[#ffd60a] text-[#b77900]" />
                Key idea
              </div>
              <p className="mt-2 text-sm leading-6 text-[#3a3a3c]">
                {activeCard.takeaway}
              </p>
            </div>

            {isComplete && (
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#e7f8ed] px-4 py-3 text-sm font-semibold text-[#15803d]">
                <CheckCircle2 className="size-5" />
                Lesson complete. Progress saved.
              </div>
            )}
          </article>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#101012]/88 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-xl">
        <div className="mx-auto grid max-w-3xl grid-cols-[1fr_auto] gap-3">
          <Button
            asChild={isComplete}
            onClick={() => {
              if (!isComplete && !isLastCard) {
                setActiveCardIndex((current) =>
                  Math.min(current + 1, cards.length - 1)
                );
              }

              if (!isComplete && isLastCard) {
                completeLesson(course.id, lesson.id);
              }
            }}
            className={cn(
              "h-13 rounded-lg text-base font-semibold",
              isComplete
                ? "bg-[#0a84ff] text-white hover:bg-[#006edb]"
                : "bg-white text-[#101012] hover:bg-[#f2f2f7]"
            )}
          >
            {isComplete ? (
              <Link href={`/courses/${course.id}`}>
                Back to Course
                <ArrowRight className="size-5" />
              </Link>
            ) : !isLastCard ? (
              <>
                Next
                <ArrowRight className="size-5" />
              </>
            ) : (
              <>
                Finish
                <ArrowRight className="size-5" />
              </>
            )}
          </Button>
          <div className="flex h-13 min-w-20 items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 text-sm font-semibold text-white">
            <CheckCircle2 className="size-5 text-[#34c759]" />
            +{lesson.xp}
          </div>
        </div>
      </div>
    </main>
  );
}
