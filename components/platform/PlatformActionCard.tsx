"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/i18n/format-date";
import {
  formatExecutionTime,
  getActionRiskStyle,
  getActionStatusStyle,
  type PlatformAction,
} from "@/lib/platform/action-engine";

export type PlatformActionCardLabels = {
  riskLevel: string;
  reason: string;
  recommendedBy: string;
  environment: string;
  customer: string;
  preparedSteps: string;
  expectedOutcome: string;
  expectedImpact: string;
  approvalStatus: string;
  estimatedTime: string;
  rollbackAvailable: string;
  rollbackYes: string;
  rollbackNo: string;
  whatWillChange: string;
  changes: string;
  previewImpact: string;
  rollbackInstructions: string;
  approve: string;
  reject: string;
  execute: string;
  rollback: string;
  processing: string;
  statusLabels: Record<string, string>;
  riskLabels: Record<string, string>;
};

type PlatformActionCardProps = {
  action: PlatformAction;
  locale: string;
  labels: PlatformActionCardLabels;
  showActions?: boolean;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  onExecute?: (id: string) => Promise<void>;
  onRollback?: (id: string) => Promise<void>;
};

export default function PlatformActionCard({
  action,
  locale,
  labels,
  showActions = false,
  onApprove,
  onReject,
  onExecute,
  onRollback,
}: PlatformActionCardProps) {
  const [busy, setBusy] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  async function run(fn?: (id: string) => Promise<void>) {
    if (!fn) return;
    setBusy(true);
    try {
      await fn(action.id);
    } finally {
      setBusy(false);
    }
  }

  const canApprove = action.status === "pending_approval" && action.risk_level !== "critical";
  const canExecute =
    action.status === "approved" ||
    (action.status === "pending_approval" && action.risk_level === "low");
  const canRollback =
    action.rollback_available &&
    ["success", "partial_success", "failed", "verification_pending"].includes(action.status);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{action.title}</h2>
          <p className="mt-1 text-sm text-gray-600">{action.reason_generated}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${getActionRiskStyle(action.risk_level)}`}
          >
            {labels.riskLabels[action.risk_level] ?? action.risk_level}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getActionStatusStyle(action.status)}`}
          >
            {labels.statusLabels[action.status] ?? action.status}
          </span>
        </div>
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {labels.recommendedBy}
          </dt>
          <dd className="text-gray-800">{action.recommended_by}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {labels.environment}
          </dt>
          <dd className="text-gray-800">{action.environment_type}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {labels.customer}
          </dt>
          <dd className="text-gray-800">{action.customer_name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {labels.estimatedTime}
          </dt>
          <dd className="text-gray-800">{formatExecutionTime(action.estimated_execution_ms)}</dd>
        </div>
      </dl>

      {action.prepared_steps.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {labels.preparedSteps}
          </p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-sm text-gray-700">
            {action.prepared_steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {action.expected_outcome && (
        <p className="mt-3 text-sm text-gray-700">
          <span className="font-semibold">{labels.expectedOutcome}:</span> {action.expected_outcome}
        </p>
      )}

      {action.expected_impact && (
        <p className="mt-1 text-sm text-gray-600">
          <span className="font-semibold">{labels.previewImpact}:</span> {action.expected_impact}
        </p>
      )}

      <p className="mt-2 text-xs text-gray-500">
        {labels.rollbackAvailable}:{" "}
        {action.rollback_available ? labels.rollbackYes : labels.rollbackNo}
      </p>

      {action.preview_changes.length > 0 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setPreviewOpen((v) => !v)}
            className="text-xs font-semibold text-violet-600 hover:text-violet-800"
          >
            {labels.whatWillChange} {previewOpen ? "−" : "+"}
          </button>
          {previewOpen && (
            <div className="mt-2 rounded-xl border border-violet-100 bg-violet-50/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                {labels.changes}
              </p>
              <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-gray-800">
                {action.preview_changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
              {action.rollback_instructions && (
                <p className="mt-3 text-xs text-gray-600">
                  <span className="font-semibold">{labels.rollbackInstructions}:</span>{" "}
                  {action.rollback_instructions}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {action.executed_at && (
        <p className="mt-3 text-xs text-gray-500">
          {formatDateTime(action.executed_at, locale)}
          {action.execution_duration_ms != null &&
            ` · ${formatExecutionTime(action.execution_duration_ms)}`}
        </p>
      )}

      {showActions && (
        <div className="mt-4 flex flex-wrap gap-2">
          {canApprove && onApprove && (
            <button
              type="button"
              disabled={busy}
              onClick={() => run(onApprove)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {busy ? labels.processing : labels.approve}
            </button>
          )}
          {canApprove && onReject && (
            <button
              type="button"
              disabled={busy}
              onClick={() => run(onReject)}
              className="rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-300 disabled:opacity-50"
            >
              {labels.reject}
            </button>
          )}
          {canExecute && onExecute && action.risk_level !== "critical" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => run(onExecute)}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {busy ? labels.processing : labels.execute}
            </button>
          )}
          {canRollback && onRollback && (
            <button
              type="button"
              disabled={busy}
              onClick={() => run(onRollback)}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
            >
              {labels.rollback}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
