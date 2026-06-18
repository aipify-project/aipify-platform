"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseMarketIntelligenceAction,
  parseMarketIntelligenceCenter,
  type CompanionMarketItem,
  type CustomerBehaviorItem,
  type ExecutiveMarketMetric,
  type ForecastItem,
  type GeographicItem,
  type MarketGapItem,
  type MarketIntelligenceCenter,
  type MarketSectionItem,
  type MonitoringItem,
  type OpportunityItem,
  type RevenueOpportunityItem,
} from "@/lib/market-intelligence-center";
import type { MarketIntelligenceCenterLabels } from "@/lib/market-intelligence-center/labels";
import { MarketStatusBadge } from "./MarketStatusBadge";

type Props = { labels: MarketIntelligenceCenterLabels };

function SectionCard({ title, items }: { title: string; items: MarketSectionItem[] }) {
  if (items.length === 0) return null;
  const item = items[0];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-1 font-semibold text-zinc-900">{item.title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      {item.metricValue ? (
        <p className="mt-2 text-lg font-bold text-violet-900">
          {item.metricLabel}: {item.metricValue}
        </p>
      ) : null}
    </div>
  );
}

function GovernanceMeta({
  labels,
  sourceLabel,
  dateLabel,
  confidenceLabel,
  impactLabel,
}: {
  labels: MarketIntelligenceCenterLabels;
  sourceLabel?: string;
  dateLabel?: string;
  confidenceLabel?: string;
  impactLabel?: string;
}) {
  if (!sourceLabel && !dateLabel && !confidenceLabel && !impactLabel) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
      {sourceLabel ? <span><span className="font-medium">{labels.source}:</span> {sourceLabel}</span> : null}
      {dateLabel ? <span><span className="font-medium">{labels.date}:</span> {dateLabel}</span> : null}
      {confidenceLabel ? <span><span className="font-medium">{labels.confidence}:</span> {confidenceLabel}</span> : null}
      {impactLabel ? <span><span className="font-medium">{labels.impact}:</span> {impactLabel}</span> : null}
    </div>
  );
}

