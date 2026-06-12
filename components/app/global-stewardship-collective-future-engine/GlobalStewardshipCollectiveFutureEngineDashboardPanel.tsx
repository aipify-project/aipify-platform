"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGlobalStewardshipDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type ExecutiveStewardshipReview,
  type GlobalStewardshipDashboard,
  type IntegrationLink,
  type StewardshipFutureScenario,
} from "@/lib/aipify/global-stewardship-collective-future-engine";

type GlobalStewardshipCollectiveFutureEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

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
      return "bg-emerald-100 text-emerald-800";
    case "developing":
    case "exploring":
    case "in_review":
      return "bg-amber-100 text-amber-800";
    case "needs_attention":
    case "emerging":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function ReviewRow({ review }: { review: ExecutiveStewardshipReview }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-emerald-900">{review.title ?? review.review_type?.replace(/_/g, " ")}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(review.readiness_signal)}`}>
          {review.readiness_signal?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-xs text-emerald-800">{review.summary}</p>
    </div>
  );
}

function ScenarioRow({ scenario }: { scenario: StewardshipFutureScenario }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-sky-900">{scenario.title ?? scenario.scenario_type?.replace(/_/g, " ")}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(scenario.status)}`}>
          {scenario.horizon?.replace(/_/g, " ")} · {scenario.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-sky-800">{scenario.summary}</p>
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
  const items = Array.isArray(meta?.[itemsKey]) ? (meta[itemsKey] as Array<Record<string, unknown>>) : [];
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {typeof meta?.principle === "string" ? <p className="text-sm text-gray-600">{meta.principle}</p> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={String(item.key ?? item.label)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
            <span className="font-medium text-gray-900">{String(item.label ?? item.key)}</span>
            {typeof item.description === "string" ? (
              <p className="mt-1 text-xs text-gray-600">{item.description}</p>
            ) : null}
            {typeof item.cross_link === "string" ? (
              <Link href={item.cross_link} className="mt-1 inline-block text-xs text-emerald-700 underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function GlobalStewardshipCollectiveFutureEngineDashboardPanel({
  labels,
}: GlobalStewardshipCollectiveFutureEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<GlobalStewardshipDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/global-stewardship-collective-future-engine/dashboard");
    if (res.ok) setDashboard(parseGlobalStewardshipDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const eraLinks: IntegrationLink[] =
    dashboard.gscfebp150_era_capstone_summary ?? dashboard.integration_links ?? [];
  const extendedLinks: IntegrationLink[] = dashboard.gscfebp150_extended_cross_links ?? [];
  const limitationItems = dashboard.companion_limitations_meta?.must_avoid ?? [];
  const companionMustNot = Array.isArray(dashboard.stewardship_companion_meta?.must_not)
    ? (dashboard.stewardship_companion_meta.must_not as string[])
    : [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
        <h2 className="text-sm font-semibold text-emerald-900">{labels.blueprintTitle}</h2>
        {dashboard.implementation_blueprint?.phase ? (
          <p className="mt-1 text-xs text-emerald-700">
            {dashboard.implementation_blueprint.phase}
            {dashboard.implementation_blueprint.engine_phase
              ? ` · ${dashboard.implementation_blueprint.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.global_stewardship_mission ? (
          <p className="mt-2 text-sm font-medium text-emerald-900">{dashboard.global_stewardship_mission}</p>
        ) : null}
        {dashboard.global_stewardship_philosophy ? (
          <p className="mt-2 text-sm text-emerald-900">{dashboard.global_stewardship_philosophy}</p>
        ) : null}
        {dashboard.global_stewardship_distinction_note ? (
          <p className="mt-2 text-xs text-emerald-700">{dashboard.global_stewardship_distinction_note}</p>
        ) : null}
        {dashboard.global_stewardship_vision ? (
          <p className="mt-2 text-xs italic text-emerald-800">{dashboard.global_stewardship_vision}</p>
        ) : null}
      </section>

      {eraLinks.length > 0 ? (
        <section className="rounded-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-100/80 to-white p-5">
          <h2 className="text-lg font-semibold text-emerald-950">{labels.eraCapstoneBanner}</h2>
          <p className="mt-1 text-sm text-emerald-800">{labels.eraCrossLinksNote}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {eraLinks.map((link) =>
              link.route ? (
                <Link
                  key={link.route + (link.key ?? "")}
                  href={link.route}
                  className="rounded-lg border border-emerald-200 bg-white/80 px-3 py-2 text-sm hover:border-emerald-300"
                >
                  <span className="font-medium text-emerald-900">
                    {link.phase ? `Phase ${link.phase} · ` : ""}
                    {link.label ?? link.route}
                  </span>
                  {link.description ? (
                    <p className="mt-1 text-xs text-emerald-700">{link.description}</p>
                  ) : link.relationship ? (
                    <p className="mt-1 text-xs text-emerald-700">{link.relationship}</p>
                  ) : null}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-800">{labels.stewardshipCenter}</p>
            <p className="text-3xl font-bold text-emerald-900">{dashboard.stewardship_score ?? 0}</p>
            <p className="mt-1 text-sm text-emerald-700">{dashboard.philosophy}</p>
            {dashboard.human_oversight_required ? (
              <p className="mt-2 text-xs text-emerald-600">{labels.humanOversightRequired}</p>
            ) : null}
            {dashboard.reflection_opt_in ? (
              <p className="mt-1 text-xs text-emerald-600">{labels.reflectionOptIn}</p>
            ) : null}
          </div>
          <div className="rounded-lg border border-emerald-200 bg-white/90 px-4 py-3 text-center">
            <p className="text-xs text-emerald-600">{labels.currentMaturityLevel}</p>
            <p className="text-2xl font-bold text-emerald-900">{dashboard.stewardship_maturity_level ?? 1}</p>
            <p className="text-xs text-emerald-700">{labels.wisdomBeforeSpeed}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.executiveReviews}</span>
            <p className="font-semibold">{dashboard.executive_reviews_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.futureScenarios}</span>
            <p className="font-semibold">{dashboard.future_scenarios_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-emerald-600">{labels.readinessLevel}</span>
            <p className="font-semibold capitalize">{dashboard.readiness_level ?? "emerging"}</p>
          </div>
        </div>
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
        title={labels.globalStewardshipCenter}
        meta={dashboard.global_stewardship_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.collectiveFutureEngine}
        meta={dashboard.collective_future_engine_meta}
        itemsKey="questions"
      />

      <MetaListSection
        title={labels.longTermThinkingFramework}
        meta={dashboard.long_term_thinking_framework_meta}
        itemsKey="horizons"
      />

      <MetaListSection
        title={labels.globalResponsibilityPrinciples}
        meta={dashboard.global_responsibility_principles_meta}
        itemsKey="principles"
      />

      <MetaListSection
        title={labels.collectiveResilienceEngine}
        meta={dashboard.collective_resilience_engine_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.executiveStewardshipReviewsMeta}
        meta={dashboard.executive_stewardship_reviews_meta}
        itemsKey="dimensions"
      />

      {dashboard.legacy_intelligence_engine_meta ? (
        <section className="rounded-xl border border-violet-100 bg-violet-50/40 p-4">
          <h2 className="text-sm font-semibold text-violet-900">{labels.legacyIntelligence}</h2>
          {typeof dashboard.legacy_intelligence_engine_meta.principle === "string" ? (
            <p className="mt-2 text-sm text-violet-800">
              {dashboard.legacy_intelligence_engine_meta.principle as string}
            </p>
          ) : null}
          {typeof dashboard.legacy_intelligence_engine_meta.legacy_route === "string" ? (
            <Link
              href={dashboard.legacy_intelligence_engine_meta.legacy_route as string}
              className="mt-2 inline-block text-sm text-violet-700 underline"
            >
              {labels.legacyCrossLink}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.executive_reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveReviewsSection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.executive_reviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.future_scenarios.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.futureScenariosSection}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.future_scenarios.map((scenario) => (
              <ScenarioRow key={scenario.id} scenario={scenario} />
            ))}
          </div>
        </section>
      ) : null}

      {typeof dashboard.self_love_connection_meta?.principle === "string" ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
          <h2 className="text-sm font-semibold text-rose-900">{labels.selfLoveConnection}</h2>
          <p className="mt-2 text-sm text-rose-800">{dashboard.self_love_connection_meta.principle as string}</p>
        </section>
      ) : null}

      {dashboard.global_stewardship_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.global_stewardship_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {(limitationItems.length > 0 || companionMustNot.length > 0) ? (
        <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.companionLimitations}</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
            {[...limitationItems, ...companionMustNot].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.global_stewardship_success_criteria?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.global_stewardship_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.global_stewardship_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.global_stewardship_privacy_note}</p>
      ) : null}
    </div>
  );
}
