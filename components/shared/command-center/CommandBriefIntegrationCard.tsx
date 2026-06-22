"use client";

import Link from "next/link";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { formatDateTime } from "@/lib/i18n/format-date";
import { formatRelativeTime } from "@/lib/i18n/format-relative-time";
import type { CommandBriefIntegrationStatusItem } from "@/lib/command-center/command-brief-integration-status";
import { EccTabIcons } from "@/components/app/executive-command-center/ecc-tab-icons";

type IntegrationOverviewLabels = {
  integrationLatestActivity: string;
  integrationLastSync: string;
  integrationAccessMode: string;
  integrationEventsCount: string;
  integrationAlertsCount: string;
};

type CommandBriefIntegrationCardProps = {
  item: CommandBriefIntegrationStatusItem;
  locale: string;
  labels: IntegrationOverviewLabels;
  resolveLabel: (key: string) => string;
};

function formatSyncTimestamp(value: string | undefined, locale: string): string | null {
  if (!value) return null;
  return formatRelativeTime(value, locale) ?? formatDateTime(value, locale);
}

export function CommandBriefIntegrationCard({
  item,
  locale,
  labels,
  resolveLabel,
}: CommandBriefIntegrationCardProps) {
  const title = item.titleLabelKey ? resolveLabel(item.titleLabelKey) : item.title;
  const lastSync = formatSyncTimestamp(item.lastSync ?? item.latestActivity, locale);
  const eventsLabel = labels.integrationEventsCount.replace("{count}", String(item.eventsCount));
  const alertsLabel = labels.integrationAlertsCount.replace("{count}", String(item.alertsCount));

  return (
    <li>
      <article className={`${AppPremiumShell.elevatedCard} flex h-full flex-col p-4`}>
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-aipify-accent-soft text-aipify-companion"
            aria-hidden="true"
          >
            {EccTabIcons.performance}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-aipify-text">{title}</h3>
              <SemanticBadge
                type={item.badgeType}
                value={item.badgeValue}
                label={resolveLabel(item.statusLabelKey)}
              />
            </div>
            {item.summary ? (
              <p className={`line-clamp-2 ${AppPremiumShell.commandBriefBody}`}>{item.summary}</p>
            ) : null}
            <dl className={`space-y-1 ${AppPremiumShell.commandBriefMeta}`}>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                <span>{eventsLabel}</span>
                {item.alertsCount > 0 ? <span>{alertsLabel}</span> : null}
              </div>
              {lastSync ? (
                <div>
                  <dt className="inline font-medium text-aipify-text-secondary">
                    {labels.integrationLastSync}:{" "}
                  </dt>
                  <dd className="inline">
                    <time dateTime={item.lastSync ?? item.latestActivity}>{lastSync}</time>
                  </dd>
                </div>
              ) : null}
              {item.accessModeLabelKey ? (
                <div>
                  <dt className="inline font-medium text-aipify-text-secondary">
                    {labels.integrationAccessMode}:{" "}
                  </dt>
                  <dd className="inline">{resolveLabel(item.accessModeLabelKey)}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
        <div className="mt-3 pt-2">
          <Link
            href={item.href}
            className={`text-sm font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
          >
            {resolveLabel(item.actionLabelKey)} →
          </Link>
        </div>
      </article>
    </li>
  );
}
