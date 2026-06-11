"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseHumanOversightEngineDashboard,
  type HumanOversightApproval,
  type HumanOversightEngineDashboard,
} from "@/lib/aipify/human-oversight-engine";

type Props = { labels: Record<string, string> };

function badgeClass(value?: string) {
  switch (value) {
    case "approved":
    case "low":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "critical":
      return "bg-rose-100 text-rose-900";
    case "rejected":
    case "overridden":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function ApprovalRow({
  item,
  labels,
  onAction,
  busy,
}: {
  item: HumanOversightApproval;
  labels: Record<string, string>;
  onAction: (id: string, action: "approve" | "reject") => void;
  busy: boolean;
}) {
  const explanation = item.explanation as Record<string, string> | undefined;
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium capitalize text-gray-900">{item.action_type.replace(/_/g, " ")}</span>
        <div className="flex gap-1">
          <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${badgeClass(item.risk_level)}`}>
            {item.risk_level}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(item.approval_status)}`}>
            {item.approval_status}
          </span>
        </div>
      </div>
      {explanation?.summary ? <p className="mt-1 text-xs text-gray-600">{explanation.summary}</p> : null}
      {typeof item.confidence === "number" ? (
        <p className="mt-1 text-xs text-gray-500">
          {labels.confidence}: {Math.round(item.confidence * 100)}%
        </p>
      ) : null}
      {item.approval_status === "pending" && item.risk_level !== "critical" ? (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(item.id, "approve")}
            className="rounded border border-emerald-200 px-2 py-1 text-xs text-emerald-800 disabled:opacity-50"
          >
            {labels.approve}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(item.id, "reject")}
            className="rounded border border-rose-200 px-2 py-1 text-xs text-rose-800 disabled:opacity-50"
          >
            {labels.reject}
          </button>
        </div>
      ) : null}
      {item.risk_level === "critical" ? (
        <p className="mt-1 text-xs text-rose-700">{labels.criticalNote}</p>
      ) : null}
    </li>
  );
}

export function HumanOversightEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HumanOversightEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/human-oversight-engine/dashboard");
    if (res.ok) setDashboard(parseHumanOversightEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function resolveApproval(id: string, action: "approve" | "reject") {
    setActionId(id);
    await fetch(`/api/oversight/approvals/${id}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: action === "reject" ? "Rejected by reviewer" : undefined }),
    });
    await load();
    setActionId(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const metrics = dashboard.accountability_metrics ?? {};
  const links = dashboard.integration_links ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {links.secure_ai_actions ? (
          <Link href={links.secure_ai_actions} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.secureAiActions}
          </Link>
        ) : null}
        {links.governance ? (
          <Link href={links.governance} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.governance}
          </Link>
        ) : null}
        {links.approvals ? (
          <Link href={links.approvals} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.approvals}
          </Link>
        ) : null}
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm text-violet-900">{dashboard.philosophy}</p>
        {dashboard.safety_note ? <p className="mt-1 text-xs text-violet-700">{dashboard.safety_note}</p> : null}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingApprovals}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{String(summary.pending_approvals ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.rejectedRecommendations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{String(summary.rejected_recommendations ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.highRiskPending}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{String(summary.high_risk_pending ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.overrideCount}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{String(summary.override_count ?? 0)}</p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.accountabilityMetrics}</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">{labels.approvalRate}</p>
            <p className="text-lg font-semibold">{String(metrics.approval_rate ?? 0)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">{labels.overrideRate}</p>
            <p className="text-lg font-semibold">{String(metrics.override_rate ?? 0)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">{labels.avgConfidence}</p>
            <p className="text-lg font-semibold">{String(metrics.avg_confidence ?? 0)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">{labels.criticalBlocked}</p>
            <p className="text-lg font-semibold">{String(metrics.critical_blocked ?? 0)}</p>
          </div>
        </div>
      </section>

      {(dashboard.pending_approvals ?? []).length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.pendingApprovals}</h3>
          <ul className="mt-3 space-y-2">
            {(dashboard.pending_approvals ?? []).map((item) => (
              <ApprovalRow
                key={item.id}
                item={item}
                labels={labels}
                onAction={resolveApproval}
                busy={actionId === item.id}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.rejected_recommendations ?? []).length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.rejectedRecommendations}</h3>
          <ul className="mt-3 space-y-2">
            {(dashboard.rejected_recommendations ?? []).map((item) => (
              <ApprovalRow key={item.id} item={item} labels={labels} onAction={resolveApproval} busy={false} />
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.override_trends ?? []).length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.overrideTrends}</h3>
          <ul className="mt-3 space-y-2">
            {(dashboard.override_trends ?? []).map((o, idx) => (
              <li key={String(o.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <p className="font-medium">{String(o.override_reason ?? "")}</p>
                <p className="mt-1 text-xs text-gray-600">{String(o.business_justification ?? "")}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.risk_distribution && dashboard.risk_distribution.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.riskDistribution}</h3>
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
