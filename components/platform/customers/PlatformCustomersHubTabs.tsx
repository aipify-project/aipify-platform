"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CUSTOMERS_HUB_TABS,
  CUSTOMERS_SUPPORT_HREF,
  getCustomersHubActiveTabId,
  type CustomersHubTab,
} from "@/lib/platform/customers-hub";

type PlatformCustomersHubTabsProps = {
  labels: {
    overview: string;
    organizations: string;
    customerSuccess: string;
    supportLink: string;
  };
  ariaLabel: string;
};

function resolveTabLabel(
  tab: CustomersHubTab,
  labels: PlatformCustomersHubTabsProps["labels"],
): string {
  if (tab.id === "overview") return labels.overview;
  if (tab.id === "organizations") return labels.organizations;
  return labels.customerSuccess;
}

export function PlatformCustomersHubTabs({
  labels,
  ariaLabel,
}: PlatformCustomersHubTabsProps) {
  const pathname = usePathname() || "";
  const activeId = getCustomersHubActiveTabId(pathname);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <nav aria-label={ariaLabel} className="-mx-1 overflow-x-auto px-1 pb-1">
        <ul className="flex min-w-max flex-nowrap gap-1 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-muted)] p-0.5">
          {CUSTOMERS_HUB_TABS.map((tab) => {
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
      <Link
        href={CUSTOMERS_SUPPORT_HREF}
        className="shrink-0 text-sm font-medium text-violet-700 hover:text-violet-800 dark:text-violet-300"
      >
        {labels.supportLink}
      </Link>
    </div>
  );
}
