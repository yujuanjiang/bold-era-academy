import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Database,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy | Bold Era Academy",
  description:
    "Privacy Policy for Bold Era Academy, including account information, lesson progress, and support contact details.",
};

const sections = [
  {
    icon: UserRound,
    title: "Information we collect",
    body: [
      "When you create an account or sign in, we collect the email address and name you provide.",
      "When you use the app, we store lesson progress so you can continue learning from where you left off.",
      "If you contact support, we may receive your email address and any details you choose to include in your message.",
    ],
  },
  {
    icon: Database,
    title: "How we use information",
    body: [
      "We use your information to provide account access, save course progress, support password reset, and respond to support requests.",
      "We do not sell your personal information.",
      "We do not use your account information for third-party advertising.",
    ],
  },
  {
    icon: LockKeyhole,
    title: "Data storage and security",
    body: [
      "BoldEra Academy uses Supabase to provide authentication and store app data such as profile details and lesson progress.",
      "We use reasonable technical safeguards to protect your information, but no online service can guarantee absolute security.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Your choices",
    body: [
      "You can reset your password from the sign-in screen.",
      "You may contact us to request help with your account or ask questions about your data.",
      "If you want account data deleted, email us from the address associated with your account.",
    ],
  },
];

export default function PrivacyPage() {
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
            <p className="text-center text-[1.05rem] font-semibold">Privacy</p>
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
              Privacy Policy
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#636366]">
              This policy explains what information BoldEra Academy collects,
              how we use it, and how to contact us.
            </p>
            <p className="mt-3 text-sm font-semibold text-[#636366]">
              Effective date: July 24, 2026
            </p>
          </div>

          <div className="mt-8 grid gap-5">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <Card
                  className="rounded-lg border-0 bg-white py-0 shadow-sm ring-1 ring-black/6"
                  key={section.title}
                >
                  <CardContent className="px-4 py-5">
                    <div className="grid gap-4 sm:grid-cols-[3rem_1fr]">
                      <div className="grid size-12 place-items-center rounded-lg bg-[#f2f2f7] text-[#0a66d1]">
                        <Icon className="size-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold tracking-normal">
                          {section.title}
                        </h2>
                        <div className="mt-3 grid gap-3 text-sm leading-6 text-[#636366]">
                          {section.body.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-5 rounded-lg border-0 bg-white py-0 shadow-sm ring-1 ring-black/6">
            <CardContent className="px-4 py-5">
              <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <h2 className="text-2xl font-semibold tracking-normal">
                    Contact us
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#636366]">
                    For privacy questions, support, or account data requests,
                    email us at bolderamedia@gmail.com.
                  </p>
                </div>
                <Button
                  asChild
                  className="h-12 rounded-lg bg-[#0a84ff] px-5 text-base font-semibold text-white hover:bg-[#006edb]"
                >
                  <a href="mailto:bolderamedia@gmail.com?subject=BoldEra%20Academy%20Privacy">
                    Email us
                    <Mail className="size-5" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs leading-5 text-[#8e8e93]">
            BoldEra Academy may update this Privacy Policy from time to time.
            Any updates will be posted on this page.
          </p>
        </section>
      </div>
    </main>
  );
}
