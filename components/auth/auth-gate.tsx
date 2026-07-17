"use client";

import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalAuth } from "./use-local-auth";

export function AuthGate({ children }: { children: ReactNode }) {
  const { currentUser, isLoading } = useLocalAuth();

  if (isLoading) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#f5f5f7] px-5 py-10 text-[#1c1c1e]">
        <div className="text-sm font-semibold text-[#6e6e73]">
          Loading your account...
        </div>
      </main>
    );
  }

  if (currentUser) {
    return children;
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-[#f5f5f7] px-4 py-10 text-[#1c1c1e]">
      <Card className="w-full max-w-md rounded-lg border-0 bg-white py-0 shadow-sm ring-1 ring-black/6">
        <CardContent className="px-6 py-8 text-center">
          <div
            aria-hidden="true"
            className="mx-auto size-14 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: "url('/icon.png')" }}
          />
          <div className="mt-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-lg bg-[#e8f2ff] px-3 py-1 text-sm font-semibold text-[#0a66d1]">
              <LockKeyhole className="size-4" />
              Members only
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal">
            Sign in to keep learning
          </h1>
          <p className="mt-3 text-base leading-7 text-[#636366]">
            Create an account or sign in to access your courses, lessons, and
            saved progress.
          </p>
          <Button
            asChild
            className="mt-7 h-12 w-full rounded-lg bg-[#0a84ff] text-white hover:bg-[#006edb]"
          >
            <Link href="/login">Sign in or register</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
