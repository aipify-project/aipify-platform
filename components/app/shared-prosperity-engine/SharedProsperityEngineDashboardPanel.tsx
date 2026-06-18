"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSharedProsperityDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type IntegrationLink,
  type OpportunityInitiative,
  type ProsperityMemoryEntry,
  type SharedProsperityDashboard,
  type StewardshipReview,
} from "@/lib/aipify/shared-prosperity-engine";

type SharedProsperityEngineDashboardPanelProps = {
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
    case "planned":
      return "bg-stone-100 text-stone-700";
    case "needs_attention":
    case "emerging":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function ReviewRow({ review }: { review: StewardshipReview }) {
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-amber-900">
          {review.title ?? review.review_type?.replace(/_/g, " ")}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(review.reflection_signal)}`}>
          {review.reflection_signal?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-amber-800">{review.summary}</p>
    </div>
  );
}

function InitiativeRow({ initiative }: { initiative: OpportunityInitiative }) {
  return (
    <div className="rounded-lg border border-orange-100 bg-orange-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-orange-900">{initiative.title}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(initiative.status)}`}>
          {initiative.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-orange-800">{initiative.summary}</p>
    </div>
  );
}

function MemoryRow({ entry }: { entry: ProsperityMemoryEntry }) {
  return (
    <div className="rounded-lg border border-yellow-100 bg-yellow-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-yellow-900">{entry.title}</span>
        <span className="text-xs text-yellow-700">{entry.memory_type?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-xs text-yellow-800">{entry.summary}</p>
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

export function SharedProsperityEngineDashboardPanel({
  labels,
}: SharedProsperityEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<SharedProsperityDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/shared-prosperity-engine/dashboard");
    if (res.ok) setDashboard(parseSharedProsperityDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const eraLinks: IntegrationLink[] =
    dashboard.cspebp167_era_cross_links ?? dashboard.integration_links ?? [];
  const extendedLinks: IntegrationLink[] = dashboard.cspebp167_extended_cross_links ?? [];
  const limitationItems = dashboard.companion_limitations_meta?.must_avoid ?? [];
  const companionMustNot = Array.isArray(dashboard.stewardship_companion_meta?.must_not)
    ? (dashboard.stewardship_companion_meta.must_not as string[])
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
        {dashboard.shared_prosperity_mission ? (
          <p className="mt-2 text-sm font-medium text-amber-900">{dashboard.shared_prosperity_mission}</p>
        ) : null}
        {dashboard.shared_prosperity_philosophy ? (
          <p className="mt-2 text-sm text-amber-900">{dashboard.shared_prosperity_philosophy}</p>
        ) : null}
        {dashboard.shared_prosperity_distinction_note ? (
          <p className="mt-2 text-xs text-amber-700">{dashboard.shared_prosperity_distinction_note}</p>
        ) : null}
        {dashboard.shared_prosperity_vision ? (
          <p className="mt-2 text-xs italic text-amber-800">{dashboard.shared_prosperity_vision}</p>
        ) : null}
      </section>

      {eraLinks.length > 0 ? (
        <section className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-100/80 to-white p-5">
          <h2 className="text-lg font-semibold text-amber-950">{labels.eraCrossLinksBanner}</h2>
          <p className="mt-1 text-sm text-amber-800">{labels.eraCrossLinksNote}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {eraLinks.map((link) =>
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
                  ) : link.relationship ? (
                    <p className="mt-1 text-xs text-amber-700">{link.relationship}</p>
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
            <p className="text-sm font-medium text-amber-800">{labels.sharedProsperityCenter}</p>
            <p className="text-3xl font-bold text-amber-900">{dashboard.shared_prosperity_score ?? 0}</p>
            <p className="mt-1 text-sm text-amber-700">{dashboard.philosophy}</p>
            {dashboard.human_oversight_required ? (
              <p className="mt-2 text-xs text-amber-600">{labels.humanOversightRequired}</p>
            ) : null}
            {dashboard.reflection_opt_in ? (
              <p className="mt-1 text-xs text-amber-600">{labels.reflectionOptIn}</p>
            ) : null}
          </div>
          <div className="grid gap-2 text-right text-sm">
            <div>
              <span className="text-amber-700">{labels.currentReadinessLevel}</span>
              <p className="font-semibold text-amber-900">{dashboard.prosperity_readiness_level ?? 1}</p>
            </div>
            <div>
              <span className="text-amber-700">{labels.notResourceAllocation}</span>
              <p className="text-xs text-amber-800">{labels.stewardshipNotObligation}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-amber-100 bg-white/70 px-3 py-2">
            <p className="text-xs text-amber-700">{labels.stewardshipReviews}</p>
            <p className="text-lg font-semibold text-amber-900">
              {dashboard.stewardship_reviews_count ?? 0}
            </p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-white/70 px-3 py-2">
            <p className="text-xs text-amber-700">{labels.opportunityInitiatives}</p>
            <p className="text-lg font-semibold text-amber-900">
              {dashboard.opportunity_initiatives_count ?? 0}
            </p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-white/70 px-3 py-2">
            <p className="text-xs text-amber-700">{labels.prosperityMemory}</p>
            <p className="text-lg font-semibold text-amber-900">
              {dashboard.prosperity_memory_count ?? 0}
            </p>
          </div>
        </div>
      </div>

      {extendedLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.extendedCrossLinks}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {extendedLinks.map((link) =>
              link.route ? (
                <Link
                  key={link.route + (link.key ?? "")}
                  href={link.route}
                  className="rounded-lg border border-gray-100 px-3 py-2 text-sm hover:border-amber-200"
                >
                  <span className="font-medium text-gray-900">{link.label ?? link.route}</span>
                  {link.relationship ? (
                    <p className="mt-1 text-xs text-gray-600">{link.relationship}</p>
                  ) : null}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.sharedProsperityCenterCapabilities}
        meta={dashboard.shared_prosperity_center_meta}
        itemsKey="capabilities"
      />
      <MetaListSection
        title={labels.stewardshipEngine}
        meta={dashboard.stewardship_engine_meta}
        itemsKey="questions"
      />
      <MetaListSection
        title={labels.sharedProsperityFramework}
        meta={dashboard.shared_prosperity_framework_meta}
        itemsKey="dimensions"
      />
      <MetaListSection
        title={labels.stewardshipCompanion}
        meta={dashboard.stewardship_companion_meta}
        itemsKey="capabilities"
      />
      <MetaListSection
        title={labels.opportunityDevelopmentEngine}
        meta={dashboard.opportunity_development_engine_meta}
        itemsKey="initiative_types"
      />
      <MetaListSection
        title={labels.ecosystemHealthEngine}
        meta={dashboard.ecosystem_health_engine_meta}
        itemsKey="dimensions"
      />
      <MetaListSection
        title={labels.prosperityMemoryEngine}
        meta={dashboard.prosperity_memory_engine_meta}
        itemsKey="memory_types"
      />

      {dashboard.stewardship_reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.stewardshipReviewsSection}</h2>
          <div className="space-y-2">
            {dashboard.stewardship_reviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.opportunity_initiatives.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.opportunityInitiativesSection}</h2>
          <div className="space-y-2">
            {dashboard.opportunity_initiatives.map((initiative) => (
              <InitiativeRow key={initiative.id} initiative={initiative} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.prosperity_memory_entries.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.prosperityMemorySection}</h2>
          <div className="space-y-2">
            {dashboard.prosperity_memory_entries.map((entry) => (
              <MemoryRow key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.shared_prosperity_objectives && dashboard.shared_prosperity_objectives.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.shared_prosperity_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {(limitationItems.length > 0 || companionMustNot.length > 0) && (
        <section className="rounded-xl border border-rose-100 bg-rose-50/40 p-5">
          <h2 className="text-lg font-semibold text-rose-900">{labels.companionLimitations}</h2>
          {dashboard.companion_limitations_meta?.principle ? (
            <p className="mt-1 text-sm text-rose-800">{dashboard.companion_limitations_meta.principle}</p>
          ) : null}
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-rose-900">
            {[...limitationItems, ...companionMustNot].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.shared_prosperity_success_criteria &&
      dashboard.shared_prosperity_success_criteria.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          <div className="space-y-2">
            {dashboard.shared_prosperity_success_criteria.map((criterion) => (
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
