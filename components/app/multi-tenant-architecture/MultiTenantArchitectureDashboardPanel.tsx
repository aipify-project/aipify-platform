"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseMultiTenantArchitectureDashboard,
  type MultiTenantArchitectureDashboard,
} from "@/lib/aipify/multi-tenant-architecture";

type MultiTenantArchitectureDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "active":
    case "connected":
    case "published":
      return "bg-emerald-100 text-emerald-800";
    case "trial":
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "suspended":
    case "inactive":
      return "bg-orange-100 text-orange-800";
    case "archived":
    case "disconnected":
    case "error":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function MultiTenantArchitectureDashboardPanel({
  labels,
}: MultiTenantArchitectureDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<MultiTenantArchitectureDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/multi-tenant-architecture/dashboard");
    if (res.ok) setDashboard(parseMultiTenantArchitectureDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const org = dashboard.organization;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/aipify-core" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.aipifyCore}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        <Link href="/app/team" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.team}
        </Link>
      </div>

      {org?.is_unonight_pilot ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3 text-sm text-blue-900">
          <span className="font-medium">{labels.unonightPilot}</span>
          <p className="mt-1 text-xs text-blue-800">{labels.unonightNote}</p>
        </div>
      ) : null}

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.selectedOrganization}</h2>
        <p className="mt-2 text-2xl font-bold text-indigo-950">{org?.name}</p>
        <p className="mt-1 text-sm text-indigo-800">
          {org?.slug} · {labels.role}:{" "}
          <span className="capitalize">{dashboard.current_role?.replace(/_/g, " ")}</span> ·{" "}
          {org?.subscription_plan}
        </p>
        <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.modulesEnabled}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.modules_enabled ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingTasks}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.pending_tasks ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.activeAlerts}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.active_alerts ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.knowledgeCenter}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {dashboard.knowledge_center?.article_count ?? 0}
          </p>
          <p className="text-xs text-gray-500">
            {dashboard.knowledge_center?.faq_count ?? 0} {labels.faqs}
          </p>
        </div>
      </section>

      {dashboard.available_organizations.length > 1 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.yourOrganizations}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.available_organizations.map((o) => (
              <span
                key={o.id}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  o.id === org?.id ? "bg-indigo-100 text-indigo-900" : "bg-gray-100 text-gray-700"
                }`}
              >
                {o.name}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.enabled_modules.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.enabledModules}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.enabled_modules.map((m) => (
              <div
                key={m.module_key}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  m.enabled ? "border-emerald-200 bg-emerald-50/40" : "border-gray-200 bg-gray-50"
                }`}
              >
                <p className="font-medium capitalize text-gray-900">{m.module_key.replace(/_/g, " ")}</p>
                <p className="text-xs text-gray-500">
                  {m.enabled ? labels.enabled : labels.disabled}
                  {m.plan_required ? ` · ${m.plan_required}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.integrations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.integrations}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.integrations.map((i) => (
              <li
                key={i.integration_type}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
              >
                <span className="font-medium capitalize">{i.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(i.status)}`}>
                  {i.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.role_permissions ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.rolePermissions}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(dashboard.role_permissions).map(([key, allowed]) => (
              <span
                key={key}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  allowed ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"
                }`}
              >
                {key.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.isolation_checks && dashboard.isolation_checks.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">{labels.dataIsolation}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">
            {dashboard.isolation_checks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recent_audit_events.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.auditLogging}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_audit_events.map((e) => (
              <li key={e.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium capitalize">{e.action_type?.replace(/_/g, " ")}</span>
                {e.actor_role ? (
                  <span className="ml-2 text-xs text-gray-500 capitalize">({e.actor_role.replace(/_/g, " ")})</span>
                ) : null}
                {e.ai_involved ? (
                  <span className="ml-2 text-xs text-violet-600">{labels.aiInvolved}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
