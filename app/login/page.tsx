"use client";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Mail,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { ReactNode } from "react";

import { useAcademyProgress } from "@/components/academy/use-academy-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalAuth } from "@/components/auth/use-local-auth";
import { courses } from "@/lib/academy-data";
import { cn } from "@/lib/utils";

type AuthMode = "signin" | "register" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, register, resetPassword, signIn } = useLocalAuth();
  const { completedCount, isCourseEnrolled } = useAcademyProgress();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const enrolledCourses = currentUser
    ? courses.filter((course) => isCourseEnrolled(course.id))
    : [];
  const totalLessons = enrolledCourses.reduce(
    (lessonCount, course) => lessonCount + course.lessons.length,
    0
  );
  const completedLessons = currentUser
    ? enrolledCourses.reduce((count, course) => count + completedCount(course), 0)
    : 0;
  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const completedCourses = currentUser
    ? enrolledCourses.filter(
        (course) => completedCount(course) === course.lessons.length
      )
        .length
    : 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    if (mode === "forgot") {
      const result = await resetPassword(email);

      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        setIsSubmitting(false);
        return;
      }

      setMessage(
        "If an account exists for this email, a password reset link has been sent."
      );
      setIsSubmitting(false);
      return;
    }

    const result =
      mode === "register"
        ? await register({ name, email, password })
        : await signIn({ email, password });

    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      setIsSubmitting(false);
      return;
    }

    router.push("/");
  }

  return (
    <main className="min-h-dvh bg-[#f5f5f7] pb-[var(--app-safe-bottom)] pt-[var(--app-safe-top)] text-[#1c1c1e]">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4">
        <header className="sticky top-0 z-30 -mx-4 border-b border-black/6 bg-[#f5f5f7]/86 px-4 py-3 backdrop-blur-xl">
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
            <p className="text-center text-[1.05rem] font-semibold">Profile</p>
          </div>
        </header>

        <section
          className={cn(
            "grid flex-1 gap-5 py-6",
            currentUser ? "content-start" : "content-center"
          )}
        >
          <div className="text-center">
            <div
              aria-hidden="true"
              className="mx-auto size-14 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: "url('/icon.png')" }}
            />
            <h1 className="mt-4 text-3xl font-semibold tracking-normal">
              Bold Era Academy
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#636366]">
              Save lessons, resume courses, and keep your AI learning progress.
            </p>
          </div>

          <Card className="rounded-lg border-0 bg-white py-0 shadow-sm ring-1 ring-black/6">
            <CardContent className="px-4 py-4">
              {currentUser ? (
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#0a84ff] text-base font-semibold text-white">
                      {getInitials(currentUser.name)}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-xl font-semibold tracking-normal">
                        {currentUser.name}
                      </h2>
                      <p className="truncate text-sm text-[#636366]">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-lg bg-[#f2f2f7] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#636366]">
                          Learning progress
                        </p>
                        <p className="mt-1 text-3xl font-semibold tracking-normal">
                          {completedLessons}
                          <span className="text-base text-[#8e8e93]">
                            /{totalLessons}
                          </span>
                        </p>
                      </div>
                      <div className="flex size-14 items-center justify-center rounded-lg bg-[#e7f8ed] text-[#15803d]">
                        <Sparkles className="size-7" />
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6e6e73]">
                        <span>{overallProgress}% complete</span>
                        <span>
                          {enrolledCourses.length} courses enrolled
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#d1d1d6]">
                        <div
                          className="h-full rounded-full bg-[#34c759]"
                          style={{ width: `${overallProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <ProfileStat
                      icon={<CheckCircle2 className="size-5" />}
                      label="Lessons done"
                      value={completedLessons}
                    />
                    <ProfileStat
                      icon={<BookOpen className="size-5" />}
                      label="Courses"
                      value={`${completedCourses}/${enrolledCourses.length}`}
                    />
                  </div>

                  <div className="mt-5">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#3a3a3c]">
                      <BarChart3 className="size-4 text-[#0a66d1]" />
                      Course progress
                    </div>
                    <div className="grid gap-3">
                      {enrolledCourses.length === 0 && (
                        <div className="rounded-lg border border-[#e5e5ea] bg-[#f8f8fb] px-3 py-4 text-sm leading-6 text-[#636366]">
                          Enrol in a course to start tracking your learning
                          progress here.
                        </div>
                      )}
                      {enrolledCourses.map((course) => {
                        const completed = completedCount(course);
                        const progress = Math.round(
                          (completed / course.lessons.length) * 100
                        );

                        return (
                          <Link
                            key={course.id}
                            href={`/courses/${course.id}`}
                            className="rounded-lg border border-[#e5e5ea] px-3 py-3 transition active:bg-[#f2f2f7]"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                  {course.title}
                                </p>
                                <p className="mt-1 text-xs font-medium text-[#6e6e73]">
                                  {completed} of {course.lessons.length} lessons
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-[#0a66d1]">
                                {progress}%
                              </span>
                            </div>
                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e5e5ea]">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  course.tone === "gold"
                                    ? "bg-[#ff9f0a]"
                                    : "bg-[#34c759]"
                                )}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    asChild
                    className="mt-5 h-12 w-full rounded-lg bg-[#0a84ff] text-base font-semibold text-white hover:bg-[#006edb]"
                  >
                    <Link href="/">
                      Go to Today
                      <ArrowRight className="size-5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 rounded-lg bg-[#f2f2f7] p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setError("");
                        setMessage("");
                      }}
                      className={cn(
                        "h-10 rounded-md text-sm font-semibold transition",
                        mode !== "register"
                          ? "bg-white text-[#1c1c1e] shadow-sm"
                          : "text-[#636366]"
                      )}
                    >
                      Sign in
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setError("");
                        setMessage("");
                      }}
                      className={cn(
                        "h-10 rounded-md text-sm font-semibold transition",
                        mode === "register"
                          ? "bg-white text-[#1c1c1e] shadow-sm"
                          : "text-[#636366]"
                      )}
                    >
                      Register
                    </button>
                  </div>

                  <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                    {mode === "forgot" && (
                      <div className="rounded-lg bg-[#f2f2f7] px-4 py-3">
                        <p className="text-sm leading-6 text-[#3a3a3c]">
                          Enter your account email and we&apos;ll send a secure
                          link to reset your password.
                        </p>
                      </div>
                    )}

                    {mode === "register" && (
                      <label className="block">
                        <span className="text-sm font-semibold text-[#3a3a3c]">
                          Name
                        </span>
                        <input
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          className="mt-2 h-12 w-full rounded-lg border border-[#d1d1d6] bg-white px-4 text-base outline-none transition focus:border-[#0a84ff] focus:ring-4 focus:ring-[#0a84ff]/14"
                          placeholder="Your name"
                        />
                      </label>
                    )}

                    <label className="block">
                      <span className="text-sm font-semibold text-[#3a3a3c]">
                        Email
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-2 h-12 w-full rounded-lg border border-[#d1d1d6] bg-white px-4 text-base outline-none transition focus:border-[#0a84ff] focus:ring-4 focus:ring-[#0a84ff]/14"
                        placeholder="you@example.com"
                      />
                    </label>

                    {mode !== "forgot" && (
                      <label className="block">
                        <span className="text-sm font-semibold text-[#3a3a3c]">
                          Password
                        </span>
                        <input
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          className="mt-2 h-12 w-full rounded-lg border border-[#d1d1d6] bg-white px-4 text-base outline-none transition focus:border-[#0a84ff] focus:ring-4 focus:ring-[#0a84ff]/14"
                          placeholder="At least 6 characters"
                        />
                      </label>
                    )}

                    {error && (
                      <p className="rounded-lg bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#b42318]">
                        {error}
                      </p>
                    )}

                    {message && (
                      <p className="rounded-lg bg-[#edf8f2] px-4 py-3 text-sm font-semibold text-[#137333]">
                        {message}
                      </p>
                    )}

                    <Button
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-lg bg-[#0a84ff] text-base font-semibold text-white hover:bg-[#006edb]"
                    >
                      {isSubmitting
                        ? "Please wait..."
                        : mode === "register"
                          ? "Create account"
                          : mode === "forgot"
                            ? "Send reset link"
                          : "Sign in"}
                      {mode === "forgot" ? (
                        <Mail className="size-5" />
                      ) : (
                        <ArrowRight className="size-5" />
                      )}
                    </Button>

                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setError("");
                          setMessage("");
                        }}
                        className="w-full text-center text-sm font-semibold text-[#0a66d1]"
                      >
                        Forgot password?
                      </button>
                    )}

                    {mode === "forgot" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signin");
                          setError("");
                          setMessage("");
                        }}
                        className="w-full text-center text-sm font-semibold text-[#0a66d1]"
                      >
                        Back to sign in
                      </button>
                    )}
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProfileStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-lg border border-[#e5e5ea] px-3 py-3">
      <div className="flex items-center gap-2 text-[#0a66d1]">{icon}</div>
      <p className="mt-3 text-xl font-semibold tracking-normal">{value}</p>
      <p className="mt-1 text-xs font-semibold text-[#6e6e73]">{label}</p>
    </div>
  );
}
