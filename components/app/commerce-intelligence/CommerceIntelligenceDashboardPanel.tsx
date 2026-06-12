"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCommerceIntelligenceDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CommerceIntelligenceDashboard,
  type CompanionGuidanceExample,
  type IntegrationLink,
} from "@/lib/aipify/commerce-intelligence";

type CommerceIntelligenceDashboardPanelProps = {
  labels: Record<string, string>;
};

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-orange-100 bg-orange-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-orange-900">{objective.description}</p> : null}
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
    case "high":
    case "excellent_margin":
    case "trusted":
    case "test_product":
      return "bg-emerald-100 text-emerald-800";
    case "medium":
    case "good_margin":
    case "approved_for_testing":
      return "bg-amber-100 text-amber-800";
    case "low":
    case "weak_margin":
    case "monitor_closely":
      return "bg-blue-100 text-blue-800";
    case "saturated":
    case "high_risk":
    case "avoid_for_now":
    case "avoid":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function CommerceIntelligenceDashboardPanel({ labels }: CommerceIntelligenceDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<CommerceIntelligenceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/commerce-intelligence/dashboard");
    if (res.ok) setDashboard(parseCommerceIntelligenceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const runDiscovery = async () => {
    setActing("discovery");
    await fetch("/api/commerce/discovery/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    setActing(null);
    await load();
  };

  const generateBriefing = async () => {
    await fetch("/api/aipify/commerce-intelligence/briefings/generate", { method: "POST" });
    await load();
  };

  const addWatchlist = async (productId: string) => {
    setActing(`watch-${productId}`);
    await fetch(`/api/commerce/products/${productId}/watchlist`, { method: "POST" });
    setActing(null);
    await load();
  };

  const recordAction = async (productId: string, action: string) => {
    setActing(`action-${productId}`);
    await fetch(`/api/commerce/products/${productId}/recommendation-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setActing(null);
    await load();
  };

  const analyzeMargin = async (productId: string) => {
    setActing(`margin-${productId}`);
    await fetch("/api/commerce/margin/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
    });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] = dashboard.cibp101_integration_links ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/platform-install" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.platformInstall}
        </Link>
        <Link href="/app/commercial" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commercial}
        </Link>
        <Link href="/app/commerce-performance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commercePerformance}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        {integrationLinks.map((link) =>
          link.route ? (
            <Link key={link.route + (link.key ?? "")} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null,
        )}
      </div>

      <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-6">
        <h2 className="text-sm font-semibold text-amber-900">{labels.blueprintTitle}</h2>
        {dashboard.implementation_blueprint_phase101?.phase ? (
          <p className="mt-1 text-xs text-amber-700">
            {dashboard.implementation_blueprint_phase101.phase}
            {dashboard.implementation_blueprint_phase101.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase101.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.commerce_intelligence_mission ? (
          <p className="mt-2 text-sm font-medium text-amber-900">{dashboard.commerce_intelligence_mission}</p>
        ) : null}
        {dashboard.commerce_intelligence_philosophy ? (
          <p className="mt-2 text-sm text-amber-900">{dashboard.commerce_intelligence_philosophy}</p>
        ) : null}
        {dashboard.commerce_intelligence_abos_principle ? (
          <p className="mt-2 text-xs text-amber-800">{dashboard.commerce_intelligence_abos_principle}</p>
        ) : null}
        {dashboard.commerce_intelligence_distinction_note ? (
          <p className="mt-2 text-xs text-amber-700">{dashboard.commerce_intelligence_distinction_note}</p>
        ) : null}
        {dashboard.commerce_intelligence_engine_note ? (
          <p className="mt-2 text-xs text-amber-800">{dashboard.commerce_intelligence_engine_note}</p>
        ) : null}
        {dashboard.commerce_intelligence_vision ? (
          <p className="mt-2 text-xs italic text-amber-800">{dashboard.commerce_intelligence_vision}</p>
        ) : null}
        {dashboard.commerce_intelligence_privacy_note ? (
          <p className="mt-2 text-xs text-amber-700">{dashboard.commerce_intelligence_privacy_note}</p>
        ) : null}
      </section>

      {dashboard.commerce_intelligence_objectives && dashboard.commerce_intelligence_objectives.length > 0 ? (
        <section className="rounded-xl border border-orange-200 p-6">
          <h3 className="text-sm font-semibold text-orange-900">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.commerce_intelligence_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.commerce_companion_guidance?.examples &&
      dashboard.commerce_companion_guidance.examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionGuidance}</h3>
          {dashboard.commerce_companion_guidance.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.commerce_companion_guidance.principle}</p>
          ) : null}
          {dashboard.commerce_companion_guidance.companion_name ? (
            <p className="mt-1 text-xs text-gray-600">
              {dashboard.commerce_companion_guidance.companion_name}
              {dashboard.commerce_companion_guidance.not_label
                ? ` — ${labels.notGenericAi}: ${dashboard.commerce_companion_guidance.not_label}`
                : ""}
            </p>
          ) : null}
          <div className="mt-3 space-y-2">
            {dashboard.commerce_companion_guidance.examples.map((example) => (
              <CompanionGuidanceCard key={example.key ?? example.prompt} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.commerce_limitation_principles ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50/30 p-6">
          <h3 className="text-sm font-semibold text-rose-900">{labels.limitationPrinciples}</h3>
          {dashboard.commerce_limitation_principles.principle ? (
            <p className="mt-2 text-sm text-rose-900">{dashboard.commerce_limitation_principles.principle}</p>
          ) : null}
          {dashboard.commerce_limitation_principles.must_avoid &&
          dashboard.commerce_limitation_principles.must_avoid.length > 0 ? (
            <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-rose-800">
              {dashboard.commerce_limitation_principles.must_avoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.commerce_self_love_connection?.quotes &&
      dashboard.commerce_self_love_connection.quotes.length > 0 ? (
        <section className="rounded-xl border border-sky-200 bg-sky-50/30 p-6">
          <h3 className="text-sm font-semibold text-sky-900">{labels.selfLoveConnection}</h3>
          {dashboard.commerce_self_love_connection.principle ? (
            <p className="mt-2 text-sm text-sky-900">{dashboard.commerce_self_love_connection.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-xs italic text-sky-800">
            {dashboard.commerce_self_love_connection.quotes.map((quote) => (
              <li key={quote}>{quote}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.commerce_intelligence_success_criteria &&
      dashboard.commerce_intelligence_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.commerce_intelligence_success_criteria.map((criterion) => (
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

      <section className="rounded-xl border border-orange-200 bg-orange-50/50 p-6">
        <h2 className="text-sm font-semibold text-orange-900">{labels.commerceIntelligence}</h2>
        <p className="mt-2 text-4xl font-bold text-orange-800">
          {dashboard.intelligence_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-orange-700">
          {dashboard.opportunities_count ?? 0} {labels.opportunities} · {dashboard.trending_signals ?? 0}{" "}
          {labels.trendingSignals} · {dashboard.watchlist_count ?? 0} {labels.watchlist}
        </p>
        <p className="mt-2 text-sm text-orange-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-orange-700">{dashboard.safety_note}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void runDiscovery()}
            disabled={acting === "discovery"}
            className="rounded-md bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-800 disabled:opacity-50"
          >
            {labels.runDiscovery}
          </button>
          <button
            type="button"
            onClick={() => void generateBriefing()}
            className="rounded-md border border-orange-300 px-4 py-2 text-sm text-orange-800 hover:bg-orange-100"
          >
            {labels.generateBriefing}
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.opportunities, value: dashboard.opportunities_count ?? 0 },
          { label: labels.avgScore, value: dashboard.avg_opportunity_score ?? 0 },
          { label: labels.trendingSignals, value: dashboard.trending_signals ?? 0 },
          { label: labels.productsToAvoid, value: dashboard.products_to_avoid ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      {dashboard.best_opportunities.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.bestOpportunities}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.best_opportunities.map((opp) => (
              <article key={opp.id} className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-emerald-900">{opp.product_name}</p>
                  <span className="text-sm font-bold text-emerald-700">{opp.opportunity_score}/100</span>
                </div>
                <p className="mt-1 text-xs capitalize text-emerald-700">{opp.category}</p>
                <p className="mt-2 text-xs text-emerald-800">{opp.recommendation_summary}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(opp.trend_confidence)}`}>{opp.trend_confidence} trend</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(opp.margin_classification)}`}>{opp.margin_classification?.replace(/_/g, " ")}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" disabled={acting === `action-${opp.product_id}`} onClick={() => void recordAction(opp.product_id, opp.recommendation_type)} className="rounded-md bg-emerald-700 px-2 py-1 text-xs text-white disabled:opacity-50">{labels.approveAction}</button>
                  <button type="button" disabled={acting === `watch-${opp.product_id}` || opp.on_watchlist} onClick={() => void addWatchlist(opp.product_id)} className="rounded-md border border-emerald-700 px-2 py-1 text-xs text-emerald-800 disabled:opacity-50">{opp.on_watchlist ? labels.onWatchlist : labels.addWatchlist}</button>
                  <button type="button" disabled={acting === `margin-${opp.product_id}`} onClick={() => void analyzeMargin(opp.product_id)} className="rounded-md border border-orange-300 px-2 py-1 text-xs text-orange-800 disabled:opacity-50">{labels.analyzeMargin}</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.trending_now.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.trendingNow}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.trending_now.map((t) => (
              <li key={t.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium">{t.product_name ?? labels.unknownProduct}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(t.signal_strength)}`}>{t.signal_strength}</span>
                <p className="mt-1 text-xs text-gray-600">{t.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.high_margin_candidates.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.highMarginCandidates}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.high_margin_candidates.map((m) => (
              <article key={m.id} className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
                <p className="font-medium text-violet-900">{m.product_name}</p>
                <p className="mt-2 text-lg font-semibold text-violet-700">{m.estimated_net_margin_percent}% {labels.netMargin}</p>
                <p className="text-xs text-violet-800">{m.recommended_price_min}–{m.recommended_price_max} NOK</p>
                {m.risk_note ? <p className="mt-1 text-xs text-violet-700">{m.risk_note}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.supplier_watchlist.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.supplierWatchlist}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.supplier_watchlist.map((s) => (
              <article key={s.id} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-indigo-900">{s.supplier_name}</p>
                  <span className="text-sm font-bold text-indigo-700">{s.insight_score}/100</span>
                </div>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(s.risk_level)}`}>{s.risk_level?.replace(/_/g, " ")}</span>
                <p className="mt-2 text-xs text-indigo-800">{s.recommendation}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.products_to_avoid_list.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.productsToAvoid}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.products_to_avoid_list.map((p) => (
              <article key={p.id} className="rounded-lg border border-rose-200 bg-rose-50/40 p-4">
                <p className="font-medium text-rose-900">{p.product_name}</p>
                <p className="mt-1 text-xs text-rose-800">{p.recommendation_summary}</p>
                {p.risk_flags?.map((r) => (
                  <p key={r.title} className="mt-1 text-xs text-rose-700">⚠ {r.title}: {r.explanation}</p>
                ))}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.seasonal_opportunities.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.seasonalOpportunities}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.seasonal_opportunities.map((s) => (
              <li key={s.id} className="rounded-lg border border-sky-100 bg-sky-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-sky-900">{s.title}</span>
                <span className="ml-2 text-xs text-sky-700">{s.season_label}</span>
                <p className="mt-1 text-xs text-sky-800">{s.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.store_fit_recommendations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.storeFitRecommendations}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.store_fit_recommendations.map((sf) => (
              <article key={sf.id} className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-teal-900">{sf.product_name}</p>
                  <span className="text-sm font-bold text-teal-700">{sf.fit_score}%</span>
                </div>
                <p className="mt-1 text-xs text-teal-800">{sf.fit_summary}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentBriefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">{b.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
