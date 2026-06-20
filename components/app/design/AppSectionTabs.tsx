"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";

export type AppSectionTabItem = {
  key: string;
  href: string;
  label: string;
  icon: ReactNode;
};

type AppSectionTabsProps = {
  items: AppSectionTabItem[];
  activeKey: string;
  ariaLabel: string;
};

export function AppSectionTabs({ items, activeKey, ariaLabel }: AppSectionTabsProps) {
  return (
    <nav aria-label={ariaLabel} className="-mx-1 overflow-x-auto px-1 pb-1">
      <ul className="flex min-w-max gap-1 rounded-xl border border-aipify-border bg-aipify-surface-muted p-1 sm:min-w-0 sm:flex-wrap">
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${AppPremiumShell.focusRing} ${
                  active
                    ? "bg-aipify-companion text-white shadow-sm"
                    : "text-aipify-text-secondary hover:bg-aipify-surface hover:text-aipify-text"
                }`}
              >
                <span className={active ? "text-white" : "text-aipify-companion"} aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
