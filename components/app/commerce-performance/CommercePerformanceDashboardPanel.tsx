"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCommercePerformanceDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CommercePerformanceDashboard,
  type CompanionGuidanceExample,
  type IntegrationLink,
} from "@/lib/aipify/commerce-performance";

type CommercePerformanceDashboardPanelProps = {
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
    case "exceptional":
    case "high_contribution":
    case "strong_performer":
    case "improving":
    case "positive_momentum":
    case "growth_acceleration":
    case "informational":
      return "bg-emerald-100 text-emerald-800";
    case "strong":
    case "stable_contributor":
    case "stable":
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "needs_attention":
    case "needs_review":
    case "important":
    case "under_pressure":
      return "bg-orange-100 text-orange-800";
    case "strategic_review":
    case "profit_risk":
    case "declining":
    case "critical":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function formatCurrency(value?: number) {
  if (value == null) return "—";
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 }).format(value);
}

export function CommercePerformanceDashboardPanel({ labels }: CommercePerformanceDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<CommercePerformanceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/commerce-performance/dashboard");
    if (res.ok) setDashboard(parseCommercePerformanceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateReport = async () => {
    setActing("report");
    await fetch("/api/aipify/commerce-performance/briefings/generate", { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] = dashboard.cppbp104_integration_links ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/commerce-intelligence" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commerceIntelligence}
        </Link>
        <Link href="/app/product-automation" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.productAutomation}
        </Link>
        <Link href="/app/dropshipping-operations" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.dropshippingOperations}
        </Link>
        <Link href="/app/commercial" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commercial}
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

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-6">
        <h2 className="text-sm font-semibold text-emerald-900">{labels.blueprintTitle}</h2>
        {dashboard.implementation_blueprint_phase104?.phase ? (
          <p className="mt-1 text-xs text-emerald-700">
            {dashboard.implementation_blueprint_phase104.phase}
            {dashboard.implementation_blueprint_phase104.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase104.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.commerce_performance_mission ? (
          <p className="mt-2 text-sm font-medium text-emerald-900">{dashboard.commerce_performance_mission}</p>
        ) : null}
        {dashboard.commerce_performance_philosophy ? (
          <p className="mt-2 text-sm text-emerald-900">{dashboard.commerce_performance_philosophy}</p>
        ) : null}
        {dashboard.commerce_performance_abos_principle ? (
          <p className="mt-2 text-xs text-emerald-800">{dashboard.commerce_performance_abos_principle}</p>
        ) : null}
        {dashboard.commerce_performance_distinction_note ? (
          <p className="mt-2 text-xs text-emerald-700">{dashboard.commerce_performance_distinction_note}</p>
        ) : null}
        {dashboard.commerce_performance_engine_note ? (
          <p className="mt-2 text-xs text-emerald-800">{dashboard.commerce_performance_engine_note}</p>
        ) : null}
        {dashboard.commerce_performance_vision ? (
          <p className="mt-2 text-xs italic text-emerald-800">{dashboard.commerce_performance_vision}</p>
        ) : null}
        {dashboard.commerce_performance_privacy_note ? (
          <p className="mt-2 text-xs text-emerald-700">{dashboard.commerce_performance_privacy_note}</p>
        ) : null}
      </section>

      {dashboard.commerce_performance_objectives && dashboard.commerce_performance_objectives.length > 0 ? (
        <section className="rounded-xl border border-teal-200 p-6">
          <h3 className="text-sm font-semibold text-teal-900">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.commerce_performance_objectives.map((objective) => (
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

      {dashboard.commerce_performance_success_criteria &&
      dashboard.commerce_performance_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.commerce_performance_success_criteria.map((criterion) => (
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

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold text-emerald-900">{labels.performanceOverview}</h2>
        <p className="mt-2 text-4xl font-bold text-emerald-800">
          {dashboard.performance_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium capitalize text-emerald-700">
          {dashboard.performance_classification?.replace(/_/g, " ")} · {formatCurrency(dashboard.total_revenue)}{" "}
          {labels.revenue} · {dashboard.avg_net_margin_percent ?? 0}% {labels.netMargin}
        </p>
        <p className="mt-2 text-sm text-emerald-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-emerald-700">{dashboard.safety_note}</p>
        <button
          type="button"
          disabled={acting === "report"}
          onClick={() => void generateReport()}
          className="mt-4 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {labels.generateReport}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.estimatedProfit, value: formatCurrency(dashboard.estimated_profit) },
          { label: labels.productsTracked, value: dashboard.products_tracked ?? 0 },
          { label: labels.openRisks, value: dashboard.open_risks ?? 0 },
          { label: labels.opportunities, value: dashboard.opportunity_count ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      {dashboard.profit_intelligence.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.profitIntelligence}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.profit_intelligence.map((r) => (
              <li key={r.id} className="rounded-lg border border-teal-100 bg-teal-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-teal-900">{r.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.impact_level)}`}>{r.impact_level}</span>
                <p className="mt-1 text-xs text-teal-800">{r.summary}</p>
                <p className="mt-1 text-xs italic text-teal-700">{r.observation}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.product_profitability.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.productContribution}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.product_profitability.map((p) => (
              <article key={p.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{p.product_name}</p>
                  <span className="text-sm font-bold text-emerald-700">{p.profit_contribution_percent}%</span>
                </div>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(p.profit_classification)}`}>
                  {p.profit_classification?.replace(/_/g, " ")}
                </span>
                <p className="mt-2 text-xs text-gray-600">
                  {formatCurrency(p.revenue_contribution)} · {p.net_margin_percent ?? p.gross_margin_percent}% net
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.customer_value_signals.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.customerValue}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.customer_value_signals.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
                <div>
                  <span className="font-medium text-indigo-900">{c.title}</span>
                  <p className="text-xs text-indigo-800">{c.summary}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(c.trend_direction)}`}>{c.trend_direction}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.revenue_trends.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.revenueTrends}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.revenue_trends.map((t) => (
              <article key={t.id} className="rounded-lg border border-blue-100 bg-blue-50/30 p-4">
                <p className="font-medium text-blue-900">{t.period_label}</p>
                <p className="mt-1 text-lg font-semibold text-blue-800">{formatCurrency(t.revenue_amount)}</p>
                <p className="text-xs text-blue-700">
                  {formatCurrency(t.profit_amount)} profit · {t.margin_percent}% margin
                </p>
                <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(t.trend_signal)}`}>
                  {t.trend_signal?.replace(/_/g, " ")}
                </span>
                <p className="mt-2 text-xs text-blue-800">{t.summary}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.performance_opportunities.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.opportunityCenter}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.performance_opportunities.map((o) => (
              <li key={o.id} className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-emerald-900">{o.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(o.priority)}`}>{o.priority}</span>
                <p className="mt-1 text-xs text-emerald-800">{o.summary}</p>
                <p className="mt-1 text-xs italic text-emerald-700">{o.rationale}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.loss_prevention.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.riskIndicators}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.loss_prevention.map((l) => (
              <li key={l.id} className="rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-rose-900">{l.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(l.severity)}`}>{l.severity}</span>
                <p className="mt-1 text-xs text-rose-800">{l.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.strategic_recommendations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.strategicRecommendations}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.strategic_recommendations.map((r) => (
              <article key={r.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-slate-900">{r.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.priority)}`}>{r.priority}</span>
                </div>
                <p className="mt-1 text-xs text-slate-700">{r.summary}</p>
                <p className="mt-2 text-xs italic text-slate-600">{r.rationale}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.executive_reports.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.executiveReports}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.executive_reports.map((e) => (
              <li key={e.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {e.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
