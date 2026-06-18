"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSupplierIntelligenceDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CompanionGuidanceExample,
  type IntegrationLink,
  type SupplierIntelligenceDashboard,
} from "@/lib/aipify/supplier-intelligence";

type SupplierIntelligenceDashboardPanelProps = {
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
    case "excellent":
    case "trusted":
    case "active":
    case "informational":
      return "bg-emerald-100 text-emerald-800";
    case "stable":
    case "moderate":
    case "monitoring":
      return "bg-amber-100 text-amber-800";
    case "needs_attention":
    case "monitor_closely":
    case "important":
    case "review":
      return "bg-orange-100 text-orange-800";
    case "high_risk":
    case "escalation_recommended":
    case "critical":
    case "immediate_review":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function SupplierIntelligenceDashboardPanel({ labels }: SupplierIntelligenceDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<SupplierIntelligenceDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/supplier-intelligence/dashboard");
    if (res.ok) setDashboard(parseSupplierIntelligenceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/supplier-intelligence/briefings/generate", { method: "POST" });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] = dashboard.sirbp106_integration_links ?? [];
  const scoreComponents = Array.isArray(dashboard.supplier_score_components?.components)
    ? (dashboard.supplier_score_components.components as Array<{ key?: string; label?: string; weight_note?: string }>)
    : [];
  const limitationItems = dashboard.supplier_limitation_principles?.avoid ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/dropshipping-operations" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.dropshippingOperations}
        </Link>
        <Link href="/app/commerce-intelligence" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commerceIntelligence}
        </Link>
        <Link href="/app/commerce-performance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commercePerformance}
        </Link>
        <Link href="/app/multi-store" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.multiStore}
        </Link>
        <Link href="/app/meeting-collaboration-intelligence-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.meetingCompanion}
        </Link>
        <Link href="/app/integration-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.integrationEngine}
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
        {dashboard.implementation_blueprint_phase106?.phase ? (
          <p className="mt-1 text-xs text-slate-700">
            {dashboard.implementation_blueprint_phase106.phase}
            {dashboard.implementation_blueprint_phase106.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase106.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.supplier_intelligence_mission ? (
          <p className="mt-2 text-sm font-medium text-slate-900">{dashboard.supplier_intelligence_mission}</p>
        ) : null}
        {dashboard.supplier_intelligence_philosophy ? (
          <p className="mt-2 text-sm text-slate-800">{dashboard.supplier_intelligence_philosophy}</p>
        ) : null}
        {dashboard.supplier_intelligence_abos_principle ? (
          <p className="mt-2 text-xs text-slate-700">{dashboard.supplier_intelligence_abos_principle}</p>
        ) : null}
        {dashboard.supplier_intelligence_distinction_note ? (
          <p className="mt-2 text-xs text-slate-600">{dashboard.supplier_intelligence_distinction_note}</p>
        ) : null}
        {dashboard.supplier_intelligence_vision ? (
          <p className="mt-2 text-xs italic text-slate-800">{dashboard.supplier_intelligence_vision}</p>
        ) : null}
      </section>

      {dashboard.supplier_intelligence_objectives && dashboard.supplier_intelligence_objectives.length > 0 ? (
        <section className="rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.supplier_intelligence_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {scoreComponents.length > 0 ? (
        <section className="rounded-xl border border-indigo-200 p-6">
          <h3 className="text-sm font-semibold text-indigo-900">{labels.scoreComponents}</h3>
          {typeof dashboard.supplier_score_components?.principle === "string" ? (
            <p className="mt-2 text-sm text-indigo-800">{dashboard.supplier_score_components.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {scoreComponents.map((component) => (
              <li key={component.key ?? component.label} className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
                <span className="font-medium text-indigo-900">{component.label}</span>
                {component.weight_note ? <p className="mt-1 text-xs text-indigo-800">{component.weight_note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.supplier_companion_guidance?.examples && dashboard.supplier_companion_guidance.examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionGuidance}</h3>
          {dashboard.supplier_companion_guidance.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.supplier_companion_guidance.principle}</p>
          ) : null}
          <div className="mt-3 space-y-2">
            {dashboard.supplier_companion_guidance.examples.map((example) => (
              <CompanionGuidanceCard key={example.key ?? example.prompt} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {limitationItems.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-6">
          <h3 className="text-sm font-semibold text-amber-900">{labels.limitationPrinciples}</h3>
          {dashboard.supplier_limitation_principles?.principle ? (
            <p className="mt-2 text-sm text-amber-900">{dashboard.supplier_limitation_principles.principle}</p>
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

      {dashboard.supplier_self_love_connection?.quotes && dashboard.supplier_self_love_connection.quotes.length > 0 ? (
        <section className="rounded-xl border border-sky-200 bg-sky-50/30 p-6">
          <h3 className="text-sm font-semibold text-sky-900">{labels.selfLoveConnection}</h3>
          <ul className="mt-3 space-y-2 text-xs italic text-sky-800">
            {dashboard.supplier_self_love_connection.quotes.map((quote) => (
              <li key={quote}>{quote}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.supplier_intelligence_success_criteria && dashboard.supplier_intelligence_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.supplier_intelligence_success_criteria.map((criterion) => (
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
        <h2 className="text-sm font-semibold text-slate-900">{labels.portfolioHealth}</h2>
        <p className="mt-2 text-4xl font-bold text-slate-800">
          {dashboard.portfolio_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium capitalize text-slate-700">
          {dashboard.health_classification?.replace(/_/g, " ")} · {dashboard.active_suppliers ?? 0}{" "}
          {labels.activeSuppliers} · {dashboard.open_risks ?? 0} {labels.openRisks}
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
          { label: labels.diversificationAlerts, value: dashboard.diversification_alerts ?? 0 },
          { label: labels.opportunityInsights, value: dashboard.opportunity_insights_count ?? 0 },
          { label: labels.relationshipRecords, value: dashboard.relationship_records_count ?? 0 },
          { label: labels.recommendationsPending, value: dashboard.recommendations_pending ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      {dashboard.health_scores.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.healthScores}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.health_scores.map((s) => (
              <article key={s.id} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-indigo-900">{s.supplier_name}</p>
                  <span className="text-sm font-bold text-indigo-700">{s.health_score}/100</span>
                </div>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(s.status_level)}`}>
                  {s.status_level?.replace(/_/g, " ")}
                </span>
                <p className="mt-2 text-xs text-indigo-800">
                  {labels.deliveryReliability}: {s.delivery_reliability}% · {labels.marginPerformance}: {s.margin_performance}%
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.risk_events.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.riskEvents}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.risk_events.map((r) => (
              <li key={r.id} className="rounded-lg border border-orange-100 bg-orange-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-orange-900">{r.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.severity)}`}>{r.severity}</span>
                <p className="mt-1 text-xs text-orange-800">{r.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.opportunity_insights.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.opportunityInsights}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.opportunity_insights.map((o) => (
              <li key={o.id} className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-emerald-900">{o.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(o.priority)}`}>{o.priority}</span>
                <p className="mt-1 text-xs text-emerald-800">{o.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.diversification_alerts_list.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.diversificationAlerts}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.diversification_alerts_list.map((d) => (
              <li key={d.id} className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-violet-900">{d.title}</span>
                <p className="mt-1 text-xs text-violet-800">{d.summary}</p>
                <p className="mt-1 text-xs text-violet-600">
                  {d.affected_products_count} {labels.affectedProducts}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.relationship_records.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.relationshipRecords}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.relationship_records.map((r) => (
              <li key={r.id} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm">
                {r.meeting_summary ? <p className="font-medium text-slate-900">{r.meeting_summary}</p> : null}
                {r.partnership_opportunity ? <p className="mt-1 text-xs text-slate-700">{r.partnership_opportunity}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recommendations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recommendationsCenter}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.recommendations.map((r) => (
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

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentBriefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
