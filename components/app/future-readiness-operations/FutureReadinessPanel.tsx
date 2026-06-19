"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  FUTURE_READINESS_TABS,
  INITIATIVE_STATUS_BADGES,
  READINESS_LABEL_BADGES,
  THREAT_LEVEL_BADGES,
  parseFutureReadinessCenter,
  type FutureReadinessCenter,
  type FutureReadinessLabels,
  type FutureReadinessTab,
  type StrategicInitiative,
} from "@/lib/customer-future-readiness-operations";

type Props = {
  labels: FutureReadinessLabels;
  backHref: string;
  initialTab?: FutureReadinessTab;
  visibleTabs?: FutureReadinessTab[];
  titleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function JsonList({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-900">
            {String(
              item.plan_title ?? item.initiative_name ?? item.scenario_title ?? item.roadmap_title
                ?? item.opportunity_title ?? item.threat_title ?? item.innovation_title
                ?? item.transformation_title ?? item.dimension ?? i
            )}
          </p>
          {(item.summary ?? item.vision ?? item.expected_outcome ?? item.forecast_summary) ? (
            <p className="mt-1 text-zinc-600">
              {String(item.summary ?? item.vision ?? item.expected_outcome ?? item.forecast_summary)}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.strategic_horizon ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{String(item.strategic_horizon).replace(/_/g, " ")}</span>
            ) : null}
            {item.initiative_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${INITIATIVE_STATUS_BADGES[String(item.initiative_status)] ?? INITIATIVE_STATUS_BADGES.active}`}>
                {String(item.initiative_status)}
              </span>
            ) : null}
            {item.priority ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{String(item.priority)}</span>
            ) : null}
            {item.threat_level ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${THREAT_LEVEL_BADGES[String(item.threat_level)] ?? THREAT_LEVEL_BADGES.moderate}`}>
                {String(item.threat_level)}
              </span>
            ) : null}
            {item.readiness_label ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${READINESS_LABEL_BADGES[String(item.readiness_label)] ?? READINESS_LABEL_BADGES.prepared}`}>
                {String(item.readiness_label).replace(/_/g, " ")}
              </span>
            ) : null}
            {item.score_value != null ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{String(item.score_value)}</span>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
}

function InitiativeCard({ item, labels }: { item: StrategicInitiative; labels: FutureReadinessLabels }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.initiative_name}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">
        {item.owner_name} · {item.initiative_status} · {item.priority}
        {item.budget_estimate != null ? ` · ${item.budget_estimate}` : ""}
      </p>
    </div>
  );
}

export function FutureReadinessPanel({ labels, backHref, initialTab = "overview", visibleTabs, titleOverride }: Props) {
  const tabs = visibleTabs ?? FUTURE_READINESS_TABS;
  const [center, setCenter] = useState<FutureReadinessCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FutureReadinessTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/future-readiness-operations");
    if (res.ok) setCenter(parseFutureReadinessCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/future-readiness-operations/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
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
  const advisorPrompts = (center.integrations?.strategic_advisor_prompts as string[]) ?? [];
  const horizons = (center.reports?.strategic_horizons as Record<string, unknown>[]) ?? [];
  const recommendations = (center.reports?.companion_recommendations as Record<string, unknown>[]) ?? [];
  const innovations = (center.reports?.innovation_pipeline as Record<string, unknown>[]) ?? [];
  const transformations = (center.reports?.transformations as Record<string, unknown>[]) ?? [];
  const scores = center.readiness_scores ?? (center.reports?.readiness_scores as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_readiness")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshReadiness}
        </button>
        <Link href="/app/future-readiness/planning" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openPlanning}</Link>
        <Link href="/app/future-readiness/roadmaps" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openRoadmaps}</Link>
        <Link href="/app/federation" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openFederation}</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.futureReadinessScore} value={Number(overview.future_readiness_score ?? 0)} />
          <OverviewCard label={labels.overview.activeInitiatives} value={Number(overview.active_initiatives ?? 0)} />
          <OverviewCard label={labels.overview.delayedInitiatives} value={Number(overview.delayed_initiatives ?? 0)} />
          <OverviewCard label={labels.overview.activeScenarios} value={Number(overview.active_scenarios ?? 0)} />
          <OverviewCard label={labels.overview.trackedOpportunities} value={Number(overview.tracked_opportunities ?? 0)} />
          <OverviewCard label={labels.overview.escalatedThreats} value={Number(overview.escalated_threats ?? 0)} />
          <OverviewCard label={labels.overview.activeRoadmaps} value={Number(overview.active_roadmaps ?? 0)} />
        </dl>
      ) : null}

      {tab === "planning" ? (
        <section className="space-y-6">
          <JsonList items={center.planning ?? []} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.strategicHorizons}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {horizons.map((h) => (
                <div key={String(h.key)} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm">
                  <p className="font-medium text-zinc-900">{String(h.label)}</p>
                  <p className="mt-1 text-zinc-500">{String(h.range)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {tab === "scenarios" ? (
        <section className="space-y-3">
          {(center.scenarios ?? []).map((item) => (
            <div key={String(item.scenario_key)} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <JsonList items={[item]} />
              {item.scenario_status === "monitoring" ? (
                <button type="button" disabled={busy}
                  onClick={() => void runAction("generate_scenario", { scenario_key: item.scenario_key })}
                  className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                  {labels.actions.generateScenario}
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "roadmaps" ? (
        <section className="space-y-3">
          {(center.roadmaps ?? []).map((item) => (
            <div key={String(item.roadmap_key)} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <JsonList items={[item]} />
              {item.roadmap_status === "review_required" ? (
                <button type="button" disabled={busy}
                  onClick={() => void runAction("update_roadmap", { roadmap_key: item.roadmap_key })}
                  className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                  {labels.actions.updateRoadmap}
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "initiatives" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("create_initiative", { initiative_name: "New Strategic Initiative" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.createInitiative}
          </button>
          {(center.initiatives ?? []).map((item) => (
            <InitiativeCard key={item.initiative_key} item={item} labels={labels} />
          ))}
        </section>
      ) : null}

      {tab === "opportunities" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("add_opportunity", { opportunity_title: "New Growth Opportunity" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.addOpportunity}
          </button>
          <JsonList items={center.opportunities ?? []} />
        </section>
      ) : null}

      {tab === "threats" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("identify_threat", { threat_title: "New Threat" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.identifyThreat}
          </button>
          <JsonList items={center.threats ?? []} />
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <JsonList items={recommendations} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.benchmarking}</h2>
            <div className="mt-4"><JsonList items={scores} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.innovationManagement}</h2>
            <div className="mt-4"><JsonList items={innovations} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.transformationEngine}</h2>
            <div className="mt-4"><JsonList items={transformations} /></div>
          </div>
          <button type="button" disabled={busy} onClick={() => void runAction("complete_strategic_review")}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
            {labels.actions.completeStrategicReview}
          </button>
        </section>
      ) : null}

      {center.executive_dashboard ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
        </section>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.strategicAdvisor}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
          {advisorPrompts.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </div>

      {(center.audit_recent ?? []).length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            {(center.audit_recent ?? []).map((entry, i) => (
              <li key={i}>{entry.summary || entry.event_type}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
