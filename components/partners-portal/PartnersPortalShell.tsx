"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import {
  PARTNERS_PORTAL_HOME_ROUTE,
  PARTNERS_PORTAL_NAV_GROUPS,
  type PartnersPortalNavGroup,
} from "@/lib/partners-portal";
import { CSP_PARTNER_PORTAL_NAV_GROUPS } from "@/lib/partners-portal/csp-nav";
import { SELLER_PORTAL_LAYOUT } from "@/lib/partners-portal/design-tokens";
import { markPartnersSoftNavReady, markPartnersSoftNavStart } from "@/lib/partners-portal/soft-nav-perf";
import GrowthPartnerPortalSignOutButton from "@/components/growth-partner-portal/GrowthPartnerPortalSignOutButton";
import { PoweredByAipifyFooter } from "@/components/branding/PoweredByAipifyFooter";

type PartnersPortalShellProps = {
  portalBadge: string;
  portalTitle: string;
  portalSubtitle: string;
  signOutLabel: string;
  governanceNote: string;
  /** Shared brand footer — same wording as APP / Platform Admin. */
  poweredByLabel: string;
  navLabels: Record<string, string>;
  /** Prefer Certified Sales Partner IA for Aipify’s own sales portal. */
  certifiedSalesPartnerMode?: boolean;
  /** Optional topbar actions (language, feedback, notifications, profile). */
  topbarActions?: ReactNode;
  /** Optional route title for the content topbar. */
  contentTitle?: string | null;
  children: ReactNode;
};

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

