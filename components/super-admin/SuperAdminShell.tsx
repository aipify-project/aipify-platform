"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { CommandBarProvider } from "@/components/command-bar";
import SuperAdminCommandBarTrigger from "./SuperAdminCommandBarTrigger";
import SuperAdminWarningBanner from "./SuperAdminWarningBanner";
import SuperAdminSignOutButton from "./SuperAdminSignOutButton";
import SuperAdminOperationsProvider from "./SuperAdminOperationsProvider";
import SuperAdminGlobalStatusBar from "./executive/SuperAdminGlobalStatusBar";
import SuperAdminIdentityBadge from "./executive/SuperAdminIdentityBadge";
import { SUPER_ADMIN_HOME_ROUTE, SUPER_ADMIN_SECTIONS } from "@/lib/super-admin/nav-config";
import { AipifyNavClasses, AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type { CommandBarLabels, CommandBarNavSource } from "@/lib/command-bar";

const WARNING_ACK_KEY = "aipify-super-admin-warning-ack";

type SuperAdminShellProps = {
  portalTitle: string;
  portalSubtitle: string;
  organizationLabel: string;
  signOutLabel: string;
  warningTitle: string;
  warningBody: string;
  warningProceedLabel: string;
  loadErrorLabel: string;
  identityRoleLabel: string;
  identityVerifiedLabel: string;
  statusBarLabels: {
    operational: string;
    warning: string;
    warningCount: string;
    critical: string;
    openActionCenter: string;
  };
  sectionLabels: Record<string, { title: string; purpose: string }>;
  moduleLabels: Record<string, { label: string; description: string }>;
  commandBarLabels: CommandBarLabels;
  commandBarNavSources: CommandBarNavSource[];
  footerSignature?: string;
  children: ReactNode;
};

export default function SuperAdminShell({
  portalTitle,
  portalSubtitle,
  organizationLabel,
  signOutLabel,
  warningTitle,
  warningBody,
  warningProceedLabel,
  loadErrorLabel,
  identityRoleLabel,
  identityVerifiedLabel,
  statusBarLabels,
  sectionLabels,
  moduleLabels,
  commandBarLabels,
  commandBarNavSources,
  footerSignature,
  children,
}: SuperAdminShellProps) {
  const pathname = usePathname();
  const [warningAcknowledged, setWarningAcknowledged] = useState(true);

  useEffect(() => {
    const ack = sessionStorage.getItem(WARNING_ACK_KEY);
    setWarningAcknowledged(ack === "1");
  }, []);

  const acknowledgeWarning = () => {
    sessionStorage.setItem(WARNING_ACK_KEY, "1");
    setWarningAcknowledged(true);
    void fetch("/api/super-admin/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: "super_admin_session_entered" }),
    });
  };

  return (
    <CommandBarProvider
      portal="super_admin"
      labels={commandBarLabels}
      navSources={commandBarNavSources}
      platformRole="super_admin"
    >
      <SuperAdminOperationsProvider loadErrorLabel={loadErrorLabel}>
        <div className={`min-h-screen ${AipifyShellClasses.canvas}`}>
          {!warningAcknowledged ? (
            <SuperAdminWarningBanner
              title={warningTitle}
              body={warningBody}
              proceedLabel={warningProceedLabel}
              onProceed={acknowledgeWarning}
            />
          ) : null}

          <div className="flex min-h-screen">
            <aside className={`hidden w-72 shrink-0 lg:block ${AipifyShellClasses.sidebar}`}>
              <div className="border-b border-aipify-border px-5 py-6">
                <Link href={SUPER_ADMIN_HOME_ROUTE} className="block">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    {organizationLabel}
                  </p>
                  <h1 className="mt-1 text-lg font-semibold text-gray-900">{portalTitle}</h1>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{portalSubtitle}</p>
                </Link>
              </div>

              <nav
                className="space-y-6 overflow-y-auto px-3 py-4"
                style={{ maxHeight: "calc(100vh - 7rem)" }}
              >
                {SUPER_ADMIN_SECTIONS.map((section) => {
                  const labels = sectionLabels[section.id];
                  return (
                    <div key={section.id}>
                      <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        {labels?.title}
                      </p>
                      <p className="px-2 pb-2 text-[11px] leading-snug text-gray-400">
                        {labels?.purpose}
                      </p>
                      <ul className="space-y-0.5">
                        {section.modules.map((module) => {
                          const moduleLabel = moduleLabels[module.id];
                          const active = pathname === module.href;
                          return (
                            <li key={module.id}>
                              <Link
                                href={module.href}
                                className={`block rounded-md px-2 py-1.5 text-sm transition ${
                                  active
                                    ? AipifyNavClasses.itemActive
                                    : AipifyNavClasses.item
                                }`}
                              >
                                {moduleLabel?.label ?? module.id}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </nav>
            </aside>

            <div className={`flex min-w-0 flex-1 flex-col ${AipifyShellClasses.canvas}`}>
              <SuperAdminGlobalStatusBar labels={statusBarLabels} />

              <header className={`flex items-center justify-between gap-4 px-4 py-3 lg:px-8 ${AipifyShellClasses.topbar}`}>
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="lg:hidden">
                    <p className="text-sm font-semibold text-gray-900">{portalTitle}</p>
                    <p className="text-xs text-gray-500">{portalSubtitle}</p>
                  </div>
                  <SuperAdminCommandBarTrigger
                    placeholder={commandBarLabels.placeholder}
                    openLabel={commandBarLabels.openCommandBar}
                  />
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <SuperAdminIdentityBadge
                    roleLabel={identityRoleLabel}
                    verifiedLabel={identityVerifiedLabel}
                  />
                  <SuperAdminSignOutButton label={signOutLabel} />
                </div>
              </header>

              <main className="flex-1 px-4 py-6 lg:px-8">
                {children}
                {footerSignature ? (
                  <footer className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
                    {footerSignature}
                  </footer>
                ) : null}
              </main>
            </div>
          </div>
        </div>
      </SuperAdminOperationsProvider>
    </CommandBarProvider>
  );
}
