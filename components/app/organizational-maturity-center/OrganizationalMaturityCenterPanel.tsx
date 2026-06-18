"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseOrganizationalMaturityAction,
  parseOrganizationalMaturityCenter,
  type BenchmarkItem,
  type DepartmentItem,
  type DomainScore,
  type EvolutionEvent,
  type GrowthPlan,
  type MaturitySectionItem,
  type OrganizationalMaturityCenter,
  type PackScore,
  type RoadmapItem,
} from "@/lib/organizational-maturity-center";
import type { OrganizationalMaturityCenterLabels } from "@/lib/organizational-maturity-center/labels";
import { getGrowthHorizonLabel, getMaturityLevelLabel } from "@/lib/organizational-maturity-center/labels";
import { MaturityStatusBadge } from "./MaturityStatusBadge";

type Props = { labels: OrganizationalMaturityCenterLabels };

function LevelBadge({ level, levelLabel, labels }: { level: number; levelLabel: string; labels: OrganizationalMaturityCenterLabels }) {
  const label = getMaturityLevelLabel(levelLabel as Parameters<typeof getMaturityLevelLabel>[0], labels.maturityLevels);
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-900 ring-1 ring-inset ring-indigo-200">
      {labels.level} {level} — {label}
    </span>
  );
}

function SectionBlock({ title, items, labels }: { title: string; items: MaturitySectionItem[]; labels: OrganizationalMaturityCenterLabels }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <span className="text-sm text-zinc-500">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">{labels.emptyState}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <LevelBadge level={item.maturityLevel} levelLabel={item.maturityLevelLabel} labels={labels} />
                  <p className="mt-2 font-medium text-zinc-900">{item.title}</p>
                  {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                  {item.explanation ? (
                    <p className="mt-2 text-xs text-zinc-500"><span className="font-medium">{labels.explanation}:</span> {item.explanation}</p>
                  ) : null}
                </div>
                <MaturityStatusBadge statusKey={item.statusKey} labels={labels.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function OrganizationalMaturityCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalMaturityCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/intelligence/maturity");
    if (res.ok) setCenter(parseOrganizationalMaturityCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/intelligence/maturity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseOrganizationalMaturityAction(await res.json()).ok) await load();
    setBusy(false);
  };

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const dash = center.executiveDashboard;
  const trendLabel = dash.growthTrend === "improving"
    ? labels.executiveDashboard.trends.improving
    : dash.growthTrend === "declining"
      ? labels.executiveDashboard.trends.declining
      : labels.executiveDashboard.trends.stable;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-indigo-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/app/capability-maturity-engine" className="text-indigo-700 hover:underline">{labels.links.legacyEngine}</Link>
            <Link href="/app/executive/capability-maturity" className="text-indigo-700 hover:underline">{labels.links.executiveMaturity}</Link>
          </div>
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveDashboard.title}</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{labels.executiveDashboard.currentMaturityScore}</p>
            <p className="mt-1 text-3xl font-bold text-indigo-900">{dash.currentMaturityScore}</p>
            <LevelBadge level={dash.currentMaturityLevel} levelLabel={dash.currentMaturityLevelLabel} labels={labels} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{labels.executiveDashboard.growthTrend}</p>
            <p className="mt-1 text-sm font-semibold text-emerald-800">{trendLabel}</p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-indigo-100 bg-white p-4">
            <p className="text-sm font-medium text-zinc-900">{labels.executiveDashboard.highestPerformingAreas}</p>
            <ul className="mt-2 space-y-1 text-sm text-zinc-600">
              {dash.highestPerformingAreas.map((a) => (
                <li key={a.domainKey}>{a.domainKey} — {labels.level} {a.maturityLevel} ({a.scoreValue})</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-white p-4">
            <p className="text-sm font-medium text-zinc-900">{labels.executiveDashboard.lowestPerformingAreas}</p>
            <ul className="mt-2 space-y-1 text-sm text-zinc-600">
              {dash.lowestPerformingAreas.map((a) => (
                <li key={a.domainKey}>{a.domainKey} — {labels.level} {a.maturityLevel} ({a.scoreValue})</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-white p-4">
            <p className="text-sm font-medium text-zinc-900">{labels.executiveDashboard.recommendedPriorities}</p>
            <ul className="mt-2 space-y-2 text-sm text-zinc-600">
              {dash.recommendedPriorities.map((p) => (
                <li key={p.domainKey}><span className="font-medium">{p.domainKey}</span> — {p.explanation}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {center.maturityScoring.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.maturityScoring.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.maturityScoring.map((d: DomainScore) => (
              <div key={d.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium capitalize text-zinc-900">{d.domainKey}</p>
                  <MaturityStatusBadge statusKey={d.statusKey} labels={labels.status} />
                </div>
                <LevelBadge level={d.maturityLevel} levelLabel={d.maturityLevelLabel} labels={labels} />
                <p className="mt-2 text-xs text-zinc-500">{labels.maturityScoring.score}: {d.scoreValue}</p>
                {d.explanation ? <p className="mt-2 text-xs text-zinc-600">{d.explanation}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <SectionBlock title={labels.sections.maturityOverview} items={center.sections.maturityOverview} labels={labels} />
      <SectionBlock title={labels.sections.departmentMaturity} items={center.sections.departmentMaturity} labels={labels} />
      <SectionBlock title={labels.sections.processMaturity} items={center.sections.processMaturity} labels={labels} />
      <SectionBlock title={labels.sections.technologyMaturity} items={center.sections.technologyMaturity} labels={labels} />
      <SectionBlock title={labels.sections.knowledgeMaturity} items={center.sections.knowledgeMaturity} labels={labels} />
      <SectionBlock title={labels.sections.governanceMaturity} items={center.sections.governanceMaturity} labels={labels} />
      <SectionBlock title={labels.sections.customerExperienceMaturity} items={center.sections.customerExperienceMaturity} labels={labels} />
      <SectionBlock title={labels.sections.improvementRoadmap} items={center.sections.improvementRoadmap} labels={labels} />

      {center.benchmarking.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.benchmarking.title}</h2>
          <ul className="space-y-3">
            {center.benchmarking.map((b: BenchmarkItem) => (
              <li key={b.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{b.compareType} · {b.domainKey}</p>
                    <p className="mt-1 font-medium text-zinc-900">{b.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{b.summary}</p>
                    {b.comparisonLabel ? <p className="mt-2 text-sm text-indigo-800">{labels.benchmarking.comparison}: {b.comparisonLabel}</p> : null}
                  </div>
                  <MaturityStatusBadge statusKey={b.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.departmentAnalysis.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.departmentAnalysis.title}</h2>
          <ul className="space-y-3">
            {center.departmentAnalysis.map((d: DepartmentItem) => (
              <li key={d.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{labels.departmentAnalysis.department}: {d.departmentName} · {labels.departmentAnalysis.dimension}: {d.dimensionKey}</p>
                    <p className="mt-1 font-medium text-zinc-900">{d.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{d.summary}</p>
                    <div className="mt-2"><LevelBadge level={d.maturityLevel} levelLabel={d.maturityLevelLabel} labels={labels} /></div>
                  </div>
                  <MaturityStatusBadge statusKey={d.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.improvementRoadmaps.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.improvementRoadmaps.title}</h2>
          <ul className="space-y-3">
            {center.improvementRoadmaps.map((r: RoadmapItem) => (
              <li key={r.id} className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4">
                <p className="text-xs font-medium uppercase text-indigo-700">{r.domainKey}</p>
                <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                  <div><dt className="font-medium">{labels.improvementRoadmaps.currentState}</dt><dd className="text-zinc-600">{labels.level} {r.currentLevel} — {getMaturityLevelLabel(r.currentLevelLabel, labels.maturityLevels)}</dd></div>
                  <div><dt className="font-medium">{labels.improvementRoadmaps.targetState}</dt><dd className="text-zinc-600">{labels.level} {r.targetLevel} — {getMaturityLevelLabel(r.targetLevelLabel, labels.maturityLevels)}</dd></div>
                </dl>
                {r.requiredImprovements ? <p className="mt-2 text-sm text-zinc-700"><span className="font-medium">{labels.improvementRoadmaps.requiredImprovements}:</span> {r.requiredImprovements}</p> : null}
                {r.expectedBenefits ? <p className="mt-1 text-sm text-emerald-800"><span className="font-medium">{labels.improvementRoadmaps.expectedBenefits}:</span> {r.expectedBenefits}</p> : null}
                {center.canManage ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("roadmap", r.id, "approve")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{labels.actions.approve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("roadmap", r.id, "complete")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("roadmap", r.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.selfEvolution.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.selfEvolution.title}</h2>
          <ul className="space-y-3">
            {center.selfEvolution.map((e: EvolutionEvent) => (
              <li key={e.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase text-violet-700">{e.eventType.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-zinc-900">{e.title}</p>
                <p className="mt-1 text-sm text-zinc-600">{e.summary}</p>
                {e.learningNote ? <p className="mt-2 text-sm text-violet-800"><span className="font-medium">{labels.selfEvolution.learningNote}:</span> {e.learningNote}</p> : null}
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("evolution", e.id, "acknowledge")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("evolution", e.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.growthPlanning.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.growthPlanning.title}</h2>
          <ul className="space-y-3">
            {center.growthPlanning.map((g: GrowthPlan) => (
              <li key={g.id} className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                <p className="text-xs font-medium uppercase text-amber-800">{getGrowthHorizonLabel(g.horizonKey, labels.growthPlanning.horizons)} · {g.domainKey}</p>
                <p className="mt-1 font-medium text-zinc-900">{g.title}</p>
                <p className="mt-1 text-sm text-zinc-600">{g.summary}</p>
                <LevelBadge level={g.targetLevel} levelLabel={g.targetLevelLabel} labels={labels} />
                {g.requiredActions ? <p className="mt-2 text-sm text-zinc-700"><span className="font-medium">{labels.growthPlanning.requiredActions}:</span> {g.requiredActions}</p> : null}
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("growth_plan", g.id, "acknowledge")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("growth_plan", g.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.businessPackMaturity.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.businessPackMaturity.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.businessPackMaturity.map((p: PackScore) => (
              <div key={p.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium capitalize text-zinc-900">{p.packKey.replace(/_/g, " ")}</p>
                  <MaturityStatusBadge statusKey={p.statusKey} labels={labels.status} />
                </div>
                <LevelBadge level={p.maturityLevel} levelLabel={p.maturityLevelLabel} labels={labels} />
                <p className="mt-2 text-sm font-medium text-zinc-900">{p.title}</p>
                {p.summary ? <p className="mt-1 text-sm text-zinc-600">{p.summary}</p> : null}
                {p.explanation ? <p className="mt-2 text-xs text-zinc-500">{p.explanation}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
