"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  PARTNERS_PORTAL_HOME_ROUTE,
  PARTNERS_PORTAL_NAV_GROUPS,
  getPartnersActiveNavId,
} from "@/lib/partners-portal";
import { CSP_PARTNER_PORTAL_NAV_GROUPS } from "@/lib/partners-portal/csp-nav";
import GrowthPartnerPortalSignOutButton from "@/components/growth-partner-portal/GrowthPartnerPortalSignOutButton";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

type PartnersPortalShellProps = {
  portalBadge: string;
  portalTitle: string;
  portalSubtitle: string;
  signOutLabel: string;
  governanceNote: string;
  navLabels: Record<string, string>;
  /** Prefer Certified Sales Partner IA for Aipify’s own sales portal. */
  certifiedSalesPartnerMode?: boolean;
  children: ReactNode;
};

export function PartnersPortalShell({
  portalBadge,
  portalTitle,
  portalSubtitle,
  signOutLabel,
  governanceNote,
  navLabels,
  certifiedSalesPartnerMode = true,
  children,
}: PartnersPortalShellProps) {
  const pathname = usePathname();
  const activeId = getPartnersActiveNavId(pathname);
  const groups = certifiedSalesPartnerMode
    ? CSP_PARTNER_PORTAL_NAV_GROUPS
    : PARTNERS_PORTAL_NAV_GROUPS;

  return (
    <div className={`min-h-screen ${AipifyShellClasses.canvas}`}>
      <header className={AipifyShellClasses.topbar}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <Link
              href={PARTNERS_PORTAL_HOME_ROUTE}
              className="text-xs font-semibold uppercase tracking-wide text-aipify-companion"
            >
              {portalBadge}
            </Link>
            <h1 className="text-lg font-semibold text-aipify-text">{portalTitle}</h1>
            <p className="text-sm text-aipify-text-secondary">{portalSubtitle}</p>
          </div>
          <GrowthPartnerPortalSignOutButton label={signOutLabel} />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row sm:px-6">
        <aside className={`${AipifyShellClasses.sidebarDesktopWidth} shrink-0`}>
          <nav className={`${AipifyShellClasses.surfaceCard} space-y-6 p-4`}>
            {groups.map((group) => (
              <div key={group.id}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">
                  {navLabels[group.id] ?? group.labelKey}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const active = activeId === item.id;
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                            active
                              ? "bg-aipify-companion text-white"
                              : "text-aipify-text-secondary hover:bg-aipify-surface-muted"
                          }`}
                        >
                          {navLabels[item.id] ?? item.labelKey}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <p className="mt-4 text-xs leading-relaxed text-aipify-text-muted">{governanceNote}</p>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
