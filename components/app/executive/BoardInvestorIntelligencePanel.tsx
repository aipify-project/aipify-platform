"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseBoardInvestorIntelligenceCenter,
  type BoardIntelligenceMode,
  type BoardInvestorIntelligenceCenter,
  type BoardInvestorIntelligenceLabels,
  type GovernanceStatus,
  type PerformanceIndicator,
} from "@/lib/board-investor-intelligence";

type Props = { labels: BoardInvestorIntelligenceLabels };

const MODES: BoardIntelligenceMode[] = [
  "board", "investor", "meeting", "decisions", "performance", "briefing", "governance", "scenarios", "narrative", "learning",
];

const GOV_STYLE: Record<GovernanceStatus, string> = {
  strong: "bg-emerald-100 text-emerald-900",
  healthy: "bg-sky-100 text-sky-900",
  monitor: "bg-amber-100 text-amber-900",
  needs_attention: "bg-orange-100 text-orange-900",
  critical: "bg-rose-100 text-rose-900",
};

export function BoardInvestorIntelligencePanel({ labels }: Props) {
  const [center, setCenter] = useState<BoardInvestorIntelligenceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<BoardIntelligenceMode>("board");
  const [recorded, setRecorded] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/executive/board-investor-intelligence");
    if (res.ok) setCenter(parseBoardInvestorIntelligenceCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function logEvent(eventType: string, description: string) {
    await fetch("/api/executive/board-investor-intelligence/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: eventType, description }),
    });
    setRecorded(true);
    setTimeout(() => setRecorded(false), 3000);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  if (center?.upgrade_required) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <h1 className="text-2xl font-bold text-gray-900">{labels.upgradeTitle}</h1>
        <p className="text-gray-600">{labels.upgradeBody}</p>
        <Link href="/app/license" className="text-sm text-indigo-600 hover:underline">{labels.upgradeCta}</Link>
      </div>
    );
  }

  const bd = center?.board_dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <Link href="/app/executive" className="text-sm text-indigo-600 hover:underline">← {labels.executiveLink}</Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">{labels.humanOversight}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/app/executive/strategic-decision-cockpit" className="text-indigo-600 hover:underline">{labels.cockpitLink}</Link>
          <Link href="/app/executive/early-warning-center" className="text-indigo-600 hover:underline">{labels.earlyWarningLink}</Link>
        </div>
        {recorded ? <p className="mt-2 text-sm text-emerald-700">{labels.recorded}</p> : null}
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl border border-gray-200 p-0.5 text-sm">
        {MODES.map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-lg px-2.5 py-1.5 ${mode === m ? "bg-indigo-600 text-white" : "text-gray-600"}`}>
            {labels.tabs[m]}
          </button>
        ))}
      </div>

      {mode === "board" && bd ? (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5">
          <h2 className="font-semibold text-indigo-950">{labels.board.title}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <Metric label={labels.board.onTrack} value={bd.initiatives_on_track} />
            <Metric label={labels.board.atRisk} value={bd.initiatives_at_risk} />
            <Metric label={labels.board.executivePriorities} value={bd.executive_priorities} />
            <Metric label={labels.board.riskLandscape} value={bd.risk_landscape_count} />
            <Metric label={labels.board.opportunities} value={bd.major_opportunities} />
            <div className="sm:col-span-2">
              <dt className="text-indigo-800">{labels.board.orgHealth}</dt>
              <dd className="text-2xl font-semibold">{bd.organization_health_score}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-indigo-900">{labels.board.financialTrend}: {bd.financial_trend_summary}</p>
          {(bd.board_attention_items.length > 0) ? (
            <div className="mt-4">
              <h3 className="text-sm font-semibold">{labels.board.attentionItems}</h3>
              <ul className="mt-2 space-y-1 text-sm">{bd.board_attention_items.map((i) => <li key={i.id}>{i.title} — {i.reason}</li>)}</ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {mode === "investor" && center?.investor_readiness ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 text-sm">
          <h2 className="font-semibold text-emerald-950">{labels.investor.title}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><dt className="font-medium">{labels.investor.revenueTrajectory}</dt><dd className="capitalize">{center.investor_readiness.revenue_trajectory.replace(/_/g, " ")}</dd><dd className="text-xs text-gray-500">{labels.investor.revenueNote}</dd></div>
            <div><dt className="font-medium">{labels.investor.customerGrowth}</dt><dd>{center.investor_readiness.customer_growth_indicator}</dd></div>
            <div><dt className="font-medium">{labels.investor.retention}</dt><dd>{center.investor_readiness.retention_indicator}</dd></div>
            <div><dt className="font-medium">{labels.investor.expansionReadiness}</dt><dd className="capitalize">{center.investor_readiness.expansion_readiness}</dd></div>
            <GovBadge label={labels.investor.operationalMaturity} status={center.investor_readiness.operational_maturity} statuses={labels.governance.statuses} />
            <GovBadge label={labels.investor.governanceMaturity} status={center.investor_readiness.governance_maturity} statuses={labels.governance.statuses} />
          </dl>
        </section>
      ) : null}

      {mode === "meeting" && center?.board_meeting ? (
        <MeetingSection meeting={center.board_meeting} labels={labels} onGenerate={() => logEvent("board_briefing_generated", "Board meeting summary generated")} generateLabel={labels.generateBriefing} />
      ) : null}

      {mode === "decisions" ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold">{labels.decisions.title}</h2>
          {(center?.decision_register?.length ?? 0) === 0 ? (
            <p className="mt-3 text-sm text-gray-500">{labels.decisions.empty}</p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm">
              {center!.decision_register!.map((d) => (
                <li key={d.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="font-medium">{d.decision}</p>
                  <p className="mt-1 text-gray-600">{labels.decisions.outcome}: {d.outcome}</p>
                  <p className="text-gray-600">{labels.decisions.status}: {d.implementation_status} · {labels.decisions.followUp}: {d.follow_up}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {mode === "performance" && center?.strategic_performance ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold">{labels.performance.title}</h2>
          <p className="mt-1 text-xs text-gray-500">{labels.performance.note}</p>
          <ul className="mt-4 space-y-2">
            {Object.entries(center.strategic_performance).map(([key, ind]) => (
              <IndicatorRow key={key} label={key.replace(/_/g, " ")} indicator={ind} statuses={labels.governance.statuses} />
            ))}
          </ul>
        </section>
      ) : null}

      {mode === "briefing" && center?.investor_briefing ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/30 p-5 text-sm space-y-3">
          <h2 className="font-semibold text-violet-950">{labels.briefing.title}</h2>
          <p><strong>{labels.briefing.position}</strong> {center.investor_briefing.current_position}</p>
          <p><strong>{labels.briefing.growth}</strong> {center.investor_briefing.growth_potential}</p>
          <p><strong>{labels.briefing.confidence}</strong> {center.investor_briefing.confidence_score} ({center.investor_briefing.confidence_level})</p>
          <p className="text-xs text-violet-800">{center.investor_briefing.disclaimer}</p>
          <button type="button" onClick={() => void logEvent("investor_report_created", "Investor briefing generated")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white">{labels.generateBriefing}</button>
        </section>
      ) : null}

      {mode === "governance" && center?.governance_health ? (
        <GovernanceSection gov={center.governance_health} labels={labels} />
      ) : null}

      {mode === "scenarios" ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5">
          <h2 className="font-semibold text-amber-950">{labels.scenarios.title}</h2>
          <p className="mt-1 text-xs text-amber-800">{labels.scenarios.certaintyNote}</p>
          <ul className="mt-4 space-y-4 text-sm">
            {(center?.scenarios ?? []).map((s) => (
              <li key={s.question} className="rounded-lg bg-white/70 p-4">
                <p className="font-medium">{s.question}</p>
                <p className="mt-1 text-gray-700">{s.possibility}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {mode === "narrative" && center?.executive_narrative ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 text-sm space-y-3">
          <h2 className="font-semibold">{labels.narrative.title}</h2>
          <p>{center.executive_narrative.summary}</p>
          <div><p className="font-medium">{labels.narrative.achievements}</p><ul className="list-inside list-disc">{center.executive_narrative.achievements.map((a) => <li key={a}>{a}</li>)}</ul></div>
          <div><p className="font-medium">{labels.narrative.challenges}</p><ul className="list-inside list-disc">{center.executive_narrative.challenges.map((c) => <li key={c}>{c}</li>)}</ul></div>
          <p><strong>{labels.narrative.risks}</strong> {center.executive_narrative.risks}</p>
          <p><strong>{labels.narrative.opportunities}</strong> {center.executive_narrative.opportunities}</p>
          <button type="button" onClick={() => void logEvent("board_briefing_generated", "Executive narrative generated")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white">{labels.generateNarrative}</button>
        </section>
      ) : null}

      {mode === "learning" && center?.learning_insights ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5 text-sm">
          <h2 className="font-semibold">{labels.learning.title}</h2>
          <ul className="mt-3 space-y-2">{Object.entries(center.learning_insights).map(([k, v]) => <li key={k}><span className="font-medium capitalize">{k.replace(/_/g, " ")}:</span> {v}</li>)}</ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.replaceDecisions}</dt><dd className="mt-1 text-gray-600">{labels.faq.replaceDecisionsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.confidenceScores}</dt><dd className="mt-1 text-gray-600">{labels.faq.confidenceScoresAnswer}</dd></div>
        </dl>
        <p className="mt-4 text-sm font-medium text-indigo-800">{labels.principle}</p>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (<div><dt className="text-indigo-800">{label}</dt><dd className="text-2xl font-semibold tabular-nums">{value}</dd></div>);
}

function GovBadge({ label, status, statuses }: { label: string; status: GovernanceStatus; statuses: Record<GovernanceStatus, string> }) {
  return (<div><dt className="font-medium">{label}</dt><dd className="mt-1"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${GOV_STYLE[status]}`}>{statuses[status]}</span></dd></div>);
}

