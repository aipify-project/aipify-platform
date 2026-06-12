"use client";

import Link from "next/link";
import type {
  CommunitySuccessCriterion,
  SalesExpertCommunityCenter,
} from "@/lib/aipify/sales-expert-operating-system";

type Props = {
  center?: SalesExpertCommunityCenter;
  labels: Record<string, string>;
};

function SuccessCriteriaList({
  criteria,
  labels,
}: {
  criteria?: CommunitySuccessCriterion[];
  labels: Record<string, string>;
}) {
  if (!criteria || criteria.length === 0) return null;
  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold">{labels.communitySuccessCriteria}</h3>
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

export function SalesCommunityTab({ center, labels }: Props) {
  if (!center) {
    return <p className="text-sm text-gray-600">{labels.loading}</p>;
  }

  const summary = center.summary;
  const hub = center.community_hub;
  const mentorship = center.mentorship_program;
  const recognition = center.community_recognition;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.communityTitle}</h2>
        {center.mission ? (
          <p className="mt-2 text-sm font-medium text-violet-900">
            {labels.communityMission}: {center.mission}
          </p>
        ) : null}
        {center.philosophy ? (
          <p className="mt-2 text-sm text-violet-800">{center.philosophy}</p>
        ) : null}
        {center.abos_principle ? (
          <p className="mt-2 text-xs text-violet-800">
            {labels.communityAbosPrinciple}: {center.abos_principle}
          </p>
        ) : null}
        {center.distinction_note ? (
          <p className="mt-2 text-xs text-violet-700">
            {labels.communityDistinctionNote}: {center.distinction_note}
          </p>
        ) : null}
      </section>

      {summary ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.communitySummary}</h3>
          {summary.privacy_note ? (
            <p className="mt-1 text-xs text-gray-500">{summary.privacy_note}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.communityStoriesCount}</p>
              <p className="text-lg font-semibold">{summary.stories_count ?? 0}</p>
            </div>
            <div className="rounded border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.communityActiveMentorships}</p>
              <p className="text-lg font-semibold">{summary.active_mentorships ?? 0}</p>
            </div>
            <div className="rounded border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.communityContributors}</p>
              <p className="text-lg font-semibold">{summary.contributors_count ?? 0}</p>
            </div>
            <div className="rounded border border-gray-100 p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.communityRegionalGroup}</p>
              <p className="text-lg font-semibold capitalize">{summary.regional_group ?? "—"}</p>
            </div>
          </div>
          {center.settings?.mentorship_enabled === false ? (
            <p className="mt-2 text-xs text-amber-700">{labels.communityMentorshipDisabled}</p>
          ) : (
            <p className="mt-2 text-xs text-emerald-700">{labels.communityMentorshipVoluntary}</p>
          )}
        </section>
      ) : null}

      {(center.objectives ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.communityObjectives}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {center.objectives!.map((obj) => (
              <li key={obj.key ?? obj.label}>
                <span className="font-medium">{obj.label}</span>
                {obj.description ? <span className="text-gray-600"> — {obj.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {mentorship ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.communityMentorshipProgram}</h3>
          {mentorship.principle ? <p className="mt-1 text-xs text-gray-500">{mentorship.principle}</p> : null}
          {mentorship.matching_note ? (
            <p className="mt-2 text-sm text-gray-700">{mentorship.matching_note}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {(mentorship.guidance_areas ?? []).map((area) => (
              <li key={area.key ?? area.label}>
                <span className="font-medium">{area.label}</span>
                {area.note ? <span className="text-gray-600"> — {area.note}</span> : null}
              </li>
            ))}
          </ul>
          {(center.mentorship_links ?? []).length > 0 ? (
            <ul className="mt-4 space-y-2 text-xs text-gray-600">
              {center.mentorship_links!.map((link) => (
                <li key={link.id} className="rounded border border-gray-100 px-2 py-1">
                  {labels.communityMentorshipStatus}: {link.status}
                  {link.voluntary ? ` · ${labels.communityMentorshipVoluntary}` : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-gray-500">{labels.communityNoMentorshipLinks}</p>
          )}
        </section>
      ) : null}

      {hub ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.communityHub}</h3>
          {hub.principle ? <p className="mt-1 text-xs text-gray-500">{hub.principle}</p> : null}
          <ul className="mt-3 space-y-3 text-sm">
            {(hub.channels ?? []).map((ch) => (
              <li key={ch.key} className="rounded border border-gray-100 p-3">
                <span className="font-medium">
                  {ch.emoji ? `${ch.emoji} ` : ""}
                  {ch.label}
                </span>
                {ch.example_prompt ? (
                  <p className="mt-1 text-xs italic text-gray-600">{ch.example_prompt}</p>
                ) : null}
              </li>
            ))}
          </ul>
          {(hub.trust_rules ?? []).length > 0 ? (
            <ul className="mt-4 list-inside list-disc text-xs text-gray-600">
              {hub.trust_rules!.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {(center.success_stories ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.communitySuccessStories}</h3>
          <p className="mt-1 text-xs text-gray-500">{labels.communityStoriesEducate}</p>
          <ul className="mt-3 space-y-3">
            {center.success_stories!.map((story) => (
              <li key={story.id ?? story.title} className="rounded border border-gray-100 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{story.title}</span>
                  {story.category ? (
                    <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-800">
                      {story.category}
                    </span>
                  ) : null}
                </div>
                {story.summary ? <p className="mt-2 text-gray-700">{story.summary}</p> : null}
                <p className="mt-1 text-xs text-gray-500">
                  {story.author_display}
                  {story.is_scaffold ? ` · ${labels.metadataScaffold}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {recognition ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold">{labels.communityRecognition}</h3>
          {recognition.principle ? <p className="mt-1 text-xs text-gray-600">{recognition.principle}</p> : null}
          <ul className="mt-3 space-y-2 text-sm">
            {(recognition.badges ?? []).map((badge) => (
              <li key={badge.key}>
                <span className="font-medium">
                  {badge.emoji} {badge.label}
                </span>
                {badge.description ? <span className="text-gray-600"> — {badge.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.sales_coach_connection ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.communityCoachConnection}</h3>
          {center.sales_coach_connection.principle ? (
            <p className="mt-2 text-gray-600">{center.sales_coach_connection.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {(center.sales_coach_connection.recommendations ?? []).map((rec) => (
              <li key={rec.key ?? rec.label}>
                <span className="font-medium">{rec.label}</span>
                {rec.example ? <span className="text-gray-600"> — {rec.example}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.regional_groups ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.communityRegionalGroups}</h3>
          {center.regional_groups.principle ? (
            <p className="mt-1 text-xs text-gray-500">{center.regional_groups.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {(center.regional_groups.groups ?? []).map((group) => (
              <li key={group.key}>
                <span className="font-medium">{group.label}</span>
                {(group.locales ?? []).length > 0 ? (
                  <span className="text-gray-600"> ({group.locales!.join(", ")})</span>
                ) : null}
              </li>
            ))}
          </ul>
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
          {center.self_love.route ? (
            <Link href={center.self_love.route} className="mt-3 inline-block text-violet-700 underline">
              {labels.selfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {center.trust ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.communityTrust}</h3>
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
                  <Link href={link.route} className="font-medium text-violet-700 hover:underline">
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
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-3 list-inside list-disc text-sm text-violet-900">
            {center.vision!.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
