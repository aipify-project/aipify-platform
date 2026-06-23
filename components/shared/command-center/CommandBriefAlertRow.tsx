"use client";

import Link from "next/link";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { formatDateTime } from "@/lib/i18n/format-date";
import { formatRelativeTime } from "@/lib/i18n/format-relative-time";
import type { CommandCenterItem } from "@/lib/command-center/ecc-tab-datasets";
import { EccTabIcons } from "@/components/app/executive-command-center/ecc-tab-icons";

type CommandBriefAlertRowProps = {
  item: CommandCenterItem;
  locale: string;
  labels: {
    alertImpact: string;
    activityAction: string;
  };
  resolveLabel: (key: string) => string;
};

function formatAlertTimestamp(value: string | undefined, locale: string): string | null {
  if (!value) return null;
  return formatRelativeTime(value, locale) ?? formatDateTime(value, locale);
}

export function CommandBriefAlertRow({
  item,
  locale,
  labels,
  resolveLabel,
}: CommandBriefAlertRowProps) {
  const timestamp = formatAlertTimestamp(item.timestamp, locale);

  return (
    <li>
      <Link
        href={item.href}
        className={`group flex items-start gap-3 px-4 py-2.5 transition hover:bg-aipify-surface-muted ${AppPremiumShell.focusRing}`}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700"
          aria-hidden="true"
        >
          {EccTabIcons.alerts}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <SemanticBadge
              type={item.primaryBadge.type}
              value={item.primaryBadge.value}
              label={resolveLabel(item.primaryBadge.labelKey)}
            />
            {item.secondaryBadge ? (
              <SemanticBadge
                type={item.secondaryBadge.type}
                value={item.secondaryBadge.value}
                label={resolveLabel(item.secondaryBadge.labelKey)}
              />
            ) : null}
            {timestamp ? (
              <time dateTime={item.timestamp} className={`ml-auto ${AppPremiumShell.commandBriefMeta}`}>
                {timestamp}
              </time>
            ) : null}
          </div>
          <p className={`${AppPremiumShell.commandBriefListTitle} group-hover:text-aipify-companion`}>{item.title}</p>
          {item.description ? (
            <p className={`line-clamp-2 ${AppPremiumShell.commandBriefListBody}`}>{item.description}</p>
          ) : null}
          {item.blockedSummary ? (
            <p className={AppPremiumShell.commandBriefMeta}>
              {labels.alertImpact}: {item.blockedSummary}
            </p>
          ) : null}
        </div>
        <span className="hidden shrink-0 self-center text-[13px] font-medium text-aipify-companion sm:inline">
          {resolveLabel(item.actionLabelKey)} →
        </span>
      </Link>
    </li>
  );
}
