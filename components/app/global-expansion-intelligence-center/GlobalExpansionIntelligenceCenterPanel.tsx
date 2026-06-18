"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseGlobalExpansionIntelligenceAction,
  parseGlobalExpansionIntelligenceCenter,
  type CompanionExpansionItem,
  type CountryProfile,
  type ExecutiveExpansionMetric,
  type ExpansionOpportunityItem,
  type ExpansionSectionItem,
  type GlobalExpansionIntelligenceCenter,
  type LocalizationItem,
  type MarketEntryItem,
  type OperationsItem,
  type ReadinessItem,
  type RegulatoryItem,
  type SimulationItem,
} from "@/lib/global-expansion-intelligence-center";
import type { GlobalExpansionIntelligenceCenterLabels } from "@/lib/global-expansion-intelligence-center/labels";
import { GlobalExpansionStatusBadge } from "./GlobalExpansionStatusBadge";

type Props = { labels: GlobalExpansionIntelligenceCenterLabels };

function SectionCard({ title, items }: { title: string; items: ExpansionSectionItem[] }) {
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
  riskLabel,
}: {
  labels: GlobalExpansionIntelligenceCenterLabels;
  sourceLabel?: string;
  dateLabel?: string;
  confidenceLabel?: string;
  riskLabel?: string;
}) {
  if (!sourceLabel && !dateLabel && !confidenceLabel && !riskLabel) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
      {sourceLabel ? <span><span className="font-medium">{labels.source}:</span> {sourceLabel}</span> : null}
      {dateLabel ? <span><span className="font-medium">{labels.date}:</span> {dateLabel}</span> : null}
      {confidenceLabel ? <span><span className="font-medium">{labels.confidence}:</span> {confidenceLabel}</span> : null}
      {riskLabel ? <span><span className="font-medium">{labels.risk}:</span> {riskLabel}</span> : null}
    </div>
  );
}

export function GlobalExpansionIntelligenceCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<GlobalExpansionIntelligenceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/intelligence/global-expansion");
    if (res.ok) setCenter(parseGlobalExpansionIntelligenceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/intelligence/global-expansion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseGlobalExpansionIntelligenceAction(await res.json()).ok) await load();
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
            <Link href="/app/intelligence/market" className="text-violet-700 hover:underline">{labels.links.marketIntelligence}</Link>
            <Link href="/app/intelligence/industry" className="text-violet-700 hover:underline">{labels.links.industryIntelligence}</Link>
            <Link href="/app/intelligence/economy" className="text-violet-700 hover:underline">{labels.links.economicIntelligence}</Link>
            <Link href="/app/global-expansion" className="text-violet-700 hover:underline">{labels.links.legacyGlobalExpansion}</Link>
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

      {center.expansionReadinessScore ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">{labels.expansionScore}</p>
          <p className="mt-1 text-4xl font-bold text-emerald-900">{center.expansionReadinessScore}</p>
        </section>
      ) : null}

      {center.executiveExpansionDashboard.length > 0 ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveExpansionDashboard.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.executiveExpansionDashboard.map((m: ExecutiveExpansionMetric) => (
              <div key={m.id} className="rounded-xl border border-violet-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-violet-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
                <div className="mt-2"><GlobalExpansionStatusBadge statusKey={m.statusKey} labels={labels.status} /></div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <SectionCard title={labels.sections.expansionOverview} items={center.sections.expansion_overview} />
        <SectionCard title={labels.sections.countryIntelligence} items={center.sections.country_intelligence} />
        <SectionCard title={labels.sections.localizationIntelligence} items={center.sections.localization_intelligence} />
        <SectionCard title={labels.sections.regulatoryIntelligence} items={center.sections.regulatory_intelligence} />
        <SectionCard title={labels.sections.marketEntryAnalysis} items={center.sections.market_entry_analysis} />
        <SectionCard title={labels.sections.expansionOpportunities} items={center.sections.expansion_opportunities} />
        <SectionCard title={labels.sections.expansionRoadmaps} items={center.sections.expansion_roadmaps} />
      </div>

      {center.countryIntelligenceEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.countryIntelligenceEngine.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.countryIntelligenceEngine.map((item: CountryProfile) => (
              <div key={item.id} className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{item.countryName}</p>
                    <p className="mt-1 text-xs capitalize text-blue-800">{item.profileType.replace(/_/g, " ")}</p>
                  </div>
                  <GlobalExpansionStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {item.marketSizeLabel ? <p className="mt-2 text-sm text-zinc-700"><span className="font-medium">{labels.marketSize}:</span> {item.marketSizeLabel}</p> : null}
                {item.languageLabel ? <p className="mt-1 text-sm text-zinc-600"><span className="font-medium">{labels.language}:</span> {item.languageLabel}</p> : null}
                {item.businessEnvironmentLabel ? <p className="mt-1 text-xs text-zinc-500"><span className="font-medium">{labels.businessEnvironment}:</span> {item.businessEnvironmentLabel}</p> : null}
                {item.growthPotentialLabel ? <p className="mt-1 text-xs text-zinc-500"><span className="font-medium">{labels.growthPotential}:</span> {item.growthPotentialLabel}</p> : null}
                {item.competitionLevelLabel ? <p className="mt-1 text-xs text-zinc-500"><span className="font-medium">{labels.competitionLevel}:</span> {item.competitionLevelLabel}</p> : null}
                {item.riskLevelLabel ? <p className="mt-1 text-xs text-zinc-500"><span className="font-medium">{labels.riskLevel}:</span> {item.riskLevelLabel}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.localizationIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.localizationIntelligence.title}</h2>
          <ul className="space-y-3">
            {center.localizationIntelligence.map((item: LocalizationItem) => (
              <li key={item.id} className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{item.localizationType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} riskLabel={item.riskLabel} />
                  </div>
                  <GlobalExpansionStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.marketEntryAnalysis.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.marketEntryAnalysis.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.marketEntryAnalysis.map((item: MarketEntryItem) => (
              <div key={item.id} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{item.marketName}</p>
                  <GlobalExpansionStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {item.demandLabel ? <p className="mt-2 text-sm text-zinc-700"><span className="font-medium">{labels.demand}:</span> {item.demandLabel}</p> : null}
                {item.competitionLabel ? <p className="mt-1 text-sm text-zinc-600"><span className="font-medium">{labels.competitionLevel}:</span> {item.competitionLabel}</p> : null}
                {item.investmentLabel ? <p className="mt-1 text-sm text-zinc-600"><span className="font-medium">{labels.investment}:</span> {item.investmentLabel}</p> : null}
                {item.revenuePotentialLabel ? <p className="mt-1 text-sm text-zinc-600"><span className="font-medium">{labels.revenuePotential}:</span> {item.revenuePotentialLabel}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} riskLabel={item.riskLabel} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.expansionReadinessEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.expansionReadinessEngine.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.expansionReadinessEngine.map((item: ReadinessItem) => (
              <div key={item.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <p className="text-xs font-medium uppercase text-zinc-500">{item.dimensionName}</p>
                <p className="mt-1 text-2xl font-bold text-emerald-900">{item.scoreLabel}</p>
                <div className="mt-2"><GlobalExpansionStatusBadge statusKey={item.statusKey} labels={labels.status} /></div>
              </div>
            ))}
          </div>
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
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} riskLabel={item.riskLabel} />
                  </div>
                  <GlobalExpansionStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("regulatory", item.id, "resolve")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.resolve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("regulatory", item.id, "escalate")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.escalate}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.internationalOperationsIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.internationalOperationsIntelligence.title}</h2>
          <ul className="space-y-3">
            {center.internationalOperationsIntelligence.map((item: OperationsItem) => (
              <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{item.operationsType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} riskLabel={item.riskLabel} />
                  </div>
                  <GlobalExpansionStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.expansionOpportunities.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.expansionOpportunities.title}</h2>
          <ul className="space-y-3">
            {center.expansionOpportunities.map((item: ExpansionOpportunityItem) => (
              <li key={item.id} className="rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="mt-1 font-medium text-zinc-900">{item.opportunityTitle}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} riskLabel={item.riskLabel} />
                  </div>
                  <GlobalExpansionStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("expansion_opportunity", item.id, "acknowledge")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("expansion_opportunity", item.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.expansionSimulationEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.expansionSimulationEngine.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.expansionSimulationEngine.map((item: SimulationItem) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-900">{item.marketName}</p>
                  <GlobalExpansionStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {item.bestCaseLabel ? <p className="mt-2 text-sm text-emerald-800"><span className="font-medium">{labels.bestCase}:</span> {item.bestCaseLabel}</p> : null}
                {item.expectedCaseLabel ? <p className="mt-2 text-sm text-zinc-700"><span className="font-medium">{labels.expectedCase}:</span> {item.expectedCaseLabel}</p> : null}
                {item.worstCaseLabel ? <p className="mt-2 text-sm text-amber-800"><span className="font-medium">{labels.worstCase}:</span> {item.worstCaseLabel}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.companionExpansionAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionExpansionAdvisor.map((item: CompanionExpansionItem) => (
              <li key={item.id} className="rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                <p className="font-medium text-zinc-900">{item.question}</p>
                {item.insight ? <p className="mt-2 text-sm text-zinc-700">{item.insight}</p> : null}
                {item.reasoningLabel ? <p className="mt-2 text-xs text-zinc-600"><span className="font-medium">{labels.reasoning}:</span> {item.reasoningLabel}</p> : null}
                {item.evidenceLabel ? <p className="mt-1 text-xs text-zinc-500"><span className="font-medium">{labels.companionAdvisor.evidence}:</span> {item.evidenceLabel}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} riskLabel={item.riskLabel} />
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
