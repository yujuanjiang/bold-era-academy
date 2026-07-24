import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Support | Bold Era Academy",
  description:
    "Get help with Bold Era Academy, account access, lessons, progress, and app support.",
};

const supportTopics = [
  {
    icon: BookOpen,
    title: "Lessons and courses",
    description:
      "Questions about AI lessons, course progress, or where to start.",
  },
  {
    icon: CheckCircle2,
    title: "Progress tracking",
    description:
      "Help with saved progress, completed lessons, or returning to a course.",
  },
  {
    icon: ShieldCheck,
    title: "Account access",
    description:
      "Support for signing in, creating an account, or resetting your password.",
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-dvh bg-[#f5f5f7] pb-10 pt-[var(--app-safe-top)] text-[#1c1c1e]">
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4">
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
            <p className="text-center text-[1.05rem] font-semibold">Support</p>
          </div>
        </header>

        <section className="py-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-lg bg-[#30108f] text-[#ffd60a] shadow-sm">
              <Sparkles className="size-8" />
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#0a66d1]">
              BoldEra Academy
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
              How can we help?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#636366]">
              Need help with your account, lessons, or saved progress? Send a
              message and we&apos;ll help you get back to learning AI.
            </p>
          </div>

          <Card className="mt-8 rounded-lg border-0 bg-white py-0 shadow-sm ring-1 ring-black/6">
            <CardContent className="grid gap-4 px-4 py-4 sm:grid-cols-3">
              {supportTopics.map((topic) => {
                const Icon = topic.icon;

                return (
                  <div
                    className="rounded-lg bg-[#f5f5f7] p-4"
                    key={topic.title}
                  >
                    <div className="grid size-11 place-items-center rounded-lg bg-white text-[#0a66d1] shadow-sm ring-1 ring-black/6">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold">
                      {topic.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#636366]">
                      {topic.description}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="mt-5 rounded-lg border-0 bg-white py-0 shadow-sm ring-1 ring-black/6">
            <CardContent className="px-4 py-5">
              <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <h2 className="text-2xl font-semibold tracking-normal">
                    Contact support
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#636366]">
                    Email us with the issue, your device type, and the email
                    address you use for the app.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-[#3a3a3c]">
                    bolderamedia@gmail.com
                  </p>
                </div>
                <Button
                  asChild
                  className="h-12 rounded-lg bg-[#0a84ff] px-5 text-base font-semibold text-white hover:bg-[#006edb]"
                >
                  <a href="mailto:bolderamedia@gmail.com?subject=BoldEra%20Academy%20Support">
                    Email support
                    <Mail className="size-5" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-5 rounded-lg border-0 bg-white py-0 shadow-sm ring-1 ring-black/6">
            <CardContent className="px-4 py-5">
              <h2 className="text-2xl font-semibold tracking-normal">
                Helpful notes
              </h2>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-[#636366]">
                <p>
                  If you forgot your password, open the sign-in screen and tap
                  <span className="font-semibold text-[#3a3a3c]">
                    {" "}
                    Forgot password?
                  </span>
                </p>
                <p>
                  Lesson progress is saved to your account when you are signed
                  in.
                </p>
                <p>
                  BoldEra Academy is designed for learning support and does not
                  replace professional, legal, financial, or medical advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
