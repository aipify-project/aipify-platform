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
  /** Optional topbar actions (language, feedback, notifications). */
  topbarActions?: ReactNode;
  children: ReactNode;
};

const CONTENT_MAX = "mx-auto w-full max-w-[1600px]";

export function PartnersPortalShell({
  portalBadge,
  portalTitle,
  portalSubtitle,
  signOutLabel,
  governanceNote,
  navLabels,
  certifiedSalesPartnerMode = true,
  topbarActions,
  children,
}: PartnersPortalShellProps) {
  const pathname = usePathname();
  const activeId = getPartnersActiveNavId(pathname);
  const groups = certifiedSalesPartnerMode
    ? CSP_PARTNER_PORTAL_NAV_GROUPS
    : PARTNERS_PORTAL_NAV_GROUPS;

  return (
    <div className={`min-h-screen overflow-x-hidden ${AipifyShellClasses.canvas}`}>
      <header className={`${AipifyShellClasses.topbar} sticky top-0 z-40`}>
        <div className={`${CONTENT_MAX} flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8`}>
          <div className="min-w-0 flex-1">
            <Link
              href={PARTNERS_PORTAL_HOME_ROUTE}
              className="text-xs font-semibold uppercase tracking-wide text-aipify-companion"
            >
              {portalBadge}
            </Link>
            <h1 className="text-lg font-semibold text-aipify-text sm:text-xl">{portalTitle}</h1>
            <p className="hidden text-sm text-aipify-text-secondary sm:block">{portalSubtitle}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            {topbarActions}
            <GrowthPartnerPortalSignOutButton label={signOutLabel} />
          </div>
        </div>
      </header>

      <div className={`${CONTENT_MAX} flex flex-col gap-6 px-4 py-6 lg:flex-row sm:px-6 lg:px-8`}>
        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[256px] lg:self-start">
          <nav className={`${AipifyShellClasses.surfaceCard} space-y-6 p-4`} aria-label={portalTitle}>
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
                          aria-current={active ? "page" : undefined}
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

        <main id="partners-main" className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
