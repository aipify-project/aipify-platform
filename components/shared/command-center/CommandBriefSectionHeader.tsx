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
      <h2
        id={id}
        className="text-[13px] font-semibold leading-snug tracking-tight text-aipify-text sm:text-sm"
      >
        {title}
      </h2>
      {seeAllHref && seeAllLabel ? (
        <Link
          href={seeAllHref}
          className={`shrink-0 text-[13px] font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
        >
          {seeAllLabel} →
        </Link>
      ) : null}
    </div>
  );
}
