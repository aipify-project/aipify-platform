"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { CommandCenterBadge } from "@/lib/command-center/ecc-tab-datasets";
import {
  commandBriefIconTileClass,
  type CommandBriefIconTone,
} from "./command-brief-icon-tones";

export type CommandBriefPremiumRowProps = {
  icon: ReactNode;
  iconTone?: CommandBriefIconTone;
  title: string;
  description?: string;
  primaryBadge?: CommandCenterBadge | null;
  secondaryBadge?: CommandCenterBadge | null;
  primaryBadgeLabel?: string;
  secondaryBadgeLabel?: string;
  timestamp?: string | null;
  timestampIso?: string;
  sourceLabel?: string;
  actionHref?: string;
  actionLabel?: string;
  resolveLabel: (key: string) => string;
  asLink?: boolean;
};

export function CommandBriefPremiumRow({
  icon,
  iconTone = "brand",
  title,
  description,
  primaryBadge,
  secondaryBadge,
  primaryBadgeLabel,
  secondaryBadgeLabel,
  timestamp,
  timestampIso,
  sourceLabel,
  actionHref,
  actionLabel,
  resolveLabel,
  asLink = false,
}: CommandBriefPremiumRowProps) {
  const body = (
    <article className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-start sm:gap-3.5 sm:py-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${commandBriefIconTileClass(iconTone)}`}
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-start gap-x-2 gap-y-1.5">
          <h3 className={`min-w-0 flex-1 ${AppPremiumShell.commandBriefListTitle}`}>{title}</h3>
          {timestamp ? (
            <time
              dateTime={timestampIso}
              className={`shrink-0 text-[13px] leading-snug text-aipify-text-muted ${timestampIso ? "" : ""}`}
            >
              {timestamp}
            </time>
          ) : null}
        </div>

        {description ? (
          <p className={`line-clamp-3 ${AppPremiumShell.commandBriefListBody}`}>{description}</p>
        ) : null}

        {(primaryBadge || secondaryBadge) && (
          <div className="flex flex-wrap items-center gap-2">
            {primaryBadge ? (
              <SemanticBadge
                type={primaryBadge.type}
                value={primaryBadge.value}
                label={primaryBadgeLabel ?? resolveLabel(primaryBadge.labelKey)}
              />
            ) : null}
            {secondaryBadge ? (
              <SemanticBadge
                type={secondaryBadge.type}
                value={secondaryBadge.value}
                label={secondaryBadgeLabel ?? resolveLabel(secondaryBadge.labelKey)}
              />
            ) : null}
          </div>
        )}

        {sourceLabel ? (
          <p className="text-[13px] leading-snug text-aipify-text-muted">
            {sourceLabel}
          </p>
        ) : null}

        {actionHref && actionLabel ? (
          <div className="pt-0.5">
            <Link
              href={actionHref}
              className={`inline-flex min-h-9 items-center rounded-lg bg-aipify-companion px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-aipify-companion-hover ${AppPremiumShell.focusRing}`}
            >
              {actionLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );

  if (asLink && actionHref) {
    return (
      <li>
        <Link
          href={actionHref}
          className={`block transition hover:bg-aipify-surface-muted/80 ${AppPremiumShell.focusRing}`}
        >
          {body}
        </Link>
      </li>
    );
  }

  return <li>{body}</li>;
}
