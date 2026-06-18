"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSecureAiActionDashboard,
  type SecureAiActionDashboard,
} from "@/lib/aipify/secure-ai-action";

type SecureAiActionDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "executed":
    case "approved":
    case "low":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "failed":
    case "rejected":
    case "cancelled":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function SecureAiActionDashboardPanel({ labels }: SecureAiActionDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<SecureAiActionDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/secure-ai-action/dashboard");
    if (res.ok) setDashboard(parseSecureAiActionDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function resolveRequest(id: string, decision: "approve" | "reject") {
    setActionId(id);
    await fetch(`/api/ai-actions/requests/${id}/${decision}`, { method: "POST" });
    await load();
    setActionId(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const stats = dashboard.approval_statistics;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/aipify-core" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.aipifyCore}
        </Link>
        <Link href="/app/identity-access" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.identityAccess}
        </Link>
        <Link href="/app/approvals" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.approvals}
        </Link>
      </div>

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.actionEngine}</h2>
        <p className="mt-2 text-sm text-teal-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-teal-700">{dashboard.safety_note}</p>
      </section>

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
          <h2 className="text-sm font-semibold text-teal-900">{labels.principles}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-teal-800">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingApprovals}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.pending_approvals ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.executedActions}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.executed_count ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.failedExecutions}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.failed_executions ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.rejectedActions}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{stats?.rejected ?? 0}</p>
        </div>
      </section>

      {dashboard.risk_distribution.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.riskDistribution}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.risk_distribution.map((r) => (
              <span
                key={r.risk_level}
                className={`rounded-full px-3 py-1 text-xs font-medium uppercase ${badgeClass(r.risk_level)}`}
              >
                {r.risk_level} · {r.count}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.recent_requests.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentAiActions}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_requests.map((r) => {
              const rec = r.recommendation as Record<string, string> | undefined;
              return (
                <li key={r.id} className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium capitalize text-gray-900">
                      {r.action_key.replace(/_/g, " ")}
                    </span>
                    <div className="flex gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${badgeClass(r.risk_level)}`}>
                        {r.risk_level}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.status)}`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                  {rec?.summary ? <p className="mt-1 text-xs text-gray-600">{rec.summary}</p> : null}
                  {rec?.expected_impact ? (
                    <p className="mt-1 text-xs text-gray-500">
                      {labels.expectedImpact}: {rec.expected_impact}
                    </p>
                  ) : null}
                  {r.status === "pending" ? (
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        disabled={actionId === r.id}
                        onClick={() => void resolveRequest(r.id, "approve")}
                        className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-800"
                      >
                        {labels.approve}
                      </button>
                      <button
                        type="button"
                        disabled={actionId === r.id}
                        onClick={() => void resolveRequest(r.id, "reject")}
                        className="rounded border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-800"
                      >
                        {labels.reject}
                      </button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.action_catalog.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.actionCatalog}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.action_catalog.map((a) => (
              <div
                key={a.action_key}
                className={`rounded-lg border px-3 py-2 text-sm ${a.enabled ? "border-teal-200 bg-teal-50/30" : "border-gray-200 bg-gray-50 opacity-60"}`}
              >
                <p className="font-medium text-gray-900">{a.title}</p>
                <p className="text-xs capitalize text-gray-500">
                  {a.category} · {a.risk_level}
                  {a.requires_approval ? ` · ${labels.approvalRequired}` : ` · ${labels.autoAllowed}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
