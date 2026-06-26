"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseCompanionActionCenter,
  riskBadgeClass,
  type CompanionActionCenter,
} from "@/lib/companion-action-approval";
import {
  buildGovernedRejectPayload,
  canRejectQueuedAction,
} from "@/lib/companion-action-approval/queue-reject";

type Props = {
  labels: Record<string, string>;
};

export function CompanionActionApprovalPanel({ labels }: Props) {
  const [center, setCenter] = useState<CompanionActionCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/companion/actions");
      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      setCenter(parseCompanionActionCenter(await res.json()));
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    setBusy(String(payload.action_id ?? payload.action));
    setMessage(null);
    const res = await fetch("/api/companion/actions/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setCenter(parseCompanionActionCenter(await res.json()));
      setMessage(labels.actionComplete);
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(null);
  };

  const rejectPendingAction = (actionRequestId: string) => {
    void postAction(buildGovernedRejectPayload(actionRequestId));
  };

  const rejectQueuedAction = (actionRequestId: string) => {
    void postAction(buildGovernedRejectPayload(actionRequestId));
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
        <AipifyLoader centered />
        <p className="sr-only">{labels.loading}</p>
      </div>
    );
  }

  if (error || !center) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app/companion/orchestration" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            ← {labels.backToCompanion}
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">{labels.title}</h1>
          <p className="mt-2 max-w-3xl text-slate-600">{labels.subtitle}</p>
          <p className="mt-3 text-sm text-slate-700">{center.positioning}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={center.cross_link_trust_approvals}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {labels.trustApprovalsLink}
          </Link>
          <button
            type="button"
            disabled={busy !== null || center.emergency_stop_active}
            onClick={() => void postAction({ action: "emergency_stop" })}
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-800 hover:bg-rose-100 disabled:opacity-50"
          >
            {labels.emergencyStop}
          </button>
        </div>
      </div>

      {center.emergency_stop_active ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {labels.emergencyActive} — {labels.executionPaused}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={labels.dailyLimit} value={center.limits.daily_action_limit} />
        <StatCard label={labels.maxRisk} value={labels[`risk_${center.limits.max_risk_level}`] ?? center.limits.max_risk_level} />
        <StatCard label={labels.approvalThreshold} value={labels[`risk_${center.limits.approval_threshold}`] ?? center.limits.approval_threshold} />
        <StatCard label={labels.pendingActions} value={center.pending_actions.length} />
      </section>

      {center.confirmation_examples.length > 0 ? (
        <section className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
          <h2 className="text-sm font-semibold text-indigo-950">{labels.confirmationTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-indigo-900">
            {center.confirmation_examples.map((ex) => (
              <li key={ex}>“{ex}”</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{labels.pendingActions}</h2>
        {center.pending_actions.length === 0 ? (
          <p className="text-sm text-slate-500">{labels.noPending}</p>
        ) : (
          <div className="space-y-4">
            {center.pending_actions.map((action) => (
              <article key={action.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{action.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{action.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${riskBadgeClass(action.risk_level)}`}>
                    {labels[`risk_${action.risk_level}`] ?? action.risk_level}
                  </span>
                </div>
                <dl className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  <div><dt className="font-medium">{labels.reason}</dt><dd>{action.reason}</dd></div>
                  <div><dt className="font-medium">{labels.requestedFor}</dt><dd>{action.requested_for}</dd></div>
                  <div><dt className="font-medium">{labels.category}</dt><dd>{labels[`category_${action.category}`] ?? action.category}</dd></div>
                  <div><dt className="font-medium">{labels.expectedOutcome}</dt><dd>{action.expected_outcome}</dd></div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" disabled={busy !== null || center.emergency_stop_active} onClick={() => void postAction({ action: "approve", action_id: action.id })} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50">{labels.approve}</button>
                  <button type="button" disabled={busy !== null} onClick={() => rejectPendingAction(action.id)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50">{labels.reject}</button>
                  <button type="button" disabled={busy !== null} onClick={() => void postAction({ action: "request_changes", action_id: action.id })} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50">{labels.requestChanges}</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{labels.executionQueue}</h2>
        {center.execution_queue.length === 0 ? (
          <p className="text-sm text-slate-500">{labels.noQueue}</p>
        ) : (
          <ul className="space-y-2">
            {center.execution_queue.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm">
                <span className="font-medium text-slate-900">{item.title}</span>
                <div className="flex flex-wrap items-center gap-2">
                  {canRejectQueuedAction(item, center.action_history) ? (
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() => rejectQueuedAction(item.action_request_id)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {labels.reject}
                    </button>
                  ) : null}
                  <span className="text-slate-500">{labels[`status_${item.queue_status}`] ?? item.queue_status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{labels.safetyCenter}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <SafetyList title={labels.blockedActions} items={center.safety_center.blocked_actions.map((i) => i.title)} />
          <SafetyList title={labels.failedActions} items={center.safety_center.failed_actions.map((i) => i.title)} />
          <SafetyList title={labels.riskAlerts} items={center.safety_center.risk_alerts.map((i) => `${i.title} (${i.risk_level})`)} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{labels.actionPolicies}</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Policy</th>
                <th className="px-4 py-3">{labels.category}</th>
                <th className="px-4 py-3">{labels.workflowType}</th>
                <th className="px-4 py-3">Rules</th>
              </tr>
            </thead>
            <tbody>
              {center.policies.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.policy_label}</td>
                  <td className="px-4 py-3">{labels[`category_${p.category}`] ?? p.category}</td>
                  <td className="px-4 py-3">{p.workflow_type}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.prohibited ? labels.policyProhibited : p.allowed ? labels.policyAllowed : "—"}
                    {p.requires_approval ? ` · ${labels.requiresApproval}` : ""}
                    {p.auto_approve_low_risk ? ` · ${labels.autoApproveLow}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{labels.actionHistory}</h2>
        {center.action_history.length === 0 ? (
          <p className="text-sm text-slate-500">{labels.noHistory}</p>
        ) : (
          <ul className="space-y-2">
            {center.action_history.map((item) => (
              <li key={item.id} className="flex flex-wrap justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm">
                <span className="font-medium text-slate-900">{item.title}</span>
                <span className="text-slate-500">
                  {labels[`risk_${item.risk_level}`] ?? item.risk_level} · {item.lifecycle_status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{labels.receipts}</h2>
        {center.receipts.length === 0 ? (
          <p className="text-sm text-slate-500">{labels.noReceipts}</p>
        ) : (
          <ul className="space-y-2">
            {center.receipts.map((r) => (
              <li key={r.id} className="rounded-lg border border-slate-200 px-4 py-3 text-sm">
                <p className="font-medium text-slate-900">{r.title}</p>
                <p className="mt-1 text-slate-600">{r.result_summary}</p>
                <p className="mt-1 text-xs text-slate-500">{r.audit_reference} · {r.duration_ms}ms</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{labels.auditLogs}</h2>
        {center.audit_logs.length === 0 ? (
          <p className="text-sm text-slate-500">{labels.noAudit}</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-600">
            {center.audit_logs.map((log) => (
              <li key={log.id} className="rounded-lg border border-slate-100 px-3 py-2">
                {log.summary}
                <span className="ml-2 text-xs text-slate-400">{log.event_type}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.faqTitle}</h2>
        <dl className="mt-4 space-y-4 text-sm text-slate-700">
          <div><dt className="font-medium text-slate-900">{labels.faqWhatIs}</dt><dd className="mt-1">{labels.faqWhatIsAnswer}</dd></div>
          <div><dt className="font-medium text-slate-900">{labels.faqAutoChange}</dt><dd className="mt-1">{labels.faqAutoChangeAnswer}</dd></div>
          <div><dt className="font-medium text-slate-900">{labels.faqGovernance}</dt><dd className="mt-1">{labels.faqGovernanceAnswer}</dd></div>
        </dl>
      </section>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function SafetyList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-xs text-slate-500">—</p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
