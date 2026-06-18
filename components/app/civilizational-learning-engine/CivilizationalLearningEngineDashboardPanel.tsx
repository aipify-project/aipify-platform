"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCivilizationalLearningDashboard,
  type AbosSuccessCriterion,
  type AdaptationReview,
  type BlueprintObjective,
  type CivilizationalLearningDashboard,
  type IntegrationLink,
  type LearningProgram,
  type LessonLearned,
} from "@/lib/aipify/civilizational-learning-engine";

type CivilizationalLearningEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

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
      {criterion.note ? <p className="w-full text-xs text-gray-500">{criterion.note}</p> : null}
    </div>
  );
}

function badgeClass(value?: string) {
  switch (value) {
    case "strong":
    case "stable":
    case "completed":
    case "active":
    case "published":
      return "bg-indigo-100 text-indigo-800";
    case "developing":
    case "in_review":
    case "draft":
    case "paused":
      return "bg-amber-100 text-amber-800";
    case "needs_attention":
    case "emerging":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function ProgramRow({ program }: { program: LearningProgram }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-indigo-900">
          {program.title ?? program.program_type?.replace(/_/g, " ")}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(program.adaptation_signal)}`}>
          {program.adaptation_signal?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-indigo-800">{program.summary}</p>
    </div>
  );
}

function ReviewRow({ review }: { review: AdaptationReview }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-sky-900">
          {review.title ?? review.review_type?.replace(/_/g, " ")}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(review.adaptation_signal)}`}>
          {review.adaptation_signal?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-sky-800">{review.summary}</p>
    </div>
  );
}

