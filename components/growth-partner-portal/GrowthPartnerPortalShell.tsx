"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { GROWTH_PARTNER_PORTAL_NAV } from "@/lib/growth-partner-portal/nav-config";
import GrowthPartnerPortalSignOutButton from "./GrowthPartnerPortalSignOutButton";

type Props = {
  portalTitle: string;
  portalSubtitle: string;
  signOutLabel: string;
  navLabels: Record<string, string>;
  governanceNote: string;
  children: ReactNode;
};

export default function GrowthPartnerPortalShell({
  portalTitle,
  portalSubtitle,
  signOutLabel,
  navLabels,
  governanceNote,
  children,
}: Props) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">Growth Partner Portal</p>
            <h1 className="text-lg font-semibold text-slate-900">{portalTitle}</h1>
            <p className="text-sm text-slate-600">{portalSubtitle}</p>
          </div>
          <GrowthPartnerPortalSignOutButton label={signOutLabel} />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row sm:px-6">
        <nav className="lg:w-56 shrink-0">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {GROWTH_PARTNER_PORTAL_NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                      active
                        ? "bg-indigo-700 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 lg:border-0 lg:bg-transparent"
                    }`}
                  >
                    {navLabels[item.id] ?? item.id}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 hidden text-xs text-slate-500 lg:block">{governanceNote}</p>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
