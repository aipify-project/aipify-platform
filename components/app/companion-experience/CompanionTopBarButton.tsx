"use client";

import { useCompanionExperience } from "./CompanionExperienceProvider";
import { CompanionIcon } from "./CompanionIcon";

export function CompanionTopBarButton() {
  const { openDrawer, labels } = useCompanionExperience();

  return (
    <button
      type="button"
      onClick={openDrawer}
      title={labels.companionAvailable}
      aria-label={labels.ariaCompanionAvailable}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-aipify-border bg-white px-2 text-aipify-companion transition hover:border-emerald-200 hover:bg-emerald-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-companion"
      data-companion-topbar
    >
      <CompanionIcon size={28} availabilityRing ariaLabel={labels.ariaCompanionAvailable} />
      <span className="hidden text-xs font-medium text-emerald-800 lg:inline">{labels.companionAvailable}</span>
    </button>
  );
}
