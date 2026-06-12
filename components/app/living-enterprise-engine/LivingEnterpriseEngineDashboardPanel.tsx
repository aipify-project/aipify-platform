"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseLivingEnterpriseDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type FlourishingSnapshot,
  type IntegrationLink,
  type LivingEnterpriseDashboard,
  type LivingMemoryEntry,
  type StewardshipReview,
} from "@/lib/aipify/living-enterprise-engine";

type LivingEnterpriseEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-teal-900">{objective.description}</p>
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
    case "reviewed":
    case "published":
      return "bg-teal-100 text-teal-800";
    case "developing":
    case "in_review":
    case "draft":
      return "bg-amber-100 text-amber-800";
    case "needs_attention":
    case "emerging":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function ReviewRow({ review }: { review: StewardshipReview }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-teal-900">
          {review.title ?? review.review_type?.replace(/_/g, " ")}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(review.readiness_signal)}`}>
          {review.readiness_signal?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-teal-800">{review.summary}</p>
    </div>
  );
}

function FlourishingRow({ snapshot }: { snapshot: FlourishingSnapshot }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-sky-900">
          {snapshot.title ?? snapshot.dimension_type?.replace(/_/g, " ")}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(snapshot.status)}`}>
          {snapshot.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-sky-800">{snapshot.summary}</p>
    </div>
  );
}

