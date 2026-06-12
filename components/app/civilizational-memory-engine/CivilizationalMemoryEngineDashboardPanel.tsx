"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCivilizationalMemoryDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type IntegrationLink,
  type LegacyEntry,
  type MemoryArchive,
  type CivilizationalMemoryDashboard,
  type StewardshipReview,
} from "@/lib/aipify/civilizational-memory-engine";

type CivilizationalMemoryEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

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
      return "bg-amber-100 text-amber-800";
    case "developing":
    case "in_review":
    case "draft":
      return "bg-stone-100 text-stone-700";
    case "needs_attention":
    case "emerging":
    case "outdated":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function ArchiveRow({ archive }: { archive: MemoryArchive }) {
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-amber-900">{archive.title}</span>
        <span className="text-xs text-amber-700">{archive.archive_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-amber-800">{archive.summary}</p>
    </div>
  );
}

function ReviewRow({ review }: { review: StewardshipReview }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">
          {review.title ?? review.review_type?.replace(/_/g, " ")}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(review.curation_signal)}`}>
          {review.curation_signal?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{review.summary}</p>
    </div>
  );
}

function LegacyRow({ entry }: { entry: LegacyEntry }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50/50 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-stone-900">{entry.title}</span>
        <span className="text-xs text-stone-700">{entry.entry_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-stone-800">{entry.summary}</p>
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
              <Link href={item.cross_link} className="mt-1 inline-block text-xs text-amber-700 underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function CivilizationalMemoryEngineDashboardPanel({
  labels,
}: CivilizationalMemoryEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<CivilizationalMemoryDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/civilizational-memory-engine/dashboard");
    if (res.ok) setDashboard(parseCivilizationalMemoryDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] =
    dashboard.gcmebp163_integration_links ?? dashboard.integration_links ?? [];
  const limitationItems = dashboard.companion_limitations_meta?.must_avoid ?? [];
  const companionMustNot = Array.isArray(dashboard.memory_companion_meta?.must_not)
    ? (dashboard.memory_companion_meta.must_not as string[])
    : [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
        <h2 className="text-sm font-semibold text-amber-900">{labels.blueprintTitle}</h2>
        {dashboard.implementation_blueprint?.phase ? (
          <p className="mt-1 text-xs text-amber-700">
            {dashboard.implementation_blueprint.phase}
            {dashboard.implementation_blueprint.engine_phase
              ? ` · ${dashboard.implementation_blueprint.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.civilizational_memory_mission ? (
          <p className="mt-2 text-sm font-medium text-amber-900">{dashboard.civilizational_memory_mission}</p>
        ) : null}
        {dashboard.civilizational_memory_philosophy ? (
          <p className="mt-2 text-sm text-amber-900">{dashboard.civilizational_memory_philosophy}</p>
        ) : null}
        {dashboard.civilizational_memory_distinction_note ? (
          <p className="mt-2 text-xs text-amber-700">{dashboard.civilizational_memory_distinction_note}</p>
        ) : null}
        {dashboard.civilizational_memory_vision ? (
          <p className="mt-2 text-xs italic text-amber-800">{dashboard.civilizational_memory_vision}</p>
        ) : null}
      </section>

      {integrationLinks.length > 0 ? (
        <section className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-100/80 to-white p-5">
          <h2 className="text-lg font-semibold text-amber-950">{labels.eraCrossLinksBanner}</h2>
          <p className="mt-1 text-sm text-amber-800">{labels.eraCrossLinksNote}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {integrationLinks.map((link) =>
              link.route ? (
                <Link
                  key={link.route + (link.key ?? "")}
                  href={link.route}
                  className="rounded-lg border border-amber-200 bg-white/80 px-3 py-2 text-sm hover:border-amber-300"
                >
                  <span className="font-medium text-amber-900">
                    {link.phase ? `Phase ${link.phase} · ` : ""}
                    {link.label ?? link.route}
                  </span>
                  {link.description ? (
                    <p className="mt-1 text-xs text-amber-700">{link.description}</p>
                  ) : link.note ? (
                    <p className="mt-1 text-xs text-amber-700">{link.note}</p>
                  ) : null}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-amber-800">{labels.civilizationalMemoryCenter}</p>
            <p className="text-3xl font-bold text-amber-900">{dashboard.civilizational_memory_score ?? 0}</p>
            <p className="mt-1 text-sm text-amber-700">{dashboard.philosophy}</p>
            {dashboard.human_oversight_required ? (
              <p className="mt-2 text-xs text-amber-600">{labels.humanOversightRequired}</p>
            ) : null}
            {dashboard.discernment_required ? (
              <p className="mt-1 text-xs text-amber-600">{labels.discernmentRequired}</p>
            ) : null}
          </div>
          <div className="rounded-lg border border-amber-200 bg-white/90 px-4 py-3 text-center">
            <p className="text-xs text-amber-600">{labels.currentReadinessLevel}</p>
            <p className="text-2xl font-bold text-amber-900">{dashboard.preservation_readiness_level ?? 1}</p>
            <p className="text-xs capitalize text-amber-700">
              {dashboard.curation_stage?.replace(/_/g, " ")}
            </p>
            <p className="text-xs text-amber-700">{labels.notDigitalClutter}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-amber-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-amber-600">{labels.knowledgeArchives}</span>
            <p className="font-semibold">{dashboard.archives_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-amber-600">{labels.stewardshipReviews}</span>
            <p className="font-semibold">{dashboard.stewardship_reviews_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-amber-600">{labels.legacyEntries}</span>
            <p className="font-semibold">{dashboard.legacy_entries_count ?? 0}</p>
          </div>
        </div>
        {dashboard.civilizational_memory_privacy_note ? (
          <p className="mt-3 text-xs text-amber-700">{dashboard.civilizational_memory_privacy_note}</p>
        ) : null}
      </div>

      <MetaListSection
        title={labels.civilizationalMemoryCenterCapabilities}
        meta={dashboard.civilizational_memory_center_meta}
        itemsKey="capabilities"
      />

      {Array.isArray(dashboard.knowledge_preservation_engine_meta) ? (
        <MetaListSection
          title={labels.knowledgePreservationEngine}
          meta={{ items: dashboard.knowledge_preservation_engine_meta }}
          itemsKey="items"
        />
      ) : null}

      <MetaListSection
        title={labels.wisdomCurationFramework}
        meta={dashboard.wisdom_curation_framework_meta}
        itemsKey="dimensions"
      />

      <MetaListSection
        title={labels.institutionalMemoryNetworks}
        meta={dashboard.institutional_memory_networks_meta}
        itemsKey="networks"
      />

      <MetaListSection
        title={labels.memoryCompanion}
        meta={dashboard.memory_companion_meta}
        itemsKey="capabilities"
      />

      {Array.isArray(dashboard.knowledge_stewardship_engine_meta) ? (
        <MetaListSection
          title={labels.knowledgeStewardshipEngine}
          meta={{ items: dashboard.knowledge_stewardship_engine_meta }}
          itemsKey="items"
        />
      ) : null}

      <MetaListSection
        title={labels.legacyLibraryEngine}
        meta={dashboard.legacy_library_engine_meta}
        itemsKey="entry_types"
      />

      {dashboard.memory_archives.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.knowledgeArchivesSection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.memory_archives.map((archive) => (
              <ArchiveRow key={archive.id} archive={archive} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.stewardship_reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.stewardshipReviewsSection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.stewardship_reviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.legacy_entries.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.legacyEntriesSection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.legacy_entries.map((entry) => (
              <LegacyRow key={entry.id} entry={entry} />
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

      {dashboard.civilizational_memory_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.civilizational_memory_objectives.map((objective) => (
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

      {dashboard.civilizational_memory_success_criteria?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          <div className="space-y-2">
            {dashboard.civilizational_memory_success_criteria.map((criterion) => (
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
