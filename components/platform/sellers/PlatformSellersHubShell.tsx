"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SellersAdminNav } from "@/components/platform/sellers/SellersAdminNav";
import { SELLERS_ADMIN_NAV } from "@/lib/platform/sellers-admin-nav";
import { shouldShowSellersHubTabs } from "@/lib/platform/sellers-hub";

export type PlatformSellersHubShellLabels = {
  ariaLabel: string;
  tabs: Record<string, string>;
};

/** Horizontal tabs over existing /platform/sellers/* routes. */
export function PlatformSellersHubShell({
  labels,
  children,
}: {
  labels: PlatformSellersHubShellLabels;
  children: ReactNode;
}) {
  const pathname = usePathname() || "";
  const showTabs = shouldShowSellersHubTabs(pathname);
  const tabLabels: Record<string, string> = {};
  for (const item of SELLERS_ADMIN_NAV) {
    tabLabels[item.id] = labels.tabs[item.id] ?? item.id;
  }

  return (
    <div className="space-y-4">
      {showTabs ? (
        <div className="px-6 pt-4 lg:px-8">
          <SellersAdminNav label={labels.ariaLabel} labels={tabLabels} />
        </div>
      ) : null}
      {children}
    </div>
  );
}