export function MarketIntelligenceCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<MarketIntelligenceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/intelligence/market");
    if (res.ok) setCenter(parseMarketIntelligenceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/intelligence/market", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseMarketIntelligenceAction(await res.json()).ok) await load();
    setBusy(false);
  };

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-violet-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/app/intelligence/industry" className="text-violet-700 hover:underline">{labels.links.industryIntelligence}</Link>
            <Link href="/app/intelligence/economy" className="text-violet-700 hover:underline">{labels.links.economicIntelligence}</Link>
            <Link href="/app/intelligence/consciousness" className="text-violet-700 hover:underline">{labels.links.consciousness}</Link>
            <Link href="/app/intelligence/strategy" className="text-violet-700 hover:underline">{labels.links.strategicIntelligence}</Link>
          </div>
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.governanceControls.title}</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-700">
          <span>{center.intelligenceSettings.intelligenceEnabled ? labels.governanceControls.enabled : labels.governanceControls.disabled}</span>
          {center.intelligenceSettings.humanControlRequired ? <span>{labels.governanceControls.humanControl}</span> : null}
        </div>
      </section>

      {center.executiveMarketDashboard.length > 0 ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveMarketDashboard.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.executiveMarketDashboard.map((m: ExecutiveMarketMetric) => (
              <div key={m.id} className="rounded-xl border border-violet-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-violet-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
                <div className="mt-2"><MarketStatusBadge statusKey={m.statusKey} labels={labels.status} /></div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <SectionCard title={labels.sections.marketOverview} items={center.sections.market_overview} />
        <SectionCard title={labels.sections.customerTrends} items={center.sections.customer_trends} />
        <SectionCard title={labels.sections.opportunityDetection} items={center.sections.opportunity_detection} />
        <SectionCard title={labels.sections.marketGaps} items={center.sections.market_gaps} />
        <SectionCard title={labels.sections.expansionOpportunities} items={center.sections.expansion_opportunities} />
        <SectionCard title={labels.sections.emergingDemand} items={center.sections.emerging_demand} />
        <SectionCard title={labels.sections.marketForecasts} items={center.sections.market_forecasts} />
      </div>

      {center.marketMonitoringEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.marketMonitoringEngine.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.marketMonitoringEngine.map((item: MonitoringItem) => (
              <div key={item.id} className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{item.title}</p>
                  <MarketStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {item.summary ? <p className="mt-2 text-sm text-zinc-600">{item.summary}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} impactLabel={item.impactLabel} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.customerBehaviorIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.customerBehaviorIntelligence.title}</h2>
          <ul className="space-y-3">
            {center.customerBehaviorIntelligence.map((item: CustomerBehaviorItem) => (
              <li key={item.id} className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{item.behaviorType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} impactLabel={item.impactLabel} />
                  </div>
                  <MarketStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.opportunityDiscoveryEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.opportunityDiscoveryEngine.title}</h2>
          <ul className="space-y-3">
            {center.opportunityDiscoveryEngine.map((item: OpportunityItem) => (
              <li key={item.id} className="rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-violet-800">{item.opportunityType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} impactLabel={item.impactLabel} />
                  </div>
                  <MarketStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("opportunity", item.id, "acknowledge")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("opportunity", item.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.marketGapDetection.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.marketGapDetection.title}</h2>
          <ul className="space-y-3">
            {center.marketGapDetection.map((item: MarketGapItem) => (
              <li key={item.id} className="rounded-xl border border-red-100 bg-red-50/20 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{item.gapType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} impactLabel={item.impactLabel} />
                  </div>
                  <MarketStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("market_gap", item.id, "resolve")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.resolve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("market_gap", item.id, "escalate")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.escalate}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.geographicExpansionIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.geographicExpansionIntelligence.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.geographicExpansionIntelligence.map((item: GeographicItem) => (
              <div key={item.id} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{item.geoName}</p>
                  <MarketStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                <p className="mt-1 text-xs text-indigo-800 capitalize">{item.geoType}</p>
                {item.summary ? <p className="mt-2 text-sm text-zinc-600">{item.summary}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.revenueOpportunityEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.revenueOpportunityEngine.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.revenueOpportunityEngine.map((item: RevenueOpportunityItem) => (
              <div key={item.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{item.opportunityTitle}</p>
                  <MarketStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {item.opportunityScoreLabel ? <p className="mt-2 text-lg font-bold text-emerald-900">{labels.opportunityScore}: {item.opportunityScoreLabel}</p> : null}
                {item.potentialRevenueLabel ? <p className="mt-1 text-sm text-zinc-700"><span className="font-medium">{labels.potentialRevenue}:</span> {item.potentialRevenueLabel}</p> : null}
                {item.adoptionPotentialLabel ? <p className="mt-1 text-sm text-zinc-600"><span className="font-medium">{labels.adoptionPotential}:</span> {item.adoptionPotentialLabel}</p> : null}
                {item.marketSizeLabel ? <p className="mt-1 text-xs text-zinc-500"><span className="font-medium">{labels.marketSize}:</span> {item.marketSizeLabel}</p> : null}
                {item.competitionLevelLabel ? <p className="mt-1 text-xs text-zinc-500"><span className="font-medium">{labels.competitionLevel}:</span> {item.competitionLevelLabel}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} impactLabel={item.impactLabel} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.forecastingEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.forecastingEngine.title}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {center.forecastingEngine.map((item: ForecastItem) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <p className="font-semibold text-slate-900">{item.horizonLabel}</p>
                {item.forecastSummary ? <p className="mt-2 text-sm text-zinc-700">{item.forecastSummary}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.companionMarketAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionMarketAdvisor.map((item: CompanionMarketItem) => (
              <li key={item.id} className="rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                <p className="font-medium text-zinc-900">{item.question}</p>
                {item.insight ? <p className="mt-2 text-sm text-zinc-700">{item.insight}</p> : null}
                {item.evidenceLabel ? <p className="mt-2 text-xs text-zinc-500"><span className="font-medium">{labels.companionAdvisor.evidence}:</span> {item.evidenceLabel}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} impactLabel={item.impactLabel} />
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "acknowledge")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
