"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  MARKET_STATUS_BADGES,
  THREAT_SEVERITY_BADGES,
  parseMarketObservatoryCenter,
  type MarketObservatoryCenter,
  type MarketObservatoryLabels,
  type MarketObservatoryTab,
  type MarketRow,
} from "@/lib/market-intelligence-operations";

type Props = {
  labels: MarketObservatoryLabels;
  backHref: string;
  initialTab?: MarketObservatoryTab;
  visibleTabs?: MarketObservatoryTab[];
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

const ALL_TABS: MarketObservatoryTab[] = [
  "overview", "markets", "competitors", "industries", "trends",
  "opportunities", "threats", "companion", "executive", "reports",
];

export function MarketObservatoryPanel({
  labels, backHref, initialTab = "overview", visibleTabs, titleOverride, subtitleOverride,
}: Props) {
  const tabs = visibleTabs ?? ALL_TABS;
  const [center, setCenter] = useState<MarketObservatoryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<MarketObservatoryTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/market-intelligence-operations");
    if (res.ok) setCenter(parseMarketObservatoryCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/market-intelligence-operations/action", {
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
  const markets = center.market_observatory ?? [];
  const competitors = center.competitor_intelligence ?? [];
  const industries = center.industry_intelligence ?? [];
  const trends = center.trend_detection ?? [];
  const opportunities = center.opportunity_engine ?? [];
  const threats = center.threat_detection ?? [];
  const signals = center.external_signals_dashboard ?? [];
  const briefings = center.executive_briefings ?? [];
  const positioning = center.competitive_positioning ?? {};
  const advisorPrompts = (center.companion_market_advisor?.advisor_prompts as string[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{subtitleOverride ?? labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.ethics_note ? (
          <p className="mt-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">{labels.ethicsNote}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/market-intelligence/markets" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.actions.openMarkets}</Link>
        <Link href="/app/simulation" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openSimulation}</Link>
        <Link href="/app/intelligence/market" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openLegacyCenter}</Link>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_briefing", { cadence: "weekly", title: "Executive Market Briefing" })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium disabled:opacity-50">{labels.actions.generateBriefing}</button>
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
          <OverviewCard label={labels.overview.avgMarketHealth} value={overview.avg_market_health ?? 0} />
          <OverviewCard label={labels.overview.marketsTracked} value={overview.markets_tracked ?? 0} />
          <OverviewCard label={labels.overview.competitorsTracked} value={overview.competitors_tracked ?? 0} />
          <OverviewCard label={labels.overview.openOpportunities} value={overview.open_opportunities ?? 0} />
          <OverviewCard label={labels.overview.activeThreats} value={overview.active_threats ?? 0} />
          <OverviewCard label={labels.overview.activeTrends} value={overview.active_trends ?? 0} />
          <OverviewCard label={labels.overview.industriesTracked} value={overview.industries_tracked ?? 0} />
          <OverviewCard label={labels.overview.externalSignals} value={overview.external_signals ?? 0} />
        </dl>
      ) : null}

      {tab === "markets" ? (
        <section className="space-y-4">
          {markets.map((m: MarketRow) => (
            <div key={m.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-900">{m.market_name}</p>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${MARKET_STATUS_BADGES[m.market_status ?? "stable"] ?? MARKET_STATUS_BADGES.stable}`}>
                  {labels.marketStatuses[m.market_status ?? "stable"] ?? m.market_status}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">{m.region_label} · {m.industry_label} · {m.growth_rate_pct}% growth · health {m.health_score}</p>
              <p className="mt-1 text-sm text-zinc-600">{m.summary}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "competitors" ? (
        <section className="space-y-4">
          {competitors.map((c) => (
            <div key={String(c.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(c.competitor_name)}</p>
              <p className="text-zinc-500">{String(c.industry_label)} · {String(c.positioning_summary)}</p>
              <p className="mt-1 text-zinc-600">Strengths: {String(c.strengths)}</p>
              <p className="text-zinc-600">Differentiators: {String(c.differentiators)}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("add_competitor", { competitor_name: "New competitor", industry_label: "General" })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.actions.addCompetitor}</button>
        </section>
      ) : null}

      {tab === "industries" ? (
        <section className="space-y-3">
          {industries.map((i) => (
            <div key={String(i.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(i.industry_name)} · {String(i.growth_outlook)}</p>
              <p className="mt-1 text-zinc-600">{String(i.trend_summary)}</p>
              <p className="text-zinc-500">Risks: {String(i.emerging_risks)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "trends" ? (
        <section className="space-y-4">
          {trends.map((t) => (
            <div key={String(t.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(t.title)}</p>
              <p className="text-zinc-500">{String(t.trend_type)} · {String(t.direction)} · {String(t.confidence)}</p>
              <p className="mt-1 text-zinc-600">{String(t.summary)}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("identify_trend", { title: "New market trend", trend_type: "industry" })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50">{labels.actions.identifyTrend}</button>
        </section>
      ) : null}

      {tab === "opportunities" ? (
        <section className="space-y-4">
          {opportunities.map((o) => (
            <div key={String(o.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(o.title)}</p>
              <p className="text-zinc-500">{String(o.opportunity_type)} · {String(o.region_label)} · impact {String(o.impact_label)}</p>
              <p className="mt-1 text-zinc-600">{String(o.summary)}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("detect_opportunity", { title: "New market opportunity", opportunity_type: "expansion" })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.actions.detectOpportunity}</button>
        </section>
      ) : null}

      {tab === "threats" ? (
        <section className="space-y-4">
          {threats.map((t) => (
            <div key={String(t.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-900">{String(t.title)}</p>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${THREAT_SEVERITY_BADGES[String(t.severity)] ?? THREAT_SEVERITY_BADGES.information}`}>
                  {labels.threatSeverities[String(t.severity)] ?? String(t.severity)}
                </span>
              </div>
              <p className="text-zinc-500">{String(t.threat_type)}</p>
              <p className="mt-1 text-zinc-600">{String(t.summary)}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("flag_threat", { title: "New market threat", threat_type: "market_risk" })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50">{labels.actions.flagThreat}</button>
        </section>
      ) : null}

      {tab === "companion" ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="font-semibold text-zinc-900">Companion Market Advisor</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {advisorPrompts.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          {signals.map((s) => (
            <div key={String(s.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(s.title)}</p>
              <p className="text-zinc-500">{String(s.signal_type)} · {String(s.alert_level)}</p>
              <p className="mt-1 text-zinc-600">{String(s.summary)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
              <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
            ))}
          </dl>
          {briefings.map((b) => (
            <div key={String(b.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(b.title)} · {String(b.cadence)}</p>
              <p className="mt-1 text-zinc-600">{String(b.summary)}</p>
            </div>
          ))}
          {Object.keys(positioning).length ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <h2 className="font-semibold text-zinc-900">Competitive Positioning</h2>
              <p className="mt-2 text-zinc-600">Strengths: {String(positioning.strengths)}</p>
              <p className="text-zinc-600">Differentiators: {String(positioning.differentiators)}</p>
              <p className="text-zinc-600">Why customers choose us: {String(positioning.why_customers_choose)}</p>
            </div>
          ) : null}
          {(center.business_pack_intelligence ?? []).map((b) => (
            <div key={String(b.id)} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
              {String(b.pack_label)} — demand {String(b.industry_demand)} · {String(b.growth_opportunity)}
            </div>
          ))}
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
