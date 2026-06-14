"use client";

import { LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalAuth } from "./use-local-auth";

export function AuthGate({ children }: { children: ReactNode }) {
  const { currentUser, isLoading } = useLocalAuth();

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f6fb] px-5 py-10 text-[#100d24]">
        <div className="text-sm font-semibold text-[#625b75]">
          Loading your account...
        </div>
      </main>
    );
  }

  if (currentUser) {
    return children;
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f6fb] px-5 py-10 text-[#100d24]">
      <Card className="w-full max-w-md rounded-xl border-white bg-white py-0 shadow-xl shadow-[#24133f]/10">
        <CardContent className="px-6 py-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-[#30108f] text-[#ffc533] shadow-lg shadow-[#30108f]/20">
            <Sparkles className="size-7" />
          </div>
          <div className="mt-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-lg bg-[#eee8ff] px-3 py-1 text-sm font-semibold text-[#30108f]">
              <LockKeyhole className="size-4" />
              Members only
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal">
            Sign in to keep learning
          </h1>
          <p className="mt-3 text-base leading-7 text-[#625b75]">
            Create an account or sign in to access your courses, lessons, and
            saved progress.
          </p>
          <Button
            asChild
            className="mt-7 h-12 w-full rounded-lg bg-[#4720d5] text-white hover:bg-[#3513b3]"
          >
            <Link href="/login">Sign in or register</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
