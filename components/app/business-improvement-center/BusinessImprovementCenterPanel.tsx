"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseBusinessImprovementAction,
  parseBusinessImprovementCenter,
  type BusinessImprovementCenter,
  type CompanionAdvisorItem,
  type CostItem,
  type CustomerExperienceItem,
  type DiscoverySignal,
  type ImprovementPlan,
  type ImprovementSectionItem,
  type ProcessItem,
  type RevenueItem,
} from "@/lib/business-improvement-center";
import type { BusinessImprovementCenterLabels } from "@/lib/business-improvement-center/labels";
import { getScoreLabel } from "@/lib/business-improvement-center/labels";
import { ImprovementStatusBadge } from "./ImprovementStatusBadge";

type Props = { labels: BusinessImprovementCenterLabels };

function ScoreRow({ item, labels }: { item: ImprovementSectionItem | ImprovementPlan; labels: BusinessImprovementCenterLabels }) {
  const scores = "impactScore" in item ? item : item;
  return (
    <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
      <div><dt className="inline font-medium">{labels.scoring.impact}: </dt><dd className="inline">{getScoreLabel(scores.impactScore, labels.scoring)}</dd></div>
      <div><dt className="inline font-medium">{labels.scoring.risk}: </dt><dd className="inline">{getScoreLabel(scores.riskScore, labels.scoring)}</dd></div>
      <div><dt className="inline font-medium">{labels.scoring.complexity}: </dt><dd className="inline">{getScoreLabel(scores.complexityScore, labels.scoring)}</dd></div>
      <div><dt className="inline font-medium">{labels.scoring.priority}: </dt><dd className="inline">{getScoreLabel(scores.priorityLevel, labels.scoring)}</dd></div>
    </dl>
  );
}