function MemoryRow({ entry }: { entry: LivingMemoryEntry }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">{entry.title}</span>
        <span className="text-xs text-violet-700">{entry.memory_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{entry.summary}</p>
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
              <Link href={item.cross_link} className="mt-1 inline-block text-xs text-teal-700 underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function LivingEnterpriseEngineDashboardPanel({
  labels,
}: LivingEnterpriseEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<LivingEnterpriseDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/living-enterprise-engine/dashboard");
    if (res.ok) setDashboard(parseLivingEnterpriseDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const eraLinks: IntegrationLink[] =
    dashboard.letebp160_era_capstone_summary ?? dashboard.integration_links ?? [];
  const extendedLinks: IntegrationLink[] = dashboard.letebp160_extended_cross_links ?? [];
  const limitationItems = dashboard.companion_limitations_meta?.must_avoid ?? [];
  const companionMustNot = Array.isArray(dashboard.transcendence_companion_meta?.must_not)
    ? (dashboard.transcendence_companion_meta.must_not as string[])
    : [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5">
        <h2 className="text-sm font-semibold text-teal-900">{labels.blueprintTitle}</h2>
        {dashboard.implementation_blueprint?.phase ? (
          <p className="mt-1 text-xs text-teal-700">
            {dashboard.implementation_blueprint.phase}
            {dashboard.implementation_blueprint.engine_phase
              ? ` · ${dashboard.implementation_blueprint.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.living_enterprise_mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.living_enterprise_mission}</p>
        ) : null}
        {dashboard.living_enterprise_philosophy ? (
          <p className="mt-2 text-sm text-teal-900">{dashboard.living_enterprise_philosophy}</p>
        ) : null}
        {dashboard.living_enterprise_distinction_note ? (
          <p className="mt-2 text-xs text-teal-700">{dashboard.living_enterprise_distinction_note}</p>
        ) : null}
        {dashboard.living_enterprise_vision ? (
          <p className="mt-2 text-xs italic text-teal-800">{dashboard.living_enterprise_vision}</p>
        ) : null}
      </section>

      {eraLinks.length > 0 ? (
        <section className="rounded-xl border-2 border-teal-300 bg-gradient-to-br from-teal-100/80 to-white p-5">
          <h2 className="text-lg font-semibold text-teal-950">{labels.eraCapstoneBanner}</h2>
          <p className="mt-1 text-sm text-teal-800">{labels.eraCrossLinksNote}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {eraLinks.map((link) =>
              link.route ? (
                <Link
                  key={link.route + (link.key ?? "")}
                  href={link.route}
                  className="rounded-lg border border-teal-200 bg-white/80 px-3 py-2 text-sm hover:border-teal-300"
                >
                  <span className="font-medium text-teal-900">
                    {link.phase ? `Phase ${link.phase} · ` : ""}
                    {link.label ?? link.route}
                  </span>
                  {link.description ? (
                    <p className="mt-1 text-xs text-teal-700">{link.description}</p>
                  ) : link.relationship ? (
                    <p className="mt-1 text-xs text-teal-700">{link.relationship}</p>
                  ) : null}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-800">{labels.livingEnterpriseCenter}</p>
            <p className="text-3xl font-bold text-teal-900">{dashboard.living_enterprise_score ?? 0}</p>
            <p className="mt-1 text-sm text-teal-700">{dashboard.philosophy}</p>
            {dashboard.human_oversight_required ? (
              <p className="mt-2 text-xs text-teal-600">{labels.humanOversightRequired}</p>
            ) : null}
            {dashboard.reflection_opt_in ? (
              <p className="mt-1 text-xs text-teal-600">{labels.reflectionOptIn}</p>
            ) : null}
          </div>
          <div className="rounded-lg border border-teal-200 bg-white/90 px-4 py-3 text-center">
            <p className="text-xs text-teal-600">{labels.currentReadinessLevel}</p>
            <p className="text-2xl font-bold text-teal-900">{dashboard.living_readiness_level ?? 1}</p>
            <p className="text-xs capitalize text-teal-700">
              {dashboard.maturity_stage?.replace(/_/g, " ")}
            </p>
            <p className="text-xs text-teal-700">{labels.maturityNotRanking}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.stewardshipReviews}</span>
            <p className="font-semibold">{dashboard.stewardship_reviews_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.flourishingSnapshots}</span>
            <p className="font-semibold">{dashboard.flourishing_snapshots_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.livingMemory}</span>
            <p className="font-semibold">{dashboard.living_memory_count ?? 0}</p>
          </div>
        </div>
        {dashboard.living_enterprise_privacy_note ? (
          <p className="mt-3 text-xs text-teal-700">{dashboard.living_enterprise_privacy_note}</p>
        ) : null}
      </div>

      {extendedLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.extendedCrossLinks}</h2>
          <div className="flex flex-wrap gap-2">
            {extendedLinks.map((link) =>
              link.route ? (
                <Link
                  key={link.route + (link.key ?? "")}
                  href={link.route}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                >
                  {link.label ?? link.route}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.livingEnterpriseCenterCapabilities}
        meta={dashboard.living_enterprise_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.transcendenceEngine}
        meta={dashboard.transcendence_engine_meta}
        itemsKey="questions"
      />

      <MetaListSection
        title={labels.livingSystemsFramework}
        meta={dashboard.living_systems_framework_meta}
        itemsKey="dimensions"
      />

      <MetaListSection
        title={labels.enterpriseFlourishing}
        meta={dashboard.enterprise_flourishing_engine_meta}
        itemsKey="dimensions"
      />

      <MetaListSection
        title={labels.transcendenceCompanion}
        meta={dashboard.transcendence_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.stewardshipMaturity}
        meta={dashboard.stewardship_maturity_engine_meta}
        itemsKey="stages"
      />

      <MetaListSection
        title={labels.collectiveFlourishing}
        meta={dashboard.collective_flourishing_framework_meta}
        itemsKey="stakeholders"
      />

      <MetaListSection
        title={labels.livingMemoryEngine}
        meta={dashboard.living_memory_engine_meta}
        itemsKey="memory_types"
      />

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

      {dashboard.flourishing_snapshots.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.flourishingSection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.flourishing_snapshots.map((snapshot) => (
              <FlourishingRow key={snapshot.id} snapshot={snapshot} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.living_memory_entries.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.livingMemorySection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.living_memory_entries.map((entry) => (
              <MemoryRow key={entry.id} entry={entry} />
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

      {dashboard.living_enterprise_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.living_enterprise_objectives.map((objective) => (
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

      {dashboard.living_enterprise_success_criteria?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          <div className="space-y-2">
            {dashboard.living_enterprise_success_criteria.map((criterion) => (
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
