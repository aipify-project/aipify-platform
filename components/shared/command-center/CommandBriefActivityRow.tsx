"use client";

import Link from "next/link";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { formatDateTime } from "@/lib/i18n/format-date";
import { formatRelativeTime } from "@/lib/i18n/format-relative-time";
import { resolveCommandBriefEventTypeLabelKey } from "@/lib/command-center/command-brief-event-labels";
import type { SinceLastLoginEvent } from "@/lib/command-center/since-last-login";
import { EccTabIcons } from "@/components/app/executive-command-center/ecc-tab-icons";

type ActivityOverviewLabels = {
  activityCategories: Record<string, string>;
  activitySource: string;
  activityAction: string;
};

type CommandBriefActivityRowProps = {
  event: SinceLastLoginEvent;
  locale: string;
  labels: ActivityOverviewLabels;
  resolveLabel: (key: string) => string;
};

function activityCategoryLabel(labels: ActivityOverviewLabels, event: SinceLastLoginEvent): string {
  if (event.workflowState === "awaiting_approval") return labels.activityCategories.awaiting_review;
  return labels.activityCategories[event.category] ?? labels.activityCategories.information;
}

function activityIcon(event: SinceLastLoginEvent) {
  if (event.category === "completed_by_aipify" || event.category === "observed_by_aipify") {
    return EccTabIcons.action;
  }
  if (event.category === "requires_attention") return EccTabIcons.alerts;
  return EccTabIcons.history;
}

function formatActivityTimestamp(isoDate: string | undefined, locale: string): string | null {
  if (!isoDate) return null;
  return formatRelativeTime(isoDate, locale) ?? formatDateTime(isoDate, locale);
}

function resolveEventTitle(
  event: SinceLastLoginEvent,
  resolveLabel: (key: string) => string
): string {
  const typeLabelKey = resolveCommandBriefEventTypeLabelKey(event.eventType);
  if (typeLabelKey) return resolveLabel(typeLabelKey);
  return event.title;
}

function resolveSourceLabel(
  event: SinceLastLoginEvent,
  labels: ActivityOverviewLabels,
  resolveLabel: (key: string) => string
): string {
  const typeLabelKey = resolveCommandBriefEventTypeLabelKey(event.eventType);
  if (typeLabelKey) return resolveLabel(typeLabelKey);
  return activityCategoryLabel(labels, event);
}

export function CommandBriefActivityRow({
  event,
  locale,
  labels,
  resolveLabel,
}: CommandBriefActivityRowProps) {
  const timestamp = formatActivityTimestamp(event.occurredAt, locale);
  const title = resolveEventTitle(event, resolveLabel);
  const source = resolveSourceLabel(event, labels, resolveLabel);

  return (
    <li>
      <Link
        href={event.href}
        className={`group flex items-start gap-3 px-4 py-3 transition hover:bg-aipify-surface-muted ${AppPremiumShell.focusRing}`}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-aipify-accent-soft text-aipify-companion"
          aria-hidden="true"
        >
          {activityIcon(event)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-aipify-text group-hover:text-aipify-companion">
              {title}
            </span>
            <SemanticBadge
              type="severity"
              value={event.severity ?? "info"}
              label={activityCategoryLabel(labels, event)}
            />
            {timestamp ? (
              <time dateTime={event.occurredAt} className={`ml-auto ${AppPremiumShell.commandBriefMeta}`}>
                {timestamp}
              </time>
            ) : null}
          </div>
          {event.explanation ? (
            <p className={`mt-0.5 line-clamp-1 ${AppPremiumShell.commandBriefBody}`}>{event.explanation}</p>
          ) : null}
          <p className={`mt-1 ${AppPremiumShell.commandBriefMeta}`}>
            {labels.activitySource}: {source}
          </p>
        </div>
        <span className="hidden shrink-0 self-center text-sm font-medium text-aipify-companion sm:inline">
          {labels.activityAction} →
        </span>
      </Link>
    </li>
  );
}
