"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseStrategicForesightDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type ForesightScenario,
  type ForesightTrend,
  type IntegrationLink,
  type ReadinessSnapshot,
  type StrategicForesightDashboard,
} from "@/lib/aipify/strategic-foresight-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-violet-900">{objective.description}</p>
      ) : null}
    </div>
  );
}

function SuccessCriterionRow({
  criterion,
  metLabel,
  pendingLabel,
}: {
  criterion: AbosSuccessCriterion;
  metLabel: string;
  pendingLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
      <span className="text-gray-800">{criterion.label}</span>
      <span className={criterion.met ? "text-xs text-green-700" : "text-xs text-amber-700"}>
        {criterion.met ? metLabel : pendingLabel}
      </span>
      {criterion.note ? <p className="w-full text-xs text-gray-500">{criterion.note}</p> : null}
    </div>
  );
}

function MetaListSection({
  title,
  meta,
  itemsKey,
}: {
  title: string;
  meta?: Record<string, unknown>;
  itemsKey: string;
}) {
  const items = Array.isArray(meta?.[itemsKey]) ? (meta[itemsKey] as Array<Record<string, unknown>>) : [];
  if (items.length === 0) return null;
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      {typeof meta?.principle === "string" ? (
        <p className="mt-1 text-xs text-gray-600">{meta.principle}</p>
      ) : null}
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={String(item.key ?? i)} className="rounded border border-gray-100 px-3 py-2 text-sm">
            <span className="font-medium">{String(item.label ?? item.key ?? "")}</span>
            {item.description ? (
              <p className="mt-1 text-xs text-gray-600">{String(item.description)}</p>
            ) : null}
            {item.cross_link ? (
              <Link href={String(item.cross_link)} className="mt-1 inline-block text-xs text-violet-700">
                {String(item.cross_link)}
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
      {typeof meta?.boundary_note === "string" ? (
        <p className="mt-2 text-xs text-gray-500">{meta.boundary_note}</p>
      ) : null}
    </section>
  );
}

function TrendCard({ trend }: { trend: ForesightTrend }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">{trend.title}</span>
        <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-800">
          {trend.signal_strength?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{trend.summary}</p>
      <p className="mt-1 text-xs text-violet-700">
        {trend.trend_category?.replace(/_/g, " ")} · {trend.preparedness_level} preparedness
      </p>
    </div>
  );
}

function ScenarioCard({ scenario }: { scenario: ForesightScenario }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-indigo-900">{scenario.title}</span>
        <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800">{scenario.status}</span>
      </div>
      <p className="mt-1 text-xs text-indigo-800">{scenario.summary}</p>
      {scenario.preparedness_note ? (
        <p className="mt-1 text-xs text-indigo-700">{scenario.preparedness_note}</p>
      ) : null}
      {scenario.cross_link_route ? (
        <Link href={scenario.cross_link_route} className="mt-1 inline-block text-xs text-indigo-600">
          {scenario.cross_link_route}
        </Link>
      ) : null}
    </div>
  );
}

function ReadinessRow({ snapshot }: { snapshot: ReadinessSnapshot }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{snapshot.readiness_dimension?.replace(/_/g, " ")}</span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
          {snapshot.readiness_signal?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{snapshot.reflection_summary}</p>
    </div>
  );
}

