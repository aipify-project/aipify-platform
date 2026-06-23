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

export type AppSectionTabSize = "default" | "enterprise";

type AppSectionTabsProps = {
  items: AppSectionTabItem[];
  activeKey: string;
  ariaLabel: string;
  size?: AppSectionTabSize;
};

const TAB_SIZE_CLASSES: Record<
  AppSectionTabSize,
  { link: string; icon: string; list: string }
> = {
  default: {
    link: "min-h-10 gap-1.5 px-3 py-2 text-sm",
    icon: "[&_svg]:size-4",
    list: "gap-1 p-0.5 rounded-lg",
  },
  enterprise: {
    link: "min-h-10 gap-1.5 px-3 py-2 text-[13px]",
    icon: "[&_svg]:size-4",
    list: "gap-1 p-0.5 rounded-xl",
  },
};

export function AppSectionTabs({
  items,
  activeKey,
  ariaLabel,
  size = "default",
}: AppSectionTabsProps) {
  const sizing = TAB_SIZE_CLASSES[size];

  return (
    <nav aria-label={ariaLabel} className="-mx-1 overflow-x-auto px-1 pb-1">
      <ul
        className={`flex min-w-max flex-nowrap border border-aipify-border bg-aipify-surface-muted ${sizing.list}`}
      >
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <li key={item.key} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center rounded-lg font-medium whitespace-nowrap transition-colors ${sizing.link} ${AppPremiumShell.focusRing} ${
                  active
                    ? "bg-aipify-companion font-semibold text-white shadow-sm"
                    : "text-aipify-text/80 hover:bg-aipify-surface hover:text-aipify-text focus-visible:bg-aipify-surface focus-visible:text-aipify-text"
                }`}
              >
                <span
                  className={`shrink-0 ${active ? "text-white" : "text-aipify-companion"} ${sizing.icon}`}
                  aria-hidden="true"
                >
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
