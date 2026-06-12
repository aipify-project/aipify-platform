"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseIntergenerationalGuardianshipDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type ContinuityReflection,
  type ExecutiveGuardianshipReview,
  type IntegrationLink,
  type IntergenerationalGuardianshipDashboard,
  type LegacyResilienceEntry,
} from "@/lib/aipify/intergenerational-guardianship-engine";

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

function ReviewRow({ review }: { review: ExecutiveGuardianshipReview }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-emerald-900">{review.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {review.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-emerald-800">{review.summary}</p>
      <p className="mt-1 text-xs text-gray-500">{review.review_type?.replace(/_/g, " ")}</p>
    </div>
  );
}

function ReflectionRow({ reflection }: { reflection: ContinuityReflection }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-sky-900">{reflection.title}</span>
        <span className="text-xs text-sky-700">{reflection.reflection_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-sky-800">{reflection.reflection_summary}</p>
    </div>
  );
}

function LegacyRow({ entry }: { entry: LegacyResilienceEntry }) {
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-amber-900">{entry.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {entry.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-amber-800">{entry.summary}</p>
      <p className="mt-1 text-xs text-gray-500">{entry.entry_type?.replace(/_/g, " ")}</p>
    </div>
  );
}

export function IntergenerationalGuardianshipEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<IntergenerationalGuardianshipDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/intergenerational-guardianship-engine/dashboard");
    if (res.ok) {
      setDashboard(parseIntergenerationalGuardianshipDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.ighcebp172_integration_links?.length
      ? dashboard.ighcebp172_integration_links
      : dashboard.integration_links;

  const companionLimitations =
    dashboard.companion_limitations_meta?.must_not ??
    dashboard.companion_limitations_meta?.must_avoid ??
    [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-emerald-900">{dashboard.guardianship_score ?? 0}</p>
        <p className="text-xs text-emerald-700">{labels.guardianshipScore}</p>
        {dashboard.intergenerational_guardianship_mission ? (
          <p className="mt-2 text-sm font-medium text-emerald-900">
            {dashboard.intergenerational_guardianship_mission}
          </p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-emerald-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-emerald-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.intergenerational_guardianship_vision ? (
          <p className="mt-2 text-xs italic text-emerald-800">
            {dashboard.intergenerational_guardianship_vision}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.guardianshipMode}:</span>{" "}
            {dashboard.guardianship_mode}
          </div>
          <div>
            <span className="font-medium">{labels.executiveReviewsCount}:</span>{" "}
            {dashboard.executive_reviews_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.continuityReflectionsCount}:</span>{" "}
            {dashboard.continuity_reflections_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.legacyEntriesCount}:</span>{" "}
            {dashboard.legacy_entries_count ?? 0}
          </div>
        </div>
        {!dashboard.enabled ? (
          <p className="mt-3 text-xs text-emerald-800">{labels.enableRequired}</p>
        ) : null}
        {dashboard.safety_note ? (
          <p className="mt-2 text-xs text-emerald-800">{dashboard.safety_note}</p>
        ) : null}
      </section>

      <MetaListSection
        title={labels.guardianshipCenter}
        meta={dashboard.guardianship_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.humanContinuityEngine}
        meta={dashboard.human_continuity_engine_meta}
        itemsKey="reflection_questions"
      />

      <MetaListSection
        title={labels.intergenerationalResponsibilityFramework}
        meta={dashboard.intergenerational_responsibility_framework_meta}
        itemsKey="domains"
      />

      <MetaListSection
        title={labels.executiveGuardianshipReviews}
        meta={dashboard.executive_guardianship_reviews_meta}
        itemsKey="review_themes"
      />

      <MetaListSection
        title={labels.guardianshipCompanion}
        meta={dashboard.guardianship_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.valuesPreservationEngine}
        meta={dashboard.values_preservation_engine_meta}
        itemsKey="values"
      />

      <MetaListSection
        title={labels.legacyResilienceEngine}
        meta={dashboard.legacy_resilience_engine_meta}
        itemsKey="practices"
      />

      {dashboard.executive_reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveReviewEntries}</h2>
          <div className="space-y-2">
            {dashboard.executive_reviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.continuity_reflections.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.continuityReflectionEntries}</h2>
          <div className="space-y-2">
            {dashboard.continuity_reflections.map((reflection) => (
              <ReflectionRow key={reflection.id} reflection={reflection} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.legacy_entries.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.legacyEntryEntries}</h2>
          <div className="space-y-2">
            {dashboard.legacy_entries.map((entry) => (
              <LegacyRow key={entry.id} entry={entry} />
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

      {dashboard.intergenerational_guardianship_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.intergenerational_guardianship_objectives.map((objective) => (
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

      {dashboard.intergenerational_guardianship_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.intergenerational_guardianship_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.intergenerational_guardianship_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.intergenerational_guardianship_privacy_note}</p>
      ) : null}
    </div>
  );
}
