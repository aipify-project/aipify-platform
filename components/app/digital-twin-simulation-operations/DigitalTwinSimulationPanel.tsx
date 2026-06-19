"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  DIGITAL_TWIN_SIMULATION_TABS,
  EXPERIMENT_STATUS_BADGES,
  IMPACT_DIRECTION_BADGES,
  IMPACT_MAGNITUDE_BADGES,
  SCENARIO_STATUS_BADGES,
  parseDigitalTwinSimulationCenter,
  type DigitalTwinSimulationCenter,
  type DigitalTwinSimulationLabels,
  type DigitalTwinSimulationTab,
} from "@/lib/customer-digital-twin-simulation-operations";

type Props = {
  labels: DigitalTwinSimulationLabels;
  backHref: string;
  initialTab?: DigitalTwinSimulationTab;
  whatIfMode?: boolean;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemList({ items, labels }: { items: Record<string, unknown>[]; labels: DigitalTwinSimulationLabels }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={String(
            item.model_key ?? item.scenario_key ?? item.forecast_key ?? item.impact_key
              ?? item.experiment_key ?? item.capacity_key ?? item.allocation_key
              ?? item.preview_key ?? item.pack_key ?? i
          )}
          className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm"
        >
          <p className="font-medium text-zinc-900">
            {String(
              item.model_title ?? item.scenario_title ?? item.forecast_title ?? item.impact_title
                ?? item.experiment_title ?? item.capacity_title ?? item.allocation_title
                ?? item.decision_title ?? item.pack_title ?? item.title ?? i
            )}
          </p>
          {item.summary ? <p className="mt-1 text-zinc-600">{String(item.summary)}</p> : null}
          {item.projection_summary ? <p className="mt-1 text-indigo-700">{String(item.projection_summary)}</p> : null}
          {item.recommendation ? <p className="mt-1 text-emerald-700">{String(item.recommendation)}</p> : null}
          {item.expected_benefits ? <p className="mt-1 text-emerald-700"><span className="font-medium">Benefits:</span> {String(item.expected_benefits)}</p> : null}
          {item.expected_risks ? <p className="mt-1 text-red-700"><span className="font-medium">Risks:</span> {String(item.expected_risks)}</p> : null}
          {item.capacity_gap != null ? (
            <p className="mt-1 text-zinc-500">Gap: {String(item.capacity_gap)}% ({String(item.current_capacity)} → {String(item.projected_demand)})</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.scenario_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${SCENARIO_STATUS_BADGES[String(item.scenario_status)] ?? SCENARIO_STATUS_BADGES.draft}`}>
                {String(item.scenario_status)}
              </span>
            ) : null}
            {item.experiment_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${EXPERIMENT_STATUS_BADGES[String(item.experiment_status)] ?? EXPERIMENT_STATUS_BADGES.draft}`}>
                {String(item.experiment_status)}
              </span>
            ) : null}
            {item.impact_direction ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${IMPACT_DIRECTION_BADGES[String(item.impact_direction)] ?? IMPACT_DIRECTION_BADGES.neutral}`}>
                {labels.impactDirection[String(item.impact_direction) as keyof typeof labels.impactDirection] ?? String(item.impact_direction)}
              </span>
            ) : null}
            {item.impact_magnitude ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${IMPACT_MAGNITUDE_BADGES[String(item.impact_magnitude)] ?? IMPACT_MAGNITUDE_BADGES.moderate}`}>
                {labels.impactMagnitude[String(item.impact_magnitude) as keyof typeof labels.impactMagnitude] ?? String(item.impact_magnitude)}
              </span>
            ) : null}
            {item.confidence_score != null ? (
              <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{String(item.confidence_score)}%</span>
            ) : null}
            {item.scenario_type ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{String(item.scenario_type)}</span>
            ) : null}
            {item.model_type ? (
              <span className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700">{String(item.model_type)}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DigitalTwinSimulationPanel({ labels, backHref, initialTab = "overview", whatIfMode = false }: Props) {
  const [center, setCenter] = useState<DigitalTwinSimulationCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<DigitalTwinSimulationTab>(whatIfMode ? "experiments" : initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/digital-twin-simulation-operations");
    if (res.ok) setCenter(parseDigitalTwinSimulationCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/digital-twin-simulation-operations/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, ...payload }),
      });
      if (res.ok) await load();
    } finally { setBusy(false); }
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;

  const overview = center.overview ?? {};
  const executive = center.executive_dashboard ?? {};
  const companion = center.companion ?? {};
  const advisorPrompts = (companion.simulation_advisor_prompts as string[]) ?? [];
  const recommendations = center.recommendations ?? (executive.companion_recommendations as Record<string, unknown>[]) ?? [];
  const whatIfExperiments = (center.experiments ?? []).filter((e) => e.experiment_type === "what_if");

  if (whatIfMode) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 p-6">
        <div>
          <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.whatIfTitle}</h1>
          <p className="mt-2 max-w-3xl text-zinc-600">{labels.whatIfSubtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={busy} onClick={() => void runAction("run_what_if")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            {labels.actions.runWhatIf}
          </button>
        </div>
        <ItemList items={whatIfExperiments.length ? whatIfExperiments : center.experiments ?? []} labels={labels} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_twin")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshTwin}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_simulation_briefing")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.generateSimulationBriefing}
        </button>
        <Link href="/app/digital-twin-center/what-if"
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-100">
          {labels.whatIfTitle}
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {DIGITAL_TWIN_SIMULATION_TABS.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="space-y-8">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard label={labels.overview.totalModels} value={Number(overview.total_models ?? 0)} />
            <OverviewCard label={labels.overview.activeScenarios} value={Number(overview.active_scenarios ?? 0)} />
            <OverviewCard label={labels.overview.forecasts} value={Number(overview.forecasts ?? 0)} />
            <OverviewCard label={labels.overview.impactAnalyses} value={Number(overview.impact_analyses ?? 0)} />
            <OverviewCard label={labels.overview.experiments} value={Number(overview.experiments ?? 0)} />
            <OverviewCard label={labels.overview.capacityModels} value={Number(overview.capacity_models ?? 0)} />
            <OverviewCard label={labels.overview.decisionPreviews} value={Number(overview.decision_previews ?? 0)} />
            <OverviewCard label={labels.overview.avgConfidence} value={Number(overview.avg_confidence ?? 0)} />
          </dl>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.capacityModeling}</h2>
            <div className="mt-4"><ItemList items={center.capacity ?? []} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.decisionPreviews}</h2>
            <div className="mt-4"><ItemList items={center.decision_previews ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "models" ? (
        <section className="space-y-6">
          <ItemList items={center.models ?? []} labels={labels} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.businessPacks}</h2>
            <div className="mt-4"><ItemList items={center.business_packs ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "scenarios" ? (
        <section className="space-y-4">
          <ItemList items={center.scenarios ?? []} labels={labels} />
          {(center.scenarios ?? []).filter((s) => s.scenario_status === "ready").map((scenario) => (
            <button key={String(scenario.scenario_key)} type="button" disabled={busy}
              onClick={() => void runAction("execute_simulation", { scenario_key: scenario.scenario_key })}
              className="mr-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
              {labels.actions.executeSimulation}
            </button>
          ))}
        </section>
      ) : null}

      {tab === "forecasts" ? (
        <section><ItemList items={center.forecasts ?? []} labels={labels} /></section>
      ) : null}

      {tab === "impacts" ? (
        <section><ItemList items={center.impacts ?? []} labels={labels} /></section>
      ) : null}

      {tab === "experiments" ? (
        <section className="space-y-4">
          <ItemList items={center.experiments ?? []} labels={labels} />
          <Link href="/app/digital-twin-center/what-if" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            {labels.whatIfTitle} →
          </Link>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.executiveDashboard}</h2>
            <div className="mt-4"><ItemList items={recommendations} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.resourceAllocation}</h2>
            <div className="mt-4"><ItemList items={center.allocations ?? []} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.companionAdvisor}</h2>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              {advisorPrompts.map((prompt) => <li key={prompt}>· {prompt}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              {(center.audit_recent ?? []).map((entry, i) => (
                <li key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <span className="font-medium text-zinc-900">{entry.event_type}</span>
                  {entry.summary ? ` — ${entry.summary}` : ""}
                </li>
              ))}
            </ul>
          </div>
          <button type="button" disabled={busy} onClick={() => void runAction("generate_decision_preview")}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
            {labels.actions.generateDecisionPreview}
          </button>
        </section>
      ) : null}
    </div>
  );
}
