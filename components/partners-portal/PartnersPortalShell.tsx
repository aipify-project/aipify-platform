"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  PARTNERS_PORTAL_HOME_ROUTE,
  PARTNERS_PORTAL_NAV_GROUPS,
  type PartnersPortalNavGroup,
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
const NAV_OPEN_KEY = "aipify.csp.nav.open";

function itemIsActive(href: string, pathname: string, section: string | null): boolean {
  const [path, query = ""] = href.split("?");
  const wanted = new URLSearchParams(query).get("section");
  if (path === "/partners") return pathname === "/partners";
  const pathMatch = pathname === path || pathname.startsWith(`${path}/`);
  if (!pathMatch) return false;
  if (wanted) return section === wanted;
  if (path === "/partners/marketing/assets") return section !== "library";
  return true;
}

function activeGroupId(groups: PartnersPortalNavGroup[], pathname: string, section: string | null): string {
  return groups.find((group) => group.items.some((item) => itemIsActive(item.href, pathname, section)))?.id ?? "home";
}

export function PartnersPortalShell(props: PartnersPortalShellProps) {
  return (
    <Suspense fallback={<PartnersPortalFrame {...props} section={null} />}>
      <PartnersPortalFrameWithSearch {...props} />
    </Suspense>
  );
}

function PartnersPortalFrameWithSearch(props: PartnersPortalShellProps) {
  const section = useSearchParams().get("section");
  return <PartnersPortalFrame {...props} section={section} />;
}

function PartnersPortalFrame({
  portalBadge,
  portalTitle,
  portalSubtitle,
  signOutLabel,
  governanceNote,
  navLabels,
  certifiedSalesPartnerMode = true,
  topbarActions,
  children,
  section,
}: PartnersPortalShellProps & { section: string | null }) {
  const pathname = usePathname();
  const groups = certifiedSalesPartnerMode ? CSP_PARTNER_PORTAL_NAV_GROUPS : PARTNERS_PORTAL_NAV_GROUPS;
  const activeGroup = useMemo(() => activeGroupId(groups, pathname, section), [groups, pathname, section]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    let stored: Record<string, boolean> = {};
    try {
      const raw = sessionStorage.getItem(NAV_OPEN_KEY);
      if (raw) stored = JSON.parse(raw) as Record<string, boolean>;
    } catch {
      stored = {};
    }
    setOpenGroups({ ...stored, [activeGroup]: true });
    setNavReady(true);
  }, [activeGroup]);

  useEffect(() => {
    if (!navReady) return;
    sessionStorage.setItem(NAV_OPEN_KEY, JSON.stringify(openGroups));
  }, [openGroups, navReady]);

  function toggleGroup(id: string) {
    setOpenGroups((current) => ({ ...current, [id]: current[id] !== true }));
  }

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
          {certifiedSalesPartnerMode ? (
            <button
              type="button"
              className="mb-3 w-full rounded-lg border border-aipify-border bg-white px-3 py-2 text-left text-sm font-semibold text-aipify-text lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="csp-portal-nav"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? navLabels.menuClose : navLabels.menu}
            </button>
          ) : null}
          <nav
            id="csp-portal-nav"
            className={`${AipifyShellClasses.surfaceCard} space-y-2 p-3 ${
              certifiedSalesPartnerMode && !mobileOpen ? "hidden lg:block" : "block"
            }`}
            aria-label={portalTitle}
          >
            {groups.map((group) => {
              const open = certifiedSalesPartnerMode
                ? navReady
                  ? openGroups[group.id] === true
                  : group.id === activeGroup
                : true;
              return (
                <div key={group.id}>
                  {certifiedSalesPartnerMode ? (
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-aipify-text-muted hover:bg-aipify-surface-muted"
                      aria-expanded={open}
                      aria-controls={`csp-nav-${group.id}`}
                      onClick={() => toggleGroup(group.id)}
                    >
                      <span>{navLabels[group.id] ?? group.labelKey}</span>
                      <span aria-hidden="true">{open ? "–" : "+"}</span>
                    </button>
                  ) : (
                    <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">
                      {navLabels[group.id] ?? group.labelKey}
                    </p>
                  )}
                  <ul id={`csp-nav-${group.id}`} className={open ? "space-y-1 pb-2" : "hidden"} hidden={!open}>
                    {group.items.map((item) => {
                      const active = certifiedSalesPartnerMode
                        ? itemIsActive(item.href, pathname, section)
                        : pathname === item.href || (item.href !== "/partners" && pathname.startsWith(item.href));
                      return (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setMobileOpen(false)}
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
              );
            })}
          </nav>
          <p className="mt-4 text-xs leading-relaxed text-aipify-text-muted">{governanceNote}</p>
        </aside>

        <main id="partners-main" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
