"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseScenarioComparison,
  parseSimulationLabDashboard,
  parseSimulationRunResult,
  type CompanionExample,
  type ScenarioComparison,
  type SimulationExampleCategory,
  type SimulationLabDashboard,
  type SimulationObjective,
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

  const engagement = dashboard.engagement_summary;

  return (
    <div className="space-y-6">
      {(dashboard.integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.integration_links?.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label ?? link.route}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.engineTitle}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.mission}</p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-teal-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-teal-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.implementation_blueprint?.engine_phase ? (
          <p className="mt-1 text-xs text-teal-700">
            {dashboard.implementation_blueprint.phase ?? labels.blueprintPhase}
            {dashboard.implementation_blueprint.engine_phase ? ` · ${dashboard.implementation_blueprint.engine_phase}` : ""}
          </p>
        ) : null}
      </section>

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.scenariosTotal}: {engagement.scenarios_total ?? 0}</span>
            <span>{labels.scenariosReady}: {engagement.scenarios_ready ?? 0}</span>
            <span>{labels.simulationRuns}: {engagement.simulation_runs_total ?? 0}</span>
            <span>{labels.runsLast30d}: {engagement.simulation_runs_last_30d ?? 0}</span>
            <span>{labels.comparisonsTotal}: {engagement.comparisons_total ?? 0}</span>
            <span>{labels.categoriesUsed}: {engagement.categories_used ?? 0}</span>
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.productionIsolation}</h2>
        <p className="mt-2 text-sm text-gray-700">{labels.isolationNote}</p>
      </section>

      {dashboard.simulation_objectives && dashboard.simulation_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.simulationObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.simulation_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.simulation_examples?.categories && dashboard.simulation_examples.categories.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.simulationExamples}</h3>
          {dashboard.simulation_examples.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.simulation_examples.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.simulation_examples.categories.map((category) => (
              <ExampleCategoryCard key={category.domain ?? category.label} category={category} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.decision_comparison_framework?.principle ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.decisionComparisonFramework}</h3>
          <p className="mt-2">{dashboard.decision_comparison_framework.principle}</p>
          {dashboard.decision_comparison_framework.comparison_dimensions &&
          dashboard.decision_comparison_framework.comparison_dimensions.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.decision_comparison_framework.comparison_dimensions.map((dim) => (
                <li key={dim}>{dim}</li>
              ))}
            </ul>
          ) : null}
          {dashboard.decision_comparison_framework.boundary ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.decision_comparison_framework.boundary}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_examples && dashboard.companion_examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionExamples}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.companion_examples.map((example) => (
              <CompanionExampleCard key={example.key ?? example.scenario} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {Array.isArray(dashboard.success_criteria) && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
          {dashboard.self_love_connection.self_love_route ? (
            <Link href={dashboard.self_love_connection.self_love_route} className="mt-2 inline-block text-xs underline">
              {labels.openSelfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.trust_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.dogfooding?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.dogfooding}</h3>
          <p className="mt-2 text-gray-600">{dashboard.dogfooding.principle}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.dogfooding.aipify_group ? (
              <DogfoodingCard entry={dashboard.dogfooding.aipify_group} title={labels.aipifyGroup} />
            ) : null}
            {dashboard.dogfooding.unonight ? (
              <DogfoodingCard entry={dashboard.dogfooding.unonight} title={labels.unonightPilot} />
            ) : null}
          </div>
        </section>
      ) : null}

      {(dashboard.vision_phrases ?? []).length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4 text-sm text-teal-900">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {dashboard.vision_phrases?.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

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

      <p className="text-xs text-gray-500">{dashboard.safety_note ?? labels.safetyNote}</p>
    </div>
  );
}

function ObjectiveCard({ objective }: { objective: SimulationObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-sm">
      <p className="font-medium text-gray-900">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function ExampleCategoryCard({ category }: { category: SimulationExampleCategory }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-sm">
      <p className="font-medium capitalize text-gray-900">{category.label ?? category.domain}</p>
      {category.examples && category.examples.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
          {category.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function CompanionExampleCard({ example }: { example: CompanionExample }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">
        {example.emoji ? `${example.emoji} ` : ""}
        {example.scenario}
      </p>
      {example.example ? <p className="mt-1 text-xs text-gray-600">{example.example}</p> : null}
    </div>
  );
}

function DogfoodingCard({ entry, title }: { entry: { role?: string; focus?: string[] }; title: string }) {
  return (
    <div className="rounded border border-gray-100 bg-gray-50/50 p-3 text-xs">
      <p className="font-semibold text-gray-900">{title}</p>
      {entry.role ? <p className="mt-1 text-gray-600">{entry.role}</p> : null}
      {entry.focus && entry.focus.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-0.5 text-gray-600">
          {entry.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
