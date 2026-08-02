"use client";

import type { ReactNode } from "react";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { KompisGlobalPanel } from "./KompisGlobalPanel";
import {
  KompisGlobalProvider,
  useKompisGlobal,
  type KompisGlobalLabels,
} from "./KompisGlobalProvider";

type ShellProps = {
  labels: KompisGlobalLabels;
  locale: string;
  organizationName: string;
  userRole: string;
  isAdmin: boolean;
  initialPermissionsJson: string | null;
  children: ReactNode;
};

/** Provider only — mount around APP shell so topbar + content share one open state. */
export function KompisGlobalShell({
  labels,
  locale,
  organizationName,
  userRole,
  isAdmin,
  initialPermissionsJson,
  children,
}: ShellProps) {
  return (
    <KompisGlobalProvider
      labels={labels}
      locale={locale}
      organizationName={organizationName}
      userRole={userRole}
      isAdmin={isAdmin}
      initialPermissionsJson={initialPermissionsJson}
    >
      {children}
    </KompisGlobalProvider>
  );
}

/**
 * Content frame: full width when closed; split or overlay when open.
 * Does not reserve an empty column when Kompis is closed.
 */
export function KompisLayoutFrame({ children }: { children: ReactNode }) {
  const { open, layoutMode } = useKompisGlobal();

  if (!open || layoutMode === "overlay" || layoutMode === "full") {
    return (
      <>
        <div className={AppLayoutClasses.splitMain} data-kompis-main-width="full">
          {children}
        </div>
        <KompisGlobalPanel />
      </>
    );
  }

  return (
    <div className={AppLayoutClasses.splitGrid} data-kompis-layout="split">
      <div className={AppLayoutClasses.splitMain} data-kompis-main-width="split">
        {children}
      </div>
      <aside className={AppLayoutClasses.splitKompis} data-kompis-column="true">
        <KompisGlobalPanel />
      </aside>
    </div>
  );
}