function activeItemLabel(
  groups: PartnersPortalNavGroup[],
  pathname: string,
  section: string | null,
  navLabels: Record<string, string>,
): string | null {
  for (const group of groups) {
    for (const item of group.items) {
      if (itemIsActive(item.href, pathname, section)) {
        return navLabels[item.id] ?? item.labelKey;
      }
    }
  }
  return null;
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
  poweredByLabel,
  navLabels,
  certifiedSalesPartnerMode = true,
  topbarActions,
  contentTitle,
  children,
  section,
}: PartnersPortalShellProps & { section: string | null }) {
  const pathname = usePathname();
  const groups = certifiedSalesPartnerMode ? CSP_PARTNER_PORTAL_NAV_GROUPS : PARTNERS_PORTAL_NAV_GROUPS;
  const activeGroup = useMemo(() => activeGroupId(groups, pathname, section), [groups, pathname, section]);
  const routeLabel = useMemo(
    () => contentTitle ?? activeItemLabel(groups, pathname, section, navLabels) ?? portalTitle,
    [contentTitle, groups, pathname, section, navLabels, portalTitle],
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [navReady, setNavReady] = useState(false);
  const drawerTitleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, section]);

  useEffect(() => {
    markPartnersSoftNavStart(pathname);
    const frame = window.requestAnimationFrame(() => {
      markPartnersSoftNavReady(pathname);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, section]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  function toggleGroup(id: string) {
    setOpenGroups((current) => ({ ...current, [id]: current[id] !== true }));
  }

  function renderNav(idPrefix: string) {
    return (
      <nav className="flex h-full flex-col" aria-label={navLabels.mainNavigation ?? portalTitle}>
        <div className="border-b border-[#E8E4F2] px-4 py-4">
          <Link href={PARTNERS_PORTAL_HOME_ROUTE} className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <Image
              src="/website-kompis/design-v1/brand/aipify-mark.svg"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1E293B]">{portalBadge}</p>
              <p className="truncate text-xs text-[#64748B]">{portalTitle}</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {groups.map((group) => {
            const open = certifiedSalesPartnerMode
              ? navReady
                ? openGroups[group.id] === true
                : group.id === activeGroup
              : true;
            return (
              <div key={`${idPrefix}-${group.id}`} className="pb-1">
                {certifiedSalesPartnerMode ? (
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[0.7rem] font-semibold uppercase tracking-wide text-[#94A3B8] hover:bg-[#F6F4FB] ${SELLER_PORTAL_LAYOUT.focusRing}`}
                    aria-expanded={open}
                    aria-controls={`${idPrefix}-csp-nav-${group.id}`}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <span>{navLabels[group.id] ?? group.labelKey}</span>
                    <span aria-hidden="true" className="text-sm">
                      {open ? "–" : "+"}
                    </span>
                  </button>
                ) : (
                  <p className="mb-1 px-2.5 text-[0.7rem] font-semibold uppercase tracking-wide text-[#94A3B8]">
                    {navLabels[group.id] ?? group.labelKey}
                  </p>
                )}
                <ul id={`${idPrefix}-csp-nav-${group.id}`} className={open ? "space-y-0.5 pb-1" : "hidden"} hidden={!open}>
                  {group.items.map((item) => {
                    const active = certifiedSalesPartnerMode
                      ? itemIsActive(item.href, pathname, section)
                      : pathname === item.href || (item.href !== "/partners" && pathname.startsWith(item.href));
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          prefetch
                          aria-current={active ? "page" : undefined}
                          onClick={() => setMobileOpen(false)}
                          className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${SELLER_PORTAL_LAYOUT.focusRing} ${
                            active
                              ? "bg-[#7C3AED] text-white shadow-sm"
                              : "text-[#475569] hover:bg-[#F3EDFF] hover:text-[#5538D3]"
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
        </div>

        <div className="mt-auto shrink-0">
          <p className="border-t border-[#E8E4F2] px-4 py-2 text-[0.65rem] leading-relaxed text-[#94A3B8]">
            {governanceNote}
          </p>
          <PoweredByAipifyFooter label={poweredByLabel} />
        </div>
      </nav>
    );
  }

  return (
    <div className={`flex min-h-screen overflow-x-hidden ${SELLER_PORTAL_LAYOUT.workCanvasClass} text-[#1E293B]`}>
      {/* Desktop fixed sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 border-r border-[#E8E4F2] bg-white lg:block ${SELLER_PORTAL_LAYOUT.sidebarWidthClass}`}
      >
        {renderNav("desktop")}
      </aside>

      {/* Mobile drawer */}
      {certifiedSalesPartnerMode && mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby={drawerTitleId}>
          <button
            type="button"
            className="absolute inset-0 bg-[#1E293B]/40"
            aria-label={navLabels.menuClose}
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E8E4F2] px-4 py-3">
              <p id={drawerTitleId} className="text-sm font-semibold text-[#1E293B]">
                {navLabels.menu}
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                className={`rounded-lg px-3 py-2 text-sm font-medium text-[#64748B] hover:bg-[#F6F4FB] ${SELLER_PORTAL_LAYOUT.focusRing}`}
                onClick={() => setMobileOpen(false)}
              >
                {navLabels.menuClose}
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{renderNav("mobile")}</div>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className={`sticky top-0 z-30 border-b border-[#E8E4F2] bg-white/95 backdrop-blur-sm ${SELLER_PORTAL_LAYOUT.topbarMinClass}`}>
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              {certifiedSalesPartnerMode ? (
                <button
                  type="button"
                  className={`inline-flex h-10 items-center rounded-xl border border-[#E8E4F2] bg-white px-3 text-sm font-semibold text-[#1E293B] lg:hidden ${SELLER_PORTAL_LAYOUT.focusRing}`}
                  aria-expanded={mobileOpen}
                  aria-controls="csp-portal-nav"
                  onClick={() => setMobileOpen(true)}
                >
                  {navLabels.menu}
                </button>
              ) : null}
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[#94A3B8]">{portalBadge}</p>
                <p className="truncate text-sm font-semibold text-[#1E293B] sm:text-base">{routeLabel}</p>
                <p className="hidden truncate text-xs text-[#64748B] sm:block">{portalSubtitle}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              {topbarActions}
              <GrowthPartnerPortalSignOutButton label={signOutLabel} />
            </div>
          </div>
        </header>

        <main id="partners-main" className={`min-w-0 flex-1 ${SELLER_PORTAL_LAYOUT.contentPadClass}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
