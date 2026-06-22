"use client";

import Link from "next/link";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { formatRelativeTime } from "@/lib/i18n/format-relative-time";
import type { CommandBriefAttentionItem } from "@/lib/command-center/command-brief-attention";
import { attentionSeverityLabelKey } from "@/lib/command-center/command-brief-attention";
import { EccTabIcons } from "./ecc-tab-icons";

const ATTENTION_ICONS = {
  critical: EccTabIcons.critical,
  alerts: EccTabIcons.alerts,
  approvals: EccTabIcons.approvals,
  risks: EccTabIcons.risks,
  health: EccTabIcons.health,
  action: EccTabIcons.action,
  performance: EccTabIcons.performance,
} as const;

type AttentionLabels = {
  moduleArea: string;
  responsible: string;
  updated: string;
  viewDetails: string;
};

type CommandBriefAttentionCardProps = {
  item: CommandBriefAttentionItem;
  locale: string;
  labels: AttentionLabels;
  resolveLabel: (key: string) => string;
  canAccessApprovals: boolean;
};

function formatAttentionAge(timestamp: string | undefined, locale: string): string | null {
  if (!timestamp) return null;
  return formatRelativeTime(timestamp, locale);
}

function resolveActionHref(item: CommandBriefAttentionItem, canAccessApprovals: boolean): string {
  if (item.href.includes("/app/approvals") && !canAccessApprovals) {
    return `/app/command-center/approvals?return=${encodeURIComponent("/app/command-center")}`;
  }
  return item.href;
}

export function CommandBriefAttentionCard({
  item,
  locale,
  labels,
  resolveLabel,
  canAccessApprovals,
}: CommandBriefAttentionCardProps) {
  const icon = ATTENTION_ICONS[item.iconKey] ?? EccTabIcons.alerts;
  const age = formatAttentionAge(item.timestamp, locale);
  const actionHref = resolveActionHref(item, canAccessApprovals);
  const severityLabel = resolveLabel(attentionSeverityLabelKey(item.severityTier));

  return (
    <article className={`${AppPremiumShell.elevatedCard} border-l-4 border-l-aipify-companion/40 p-5 sm:p-6`}>
      <div className="flex items-start gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-aipify-accent-soft text-aipify-companion"
          aria-hidden="true"
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <SemanticBadge type="severity" value={item.primaryBadge.value} label={severityLabel} />
            {item.secondaryBadge ? (
              <SemanticBadge
                type={item.secondaryBadge.type}
                value={item.secondaryBadge.value}
                label={resolveLabel(item.secondaryBadge.labelKey)}
              />
            ) : null}
          </div>

          <div>
            <h3 className="text-base font-semibold text-aipify-text sm:text-lg">{item.title}</h3>
            {item.description ? (
              <p className={`mt-2 line-clamp-2 ${AppPremiumShell.commandBriefBody}`}>{item.description}</p>
            ) : null}
          </div>

          <dl className={`grid gap-2 sm:grid-cols-2 ${AppPremiumShell.commandBriefMeta}`}>
            <div>
              <dt className="inline font-medium text-aipify-text-secondary">{labels.moduleArea}: </dt>
              <dd className="inline capitalize text-aipify-text">{item.moduleArea}</dd>
            </div>
            {age ? (
              <div>
                <dt className="inline font-medium text-aipify-text-secondary">{labels.updated}: </dt>
                <dd className="inline">
                  <time dateTime={item.timestamp}>{age}</time>
                </dd>
              </div>
            ) : null}
            {item.responsiblePerson ? (
              <div className="sm:col-span-2">
                <dt className="inline font-medium text-aipify-text-secondary">{labels.responsible}: </dt>
                <dd className="inline text-aipify-text">{item.responsiblePerson}</dd>
              </div>
            ) : null}
          </dl>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={actionHref}
              className={`inline-flex min-h-11 items-center rounded-lg bg-aipify-companion px-4 py-2 text-base font-medium text-white transition hover:bg-aipify-companion-hover ${AppPremiumShell.focusRing}`}
            >
              {resolveLabel(item.actionLabelKey)}
            </Link>
            {item.detailHref !== actionHref ? (
              <Link
                href={item.detailHref}
                className={`text-base font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
              >
                {labels.viewDetails} →
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
