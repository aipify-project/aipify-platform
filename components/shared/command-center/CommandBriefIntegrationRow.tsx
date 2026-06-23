"use client";

import { CommandBriefPremiumRow } from "@/components/shared/command-center/CommandBriefPremiumRow";
import type { CommandBriefIntegrationStatusItem } from "@/lib/command-center/command-brief-integration-status";
import { EccTabIcons } from "@/components/app/executive-command-center/ecc-tab-icons";
import { formatDateTime } from "@/lib/i18n/format-date";
import { formatRelativeTime } from "@/lib/i18n/format-relative-time";

type IntegrationOverviewLabels = {
  integrationLatestActivity: string;
  integrationLastSync: string;
  integrationAccessMode: string;
  integrationEventsCount: string;
  integrationAlertsCount: string;
};

type CommandBriefIntegrationRowProps = {
  item: CommandBriefIntegrationStatusItem;
  locale: string;
  labels: IntegrationOverviewLabels;
  resolveLabel: (key: string) => string;
};

function integrationIcon(packKey: string) {
  const key = packKey.toLowerCase();
  if (key.includes("support")) return EccTabIcons.alerts;
  if (key.includes("finance")) return EccTabIcons.performance;
  if (key.includes("host")) return EccTabIcons.health;
  return EccTabIcons.opportunities;
}

function integrationTone(item: CommandBriefIntegrationStatusItem) {
  if (item.status === "disconnected") return "critical" as const;
  if (item.status === "needs_review" || item.status === "awaiting_setup") return "attention" as const;
  if (item.status === "connected_verified") return "verified" as const;
  if (item.status === "read_only") return "restricted" as const;
  return "info" as const;
}

function formatSyncTimestamp(value: string | undefined, locale: string): string | null {
  if (!value) return null;
  return formatRelativeTime(value, locale) ?? formatDateTime(value, locale);
}

export function CommandBriefIntegrationRow({
  item,
  locale,
  labels,
  resolveLabel,
}: CommandBriefIntegrationRowProps) {
  const title = item.titleLabelKey ? resolveLabel(item.titleLabelKey) : item.title;
  const lastSync = formatSyncTimestamp(item.lastSync ?? item.latestActivity, locale);
  const eventsLabel = labels.integrationEventsCount.replace("{count}", String(item.eventsCount));
  const alertsLabel = labels.integrationAlertsCount.replace("{count}", String(item.alertsCount));
  const sourceParts = [eventsLabel, item.alertsCount > 0 ? alertsLabel : null].filter(Boolean);

  return (
    <CommandBriefPremiumRow
      icon={integrationIcon(item.packKey)}
      iconTone={integrationTone(item)}
      title={title}
      description={item.summary || undefined}
      primaryBadge={{
        type: item.badgeType,
        value: item.badgeValue,
        labelKey: item.statusLabelKey,
      }}
      timestamp={lastSync}
      timestampIso={item.lastSync ?? item.latestActivity}
      sourceLabel={
        sourceParts.length > 0
          ? `${labels.integrationLatestActivity}: ${sourceParts.join(" · ")}`
          : undefined
      }
      actionHref={item.href}
      actionLabel={resolveLabel(item.actionLabelKey)}
      resolveLabel={resolveLabel}
    />
  );
}
