"use client";

import type { ReactNode } from "react";
import { CommandBriefPremiumRow } from "@/components/shared/command-center/CommandBriefPremiumRow";
import type { CommandBriefIconTone } from "@/components/shared/command-center/command-brief-icon-tones";
import type { CommandCenterItem } from "@/lib/command-center/ecc-tab-datasets";
import { resolveCommandBriefRecordTitle } from "@/lib/command-center/command-brief-record-title-labels";
import { formatDateTime } from "@/lib/i18n/format-date";
import { formatRelativeTime } from "@/lib/i18n/format-relative-time";

type CommandBriefItemRowProps = {
  item: CommandCenterItem;
  locale: string;
  icon: ReactNode;
  iconTone?: CommandBriefIconTone;
  sourcePrefix: string;
  resolveLabel: (key: string) => string;
  actionHref?: string;
  asLink?: boolean;
};

function formatItemTimestamp(value: string | undefined, locale: string): string | null {
  if (!value) return null;
  return formatRelativeTime(value, locale) ?? formatDateTime(value, locale);
}

function resolveIconTone(item: CommandCenterItem): CommandBriefIconTone {
  const severity = item.primaryBadge.value;
  const workflow = item.secondaryBadge?.value;
  if (severity === "critical") return "critical";
  if (workflow === "blocked" || workflow === "overdue") return "attention";
  if (workflow === "awaiting_approval" || workflow === "pending" || workflow === "open") return "waiting";
  if (severity === "high" || severity === "medium") return "attention";
  if (workflow === "completed" || severity === "healthy" || severity === "good") return "success";
  if (item.primaryBadge.type === "access") return "restricted";
  if (item.primaryBadge.type === "health" && severity === "healthy") return "verified";
  return "info";
}

export function CommandBriefItemRow({
  item,
  locale,
  icon,
  iconTone,
  sourcePrefix,
  resolveLabel,
  actionHref,
  asLink = false,
}: CommandBriefItemRowProps) {
  const timestamp = formatItemTimestamp(item.timestamp, locale);
  const href = actionHref ?? item.href;
  const title = resolveCommandBriefRecordTitle(item.title, resolveLabel);
  const sourceLabel = item.source
    ? `${sourcePrefix}: ${resolveCommandBriefRecordTitle(item.source.replace(/_/g, " "), resolveLabel)}`
    : undefined;

  return (
    <CommandBriefPremiumRow
      icon={icon}
      iconTone={iconTone ?? resolveIconTone(item)}
      title={title}
      description={item.description?.trim() || item.blockedSummary?.trim() || undefined}
      primaryBadge={item.primaryBadge}
      secondaryBadge={item.secondaryBadge}
      timestamp={timestamp}
      timestampIso={item.timestamp}
      sourceLabel={sourceLabel}
      actionHref={href}
      actionLabel={resolveLabel(item.actionLabelKey)}
      resolveLabel={resolveLabel}
      asLink={asLink}
    />
  );
}
