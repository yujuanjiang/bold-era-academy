"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLocalAuth } from "@/components/auth/use-local-auth";

type AuthMode = "signin" | "register";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, register, signIn } = useLocalAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

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
    <main className="grid min-h-screen bg-[#f7f6fb] px-5 py-8 text-[#100d24] lg:grid-cols-[0.9fr_1.1fr]">
      <section className="mx-auto flex w-full max-w-xl flex-col justify-center py-8">
        <Link
          href="/"
          className="mb-8 flex w-fit items-center gap-3 rounded-xl text-[#100d24]"
        >
          <span className="flex size-11 items-center justify-center rounded-lg bg-[#30108f] text-[#ffc533] shadow-lg shadow-[#30108f]/20">
            <Sparkles className="size-5" />
          </span>
          <span>
            <span className="block text-lg font-semibold">Bold Era Academy</span>
            <span className="block text-xs text-[#676174]">
              AI skills, one card a day
            </span>
          </span>
        </Link>

        <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
          Learn practical AI with a guided path.
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#625b75]">
          Register to save your lesson progress, continue courses, and build AI
          skills through bite-size learning cards.
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-md items-center">
        <Card className="w-full rounded-xl border-white bg-white py-0 shadow-xl shadow-[#24133f]/10">
          <CardContent className="px-6 py-7">
            {currentUser ? (
              <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-normal">
                  You are signed in
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#625b75]">
                  Continue to your dashboard as {currentUser.name}.
                </p>
                <Button
                  asChild
                  className="mt-6 h-12 w-full rounded-lg bg-[#4720d5] text-white hover:bg-[#3513b3]"
                >
                  <Link href="/">
                    Go to dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 rounded-lg bg-[#f4f1ff] p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError("");
                    }}
                    className={cn(
                      "h-10 rounded-md text-sm font-semibold transition",
                      mode === "signin"
                        ? "bg-white text-[#30108f] shadow-sm"
                        : "text-[#625b75]"
                    )}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                    className={cn(
                      "h-10 rounded-md text-sm font-semibold transition",
                      mode === "register"
                        ? "bg-white text-[#30108f] shadow-sm"
                        : "text-[#625b75]"
                    )}
                  >
                    Register
                  </button>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  {mode === "register" && (
                    <label className="block">
                      <span className="text-sm font-semibold text-[#3e3850]">
                        Name
                      </span>
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="mt-2 h-12 w-full rounded-lg border border-[#e3deef] bg-white px-4 text-base outline-none transition focus:border-[#4720d5] focus:ring-4 focus:ring-[#4720d5]/10"
                        placeholder="Your name"
                      />
                    </label>
                  )}

                  <label className="block">
                    <span className="text-sm font-semibold text-[#3e3850]">
                      Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="mt-2 h-12 w-full rounded-lg border border-[#e3deef] bg-white px-4 text-base outline-none transition focus:border-[#4720d5] focus:ring-4 focus:ring-[#4720d5]/10"
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-[#3e3850]">
                      Password
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="mt-2 h-12 w-full rounded-lg border border-[#e3deef] bg-white px-4 text-base outline-none transition focus:border-[#4720d5] focus:ring-4 focus:ring-[#4720d5]/10"
                      placeholder="At least 6 characters"
                    />
                  </label>

                  {error && (
                    <p className="rounded-lg bg-[#fff1f1] px-4 py-3 text-sm font-medium text-[#a32323]">
                      {error}
                    </p>
                  )}

                  <Button
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-lg bg-[#4720d5] text-base font-semibold text-white hover:bg-[#3513b3]"
                  >
                    {isSubmitting
                      ? "Please wait..."
                      : mode === "register"
                        ? "Create account"
                        : "Sign in"}
                    <ArrowRight className="size-4" />
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
