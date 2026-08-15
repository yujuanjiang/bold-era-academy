"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Star,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getLessonCards, type Course, type Lesson } from "@/lib/academy-data";
import { cn } from "@/lib/utils";
import { useAcademyProgress } from "./use-academy-progress";
import { useRemoteCourses } from "./use-remote-courses";

type LessonStep =
  | {
      id: string;
      type: "learn";
      cardIndex: number;
      title: string;
      body: string;
      takeaway: string;
    }
  | {
      id: string;
      type: "quiz-intro";
      cardIndex: number;
      title: string;
    }
  | {
      id: string;
      type: "review" | "chapter-quiz";
      cardIndex: number;
      title: string;
      prompt: string;
      correctAnswer: string;
      options: string[];
    };

const fallbackDistractors = [
  "AI is always correct without review.",
  "Long prompts always work better than clear prompts.",
  "AI should replace human judgment completely.",
  "Sensitive information is safe to share with any AI tool.",
];
const chapterQuizCardLimit = 8;

function seededHash(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 2147483647;
  }

  return hash || 1;
}

function seededShuffle<T>(items: T[], seed: string) {
  const shuffled = [...items];
  let state = seededHash(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (state * 48271) % 2147483647;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function makeReviewOptions(
  correctAnswer: string,
  allAnswers: string[],
  seed: string
) {
  const distractors = allAnswers
    .filter((answer) => answer !== correctAnswer)
    .concat(fallbackDistractors)
    .filter((answer, index, answers) => answers.indexOf(answer) === index)
    .slice(0, 3);

  return seededShuffle([correctAnswer, ...distractors], seed);
}

function buildLessonSteps(
  courseId: string,
  lessonId: string,
  cards: ReturnType<typeof getLessonCards>
): LessonStep[] {
  const takeaways = cards.map((card) => card.takeaway);
  const learningSteps = cards.flatMap((card, index): LessonStep[] => {
    const reviewSeed = `${courseId}:${lessonId}:review:${index}`;

    return [
      {
        id: `learn-${index}`,
        type: "learn",
        cardIndex: index,
        title: card.title,
        body: card.body,
        takeaway: card.takeaway,
      },
      {
        id: `review-${index}`,
        type: "review",
        cardIndex: index,
        title: "Quick review",
        prompt: `Which key idea matches "${card.title}"?`,
        correctAnswer: card.takeaway,
        options: makeReviewOptions(card.takeaway, takeaways, reviewSeed),
      },
    ];
  });

  const shuffledQuizCards = seededShuffle(
    cards.map((card, index) => ({
      card,
      index,
    })),
    `${courseId}:${lessonId}:chapter-quiz`
  )
    .slice(0, Math.min(cards.length, chapterQuizCardLimit));
  const quizSourceCards = Array.from(
    { length: chapterQuizCardLimit },
    (_, quizIndex) => shuffledQuizCards[quizIndex % shuffledQuizCards.length]
  );
  const quizIntroStep: LessonStep = {
    id: "chapter-quiz-intro",
    type: "quiz-intro",
    cardIndex: 0,
    title: "Chapter quiz",
  };
  const quizSteps = quizSourceCards.map(({ card, index }, quizIndex): LessonStep => {
    const quizSeed = `${courseId}:${lessonId}:chapter-quiz:${quizIndex}`;

    return {
      id: `chapter-quiz-${quizIndex}`,
      type: "chapter-quiz",
      cardIndex: index,
      title: "Chapter quiz",
      prompt: `What did we learn about "${card.title}"?`,
      correctAnswer: card.takeaway,
      options: makeReviewOptions(card.takeaway, takeaways, quizSeed),
    };
  });

  return [...learningSteps, quizIntroStep, ...quizSteps];
}

export function LessonCard({
  course,
  lesson,
}: {
  course: Course;
  lesson: Lesson;
}) {
  const courses = useRemoteCourses([course]);
  const activeCourse =
    courses.find((courseItem) => courseItem.id === course.id) ?? course;
  const activeLesson =
    activeCourse.lessons.find((lessonItem) => lessonItem.id === lesson.id) ??
    lesson;
  const { completeLesson, isLessonComplete } = useAcademyProgress();
  const searchParams = useSearchParams();
  const isRetake = searchParams.get("retake") === "1";
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [retakeFinished, setRetakeFinished] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(
    {}
  );
  const cards = getLessonCards(activeLesson);
  const steps = useMemo(
    () => buildLessonSteps(activeCourse.id, activeLesson.id, cards),
    [activeCourse.id, activeLesson.id, cards]
  );
  const activeStep = steps[activeStepIndex];
  const selectedAnswer =
    activeStep.type === "review" || activeStep.type === "chapter-quiz"
      ? selectedAnswers[activeStep.id]
      : undefined;
  const answeredCorrectly =
    (activeStep.type === "review" || activeStep.type === "chapter-quiz") &&
    selectedAnswer === activeStep.correctAnswer;
  const lessonIndex = activeCourse.lessons.findIndex(
    (item) => item.id === activeLesson.id
  );
  const availableLessons = activeCourse.lessons.length;
  const savedComplete = isLessonComplete(activeCourse.id, activeLesson);
  const isComplete = isRetake ? retakeFinished : savedComplete;
  const isLastStep = activeStepIndex === steps.length - 1;
  const canContinue =
    activeStep.type === "learn" ||
    activeStep.type === "quiz-intro" ||
    Boolean(selectedAnswer);
  const cardProgress = Math.round(((activeStepIndex + 1) / steps.length) * 100);
  const reviewCardNumber = activeStep.cardIndex + 1;
  const reviewCount = steps.filter(
    (step) => step.type === "review" || step.type === "chapter-quiz"
  ).length;
  const correctReviewCount = steps.filter(
    (step) =>
      (step.type === "review" || step.type === "chapter-quiz") &&
      selectedAnswers[step.id] === step.correctAnswer
  ).length;

  return (
    <main className="min-h-dvh bg-[#101012] pb-[calc(6.5rem+var(--app-safe-bottom))] pt-[var(--app-safe-top)] text-white">
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 sm:px-6">
        <header className="sticky top-0 z-30 -mx-4 border-b border-white/10 bg-[#101012]/88 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
          <div className="grid min-h-11 grid-cols-[2.75rem_1fr_2.75rem] items-center">
            <Button
              asChild
              variant="ghost"
              size="icon-lg"
              className="rounded-lg text-white hover:bg-white/10"
            >
              <Link
                href={`/courses/${activeCourse.id}`}
                aria-label="Back to course"
              >
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <div className="min-w-0 text-center">
              <p className="truncate text-[1.05rem] font-semibold">
                {activeLesson.title}
              </p>
              <p className="text-xs font-medium text-white/55">
                Lesson {lessonIndex + 1} of {availableLessons}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                aria-label={`Go to step ${index + 1}`}
                onClick={() => setActiveStepIndex(index)}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition",
                  index <= activeStepIndex ? "bg-[#0a84ff]" : "bg-white/18"
                )}
              />
            ))}
          </div>
        </header>

        <section className="grid flex-1 content-center gap-5 py-5">
          <div>
            <div className="flex items-center justify-between gap-3 text-sm font-semibold text-white/60">
              <span>{activeCourse.title}</span>
              <span>{cardProgress}%</span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">
              {activeStep.title}
            </h1>
            {activeStep.type !== "learn" && (
              <p className="mt-2 text-sm font-medium text-white/55">
                {activeStep.type === "review"
                  ? `Review card ${reviewCardNumber}`
                  : activeStep.type === "chapter-quiz"
                    ? `Final quiz: ${correctReviewCount} of ${reviewCount} correct`
                    : "Get ready for the final review"}
              </p>
            )}
          </div>

          <article className="rounded-lg bg-white px-5 py-6 text-[#1c1c1e] shadow-2xl shadow-black/25 sm:px-7 sm:py-7">
            <div className="flex items-center justify-between gap-3">
              <span
                className={cn(
                  "flex size-11 items-center justify-center rounded-lg",
                  activeStep.type === "learn"
                    ? "bg-[#fff4d7] text-[#ff9f0a]"
                    : activeStep.type === "quiz-intro"
                      ? "bg-[#fff4d7] text-[#b77900]"
                    : "bg-[#e8f2ff] text-[#0a84ff]"
                )}
              >
                {activeStep.type === "learn" ? (
                  <Lightbulb className="size-6" />
                ) : activeStep.type === "quiz-intro" ? (
                  <Star className="size-6 fill-[#ffd60a]" />
                ) : (
                  <HelpCircle className="size-6" />
                )}
              </span>
              <span className="text-sm font-semibold text-[#6e6e73]">
                Step {activeStepIndex + 1} of {steps.length}
              </span>
            </div>

            {activeStep.type === "learn" ? (
              <>
                <p className="mt-6 text-[1.05rem] leading-8 text-[#2c2c2e]">
                  {activeStep.body}
                </p>

                <div className="mt-6 rounded-lg bg-[#f2f2f7] p-4">
                  <div className="flex items-center gap-2 font-semibold text-[#1c1c1e]">
                    <Star className="size-5 fill-[#ffd60a] text-[#b77900]" />
                    Key idea
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#3a3a3c]">
                    {activeStep.takeaway}
                  </p>
                </div>
              </>
            ) : activeStep.type === "quiz-intro" ? (
              <div className="grid justify-items-center py-8 text-center">
                <div className="relative flex size-32 items-center justify-center">
                  <span className="absolute size-24 animate-[quiz-ping_1.8s_ease-out_infinite] rounded-full bg-[#fff4d7]" />
                  <span className="absolute size-32 animate-[quiz-spin_9s_linear_infinite] rounded-full border border-dashed border-[#ffd60a]" />
                  <span className="absolute left-3 top-8 animate-[quiz-pop_1.4s_ease-in-out_infinite] text-[#ffd60a]">
                    <Star className="size-7 fill-current" />
                  </span>
                  <span className="absolute bottom-6 right-2 animate-[quiz-pop_1.4s_ease-in-out_0.25s_infinite] text-[#ffd60a]">
                    <Star className="size-5 fill-current" />
                  </span>
                  <span className="absolute right-8 top-1 animate-[quiz-pop_1.4s_ease-in-out_0.45s_infinite] text-[#ffd60a]">
                    <Star className="size-4 fill-current" />
                  </span>
                  <span className="relative flex size-20 items-center justify-center rounded-2xl bg-[#3b168c] text-[#ffd60a] shadow-xl shadow-[#3b168c]/25">
                    <Star className="size-11 fill-current" />
                  </span>
                </div>
                <h2 className="mt-7 text-2xl font-semibold tracking-normal text-[#1c1c1e]">
                  Time for the chapter quiz
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[#636366]">
                  You learned the key ideas. Now review them in 8 quick
                  multiple-choice cards.
                </p>
                <div className="mt-6 rounded-lg bg-[#f2f2f7] px-4 py-3 text-sm font-semibold text-[#3a3a3c]">
                  No pressure. Wrong answers become review moments.
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-[1.05rem] font-semibold leading-7 text-[#1c1c1e]">
                  {activeStep.prompt}
                </p>
                <div className="mt-5 grid gap-3">
                  {activeStep.options.map((option) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === activeStep.correctAnswer;
                    const showResult = Boolean(selectedAnswer);

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={Boolean(selectedAnswer)}
                        onClick={() =>
                          setSelectedAnswers((answers) => ({
                            ...answers,
                            [activeStep.id]: option,
                          }))
                        }
                        className={cn(
                          "flex min-h-14 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition",
                          showResult && isCorrect
                            ? "border-[#34c759] bg-[#e7f8ed] text-[#15803d]"
                            : "border-[#d1d1d6] bg-white text-[#1c1c1e]",
                          showResult &&
                            isSelected &&
                            !isCorrect &&
                            "border-[#ff3b30] bg-[#fff1f0] text-[#b42318]",
                          !showResult && "hover:border-[#0a84ff] hover:bg-[#f2f8ff]"
                        )}
                      >
                        <span>{option}</span>
                        {showResult && isCorrect && (
                          <CheckCircle2 className="size-5 shrink-0" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="size-5 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer && (
                  <div
                    className={cn(
                      "mt-5 flex items-start gap-2 rounded-lg px-4 py-3 text-sm font-semibold",
                      answeredCorrectly
                        ? "bg-[#e7f8ed] text-[#15803d]"
                        : "bg-[#fff4d7] text-[#8a5a00]"
                    )}
                  >
                    {answeredCorrectly ? (
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                    ) : (
                      <Lightbulb className="mt-0.5 size-5 shrink-0" />
                    )}
                    <span>
                      {answeredCorrectly
                        ? "Correct. Nice, that idea stuck."
                        : `Good review moment. The answer is: ${activeStep.correctAnswer}`}
                    </span>
                  </div>
                )}
              </div>
            )}

            {isComplete && (
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#e7f8ed] px-4 py-3 text-sm font-semibold text-[#15803d]">
                <CheckCircle2 className="size-5" />
                Lesson complete. Progress saved.
              </div>
            )}
          </article>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#101012]/88 px-4 pb-[calc(var(--app-safe-bottom)+0.75rem)] pt-3 backdrop-blur-xl">
        <div className="mx-auto grid max-w-3xl grid-cols-[1fr_auto] gap-3">
          <Button
            asChild={isComplete}
            disabled={!canContinue}
            onClick={() => {
              if (!isComplete && !isLastStep && canContinue) {
                setActiveStepIndex((current) =>
                  Math.min(current + 1, steps.length - 1)
                );
              }

              if (!isComplete && isLastStep && canContinue) {
                completeLesson(activeCourse.id, activeLesson.id);

                if (isRetake) {
                  setRetakeFinished(true);
                }
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
              <Link href={`/courses/${activeCourse.id}`}>
                Back to Course
                <ArrowRight className="size-5" />
              </Link>
            ) : !isLastStep ? (
              <>
                {activeStep.type === "learn"
                  ? "Review"
                  : activeStep.type === "quiz-intro"
                    ? "Start Quiz"
                    : "Next"}
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
            +{activeLesson.xp}
          </div>
        </div>
      </div>
    </main>
  );
}