export function StrategicForesightDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<StrategicForesightDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/strategic-foresight-engine/dashboard");
    if (res.ok) setDashboard(parseStrategicForesightDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] =
    dashboard.sfebp122_cross_links ?? dashboard.integration_links ?? [];
  const objectives = dashboard.strategic_foresight_objectives ?? [];
  const limitationItems = dashboard.limitation_principles?.must_avoid ?? [];
  const selfLovePractices = dashboard.self_love_in_foresight?.practices ?? [];
  const companionExamples = (dashboard.companion_adaptation?.examples ?? []) as Array<{
    emoji?: string;
    prompt?: string;
    consideration?: string;
  }>;
  const companionLimitations = (dashboard.companion_limitations?.limitations ?? []) as Array<{
    label?: string;
    description?: string;
  }>;
  const knowledgePreserves = (dashboard.strategic_knowledge_library?.preserves ?? []) as Array<{
    label?: string;
    description?: string;
  }>;
  const successMetrics = dashboard.success_metrics ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/app/strategic-intelligence-foundation-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.strategicIntelligenceFoundation}
        </Link>
        <Link href="/app/executive-intelligence" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.executiveIntelligence}
        </Link>
        <Link href="/app/simulations" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.simulationLab}
        </Link>
        <Link href="/app/predictive-insights-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.predictiveInsights}
        </Link>
        <Link href="/app/strategic-alignment-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.strategicAlignment}
        </Link>
        <Link href="/app/self-love-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.selfLove}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
        <p className="text-sm font-medium text-violet-800">{labels.preparednessScore}</p>
        <p className="text-3xl font-bold text-violet-900">{dashboard.foresight_preparedness_score ?? 0}</p>
        <p className="mt-2 text-sm text-violet-800">{dashboard.philosophy}</p>
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-violet-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.safety_note ? <p className="mt-2 text-xs text-violet-600">{dashboard.safety_note}</p> : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeTrends}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.active_trends ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeScenarios}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.active_scenarios ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.readinessSnapshots}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.readiness_snapshots ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.intelligenceCapabilities}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.intelligence_center_capabilities_count ?? 9}</p>
        </div>
      </div>

      {objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {objectives.map((o) => (
              <ObjectiveCard key={o.key ?? o.label} objective={o} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.strategicIntelligenceCenter}
        meta={dashboard.strategic_intelligence_center}
        itemsKey="capabilities"
      />

      {dashboard.trends.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.monitoredTrends}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.trends.map((t) => (
              <TrendCard key={t.id ?? t.trend_key} trend={t} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.trendIntelligenceEngine}
        meta={dashboard.trend_intelligence_engine}
        itemsKey="categories"
      />

      <MetaListSection
        title={labels.foresightFramework}
        meta={dashboard.foresight_framework}
        itemsKey="examinations"
      />

      {dashboard.scenarios.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.scenarioScaffolds}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.scenarios.map((s) => (
              <ScenarioCard key={s.id ?? s.scenario_key} scenario={s} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.scenarioPlanningEngine}
        meta={dashboard.scenario_planning_engine}
        itemsKey="scenario_types"
      />

      <MetaListSection
        title={labels.opportunityIntelligence}
        meta={dashboard.opportunity_intelligence}
        itemsKey="examples"
      />

      <MetaListSection
        title={labels.riskLandscapeEngine}
        meta={dashboard.risk_landscape_engine}
        itemsKey="categories"
      />

      {dashboard.readiness_snapshots_list.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.futureReadinessAssessments}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.readiness_snapshots_list.map((r) => (
              <ReadinessRow key={r.id ?? r.readiness_dimension} snapshot={r} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.futureReadinessDimensions}
        meta={dashboard.future_readiness_assessments}
        itemsKey="dimensions"
      />

      <MetaListSection
        title={labels.executiveForesightCompanion}
        meta={dashboard.executive_foresight_companion}
        itemsKey="supports"
      />

      {companionExamples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.companionAdaptation}</h2>
          <ul className="mt-3 space-y-2">
            {companionExamples.map((ex, i) => (
              <li key={i} className="rounded border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
                <span>{ex.emoji ? `${ex.emoji} ` : ""}{ex.prompt}</span>
                {ex.consideration ? <p className="mt-1 text-xs text-violet-700">{ex.consideration}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {companionLimitations.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.companionLimitations}</h2>
          <ul className="mt-3 space-y-2">
            {companionLimitations.map((lim, i) => (
              <li key={i} className="text-sm text-amber-900">
                <span className="font-medium">{lim.label}</span>
                {lim.description ? <span className="text-xs"> — {lim.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {selfLovePractices.length > 0 ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/30 p-4">
          <h2 className="text-sm font-semibold text-rose-900">{labels.selfLoveInForesight}</h2>
          {dashboard.self_love_in_foresight?.principle ? (
            <p className="mt-1 text-xs text-rose-800">{dashboard.self_love_in_foresight.principle}</p>
          ) : null}
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-rose-900">
            {selfLovePractices.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {knowledgePreserves.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.strategicKnowledgeLibrary}</h2>
          <ul className="mt-3 space-y-2">
            {knowledgePreserves.map((item, i) => (
              <li key={i} className="rounded border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-xs text-gray-600">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {integrationLinks.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.integrationLinks}</h2>
          <ul className="mt-3 space-y-2">
            {integrationLinks.map((link) => (
              <li key={link.key ?? link.route}>
                <Link href={link.route ?? "#"} className="text-sm text-violet-700 hover:underline">
                  {link.label}
                </Link>
                {link.relationship ? <p className="text-xs text-gray-500">{link.relationship}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {limitationItems.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/20 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.limitationPrinciples}</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-amber-900">
            {limitationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {successMetrics.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.successMetrics}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {successMetrics.map((m) => (
              <li key={String(m.key)} className="rounded border border-gray-100 px-3 py-2 text-sm">
                {String(m.label ?? m.key)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.success_criteria?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.success_criteria?.map((c) => (
              <SuccessCriterionRow
                key={c.key ?? c.label}
                criterion={c}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.privacy_note}</p>
      ) : null}
    </div>
  );
}
