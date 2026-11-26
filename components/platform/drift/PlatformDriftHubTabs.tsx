"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  getDriftActiveTabId,
  getDriftTabsForHub,
  type DriftHubId,
  type DriftHubTab,
} from "@/lib/platform/drift-hub";

type PlatformDriftHubTabsProps = {
  hub: DriftHubId;
  labels: Record<string, string>;
  ariaLabel: string;
};

function resolveTabLabel(tab: DriftHubTab, labels: Record<string, string>): string {
  return labels[tab.id] ?? tab.id;
}

export function PlatformDriftHubTabs({ hub, labels, ariaLabel }: PlatformDriftHubTabsProps) {
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const tabs = getDriftTabsForHub(hub);
  if (tabs.length <= 1) return null;

  const activeId = getDriftActiveTabId(pathname, searchParams);

  return (
    <nav aria-label={ariaLabel} className="-mx-1 overflow-x-auto px-1 pb-1">
      <ul className="flex min-w-max flex-nowrap gap-1 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-muted)] p-0.5">
        {tabs.map((tab) => {
          const active = tab.id === activeId;
          return (
            <li key={tab.id} className="shrink-0">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-10 items-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)] ${
                  active
                    ? "bg-[color:var(--aipify-companion-purple)] font-semibold text-white shadow-sm"
                    : "text-[color:var(--aipify-text-secondary)] hover:bg-[color:var(--aipify-surface)] hover:text-[color:var(--aipify-text)]"
                }`}
              >
                {resolveTabLabel(tab, labels)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
