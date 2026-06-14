"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <main className="min-h-screen bg-[#12072f] px-5 py-6 text-white sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <Button
            asChild
            variant="ghost"
            className="mb-5 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <Link href={`/courses/${course.id}`}>
              <ArrowLeft className="size-4" />
              {course.title}
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            {course.lessons.slice(0, 6).map((item, index) => (
              <span
                key={item.id}
                className={cn(
                  "h-2.5 flex-1 rounded-full",
                  index <= lessonIndex ? "bg-[#ffc533]" : "bg-white/28"
                )}
              />
            ))}
          </div>

          <div className="mt-10">
            <Badge className="rounded-lg bg-white/10 text-white hover:bg-white/10">
              Lesson {lessonIndex + 1} of {availableLessons}
            </Badge>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-normal sm:text-5xl">
              {lesson.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/72">
              {lesson.summary}
            </p>
          </div>
        </section>

        <Card className="rounded-xl border-white/10 bg-white py-0 text-[#100d24] shadow-2xl shadow-black/30">
          <CardContent className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#fff3d4] text-[#f6a800]">
                <Lightbulb className="size-6" />
              </div>
              <p className="text-sm font-medium text-[#625b75]">
                Card {activeCardIndex + 1} / {cards.length}
              </p>
            </div>

            <div className="mt-8 space-y-5 text-base leading-8 text-[#3e3850]">
              <h2 className="text-2xl font-semibold leading-tight text-[#100d24]">
                {activeCard.title}
              </h2>
              <p>{activeCard.body}</p>
            </div>

            <div className="mt-8 rounded-xl bg-[#f4f1ff] p-5">
              <div className="flex items-center gap-2 font-semibold text-[#30108f]">
                <Star className="size-5 fill-[#30108f]" />
                Key idea
              </div>
              <p className="mt-3 text-sm leading-6 text-[#3e3850]">
                {activeCard.takeaway}
              </p>
            </div>

            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-[#625b75]">
                <span>Card progress</span>
                <span>{cardProgress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#e7e3ef]">
                <div
                  className="h-full rounded-full bg-[#25a65a]"
                  style={{ width: `${cardProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {cards.map((card, index) => (
                <button
                  key={card.title}
                  type="button"
                  aria-label={`Go to card ${index + 1}`}
                  onClick={() => setActiveCardIndex(index)}
                  className={cn(
                    "h-2 flex-1 rounded-full transition",
                    index <= activeCardIndex ? "bg-[#ffc533]" : "bg-[#e7e3ef]"
                  )}
                />
              ))}
            </div>

            {isComplete && (
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#e8f8ef] px-4 py-3 text-sm font-semibold text-[#118347]">
                <CheckCircle2 className="size-5" />
                Lesson completed. Your progress was saved on this device.
              </div>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
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
                  "h-12 rounded-lg text-base font-semibold",
                  isComplete
                    ? "bg-[#4720d5] text-white hover:bg-[#3513b3]"
                    : "bg-[#ffc533] text-[#1d1238] hover:bg-[#f4b51a]"
                )}
              >
                {isComplete ? (
                  <Link href={`/courses/${course.id}`}>
                    Back to Course
                    <ArrowRight className="size-5" />
                  </Link>
                ) : !isLastCard ? (
                  <>
                    Next Card
                    <ArrowRight className="size-5" />
                  </>
                ) : (
                  <>
                    Finish Lesson
                    <ArrowRight className="size-5" />
                  </>
                )}
              </Button>
              <div className="flex h-12 items-center justify-center gap-2 rounded-lg border border-[#eee8f7] px-4 text-sm font-semibold text-[#5f3b00]">
                <CheckCircle2 className="size-5 text-[#25a65a]" />
                +{lesson.xp} XP
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
