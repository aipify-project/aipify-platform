"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  REVENUE_HEALTH_BADGES,
  RISK_SEVERITY_BADGES,
  parseCustomerRevenueOperationsCenter,
  type PipelineRow,
  type CustomerRevenueOperationsCenter,
  type CustomerRevenueOperationsLabels,
  type CustomerRevenueOperationsTab,
} from "@/lib/customer-revenue-operations";

type Props = {
  labels: CustomerRevenueOperationsLabels;
  backHref: string;
  initialTab?: CustomerRevenueOperationsTab;
  visibleTabs?: CustomerRevenueOperationsTab[];
  titleOverride?: string;
  subtitleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function formatCurrency(value: unknown) {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 }).format(n);
}

const ALL_TABS: CustomerRevenueOperationsTab[] = [
  "overview", "pipeline", "revenue", "forecasts", "renewals", "expansion",
  "partners", "business_packs", "companion", "executive", "reports",
];

export function RevenueOperationsPanel({
  labels, backHref, initialTab = "overview", visibleTabs, titleOverride, subtitleOverride,
}: Props) {
  const tabs = visibleTabs ?? ALL_TABS;
  const [center, setCenter] = useState<CustomerRevenueOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<CustomerRevenueOperationsTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/revenue-operations");
    if (res.ok) setCenter(parseCustomerRevenueOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/revenue-operations/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, payload }),
      });
      if (res.ok) await load();
    } finally { setBusy(false); }
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }
  if (!center?.found) return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;

  const overview = center.overview ?? {};
  const pipeline = center.pipeline_engine ?? [];
  const lifecycle = center.revenue_lifecycle ?? [];
  const forecasts = center.forecast_engine ?? [];
  const renewals = center.renewal_operations ?? [];
  const expansions = center.expansion_engine ?? [];
  const partners = center.growth_partner_intelligence ?? [];
  const packs = center.business_pack_revenue ?? [];
  const domains = center.domain_revenue ?? [];
  const attribution = center.marketing_attribution ?? [];
  const risks = center.revenue_risk_engine ?? [];
  const health = center.revenue_health ?? {};
  const advisorPrompts = (center.companion_revenue_advisor?.advisor_prompts as string[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{subtitleOverride ?? labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/revenue/pipeline" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.actions.openPipeline}</Link>
        <Link href="/app/revenue-growth" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openRevenueGrowth}</Link>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_forecast", { horizon: "quarterly", summary: "Quarterly revenue forecast generated." })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium disabled:opacity-50">{labels.actions.generateForecast}</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard label={labels.overview.revenueHealthScore} value={overview.revenue_health_score ?? 0} />
          <OverviewCard label={labels.overview.monthlyRevenue} value={formatCurrency(overview.monthly_revenue)} />
          <OverviewCard label={labels.overview.annualRevenue} value={formatCurrency(overview.annual_revenue)} />
          <OverviewCard label={labels.overview.recurringRevenue} value={formatCurrency(overview.recurring_revenue)} />
          <OverviewCard label={labels.overview.renewalRevenue} value={formatCurrency(overview.renewal_revenue)} />
          <OverviewCard label={labels.overview.expansionRevenue} value={formatCurrency(overview.expansion_revenue)} />
          <OverviewCard label={labels.overview.partnerRevenue} value={formatCurrency(overview.partner_revenue)} />
          <OverviewCard label={labels.overview.forecastRevenue} value={formatCurrency(overview.forecast_revenue)} />
          <OverviewCard label={labels.overview.pipelineOpen} value={overview.pipeline_open ?? 0} />
          <OverviewCard label={labels.overview.renewalsDue90d} value={overview.renewals_due_90d ?? 0} />
          <OverviewCard label={labels.overview.expansionOpportunities} value={overview.expansion_opportunities ?? 0} />
          <OverviewCard label={labels.overview.activeRisks} value={overview.active_risks ?? 0} />
        </dl>
      ) : null}

      {tab === "pipeline" ? (
        <section className="space-y-4">
          {pipeline.map((p: PipelineRow) => (
            <div key={p.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-zinc-900">{p.title}</p>
              <p className="text-xs text-zinc-500">{p.stage} · {p.record_type} · {formatCurrency(p.revenue_potential)} · {p.source_label}</p>
              <p className="mt-1 text-sm text-zinc-600">{p.summary}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("create_opportunity", { title: "New opportunity", stage: "qualified", revenue_potential: 50000 })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.actions.createOpportunity}</button>
        </section>
      ) : null}

      {tab === "revenue" ? (
        <section className="space-y-4">
          {lifecycle.map((s) => (
            <div key={String(s.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(s.customer_label)} · {String(s.lifecycle_stage)}</p>
              <p className="text-zinc-500">{String(s.plan_label)} · {formatCurrency(s.monthly_revenue)}/mo · {formatCurrency(s.annual_revenue)}/yr</p>
              <p className="mt-1 text-zinc-600">Packs: {JSON.stringify(s.business_packs)} · Domains: {JSON.stringify(s.domains)}</p>
              <p className="text-zinc-600">Expansion: {String(s.expansion_history)}</p>
            </div>
          ))}
          {domains.map((d) => (
            <div key={String(d.id)} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
              {String(d.domain_label)} — {formatCurrency(d.revenue)} · {String(d.user_licenses)} licenses · {String(d.renewal_performance)}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "forecasts" ? (
        <section className="space-y-4">
          {forecasts.map((f) => (
            <div key={String(f.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(f.horizon)} · {formatCurrency(f.expected_revenue)}</p>
              <p className="text-zinc-500">Churn {formatCurrency(f.expected_churn)} · Expansion {formatCurrency(f.expected_expansion)} · {String(f.expected_growth_pct)}% growth · {String(f.confidence)} confidence</p>
              <p className="mt-1 text-zinc-600">{String(f.summary)}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("generate_forecast", { horizon: "90_day" })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50">{labels.actions.generateForecast}</button>
        </section>
      ) : null}

      {tab === "renewals" ? (
        <section className="space-y-4">
          {renewals.map((r) => (
            <div key={String(r.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(r.customer_label)} · {String(r.renewal_date)}</p>
              <p className="text-zinc-500">{String(r.renewal_probability_pct)}% probability · {String(r.renewal_health)} · {String(r.workflow_stage)}</p>
              <p className="mt-1 text-zinc-600">{String(r.summary)}</p>
              <p className="text-zinc-500">Expansion: {String(r.expansion_opportunity)}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("plan_renewal", { customer_label: "Customer", renewal_health: "healthy" })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.actions.planRenewal}</button>
        </section>
      ) : null}

      {tab === "expansion" ? (
        <section className="space-y-4">
          {expansions.map((e) => (
            <div key={String(e.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(e.title)} · {String(e.customer_label)}</p>
              <p className="text-zinc-500">{String(e.expansion_type)} · impact {formatCurrency(e.forecast_revenue_impact)}</p>
              <p className="mt-1 text-zinc-600">{String(e.recommendation)}</p>
              <p className="text-zinc-600">{String(e.summary)}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("identify_expansion", { title: "New expansion opportunity", expansion_type: "business_pack" })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.actions.identifyExpansion}</button>
        </section>
      ) : null}

      {tab === "partners" ? (
        <section className="space-y-4">
          {partners.map((p) => (
            <div key={String(p.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(p.partner_label)} · {String(p.partner_tier)}</p>
              <p className="text-zinc-500">Revenue {formatCurrency(p.partner_revenue)} · Renewals {formatCurrency(p.renewal_revenue)} · {String(p.conversion_rate_pct)}% conversion</p>
              <p className="mt-1 text-zinc-600">{String(p.summary)}</p>
            </div>
          ))}
          {attribution.map((a) => (
            <div key={String(a.id)} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
              {String(a.campaign_label)} — {String(a.lead_source)} · {formatCurrency(a.revenue)} · {String(a.conversion_count)} conversions
            </div>
          ))}
        </section>
      ) : null}

      {tab === "business_packs" ? (
        <section className="space-y-3">
          {packs.map((b) => (
            <div key={String(b.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(b.pack_label)}</p>
              <p className="text-zinc-500">Revenue {formatCurrency(b.pack_revenue)} · Renewal {formatCurrency(b.renewal_revenue)} · {String(b.adoption_rate_pct)}% adoption</p>
              <p className="mt-1 text-zinc-600">{String(b.summary)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "companion" ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="font-semibold text-zinc-900">Companion Revenue Advisor</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {advisorPrompts.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          {risks.map((r) => (
            <div key={String(r.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-900">{String(r.title)}</p>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${RISK_SEVERITY_BADGES[String(r.severity)] ?? RISK_SEVERITY_BADGES.information}`}>
                  {labels.riskSeverities[String(r.severity)] ?? String(r.severity)}
                </span>
              </div>
              <p className="text-zinc-500">{String(r.risk_type)}</p>
              <p className="mt-1 text-zinc-600">{String(r.summary)}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("detect_revenue_risk", { title: "Revenue concentration risk", risk_type: "concentration" })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50">{labels.actions.detectRisk}</button>
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ring-1 ${REVENUE_HEALTH_BADGES[String(health.health_status)] ?? REVENUE_HEALTH_BADGES.healthy}`}>
              {labels.healthStatuses[String(health.health_status)] ?? String(health.health_status)}
            </span>
            <span className="text-sm text-zinc-600">Score {String(health.health_score ?? overview.revenue_health_score)}</span>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
              <OverviewCard key={key} label={key.replace(/_/g, " ")} value={typeof value === "number" && key.includes("revenue") ? formatCurrency(value) : String(value)} />
            ))}
          </dl>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
            <h2 className="font-semibold text-zinc-900">Revenue Health Breakdown</h2>
            <p className="mt-2 text-zinc-600">Customer: {String(health.customer_health_score)} · Renewal: {String(health.renewal_health_score)} · Expansion: {String(health.expansion_activity_score)}</p>
            <p className="text-zinc-600">Subscription: {String(health.subscription_stability_score)} · Payment: {String(health.payment_health_score)} · Partner: {String(health.partner_performance_score)}</p>
            <p className="mt-1 text-zinc-600">{String(health.summary)}</p>
          </div>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-zinc-600">{JSON.stringify(center.reports ?? {}, null, 2)}</pre>
        </section>
      ) : null}

      {center.audit_recent?.length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">Audit</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {center.audit_recent.map((entry, i) => <li key={`${entry.event_type}-${i}`}>{entry.summary}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
