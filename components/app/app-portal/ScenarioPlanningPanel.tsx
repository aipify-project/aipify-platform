"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ORGANIZATIONAL_AREAS,
  PLANNING_STATUSES,
  SCENARIO_CATEGORIES,
  SCENARIO_TIME_HORIZONS,
  SCENARIO_TYPES,
  parseScenarioOverview,
  parseScenarioTimeline,
  type ScenarioCard,
  type ScenarioOverview,
  type ScenarioPlanningLabels,
  type ScenarioTimelineEvent,
} from "@/lib/app-portal/scenario-planning";

type Props = { labels: ScenarioPlanningLabels };

export function ScenarioPlanningPanel({ labels }: Props) {
  const [data, setData] = useState<ScenarioOverview | null>(null);
  const [timeline, setTimeline] = useState<ScenarioTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [scenarioType, setScenarioType] = useState("");
  const [planningStatus, setPlanningStatus] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [organizationalArea, setOrganizationalArea] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (scenarioType) params.set("scenario_type", scenarioType);
    if (planningStatus) params.set("planning_status", planningStatus);
    if (timeHorizon) params.set("time_horizon", timeHorizon);
    if (organizationalArea) params.set("organizational_area", organizationalArea);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());

    const timelineParams = new URLSearchParams();
    if (periodFrom) timelineParams.set("period_from", periodFrom);

    const [dashRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/scenario-planning?${params}`),
      fetch(`/api/aipify/scenario-planning/timeline?${timelineParams}`),
    ]);

    if (dashRes.ok) {
      setData(parseScenarioOverview(await dashRes.json()));
    } else {
      const body = (await dashRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { events?: unknown };
      setTimeline(parseScenarioTimeline(body));
    }
    setLoading(false);
  }, [category, scenarioType, planningStatus, timeHorizon, organizationalArea, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function initializeScenarios() {
    setBusy(true);
    setActionMessage("");
    const res = await fetch("/api/aipify/scenario-planning/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "initialize" }),
    });
    setBusy(false);
    if (res.ok) {
      setActionMessage(labels.initialize.success);
      void load();
    }
  }

  async function compareCoreScenarios() {
    if (!data?.scenarios?.length) return;
    const ids = data.scenarios
      .filter((s) => ["best_case", "expected", "challenging"].includes(s.scenario_type))
      .slice(0, 3)
      .map((s) => s.id);
    if (ids.length < 2) return;
    setBusy(true);
    const res = await fetch("/api/aipify/scenario-planning/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "compare", scenario_ids: ids }),
    });
    setBusy(false);
    if (res.ok) void load();
  }

  if (loading && !data && !error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error && !data?.found) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <p className="text-slate-600">{labels.accessDenied}</p>
      </div>
    );
  }

  const empty = !data?.has_scenario_data;
  const canSimulate = data?.can_simulate === true;
  const canCompare = data?.can_compare === true;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
        {data?.simulation_isolation_note ? (
          <p className="mt-3 text-sm text-slate-600">{labels.isolationNote}</p>
        ) : null}
        {data?.simulation_lab_route ? (
          <Link href={data.simulation_lab_route} className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:underline">
            {labels.simulationLabLink} →
          </Link>
        ) : null}
      </div>

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          {canSimulate ? (
            <button type="button" disabled={busy} onClick={() => void initializeScenarios()} className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{labels.emptyCta}</button>
          ) : null}
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.planningSummary}</p>
            <p className="mt-2 text-sm text-slate-700">{data?.planning_summary}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveSummary}</p>
            <p className="mt-2 text-sm text-slate-700">{data?.executive_summary}</p>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <InsightBlock title={labels.dashboard.strategicPriorities} items={data?.strategic_priorities ?? []} />
            <InsightBlock title={labels.dashboard.riskScenarios} items={data?.risk_scenarios ?? []} />
          </section>
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {SCENARIO_CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
        </select>
        <select value={scenarioType} onChange={(e) => setScenarioType(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.scenarioType}</option>
          {SCENARIO_TYPES.map((t) => <option key={t} value={t}>{labels.scenarioTypes[t]}</option>)}
        </select>
        <select value={planningStatus} onChange={(e) => setPlanningStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.planningStatus}</option>
          {PLANNING_STATUSES.map((s) => <option key={s} value={s}>{labels.planningStatuses[s]}</option>)}
        </select>
        <select value={timeHorizon} onChange={(e) => setTimeHorizon(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.timeHorizon}</option>
          {SCENARIO_TIME_HORIZONS.map((h) => <option key={h} value={h}>{labels.timeHorizons[h]}</option>)}
        </select>
        <select value={organizationalArea} onChange={(e) => setOrganizationalArea(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.organizationalArea}</option>
          {ORGANIZATIONAL_AREAS.map((a) => <option key={a} value={a}>{a.replace(/_/g, " ")}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.timePeriod} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.scenarios?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.scenarios}</h2>
            {canCompare ? (
              <button type="button" disabled={busy} onClick={() => void compareCoreScenarios()} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800 disabled:opacity-60">
                {labels.dashboard.compareScenarios}
              </button>
            ) : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.scenarios!.map((scenario) => (
              <ScenarioCardView key={scenario.id} scenario={scenario} labels={labels} canSimulate={canSimulate} onSimulated={() => void load()} />
            ))}
          </div>
        </section>
      ) : null}

      {!empty && (data?.comparisons?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.comparisons}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data!.comparisons!.map((c) => (
              <li key={c.id}><span className="font-medium">{c.title}</span> — {c.comparison_summary}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && timeline.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.timeline}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {timeline.map((e) => (
              <li key={e.id}>{labels.timelineEvents[e.event_type as keyof typeof labels.timelineEvents] ?? e.description}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.recommendations}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {data!.recommendations!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {actionMessage ? <p className="text-sm text-emerald-700">{actionMessage}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.executesActions}</dt><dd className="mt-1 text-slate-600">{labels.faq.executesActionsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whoCanAccess}</dt><dd className="mt-1 text-slate-600">{labels.faq.whoCanAccessAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function InsightBlock({ title, items }: { title: string; items: { id: string; title: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-600">
        {items.map((item) => <li key={item.id}>{item.title}</li>)}
      </ul>
    </div>
  );
}

function ScenarioCardView({
  scenario,
  labels,
  canSimulate,
  onSimulated,
}: {
  scenario: ScenarioCard;
  labels: ScenarioPlanningLabels;
  canSimulate: boolean;
  onSimulated: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function runSimulation() {
    setBusy(true);
    const res = await fetch("/api/aipify/scenario-planning/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "simulate", scenario_id: scenario.id }),
    });
    setBusy(false);
    if (res.ok) onSimulated();
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">{scenario.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{scenario.summary}</p>
      <dl className="mt-3 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.card.category}: </dt><dd className="inline">{labels.categories[scenario.category as keyof typeof labels.categories] ?? scenario.category}</dd></div>
        <div><dt className="inline">{labels.card.scenarioType}: </dt><dd className="inline">{labels.scenarioTypes[scenario.scenario_type as keyof typeof labels.scenarioTypes] ?? scenario.scenario_type}</dd></div>
        <div><dt className="inline">{labels.card.planningStatus}: </dt><dd className="inline">{labels.planningStatuses[scenario.planning_status as keyof typeof labels.planningStatuses] ?? scenario.planning_status}</dd></div>
        <div><dt className="inline">{labels.card.timeHorizon}: </dt><dd className="inline">{labels.timeHorizons[scenario.time_horizon as keyof typeof labels.timeHorizons] ?? scenario.time_horizon}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={`/app/intelligence/scenario-planning/${scenario.id}`} className="text-sm font-medium text-indigo-700 hover:underline">
          {labels.dashboard.viewScenario}
        </Link>
        {canSimulate ? (
          <button type="button" disabled={busy} onClick={() => void runSimulation()} className="text-sm font-medium text-indigo-700 hover:underline disabled:opacity-60">
            {labels.dashboard.runSimulation}
          </button>
        ) : null}
      </div>
    </article>
  );
}
