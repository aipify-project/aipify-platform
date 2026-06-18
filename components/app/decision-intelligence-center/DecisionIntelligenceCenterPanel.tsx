"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseDecisionIntelligenceAction,
  parseDecisionIntelligenceCenter,
  type DecisionIntelligenceCenter,
  type DecisionIntelligenceCenterLabels,
  type DecisionOption,
  type DecisionWorkspaceItem,
  type ExecutiveAdvisorRecommendation,
  type ExecutiveBriefing,
  type DecisionRiskItem,
} from "@/lib/decision-intelligence-center";
import { DecisionStatusBadge } from "./DecisionStatusBadge";

type Props = { labels: DecisionIntelligenceCenterLabels };

function DecisionCard({ item, labels }: { item: DecisionWorkspaceItem; labels: DecisionIntelligenceCenterLabels }) {
  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-zinc-900">{item.title}</p>
          {item.description ? <p className="mt-1 text-sm text-zinc-600">{item.description}</p> : null}
        </div>
        <DecisionStatusBadge statusKey={item.statusKey} labels={labels.status} />
      </div>
      <dl className="mt-3 grid gap-1 text-xs text-zinc-500 sm:grid-cols-2">
        <div><dt className="inline font-medium text-zinc-600">{labels.workspace.owner}: </dt><dd className="inline">{item.owner}</dd></div>
        <div><dt className="inline font-medium text-zinc-600">{labels.workspace.businessArea}: </dt><dd className="inline">{item.businessArea}</dd></div>
        <div><dt className="inline font-medium text-zinc-600">{labels.workspace.priority}: </dt><dd className="inline">{item.priority}</dd></div>
        {item.reasoning ? <div className="sm:col-span-2"><dt className="inline font-medium text-zinc-600">{labels.workspace.reasoning}: </dt><dd className="inline">{item.reasoning}</dd></div> : null}
        {item.expectedResult ? <div><dt className="inline font-medium text-zinc-600">{labels.workspace.expectedResult}: </dt><dd className="inline">{item.expectedResult}</dd></div> : null}
        {item.actualResult ? <div><dt className="inline font-medium text-zinc-600">{labels.workspace.actualResult}: </dt><dd className="inline">{item.actualResult}</dd></div> : null}
        {item.outcomeSummary ? <div className="sm:col-span-2"><dt className="inline font-medium text-zinc-600">{labels.workspace.outcomeSummary}: </dt><dd className="inline">{item.outcomeSummary}</dd></div> : null}
      </dl>
    </li>
  );
}

function SectionBlock({ title, items, labels, empty }: { title: string; items: DecisionWorkspaceItem[] | DecisionRiskItem[]; labels: DecisionIntelligenceCenterLabels; empty: string }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <span className="text-sm text-zinc-500">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) =>
            item.itemType === "risk" ? (
              <li key={item.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{item.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{item.summary}</p>
                    {"suggestedAction" in item && item.suggestedAction ? (
                      <p className="mt-2 text-sm text-indigo-700">{labels.suggestedAction}: {item.suggestedAction}</p>
                    ) : null}
                  </div>
                  <DecisionStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
              </li>
            ) : (
              <DecisionCard key={item.id} item={item as DecisionWorkspaceItem} labels={labels} />
            )
          )}
        </ul>
      )}
    </section>
  );
}

