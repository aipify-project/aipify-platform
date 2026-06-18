"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseSimulationRunDetail, type SimulationRunDetail } from "@/lib/aipify/simulation-lab";

type SimulationRunDetailPanelProps = {
  runId: string;
  labels: Record<string, string>;
};

export function SimulationRunDetailPanel({ runId, labels }: SimulationRunDetailPanelProps) {
  const [detail, setDetail] = useState<SimulationRunDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/simulations/runs/${runId}`);
    if (res.ok) setDetail(parseSimulationRunDetail(await res.json()));
    setLoading(false);
  }, [runId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!detail) return <div className="text-sm text-gray-600">{labels.notFound}</div>;

  const { run } = detail;

  return (
    <div className="space-y-6">
      <Link href="/app/simulations" className="text-sm text-teal-800 hover:underline">
        ← {labels.back}
      </Link>

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h1 className="text-xl font-bold text-gray-900">{labels.runResults}</h1>
        <p className="mt-2 text-sm text-teal-800">{labels.productionIsolated}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <p className="text-sm">{labels.confidence}: <span className="capitalize">{run.confidence_level}</span> ({run.confidence_score}%)</p>
          <p className="text-sm">{labels.estimatedValue}: {run.estimated_value}</p>
          <p className="text-sm">{labels.estimatedRisk}: {run.estimated_risk}</p>
          <p className="text-sm">{labels.timeSaved}: {run.estimated_time_saved}h</p>
          <p className="text-sm">{labels.workloadChange}: {run.estimated_workload_change}%</p>
          <p className="text-sm">{labels.governanceImpact}: {run.governance_impact_score}</p>
        </div>
        {run.explanation_id ? (
          <Link href={`/app/trust/explanations/${run.explanation_id}`} className="mt-4 inline-block text-sm font-medium text-teal-800 hover:underline">
            {labels.viewExplanation}
          </Link>
        ) : null}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.outcomes}</h2>
        <ul className="mt-3 space-y-2">
          {detail.outcomes.map((o, i) => (
            <li key={i} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium capitalize">{o.outcome_type.replace(/_/g, " ")}</p>
              <p className="mt-1 text-gray-600">{o.description}</p>
              <p className="mt-1 text-xs text-gray-500">{labels.impactScore}: {o.impact_score}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.assumptions}</h2>
        <ul className="mt-3 space-y-2">
          {detail.assumptions.map((a, i) => (
            <li key={i} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p>{a.assumption}</p>
              <p className="mt-1 text-xs text-gray-500">{a.source} · {a.confidence}%</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
