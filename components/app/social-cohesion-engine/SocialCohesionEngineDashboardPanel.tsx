"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSocialCohesionDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type ExecutiveTrustReview,
  type IntegrationLink,
  type RelationshipHealthEntry,
  type SocialCohesionDashboard,
  type TrustMemoryEntry,
  type TrustRepairRecord,
} from "@/lib/aipify/social-cohesion-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-teal-900">{objective.description}</p>
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
              <Link href={item.cross_link} className="mt-1 block text-xs text-teal-700 hover:underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustReviewRow({ review }: { review: ExecutiveTrustReview }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-teal-900">{review.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {review.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-teal-800">{review.summary}</p>
      <p className="mt-1 text-xs text-gray-500">{review.review_type?.replace(/_/g, " ")}</p>
    </div>
  );
}

function HealthRow({ entry }: { entry: RelationshipHealthEntry }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-sky-900">{entry.title}</span>
        <span className="text-xs text-sky-700">{entry.health_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-sky-800">{entry.summary}</p>
    </div>
  );
}

function RepairRow({ record }: { record: TrustRepairRecord }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">{record.title}</span>
        <span className="text-xs text-violet-700">{record.repair_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{record.summary}</p>
    </div>
  );
}

function MemoryRow({ entry }: { entry: TrustMemoryEntry }) {
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-amber-900">{entry.title}</span>
        <span className="text-xs text-amber-700">{entry.memory_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-amber-800">{entry.summary}</p>
    </div>
  );
}

export function SocialCohesionEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<SocialCohesionDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/social-cohesion-engine/dashboard");
    if (res.ok) {
      setDashboard(parseSocialCohesionDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.cstcebp169_integration_links?.length
      ? dashboard.cstcebp169_integration_links
      : dashboard.integration_links;

  const companionLimitations =
    dashboard.companion_limitations_meta?.must_not ??
    dashboard.companion_limitations_meta?.must_avoid ??
    [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-teal-900">{dashboard.social_cohesion_score ?? 0}</p>
        <p className="text-xs text-teal-700">{labels.socialCohesionScore}</p>
        {dashboard.social_cohesion_mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.social_cohesion_mission}</p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-teal-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-teal-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.social_cohesion_vision ? (
          <p className="mt-2 text-xs italic text-teal-800">{dashboard.social_cohesion_vision}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.trustDevelopmentMode}:</span>{" "}
            {dashboard.trust_development_mode}
          </div>
          <div>
            <span className="font-medium">{labels.trustReviewsCount}:</span>{" "}
            {dashboard.trust_reviews_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.relationshipHealthCount}:</span>{" "}
            {dashboard.relationship_health_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.repairRecordsCount}:</span>{" "}
            {dashboard.repair_records_count ?? 0}
          </div>
        </div>
        {!dashboard.enabled ? (
          <p className="mt-3 text-xs text-teal-800">{labels.enableRequired}</p>
        ) : null}
        {dashboard.safety_note ? (
          <p className="mt-2 text-xs text-teal-800">{dashboard.safety_note}</p>
        ) : null}
      </section>

      <MetaListSection
        title={labels.socialCohesionCenter}
        meta={dashboard.social_cohesion_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.trustDevelopmentEngine}
        meta={dashboard.trust_development_engine_meta}
        itemsKey="pillars"
      />

      <MetaListSection
        title={labels.relationshipHealthFramework}
        meta={dashboard.relationship_health_framework_meta}
        itemsKey="themes"
      />

      <MetaListSection
        title={labels.executiveTrustReviews}
        meta={dashboard.executive_trust_reviews_meta}
        itemsKey="review_areas"
      />

      <MetaListSection
        title={labels.trustCompanion}
        meta={dashboard.trust_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.socialCohesionEngine}
        meta={dashboard.social_cohesion_engine_meta}
        itemsKey="domains"
      />

      <MetaListSection
        title={labels.repairRestorationFramework}
        meta={dashboard.repair_restoration_framework_meta}
        itemsKey="steps"
      />

      <MetaListSection
        title={labels.trustMemoryEngine}
        meta={dashboard.trust_memory_engine_meta}
        itemsKey="memory_types"
      />

      {dashboard.trust_reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.trustReviewEntries}</h2>
          <div className="space-y-2">
            {dashboard.trust_reviews.map((review) => (
              <TrustReviewRow key={review.id} review={review} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.relationship_health.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.relationshipHealthEntries}</h2>
          <div className="space-y-2">
            {dashboard.relationship_health.map((entry) => (
              <HealthRow key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.repair_records.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.repairRecordEntries}</h2>
          <div className="space-y-2">
            {dashboard.repair_records.map((record) => (
              <RepairRow key={record.id} record={record} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.trust_memory_entries.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.trustMemoryEntries}</h2>
          <div className="space-y-2">
            {dashboard.trust_memory_entries.map((entry) => (
              <MemoryRow key={entry.id} entry={entry} />
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
                  <Link href={link.route} className="font-medium text-teal-800 hover:underline">
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

      {dashboard.social_cohesion_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.social_cohesion_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {companionLimitations.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionLimitations}</h2>
          <ul className="list-inside list-disc text-sm text-gray-700">
            {companionLimitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.social_cohesion_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.social_cohesion_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.social_cohesion_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.social_cohesion_privacy_note}</p>
      ) : null}
    </div>
  );
}
