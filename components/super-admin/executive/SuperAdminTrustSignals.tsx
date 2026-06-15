"use client";

import Link from "next/link";
import type { SuperAdminActionItem, SuperAdminTrustSignals } from "@/lib/super-admin/types";

type SuperAdminTrustSignalsPanelProps = {
  signals: SuperAdminTrustSignals;
  labels: {
    title: string;
    subtitle: string;
    backupOk: string;
    backupVerified: string;
    twoFactorEnforced: string;
    auditLoggingActive: string;
    complianceMonitoringActive: string;
    securityPosture: string;
    securityPostureStrong: string;
    securityPostureReview: string;
    complianceHealth: string;
    incidentFreeDays: string;
    executiveVisibility: string;
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
  const postureLabel =
    signals.security_posture === "review"
      ? labels.securityPostureReview
      : labels.securityPostureStrong;

  const items = [
    { active: signals.backup_ok, label: labels.backupOk },
    { active: signals.backup_verified ?? signals.backup_ok, label: labels.backupVerified },
    { active: signals.two_factor_enforced, label: labels.twoFactorEnforced },
    { active: signals.audit_logging_active, label: labels.auditLoggingActive },
    { active: signals.compliance_monitoring_active, label: labels.complianceMonitoringActive },
    { active: signals.executive_visibility !== false, label: labels.executiveVisibility },
  ];

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">{labels.title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{labels.subtitle}</p>

      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 px-4 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {labels.securityPosture}
          </dt>
          <dd className="mt-1 text-lg font-semibold text-zinc-900">{postureLabel}</dd>
        </div>
        <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 px-4 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {labels.complianceHealth}
          </dt>
          <dd className="mt-1 text-lg font-semibold text-zinc-900">
            {signals.compliance_health_pct ?? 0}%
          </dd>
        </div>
        <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 px-4 py-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {labels.incidentFreeDays}
          </dt>
          <dd className="mt-1 text-lg font-semibold text-zinc-900">
            {signals.incident_free_days ?? 0}
          </dd>
        </div>
      </dl>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3"
          >
            <CheckIcon active={item.active} />
            <span className="text-sm text-zinc-700">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const SECTION_ORDER: SuperAdminActionItem["section"][] = [
  "critical",
  "requires_approval",
  "recommended",
  "milestones",
];

export function SuperAdminActionCenterPanel({
  items,
  labels,
}: {
  items: SuperAdminActionItem[];
  labels: {
    title: string;
    subtitle: string;
    takeAction: string;
    priorityCritical: string;
    priorityAttention: string;
    priorityInformational: string;
    categoryRequiresApproval: string;
    categoryRecommended: string;
    categoryCritical: string;
    categoryMilestones: string;
    impactHigh: string;
    impactMedium: string;
    impactLow: string;
    estimatedTime: string;
  };
}) {
  const sectionLabel = (section: SuperAdminActionItem["section"]) => {
    if (section === "critical") return labels.categoryCritical;
    if (section === "requires_approval") return labels.categoryRequiresApproval;
    if (section === "milestones") return labels.categoryMilestones;
    return labels.categoryRecommended;
  };

  const priorityLabel = (priority: SuperAdminActionItem["priority"]) => {
    if (priority === "critical") return labels.priorityCritical;
    if (priority === "attention") return labels.priorityAttention;
    return labels.priorityInformational;
  };

  const impactLabel = (impact: SuperAdminActionItem["impact"]) => {
    if (impact === "high") return labels.impactHigh;
    if (impact === "medium") return labels.impactMedium;
    return labels.impactLow;
  };

  const grouped = SECTION_ORDER.map((section) => ({
    section,
    items: items.filter((item) => item.section === section),
  })).filter((group) => group.items.length > 0);

  return (
    <section
      id="action-center"
      className="scroll-mt-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">{labels.title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{labels.subtitle}</p>

      <div className="mt-6 space-y-8">
        {grouped.map((group) => (
          <div key={group.section}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {sectionLabel(group.section)}
            </h3>
            <ul className="mt-3 space-y-3">
              {group.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/60 px-4 py-4 transition hover:border-zinc-300 hover:bg-white"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-900">{item.message}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-zinc-200/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-700">
                          {priorityLabel(item.priority)}
                        </span>
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-800">
                          {impactLabel(item.impact)}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {labels.estimatedTime.replace("{minutes}", String(item.estimated_minutes))}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white">
                      {labels.takeAction}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
