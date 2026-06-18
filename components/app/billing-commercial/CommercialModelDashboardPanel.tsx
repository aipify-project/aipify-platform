"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCommercialModelDashboard,
  type CommercialModelDashboard,
  type AddonModule,
} from "@/lib/aipify/billing-commercial";

type CommercialModelDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "trial":
      return "bg-blue-100 text-blue-800";
    case "available":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

export function CommercialModelDashboardPanel({ labels }: CommercialModelDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<CommercialModelDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/billing-commercial/dashboard");
    if (res.ok) setDashboard(parseCommercialModelDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/billing-commercial/briefings/generate", { method: "POST" });
    await load();
  };

  const activateAddon = async (addonKey: string) => {
    setActing(addonKey);
    await fetch("/api/aipify/billing-commercial/addons/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addon_key: addonKey }),
    });
    setActing(null);
    await load();
  };

  const completeRenewal = async (eventId: string) => {
    setActing(eventId);
    await fetch(`/api/aipify/billing-commercial/renewals/${eventId}/complete`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/settings/billing" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.billingSettings}</Link>
        <Link href="/app/settings/modules" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.moduleSettings}</Link>
        <Link href="/app/license" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.licenseCenter}</Link>
        {dashboard.revenue_integration_links?.map((link) =>
          link.route ? (
            <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null
        )}
      </div>

      {dashboard.implementation_blueprint_phase39 ? (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
          <h2 className="text-sm font-semibold text-emerald-900">{labels.blueprintTitle}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-emerald-700">
            {dashboard.implementation_blueprint_phase39.title ?? labels.blueprintPhase39}
            {dashboard.implementation_blueprint_phase39.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase39.engine_phase}`
              : ""}
          </p>
          {dashboard.revenue_intelligence_mission ? (
            <p className="mt-2 text-sm font-medium text-emerald-900">{dashboard.revenue_intelligence_mission}</p>
          ) : null}
          {dashboard.revenue_intelligence_philosophy ? (
            <p className="mt-2 text-sm text-emerald-900">{dashboard.revenue_intelligence_philosophy}</p>
          ) : null}
          {dashboard.revenue_abos_principle ? (
            <p className="mt-2 text-xs text-emerald-800">{dashboard.revenue_abos_principle}</p>
          ) : null}
          {dashboard.revenue_distinction_note ? (
            <p className="mt-2 text-xs text-emerald-700">{dashboard.revenue_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.revenue_summary ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.revenueSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3 lg:grid-cols-4">
            <span>
              {labels.mrr}: {dashboard.revenue_summary.currency} {dashboard.revenue_summary.mrr ?? 0}
            </span>
            <span>
              {labels.arr}: {dashboard.revenue_summary.currency} {dashboard.revenue_summary.arr ?? 0}
            </span>
            <span>
              {labels.upcomingRenewals}: {dashboard.revenue_summary.upcoming_renewals ?? 0}
            </span>
            <span>
              {labels.renewalRisk}: {dashboard.revenue_summary.renewal_risk_level ?? "—"}
            </span>
            <span>
              {labels.retentionSignal}: {dashboard.revenue_summary.retention_signal ?? "—"}
            </span>
            <span>
              {labels.revenueTrend}: {dashboard.revenue_summary.revenue_trend_direction ?? "—"}
            </span>
            <span>
              {labels.activeAddons}: {dashboard.revenue_summary.active_addons ?? 0}
            </span>
            <span>
              {labels.expansionPacks}: {dashboard.revenue_summary.available_expansion_packs ?? 0}
            </span>
          </div>
          {dashboard.revenue_summary.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.revenue_summary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.revenue_objectives && dashboard.revenue_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.revenueObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.revenue_objectives.map((objective) => (
              <article key={objective.key ?? objective.label} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{objective.label}</p>
                {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.commercialHealth}</h2>
        <p className="mt-2 text-4xl font-bold text-teal-800">
          {dashboard.health_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-teal-700">
          {dashboard.customer_tier_label} · {dashboard.currency} {dashboard.mrr ?? 0} {labels.mrrLabel}
        </p>
        <p className="mt-2 text-sm text-teal-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-teal-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.mrr, value: `${dashboard.currency} ${dashboard.mrr ?? 0}` },
          { label: labels.arr, value: `${dashboard.currency} ${dashboard.arr ?? 0}` },
          { label: labels.renewalLikelihood, value: `${dashboard.renewal_likelihood ?? 0}%` },
          { label: labels.expansionOpportunity, value: `${dashboard.expansion_opportunity ?? 0}%` },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.packagingStrategy}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.business_packs.map((p) => (
            <article key={p.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs capitalize text-gray-500">{p.pack_layer?.replace(/_/g, " ")}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(p.status)}`}>{p.status}</span>
              </div>
              <p className="mt-2 font-medium text-gray-900">{p.title}</p>
              <p className="mt-1 text-xs text-gray-600">{p.description}</p>
              {p.monthly_price ? <p className="mt-2 text-sm text-teal-700">{dashboard.currency} {p.monthly_price}/{labels.perMonth}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.addonModules}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.addon_modules.map((a: AddonModule) => (
            <article key={a.id} className="rounded-lg border border-violet-100 bg-violet-50 p-4">
              <p className="font-medium text-violet-900">{a.title}</p>
              <p className="mt-1 text-xs text-violet-800">{a.description}</p>
              {a.monthly_price ? <p className="mt-2 text-sm text-violet-700">{dashboard.currency} {a.monthly_price}/{labels.perMonth}</p> : null}
              {a.status === "available" ? (
                <button
                  type="button"
                  disabled={acting === a.addon_key}
                  onClick={() => activateAddon(a.addon_key)}
                  className="mt-3 rounded-md border border-violet-300 px-3 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-100 disabled:opacity-50"
                >
                  {labels.activateAddon}
                </button>
              ) : (
                <span className={`mt-3 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${statusClass(a.status)}`}>{a.status}</span>
              )}
            </article>
          ))}
        </div>
      </section>

      {dashboard.enterprise_services.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.enterpriseServices}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.enterprise_services.map((s) => (
              <li key={s.id} className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
                <span className="font-medium">{s.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${statusClass(s.status)}`}>{s.status}</span>
                <p className="mt-1 text-xs text-indigo-800">{s.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.usage_metrics ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.usageTracking}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {Object.entries(dashboard.usage_metrics).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                <p className="text-xs capitalize text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="font-semibold text-gray-900">{String(value ?? 0)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.invoices.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.invoices}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.invoices.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{i.invoice_number}</span>
                <span>{i.currency} {i.amount}</span>
                <span className="capitalize text-gray-500">{i.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.renewal_events.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.renewalManagement}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.renewal_events.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium text-amber-900">{r.title}</p>
                  <p className="text-xs text-amber-800">{r.description}</p>
                </div>
                <button
                  type="button"
                  disabled={acting === r.id}
                  onClick={() => completeRenewal(r.id)}
                  className="rounded-md border border-amber-300 px-2 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                >
                  {labels.completeRenewal}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.partner_commissions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.partnerBilling}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.partner_commissions.map((c) => (
              <li key={c.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
                {c.partner_name} · {c.commission_type} · {c.currency} {c.amount} · {c.status}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.customer_health_insights?.examples && dashboard.customer_health_insights.examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.customerHealthInsights}</h3>
          {dashboard.customer_health_insights.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.customer_health_insights.principle}</p>
          ) : null}
          <div className="mt-3 space-y-3">
            {dashboard.customer_health_insights.examples.map((insight) => (
              <article key={insight.key ?? insight.trait} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-900">
                  {insight.emoji} {insight.trait}
                </p>
                {insight.example ? <p className="mt-1 text-xs italic text-gray-600">{insight.example}</p> : null}
              </article>
            ))}
          </div>
          {dashboard.customer_health_insights.customer_success_route ? (
            <Link
              href={dashboard.customer_health_insights.customer_success_route}
              className="mt-3 inline-block text-xs font-medium text-teal-700 hover:underline"
            >
              {labels.openCustomerSuccess}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.renewal_intelligence?.capabilities && dashboard.renewal_intelligence.capabilities.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-6">
          <h3 className="text-sm font-semibold text-amber-900">{labels.renewalIntelligence}</h3>
          {dashboard.renewal_intelligence.principle ? (
            <p className="mt-2 text-xs text-amber-800">{dashboard.renewal_intelligence.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.renewal_intelligence.capabilities.map((cap) => (
              <article key={cap.key ?? cap.label} className="rounded-lg border border-amber-100 bg-white p-3">
                <p className="font-medium text-amber-900">{cap.label}</p>
                {cap.description ? <p className="mt-1 text-xs text-amber-800">{cap.description}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.expansion_opportunities?.opportunity_types &&
      dashboard.expansion_opportunities.opportunity_types.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.expansionOpportunities}</h3>
          {dashboard.expansion_opportunities.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.expansion_opportunities.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.expansion_opportunities.opportunity_types.map((opp) => (
              <article key={opp.key ?? opp.label} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{opp.label}</p>
                {opp.description ? <p className="mt-1 text-xs text-gray-600">{opp.description}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.sales_expert_revenue_connection?.capabilities &&
      dashboard.sales_expert_revenue_connection.capabilities.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">{labels.salesExpertConnection}</h3>
          {dashboard.sales_expert_revenue_connection.principle ? (
            <p className="mt-2 text-xs text-slate-700">{dashboard.sales_expert_revenue_connection.principle}</p>
          ) : null}
          <ul className="mt-2 list-inside list-disc text-xs text-slate-700">
            {dashboard.sales_expert_revenue_connection.capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {dashboard.sales_expert_revenue_connection.sales_expert_route ? (
            <Link
              href={dashboard.sales_expert_revenue_connection.sales_expert_route}
              className="mt-3 inline-block text-xs font-medium text-slate-800 hover:underline"
            >
              {labels.openSalesExpert}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.financial_system_connection?.systems && dashboard.financial_system_connection.systems.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.financialSystems}</h3>
          {dashboard.financial_system_connection.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.financial_system_connection.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.financial_system_connection.systems.map((system) => (
              <article key={system.key ?? system.name} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{system.name}</p>
                <p className="mt-1 text-xs capitalize text-gray-500">{system.status}</p>
                {system.note ? <p className="mt-2 text-xs text-gray-600">{system.note}</p> : null}
              </article>
            ))}
          </div>
          {dashboard.financial_system_connection.accounting_truth_note ? (
            <p className="mt-3 text-xs text-amber-700">{dashboard.financial_system_connection.accounting_truth_note}</p>
          ) : null}
          {dashboard.financial_system_connection.integration_engine_route ? (
            <Link
              href={dashboard.financial_system_connection.integration_engine_route}
              className="mt-3 inline-block text-xs font-medium text-teal-700 hover:underline"
            >
              {labels.openIntegrationEngine}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.revenue_trust_connection?.users_should_understand &&
      dashboard.revenue_trust_connection.users_should_understand.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
          {dashboard.revenue_trust_connection.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.revenue_trust_connection.principle}</p>
          ) : null}
          <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
            {dashboard.revenue_trust_connection.users_should_understand.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.revenue_self_love_connection?.connections &&
      dashboard.revenue_self_love_connection.connections.length > 0 ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/50 p-4">
          <h3 className="text-sm font-semibold text-rose-900">{labels.selfLoveConnection}</h3>
          {dashboard.revenue_self_love_connection.principle ? (
            <p className="mt-2 text-xs text-rose-800">{dashboard.revenue_self_love_connection.principle}</p>
          ) : null}
          <ul className="mt-2 list-inside list-disc text-xs text-rose-800">
            {dashboard.revenue_self_love_connection.connections.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.revenue_dogfooding ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.dogfooding}</h3>
          {dashboard.revenue_dogfooding.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.revenue_dogfooding.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs text-gray-600">
            {dashboard.revenue_dogfooding.aipify_group ? (
              <div>
                <p className="font-medium text-gray-900">{labels.aipifyGroup}</p>
                <p>{dashboard.revenue_dogfooding.aipify_group.role}</p>
              </div>
            ) : null}
            {dashboard.revenue_dogfooding.unonight ? (
              <div>
                <p className="font-medium text-gray-900">{labels.unonight}</p>
                <p>{dashboard.revenue_dogfooding.unonight.role}</p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {dashboard.revenue_success_criteria && dashboard.revenue_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.revenue_success_criteria.map((criterion) => (
              <li key={criterion.key ?? criterion.label} className="flex flex-wrap items-start gap-2 text-xs text-gray-700">
                <span
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    criterion.met ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {criterion.met ? labels.criterionMet : labels.criterionPending}
                </span>
                <span>{criterion.label}</span>
                {criterion.note ? <span className="text-gray-500">— {criterion.note}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.revenue_vision_phrases && dashboard.revenue_vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
            {dashboard.revenue_vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {dashboard.trial_framework && dashboard.trial_framework.length > 0 ? (
          <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">{labels.trialFramework}</h2>
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {dashboard.trial_framework.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </section>
        ) : null}
        {dashboard.pricing_governance && dashboard.pricing_governance.length > 0 ? (
          <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">{labels.pricingGovernance}</h2>
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {dashboard.pricing_governance.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
