"use client";

import Link from "next/link";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { formatRelativeTime } from "@/lib/i18n/format-relative-time";
import type { CommandBriefAttentionItem } from "@/lib/command-center/command-brief-attention";
import { attentionSeverityLabelKey } from "@/lib/command-center/command-brief-attention";
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
  const age = item.timestamp ? formatRelativeTime(item.timestamp, locale) : null;
  const actionHref = resolveActionHref(item, canAccessApprovals);
  const severityLabel = resolveLabel(attentionSeverityLabelKey(item.severityTier));
  const moduleLabelKey = resolveCommandBriefModuleAreaLabelKey(item.moduleArea);
  const moduleLabel = moduleLabelKey ? resolveLabel(moduleLabelKey) : item.moduleArea;

  return (
    <li className="group">
      <article className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-start sm:gap-4">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-aipify-accent-soft text-aipify-companion"
          aria-hidden="true"
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <SemanticBadge type="severity" value={item.primaryBadge.value} label={severityLabel} />
            {item.secondaryBadge ? (
              <SemanticBadge
                type={item.secondaryBadge.type}
                value={item.secondaryBadge.value}
                label={resolveLabel(item.secondaryBadge.labelKey)}
              />
            ) : null}
            {age ? (
              <time dateTime={item.timestamp} className={`ml-auto ${AppPremiumShell.commandBriefMeta}`}>
                {labels.updated}: {age}
              </time>
            ) : null}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-aipify-text sm:text-base">{item.title}</h3>
            {item.description ? (
              <p className={`mt-1 line-clamp-2 ${AppPremiumShell.commandBriefBody}`}>{item.description}</p>
            ) : null}
          </div>

          <div className={`flex flex-wrap gap-x-4 gap-y-1 ${AppPremiumShell.commandBriefMeta}`}>
            <span>
              <span className="font-medium text-aipify-text-secondary">{labels.moduleArea}: </span>
              {moduleLabel}
            </span>
            {item.responsiblePerson ? (
              <span>
                <span className="font-medium text-aipify-text-secondary">{labels.responsible}: </span>
                {item.responsiblePerson}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <Link
              href={actionHref}
              className={`inline-flex min-h-9 items-center rounded-lg bg-aipify-companion px-3 py-1.5 text-sm font-medium text-white transition hover:bg-aipify-companion-hover ${AppPremiumShell.focusRing}`}
            >
              {resolveLabel(item.actionLabelKey)}
            </Link>
            {item.detailHref !== actionHref ? (
              <Link
                href={item.detailHref}
                className={`text-sm font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
              >
                {labels.viewDetails} →
              </Link>
            ) : null}
          </div>
        </div>
      </article>
    </li>
  );
}