function SectionBlock({ title, items, labels }: { title: string; items: ImprovementSectionItem[]; labels: BusinessImprovementCenterLabels }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <span className="text-sm text-zinc-500">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">{labels.emptyState}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-zinc-900">{item.title}</p>
                  {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                  {item.suggestedAction ? (
                    <p className="mt-2 text-sm text-indigo-800"><span className="font-medium">{labels.suggestedAction}:</span> {item.suggestedAction}</p>
                  ) : null}
                  {item.estimatedBenefit ? (
                    <p className="mt-1 text-xs text-emerald-700">{labels.estimatedBenefit}: {item.estimatedBenefit}</p>
                  ) : null}
                  <ScoreRow item={item} labels={labels} />
                </div>
                <ImprovementStatusBadge statusKey={item.statusKey} labels={labels.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function BusinessImprovementCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<BusinessImprovementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/intelligence/improvements");
    if (res.ok) setCenter(parseBusinessImprovementCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/intelligence/improvements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseBusinessImprovementAction(await res.json()).ok) await load();
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

  const { sections, executiveDashboard } = center;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-indigo-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/app/continuous-improvement-engine" className="text-indigo-700 hover:underline">{labels.links.legacyEngine}</Link>
            <Link href="/app/executive/continuous-improvement" className="text-indigo-700 hover:underline">{labels.links.executiveImprovement}</Link>
          </div>
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveDashboard.title}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-indigo-100 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{labels.executiveDashboard.totalOpportunities}</p>
            <p className="mt-1 text-2xl font-bold text-indigo-900">{executiveDashboard.totalOpportunities}</p>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-white p-4 sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{labels.executiveDashboard.estimatedRevenueGain}</p>
            <p className="mt-1 text-sm font-semibold text-emerald-800">{executiveDashboard.estimatedRevenueGain}</p>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-white p-4 sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{labels.executiveDashboard.estimatedCostSavings}</p>
            <p className="mt-1 text-sm font-semibold text-emerald-800">{executiveDashboard.estimatedCostSavings}</p>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{labels.executiveDashboard.completedImprovements}</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">{executiveDashboard.completedImprovements}</p>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{labels.executiveDashboard.pendingImprovements}</p>
            <p className="mt-1 text-2xl font-bold text-amber-800">{executiveDashboard.pendingImprovements}</p>
          </div>
        </div>
      </section>

      <SectionBlock title={labels.sections.improvementOpportunities} items={sections.improvementOpportunities} labels={labels} />
      <SectionBlock title={labels.sections.recommendedActions} items={sections.recommendedActions} labels={labels} />
      <SectionBlock title={labels.sections.revenueOpportunities} items={sections.revenueOpportunities} labels={labels} />
      <SectionBlock title={labels.sections.costSavings} items={sections.costSavings} labels={labels} />
      <SectionBlock title={labels.sections.processImprovements} items={sections.processImprovements} labels={labels} />
      <SectionBlock title={labels.sections.customerExperienceImprovements} items={sections.customerExperienceImprovements} labels={labels} />
      <SectionBlock title={labels.sections.completedImprovements} items={sections.completedImprovements} labels={labels} />

      {center.opportunityDiscovery.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.opportunityDiscovery.title}</h2>
          <ul className="space-y-3">
            {center.opportunityDiscovery.map((sig: DiscoverySignal) => (
              <li key={sig.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-amber-800">{sig.analysisDomain} · {sig.signalType}</p>
                    <p className="mt-1 font-medium text-zinc-900">{sig.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{sig.summary}</p>
                  </div>
                  <ImprovementStatusBadge statusKey={sig.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.revenueIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.revenueIntelligence.title}</h2>
          <ul className="space-y-3">
            {center.revenueIntelligence.map((item: RevenueItem) => (
              <li key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-emerald-700">{item.opportunityType}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{item.summary}</p>
                    {item.customerCount > 0 ? (
                      <p className="mt-2 text-sm text-indigo-800">{labels.revenueIntelligence.customerCount}: {item.customerCount}</p>
                    ) : null}
                    {item.suggestedAction ? (
                      <p className="mt-1 text-sm text-indigo-800"><span className="font-medium">{labels.suggestedAction}:</span> {item.suggestedAction}</p>
                    ) : null}
                  </div>
                  <ImprovementStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.costOptimization.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.costOptimization.title}</h2>
          <ul className="space-y-3">
            {center.costOptimization.map((item: CostItem) => (
              <li key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-600">{item.costType}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{item.summary}</p>
                    {item.potentialSavingsLabel ? (
                      <p className="mt-2 text-sm font-medium text-emerald-800">{labels.costOptimization.potentialSavings}: {item.potentialSavingsLabel}</p>
                    ) : null}
                  </div>
                  <ImprovementStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.processOptimization.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.processOptimization.title}</h2>
          <ul className="space-y-3">
            {center.processOptimization.map((item: ProcessItem) => (
              <li key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-600">{item.workflowType}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{item.summary}</p>
                    {item.timeReductionLabel ? (
                      <p className="mt-2 text-sm font-medium text-indigo-800">{labels.processOptimization.timeReduction}: {item.timeReductionLabel}</p>
                    ) : null}
                  </div>
                  <ImprovementStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.customerExperience.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.customerExperience.title}</h2>
          <ul className="space-y-3">
            {center.customerExperience.map((item: CustomerExperienceItem) => (
              <li key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-600">{item.metricType}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{item.summary}</p>
                    {item.benchmarkLabel ? (
                      <p className="mt-2 text-sm text-amber-800">{labels.customerExperience.benchmark}: {item.benchmarkLabel}</p>
                    ) : null}
                  </div>
                  <ImprovementStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.improvementPlans.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.improvementPlans.title}</h2>
          <ul className="space-y-3">
            {center.improvementPlans.map((plan: ImprovementPlan) => (
              <li key={plan.id} className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4">
                <ScoreRow item={plan} labels={labels} />
                <dl className="mt-3 space-y-2 text-sm">
                  <div><dt className="font-medium text-zinc-900">{labels.improvementPlans.problem}</dt><dd className="mt-0.5 text-zinc-600">{plan.problem}</dd></div>
                  <div><dt className="font-medium text-zinc-900">{labels.improvementPlans.cause}</dt><dd className="mt-0.5 text-zinc-600">{plan.cause}</dd></div>
                  <div><dt className="font-medium text-zinc-900">{labels.improvementPlans.recommendedSolution}</dt><dd className="mt-0.5 text-zinc-600">{plan.recommendedSolution}</dd></div>
                  <div><dt className="font-medium text-zinc-900">{labels.improvementPlans.expectedOutcome}</dt><dd className="mt-0.5 text-zinc-600">{plan.expectedOutcome}</dd></div>
                  {plan.estimatedBenefit ? (
                    <div><dt className="font-medium text-emerald-800">{labels.estimatedBenefit}</dt><dd className="mt-0.5 text-emerald-700">{plan.estimatedBenefit}</dd></div>
                  ) : null}
                </dl>
                {center.canManage ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("plan", plan.id, "approve")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{labels.actions.approve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("plan", plan.id, "complete")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("plan", plan.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.companionAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionAdvisor.map((item: CompanionAdvisorItem) => (
              <li key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase text-indigo-700">{item.recommendationType}</p>
                <p className="mt-1 font-medium text-zinc-900">{item.recommendation}</p>
                <p className="mt-2 text-sm text-zinc-600"><span className="font-medium">{labels.companionAdvisor.reason}:</span> {item.reason}</p>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("advisor", item.id, "acknowledge")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("advisor", item.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.dismiss}</button>
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
