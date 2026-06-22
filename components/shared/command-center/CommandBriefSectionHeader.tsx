"use client";

import Link from "next/link";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";

type CommandBriefSectionHeaderProps = {
  id: string;
  title: string;
  seeAllHref?: string;
  seeAllLabel?: string;
};

export function CommandBriefSectionHeader({
  id,
  title,
  seeAllHref,
  seeAllLabel,
}: CommandBriefSectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 id={id} className={AppPremiumShell.commandBriefSectionTitle}>
        {title}
      </h2>
      {seeAllHref && seeAllLabel ? (
        <Link
          href={seeAllHref}
          className={`shrink-0 text-sm font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
        >
          {seeAllLabel} →
        </Link>
      ) : null}
    </div>
  );
}
