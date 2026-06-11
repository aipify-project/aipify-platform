"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseScenarioComparison,
  parseSimulationLabDashboard,
  parseSimulationRunResult,
  type ScenarioComparison,
  type SimulationLabDashboard,
  type SimulationScenario,
} from "@/lib/aipify/simulation-lab";

type SimulationLabDashboardPanelProps = {
  labels: Record<string, string>;
};

function confidenceClass(level: string) {
  switch (level) {
    case "high":
      return "bg-emerald-100 text-emerald-800";
    case "low":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-teal-100 text-teal-800";
  }
}

export function SimulationLabDashboardPanel({ labels }: SimulationLabDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<SimulationLabDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [comparison, setComparison] = useState<ScenarioComparison | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/simulations/dashboard");
    if (res.ok) setDashboard(parseSimulationLabDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const runSimulation = async (scenarioId: string) => {
    setRunning(scenarioId);
    const res = await fetch(`/api/aipify/simulations/scenarios/${scenarioId}/run`, { method: "POST" });
    if (res.ok) {
      const result = parseSimulationRunResult(await res.json());
      if (result?.run_id) {
        window.location.href = `/app/simulations/runs/${result.run_id}`;
        return;
      }
    }
    setRunning(null);
    await load();
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(0, 3)));
  };

  const compareSelected = async () => {
    if (selected.length < 2) return;
    const res = await fetch("/api/aipify/simulations/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario_ids: selected }),
    });
    if (res.ok) setComparison(parseScenarioComparison(await res.json()));
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.productionIsolation}</h2>
        <p className="mt-2 text-sm text-gray-700">{labels.isolationNote}</p>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-900">{labels.scenariosSection}</h2>
          {selected.length >= 2 ? (
            <button
              type="button"
              onClick={() => void compareSelected()}
              className="rounded-lg bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800"
            >
              {labels.compareSelected} ({selected.length})
            </button>
          ) : null}
        </div>
        <ul className="mt-3 space-y-2">
          {dashboard.scenarios.map((scenario: SimulationScenario) => (
            <li key={scenario.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(scenario.id)}
                    onChange={() => toggleSelect(scenario.id)}
                    className="mt-1"
                    aria-label={`Select ${scenario.title}`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{scenario.title}</p>
                    <p className="mt-1 text-xs capitalize text-gray-500">{scenario.category.replace(/_/g, " ")}</p>
                    {scenario.latest_run ? (
                      <p className="mt-1 text-xs text-gray-600">
                        {labels.estimatedValue}: {scenario.latest_run.estimated_value ?? 0}
                        {" · "}
                        <span className={`rounded px-1.5 py-0.5 capitalize ${confidenceClass(scenario.latest_run.confidence_level)}`}>
                          {scenario.latest_run.confidence_level}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={running === scenario.id}
                  onClick={() => void runSimulation(scenario.id)}
                  className="rounded-lg border border-teal-300 px-3 py-1 text-sm font-medium text-teal-800 hover:bg-teal-50 disabled:opacity-50"
                >
                  {running === scenario.id ? labels.running : labels.runSimulation}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {comparison ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/40 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.comparisonResults}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {comparison.scenarios.map((s) => (
              <li key={s.scenario_id} className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <p className="font-medium">{s.title}</p>
                {s.latest_run ? (
                  <p className="mt-1 text-xs text-gray-600">
                    {labels.value}: {s.latest_run.estimated_value ?? "—"} · {labels.risk}: {s.latest_run.estimated_risk ?? "—"} · {labels.time}: {s.latest_run.estimated_time_saved ?? "—"}h
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">{labels.noRunYet}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recent_runs.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentRuns}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_runs.map((run) => (
              <li key={run.run_id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                <Link href={`/app/simulations/runs/${run.run_id}`} className="font-medium text-teal-800 hover:underline">
                  {run.scenario_title}
                </Link>
                <p className="mt-1 text-xs capitalize text-gray-500">
                  {run.category?.replace(/_/g, " ")} · {run.confidence_level} confidence
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.integrations ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.integrations}</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {Object.entries(dashboard.integrations).map(([key, value]) => (
              <li key={key}>
                <span className="capitalize">{key.replace(/_/g, " ")}</span>: {value}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
