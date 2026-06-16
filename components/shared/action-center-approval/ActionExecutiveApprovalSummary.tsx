"use client";

import type { ApprovalDelegationLabels, ExecutiveSummary } from "@/lib/action-center-approval";

type ActionExecutiveApprovalSummaryProps = {
  summary: ExecutiveSummary;
  labels: ApprovalDelegationLabels;
};

export function ActionExecutiveApprovalSummary({
  summary,
  labels,
}: ActionExecutiveApprovalSummaryProps) {
  return (
    <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
      <h2 className="font-semibold text-indigo-950">{labels.sections.executive}</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-sm">
        <div>
          <dt className="text-indigo-800">{labels.executive.healthScore}</dt>
          <dd className="text-2xl font-semibold tabular-nums text-indigo-950">{summary.approval_health_score}</dd>
        </div>
        <div>
          <dt className="text-indigo-800">{labels.executive.criticalBlocked}</dt>
          <dd className="text-2xl font-semibold text-indigo-950">{summary.critical_blocked}</dd>
        </div>
        <div>
          <dt className="text-indigo-800">{labels.executive.highRiskAwaiting}</dt>
          <dd className="text-2xl font-semibold text-indigo-950">{summary.high_risk_awaiting}</dd>
        </div>
        <div>
          <dt className="text-indigo-800">{labels.executive.avgCycle}</dt>
          <dd className="text-2xl font-semibold text-indigo-950">{summary.avg_cycle_hours}h</dd>
        </div>
        <div>
          <dt className="text-indigo-800">{labels.executive.delegationEffectiveness}</dt>
          <dd className="text-2xl font-semibold text-indigo-950">{summary.delegation_events_30d}</dd>
        </div>
      </dl>
    </section>
  );
}
