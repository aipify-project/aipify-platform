"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ActionImpactAnalysisView } from "@/components/shared/action-center-impact";
import {
  parseActionImpactAnalysis,
  type ActionImpactAnalysis,
  type ActionImpactLabels,
} from "@/lib/action-center-impact";
import { parseActionCenter, type ActionCenter, type AipifyAction } from "@/lib/aipify/execution";

type ActionCenterPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    empty: string;
    youControl: string;
    privacy: string;
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    viewApprovals: string;
    createDemo: string;
    sections: {
      overview: string;
      pending: string;
      executed: string;
      rules: string;
      audit: string;
      ethics: string;
      blocked: string;
    };
    counts: {
      pending: string;
      approved: string;
      executed: string;
      rejected: string;
      failed: string;
      scheduled: string;
      blocked: string;
    };
    actions: {
      approve: string;
      reject: string;
      execute: string;
      schedule: string;
      cancel: string;
      view: string;
      review: string;
    };
    riskLevels: Record<string, string>;
    statusLabels: Record<string, string>;
    executionLevels: Record<string, string>;
    detail: {
      back: string;
      explanation: string;
      impact: string;
      preview: string;
      safety: string;
      history: string;
    };
  };
  impactLabels: ActionImpactLabels;
};

const RISK_STYLES: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-rose-100 text-rose-800",
};

const STATUS_STYLES: Record<string, string> = {
  pending_approval: "bg-amber-100 text-amber-900",
  approved: "bg-sky-100 text-sky-900",
  executed: "bg-emerald-100 text-emerald-900",
  rejected: "bg-rose-100 text-rose-900",
  failed: "bg-rose-100 text-rose-800",
  blocked: "bg-gray-200 text-gray-800",
  scheduled: "bg-indigo-100 text-indigo-900",
};