export function DecisionIntelligenceCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<DecisionIntelligenceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/intelligence/decisions");
    if (res.ok) setCenter(parseDecisionIntelligenceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/intelligence/decisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseDecisionIntelligenceAction(await res.json()).ok) await load();
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

  const optionsByDecision = center.optionAnalysis.reduce<Record<string, DecisionOption[]>>((acc, opt) => {
    acc[opt.decisionId] = acc[opt.decisionId] ?? [];
    acc[opt.decisionId].push(opt);
    return acc;
  }, {});

  const briefingLabel = (type: string) => {
    if (type === "morning") return labels.briefings.morning;
    if (type === "weekly") return labels.briefings.weekly;
    if (type === "monthly") return labels.briefings.monthly;
    return type;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-indigo-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      {center.executiveAdvisor.length > 0 ? (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveAdvisor.title}</h2>
          {center.executiveAdvisor.map((adv: ExecutiveAdvisorRecommendation) => (
            <div key={adv.id} className="rounded-xl border border-indigo-100 bg-white p-4">
              <p className="font-medium text-indigo-900">{labels.executiveAdvisor.recommendation}: {adv.recommendation}</p>
              <p className="mt-2 text-sm text-zinc-700">{labels.executiveAdvisor.reason}: {adv.reason}</p>
              {adv.supportingEvidence ? <p className="mt-1 text-sm text-zinc-600">{labels.executiveAdvisor.supportingEvidence}: {adv.supportingEvidence}</p> : null}
              <p className="mt-1 text-xs text-zinc-500">{labels.executiveAdvisor.confidenceLevel}: {adv.confidenceLevel}</p>
              {adv.potentialRisks ? <p className="mt-1 text-sm text-amber-800">{labels.executiveAdvisor.potentialRisks}: {adv.potentialRisks}</p> : null}
              {center.canManage ? (
                <div className="mt-3 flex gap-2">
                  <button type="button" disabled={busy} onClick={() => void handleAction("advisor", adv.id, "acknowledge")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                  <button type="button" disabled={busy} onClick={() => void handleAction("advisor", adv.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.dismiss}</button>
                </div>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {center.optionAnalysis.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.optionAnalysis.title}</h2>
          {Object.entries(optionsByDecision).map(([decisionId, options]) => (
            <div key={decisionId} className="rounded-xl border border-zinc-200 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                {options.map((opt) => (
                  <div key={opt.id} className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-sm">
                    <p className="font-medium text-zinc-900">{opt.label}</p>
                    <p className="mt-2 text-zinc-600">{labels.optionAnalysis.benefits}: {opt.benefits}</p>
                    <p className="mt-1 text-zinc-600">{labels.optionAnalysis.risks}: {opt.risks}</p>
                    <p className="mt-1 text-xs text-zinc-500">{labels.optionAnalysis.cost}: {opt.costLabel} · {labels.optionAnalysis.complexity}: {opt.complexity}</p>
                    <p className="mt-2 text-indigo-700">{labels.optionAnalysis.expectedOutcome}: {opt.expectedOutcome}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : null}

      <SectionBlock title={labels.sections.activeDecisions} items={center.sections.activeDecisions} labels={labels} empty={labels.emptyState} />
      <SectionBlock title={labels.sections.recommendedDecisions} items={center.sections.recommendedDecisions} labels={labels} empty={labels.emptyState} />
      <SectionBlock title={labels.sections.strategicReviews} items={center.sections.strategicReviews} labels={labels} empty={labels.emptyState} />
      <SectionBlock title={labels.sections.riskAnalysis} items={center.sections.riskAnalysis} labels={labels} empty={labels.emptyState} />
      <SectionBlock title={labels.sections.decisionHistory} items={center.sections.decisionHistory} labels={labels} empty={labels.emptyState} />
      <SectionBlock title={labels.sections.outcomeTracking} items={center.sections.outcomeTracking} labels={labels} empty={labels.emptyState} />

      {center.executiveBriefings.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.briefings.title}</h2>
          <ul className="space-y-3">
            {center.executiveBriefings.map((b: ExecutiveBriefing) => (
              <li key={b.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">{briefingLabel(b.briefingType)}</p>
                <p className="mt-1 font-medium text-zinc-900">{b.title}</p>
                <p className="mt-2 text-sm text-zinc-600">{labels.briefings.whatChanged}: {b.whatChanged}</p>
                <p className="mt-1 text-sm text-amber-800">{labels.briefings.requiresAttention}: {b.requiresAttention}</p>
                <p className="mt-1 text-sm text-indigo-700">{labels.briefings.recommendedActions}: {b.recommendedActions}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/app/decision-intelligence-engine" className="text-indigo-700 hover:text-indigo-800">{labels.links.legacyEngine}</Link>
        <Link href="/app/assistant/decisions" className="text-indigo-700 hover:text-indigo-800">{labels.links.personalDecisions}</Link>
      </div>
    </div>
  );
}
