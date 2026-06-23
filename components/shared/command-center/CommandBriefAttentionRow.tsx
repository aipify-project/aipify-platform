"use client";

import { CommandBriefPremiumRow } from "@/components/shared/command-center/CommandBriefPremiumRow";
import type { CommandBriefAttentionItem } from "@/lib/command-center/command-brief-attention";
import { attentionSeverityLabelKey } from "@/lib/command-center/command-brief-attention";
import { resolveCommandBriefModuleAreaLabelKey } from "@/lib/command-center/command-brief-module-labels";
import { resolveCommandBriefRecordTitle } from "@/lib/command-center/command-brief-record-title-labels";
import { EccTabIcons } from "@/components/app/executive-command-center/ecc-tab-icons";
import { formatDateTime } from "@/lib/i18n/format-date";
import { formatRelativeTime } from "@/lib/i18n/format-relative-time";

const ATTENTION_ICONS = {
  critical: EccTabIcons.critical,
  alerts: EccTabIcons.alerts,
  approvals: EccTabIcons.approvals,
  risks: EccTabIcons.risks,
  health: EccTabIcons.health,
  action: EccTabIcons.action,
  performance: EccTabIcons.performance,
} as const;

type CommandBriefAttentionRowProps = {
  item: CommandBriefAttentionItem;
  locale: string;
  labels: {
    moduleArea: string;
    responsible: string;
    updated: string;
    viewDetails: string;
  };
  resolveLabel: (key: string) => string;
  canAccessApprovals: boolean;
};

function resolveActionHref(item: CommandBriefAttentionItem, canAccessApprovals: boolean): string {
  if (item.href.includes("/app/approvals") && !canAccessApprovals) {
    return `/app/command-center/approvals?return=${encodeURIComponent("/app/command-center")}`;
  }
  return item.href;
}

function resolveIconTone(item: CommandBriefAttentionItem) {
  if (item.severityTier === "critical") return "critical" as const;
  if (item.severityTier === "attention") return "attention" as const;
  if (item.severityTier === "waiting") return "waiting" as const;
  return "info" as const;
}

function formatAttentionTimestamp(value: string | undefined, locale: string): string | null {
  if (!value) return null;
  return formatRelativeTime(value, locale) ?? formatDateTime(value, locale);
}

export function CommandBriefAttentionRow({
  item,
  locale,
  labels,
  resolveLabel,
  canAccessApprovals,
}: CommandBriefAttentionRowProps) {
  const icon = ATTENTION_ICONS[item.iconKey] ?? EccTabIcons.alerts;
  const actionHref = resolveActionHref(item, canAccessApprovals);
  const moduleAreaLabelKey = resolveCommandBriefModuleAreaLabelKey(item.moduleArea);
  const moduleAreaLabel = moduleAreaLabelKey ? resolveLabel(moduleAreaLabelKey) : item.moduleArea;
  const sourceParts = [
    `${labels.moduleArea}: ${moduleAreaLabel}`,
    item.responsiblePerson ? `${labels.responsible}: ${item.responsiblePerson}` : null,
  ].filter(Boolean);
  const timestamp = formatAttentionTimestamp(item.timestamp, locale);

  return (
    <CommandBriefPremiumRow
      icon={icon}
      iconTone={resolveIconTone(item)}
      title={resolveCommandBriefRecordTitle(item.title, resolveLabel)}
      description={item.description?.trim() || undefined}
      primaryBadge={item.primaryBadge}
      primaryBadgeLabel={resolveLabel(attentionSeverityLabelKey(item.severityTier))}
      secondaryBadge={item.secondaryBadge}
      timestamp={timestamp}
      timestampIso={item.timestamp}
      sourceLabel={sourceParts.length > 0 ? sourceParts.join(" · ") : undefined}
      actionHref={actionHref}
      actionLabel={resolveLabel(item.actionLabelKey)}
      resolveLabel={resolveLabel}
    />
  );
}
