"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseEcosystemOrchestrationDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CompanionAdaptationExample,
  type EcosystemOrchestrationDashboard,
  type HealthSnapshot,
  type IntegrationLink,
  type KnowledgeFlowSignal,
  type MemoryEntry,
  type OpportunitySignal,
  type ResilienceIndicator,
} from "@/lib/aipify/ecosystem-orchestration";

type EcosystemOrchestrationDashboardPanelProps = {
  labels: Record<string, string>;
};

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-indigo-900">{objective.description}</p> : null}
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

function badgeClass(value?: string) {
  switch (value) {
    case "strong":
    case "stable":
    case "high":
    case "values_aligned":
    case "pursuing":
    case "active":
      return "bg-indigo-100 text-indigo-800";
    case "moderate":
    case "emerging":
    case "reviewing":
    case "identified":
      return "bg-amber-100 text-amber-800";
    case "needs_attention":
    case "low":
    case "deferred":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function HealthRow({ snapshot }: { snapshot: HealthSnapshot }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-indigo-900">
          {snapshot.indicator_type?.replace(/_/g, " ")}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(snapshot.signal_strength)}`}>
          {snapshot.signal_strength?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-indigo-800">{snapshot.summary}</p>
      {snapshot.value_numeric != null ? (
        <p className="mt-1 text-xs text-indigo-700">{snapshot.value_numeric}</p>
      ) : null}
    </div>
  );
}

function SignalRow({ signal }: { signal: KnowledgeFlowSignal }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{signal.signal_type?.replace(/_/g, " ")}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(signal.confidence)}`}>
          {signal.confidence}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{signal.summary}</p>
    </div>
  );
}

function ResilienceRow({ indicator }: { indicator: ResilienceIndicator }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-teal-900">{indicator.monitor_type?.replace(/_/g, " ")}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(indicator.signal)}`}>
          {indicator.signal}
        </span>
      </div>
      <p className="mt-1 text-xs text-teal-800">{indicator.summary}</p>
    </div>
  );
}

function OpportunityRow({ signal }: { signal: OpportunitySignal }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">{signal.opportunity_type?.replace(/_/g, " ")}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(signal.status)}`}>
          {signal.status?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{signal.summary}</p>
    </div>
  );
}

