"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseIndustryIntelligenceAction,
  parseIndustryIntelligenceCenter,
  type BenchmarkItem,
  type BusinessPackItem,
  type CompetitiveItem,
  type CompanionIndustryItem,
  type ExecutiveIndustryMetric,
  type IndustryIntelligenceCenter,
  type IndustryProfile,
  type IndustrySectionItem,
  type MarketMonitoringItem,
  type OpportunityItem,
  type RegulatoryItem,
} from "@/lib/industry-intelligence-center";
import type { IndustryIntelligenceCenterLabels } from "@/lib/industry-intelligence-center/labels";
import { IndustryStatusBadge } from "./IndustryStatusBadge";

type Props = { labels: IndustryIntelligenceCenterLabels };

function SectionCard({ title, items }: { title: string; items: IndustrySectionItem[] }) {
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
  relevanceLabel,
}: {
  labels: IndustryIntelligenceCenterLabels;
  sourceLabel?: string;
  dateLabel?: string;
  confidenceLabel?: string;
  relevanceLabel?: string;
}) {
  if (!sourceLabel && !dateLabel && !confidenceLabel && !relevanceLabel) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
      {sourceLabel ? <span><span className="font-medium">{labels.source}:</span> {sourceLabel}</span> : null}
      {dateLabel ? <span><span className="font-medium">{labels.date}:</span> {dateLabel}</span> : null}
      {confidenceLabel ? <span><span className="font-medium">{labels.confidence}:</span> {confidenceLabel}</span> : null}
      {relevanceLabel ? <span><span className="font-medium">{labels.relevance}:</span> {relevanceLabel}</span> : null}
    </div>
  );
}

