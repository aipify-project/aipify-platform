"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseMultiStoreOrchestrationDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CompanionGuidanceExample,
  type IntegrationLink,
  type MultiStoreOrchestrationDashboard,
} from "@/lib/aipify/multi-store-orchestration";

type MultiStoreOrchestrationDashboardPanelProps = {
  labels: Record<string, string>;
};

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-indigo-900">{objective.description}</p> : null}
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
    case "active":
    case "growing":
    case "improving":
    case "aligned":
    case "ready":
    case "informational":
      return "bg-emerald-100 text-emerald-800";
    case "strong":
    case "stable":
    case "moderate":
    case "preparing":
      return "bg-amber-100 text-amber-800";
    case "needs_attention":
    case "partial":
    case "important":
    case "monitoring":
      return "bg-orange-100 text-orange-800";
    case "strategic_intervention":
    case "strategic_review":
    case "inconsistent":
    case "needs_review":
    case "not_ready":
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

export function MultiStoreOrchestrationDashboardPanel({ labels }: MultiStoreOrchestrationDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<MultiStoreOrchestrationDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/multi-store-orchestration/dashboard");
    if (res.ok) setDashboard(parseMultiStoreOrchestrationDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateReport = async () => {
    setActing("report");
    await fetch("/api/aipify/multi-store-orchestration/briefings/generate", { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] = dashboard.msobp105_integration_links ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/platform-install" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.platformInstall}
        </Link>
        <Link href="/app/commerce-performance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commercePerformance}
        </Link>
        <Link href="/app/commerce-intelligence" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commerceIntelligence}
        </Link>
        <Link href="/app/product-automation" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.productAutomation}
        </Link>
        <Link href="/app/dropshipping-operations" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.dropshippingOperations}
        </Link>
        <Link href="/app/workflow-orchestration-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.workflowOrchestration}
        </Link>
        <Link href="/app/approvals" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.approvals}
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

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.blueprintTitle}</h2>
        {dashboard.implementation_blueprint_phase105?.phase ? (
          <p className="mt-1 text-xs text-indigo-700">
            {dashboard.implementation_blueprint_phase105.phase}
            {dashboard.implementation_blueprint_phase105.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase105.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.multi_store_orchestration_mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">{dashboard.multi_store_orchestration_mission}</p>
        ) : null}
        {dashboard.multi_store_orchestration_philosophy ? (
          <p className="mt-2 text-sm text-indigo-900">{dashboard.multi_store_orchestration_philosophy}</p>
        ) : null}
        {dashboard.multi_store_orchestration_abos_principle ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.multi_store_orchestration_abos_principle}</p>
        ) : null}
        {dashboard.multi_store_orchestration_distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.multi_store_orchestration_distinction_note}</p>
        ) : null}
        {dashboard.multi_store_orchestration_engine_note ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.multi_store_orchestration_engine_note}</p>
        ) : null}
        {dashboard.multi_store_orchestration_vision ? (
          <p className="mt-2 text-xs italic text-indigo-800">{dashboard.multi_store_orchestration_vision}</p>
        ) : null}
        {dashboard.multi_store_orchestration_privacy_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.multi_store_orchestration_privacy_note}</p>
        ) : null}
      </section>

      {dashboard.multi_store_orchestration_objectives && dashboard.multi_store_orchestration_objectives.length > 0 ? (
        <section className="rounded-xl border border-violet-200 p-6">
          <h3 className="text-sm font-semibold text-violet-900">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.multi_store_orchestration_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.multi_store_companion_guidance?.examples &&
      dashboard.multi_store_companion_guidance.examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionGuidance}</h3>
          {dashboard.multi_store_companion_guidance.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.multi_store_companion_guidance.principle}</p>
          ) : null}
          {dashboard.multi_store_companion_guidance.companion_name ? (
            <p className="mt-1 text-xs text-gray-600">
              {dashboard.multi_store_companion_guidance.companion_name}
              {dashboard.multi_store_companion_guidance.not_label
                ? ` — ${labels.notGenericAi}: ${dashboard.multi_store_companion_guidance.not_label}`
                : ""}
            </p>
          ) : null}
          <div className="mt-3 space-y-2">
            {dashboard.multi_store_companion_guidance.examples.map((example) => (
              <CompanionGuidanceCard key={example.key ?? example.prompt} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.multi_store_permission_principles ? (
        <section className="rounded-xl border border-slate-200 bg-slate-50/40 p-6">
          <h3 className="text-sm font-semibold text-slate-900">{labels.permissionPrinciples}</h3>
          {typeof dashboard.multi_store_permission_principles.principle === "string" ? (
            <p className="mt-2 text-sm text-slate-800">{dashboard.multi_store_permission_principles.principle}</p>
          ) : null}
          {Array.isArray(dashboard.multi_store_permission_principles.rules) ? (
            <ul className="mt-3 space-y-2">
              {(dashboard.multi_store_permission_principles.rules as Array<{ label?: string; description?: string }>).map(
                (rule) => (
                  <li key={rule.label} className="rounded border border-slate-100 bg-white px-3 py-2 text-xs text-slate-700">
                    <span className="font-medium">{rule.label}</span>
                    {rule.description ? <p className="mt-1 text-slate-600">{rule.description}</p> : null}
                  </li>
                ),
              )}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.multi_store_self_love_connection ? (
        <section className="rounded-xl border border-pink-200 bg-pink-50/30 p-6">
          <h3 className="text-sm font-semibold text-pink-900">{labels.selfLoveConnection}</h3>
          {dashboard.multi_store_self_love_connection.principle ? (
            <p className="mt-2 text-sm text-pink-900">{dashboard.multi_store_self_love_connection.principle}</p>
          ) : null}
          {dashboard.multi_store_self_love_connection.quotes?.map((quote) => (
            <p key={quote} className="mt-2 text-xs italic text-pink-800">
              {quote}
            </p>
          ))}
        </section>
      ) : null}

      {dashboard.multi_store_orchestration_success_criteria &&
      dashboard.multi_store_orchestration_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.multi_store_orchestration_success_criteria.map((criterion) => (
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

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.portfolioOverview}</h2>
        <p className="mt-2 text-4xl font-bold text-indigo-800">
          {dashboard.portfolio_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium capitalize text-indigo-700">
          {dashboard.portfolio_classification?.replace(/_/g, " ")} · {dashboard.stores_connected ?? 0}{" "}
          {labels.storesConnected} · {formatCurrency(dashboard.portfolio_revenue)} {labels.revenue}
        </p>
        <p className="mt-2 text-sm text-indigo-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
        {dashboard.auto_sync_disabled ? (
          <p className="mt-1 text-xs font-medium text-indigo-600">{labels.autoSyncDisabled}</p>
        ) : null}
        <button
          type="button"
          disabled={acting === "report"}
          onClick={() => void generateReport()}
          className="mt-4 rounded-md bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 disabled:opacity-50"
        >
          {labels.generateReport}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.avgMargin, value: `${dashboard.avg_profit_margin_percent ?? 0}%` },
          { label: labels.storesNeedingAttention, value: dashboard.stores_needing_attention ?? 0 },
          { label: labels.opportunities, value: dashboard.opportunity_count ?? 0 },
          { label: labels.governanceGaps, value: dashboard.governance_gaps ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      {dashboard.portfolio_notifications.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.notifications}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.portfolio_notifications.map((n) => (
              <li key={n.id} className="rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-rose-900">{n.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(n.priority)}`}>{n.priority}</span>
                <p className="mt-1 text-xs text-rose-800">{n.message}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.store_summaries.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.storePerformance}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.store_summaries.map((s) => (
              <article key={s.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{s.store_name}</p>
                  <span className="text-sm font-bold text-indigo-700">{s.performance_score ?? 0}/100</span>
                </div>
                <p className="mt-1 text-xs capitalize text-gray-500">
                  {s.platform_type} · {s.region} · {s.brand_group}
                </p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(s.status_level)}`}>
                  {s.status_level?.replace(/_/g, " ")}
                </span>
                <p className="mt-2 text-xs text-gray-600">
                  {formatCurrency(s.revenue_amount)} · {s.profit_margin_percent ?? 0}% margin
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.cross_store_insights.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.crossStoreInsights}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.cross_store_insights.map((i) => (
              <li key={i.id} className="rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-blue-900">{i.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(i.trend_direction)}`}>{i.trend_direction}</span>
                <p className="mt-1 text-xs text-blue-800">{i.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.product_sync_guidance.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.productSyncGuidance}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.product_sync_guidance.map((p) => (
              <li key={p.id} className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-violet-900">{p.product_name}</span>
                <p className="mt-1 text-xs text-violet-800">{p.recommendation_summary}</p>
                <p className="mt-1 text-xs italic text-violet-700">{p.rationale}</p>
                {p.requires_approval ? (
                  <p className="mt-1 text-xs font-medium text-violet-600">{labels.requiresApproval}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.opportunity_distributions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.opportunityCenter}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.opportunity_distributions.map((o) => (
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

      {dashboard.governance_coordination.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.governanceInsights}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.governance_coordination.map((g) => (
              <li key={g.id} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm">
                <span className="font-medium text-slate-900">{g.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(g.consistency_level)}`}>
                  {g.consistency_level?.replace(/_/g, " ")}
                </span>
                <p className="mt-1 text-xs text-slate-700">{g.summary}</p>
                <p className="mt-1 text-xs italic text-slate-600">{g.recommendation}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.regional_expansion.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.regionalObservations}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.regional_expansion.map((r) => (
              <article key={r.id} className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-teal-900">{r.region_name}</p>
                  <span className="text-sm font-bold text-teal-700">{r.readiness_score}/100</span>
                </div>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.readiness_status)}`}>
                  {r.readiness_status?.replace(/_/g, " ")}
                </span>
                <p className="mt-2 text-xs text-teal-800">{r.market_observation}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.strategic_recommendations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.strategicRecommendations}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.strategic_recommendations.map((r) => (
              <article key={r.id} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-indigo-900">{r.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.priority)}`}>{r.priority}</span>
                </div>
                <p className="mt-1 text-xs text-indigo-800">{r.summary}</p>
                <p className="mt-2 text-xs italic text-indigo-700">{r.rationale}</p>
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