export function ActionCenterPanel({ labels, impactLabels }: ActionCenterPanelProps) {
  const [center, setCenter] = useState<ActionCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [impactAnalysis, setImpactAnalysis] = useState<ActionImpactAnalysis | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/action-center");
    if (res.ok) setCenter(parseActionCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function loadDetail(id: string) {
    setSelectedId(id);
    const res = await fetch(`/api/aipify/actions/${id}/impact`);
    if (res.ok) setImpactAnalysis(parseActionImpactAnalysis(await res.json()));
  }

  async function approveAction(id: string) {
    setActingId(id);
    await fetch(`/api/aipify/actions/${id}/approve`, { method: "POST" });
    if (selectedId === id) await loadDetail(id);
    await refresh();
    setActingId(null);
  }

  async function rejectAction(id: string) {
    setActingId(id);
    await fetch(`/api/aipify/actions/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Rejected from Action Center" }),
    });
    setSelectedId(null);
    setImpactAnalysis(null);
    await refresh();
    setActingId(null);
  }

  async function executeAction(id: string) {
    setActingId(id);
    await fetch(`/api/aipify/actions/${id}/execute`, { method: "POST" });
    if (selectedId === id) await loadDetail(id);
    await refresh();
    setActingId(null);
  }

  async function createDemoAction() {
    await fetch("/api/aipify/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_type: "customer_follow_up",
        title: "Send follow-up email to inactive leads",
        description: "Aipify prepared personalized follow-up emails for 43 inactive leads.",
        preview_text: "43 personalized follow-up emails ready for review.",
        risk_level: "medium",
        execution_level: "assistant",
        created_by_module: "Aipify Sales Assistant",
        estimated_impact: "Potential +8–12% reactivation",
        payload_json: { count: 43, channel: "email" },
      }),
    });
    await refresh();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  if (center?.upgrade_required) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <h1 className="text-2xl font-bold text-gray-900">{labels.upgradeTitle}</h1>
        <p className="text-gray-600">{labels.upgradeBody}</p>
        <Link href="/app/license" className="inline-block text-sm text-indigo-600 hover:underline">
          {labels.upgradeCta}
        </Link>
      </div>
    );
  }

  const counts = center?.counts ?? {};
  const pending = center?.pending_actions ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <Link href="/app" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-1 text-sm font-medium text-indigo-800">{labels.youControl}</p>
        {(center?.privacy_note || labels.privacy) && (
          <p className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
            {center?.privacy_note ?? labels.privacy}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/app/approvals" className="text-sm text-indigo-600 hover:underline">
            {labels.viewApprovals}
          </Link>
          <button
            type="button"
            onClick={() => void createDemoAction()}
            className="text-sm text-gray-600 hover:underline"
          >
            {labels.createDemo}
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.overview}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <CountCard label={labels.counts.pending} value={counts.pending ?? 0} />
          <CountCard label={labels.counts.approved} value={counts.approved ?? 0} />
          <CountCard label={labels.counts.executed} value={counts.executed ?? 0} />
          <CountCard label={labels.counts.rejected} value={counts.rejected ?? 0} />
          <CountCard label={labels.counts.failed} value={counts.failed ?? 0} />
          <CountCard label={labels.counts.scheduled} value={counts.scheduled ?? 0} />
          <CountCard label={labels.counts.blocked} value={counts.blocked ?? 0} />
        </div>
      </section>

      {selectedId && impactAnalysis?.found && impactAnalysis.action ? (
        <ActionImpactAnalysisView
          analysis={impactAnalysis}
          action={impactAnalysis.action}
          labels={impactLabels}
          statusLabels={labels.statusLabels}
          riskLabels={labels.riskLevels}
          actingId={actingId}
          onBack={() => {
            setSelectedId(null);
            setImpactAnalysis(null);
          }}
          onApprove={() => void approveAction(selectedId)}
          onReject={() => void rejectAction(selectedId)}
          onExecute={() => void executeAction(selectedId)}
        />
      ) : (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.pending}</h2>
          {pending.length === 0 ? (
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-medium text-gray-800">{impactLabels.empty}</p>
              <p className="mt-2 text-sm text-gray-500">{impactLabels.emptyMonitoring}</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {pending.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  labels={labels}
                  actingId={actingId}
                  onView={() => void loadDetail(action.id)}
                  onApprove={() => void approveAction(action.id)}
                  onReject={() => void rejectAction(action.id)}
                  onExecute={() => void executeAction(action.id)}
                />
              ))}
            </ul>
          )}
        </section>
      )}

      {(center?.rules?.length ?? 0) > 0 && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold text-indigo-900">{labels.sections.rules}</h2>
          <ul className="mt-3 space-y-2 text-sm text-indigo-900">
            {center?.rules?.map((rule) => (
              <li key={String(rule.id)}>
                {String(rule.rule_name)} — {labels.riskLevels[String(rule.risk_level)] ?? String(rule.risk_level)}
                {rule.is_active ? " · active" : " · inactive"}
              </li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.ethical_principles) && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-900">{labels.sections.ethics}</h2>
          <ul className="mt-2 space-y-1 text-sm text-violet-800">
            {center.ethical_principles.map((p, i) => (
              <li key={i}>· {p}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        <ul className="mt-3 space-y-1 text-sm text-gray-600">
          {center?.audit_log?.map((log) => (
            <li key={String(log.id)}>
              {String(log.event_type)} — {String(log.event_description)}
            </li>
          )) ?? <li>{labels.empty}</li>}
        </ul>
      </section>
    </div>
  );
}

function CountCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function ActionCard({
  action,
  labels,
  actingId,
  onView,
  onApprove,
  onReject,
  onExecute,
}: {
  action: AipifyAction;
  labels: ActionCenterPanelProps["labels"];
  actingId: string | null;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  onExecute: () => void;
}) {
  const busy = actingId === action.id;
  return (
    <li className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-gray-900">{action.title}</p>
          <p className="mt-1 text-sm text-gray-600">{action.preview_text || action.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${RISK_STYLES[action.risk_level] ?? ""}`}>
              {labels.riskLevels[action.risk_level] ?? action.risk_level}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[action.status] ?? ""}`}>
              {labels.statusLabels[action.status] ?? action.status}
            </span>
            {action.created_by_module && (
              <span className="text-xs text-gray-500">{action.created_by_module}</span>
            )}
          </div>
          {action.estimated_impact && (
            <p className="mt-2 text-xs text-emerald-800">{action.estimated_impact}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onView} className="text-sm text-indigo-600 hover:underline">
            {labels.actions.review}
          </button>
          {action.status === "pending_approval" && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={onApprove}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {labels.actions.approve}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onReject}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs hover:bg-white disabled:opacity-50"
              >
                {labels.actions.reject}
              </button>
            </>
          )}
          {action.status === "approved" && (
            <button
              type="button"
              disabled={busy}
              onClick={onExecute}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {labels.actions.execute}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
