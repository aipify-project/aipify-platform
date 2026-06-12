"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseHumanPotentialDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type HumanPotentialDashboard,
  type IntegrationLink,
  type LearningRecommendation,
  type RecognitionMoment,
  type ReflectionEntry,
} from "@/lib/aipify/human-potential-augmented-work-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-emerald-900">{objective.description}</p> : null}
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

function badgeClass(value?: string) {
  switch (value) {
    case "active":
    case "accepted":
    case "org_scaffold":
      return "bg-emerald-100 text-emerald-800";
    case "moderate":
    case "pending":
    case "user_consented":
      return "bg-amber-100 text-amber-800";
    case "high":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function LearningRow({ recommendation }: { recommendation: LearningRecommendation }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{recommendation.title}</span>
        {recommendation.priority ? (
          <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(recommendation.priority)}`}>
            {recommendation.priority}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-xs capitalize text-gray-500">
        {recommendation.recommendation_type?.replace(/_/g, " ")}
      </p>
      <p className="mt-1 text-xs text-gray-600">{recommendation.summary}</p>
      {recommendation.cross_link_route ? (
        <Link href={recommendation.cross_link_route} className="mt-2 inline-block text-xs font-medium text-emerald-700 hover:underline">
          →
        </Link>
      ) : null}
    </li>
  );
}

function ReflectionRow({ entry }: { entry: ReflectionEntry }) {
  return (
    <li className="rounded-lg border border-emerald-100 bg-emerald-50/30 px-3 py-2 text-sm">
      <p className="text-xs font-medium capitalize text-emerald-800">{entry.prompt_type?.replace(/_/g, " ")}</p>
      <p className="mt-1 text-xs text-gray-700">{entry.reflection_summary}</p>
    </li>
  );
}

function RecognitionRow({ moment }: { moment: RecognitionMoment }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{moment.title}</span>
        {moment.visibility ? (
          <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(moment.visibility)}`}>
            {moment.visibility.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-gray-600">{moment.summary}</p>
    </li>
  );
}

function MetaGrid({ items, title }: { items: Record<string, unknown>[]; title: string }) {
  if (!items.length) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={String(item.key)} className="rounded-lg border border-emerald-100 bg-white px-3 py-2 text-sm">
            <span className="font-medium text-emerald-900">{String(item.label ?? item.key)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CrossLinkGrid({ links, title }: { links: IntegrationLink[]; title: string }) {
  if (!links.length) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.key ?? link.route}
            href={link.route ?? "#"}
            className="rounded-lg border border-emerald-100 bg-white px-3 py-2 text-sm hover:border-emerald-300"
          >
            <span className="font-medium text-emerald-900">{link.label}</span>
            {link.note ? <p className="mt-1 text-xs text-gray-500">{link.note}</p> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HumanPotentialAugmentedWorkEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HumanPotentialDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/aipify/human-potential-augmented-work-engine/dashboard");
      if (!res.ok) throw new Error(await res.text());
      const data = parseHumanPotentialDashboard(await res.json());
      setDashboard(data);
    } catch {
      setError(labels.loading);
    } finally {
      setLoading(false);
    }
  }, [labels.loading]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;
  if (error || !dashboard?.has_customer) {
    return <p className="text-sm text-rose-600">{error ?? labels.loading}</p>;
  }

  const companionExamples = dashboard.growth_companion?.examples ?? [];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">{labels.blueprintTitle}</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-800">{labels.engagementScore}</p>
            <p className="text-3xl font-bold text-emerald-900">{dashboard.augmentation_engagement_score ?? 0}</p>
            {dashboard.no_ranking_mode ? (
              <p className="mt-2 text-xs text-emerald-600">{labels.noRankingMode}</p>
            ) : null}
            {dashboard.user_owned_reflections ? (
              <p className="mt-1 text-xs text-emerald-600">{labels.userOwnedReflections}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.learningPending}</span>
            <p className="text-xl font-semibold">{dashboard.learning_recommendations_pending ?? 0}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.reflectionsActive}</span>
            <p className="text-xl font-semibold">{dashboard.reflection_entries_active ?? 0}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.recognitionMoments}</span>
            <p className="text-xl font-semibold">{dashboard.recognition_moments_active ?? 0}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.growthProfiles}</span>
            <p className="text-xl font-semibold">{dashboard.growth_profiles_count ?? 0}</p>
          </div>
        </div>
        {dashboard.safety_note ? (
          <p className="mt-4 text-xs italic text-emerald-700">{dashboard.safety_note}</p>
        ) : null}
      </div>

      {dashboard.philosophy ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">{labels.philosophy}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.philosophy}</p>
        </section>
      ) : null}

      {dashboard.distinction_note ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 px-4 py-3">
          <h3 className="text-sm font-semibold text-amber-900">{labels.distinctionNote}</h3>
          <p className="mt-2 text-xs text-amber-900">{dashboard.distinction_note}</p>
        </section>
      ) : null}

      <MetaGrid items={dashboard.human_potential_center} title={labels.humanPotentialCenter} />

      {dashboard.human_potential_objectives?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.human_potential_objectives.map((obj) => (
              <ObjectiveCard key={obj.key} objective={obj} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.learning_recommendations.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.learningRecommendations}</h3>
          <ul className="space-y-2">
            {dashboard.learning_recommendations.map((r) => (
              <LearningRow key={r.id} recommendation={r} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.reflection_entries.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.reflectionEntries}</h3>
          <ul className="space-y-2">
            {dashboard.reflection_entries.map((e) => (
              <ReflectionRow key={e.id} entry={e} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recognition_moments.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.recognitionMomentsSection}</h3>
          <ul className="space-y-2">
            {dashboard.recognition_moments.map((m) => (
              <RecognitionRow key={m.id} moment={m} />
            ))}
          </ul>
        </section>
      ) : null}

      <MetaGrid items={dashboard.augmented_work_framework} title={labels.augmentedWork} />
      <MetaGrid items={dashboard.strengths_intelligence_engine} title={labels.strengthsIntelligence} />
      <MetaGrid items={dashboard.meaningful_work_engine} title={labels.meaningfulWork} />
      <MetaGrid items={dashboard.career_development_framework} title={labels.careerDevelopment} />
      <MetaGrid items={dashboard.reflection_practice_engine} title={labels.reflectionPractice} />
      <MetaGrid items={dashboard.augmentation_principles} title={labels.augmentationPrinciples} />

      {companionExamples.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.growthCompanion}</h3>
          <div className="space-y-2">
            {companionExamples.map((ex) => (
              <div key={ex.prompt} className="rounded-lg border border-emerald-100 bg-emerald-50/30 px-3 py-2 text-sm">
                <p className="font-medium text-emerald-900">
                  {ex.emoji ? `${ex.emoji} ` : ""}
                  {ex.prompt}
                </p>
                {ex.consideration ? <p className="mt-1 text-xs text-gray-600">{ex.consideration}</p> : null}
              </div>
            ))}
          </div>
          <Link
            href="/app/self-love-engine"
            className="mt-3 inline-block text-xs font-medium text-emerald-700 hover:underline"
          >
            {labels.selfLoveLink} →
          </Link>
        </section>
      ) : null}

      <MetaGrid items={dashboard.companion_limitations} title={labels.companionLimitations} />
      <MetaGrid items={dashboard.self_love_connection} title={labels.selfLoveConnection} />
      <MetaGrid items={dashboard.security_requirements} title={labels.securityRequirements} />
      <CrossLinkGrid links={dashboard.integration_links} title={labels.crossLinks} />

      {dashboard.human_potential_privacy_note ? (
        <section className="rounded-lg border border-green-100 bg-green-50/40 px-4 py-3">
          <h3 className="text-sm font-semibold text-green-900">{labels.privacyNote}</h3>
          <p className="mt-2 text-xs text-green-900">{dashboard.human_potential_privacy_note}</p>
        </section>
      ) : null}

      {dashboard.human_potential_success_criteria?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="space-y-2">
            {dashboard.human_potential_success_criteria.map((c) => (
              <SuccessCriterionRow
                key={c.key}
                criterion={c}
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
