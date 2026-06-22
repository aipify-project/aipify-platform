"use client";

import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { PlatformSnapshotCardPayload } from "@/lib/companion-platform-knowledge/types";

type CompanionPlatformSnapshotCardProps = {
  card: PlatformSnapshotCardPayload;
  locale: string;
};

function formatTimestamp(value: string, locale: string, unavailable: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return unavailable;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function availabilityKind(status: PlatformSnapshotCardPayload["availabilityStatus"]) {
  if (status === "maintenance") return "needs_attention" as const;
  if (status === "degraded") return "needs_attention" as const;
  return "completed" as const;
}

function availabilityLabel(card: PlatformSnapshotCardPayload): string {
  if (card.availabilityStatus === "degraded") return card.labels.availabilityDegraded;
  if (card.availabilityStatus === "maintenance") return card.labels.availabilityMaintenance;
  return card.labels.availabilityAvailable;
}

export function CompanionPlatformSnapshotCard({ card, locale }: CompanionPlatformSnapshotCardProps) {
  const { labels } = card;
  const languageNames =
    card.supportedLocales.length > 0
      ? card.supportedLocales.map((code) => labels.languageLabels[code] ?? code)
      : [];

  return (
    <article
      className={`${AipifyShellClasses.surfaceCard} mt-3 overflow-hidden`}
      aria-label={labels.ariaCard}
    >
      <header className="border-b border-aipify-border bg-aipify-surface-subtle px-4 py-3 sm:px-5">
        <AipifyStatusBadge kind="verified" label={labels.cardTitle} />
        <p className="mt-2 text-sm text-aipify-text-secondary">{labels.cardSupporting}</p>
      </header>

      <div className="space-y-4 px-4 py-4 sm:px-5">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-aipify-text-muted">{labels.fieldEnvironment}</dt>
            <dd className="mt-0.5 text-sm font-medium text-aipify-text">{labels.environmentDisplay}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-aipify-text-muted">{labels.fieldPlatformVersion}</dt>
            <dd className="mt-0.5 text-sm font-medium text-aipify-text">{labels.platformVersionDisplay}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-aipify-text-muted">{labels.fieldAvailability}</dt>
            <dd className="mt-1">
              <AipifyStatusBadge
                kind={availabilityKind(card.availabilityStatus)}
                label={availabilityLabel(card)}
              />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-aipify-text-muted">{labels.fieldCheckedAt}</dt>
            <dd className="mt-0.5 text-sm font-medium text-aipify-text">
              {formatTimestamp(card.checkedAt, locale, labels.timestampUnavailable)}
            </dd>
          </div>
        </dl>

        <div className="border-t border-aipify-border pt-4">
          <h3 className="text-xs font-medium text-aipify-text-muted">{labels.fieldActiveModules}</h3>
          <ul className="mt-2 flex flex-wrap gap-2" aria-label={labels.fieldActiveModules}>
            {card.activeModules.map((moduleKey) => (
              <li key={moduleKey}>
                <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-900 ring-1 ring-inset ring-violet-200">
                  {labels.moduleLabels[moduleKey] ?? moduleKey}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-aipify-border pt-4">
          <h3 className="text-xs font-medium text-aipify-text-muted">{labels.fieldSupportedLanguages}</h3>
          {languageNames.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {languageNames.map((name) => (
                <li key={name}>
                  <span className="inline-flex rounded-full border border-aipify-border bg-white px-2.5 py-0.5 text-xs text-aipify-text">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-aipify-text-secondary">{labels.languagesUnavailable}</p>
          )}
        </div>
      </div>

      <footer className="border-t border-aipify-border bg-aipify-surface-muted/40 px-4 py-3 sm:px-5">
        <p className="text-xs font-medium text-aipify-text-muted">{labels.sourceTitle}</p>
        <p className="mt-1 text-sm text-aipify-text">
          <span aria-hidden="true" className="mr-1">
            🛡️
          </span>
          {labels.sourceLabel}
        </p>
        <p className="mt-0.5 text-xs text-aipify-text-secondary">{labels.sourceMeta}</p>
      </footer>
    </article>
  );
}
