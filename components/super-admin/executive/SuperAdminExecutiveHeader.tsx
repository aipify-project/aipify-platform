"use client";

import type { SuperAdminControlCenter } from "@/lib/super-admin/types";

type SuperAdminExecutiveHeaderProps = {
  center: SuperAdminControlCenter;
  labels: {
    headquarters: string;
    operationsCenter: string;
    subtext: string;
    platformStatus: string;
    organizationsServed: string;
    activeWorkspaces: string;
    actionsToday: string;
    systemUptime: string;
    statusOperational: string;
    statusPendingSetup: string;
    statusAttentionRequired: string;
  };
};

function platformStatusLabel(
  status: string | undefined,
  labels: SuperAdminExecutiveHeaderProps["labels"]
) {
  if (status === "attention_required") return labels.statusAttentionRequired;
  if (status === "pending_setup") return labels.statusPendingSetup;
  return labels.statusOperational;
}

export default function SuperAdminExecutiveHeader({
  center,
  labels,
}: SuperAdminExecutiveHeaderProps) {
  const indicators = [
    {
      label: labels.platformStatus,
      value: platformStatusLabel(center.platform_status, labels),
    },
    {
      label: labels.organizationsServed,
      value: String(center.active_organizations ?? 0),
    },
    {
      label: labels.activeWorkspaces,
      value: String(center.active_workspaces ?? center.active_organizations ?? 0),
    },
    {
      label: labels.actionsToday,
      value: String(center.aipify_actions_today ?? 0),
    },
    {
      label: labels.systemUptime,
      value: `${center.system_uptime_pct ?? center.platform_health_score ?? 99.9}%`,
    },
  ];

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="border-b border-zinc-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
          {labels.headquarters}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">
          {labels.operationsCenter}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">{labels.subtext}</p>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {indicators.map((item) => (
          <div key={item.label} className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              {item.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
