"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseExecutiveDigitalBoardAction,
  parseExecutiveDigitalBoardCenter,
  type BoardRecommendation,
  type BoardSectionItem,
  type CompanionExecutiveItem,
  type DashboardMetric,
  type ExecutiveDigitalBoardCenter,
  type LongTermPlan,
  type MeetingPrepItem,
  type ScenarioPlan,
  type StrategicOpportunity,
  type StrategicRisk,
  type TimelineItem,
} from "@/lib/executive-digital-board-center";
import type { ExecutiveDigitalBoardCenterLabels } from "@/lib/executive-digital-board-center/labels";
import { BoardStatusBadge } from "./BoardStatusBadge";

type Props = { labels: ExecutiveDigitalBoardCenterLabels };

function SectionCard({ title, items }: { title: string; items: BoardSectionItem[] }) {
  if (items.length === 0) return null;
  const item = items[0];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-1 font-semibold text-zinc-900">{item.title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      {item.metricValue ? <p className="mt-2 text-lg font-bold text-indigo-900">{item.metricLabel}: {item.metricValue}</p> : null}
    </div>
  );
}

export function ExecutiveDigitalBoardCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<ExecutiveDigitalBoardCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/executive/board");
    if (res.ok) setCenter(parseExecutiveDigitalBoardCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/executive/board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseExecutiveDigitalBoardAction(await res.json()).ok) await load();
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
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-indigo-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/app/executive" className="text-indigo-700 hover:underline">{labels.links.executive}</Link>
            <Link href="/app/executive/board-investor-intelligence" className="text-indigo-700 hover:underline">{labels.links.boardInvestorIntelligence}</Link>
            <Link href="/app/executive/strategic-intelligence" className="text-indigo-700 hover:underline">{labels.links.strategicIntelligence}</Link>
            <Link href="/app/executive/decision-support" className="text-indigo-700 hover:underline">{labels.links.decisionSupport}</Link>
          </div>
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.governanceControls.title}</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-700">
          <span>{center.boardSettings.boardEnabled ? labels.governanceControls.enabled : labels.governanceControls.disabled}</span>
          {center.boardSettings.humanControlRequired ? <span>{labels.governanceControls.humanControl}</span> : null}
        </div>
      </section>

      {center.executiveBoardDashboard.length > 0 ? (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveBoardDashboard.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.executiveBoardDashboard.map((m: DashboardMetric) => (
              <div key={m.id} className="rounded-xl border border-indigo-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-indigo-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SectionCard title={labels.sections.boardOverview} items={center.sections.board_overview} />
        <SectionCard title={labels.sections.strategicRisks} items={center.sections.strategic_risks} />
        <SectionCard title={labels.sections.strategicOpportunities} items={center.sections.strategic_opportunities} />
        <SectionCard title={labels.sections.executiveRecommendations} items={center.sections.executive_recommendations} />
        <SectionCard title={labels.sections.boardReviews} items={center.sections.board_reviews} />
        <SectionCard title={labels.sections.longTermPlanning} items={center.sections.long_term_planning} />
        <SectionCard title={labels.sections.scenarioAnalysis} items={center.sections.scenario_analysis} />
      </div>

      {center.strategicOpportunityEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.strategicOpportunityEngine.title}</h2>
          <ul className="space-y-3">
            {center.strategicOpportunityEngine.map((o: StrategicOpportunity) => (
              <li key={o.id} className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{o.opportunityType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{o.title}</p>
                    {o.summary ? <p className="mt-1 text-sm text-zinc-600">{o.summary}</p> : null}
                    {o.suggestedAction ? <p className="mt-2 text-sm font-medium text-indigo-900">{labels.suggestedAction}: {o.suggestedAction}</p> : null}
                    {o.evidenceLabel ? <p className="mt-1 text-xs text-zinc-500">{labels.evidence}: {o.evidenceLabel}</p> : null}
                  </div>
                  <BoardStatusBadge statusKey={o.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.strategicRiskEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.strategicRiskEngine.title}</h2>
          <ul className="space-y-3">
            {center.strategicRiskEngine.map((r: StrategicRisk) => (
              <li key={r.id} className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{r.riskType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{r.title}</p>
                    {r.summary ? <p className="mt-1 text-sm text-zinc-600">{r.summary}</p> : null}
                    {r.severityLabel ? <p className="mt-2 text-sm font-medium text-amber-900">{labels.severity}: {r.severityLabel}</p> : null}
                    {r.evidenceLabel ? <p className="mt-1 text-xs text-zinc-500">{labels.evidence}: {r.evidenceLabel}</p> : null}
                  </div>
                  <BoardStatusBadge statusKey={r.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("risk", r.id, "acknowledge")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("risk", r.id, "escalate")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.escalate}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.boardRecommendations.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.boardRecommendations.title}</h2>
          <ul className="space-y-3">
            {center.boardRecommendations.map((rec: BoardRecommendation) => (
              <li key={rec.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{rec.recommendedAction}</p>
                {rec.reasoning ? <p className="mt-2 text-sm text-zinc-600"><span className="font-medium">{labels.reasoning}:</span> {rec.reasoning}</p> : null}
                {rec.potentialOutcome ? <p className="mt-1 text-sm text-indigo-900"><span className="font-medium">{labels.potentialOutcome}:</span> {rec.potentialOutcome}</p> : null}
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-zinc-500">
                  {rec.riskLevel ? <span>{labels.riskLevel}: {rec.riskLevel}</span> : null}
                  {rec.estimatedImpact ? <span>{labels.estimatedImpact}: {rec.estimatedImpact}</span> : null}
                </div>
                <div className="mt-2"><BoardStatusBadge statusKey={rec.statusKey} labels={labels.status} /></div>
                {center.canManage ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("recommendation", rec.id, "approve")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.approve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("recommendation", rec.id, "reject")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.reject}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("recommendation", rec.id, "escalate")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.escalate}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.scenarioPlanning.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.scenarioPlanning.title}</h2>
          <div className="grid gap-3 lg:grid-cols-2">
            {center.scenarioPlanning.map((s: ScenarioPlan) => (
              <div key={s.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{s.scenarioName}</p>
                <p className="mt-1 text-xs capitalize text-zinc-500">{s.scenarioTopic.replace(/_/g, " ")}</p>
                <div className="mt-3 space-y-1 text-sm">
                  <p><span className="font-medium text-emerald-800">{labels.bestCase}:</span> {s.bestCaseLabel}</p>
                  <p><span className="font-medium text-indigo-800">{labels.expectedCase}:</span> {s.expectedCaseLabel}</p>
                  <p><span className="font-medium text-amber-800">{labels.worstCase}:</span> {s.worstCaseLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.boardMeetingPreparation.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.boardMeetingPreparation.title}</h2>
          <ul className="space-y-2">
            {center.boardMeetingPreparation.map((p: MeetingPrepItem) => (
              <li key={p.id} className="rounded-lg border border-zinc-100 bg-white px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{p.prepType.replace(/_/g, " ")}</p>
                    <p className="font-medium text-zinc-900">{p.title}</p>
                    {p.summary ? <p className="mt-1 text-sm text-zinc-600">{p.summary}</p> : null}
                  </div>
                  <BoardStatusBadge statusKey={p.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <button type="button" disabled={busy} onClick={() => void handleAction("meeting_prep", p.id, "prepare")} className="mt-2 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.prepare}</button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.strategicTimeline.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.strategicTimeline.title}</h2>
          <ul className="space-y-2 border-l-2 border-indigo-200 pl-4">
            {center.strategicTimeline.map((t: TimelineItem) => (
              <li key={t.id} className="relative rounded-lg border border-zinc-100 bg-white px-4 py-3">
                <span className="absolute -left-[1.35rem] top-4 h-2.5 w-2.5 rounded-full bg-indigo-400 ring-2 ring-white" />
                <p className="text-xs font-medium uppercase text-zinc-500">{t.timelineType.replace(/_/g, " ")}</p>
                <p className="font-medium text-zinc-900">{t.title}</p>
                {t.summary ? <p className="mt-1 text-sm text-zinc-600">{t.summary}</p> : null}
                {t.milestoneLabel ? <p className="mt-1 text-xs text-indigo-700">{labels.milestone}: {t.milestoneLabel}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.longTermPlanningEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.longTermPlanningEngine.title}</h2>
          <div className="grid gap-3 lg:grid-cols-3">
            {center.longTermPlanningEngine.map((plan: LongTermPlan) => (
              <div key={plan.id} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                <p className="text-xs font-medium uppercase text-indigo-800">{plan.planHorizon.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-zinc-900">{plan.planTitle}</p>
                {plan.summary ? <p className="mt-1 text-sm text-zinc-600">{plan.summary}</p> : null}
                {plan.progressLabel ? <p className="mt-2 text-sm font-medium text-indigo-900">{labels.progress}: {plan.progressLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.companionExecutiveAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionExecutiveAdvisor.map((item: CompanionExecutiveItem) => (
              <li key={item.id} className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4">
                <p className="font-medium text-zinc-900">{item.question}</p>
                {item.answer ? <p className="mt-2 text-sm text-zinc-700">{item.answer}</p> : null}
                {item.evidenceLabel ? <p className="mt-2 text-xs text-zinc-500"><span className="font-medium">{labels.companionAdvisor.evidence}:</span> {item.evidenceLabel}</p> : null}
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "approve")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.approve}</button>
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
