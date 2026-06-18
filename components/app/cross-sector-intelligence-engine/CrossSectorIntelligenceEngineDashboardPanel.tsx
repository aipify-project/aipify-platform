"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCrossSectorIntelligenceDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CrossSectorIntelligenceDashboard,
  type IntegrationLink,
  type LearningProgram,
  type PreparednessReview,
  type ResilienceNetwork,
} from "@/lib/aipify/cross-sector-intelligence-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-emerald-900">{objective.description}</p>
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
              <Link href={item.cross_link} className="mt-1 block text-xs text-emerald-700 hover:underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function LearningProgramRow({ program }: { program: LearningProgram }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-emerald-900">{program.title ?? program.program_key}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">{program.status}</span>
      </div>
      <p className="mt-1 text-xs text-gray-500">{program.program_type?.replace(/_/g, " ")}</p>
    </div>
  );
}

function NetworkRow({ network }: { network: ResilienceNetwork }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="font-medium">{network.title ?? network.network_key}</div>
      <p className="mt-1 text-xs text-gray-600">
        {network.network_type?.replace(/_/g, " ")} · {network.participation_status}
      </p>
    </div>
  );
}

function ReviewRow({ review }: { review: PreparednessReview }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/20 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-emerald-900">{review.review_title}</span>
        <span className="text-xs text-gray-500">{review.preparedness_level}</span>
      </div>
      {review.summary ? <p className="mt-1 text-xs text-emerald-800">{review.summary}</p> : null}
      <p className="mt-1 text-xs text-gray-500">{review.review_type?.replace(/_/g, " ")}</p>
    </div>
  );
}

export function CrossSectorIntelligenceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CrossSectorIntelligenceDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/cross-sector-intelligence-engine/dashboard");
    if (res.ok) {
      setDashboard(parseCrossSectorIntelligenceDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.csiebp162_integration_links?.length
      ? dashboard.csiebp162_integration_links
      : dashboard.integration_links;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-emerald-900">{dashboard.resilience_score ?? 0}</p>
        <p className="text-xs text-emerald-700">{labels.resilienceScore}</p>
        {dashboard.cross_sector_intelligence_mission ? (
          <p className="mt-2 text-sm font-medium text-emerald-900">
            {dashboard.cross_sector_intelligence_mission}
          </p>
        ) : null}
        {dashboard.philosophy ? <p className="mt-2 text-sm text-emerald-900">{dashboard.philosophy}</p> : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-emerald-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.cross_sector_intelligence_vision ? (
          <p className="mt-2 text-xs italic text-emerald-800">{dashboard.cross_sector_intelligence_vision}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.participationStatus}:</span>{" "}
            {dashboard.participation_status}
          </div>
          <div>
            <span className="font-medium">{labels.preparednessLevel}:</span>{" "}
            {dashboard.preparedness_level}
          </div>
          <div>
            <span className="font-medium">{labels.programsCount}:</span> {dashboard.programs_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.networksCount}:</span> {dashboard.networks_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.preparednessReviews}:</span>{" "}
            {dashboard.preparedness_reviews_count ?? 0}
          </div>
        </div>
        {!dashboard.enabled ? (
          <p className="mt-3 text-xs text-amber-800">{labels.optInRequired}</p>
        ) : null}
        <p className="mt-2 text-xs text-emerald-800">{labels.notPredictionNote}</p>
      </section>

      <MetaListSection
        title={labels.societalResilienceCenter}
        meta={dashboard.societal_resilience_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.crossSectorIntelligence}
        meta={dashboard.cross_sector_intelligence_engine_meta}
        itemsKey="sectors"
      />

      <MetaListSection
        title={labels.preparednessFramework}
        meta={dashboard.preparedness_framework_engine_meta}
        itemsKey="frameworks"
      />

      <MetaListSection
        title={labels.collectiveResilienceNetworks}
        meta={dashboard.collective_resilience_networks_meta}
        itemsKey="networks"
      />

      <MetaListSection
        title={labels.resilienceCompanion}
        meta={dashboard.resilience_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.ecosystemHealth}
        meta={dashboard.ecosystem_health_engine_meta}
        itemsKey="themes"
      />

      <MetaListSection
        title={labels.leadershipPreparedness}
        meta={dashboard.leadership_preparedness_engine_meta}
        itemsKey="activities"
      />

      {dashboard.learning_programs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.learningPrograms}</h2>
          <div className="space-y-2">
            {dashboard.learning_programs.map((program) => (
              <LearningProgramRow key={program.id} program={program} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.resilience_networks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.resilienceNetworks}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.resilience_networks.map((network) => (
              <NetworkRow key={network.id} network={network} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.preparedness_reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.preparednessReviewsSection}</h2>
          <div className="space-y-2">
            {dashboard.preparedness_reviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
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
                  <Link href={link.route} className="font-medium text-emerald-800 hover:underline">
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

      {dashboard.cross_sector_intelligence_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.cross_sector_intelligence_objectives.map((objective) => (
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

      {dashboard.cross_sector_intelligence_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.cross_sector_intelligence_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.cross_sector_intelligence_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.cross_sector_intelligence_privacy_note}</p>
      ) : null}
    </div>
  );
}
