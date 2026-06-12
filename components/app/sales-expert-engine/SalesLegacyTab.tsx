"use client";

import Link from "next/link";
import type {
  LegacySuccessCriterion,
  SalesExpertLegacyCenter,
  SalesImpactInsight,
  SalesLegacySummary,
  SalesSuccessTimelineEvent,
} from "@/lib/aipify/sales-expert-operating-system";

type Props = {
  center?: SalesExpertLegacyCenter;
  labels: Record<string, string>;
};

function SuccessCriteriaList({
  criteria,
  labels,
}: {
  criteria?: LegacySuccessCriterion[];
  labels: Record<string, string>;
}) {
  if (!criteria || criteria.length === 0) return null;
  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold">{labels.legacySuccessCriteria}</h3>
      <ul className="mt-3 space-y-2">
        {criteria.map((c) => (
          <li key={c.key ?? c.label} className="flex items-start gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
            <span className={c.met ? "text-emerald-600" : "text-gray-400"}>{c.met ? "✓" : "○"}</span>
            <div>
              <span className="font-medium">{c.label}</span>
              {c.note ? <p className="mt-0.5 text-xs text-gray-600">{c.note}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LegacyMetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-gray-100 p-3 text-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function TimelineList({ events, labels }: { events?: SalesSuccessTimelineEvent[]; labels: Record<string, string> }) {
  if (!events || events.length === 0) return null;
  return (
    <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
      <h3 className="text-sm font-semibold text-indigo-900">{labels.legacySuccessTimeline}</h3>
      <p className="mt-1 text-xs text-indigo-800">{labels.legacyTimelineNote}</p>
      <ul className="mt-4 space-y-3">
        {events.map((event) => (
          <li
            key={event.key ?? event.label}
            className={`rounded border p-3 text-sm ${event.achieved ? "border-emerald-200 bg-white" : "border-gray-200 bg-white/60"}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg">{event.emoji}</span>
              <span className="font-medium">{event.label}</span>
              <span
                className={`rounded px-2 py-0.5 text-xs ${event.achieved ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}
              >
                {event.achieved ? labels.legacyTimelineAchieved : labels.legacyTimelinePending}
              </span>
            </div>
            {event.guidance ? <p className="mt-2 text-xs text-gray-600">{event.guidance}</p> : null}
            {event.occurred_at ? (
              <p className="mt-1 text-xs text-gray-500">
                {labels.legacyTimelineDate}: {new Date(String(event.occurred_at)).toLocaleDateString()}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ImpactCards({ insights, labels }: { insights?: SalesImpactInsight[]; labels: Record<string, string> }) {
  if (!insights || insights.length === 0) return null;
  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold">{labels.legacyImpactInsights}</h3>
      <p className="mt-1 text-xs text-gray-500">{labels.legacyImpactMetadataOnly}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight) => (
          <div key={insight.key ?? insight.label} className="rounded border border-amber-100 bg-amber-50/40 p-3 text-sm">
            <span className="text-lg">{insight.emoji}</span>
            <p className="mt-1 font-medium">{insight.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LegacySummaryGrid({ summary, labels }: { summary?: SalesLegacySummary; labels: Record<string, string> }) {
  if (!summary) return null;
  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold">{labels.legacyDashboard}</h3>
      {summary.principle ? <p className="mt-1 text-xs text-gray-500">{summary.principle}</p> : null}
      {summary.privacy_note ? <p className="mt-1 text-xs text-gray-500">{summary.privacy_note}</p> : null}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <LegacyMetricCard label={labels.legacyTenureYears} value={String(summary.tenure_years ?? 0)} />
        <LegacyMetricCard label={labels.legacyOrgsSupported} value={String(summary.orgs_supported ?? 0)} />
        <LegacyMetricCard label={labels.legacyCustomersRetained} value={String(summary.customers_retained ?? 0)} />
        <LegacyMetricCard label={labels.legacyDemosDelivered} value={String(summary.demos_delivered ?? 0)} />
        <LegacyMetricCard label={labels.legacyTrainingSessions} value={String(summary.training_sessions ?? 0)} />
        <LegacyMetricCard label={labels.legacyCommunityContributions} value={String(summary.community_contributions ?? 0)} />
        <LegacyMetricCard label={labels.legacyMentorshipRelationships} value={String(summary.mentorship_relationships ?? 0)} />
        <LegacyMetricCard label={labels.legacyMilestonesAchieved} value={String(summary.milestones_achieved ?? 0)} />
      </div>
    </section>
  );
}

export function SalesLegacyTab({ center, labels }: Props) {
  if (!center) {
    return <p className="text-sm text-gray-600">{labels.loading}</p>;
  }

  const timelineEvents = center.success_timeline?.events;
  const impactInsights = center.impact_insights?.insights;
  const recognition = center.recognition_experiences;
  const reflection = center.self_love_reflection;
  const mentorship = center.mentorship_legacy;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.legacyTitle}</h2>
        {center.mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">
            {labels.legacyMission}: {center.mission}
          </p>
        ) : null}
        {center.philosophy ? <p className="mt-2 text-sm text-indigo-800">{center.philosophy}</p> : null}
        {center.abos_principle ? (
          <p className="mt-2 text-xs text-indigo-800">
            {labels.legacyAbosPrinciple}: {center.abos_principle}
          </p>
        ) : null}
        {center.distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">
            {labels.legacyDistinctionNote}: {center.distinction_note}
          </p>
        ) : null}
      </section>

      <LegacySummaryGrid summary={center.legacy_summary} labels={labels} />
      <TimelineList events={timelineEvents} labels={labels} />
      <ImpactCards insights={impactInsights} labels={labels} />

      {mentorship ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/30 p-4 text-sm">
          <h3 className="font-semibold">{labels.legacyMentorshipLegacy}</h3>
          {mentorship.principle ? <p className="mt-2 text-gray-700">{mentorship.principle}</p> : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <LegacyMetricCard label={labels.legacyMentoredCount} value={String(mentorship.mentored_count ?? 0)} />
            <LegacyMetricCard label={labels.legacyCommunityStories} value={String(mentorship.community_stories_count ?? 0)} />
            <LegacyMetricCard label={labels.legacyActiveMentorships} value={String(mentorship.active_mentorships ?? 0)} />
          </div>
        </section>
      ) : null}

      {recognition ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold">{labels.legacyRecognition}</h3>
          {recognition.principle ? <p className="mt-1 text-xs text-gray-600">{recognition.principle}</p> : null}
          {recognition.optional ? (
            <p className="mt-1 text-xs text-amber-800">{labels.legacyRecognitionOptional}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {(recognition.experiences ?? []).map((exp) => (
              <li key={exp.key ?? exp.label}>
                <span className="font-medium">
                  {exp.emoji} {exp.label}
                </span>
                {exp.description ? <span className="text-gray-600"> — {exp.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {reflection ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm">
          <h3 className="font-semibold">{labels.legacySelfLoveReflection}</h3>
          {reflection.principle ? <p className="mt-2 text-gray-700">{reflection.principle}</p> : null}
          <ul className="mt-3 space-y-2">
            {(reflection.prompts ?? []).map((item) => (
              <li key={item.prompt} className="text-gray-700">
                {item.emoji} {item.prompt}
              </li>
            ))}
          </ul>
          {reflection.route ? (
            <Link href={reflection.route} className="mt-3 inline-block text-rose-700 underline">
              {labels.selfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {center.self_love ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm">
          <h3 className="font-semibold">{labels.selfLoveConnection}</h3>
          {center.self_love.principle ? <p className="mt-2 text-gray-700">{center.self_love.principle}</p> : null}
          {(center.self_love.examples ?? []).map((ex) => (
            <p key={ex.example} className="mt-1 text-gray-600">
              {ex.emoji} {ex.example}
            </p>
          ))}
        </section>
      ) : null}

      {center.trust ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.legacyTrust}</h3>
          {center.trust.principle ? <p className="mt-2 text-gray-600">{center.trust.principle}</p> : null}
          {(center.trust.experts_should_understand ?? []).length > 0 ? (
            <ul className="mt-3 list-inside list-disc text-gray-600">
              {center.trust.experts_should_understand!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <SuccessCriteriaList criteria={center.success_criteria} labels={labels} />

      {(center.integration_links ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {center.integration_links!.map((link) => (
              <li key={link.key ?? link.route}>
                {link.route ? (
                  <Link href={link.route} className="font-medium text-indigo-700 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium">{link.label}</span>
                )}
                {link.note ? <p className="text-xs text-gray-500">{link.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(center.vision ?? []).length > 0 ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-3 list-inside list-disc text-sm text-indigo-900">
            {center.vision!.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
