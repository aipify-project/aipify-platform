"use client";

import type { ExecutiveExecutionSummary, ExecutionCoordinationLabels } from "@/lib/action-center-execution";

type Props = {
  summary: ExecutiveExecutionSummary;
  labels: ExecutionCoordinationLabels;
};

export function ActionExecutiveExecutionSummary({ summary, labels }: Props) {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
      <h2 className="font-semibold text-emerald-950">{labels.sections.executive}</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-sm">
        <div>
          <dt className="text-emerald-800">{labels.executive.healthScore}</dt>
          <dd className="text-2xl font-semibold tabular-nums">{summary.execution_health_score}</dd>
        </div>
        <div>
          <dt className="text-emerald-800">{labels.executive.completionRate}</dt>
          <dd className="text-2xl font-semibold">{summary.completion_rate}%</dd>
        </div>
        <div>
          <dt className="text-emerald-800">{labels.executive.blocked}</dt>
          <dd className="text-2xl font-semibold">{summary.blocked_count}</dd>
        </div>
        <div>
          <dt className="text-emerald-800">{labels.executive.overdue}</dt>
          <dd className="text-2xl font-semibold">{summary.overdue_count}</dd>
        </div>
        <div>
          <dt className="text-emerald-800">{labels.executive.strategicProgress}</dt>
          <dd className="text-2xl font-semibold">{summary.strategic_in_progress}</dd>
        </div>
      </dl>
    </section>
  );
}
