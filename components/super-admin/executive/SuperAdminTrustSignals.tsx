"use client";

import Link from "next/link";
import type { SuperAdminTrustSignals } from "@/lib/super-admin/types";

type SuperAdminTrustSignalsPanelProps = {
  signals: SuperAdminTrustSignals;
  labels: {
    title: string;
    backupOk: string;
    twoFactorEnforced: string;
    auditLoggingActive: string;
    complianceMonitoringActive: string;
  };
};

function CheckIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 ${active ? "text-emerald-600" : "text-zinc-300"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

export default function SuperAdminTrustSignalsPanel({
  signals,
  labels,
}: SuperAdminTrustSignalsPanelProps) {
  const items = [
    { active: signals.backup_ok, label: labels.backupOk },
    { active: signals.two_factor_enforced, label: labels.twoFactorEnforced },
    { active: signals.audit_logging_active, label: labels.auditLoggingActive },
    { active: signals.compliance_monitoring_active, label: labels.complianceMonitoringActive },
  ];

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">{labels.title}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 px-4 py-3"
          >
            <CheckIcon active={item.active} />
            <span className="text-sm text-zinc-700">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SuperAdminActionCenterPanel({
  items,
  labels,
}: {
  items: Array<{ id: string; message: string; href: string; priority: string }>;
  labels: {
    title: string;
    subtitle: string;
    open: string;
    priorityCritical: string;
    priorityAttention: string;
    priorityInformational: string;
  };
}) {
  const priorityLabel = (priority: string) => {
    if (priority === "critical") return labels.priorityCritical;
    if (priority === "attention") return labels.priorityAttention;
    return labels.priorityInformational;
  };

  return (
    <section
      id="action-center"
      className="scroll-mt-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">{labels.title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{labels.subtitle}</p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/60 px-4 py-3 transition hover:border-zinc-300 hover:bg-white"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">{item.message}</p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  {priorityLabel(item.priority)}
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                {labels.open}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
