"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseMultiGenerationalFuturesDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type ExecutiveFuturesReview,
  type IntegrationLink,
  type LegacyContinuityEntry,
  type LongHorizonReflection,
  type MultiGenerationalFuturesDashboard,
} from "@/lib/aipify/multi-generational-futures-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-indigo-900">{objective.description}</p>
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
              <Link href={item.cross_link} className="mt-1 block text-xs text-indigo-700 hover:underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewRow({ review }: { review: ExecutiveFuturesReview }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-indigo-900">{review.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {review.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-indigo-800">{review.summary}</p>
      <p className="mt-1 text-xs text-gray-500">{review.review_type?.replace(/_/g, " ")}</p>
    </div>
  );
}

function ReflectionRow({ reflection }: { reflection: LongHorizonReflection }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{reflection.title}</span>
        <span className="text-xs text-gray-600">{reflection.reflection_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{reflection.reflection_summary}</p>
    </div>
  );
}

function LegacyRow({ entry }: { entry: LegacyContinuityEntry }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/20 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-indigo-900">{entry.title}</span>
        <span className="text-xs text-indigo-700">{entry.entry_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-indigo-800">{entry.summary}</p>
    </div>
  );
}

export function MultiGenerationalFuturesEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<MultiGenerationalFuturesDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/multi-generational-futures-engine/dashboard");
    if (res.ok) {
      setDashboard(parseMultiGenerationalFuturesDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.mgfebp171_integration_links?.length
      ? dashboard.mgfebp171_integration_links
      : dashboard.integration_links;

  const eraOpener = dashboard.mgfebp171_era_opener_note ?? dashboard.era_opener_note;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-indigo-900">
          {dashboard.multi_generational_futures_score ?? 0}
        </p>
        <p className="text-xs text-indigo-700">{labels.multiGenerationalFuturesScore}</p>
        {dashboard.multi_generational_futures_mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">
            {dashboard.multi_generational_futures_mission}
          </p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.multi_generational_futures_vision ? (
          <p className="mt-2 text-xs italic text-indigo-800">{dashboard.multi_generational_futures_vision}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.stewardshipMode}:</span> {dashboard.stewardship_mode}
          </div>
          <div>
            <span className="font-medium">{labels.readinessLevel}:</span>{" "}
            {dashboard.stewardship_readiness_level ?? 1}
          </div>
          <div>
            <span className="font-medium">{labels.executiveReviews}:</span>{" "}
            {dashboard.executive_reviews_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.activeReflections}:</span>{" "}
            {dashboard.active_reflections_count ?? 0}
          </div>
        </div>
        {dashboard.safety_note ? (
          <p className="mt-3 text-xs text-indigo-800">{dashboard.safety_note}</p>
        ) : null}
        {dashboard.human_oversight_required ? (
          <p className="mt-2 text-xs font-medium text-indigo-800">{labels.humanOversightRequired}</p>
        ) : null}
      </section>

      {eraOpener ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.eraOpenerNote}</h2>
          <p className="text-sm text-gray-600">{labels.eraOpenerDescription}</p>
          <div className="rounded border border-indigo-100 px-3 py-2 text-sm">
            <p className="font-medium text-indigo-900">{eraOpener.title}</p>
            {eraOpener.description ? (
              <p className="mt-1 text-xs text-gray-600">{eraOpener.description}</p>
            ) : null}
            {eraOpener.opener_route ? (
              <Link href={eraOpener.opener_route} className="mt-1 block text-xs text-indigo-700 hover:underline">
                {eraOpener.opener_route}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.multiGenerationalFuturesCenter}
        meta={dashboard.multi_generational_futures_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.futureGenerationsEngine}
        meta={dashboard.future_generations_engine_meta}
        itemsKey="questions"
      />

      <MetaListSection
        title={labels.longHorizonResponsibilityFramework}
        meta={dashboard.long_horizon_responsibility_framework_meta}
        itemsKey="horizons"
      />

      <MetaListSection
        title={labels.executiveFuturesReviews}
        meta={dashboard.executive_futures_reviews_meta}
        itemsKey="review_themes"
      />

      <MetaListSection
        title={labels.futuresCompanion}
        meta={dashboard.futures_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.intergenerationalStewardshipEngine}
        meta={dashboard.intergenerational_stewardship_engine_meta}
        itemsKey="practices"
      />

      <MetaListSection
        title={labels.legacyContinuityEngine}
        meta={dashboard.legacy_continuity_engine_meta}
        itemsKey="preserve_themes"
      />

      {dashboard.long_horizon_reflections.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.longHorizonReflections}</h2>
          <div className="space-y-2">
            {dashboard.long_horizon_reflections.map((reflection) => (
              <ReflectionRow key={reflection.id} reflection={reflection} />
            ))}
          </div>
        </section>
      ) : null}

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

      {dashboard.legacy_entries.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.legacyEntries}</h2>
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
                  <Link href={link.route} className="font-medium text-indigo-800 hover:underline">
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

      {dashboard.multi_generational_futures_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.multi_generational_futures_objectives.map((objective) => (
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

      {dashboard.multi_generational_futures_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.multi_generational_futures_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.multi_generational_futures_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.multi_generational_futures_privacy_note}</p>
      ) : null}
    </div>
  );
}
