"use client";

import { usePathname } from "next/navigation";
import { COMPANION_EXPERIENCE_ROUTE } from "@/lib/app/companion";
import { useCompanionExperience } from "./CompanionExperienceProvider";
import { CompanionIcon } from "./CompanionIcon";

export function CompanionFloatingButton() {
  const pathname = usePathname();
  const { toggleDrawer, labels } = useCompanionExperience();

  if (pathname === COMPANION_EXPERIENCE_ROUTE) return null;

  return (
    <button
      type="button"
      onClick={toggleDrawer}
      title={labels.askAipify}
      aria-label={labels.ariaFloatingButton}
      className="group fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-violet-200/80 transition hover:ring-aipify-companion focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-companion focus-visible:ring-offset-2 sm:bottom-6 sm:right-6 lg:bottom-8"
      data-companion-floating
    >
      <CompanionIcon size={44} withRing />
      <span className="pointer-events-none absolute -top-10 right-0 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
        {labels.askAipify}
      </span>
    </button>
  );
}
