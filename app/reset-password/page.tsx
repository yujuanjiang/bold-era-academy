"use client";

import { ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { useLocalAuth } from "@/components/auth/use-local-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useLocalAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;
    let isMounted = true;

    client.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setHasSession(Boolean(data.session));
      }
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (isMounted && (event === "PASSWORD_RECOVERY" || session)) {
        setHasSession(Boolean(session));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const result = await updatePassword(password);

    if (!result.ok) {
      setError(
        result.error ??
          "This reset link may have expired. Please request a new link."
      );
      setIsSubmitting(false);
      return;
    }

    setMessage("Your password has been updated.");
    setIsSubmitting(false);
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
              <Link href="/login" aria-label="Back to Sign in">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <p className="text-center text-[1.05rem] font-semibold">
              Reset Password
            </p>
          </div>
        </header>

        <section className="grid flex-1 content-center gap-5 py-6">
          <div className="text-center">
            <div
              aria-hidden="true"
              className="mx-auto grid size-14 place-items-center rounded-lg bg-[#30108f] text-[#ffd60a]"
            >
              <KeyRound className="size-7" />
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal">
              Create a new password
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#636366]">
              Choose a new password for your Bold Era Academy account.
            </p>
          </div>

          <Card className="rounded-lg border-0 bg-white py-0 shadow-sm ring-1 ring-black/6">
            <CardContent className="px-4 py-4">
              {!hasSession && !message && (
                <p className="mb-4 rounded-lg bg-[#fff7e6] px-4 py-3 text-sm font-semibold text-[#8a5a00]">
                  Open this page from the password reset email link.
                </p>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-sm font-semibold text-[#3a3a3c]">
                    New password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-2 h-12 w-full rounded-lg border border-[#d1d1d6] bg-white px-4 text-base outline-none transition focus:border-[#0a84ff] focus:ring-4 focus:ring-[#0a84ff]/14"
                    placeholder="At least 6 characters"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-[#3a3a3c]">
                    Confirm password
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    className="mt-2 h-12 w-full rounded-lg border border-[#d1d1d6] bg-white px-4 text-base outline-none transition focus:border-[#0a84ff] focus:ring-4 focus:ring-[#0a84ff]/14"
                    placeholder="Re-enter password"
                  />
                </label>

                {error && (
                  <p className="rounded-lg bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#b42318]">
                    {error}
                  </p>
                )}

                {message && (
                  <p className="flex items-center gap-2 rounded-lg bg-[#edf8f2] px-4 py-3 text-sm font-semibold text-[#137333]">
                    <CheckCircle2 className="size-5 shrink-0" />
                    {message}
                  </p>
                )}

                <Button
                  disabled={isSubmitting || Boolean(message)}
                  className="h-12 w-full rounded-lg bg-[#0a84ff] text-base font-semibold text-white hover:bg-[#006edb]"
                >
                  {isSubmitting ? "Please wait..." : "Update password"}
                  <KeyRound className="size-5" />
                </Button>

                {message && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/")}
                    className="h-12 w-full rounded-lg text-base font-semibold"
                  >
                    Continue
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
