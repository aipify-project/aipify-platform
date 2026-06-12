"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseConstructiveDialogueDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type ConstructiveDialogueDashboard,
  type DialogueMemoryEntry,
  type DialogueProgram,
  type DialogueReview,
  type IntegrationLink,
} from "@/lib/aipify/constructive-dialogue-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-sky-900">{objective.description}</p>
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
    case "published":
      return "bg-sky-100 text-sky-800";
    case "developing":
    case "in_review":
    case "draft":
    case "active":
      return "bg-amber-100 text-amber-800";
    case "needs_attention":
    case "emerging":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
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
              <Link href={item.cross_link} className="mt-1 inline-block text-xs text-sky-700 underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProgramRow({ program }: { program: DialogueProgram }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-sky-900">{program.title}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(program.dialogue_signal)}`}>
          {program.dialogue_signal?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-sky-800">{program.summary}</p>
    </div>
  );
}

function ReviewRow({ review }: { review: DialogueReview }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">
          {review.title ?? review.review_type?.replace(/_/g, " ")}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(review.dialogue_signal)}`}>
          {review.dialogue_signal?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{review.summary}</p>
    </div>
  );
}

function MemoryRow({ entry }: { entry: DialogueMemoryEntry }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-teal-900">{entry.title}</span>
        <span className="text-xs text-teal-700">{entry.memory_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-teal-800">{entry.summary}</p>
    </div>
  );
}

export function ConstructiveDialogueEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ConstructiveDialogueDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/constructive-dialogue-engine/dashboard");
    if (res.ok) {
      setDashboard(parseConstructiveDialogueDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.cpdebp168_integration_links?.length
      ? dashboard.cpdebp168_integration_links
      : dashboard.integration_links;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.blueprintTitle}</h2>
        <p className="mt-1 text-xs text-sky-800">{labels.eraCrossLinksBanner}</p>
        <p className="mt-2 text-2xl font-bold text-sky-900">
          {dashboard.constructive_dialogue_score ?? 0}
        </p>
        <p className="text-xs text-sky-700">{labels.constructiveDialogueCenter}</p>
        {dashboard.constructive_dialogue_mission ? (
          <p className="mt-2 text-sm font-medium text-sky-900">
            {dashboard.constructive_dialogue_mission}
          </p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-sky-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-sky-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.constructive_dialogue_vision ? (
          <p className="mt-2 text-xs italic text-sky-800">{dashboard.constructive_dialogue_vision}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.currentReadinessLevel}:</span>{" "}
            {dashboard.dialogue_readiness_level}
          </div>
          <div>
            <span className="font-medium">{labels.dialoguePrograms}:</span>{" "}
            {dashboard.dialogue_programs_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.dialogueReviews}:</span>{" "}
            {dashboard.dialogue_reviews_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.dialogueMemory}:</span>{" "}
            {dashboard.dialogue_memory_count ?? 0}
          </div>
        </div>
        {dashboard.human_oversight_required ? (
          <p className="mt-3 text-xs text-sky-800">{labels.humanOversightRequired}</p>
        ) : null}
        {dashboard.reflection_opt_in ? (
          <p className="mt-1 text-xs text-sky-800">{labels.reflectionOptIn}</p>
        ) : null}
        <p className="mt-2 text-xs text-sky-800">{labels.notForcedAgreement}</p>
        {dashboard.safety_note ? (
          <p className="mt-2 text-xs text-sky-800">{dashboard.safety_note}</p>
        ) : null}
        <p className="mt-2 text-xs text-sky-700">{labels.eraCrossLinksNote}</p>
      </section>

      <MetaListSection
        title={labels.constructiveDialogueCenterCapabilities}
        meta={dashboard.constructive_dialogue_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.peacebuildingEngine}
        meta={dashboard.peacebuilding_engine_meta}
        itemsKey="principles"
      />

      <MetaListSection
        title={labels.conflictNavigation}
        meta={dashboard.conflict_navigation_framework_meta}
        itemsKey="dimensions"
      />

      <MetaListSection
        title={labels.executiveDialogueReviews}
        meta={dashboard.executive_dialogue_reviews_meta}
        itemsKey="review_questions"
      />

      <MetaListSection
        title={labels.dialogueCompanion}
        meta={dashboard.dialogue_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.perspectiveExpansion}
        meta={dashboard.perspective_expansion_engine_meta}
        itemsKey="sources"
      />

      <MetaListSection
        title={labels.relationshipResilience}
        meta={dashboard.relationship_resilience_engine_meta}
        itemsKey="initiatives"
      />

      <MetaListSection
        title={labels.dialogueMemoryEngine}
        meta={dashboard.dialogue_memory_engine_meta}
        itemsKey="memory_types"
      />

      {dashboard.dialogue_programs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dialogueProgramsSection}</h2>
          <div className="space-y-2">
            {dashboard.dialogue_programs.map((program) => (
              <ProgramRow key={program.id} program={program} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.dialogue_reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dialogueReviewsSection}</h2>
          <div className="space-y-2">
            {dashboard.dialogue_reviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.dialogue_memory_entries.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dialogueMemorySection}</h2>
          <div className="space-y-2">
            {dashboard.dialogue_memory_entries.map((entry) => (
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
                  <Link href={link.route} className="font-medium text-sky-800 hover:underline">
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

      {dashboard.constructive_dialogue_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.constructive_dialogue_objectives.map((objective) => (
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

      {dashboard.constructive_dialogue_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.constructive_dialogue_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.constructive_dialogue_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.constructive_dialogue_privacy_note}</p>
      ) : null}
    </div>
  );
}
