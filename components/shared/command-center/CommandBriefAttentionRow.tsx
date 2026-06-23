"use client";

import { CommandBriefItemRow } from "@/components/shared/command-center/CommandBriefItemRow";
import type { CommandBriefAttentionItem } from "@/lib/command-center/command-brief-attention";
import { resolveCommandBriefModuleAreaLabelKey } from "@/lib/command-center/command-brief-module-labels";
import { EccTabIcons } from "@/components/app/executive-command-center/ecc-tab-icons";

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

  return (
    <CommandBriefItemRow
      item={{
        ...item,
        description: item.description || sourceParts.join(" · "),
        href: actionHref,
      }}
      locale={locale}
      icon={icon}
      iconTone={item.severityTier === "critical" ? "critical" : item.severityTier === "attention" ? "attention" : item.severityTier === "waiting" ? "waiting" : "info"}
      sourcePrefix={labels.updated}
      resolveLabel={resolveLabel}
      actionHref={actionHref}
    />
  );
}
