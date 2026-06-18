"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseHumanFlourishingDashboard,
  type AbosSuccessCriterion,
  type BelongingReflection,
  type BlueprintObjective,
  type ExecutiveFlourishingReview,
  type HumanFlourishingDashboard,
  type IntegrationLink,
  type LearningRecord,
  type StrengthsNote,
} from "@/lib/aipify/human-flourishing-engine";

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
              <Link href={item.cross_link} className="mt-1 block text-xs text-violet-700 hover:underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewRow({ review }: { review: ExecutiveFlourishingReview }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">{review.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {review.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{review.summary}</p>
      <p className="mt-1 text-xs text-gray-500">{review.review_type?.replace(/_/g, " ")}</p>
    </div>
  );
}

function BelongingRow({ reflection }: { reflection: BelongingReflection }) {
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

function StrengthsRow({ note }: { note: StrengthsNote }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/20 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">{note.title}</span>
        <span className="text-xs text-violet-700">{note.note_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{note.summary}</p>
    </div>
  );
}

function LearningRow({ record }: { record: LearningRecord }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{record.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {record.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{record.summary}</p>
    </div>
  );
}

export function HumanFlourishingEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HumanFlourishingDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/human-flourishing-engine/dashboard");
    if (res.ok) {
      setDashboard(parseHumanFlourishingDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.cfhpbp170_integration_links?.length
      ? dashboard.cfhpbp170_integration_links
      : dashboard.integration_links;

  const eraCapstone =
    dashboard.cfhpbp170_era_capstone_summary?.length
      ? dashboard.cfhpbp170_era_capstone_summary
      : dashboard.era_capstone_summary ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-violet-900">{dashboard.human_flourishing_score ?? 0}</p>
        <p className="text-xs text-violet-700">{labels.humanFlourishingScore}</p>
        {dashboard.human_flourishing_mission ? (
          <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.human_flourishing_mission}</p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-violet-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-violet-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.human_flourishing_vision ? (
          <p className="mt-2 text-xs italic text-violet-800">{dashboard.human_flourishing_vision}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.developmentMode}:</span> {dashboard.development_mode}
          </div>
          <div>
            <span className="font-medium">{labels.readinessLevel}:</span>{" "}
            {dashboard.flourishing_readiness_level ?? 1}
          </div>
          <div>
            <span className="font-medium">{labels.executiveReviews}:</span>{" "}
            {dashboard.executive_reviews_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.activeLearning}:</span>{" "}
            {dashboard.active_learning_count ?? 0}
          </div>
        </div>
        {dashboard.safety_note ? (
          <p className="mt-3 text-xs text-violet-800">{dashboard.safety_note}</p>
        ) : null}
        {dashboard.human_oversight_required ? (
          <p className="mt-2 text-xs font-medium text-violet-800">{labels.humanOversightRequired}</p>
        ) : null}
      </section>

      {eraCapstone.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.eraCapstoneSummary}</h2>
          <p className="text-sm text-gray-600">{labels.eraCapstoneNote}</p>
          <ul className="space-y-2 text-sm">
            {eraCapstone.map((link: IntegrationLink) => (
              <li key={link.key ?? link.label} className="rounded border border-violet-100 px-3 py-2">
                {link.route ? (
                  <Link href={link.route} className="font-medium text-violet-800 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium">{link.label}</span>
                )}
                {link.description ? (
                  <p className="mt-1 text-xs text-gray-500">{link.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <MetaListSection
        title={labels.humanFlourishingCenter}
        meta={dashboard.human_flourishing_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.humanPotentialEngine}
        meta={dashboard.human_potential_engine_meta}
        itemsKey="dimensions"
      />

      <MetaListSection
        title={labels.flourishingFramework}
        meta={dashboard.flourishing_framework_meta}
        itemsKey="domains"
      />

      <MetaListSection
        title={labels.executiveFlourishingReviews}
        meta={dashboard.executive_flourishing_reviews_meta}
        itemsKey="review_themes"
      />

      <MetaListSection
        title={labels.flourishingCompanion}
        meta={dashboard.flourishing_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.belongingEngine}
        meta={dashboard.belonging_engine_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.strengthsDevelopmentEngine}
        meta={dashboard.strengths_development_engine_meta}
        itemsKey="themes"
      />

      <MetaListSection
        title={labels.lifelongLearningFramework}
        meta={dashboard.lifelong_learning_framework_meta}
        itemsKey="pillars"
      />

      {dashboard.learning_records.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.learningRecords}</h2>
          <div className="space-y-2">
            {dashboard.learning_records.map((record) => (
              <LearningRow key={record.id} record={record} />
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

      {dashboard.belonging_reflections.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.belongingReflections}</h2>
          <div className="space-y-2">
            {dashboard.belonging_reflections.map((reflection) => (
              <BelongingRow key={reflection.id} reflection={reflection} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.strengths_notes.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.strengthsNotes}</h2>
          <div className="space-y-2">
            {dashboard.strengths_notes.map((note) => (
              <StrengthsRow key={note.id} note={note} />
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
                  <Link href={link.route} className="font-medium text-violet-800 hover:underline">
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

      {dashboard.human_flourishing_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.human_flourishing_objectives.map((objective) => (
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

      {dashboard.human_flourishing_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.human_flourishing_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.human_flourishing_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.human_flourishing_privacy_note}</p>
      ) : null}
    </div>
  );
}
