"use client";

import { COMPANION_QUICK_ACTION_IDS, type CompanionQuickActionId } from "@/lib/app/companion";
import type { CompanionExperienceLabels } from "@/lib/app/companion/types";

type CompanionQuickActionsProps = {
  labels: CompanionExperienceLabels;
  icons: Record<CompanionQuickActionId, string>;
  onSelect: (id: CompanionQuickActionId) => void;
  onNavigate: (id: CompanionQuickActionId) => void;
};

export function CompanionQuickActions({
  labels,
  icons,
  onSelect,
  onNavigate,
}: CompanionQuickActionsProps) {
  return (
    <section className="mt-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {COMPANION_QUICK_ACTION_IDS.map((id) => {
          const action = labels.quickActions[id];
          return (
            <div
              key={id}
              className="group flex flex-col rounded-2xl border border-aipify-border bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-lg text-aipify-companion"
                aria-hidden="true"
              >
                {icons[id]}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-aipify-text">{action.title}</h3>
              <p className="mt-1 flex-1 text-xs text-aipify-text-secondary">{action.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  className="rounded-lg bg-aipify-companion px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
                >
                  {labels.askAipifyButton}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(id)}
                  className="rounded-lg border border-aipify-border px-3 py-1.5 text-xs font-medium text-aipify-text-secondary hover:bg-aipify-surface-muted"
                >
                  →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
