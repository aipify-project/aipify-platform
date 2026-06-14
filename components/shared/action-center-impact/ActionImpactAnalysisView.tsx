"use client";

import type { ActionImpactAnalysis, ActionImpactLabels } from "@/lib/action-center-impact";
import type { AipifyAction } from "@/lib/aipify/execution";

type ActionImpactAnalysisViewProps = {
  analysis: ActionImpactAnalysis;
  action: AipifyAction;
  labels: ActionImpactLabels;
  statusLabels: Record<string, string>;
  riskLabels: Record<string, string>;
  actingId: string | null;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
  onExecute: () => void;
};

const RISK_STYLES: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  medium: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-orange-50 text-orange-900 ring-orange-200",
  critical: "bg-rose-50 text-rose-900 ring-rose-200",
};

const TIMELINE_DOT: Record<string, string> = {
  pending: "bg-gray-200 text-gray-500",
  current: "bg-indigo-600 text-white ring-4 ring-indigo-100",
  complete: "bg-emerald-500 text-white",
  blocked: "bg-rose-400 text-white",
};

export function ActionImpactAnalysisView({
  analysis,
  action,
  labels,
  statusLabels,
  riskLabels,
  actingId,
  onBack,
  onApprove,
  onReject,
  onExecute,
}: ActionImpactAnalysisViewProps) {
  const busy = actingId === action.id;
  const summary = analysis.summary;
  const business = analysis.business_impact;
  const risk = analysis.risk_analysis;
  const confidence = analysis.confidence;
  const rollback = analysis.rollback;
  const chain = analysis.approval_chain;
  const related = analysis.related_actions;
  const audit = analysis.audit_preview;

  const auditRecordLabel = (key: string): string => {
    if (key === "approval_event") return labels.auditPreview.approvalEvent;
    if (key === "execution_event") return labels.auditPreview.executionEvent;
    if (key === "outcome_event") return labels.auditPreview.outcomeEvent;
    if (key === "rollback_event") return labels.auditPreview.rollbackEvent;
    return key;
  };

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="text-sm font-medium text-indigo-600 hover:underline">
        ← {labels.actions.back}
      </button>

      {/* Action Summary */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
          {labels.sections.summary}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
          {summary?.title ?? action.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{action.description}</p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-gray-500">{labels.summary.status}</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">
              {statusLabels[action.status] ?? action.status}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">{labels.summary.recommendedBy}</dt>
            <dd className="mt-1 text-sm text-gray-900">{summary?.recommended_by}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">{labels.summary.priority}</dt>
            <dd className="mt-1 text-sm capitalize text-gray-900">
              {labels.priority[summary?.priority ?? "medium"] ?? summary?.priority}
            </dd>
          </div>
          {summary?.category ? (
            <div>
              <dt className="text-xs font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">{labels.categories[summary.category]}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business Impact */}
        {business ? (
          <section className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
            <h3 className="font-semibold text-emerald-950">{labels.sections.businessImpact}</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-emerald-900">{labels.businessImpact.expectedBenefits}</dt>
                <dd className="mt-1 text-emerald-950/90">{business.expected_benefits}</dd>
              </div>
              <div>
                <dt className="font-medium text-emerald-900">{labels.businessImpact.timeSavings}</dt>
                <dd className="mt-1 text-emerald-950/90">{business.estimated_time_savings}</dd>
              </div>
              <div>
                <dt className="font-medium text-emerald-900">{labels.businessImpact.affectedTeams}</dt>
                <dd className="mt-1 text-emerald-950/90">{business.affected_teams}</dd>
              </div>
              <div>
                <dt className="font-medium text-emerald-900">{labels.businessImpact.customerImpact}</dt>
                <dd className="mt-1 text-emerald-950/90">
                  {labels.customerImpact[business.customer_impact] ?? business.customer_impact}
                </dd>
              </div>
            </dl>
          </section>
        ) : null}

        {/* Risk Analysis */}
        {risk ? (
          <section className="rounded-2xl border border-amber-100 bg-amber-50/30 p-5">
            <h3 className="font-semibold text-amber-950">{labels.sections.riskAnalysis}</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-amber-900">{labels.riskAnalysis.riskLevel}</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${RISK_STYLES[risk.risk_level] ?? ""}`}
                  >
                    {riskLabels[risk.risk_level] ?? risk.risk_level}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-amber-900">{labels.riskAnalysis.sideEffects}</dt>
                <dd className="mt-1 text-amber-950/90">{risk.potential_side_effects}</dd>
              </div>
              <div>
                <dt className="font-medium text-amber-900">{labels.riskAnalysis.mitigation}</dt>
                <dd className="mt-1 text-amber-950/90">{risk.mitigation_strategy}</dd>
              </div>
            </dl>
          </section>
        ) : null}
      </div>

      {/* Confidence + Rollback */}
      <div className="grid gap-6 lg:grid-cols-2">
        {confidence ? (
          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
            <h3 className="font-semibold text-indigo-950">{labels.sections.confidence}</h3>
            <p className="mt-3 text-4xl font-semibold tabular-nums text-indigo-700">{confidence.score}%</p>
            <p className="mt-2 text-sm text-indigo-900/90">
              {labels.confidence.reasoning}:{" "}
              {confidence.reasoning_key === "historical_success"
                ? labels.confidence.historicalSuccess
                : labels.confidence.operatingConditions}
            </p>
          </section>
        ) : null}

        {rollback ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold text-gray-900">{labels.sections.rollback}</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-gray-500">{labels.rollback.available}</dt>
                <dd className="mt-1 text-gray-900">
                  {rollback.available ? labels.rollback.available : labels.rollback.notAvailable}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">{labels.rollback.recoveryTime}</dt>
                <dd className="mt-1 text-gray-900">{rollback.estimated_recovery_time}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">{labels.rollback.steps}</dt>
                <dd className="mt-1 text-gray-900">
                  {rollback.available ? rollback.steps : labels.rollback.manualRequired}
                </dd>
              </div>
            </dl>
          </section>
        ) : null}
      </div>

      {/* Affected Systems */}
      {(analysis.affected_systems?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-900">{labels.sections.affectedSystems}</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.affected_systems!.map((system) => (
              <span
                key={system}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800"
              >
                {system}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* Approval Chain + Audit Preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {chain ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold text-gray-900">{labels.sections.approvalChain}</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-gray-500">{labels.approvalChain.requestedBy}</dt>
                <dd className="mt-1 text-gray-900">{chain.requested_by}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">{labels.approvalChain.requiresApprovalFrom}</dt>
                <dd className="mt-1 text-gray-900">{chain.requires_approval_from}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">{labels.approvalChain.escalationPath}</dt>
                <dd className="mt-1 text-gray-900">{chain.escalation_path}</dd>
              </div>
            </dl>
          </section>
        ) : null}

        {audit ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold text-gray-900">{labels.sections.auditPreview}</h3>
            <p className="mt-2 text-sm text-gray-600">{labels.auditPreview.intro}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
              {audit.records.map((record) => (
                <li key={record} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
                  {auditRecordLabel(record)}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {/* Related Actions */}
      {related && related.similar_count > 0 ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h3 className="font-semibold text-violet-950">{labels.sections.relatedActions}</h3>
          <p className="mt-2 text-sm text-violet-900">
            {labels.relatedActions.similarExecuted.replace("{count}", String(related.similar_count))}
          </p>
          <p className="mt-1 text-sm text-violet-900">
            {labels.relatedActions.averageSuccess.replace(
              "{rate}",
              String(related.average_success_rate)
            )}
          </p>
        </section>
      ) : null}

      {/* Execution Timeline */}
      {(analysis.execution_timeline?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-900">{labels.sections.timeline}</h3>
          <ol className="mt-5 flex flex-wrap items-start justify-between gap-4">
            {analysis.execution_timeline!.map((stage, index) => (
              <li key={stage.key} className="flex min-w-[72px] flex-1 flex-col items-center text-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${TIMELINE_DOT[stage.status] ?? TIMELINE_DOT.pending}`}
                >
                  {index + 1}
                </div>
                <p className="mt-2 text-xs font-medium text-gray-800">{labels.timeline[stage.key]}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-500">
                  {labels.timelineStatus[stage.status]}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* Post-Execution Review */}
      {analysis.post_execution ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
          <h3 className="font-semibold text-emerald-950">{labels.sections.postExecution}</h3>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <dt className="font-medium text-emerald-900">{labels.postExecution.result}</dt>
              <dd className="mt-1 capitalize text-emerald-950">
                {analysis.post_execution.execution_result === "successful"
                  ? labels.postExecution.successful
                  : labels.postExecution.failed}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-emerald-900">{labels.postExecution.executionTime}</dt>
              <dd className="mt-1 text-emerald-950">
                {analysis.post_execution.execution_time_seconds}s
              </dd>
            </div>
            <div>
              <dt className="font-medium text-emerald-900">{labels.postExecution.unexpectedEvents}</dt>
              <dd className="mt-1 text-emerald-950">
                {analysis.post_execution.unexpected_events === "None"
                  ? labels.postExecution.none
                  : analysis.post_execution.unexpected_events}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-emerald-900">{labels.postExecution.businessOutcome}</dt>
              <dd className="mt-1 capitalize text-emerald-950">
                {analysis.post_execution.business_outcome === "positive"
                  ? labels.postExecution.positive
                  : labels.postExecution.reviewRequired}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        {action.status === "pending_approval" ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={onApprove}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {labels.actions.approve}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onReject}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
            >
              {labels.actions.reject}
            </button>
          </>
        ) : null}
        {action.status === "approved" ? (
          <button
            type="button"
            disabled={busy}
            onClick={onExecute}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {labels.actions.execute}
          </button>
        ) : null}
      </div>

      {analysis.principle ? (
        <p className="text-xs text-gray-500">{analysis.principle}</p>
      ) : null}
    </div>
  );
}
