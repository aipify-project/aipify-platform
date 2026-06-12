"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGlobalKnowledgeExchangeDashboard,
  type AbosSuccessCriterion,
  type BenchmarkSnapshot,
  type BlueprintObjective,
  type GlobalKnowledgeExchangeDashboard,
  type IntegrationLink,
  type KnowledgeContribution,
} from "@/lib/aipify/global-knowledge-exchange-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-sky-900">{objective.description}</p>
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
  const items = Array.isArray(meta?.[itemsKey])
    ? (meta[itemsKey] as Array<Record<string, unknown>>)
    : [];
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {typeof meta?.principle === "string" ? (
        <p className="text-sm text-gray-600">{meta.principle}</p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={String(item.key ?? item.label)}
            className="rounded-lg border border-gray-100 px-3 py-2 text-sm"
          >
            <span className="font-medium text-gray-900">{String(item.label ?? item.key)}</span>
            {typeof item.cross_link === "string" ? (
              <Link href={item.cross_link} className="mt-1 block text-xs text-sky-700 hover:underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ContributionRow({ contribution }: { contribution: KnowledgeContribution }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-sky-900">{contribution.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {contribution.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-sky-800">{contribution.summary}</p>
      <p className="mt-1 text-xs text-gray-500">
        {contribution.contribution_type?.replace(/_/g, " ")}
        {contribution.industry_tag ? ` · ${contribution.industry_tag}` : ""}
      </p>
    </div>
  );
}

function BenchmarkRow({ snapshot }: { snapshot: BenchmarkSnapshot }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="font-medium">{snapshot.benchmark_domain?.replace(/_/g, " ")}</div>
      <p className="mt-1 text-xs text-gray-600">
        {snapshot.aggregate_value != null ? `Aggregate: ${snapshot.aggregate_value}` : "—"}
        {snapshot.participant_count != null ? ` · ${snapshot.participant_count} participants` : ""}
      </p>
    </div>
  );
}

export function GlobalKnowledgeExchangeEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<GlobalKnowledgeExchangeDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/global-knowledge-exchange-engine/dashboard");
    if (res.ok) {
      setDashboard(parseGlobalKnowledgeExchangeDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.gkeebp141_integration_links?.length
      ? dashboard.gkeebp141_integration_links
      : dashboard.integration_links;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-sky-900">{dashboard.exchange_score ?? 0}</p>
        <p className="text-xs text-sky-700">{labels.exchangeScore}</p>
        {dashboard.global_knowledge_exchange_mission ? (
          <p className="mt-2 text-sm font-medium text-sky-900">
            {dashboard.global_knowledge_exchange_mission}
          </p>
        ) : null}
        {dashboard.philosophy ? <p className="mt-2 text-sm text-sky-900">{dashboard.philosophy}</p> : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-sky-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.global_knowledge_exchange_vision ? (
          <p className="mt-2 text-xs italic text-sky-800">{dashboard.global_knowledge_exchange_vision}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.participationStatus}:</span>{" "}
            {dashboard.participation_status}
          </div>
          <div>
            <span className="font-medium">{labels.programsCount}:</span> {dashboard.programs_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.approvedContributions}:</span>{" "}
            {dashboard.approved_contributions_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.pendingContributions}:</span>{" "}
            {dashboard.pending_contributions_count ?? 0}
          </div>
        </div>
        {!dashboard.enabled ? (
          <p className="mt-3 text-xs text-amber-800">{labels.optInRequired}</p>
        ) : null}
        {dashboard.approval_required ? (
          <p className="mt-2 text-xs text-sky-800">{labels.approvalRequired}</p>
        ) : null}
      </section>

      {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}

      <MetaListSection
        title={labels.globalKnowledgeCenter}
        meta={dashboard.global_knowledge_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.interorganizationalLearning}
        meta={dashboard.interorganizational_learning_engine_meta}
        itemsKey="domains"
      />

      <MetaListSection
        title={labels.knowledgeSharingGovernance}
        meta={dashboard.knowledge_sharing_governance_meta}
        itemsKey="rules"
      />

      <MetaListSection
        title={labels.anonymizedBenchmarking}
        meta={dashboard.anonymized_benchmarking_engine_meta}
        itemsKey="benchmarks"
      />

      <MetaListSection
        title={labels.globalLearningNetworks}
        meta={dashboard.global_learning_networks_meta}
        itemsKey="networks"
      />

      {dashboard.programs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.exchangePrograms}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {dashboard.programs.map((program) => (
              <li
                key={program.id}
                className="rounded border border-gray-100 px-3 py-2 text-sm"
              >
                <span className="font-medium">{program.program_key?.replace(/_/g, " ")}</span>
                <span className="ml-2 text-xs text-gray-500">{program.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.contributions.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.contributions}</h2>
          <div className="space-y-2">
            {dashboard.contributions.map((c) => (
              <ContributionRow key={c.id} contribution={c} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.benchmark_snapshots.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.benchmarkSnapshots}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.benchmark_snapshots.map((b) => (
              <BenchmarkRow key={b.id} snapshot={b} />
            ))}
          </div>
        </section>
      ) : null}

      {integrationLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.crossLinks}</h2>
          <ul className="space-y-2 text-sm">
            {integrationLinks.map((link: IntegrationLink) => (
              <li key={link.key ?? link.label} className="rounded border border-gray-100 px-3 py-2">
                {link.route ? (
                  <Link href={link.route} className="font-medium text-sky-800 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium">{link.label}</span>
                )}
                {link.relationship ? (
                  <p className="mt-1 text-xs text-gray-500">{link.relationship}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.global_knowledge_exchange_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.global_knowledge_exchange_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_limitations_meta?.must_avoid?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionLimitations}</h2>
          <ul className="list-inside list-disc text-sm text-gray-700">
            {dashboard.companion_limitations_meta.must_avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.global_knowledge_exchange_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.global_knowledge_exchange_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.global_knowledge_exchange_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.global_knowledge_exchange_privacy_note}</p>
      ) : null}
    </div>
  );
}
