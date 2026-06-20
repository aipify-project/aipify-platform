"use client";

import type { ReactNode } from "react";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";

type AppPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  contextRow?: ReactNode;
};

export function AppPageHeader({
  eyebrow,
  title,
  description,
  actions,
  contextRow,
}: AppPageHeaderProps) {
  return (
    <header className="space-y-4 border-b border-aipify-border pb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          {eyebrow ? <p className={AppPremiumShell.eyebrow}>{eyebrow}</p> : null}
          <h1 className={AppPremiumShell.pageTitle}>{title}</h1>
          {description ? <p className={AppPremiumShell.pageDescription}>{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {contextRow ? <div className="flex flex-wrap items-center gap-x-4 gap-y-2">{contextRow}</div> : null}
    </header>
  );
}
