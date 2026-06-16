"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  GROWTH_PORTAL_HOME_ROUTE,
  GROWTH_PORTAL_NAV_GROUPS,
  getGrowthActiveNavId,
} from "@/lib/growth-portal";
import GrowthPartnerPortalSignOutButton from "@/components/growth-partner-portal/GrowthPartnerPortalSignOutButton";

type GrowthPortalShellProps = {
  portalBadge: string;
  portalTitle: string;
  portalSubtitle: string;
  signOutLabel: string;
  governanceNote: string;
  navLabels: Record<string, string>;
  children: ReactNode;
};

export function GrowthPortalShell({
  portalBadge,
  portalTitle,
  portalSubtitle,
  signOutLabel,
  governanceNote,
  navLabels,
  children,
}: GrowthPortalShellProps) {
  const pathname = usePathname();
  const activeId = getGrowthActiveNavId(pathname);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <Link href={GROWTH_PORTAL_HOME_ROUTE} className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {portalBadge}
            </Link>
            <h1 className="text-lg font-semibold text-slate-900">{portalTitle}</h1>
            <p className="text-sm text-slate-600">{portalSubtitle}</p>
          </div>
          <GrowthPartnerPortalSignOutButton label={signOutLabel} />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row sm:px-6">
        <aside className="lg:w-64 shrink-0">
          <nav className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {GROWTH_PORTAL_NAV_GROUPS.map((group) => (
              <div key={group.id}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {navLabels[group.id] ?? group.id}
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
                              ? "bg-emerald-700 text-white"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {navLabels[item.id] ?? item.id}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">{governanceNote}</p>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
