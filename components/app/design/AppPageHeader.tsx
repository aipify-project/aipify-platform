"use client";

import type { ReactNode } from "react";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";

type AppPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  contextRow?: ReactNode;
  /**
   * When true, the header rule stops before the shared decorative orb
   * (AppHubShell + AppDecorativeOrb) instead of spanning full width.
   */
  clearDecorativeOrb?: boolean;
};

export function AppPageHeader({
  eyebrow,
  title,
  description,
  actions,
  contextRow,
  clearDecorativeOrb = false,
}: AppPageHeaderProps) {
  return (
    <header className="space-y-3 pb-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          {eyebrow ? <p className={AppPremiumShell.eyebrow}>{eyebrow}</p> : null}
          <h1 className={AppPremiumShell.pageTitle}>{title}</h1>
          {description ? <p className={AppPremiumShell.pageDescription}>{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {contextRow ? <div className="flex flex-wrap items-center gap-x-4 gap-y-2">{contextRow}</div> : null}
      {/* Dedicated rule — full width by default; shortened when a decorative orb sits top-right. */}
      <div
        aria-hidden="true"
        className={
          clearDecorativeOrb
            ? "h-px max-w-2xl bg-[var(--app-border-accent)]/70 mr-[min(9rem,36%)] sm:mr-40 md:mr-56"
            : "h-px w-full bg-[var(--app-border)]"
        }
      />
    </header>
  );
}
