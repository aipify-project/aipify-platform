"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseEconomicIntelligenceAction,
  parseEconomicIntelligenceCenter,
  type BusinessImpactItem,
  type CompanionEconomicItem,
  type ConsumerSpendingItem,
  type EconomicIntelligenceCenter,
  type EconomicSectionItem,
  type ExecutiveEconomicMetric,
  type MonitoringItem,
  type OpportunityItem,
  type RegionalItem,
  type ScenarioItem,
  type WorkforceItem,
} from "@/lib/economic-intelligence-center";
import type { EconomicIntelligenceCenterLabels } from "@/lib/economic-intelligence-center/labels";
import { EconomicStatusBadge } from "./EconomicStatusBadge";

type Props = { labels: EconomicIntelligenceCenterLabels };

function SectionCard({ title, items }: { title: string; items: EconomicSectionItem[] }) {
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
  labels: EconomicIntelligenceCenterLabels;
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

export function EconomicIntelligenceCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<EconomicIntelligenceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/intelligence/economy");
    if (res.ok) setCenter(parseEconomicIntelligenceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/intelligence/economy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseEconomicIntelligenceAction(await res.json()).ok) await load();
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
            <Link href="/app/intelligence/consciousness" className="text-violet-700 hover:underline">{labels.links.consciousness}</Link>
            <Link href="/app/intelligence/strategy" className="text-violet-700 hover:underline">{labels.links.strategicIntelligence}</Link>
            <Link href="/app/executive/board" className="text-violet-700 hover:underline">{labels.links.executiveBoard}</Link>
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

      {center.executiveEconomicDashboard.length > 0 ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveEconomicDashboard.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.executiveEconomicDashboard.map((m: ExecutiveEconomicMetric) => (
              <div key={m.id} className="rounded-xl border border-violet-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-violet-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
                <div className="mt-2"><EconomicStatusBadge statusKey={m.statusKey} labels={labels.status} /></div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <SectionCard title={labels.sections.economicOverview} items={center.sections.economic_overview} />
        <SectionCard title={labels.sections.inflation} items={center.sections.inflation} />
        <SectionCard title={labels.sections.interestRates} items={center.sections.interest_rates} />
        <SectionCard title={labels.sections.employment} items={center.sections.employment} />
        <SectionCard title={labels.sections.consumerTrends} items={center.sections.consumer_trends} />
        <SectionCard title={labels.sections.businessClimate} items={center.sections.business_climate} />
        <SectionCard title={labels.sections.economicRisks} items={center.sections.economic_risks} />
        <SectionCard title={labels.sections.economicOpportunities} items={center.sections.economic_opportunities} />
      </div>

      {center.economicMonitoringEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.economicMonitoringEngine.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.economicMonitoringEngine.map((item: MonitoringItem) => (
              <div key={item.id} className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{item.title}</p>
                  <EconomicStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {item.summary ? <p className="mt-2 text-sm text-zinc-600">{item.summary}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} impactLabel={item.impactLabel} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.regionalEconomicIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.regionalEconomicIntelligence.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.regionalEconomicIntelligence.map((item: RegionalItem) => (
              <div key={item.id} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{item.regionName}</p>
                  <EconomicStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {item.summary ? <p className="mt-2 text-sm text-zinc-600">{item.summary}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.businessImpactEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.businessImpactEngine.title}</h2>
          <ul className="space-y-3">
            {center.businessImpactEngine.map((item: BusinessImpactItem) => (
              <li key={item.id} className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{item.impactArea.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} impactLabel={item.impactLabel} />
                  </div>
                  <EconomicStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("business_impact", item.id, "acknowledge")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("business_impact", item.id, "resolve")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.resolve}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.consumerSpendingIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.consumerSpendingIntelligence.title}</h2>
          <ul className="space-y-3">
            {center.consumerSpendingIntelligence.map((item: ConsumerSpendingItem) => (
              <li key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase text-zinc-500">{item.spendingType.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} impactLabel={item.impactLabel} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.hiringWorkforceIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.hiringWorkforceIntelligence.title}</h2>
          <ul className="space-y-3">
            {center.hiringWorkforceIntelligence.map((item: WorkforceItem) => (
              <li key={item.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{item.workforceType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} impactLabel={item.impactLabel} />
                  </div>
                  <EconomicStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.economicOpportunityEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.economicOpportunityEngine.title}</h2>
          <ul className="space-y-3">
            {center.economicOpportunityEngine.map((item: OpportunityItem) => (
              <li key={item.id} className="rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-violet-800">{item.opportunityType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} impactLabel={item.impactLabel} />
                  </div>
                  <EconomicStatusBadge statusKey={item.statusKey} labels={labels.status} />
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

      {center.scenarioModeling.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.scenarioModeling.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.scenarioModeling.map((item: ScenarioItem) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{item.title}</p>
                  <EconomicStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {item.potentialImpact ? <p className="mt-2 text-sm text-zinc-700"><span className="font-medium">{labels.potentialImpact}:</span> {item.potentialImpact}</p> : null}
                {item.preparationLabel ? <p className="mt-2 text-sm text-violet-900"><span className="font-medium">{labels.preparation}:</span> {item.preparationLabel}</p> : null}
                <GovernanceMeta labels={labels} sourceLabel={item.sourceLabel} dateLabel={item.dateLabel} confidenceLabel={item.confidenceLabel} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.companionEconomicAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionEconomicAdvisor.map((item: CompanionEconomicItem) => (
              <li key={item.id} className="rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                <p className="font-medium text-zinc-900">{item.question}</p>
                {item.insight ? <p className="mt-2 text-sm text-zinc-700">{item.insight}</p> : null}
                {item.reasoningLabel ? <p className="mt-2 text-sm text-violet-900"><span className="font-medium">{labels.reasoning}:</span> {item.reasoningLabel}</p> : null}
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
