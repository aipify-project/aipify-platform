"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AipifyNavClasses, AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import { PARTNER_PORTAL_NAV } from "@/lib/partner-portal/nav-config";

type Props = {
  portalTitle: string;
  portalSubtitle: string;
  signOutLabel: string;
  navLabels: Record<string, string>;
  governanceNote: string;
  children: ReactNode;
};

export default function PartnerPortalShell({
  portalTitle,
  portalSubtitle,
  signOutLabel,
  navLabels,
  governanceNote,
  children,
}: Props) {
  const pathname = usePathname();

  return (
    <div className={`min-h-screen ${AipifyShellClasses.canvas}`}>
      <header className={AipifyShellClasses.topbar}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-aipify-companion">
              Aipify Growth Partners
            </p>
            <h1 className="text-lg font-semibold text-aipify-text">{portalTitle}</h1>
            <p className="text-sm text-aipify-text-secondary">{portalSubtitle}</p>
          </div>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className={AipifyShellClasses.secondaryButton}>
              {signOutLabel}
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row sm:px-6">
        <nav className="shrink-0 lg:w-56">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {PARTNER_PORTAL_NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                      active
                        ? AipifyNavClasses.itemActive
                        : `${AipifyNavClasses.item} border border-aipify-border bg-aipify-surface lg:border-0 lg:bg-transparent`
                    }`}
                  >
                    {navLabels[item.id] ?? item.id}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 hidden text-xs text-aipify-text-muted lg:block">{governanceNote}</p>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
