"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseFutureLeadersDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type FutureLeadersDashboard,
  type IntegrationLink,
  type LeadershipMemoryEntry,
  type LeadershipPathway,
  type MentorshipProgram,
  type SuccessionReview,
} from "@/lib/aipify/future-leaders-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-amber-900">{objective.description}</p>
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
              <Link href={item.cross_link} className="mt-1 block text-xs text-amber-700 hover:underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function PathwayRow({ pathway }: { pathway: LeadershipPathway }) {
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-amber-900">{pathway.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {pathway.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-amber-800">{pathway.summary}</p>
      <p className="mt-1 text-xs text-gray-500">{pathway.pathway_type?.replace(/_/g, " ")}</p>
    </div>
  );
}

function MentorshipRow({ mentorship }: { mentorship: MentorshipProgram }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{mentorship.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {mentorship.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{mentorship.goals_summary}</p>
    </div>
  );
}

function MemoryRow({ entry }: { entry: LeadershipMemoryEntry }) {
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

function SuccessionRow({ review }: { review: SuccessionReview }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="font-medium text-gray-900">{review.title}</div>
      <p className="mt-1 text-xs text-gray-600">{review.reflection_summary}</p>
    </div>
  );
}

export function FutureLeadersEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<FutureLeadersDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/future-leaders-engine/dashboard");
    if (res.ok) {
      setDashboard(parseFutureLeadersDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.iflebp151_integration_links?.length
      ? dashboard.iflebp151_integration_links
      : dashboard.integration_links;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-amber-900">{dashboard.development_score ?? 0}</p>
        <p className="text-xs text-amber-700">{labels.developmentScore}</p>
        {dashboard.future_leaders_mission ? (
          <p className="mt-2 text-sm font-medium text-amber-900">{dashboard.future_leaders_mission}</p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-amber-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-amber-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.future_leaders_vision ? (
          <p className="mt-2 text-xs italic text-amber-800">{dashboard.future_leaders_vision}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.developmentMode}:</span> {dashboard.development_mode}
          </div>
          <div>
            <span className="font-medium">{labels.pathwaysCount}:</span> {dashboard.pathways_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.activeMentorships}:</span>{" "}
            {dashboard.active_mentorships_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.leadershipMemory}:</span>{" "}
            {dashboard.leadership_memory_count ?? 0}
          </div>
        </div>
        {!dashboard.enabled ? (
          <p className="mt-3 text-xs text-amber-800">{labels.enableRequired}</p>
        ) : null}
        {dashboard.safety_note ? (
          <p className="mt-2 text-xs text-amber-800">{dashboard.safety_note}</p>
        ) : null}
      </section>

      <MetaListSection
        title={labels.futureLeadersCenter}
        meta={dashboard.future_leaders_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.intergenerationalLearning}
        meta={dashboard.intergenerational_learning_engine_meta}
        itemsKey="domains"
      />

      <MetaListSection
        title={labels.successionPreparedness}
        meta={dashboard.succession_preparedness_engine_meta}
        itemsKey="domains"
      />

      <MetaListSection
        title={labels.leadershipCompanion}
        meta={dashboard.leadership_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.mentorshipNetwork}
        meta={dashboard.mentorship_network_engine_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.leadershipMemoryEngine}
        meta={dashboard.leadership_memory_engine_meta}
        itemsKey="memory_types"
      />

      <MetaListSection
        title={labels.emergingLeaderPathways}
        meta={dashboard.emerging_leader_pathways_meta}
        itemsKey="pathways"
      />

      {dashboard.pathways.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.pathwaysEnrolled}</h2>
          <div className="space-y-2">
            {dashboard.pathways.map((pathway) => (
              <PathwayRow key={pathway.id} pathway={pathway} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.mentorships.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.mentorshipPrograms}</h2>
          <div className="space-y-2">
            {dashboard.mentorships.map((m) => (
              <MentorshipRow key={m.id} mentorship={m} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.leadership_memory.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.leadershipMemoryEntries}</h2>
          <div className="space-y-2">
            {dashboard.leadership_memory.map((entry) => (
              <MemoryRow key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.succession_reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successionReviews}</h2>
          <div className="space-y-2">
            {dashboard.succession_reviews.map((review) => (
              <SuccessionRow key={review.id} review={review} />
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
                  <Link href={link.route} className="font-medium text-amber-800 hover:underline">
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

      {dashboard.future_leaders_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.future_leaders_objectives.map((objective) => (
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

      {dashboard.future_leaders_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.future_leaders_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.future_leaders_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.future_leaders_privacy_note}</p>
      ) : null}
    </div>
  );
}
