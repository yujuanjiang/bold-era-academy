"use client";

import { BookOpen, Home, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Today", icon: Home },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/login", label: "Profile", icon: UserCircle },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/8 bg-white/92 px-4 pb-[calc(var(--app-safe-bottom)+0.45rem)] pt-2 shadow-[0_-12px_30px_rgba(24,24,27,0.08)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-xs font-semibold transition active:scale-[0.98]",
                isActive
                  ? "bg-[#e8f2ff] text-[#0a66d1]"
                  : "text-[#73737d] hover:bg-[#f3f4f6] hover:text-[#24242a]"
              )}
            >
              <Icon className="size-5" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