function LessonRow({ lesson }: { lesson: LessonLearned }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">{lesson.title}</span>
        <span className="text-xs text-violet-700">{lesson.lesson_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{lesson.summary}</p>
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
            {typeof item.description === "string" ? (
              <p className="mt-1 text-xs text-gray-600">{item.description}</p>
            ) : null}
            {typeof item.cross_link === "string" ? (
              <Link href={item.cross_link} className="mt-1 inline-block text-xs text-indigo-700 underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function CivilizationalLearningEngineDashboardPanel({
  labels,
}: CivilizationalLearningEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<CivilizationalLearningDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/civilizational-learning-engine/dashboard");
    if (res.ok) setDashboard(parseCivilizationalLearningDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const eraLinks: IntegrationLink[] =
    dashboard.claebp164_integration_links ?? dashboard.integration_links ?? [];
  const limitationItems = dashboard.companion_limitations_meta?.must_avoid ?? [];
  const companionMustNot = Array.isArray(dashboard.adaptation_companion_meta?.must_not)
    ? (dashboard.adaptation_companion_meta.must_not as string[])
    : [];

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
        {dashboard.civilizational_learning_mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">
            {dashboard.civilizational_learning_mission}
          </p>
        ) : null}
        {dashboard.civilizational_learning_philosophy ? (
          <p className="mt-2 text-sm text-indigo-900">{dashboard.civilizational_learning_philosophy}</p>
        ) : null}
        {dashboard.civilizational_learning_distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">
            {dashboard.civilizational_learning_distinction_note}
          </p>
        ) : null}
        {dashboard.civilizational_learning_vision ? (
          <p className="mt-2 text-xs italic text-indigo-800">{dashboard.civilizational_learning_vision}</p>
        ) : null}
      </section>

      {eraLinks.length > 0 ? (
        <section className="rounded-xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-100/80 to-white p-5">
          <h2 className="text-lg font-semibold text-indigo-950">{labels.eraCrossLinksBanner}</h2>
          <p className="mt-1 text-sm text-indigo-800">{labels.eraCrossLinksNote}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {eraLinks.map((link) =>
              link.route ? (
                <Link
                  key={link.route + (link.key ?? "")}
                  href={link.route}
                  className="rounded-lg border border-indigo-200 bg-white/80 px-3 py-2 text-sm hover:border-indigo-300"
                >
                  <span className="font-medium text-indigo-900">
                    {link.phase ? `Phase ${link.phase} · ` : ""}
                    {link.label ?? link.route}
                  </span>
                  {link.description ? (
                    <p className="mt-1 text-xs text-indigo-700">{link.description}</p>
                  ) : link.relationship ? (
                    <p className="mt-1 text-xs text-indigo-700">{link.relationship}</p>
                  ) : null}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-800">{labels.collectiveAdaptationCenter}</p>
            <p className="text-3xl font-bold text-indigo-900">
              {dashboard.collective_adaptation_score ?? 0}
            </p>
            <p className="mt-1 text-sm text-indigo-700">{dashboard.philosophy}</p>
            {dashboard.human_oversight_required ? (
              <p className="mt-2 text-xs text-indigo-600">{labels.humanOversightRequired}</p>
            ) : null}
            {dashboard.cross_org_learning_opt_in ? (
              <p className="mt-1 text-xs text-indigo-600">{labels.crossOrgOptIn}</p>
            ) : (
              <p className="mt-1 text-xs text-indigo-600">{labels.crossOrgOptOut}</p>
            )}
          </div>
          <div className="rounded-lg border border-indigo-200 bg-white/90 px-4 py-3 text-center">
            <p className="text-xs text-indigo-600">{labels.currentReadinessLevel}</p>
            <p className="text-2xl font-bold text-indigo-900">
              {dashboard.adaptation_readiness_level ?? 1}
            </p>
            <p className="text-xs capitalize text-indigo-700">
              {dashboard.learning_maturity_stage?.replace(/_/g, " ")}
            </p>
            <p className="text-xs text-indigo-700">{labels.maturityNotRanking}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.learningPrograms}</span>
            <p className="font-semibold">{dashboard.learning_programs_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.adaptationReviews}</span>
            <p className="font-semibold">{dashboard.adaptation_reviews_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-indigo-600">{labels.lessonsLearned}</span>
            <p className="font-semibold">{dashboard.lessons_learned_count ?? 0}</p>
          </div>
        </div>
        {dashboard.civilizational_learning_privacy_note ? (
          <p className="mt-3 text-xs text-indigo-700">{dashboard.civilizational_learning_privacy_note}</p>
        ) : null}
      </div>

      <MetaListSection
        title={labels.collectiveAdaptationCenterCapabilities}
        meta={dashboard.collective_adaptation_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.collectiveLearningEngine}
        meta={dashboard.collective_learning_engine_meta}
        itemsKey="contributors"
      />

      <MetaListSection
        title={labels.adaptationFramework}
        meta={dashboard.adaptation_framework_engine_meta}
        itemsKey="dimensions"
      />

      <MetaListSection
        title={labels.executiveLearningReviews}
        meta={dashboard.executive_learning_reviews_meta}
        itemsKey="review_questions"
      />

      <MetaListSection
        title={labels.adaptationCompanion}
        meta={dashboard.adaptation_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.collectiveResilience}
        meta={dashboard.collective_resilience_engine_meta}
        itemsKey="initiatives"
      />

      <MetaListSection
        title={labels.humilityInnovation}
        meta={dashboard.humility_innovation_framework_meta}
        itemsKey="principles"
      />

      <MetaListSection
        title={labels.adaptationMemoryEngine}
        meta={dashboard.adaptation_memory_engine_meta}
        itemsKey="memory_types"
      />

      {dashboard.learning_programs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.learningProgramsSection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.learning_programs.map((program) => (
              <ProgramRow key={program.id} program={program} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.adaptation_reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.adaptationReviewsSection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.adaptation_reviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.lessons_learned.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.lessonsLearnedSection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.lessons_learned.map((lesson) => (
              <LessonRow key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </section>
      ) : null}

      {typeof dashboard.self_love_connection_meta?.principle === "string" ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
          <h2 className="text-sm font-semibold text-rose-900">{labels.selfLoveConnection}</h2>
          <p className="mt-2 text-sm text-rose-800">
            {dashboard.self_love_connection_meta.principle as string}
          </p>
        </section>
      ) : null}

      {dashboard.civilizational_learning_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.civilizational_learning_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {limitationItems.length > 0 || companionMustNot.length > 0 ? (
        <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.companionLimitations}</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
            {[...limitationItems, ...companionMustNot].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.civilizational_learning_success_criteria?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          <div className="space-y-2">
            {dashboard.civilizational_learning_success_criteria.map((criterion) => (
              <SuccessCriterionRow
                key={criterion.key ?? criterion.label}
                criterion={criterion}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
