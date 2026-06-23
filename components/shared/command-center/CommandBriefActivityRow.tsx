"use client";

import { CommandBriefPremiumRow } from "@/components/shared/command-center/CommandBriefPremiumRow";
import { resolveCommandBriefEventTypeLabelKey } from "@/lib/command-center/command-brief-event-labels";
import { resolveCommandBriefRecordTitle } from "@/lib/command-center/command-brief-record-title-labels";
import type { SinceLastLoginEvent } from "@/lib/command-center/since-last-login";
import { EccTabIcons } from "@/components/app/executive-command-center/ecc-tab-icons";
import { formatDateTime } from "@/lib/i18n/format-date";
import { formatRelativeTime } from "@/lib/i18n/format-relative-time";
import type { CommandBriefIconTone } from "./command-brief-icon-tones";

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
    return EccTabIcons.companionBriefing;
  }
  if (event.category === "requires_attention") return EccTabIcons.alerts;
  if (event.eventType.toLowerCase().includes("integration")) return EccTabIcons.performance;
  return EccTabIcons.history;
}

function activityIconTone(event: SinceLastLoginEvent): CommandBriefIconTone {
  if (event.category === "completed_by_aipify") return "success";
  if (event.category === "requires_attention") return "attention";
  if (event.workflowState === "awaiting_approval") return "waiting";
  return "info";
}

function formatActivityTimestamp(isoDate: string | undefined, locale: string): string | null {
  if (!isoDate) return null;
  return formatRelativeTime(isoDate, locale) ?? formatDateTime(isoDate, locale);
}

function resolveEventTitle(
  event: SinceLastLoginEvent,
  resolveLabel: (key: string) => string,
): string {
  const typeLabelKey = resolveCommandBriefEventTypeLabelKey(event.eventType);
  if (typeLabelKey) return resolveLabel(typeLabelKey);
  return resolveCommandBriefRecordTitle(event.title, resolveLabel);
}

function resolveSourceLabel(
  event: SinceLastLoginEvent,
  labels: ActivityOverviewLabels,
  resolveLabel: (key: string) => string,
): string {
  const typeLabelKey = resolveCommandBriefEventTypeLabelKey(event.eventType);
  const source = typeLabelKey ? resolveLabel(typeLabelKey) : activityCategoryLabel(labels, event);
  return `${labels.activitySource}: ${source}`;
}

export function CommandBriefActivityRow({
  event,
  locale,
  labels,
  resolveLabel,
}: CommandBriefActivityRowProps) {
  const timestamp = formatActivityTimestamp(event.occurredAt, locale);
  const title = resolveEventTitle(event, resolveLabel);

  return (
    <CommandBriefPremiumRow
      icon={activityIcon(event)}
      iconTone={activityIconTone(event)}
      title={title}
      description={event.explanation ?? undefined}
      primaryBadge={{
        type: "severity",
        value: event.severity ?? "info",
        labelKey: `common.status.semantic.severity.${event.severity ?? "info"}`,
      }}
      primaryBadgeLabel={activityCategoryLabel(labels, event)}
      timestamp={timestamp}
      timestampIso={event.occurredAt}
      sourceLabel={resolveSourceLabel(event, labels, resolveLabel)}
      actionHref={event.href}
      actionLabel={labels.activityAction}
      resolveLabel={resolveLabel}
      asLink
    />
  );
}
