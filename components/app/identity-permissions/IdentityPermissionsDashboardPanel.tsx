"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseIdentityPermissionsDashboard,
  type IdentityPermissionsDashboard,
} from "@/lib/aipify/identity-permissions";

type IdentityPermissionsDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "active":
    case "approved":
    case "ready":
    case "low":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
    case "invited":
    case "medium":
    case "planned":
      return "bg-amber-100 text-amber-800";
    case "suspended":
    case "locked":
    case "high":
      return "bg-orange-100 text-orange-800";
    case "rejected":
    case "deleted":
    case "expired":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function IdentityPermissionsDashboardPanel({
  labels,
}: IdentityPermissionsDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<IdentityPermissionsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/identity-permissions/dashboard");
    if (res.ok) setDashboard(parseIdentityPermissionsDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function resolveApproval(id: string, decision: "approve" | "reject") {
    setActionId(id);
    await fetch(`/api/identity/approvals/${id}/${decision}`, { method: "POST" });
    await load();
    setActionId(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/aipify-core" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.aipifyCore}
        </Link>
        <Link href="/app/multi-tenant" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.multiTenant}
        </Link>
        <Link href="/app/team" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.team}
        </Link>
        <Link href="/app/approvals" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.approvals}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.identityOverview}</h2>
        <p className="mt-2 text-sm text-violet-900">
          {labels.role}:{" "}
          <span className="font-medium capitalize">{dashboard.current_role?.replace(/_/g, " ")}</span>
        </p>
        <p className="mt-2 text-sm text-violet-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-violet-700">{dashboard.safety_note}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.activeUsers}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.active_users ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingInvitations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.pending_invitations ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingApprovals}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.pending_approvals ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.suspendedUsers}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.suspended_users ?? 0}</p>
        </div>
      </section>

      {dashboard.role_distribution.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.roleDistribution}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.role_distribution.map((r) => (
              <span
                key={r.role}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-800"
              >
                {r.role.replace(/_/g, " ")} · {r.count}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.approval_requests.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.approvalQueue}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.approval_requests.map((r) => (
              <li key={r.id} className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium capitalize text-amber-900">
                    {r.action_type?.replace(/_/g, " ")}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${badgeClass(r.risk_level)}`}>
                    {r.risk_level}
                  </span>
                </div>
                {r.status === "pending" && dashboard.can_approve_medium ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      disabled={actionId === r.id}
                      onClick={() => void resolveApproval(r.id, "approve")}
                      className="rounded border border-emerald-200 bg-white px-2 py-1 text-xs text-emerald-800"
                    >
                      {labels.approve}
                    </button>
                    <button
                      type="button"
                      disabled={actionId === r.id}
                      onClick={() => void resolveApproval(r.id, "reject")}
                      className="rounded border border-rose-200 bg-white px-2 py-1 text-xs text-rose-800"
                    >
                      {labels.reject}
                    </button>
                  </div>
                ) : (
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.status)}`}>
                    {r.status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.ai_risk_classification.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.aiRiskClassification}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.ai_risk_classification.map((r) => (
              <article key={r.level} className="rounded-lg border border-violet-100 bg-violet-50/30 p-3 text-sm">
                <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${badgeClass(r.level)}`}>
                  {r.level}
                </span>
                <p className="mt-2 text-xs text-violet-800">
                  {r.auto_execute ? labels.autoAllowed : labels.approvalRequired}
                </p>
                <ul className="mt-2 list-disc pl-4 text-xs text-violet-700">
                  {r.examples.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.user_permissions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.yourPermissions}</h2>
          <div className="mt-2 flex flex-wrap gap-1">
            {dashboard.user_permissions.map((p) => (
              <span key={p} className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-700">
                {p}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.mfa_readiness.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.mfaReadiness}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {dashboard.mfa_readiness.map((m) => (
              <span
                key={m.method}
                className={`rounded-full px-3 py-1 text-xs capitalize ${badgeClass(m.status)}`}
              >
                {m.method.replace(/_/g, " ")} · {m.status}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.recent_access_events.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentAccessEvents}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_access_events.map((e) => (
              <li key={e.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium capitalize">{e.action_type?.replace(/_/g, " ")}</span>
                {e.actor_role ? (
                  <span className="ml-2 text-xs text-gray-500 capitalize">({e.actor_role.replace(/_/g, " ")})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
