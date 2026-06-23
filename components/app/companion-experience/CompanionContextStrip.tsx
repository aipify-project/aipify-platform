"use client";

import type { CompanionExperienceLabels } from "@/lib/app/companion/types";

type CompanionContextStripProps = {
  labels: CompanionExperienceLabels;
  orgName: string;
  roleName: string;
  locale: string;
  pageLabel: string;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
};

export function CompanionContextStrip({
  labels,
  orgName,
  roleName,
  locale,
  pageLabel,
  expanded,
  onToggle,
  children,
}: CompanionContextStripProps) {
  return (
    <div className="shrink-0 border-t border-aipify-border bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-aipify-companion hover:bg-violet-50 sm:px-6"
        aria-expanded={expanded}
      >
        <span>{expanded ? labels.secondarySectionsHide : labels.secondarySectionsToggle}</span>
        <svg
          className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
      {expanded ? (
        <div className="max-h-[min(40vh,320px)] overflow-y-auto border-t border-aipify-border px-4 py-3 sm:px-6">
          <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">
                ✓ {labels.verifiedContext}
              </span>
              <span className="text-aipify-text-muted">·</span>
              <span className="text-aipify-text-secondary">
                {labels.activePage.replace("{page}", pageLabel)}
              </span>
            </div>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                  {labels.activeOrganization}
                </dt>
                <dd className="font-medium text-aipify-text">{orgName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                  {labels.roleHeading}
                </dt>
                <dd className="font-medium text-aipify-text">{roleName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                  {labels.languageLabel}
                </dt>
                <dd className="font-medium text-aipify-text">{locale.toUpperCase()}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                  {labels.modeLabel}
                </dt>
                <dd className="font-medium text-aipify-text">{labels.modeAssisted}</dd>
              </div>
            </dl>
          </div>
          {children ? <div className="mt-3">{children}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
