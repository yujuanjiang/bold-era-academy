"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalAuth } from "@/components/auth/use-local-auth";
import { cn } from "@/lib/utils";

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

        <section className="grid flex-1 content-center gap-5 py-6">
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
                <div className="text-center">
                  <h2 className="text-xl font-semibold tracking-normal">
                    You are signed in
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#636366]">
                    Continue as {currentUser.name}.
                  </p>
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
                      }}
                      className={cn(
                        "h-10 rounded-md text-sm font-semibold transition",
                        mode === "signin"
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

                    {error && (
                      <p className="rounded-lg bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#b42318]">
                        {error}
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
                          : "Sign in"}
                      <ArrowRight className="size-5" />
                    </Button>
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
