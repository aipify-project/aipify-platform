"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseEnterpriseReadinessEngineDashboard,
  type EnterpriseReadinessEngineDashboard,
} from "@/lib/aipify/enterprise-readiness-engine";

type Props = { labels: Record<string, string> };

function healthClass(status?: string) {
  switch (status) {
    case "excellent":
      return "bg-emerald-100 text-emerald-800";
    case "healthy":
      return "bg-sky-100 text-sky-800";
    case "at_risk":
      return "bg-amber-100 text-amber-800";
    case "critical":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function EnterpriseReadinessEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<EnterpriseReadinessEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/enterprise-readiness-engine/dashboard");
    if (res.ok) setDashboard(parseEnterpriseReadinessEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function loadReport(type: string) {
    setReportLoading(type);
    await fetch(`/api/enterprise/reports/${type}`);
    setReportLoading(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const deployment = dashboard.deployment_readiness ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/governance-policy-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.governance}
        </Link>
        <Link
          href="/app/deployment-environment-management-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.deployments}
        </Link>
        <Link href="/app/enterprise" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.enterpriseDeployment}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${healthClass(summary.health_status as string)}`}
          >
            {String(summary.health_status ?? "healthy")}
          </span>
        </div>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.overall_score}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.overall_readiness_score ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.delegated_admins}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.delegated_admin_count ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.approval_chains}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.active_approval_chains ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.pending_milestones}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.pending_milestones ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.security_posture}</h3>
        <p className="mt-2 text-sm text-gray-600">
          {labels.securityScore}: {String(dashboard.security_posture?.score ?? "—")}
        </p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.integration_landscape}</h3>
        <p className="mt-2 text-sm text-gray-600">
          {labels.connectedIntegrations}: {String(summary.integration_connected_count ?? 0)}
        </p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.approval_bottlenecks}</h3>
        {(dashboard.approval_bottlenecks ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.approval_bottlenecks.map((item, idx) => (
              <li key={String(item.chain_key ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.chain_title ?? item.chain_key)} · {String(item.bottleneck_risk ?? "normal")}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.operational_risks}</h3>
        {(dashboard.operational_risks ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.operational_risks.map((item, idx) => (
              <li key={String(item.milestone_key ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.milestone_title ?? item.milestone_key)} · {String(item.status ?? "pending")}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.onboarding_milestones}</h3>
        {(dashboard.onboarding_milestones ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.onboarding_milestones.map((item, idx) => (
              <li key={String(item.milestone_key ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.milestone_title ?? item.milestone_key)} · {String(item.category ?? "")}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.deployment_readiness}</h3>
        <p className="mt-2 text-sm text-gray-600">
          {labels.deploymentModel}: {String(deployment.current_model ?? "multi_tenant_saas")}
        </p>
        {deployment.route ? (
          <Link href={String(deployment.route)} className="mt-2 inline-block text-sm text-blue-600 hover:underline">
            {labels.openDeploymentEngine}
          </Link>
        ) : null}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.reports}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {(dashboard.reports_available ?? ["executive", "operational", "governance", "audit_preparation"]).map(
            (type) => (
              <button
                key={type}
                type="button"
                disabled={reportLoading === type}
                onClick={() => void loadReport(type === "audit_preparation" ? "audit-preparation" : type)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
              >
                {type}
              </button>
            )
          )}
        </div>
      </section>

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => (
              <li key={pr}>{pr}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
