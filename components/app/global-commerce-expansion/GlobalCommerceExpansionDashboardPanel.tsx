"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGlobalCommerceExpansionDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CompanionGuidanceExample,
  type IntegrationLink,
  type GlobalCommerceExpansionDashboard,
} from "@/lib/aipify/global-commerce-expansion";

type GlobalCommerceExpansionDashboardPanelProps = {
  labels: Record<string, string>;
};

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-slate-800">{objective.description}</p> : null}
    </div>
  );
}

function CompanionGuidanceCard({ example }: { example: CompanionGuidanceExample }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <p className="font-medium">
        {example.emoji ? `${example.emoji} ` : ""}
        {example.prompt}
      </p>
      {example.consideration ? <p className="mt-1 text-xs text-gray-600">{example.consideration}</p> : null}
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
    case "ready":
    case "active":
    case "improving":
    case "informational":
      return "bg-emerald-100 text-emerald-800";
    case "stable":
    case "preparing":
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "early_stage":
    case "monitoring":
    case "important":
      return "bg-orange-100 text-orange-800";
    case "foundational":
    case "not_ready":
    case "critical":
    case "declining":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function GlobalCommerceExpansionDashboardPanel({
  labels,
}: GlobalCommerceExpansionDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<GlobalCommerceExpansionDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/global-commerce-expansion/dashboard");
    if (res.ok) setDashboard(parseGlobalCommerceExpansionDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/global-commerce-expansion/briefings/generate", { method: "POST" });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] = dashboard.gcebp109_integration_links ?? [];
  const limitationItems = dashboard.expansion_limitation_principles?.avoid ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/global-expansion" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.globalExpansion}
        </Link>
        <Link href="/app/multi-store" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.multiStore}
        </Link>
        <Link href="/app/product-automation" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.productAutomation}
        </Link>
        <Link href="/app/commerce-intelligence" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commerceIntelligence}
        </Link>
        <Link href="/app/commerce-performance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commercePerformance}
        </Link>
        <Link href="/app/partners" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.growthPartners}
        </Link>
        <Link href="/app/approvals" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.approvals}
        </Link>
        {integrationLinks.map((link) =>
          link.route ? (
            <Link key={link.route + (link.key ?? "")} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null,
        )}
      </div>

      <section className="rounded-xl border border-slate-300 bg-slate-50/40 p-6">
        <h2 className="text-sm font-semibold text-slate-900">{labels.blueprintTitle}</h2>
        {dashboard.implementation_blueprint_phase109?.phase ? (
          <p className="mt-1 text-xs text-slate-700">
            {dashboard.implementation_blueprint_phase109.phase}
            {dashboard.implementation_blueprint_phase109.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase109.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.global_commerce_expansion_mission ? (
          <p className="mt-2 text-sm font-medium text-slate-900">{dashboard.global_commerce_expansion_mission}</p>
        ) : null}
        {dashboard.global_commerce_expansion_philosophy ? (
          <p className="mt-2 text-sm text-slate-800">{dashboard.global_commerce_expansion_philosophy}</p>
        ) : null}
        {dashboard.global_commerce_expansion_abos_principle ? (
          <p className="mt-2 text-xs text-slate-700">{dashboard.global_commerce_expansion_abos_principle}</p>
        ) : null}
        {dashboard.global_commerce_expansion_distinction_note ? (
          <p className="mt-2 text-xs text-slate-600">{dashboard.global_commerce_expansion_distinction_note}</p>
        ) : null}
        {dashboard.global_commerce_expansion_vision ? (
          <p className="mt-2 text-xs italic text-slate-800">{dashboard.global_commerce_expansion_vision}</p>
        ) : null}
      </section>

      {dashboard.global_commerce_expansion_objectives && dashboard.global_commerce_expansion_objectives.length > 0 ? (
        <section className="rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.global_commerce_expansion_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.expansion_companion_guidance?.examples &&
      dashboard.expansion_companion_guidance.examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionGuidance}</h3>
          {dashboard.expansion_companion_guidance.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.expansion_companion_guidance.principle}</p>
          ) : null}
          <div className="mt-3 space-y-2">
            {dashboard.expansion_companion_guidance.examples.map((example) => (
              <CompanionGuidanceCard key={example.key ?? example.prompt} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {limitationItems.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-6">
          <h3 className="text-sm font-semibold text-amber-900">{labels.limitationPrinciples}</h3>
          {dashboard.expansion_limitation_principles?.principle ? (
            <p className="mt-2 text-sm text-amber-900">{dashboard.expansion_limitation_principles.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {limitationItems.map((item) => (
              <li key={item.key ?? item.label} className="rounded border border-amber-100 px-3 py-2 text-xs text-amber-900">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-amber-800">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.expansion_self_love_connection?.quotes &&
      dashboard.expansion_self_love_connection.quotes.length > 0 ? (
        <section className="rounded-xl border border-sky-200 bg-sky-50/30 p-6">
          <h3 className="text-sm font-semibold text-sky-900">{labels.selfLoveConnection}</h3>
          <ul className="mt-3 space-y-2 text-xs italic text-sky-800">
            {dashboard.expansion_self_love_connection.quotes.map((quote) => (
              <li key={quote}>{quote}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.global_commerce_expansion_success_criteria &&
      dashboard.global_commerce_expansion_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.global_commerce_expansion_success_criteria.map((criterion) => (
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

      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
        <h2 className="text-sm font-semibold text-slate-900">{labels.expansionReadiness}</h2>
        <p className="mt-2 text-4xl font-bold text-slate-800">
          {dashboard.expansion_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium capitalize text-slate-700">
          {dashboard.readiness_classification?.replace(/_/g, " ")} · {dashboard.active_markets ?? 0}{" "}
          {labels.activeMarkets} · {dashboard.preparing_markets ?? 0} {labels.preparingMarkets}
        </p>
        <p className="mt-2 text-sm text-slate-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-slate-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.emergingOpportunities, value: dashboard.emerging_opportunities ?? 0 },
          { label: labels.localizationGuidance, value: dashboard.localization_guidance_count ?? 0 },
          { label: labels.regulatoryNotes, value: dashboard.regulatory_notes_count ?? 0 },
          { label: labels.recommendationsPending, value: dashboard.recommendations_pending ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      {dashboard.market_profiles.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.marketProfiles}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.market_profiles.map((m) => (
              <article key={m.id} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-indigo-900">{m.market_name}</p>
                  <span className="text-sm font-bold text-indigo-700">{m.readiness_score}/100</span>
                </div>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(m.status)}`}>
                  {m.status?.replace(/_/g, " ")}
                </span>
                <p className="mt-2 text-xs text-indigo-800">
                  {m.region} · {m.currency}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.readiness_assessments.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.readinessAssessments}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.readiness_assessments.map((a) => (
              <li key={a.id} className="rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-blue-900">{a.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(a.readiness_level)}`}>
                  {a.readiness_level?.replace(/_/g, " ")}
                </span>
                <p className="mt-1 text-xs text-blue-800">{a.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.localization_guidance.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.localizationGuidance}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.localization_guidance.map((l) => (
              <li key={l.id} className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-violet-900">{l.title}</span>
                <p className="mt-1 text-xs text-violet-800">{l.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.cultural_insights.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.culturalInsights}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.cultural_insights.map((c) => (
              <li key={c.id} className="rounded-lg border border-teal-100 bg-teal-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-teal-900">{c.title}</span>
                <p className="mt-1 text-xs text-teal-800">{c.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.currency_visibility.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.currencyVisibility}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.currency_visibility.map((cv) => (
              <li key={cv.id} className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-emerald-900">{cv.currency_code}</span>
                {cv.market_name ? <span className="ml-2 text-xs text-emerald-700">{cv.market_name}</span> : null}
                <p className="mt-1 text-xs text-emerald-800">{cv.performance_summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.regional_insights.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.regionalInsights}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.regional_insights.map((r) => (
              <li key={r.id} className="rounded-lg border border-cyan-100 bg-cyan-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-cyan-900">{r.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.trend_direction)}`}>
                  {r.trend_direction}
                </span>
                <p className="mt-1 text-xs text-cyan-800">{r.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.regulatory_notes.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.regulatoryNotes}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.regulatory_notes.map((n) => (
              <li key={n.id} className="rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-rose-900">{n.title}</span>
                <p className="mt-1 text-xs text-rose-800">{n.summary}</p>
                <p className="mt-1 text-xs italic text-rose-700">{n.disclaimer}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recommendations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recommendationsCenter}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recommendations.map((r) => (
              <li key={r.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{r.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.priority)}`}>
                  {r.priority}
                </span>
                <p className="mt-1 text-xs text-gray-600">{r.summary}</p>
                <p className="mt-1 text-xs text-gray-500">{r.rationale}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentBriefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded border border-gray-100 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