export function IndustryIntelligenceCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<IndustryIntelligenceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/intelligence/industry");
    if (res.ok) setCenter(parseIndustryIntelligenceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/intelligence/industry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseIndustryIntelligenceAction(await res.json()).ok) await load();
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
            <Link href="/app/intelligence/consciousness" className="text-violet-700 hover:underline">{labels.links.consciousness}</Link>
            <Link href="/app/intelligence/corporate-brain" className="text-violet-700 hover:underline">{labels.links.corporateBrain}</Link>
            <Link href="/app/intelligence/strategy" className="text-violet-700 hover:underline">{labels.links.strategicIntelligence}</Link>
            <Link href="/app/industry-packs" className="text-violet-700 hover:underline">{labels.links.industryPacks}</Link>
            <Link href="/app/industry-intelligence-foundation-engine" className="text-violet-700 hover:underline">{labels.links.legacyIndustryIntelligence}</Link>
          </div>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          {labels.refresh}
        </button>
      </div>

      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.governanceControls.title}</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-700">
          <span>
            {center.intelligenceSettings.intelligenceEnabled
              ? labels.governanceControls.enabled
              : labels.governanceControls.disabled}
          </span>
          {center.intelligenceSettings.humanControlRequired ? (
            <span>{labels.governanceControls.humanControl}</span>
          ) : null}
        </div>
      </section>

      {center.executiveIndustryDashboard.length > 0 ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveIndustryDashboard.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.executiveIndustryDashboard.map((m: ExecutiveIndustryMetric) => (
              <div key={m.id} className="rounded-xl border border-violet-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">
                  {m.metricKey.replace(/_/g, " ")}
                </p>
                <p className="mt-1 text-2xl font-bold text-violet-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
                <div className="mt-2">
                  <IndustryStatusBadge statusKey={m.statusKey} labels={labels.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SectionCard title={labels.sections.industryOverview} items={center.sections.industry_overview} />
        <SectionCard title={labels.sections.marketTrends} items={center.sections.market_trends} />
        <SectionCard title={labels.sections.regulatoryChanges} items={center.sections.regulatory_changes} />
        <SectionCard title={labels.sections.competitiveIntelligence} items={center.sections.competitive_intelligence} />
        <SectionCard title={labels.sections.emergingOpportunities} items={center.sections.emerging_opportunities} />
        <SectionCard title={labels.sections.industryRisks} items={center.sections.industry_risks} />
        <SectionCard title={labels.sections.industryBenchmarks} items={center.sections.industry_benchmarks} />
      </div>

      {center.industryProfiles.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.industryProfiles.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {center.industryProfiles.map((p: IndustryProfile) => (
              <div key={p.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{p.industryName}</p>
                  <IndustryStatusBadge statusKey={p.statusKey} labels={labels.status} />
                </div>
                {p.signalLabel ? <p className="mt-2 text-xs text-violet-900"><span className="font-medium">{labels.signal}:</span> {p.signalLabel}</p> : null}
                {p.benchmarkLabel ? <p className="mt-1 text-xs text-zinc-600"><span className="font-medium">{labels.benchmark}:</span> {p.benchmarkLabel}</p> : null}
                {p.trendLabel ? <p className="mt-1 text-xs text-zinc-600"><span className="font-medium">{labels.trend}:</span> {p.trendLabel}</p> : null}
                {p.riskLabel ? <p className="mt-1 text-xs text-amber-900"><span className="font-medium">{labels.risk}:</span> {p.riskLabel}</p> : null}
                {p.opportunityLabel ? <p className="mt-1 text-xs text-emerald-900"><span className="font-medium">{labels.opportunity}:</span> {p.opportunityLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.marketMonitoringEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.marketMonitoringEngine.title}</h2>
          <ul className="space-y-3">
            {center.marketMonitoringEngine.map((item: MarketMonitoringItem) => (
              <li key={item.id} className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{item.monitoringType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} relevanceLabel={item.relevanceLabel} />
                  </div>
                  <IndustryStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.competitiveIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.competitiveIntelligence.title}</h2>
          <ul className="space-y-3">
            {center.competitiveIntelligence.map((item: CompetitiveItem) => (
              <li key={item.id} className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{item.competitiveType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} relevanceLabel={item.relevanceLabel} />
                  </div>
                  <IndustryStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.regulatoryIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.regulatoryIntelligence.title}</h2>
          <ul className="space-y-3">
            {center.regulatoryIntelligence.map((item: RegulatoryItem) => (
              <li key={item.id} className="rounded-xl border border-red-100 bg-red-50/20 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{item.regulatoryType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} relevanceLabel={item.relevanceLabel} />
                  </div>
                  <IndustryStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("regulatory", item.id, "acknowledge")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("regulatory", item.id, "resolve")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.resolve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("regulatory", item.id, "escalate")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.escalate}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.industryBenchmarkEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.industryBenchmarkEngine.title}</h2>
          <ul className="space-y-3">
            {center.industryBenchmarkEngine.map((item: BenchmarkItem) => (
              <li key={item.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <p className="text-xs font-medium uppercase text-zinc-500">{item.benchmarkType.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                {item.comparisonLabel ? <p className="mt-2 text-sm text-emerald-900"><span className="font-medium">{labels.comparison}:</span> {item.comparisonLabel}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.opportunityDetection.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.opportunityDetection.title}</h2>
          <ul className="space-y-3">
            {center.opportunityDetection.map((item: OpportunityItem) => (
              <li key={item.id} className="rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-violet-800">{item.opportunityType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} relevanceLabel={item.relevanceLabel} />
                  </div>
                  <IndustryStatusBadge statusKey={item.statusKey} labels={labels.status} />
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

      {center.businessPackAwareness.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.businessPackAwareness.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.businessPackAwareness.map((pack: BusinessPackItem) => (
              <div key={pack.id} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{pack.packName}</p>
                  <IndustryStatusBadge statusKey={pack.statusKey} labels={labels.status} />
                </div>
                {pack.enrichmentLabel ? <p className="mt-2 text-sm text-zinc-600">{pack.enrichmentLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.companionIndustryAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionIndustryAdvisor.map((item: CompanionIndustryItem) => (
              <li key={item.id} className="rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                <p className="font-medium text-zinc-900">{item.question}</p>
                {item.insight ? <p className="mt-2 text-sm text-zinc-700">{item.insight}</p> : null}
                {item.evidenceLabel ? (
                  <p className="mt-2 text-xs text-zinc-500">
                    <span className="font-medium">{labels.companionAdvisor.evidence}:</span> {item.evidenceLabel}
                  </p>
                ) : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} />
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
