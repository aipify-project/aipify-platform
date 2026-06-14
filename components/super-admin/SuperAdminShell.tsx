"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import SuperAdminWarningBanner from "./SuperAdminWarningBanner";
import SuperAdminSignOutButton from "./SuperAdminSignOutButton";
import { SUPER_ADMIN_HOME_ROUTE, SUPER_ADMIN_SECTIONS } from "@/lib/super-admin/nav-config";

const WARNING_ACK_KEY = "aipify-super-admin-warning-ack";

type SuperAdminShellProps = {
  portalTitle: string;
  portalSubtitle: string;
  organizationLabel: string;
  signOutLabel: string;
  warningTitle: string;
  warningBody: string;
  warningProceedLabel: string;
  sectionLabels: Record<string, { title: string; purpose: string }>;
  moduleLabels: Record<string, { label: string; description: string }>;
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
  sectionLabels,
  moduleLabels,
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {!warningAcknowledged ? (
        <SuperAdminWarningBanner
          title={warningTitle}
          body={warningBody}
          proceedLabel={warningProceedLabel}
          onProceed={acknowledgeWarning}
        />
      ) : null}

      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-zinc-900/50 lg:block">
          <div className="border-b border-zinc-800 px-5 py-6">
            <Link href={SUPER_ADMIN_HOME_ROUTE} className="block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {organizationLabel}
              </p>
              <h1 className="mt-1 text-lg font-semibold text-zinc-100">{portalTitle}</h1>
              <p className="mt-1 text-xs text-zinc-500">{portalSubtitle}</p>
            </Link>
          </div>

          <nav className="space-y-6 overflow-y-auto px-3 py-4" style={{ maxHeight: "calc(100vh - 7rem)" }}>
            {SUPER_ADMIN_SECTIONS.map((section) => {
              const labels = sectionLabels[section.id];
              return (
                <div key={section.id}>
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {labels?.title}
                  </p>
                  <p className="px-2 pb-2 text-[11px] leading-snug text-zinc-600">{labels?.purpose}</p>
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
                                ? "bg-zinc-800 text-zinc-50"
                                : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
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

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 lg:px-8">
            <div className="lg:hidden">
              <p className="text-sm font-semibold text-zinc-100">{portalTitle}</p>
              <p className="text-xs text-zinc-500">{portalSubtitle}</p>
            </div>
            <SuperAdminSignOutButton label={signOutLabel} />
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
