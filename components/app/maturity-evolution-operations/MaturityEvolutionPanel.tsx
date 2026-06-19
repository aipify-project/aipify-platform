"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  EVOLUTION_STATUS_BADGES,
  GAP_STATUS_BADGES,
  MATURITY_EVOLUTION_TABS,
  MATURITY_LEVEL_BADGES,
  READINESS_STATUS_BADGES,
  ROADMAP_STATUS_BADGES,
  parseMaturityEvolutionCenter,
  type MaturityEvolutionCenter,
  type MaturityEvolutionLabels,
  type MaturityEvolutionTab,
} from "@/lib/customer-maturity-evolution-operations";

type Props = {
  labels: MaturityEvolutionLabels;
  backHref: string;
  initialTab?: MaturityEvolutionTab;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemList({ items, labels }: { items: Record<string, unknown>[]; labels: MaturityEvolutionLabels }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={String(
            item.capability_key ?? item.assessment_key ?? item.roadmap_key ?? item.benchmark_key
              ?? item.gap_key ?? item.evolution_key ?? item.readiness_key ?? item.pack_key ?? i
          )}
          className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm"
        >
          <p className="font-medium text-zinc-900">
            {String(
              item.capability_title ?? item.assessment_title ?? item.roadmap_title
                ?? item.benchmark_title ?? item.gap_title ?? item.evolution_title
                ?? item.readiness_title ?? item.pack_title ?? item.title ?? i
            )}
          </p>
          {item.summary ? <p className="mt-1 text-zinc-600">{String(item.summary)}</p> : null}
          {item.improvement_plan ? <p className="mt-1 text-indigo-700">{String(item.improvement_plan)}</p> : null}
          {item.current_state && item.target_state ? (
            <p className="mt-1 text-zinc-500">{String(item.current_state)} → {String(item.target_state)}</p>
          ) : null}
          {item.owner_name ? <p className="mt-1 text-zinc-500">{String(item.owner_name)}</p> : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.maturity_label ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${MATURITY_LEVEL_BADGES[String(item.maturity_label)] ?? MATURITY_LEVEL_BADGES.developing}`}>
                {labels.maturityLevel[String(item.maturity_label) as keyof typeof labels.maturityLevel] ?? String(item.maturity_label)}
              </span>
            ) : null}
            {item.maturity_level != null ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">L{String(item.maturity_level)}</span>
            ) : null}
            {item.maturity_score != null ? (
              <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{String(item.maturity_score)}%</span>
            ) : null}
            {item.evolution_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${EVOLUTION_STATUS_BADGES[String(item.evolution_status)] ?? EVOLUTION_STATUS_BADGES.improving}`}>
                {labels.evolutionStatus[String(item.evolution_status) as keyof typeof labels.evolutionStatus] ?? String(item.evolution_status)}
              </span>
            ) : null}
            {item.readiness_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${READINESS_STATUS_BADGES[String(item.readiness_status)] ?? READINESS_STATUS_BADGES.moderate}`}>
                {labels.readinessStatus[String(item.readiness_status) as keyof typeof labels.readinessStatus] ?? String(item.readiness_status)}
              </span>
            ) : null}
            {item.gap_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${GAP_STATUS_BADGES[String(item.gap_status)] ?? GAP_STATUS_BADGES.open}`}>
                {String(item.gap_status)}
              </span>
            ) : null}
            {item.roadmap_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${ROADMAP_STATUS_BADGES[String(item.roadmap_status)] ?? ROADMAP_STATUS_BADGES.active}`}>
                {String(item.roadmap_status)}
              </span>
            ) : null}
            {item.capability_type ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{String(item.capability_type)}</span>
            ) : null}
            {item.organization_score != null && item.benchmark_score != null ? (
              <span className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700">
                {String(item.organization_score)} vs {String(item.benchmark_score)}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MaturityEvolutionPanel({ labels, backHref, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<MaturityEvolutionCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<MaturityEvolutionTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/maturity-evolution-operations");
    if (res.ok) setCenter(parseMaturityEvolutionCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/maturity-evolution-operations/action", {
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
  const evolutionScore = center.evolution_score ?? {};
  const companion = center.companion ?? {};
  const advisorPrompts = (companion.maturity_advisor_prompts as string[]) ?? [];
  const recommendations = center.recommendations ?? (executive.companion_recommendations as Record<string, unknown>[]) ?? [];
  const evolutionStatus = String(evolutionScore.evolution_status ?? "improving");

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
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_maturity")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshMaturity}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_maturity_briefing")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.generateMaturityBriefing}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_evolution_report")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.generateEvolutionReport}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {MATURITY_EVOLUTION_TABS.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ring-1 ${EVOLUTION_STATUS_BADGES[evolutionStatus] ?? EVOLUTION_STATUS_BADGES.improving}`}>
              {labels.evolutionStatus[evolutionStatus as keyof typeof labels.evolutionStatus] ?? evolutionStatus}
            </span>
            <span className="text-sm text-zinc-600">{labels.overview.evolutionScore}: {Number(overview.evolution_score ?? evolutionScore.evolution_score ?? 0)}</span>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard label={labels.overview.totalCapabilities} value={Number(overview.total_capabilities ?? 0)} />
            <OverviewCard label={labels.overview.activeAssessments} value={Number(overview.active_assessments ?? 0)} />
            <OverviewCard label={labels.overview.openGaps} value={Number(overview.open_gaps ?? 0)} />
            <OverviewCard label={labels.overview.activeRoadmaps} value={Number(overview.active_roadmaps ?? 0)} />
            <OverviewCard label={labels.overview.benchmarks} value={Number(overview.benchmarks ?? 0)} />
            <OverviewCard label={labels.overview.evolutionItems} value={Number(overview.evolution_items ?? 0)} />
            <OverviewCard label={labels.overview.avgMaturityLevel} value={Number(overview.avg_maturity_level ?? 0)} />
            <OverviewCard label={labels.overview.evolutionScore} value={Number(overview.evolution_score ?? 0)} />
          </dl>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.evolutionScore}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard label="Capability Maturity" value={`${Number(evolutionScore.capability_maturity ?? 0)}%`} />
              <OverviewCard label="Knowledge Health" value={`${Number(evolutionScore.knowledge_health ?? 0)}%`} />
              <OverviewCard label="Governance Health" value={`${Number(evolutionScore.governance_health ?? 0)}%`} />
              <OverviewCard label="Process Quality" value={`${Number(evolutionScore.process_quality ?? 0)}%`} />
              <OverviewCard label="Operational Readiness" value={`${Number(evolutionScore.operational_readiness ?? 0)}%`} />
              <OverviewCard label="Improvement Velocity" value={`${Number(evolutionScore.improvement_velocity ?? 0)}%`} />
            </dl>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.readinessEngine}</h2>
            <div className="mt-4"><ItemList items={center.readiness ?? []} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.capabilityGaps}</h2>
            <div className="mt-4"><ItemList items={center.gaps ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "capabilities" ? (
        <section className="space-y-6">
          <ItemList items={center.capabilities ?? []} labels={labels} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.businessPacks}</h2>
            <div className="mt-4"><ItemList items={center.business_packs ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "assessments" ? (
        <section><ItemList items={center.assessments ?? []} labels={labels} /></section>
      ) : null}

      {tab === "benchmarks" ? (
        <section><ItemList items={center.benchmarks ?? []} labels={labels} /></section>
      ) : null}

      {tab === "roadmaps" ? (
        <section className="space-y-4">
          <ItemList items={center.roadmaps ?? []} labels={labels} />
          <button type="button" disabled={busy} onClick={() => void runAction("generate_roadmap")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            {labels.actions.generateRoadmap}
          </button>
        </section>
      ) : null}

      {tab === "recommendations" ? (
        <section className="space-y-6">
          <ItemList items={recommendations} labels={labels} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.evolutionTracking}</h2>
            <div className="mt-4"><ItemList items={center.evolution ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.executiveDashboard}</h2>
            <div className="mt-4"><ItemList items={(executive.maturity_scores as Record<string, unknown>[]) ?? center.capabilities ?? []} labels={labels} /></div>
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
        </section>
      ) : null}
    </div>
  );
}
