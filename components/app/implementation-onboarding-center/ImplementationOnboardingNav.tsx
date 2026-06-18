"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IMPLEMENTATION_ONBOARDING_SECTIONS,
  type ImplementationOnboardingSection,
} from "@/lib/implementation-onboarding-center";
import type { ImplementationOnboardingCenterLabels } from "@/lib/implementation-onboarding-center/labels";

type Props = {
  labels: ImplementationOnboardingCenterLabels["sections"];
};

function sectionFromPath(pathname: string): ImplementationOnboardingSection {
  if (pathname === "/app/onboarding" || pathname === "/app/onboarding/") return "welcome";
  const match = IMPLEMENTATION_ONBOARDING_SECTIONS.find(
    (s) => s.key !== "welcome" && pathname.startsWith(s.href)
  );
  return match?.key ?? "welcome";
}

export function ImplementationOnboardingNav({ labels }: Props) {
  const pathname = usePathname();
  const active = sectionFromPath(pathname);

  return (
    <nav
      aria-label="Implementation & Onboarding"
      className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4"
    >
      {IMPLEMENTATION_ONBOARDING_SECTIONS.map((item) => {
        const isActive = active === item.key;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-teal-700 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {labels[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}