function MemoryRow({ entry }: { entry: MemoryEntry }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{entry.title}</span>
        <span className="text-xs text-gray-500">{entry.memory_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{entry.summary}</p>
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
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {typeof meta?.principle === "string" ? <p className="text-sm text-gray-600">{meta.principle}</p> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={String(item.key ?? item.label)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
            <span className="font-medium text-gray-900">{String(item.label ?? item.key)}</span>
            {typeof item.description === "string" ? (
              <p className="mt-1 text-xs text-gray-600">{item.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function EcosystemOrchestrationDashboardPanel({ labels }: EcosystemOrchestrationDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<EcosystemOrchestrationDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/ecosystem-orchestration/dashboard");
    if (res.ok) setDashboard(parseEcosystemOrchestrationDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const eraLinks: IntegrationLink[] =
    dashboard.eocbp120_era_ecosystem_cross_links ?? dashboard.integration_links ?? [];
  const extendedLinks: IntegrationLink[] = dashboard.eocbp120_extended_cross_links ?? [];
  const limitationItems = dashboard.ecosystem_orchestration_limitation_principles?.must_avoid ?? [];
  const companionExamples = dashboard.ecosystem_orchestration_companion_adaptation?.examples ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.blueprintTitle}</h2>
        {dashboard.implementation_blueprint?.phase ? (
          <p className="mt-1 text-xs text-indigo-700">
            {dashboard.implementation_blueprint.phase}
            {dashboard.implementation_blueprint.engine_phase
              ? ` · ${dashboard.implementation_blueprint.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.ecosystem_orchestration_mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">{dashboard.ecosystem_orchestration_mission}</p>
        ) : null}
        {dashboard.ecosystem_orchestration_philosophy ? (
          <p className="mt-2 text-sm text-indigo-900">{dashboard.ecosystem_orchestration_philosophy}</p>
        ) : null}
        {dashboard.ecosystem_orchestration_distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.ecosystem_orchestration_distinction_note}</p>
        ) : null}
        {dashboard.ecosystem_orchestration_vision ? (
          <p className="mt-2 text-xs italic text-indigo-800">{dashboard.ecosystem_orchestration_vision}</p>
        ) : null}
      </section>

      <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-800">{labels.orchestrationCenter}</p>
            <p className="text-3xl font-bold text-indigo-900">{dashboard.orchestration_score ?? 0}</p>
            <p className="mt-1 text-sm text-indigo-700">{dashboard.philosophy}</p>
            {dashboard.human_oversight_required ? (
              <p className="mt-2 text-xs text-indigo-600">{labels.humanOversightRequired}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.healthIndicators}</span>
            <p className="font-semibold">{dashboard.health_indicators_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.knowledgeFlow}</span>
            <p className="font-semibold">{dashboard.knowledge_flow_signals_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.resilienceIndicators}</span>
            <p className="font-semibold">{dashboard.resilience_indicators_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.opportunities}</span>
            <p className="font-semibold">{dashboard.opportunity_signals_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.memoryEntries}</span>
            <p className="font-semibold">{dashboard.memory_entries_count ?? 0}</p>
          </div>
        </div>
      </div>

      {eraLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.eraCrossLinks}</h2>
          <p className="text-sm text-gray-600">{labels.eraCrossLinksNote}</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {eraLinks.map((link) =>
              link.route ? (
                <Link
                  key={link.route + (link.key ?? "")}
                  href={link.route}
                  className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm hover:border-indigo-200"
                >
                  <span className="font-medium text-indigo-900">
                    {link.phase ? `Phase ${link.phase} · ` : ""}
                    {link.label ?? link.route}
                  </span>
                  {link.relationship ? (
                    <p className="mt-1 text-xs text-indigo-700">{link.relationship}</p>
                  ) : null}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      {extendedLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.extendedCrossLinks}</h2>
          <div className="flex flex-wrap gap-2">
            {extendedLinks.map((link) =>
              link.route ? (
                <Link
                  key={link.route + (link.key ?? "")}
                  href={link.route}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                >
                  {link.label ?? link.route}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.orchestrationCapabilities}
        meta={dashboard.orchestration_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.collectiveEvolution}
        meta={dashboard.collective_evolution_meta}
        itemsKey="areas"
      />

      {dashboard.health_snapshots.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.ecosystemHealth}</h2>
          {typeof dashboard.ecosystem_health_model_meta?.principle === "string" ? (
            <p className="text-sm text-gray-600">{dashboard.ecosystem_health_model_meta.principle}</p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.health_snapshots.map((snapshot) => (
              <HealthRow key={snapshot.id} snapshot={snapshot} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.knowledge_flow_signals.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.knowledgeFlowEngine}</h2>
          {typeof dashboard.knowledge_flow_meta?.principle === "string" ? (
            <p className="text-sm text-gray-600">{dashboard.knowledge_flow_meta.principle}</p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.knowledge_flow_signals.map((signal) => (
              <SignalRow key={signal.id} signal={signal} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.resilience_indicators.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.resilienceEngine}</h2>
          {typeof dashboard.resilience_engine_meta?.principle === "string" ? (
            <p className="text-sm text-gray-600">{dashboard.resilience_engine_meta.principle}</p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.resilience_indicators.map((indicator) => (
              <ResilienceRow key={indicator.id} indicator={indicator} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.opportunity_signals.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.strategicOpportunities}</h2>
          {typeof dashboard.strategic_opportunity_meta?.principle === "string" ? (
            <p className="text-sm text-gray-600">{dashboard.strategic_opportunity_meta.principle}</p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.opportunity_signals.map((signal) => (
              <OpportunityRow key={signal.id} signal={signal} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.stewardshipCouncil}
        meta={dashboard.stewardship_council_meta}
        itemsKey="participant_types"
      />

      {dashboard.memory_entries.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.ecosystemMemory}</h2>
          {typeof dashboard.ecosystem_memory_meta?.principle === "string" ? (
            <p className="text-sm text-gray-600">{dashboard.ecosystem_memory_meta.principle}</p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.memory_entries.map((entry) => (
              <MemoryRow key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      ) : null}

      {typeof dashboard.self_love_in_ecosystem_meta?.vision === "string" ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
          <h2 className="text-sm font-semibold text-rose-900">{labels.selfLoveInEcosystem}</h2>
          <p className="mt-2 text-sm text-rose-800">{dashboard.self_love_in_ecosystem_meta.vision}</p>
        </section>
      ) : null}

      {dashboard.ecosystem_orchestration_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.ecosystem_orchestration_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {companionExamples.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionAdaptation}</h2>
          {dashboard.ecosystem_orchestration_companion_adaptation?.principle ? (
            <p className="text-sm text-gray-600">{dashboard.ecosystem_orchestration_companion_adaptation.principle}</p>
          ) : null}
          <div className="space-y-2">
            {companionExamples.map((example: CompanionAdaptationExample) => (
              <div key={example.key} className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
                <span className="font-medium">
                  {example.emoji ? `${example.emoji} ` : ""}
                  {example.prompt}
                </span>
                {example.consideration ? (
                  <p className="mt-1 text-xs text-violet-800">{example.consideration}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {limitationItems.length > 0 ? (
        <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.limitationPrinciples}</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
            {limitationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.ecosystem_orchestration_success_criteria?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.ecosystem_orchestration_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.ecosystem_orchestration_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.ecosystem_orchestration_privacy_note}</p>
      ) : null}
    </div>
  );
}
