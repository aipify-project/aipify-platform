"use client";

import { useCompanionExperience } from "./CompanionExperienceProvider";
import { CompanionIcon } from "./CompanionIcon";

export function CompanionTopBarButton() {
  const { openDrawer, labels } = useCompanionExperience();

  return (
    <button
      type="button"
      onClick={openDrawer}
      title={labels.openCompanion}
      aria-label={labels.ariaOpenCompanion}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-aipify-border bg-white text-aipify-companion transition hover:border-violet-200 hover:bg-violet-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-companion"
      data-companion-topbar
    >
      <CompanionIcon size={28} />
    </button>
  );
}