function IndicatorRow({ label, indicator, statuses }: { label: string; indicator: PerformanceIndicator; statuses: Record<GovernanceStatus, string> }) {
  return (
    <li className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm capitalize">
      <span>{label}</span>
      <div className="flex items-center gap-2"><span className="font-semibold">{indicator.score}</span><span className={`rounded-full px-2 py-0.5 text-xs ${GOV_STYLE[indicator.status]}`}>{statuses[indicator.status]}</span></div>
    </li>
  );
}

function GovernanceSection({ gov, labels }: { gov: NonNullable<BoardInvestorIntelligenceCenter["governance_health"]>; labels: BoardInvestorIntelligenceLabels }) {
  const items: Array<[string, PerformanceIndicator]> = [
    [labels.governance.decisionTransparency, gov.decision_transparency],
    [labels.governance.approvalDiscipline, gov.approval_discipline],
    [labels.governance.riskOversight, gov.risk_oversight],
    [labels.governance.policyCompliance, gov.policy_compliance],
    [labels.governance.executiveAccountability, gov.executive_accountability],
    [labels.governance.auditReadiness, gov.audit_readiness],
    [labels.governance.boardEffectiveness, gov.board_effectiveness],
  ];
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="font-semibold">{labels.governance.title}</h2>
      <p className="mt-2 text-sm">{labels.governance.overall}: {gov.overall_score} — <span className={`rounded-full px-2 py-0.5 text-xs ${GOV_STYLE[gov.overall_status]}`}>{labels.governance.statuses[gov.overall_status]}</span></p>
      <ul className="mt-4 space-y-2">{items.map(([l, i]) => <IndicatorRow key={l} label={l} indicator={i} statuses={labels.governance.statuses} />)}</ul>
    </section>
  );
}

function MeetingSection({ meeting, labels, onGenerate, generateLabel }: {
  meeting: NonNullable<BoardInvestorIntelligenceCenter["board_meeting"]>;
  labels: BoardInvestorIntelligenceLabels;
  onGenerate: () => void;
  generateLabel: string;
}) {
  return (
    <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5 text-sm space-y-4">
      <div className="flex justify-between items-center"><h2 className="font-semibold text-indigo-950">{labels.meeting.title}</h2><button type="button" onClick={onGenerate} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white">{generateLabel}</button></div>
      <div><h3 className="font-medium">{labels.meeting.highlights}</h3><ul className="list-inside list-disc">{meeting.executive_highlights.map((h) => <li key={h}>{h}</li>)}</ul></div>
      <div><h3 className="font-medium">{labels.meeting.decisions}</h3><ul className="list-inside list-disc">{meeting.recommended_decisions.map((d) => <li key={d}>{d}</li>)}</ul></div>
      <div><h3 className="font-medium">{labels.meeting.risks}</h3><ul className="list-inside list-disc">{meeting.risks_for_discussion.map((r) => <li key={r.title}>{r.title}</li>)}</ul></div>
    </section>
  );
}
