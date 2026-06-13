"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ODC_CORE_PRINCIPLE,
  ODC_PHILOSOPHY,
  ODC_VISION,
  parseOpportunityDiscoveryCenter,
  type DiscoveryOpportunity,
  type OpportunityDiscoveryCenter,
} from "@/lib/opportunity-discovery-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  decisionSupportLink: string;
  strategicIntelligenceLink: string;
  continuousImprovementLink: string;
  organizationalResilienceLink: string;
  innovationLabLink: string;
  recommendationsLink: string;
  dashboardTitle: string;
  opportunitiesTitle: string;
  signalsTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveReviewsTitle: string;
  learningSectionTitle: string;
  workflowTitle: string;
  emptySection: string;
  domain: string;
  alignment: string;
  impact: string;
  effort: string;
  workflowStatus: string;
  dismiss: string;
  accept: string;
  advance: string;
  decline: string;
  archive: string;
  completeReview: string;
  captureLearning: string;
  learningFormTitle: string;
  learningContent: string;
  humansDecide: string;
  privacyNote: string;
  domains: Record<string, string>;
  scoreLevels: Record<string, string>;
  workflowStatuses: Record<string, string>;
  reviewTypes: Record<string, string>;
  metrics: Record<string, string>;
};

type Props = { labels: PanelLabels };

const SCORE_STYLES: Record<string, string> = {
  exceptional: "bg-emerald-100 text-emerald-900",
  strong: "bg-indigo-100 text-indigo-900",
  monitor: "bg-sky-100 text-sky-800",
  low_priority: "bg-gray-100 text-gray-700",
};

export function OpportunityDiscoveryCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OpportunityDiscoveryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [learnTitle, setLearnTitle] = useState("");
  const [learnContent, setLearnContent] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/opportunity-discovery/center");
    if (res.ok) setCenter(parseOpportunityDiscoveryCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/opportunity-discovery/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  const dash = center?.dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
        {center?.links?.decision_support && <Link href={center.links.decision_support} className="text-slate-600 hover:underline">{labels.decisionSupportLink}</Link>}
        {center?.links?.strategic_intelligence && <Link href={center.links.strategic_intelligence} className="text-slate-600 hover:underline">{labels.strategicIntelligenceLink}</Link>}
        {center?.links?.continuous_improvement && <Link href={center.links.continuous_improvement} className="text-slate-600 hover:underline">{labels.continuousImprovementLink}</Link>}
        {center?.links?.organizational_resilience && <Link href={center.links.organizational_resilience} className="text-slate-600 hover:underline">{labels.organizationalResilienceLink}</Link>}
        {center?.links?.innovation_lab && <Link href={center.links.innovation_lab} className="text-slate-600 hover:underline">{labels.innovationLabLink}</Link>}
        {center?.links?.recommendations && <Link href={center.links.recommendations} className="text-slate-600 hover:underline">{labels.recommendationsLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {ODC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {ODC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {ODC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.identified} value={dash.opportunities_identified} />
            <Metric label={labels.metrics.underReview} value={dash.under_review} />
            <Metric label={labels.metrics.highValue} value={dash.high_value} />
            <Metric label={labels.metrics.alignment} value={`${dash.strategic_alignment_score}%`} />
            <Metric label={labels.metrics.satisfaction} value={`${dash.executive_satisfaction}/5`} />
            <Metric label={labels.metrics.usefulness} value={`${dash.companion_usefulness}/5`} />
          </dl>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.opportunitiesTitle}</h2>
        {center?.opportunities.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptySection}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {center?.opportunities.map((opp) => (
              <OpportunityRow key={opp.opportunity_key} opp={opp} labels={labels} canManage={center?.can_manage ?? false} onAction={postAction} />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.signalsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.discovery_signals.map((sig) => (
            <li key={sig.signal_key} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-sm">
              <p className="font-medium text-gray-900">{sig.title}</p>
              <p className="mt-1 text-gray-700">{sig.message}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.insightsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.insights.map((ins) => (
            <li key={ins.insight_key} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 text-sm">
              <p className="text-gray-800">{ins.message}</p>
              {center?.can_manage && (
                <button type="button" className="mt-2 text-xs text-slate-600 hover:underline" onClick={() => void postAction({ action: "dismiss_insight", insight_key: ins.insight_key })}>{labels.dismiss}</button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.recommendationsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.recommendations.map((rec) => (
            <li key={rec.recommendation_key} className="rounded-xl border border-gray-100 p-3 text-sm">
              <p className="text-gray-800">{rec.message}</p>
              {center?.can_manage && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <ActionBtn label={labels.accept} onClick={() => void postAction({ action: "accept_recommendation", recommendation_key: rec.recommendation_key })} />
                  <ActionBtn label={labels.dismiss} variant="muted" onClick={() => void postAction({ action: "dismiss_recommendation", recommendation_key: rec.recommendation_key })} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.executiveReviewsTitle}</h2>
        <ul className="mt-4 space-y-3">
          {center?.executive_reviews.map((rev) => (
            <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
              <p className="font-medium text-gray-900">{labels.reviewTypes[rev.review_type] ?? rev.review_type}</p>
              <p className="mt-1 text-gray-700">{rev.prompt}</p>
              {rev.status === "pending" && center?.can_manage && (
                <ActionBtn label={labels.completeReview} className="mt-3" onClick={() => void postAction({ action: "complete_review", review_key: rev.review_key })} />
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.learningSectionTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.opportunity_learning.map((l) => (
            <li key={l.learning_key} className="rounded-xl border border-gray-100 p-3 text-sm">
              <p className="font-medium text-gray-900">{l.title}</p>
              <p className="mt-1 text-gray-700">{l.content}</p>
            </li>
          ))}
        </ul>
        {center?.can_contribute && (
          <form className="mt-6 space-y-3 rounded-xl border border-dashed border-gray-200 p-4" onSubmit={(e) => { e.preventDefault(); void postAction({ action: "capture_learning", title: learnTitle, content: learnContent }).then(() => { setLearnTitle(""); setLearnContent(""); }); }}>
            <input type="text" value={learnTitle} onChange={(e) => setLearnTitle(e.target.value)} placeholder={labels.learningFormTitle} className="w-full rounded-lg border px-3 py-2 text-sm" required />
            <textarea value={learnContent} onChange={(e) => setLearnContent(e.target.value)} placeholder={labels.learningContent} className="w-full rounded-lg border px-3 py-2 text-sm" rows={3} required />
            <button type="submit" className="rounded-lg border border-indigo-200 bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">{labels.captureLearning}</button>
          </form>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.workflowTitle}</h2>
        <ol className="mt-4 flex flex-wrap gap-2 text-sm">
          {(["identified", "strategic_review", "impact_assessment", "resource_evaluation", "executive_decision", "implementation_planning", "outcome_measurement"] as const).map((stage, i) => (
            <li key={stage} className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-900">{labels.workflowStatuses[stage]}</span>
              {i < 6 && <span className="text-gray-400">→</span>}
            </li>
          ))}
        </ol>
      </section>

      {center?.privacy_note && <p className="text-xs text-gray-500">{labels.privacyNote}: {center.privacy_note}</p>}
    </div>
  );
}

function OpportunityRow({ opp, labels, canManage, onAction }: { opp: DiscoveryOpportunity; labels: PanelLabels; canManage: boolean; onAction: (p: Record<string, unknown>) => Promise<void> }) {
  return (
    <li className="rounded-xl border border-gray-100 p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-semibold text-gray-900">{opp.title}</p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SCORE_STYLES[opp.score_level] ?? SCORE_STYLES.monitor}`}>{labels.scoreLevels[opp.score_level] ?? opp.score_level}</span>
      </div>
      <p className="mt-2 text-gray-700">{opp.summary}</p>
      <p className="mt-2 text-xs text-gray-500">
        {labels.domain}: {labels.domains[opp.domain] ?? opp.domain} · {labels.alignment}: {opp.strategic_alignment} · {labels.impact}: {opp.potential_impact} · {labels.effort}: {opp.required_effort}
      </p>
      <p className="mt-1 text-xs text-indigo-700">{labels.workflowStatus}: {labels.workflowStatuses[opp.workflow_status] ?? opp.workflow_status}</p>
      {canManage && !["declined", "archived", "outcome_measurement"].includes(opp.workflow_status) && (
        <div className="mt-3 flex flex-wrap gap-2">
          <ActionBtn label={labels.advance} onClick={() => void onAction({ action: "advance_workflow", opportunity_key: opp.opportunity_key })} />
          <ActionBtn label={labels.decline} variant="muted" onClick={() => void onAction({ action: "decline_opportunity", opportunity_key: opp.opportunity_key })} />
          <ActionBtn label={labels.dismiss} variant="muted" onClick={() => void onAction({ action: "dismiss_opportunity", opportunity_key: opp.opportunity_key })} />
        </div>
      )}
    </li>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ActionBtn({ label, onClick, variant = "primary", className = "" }: { label: string; onClick: () => void; variant?: "primary" | "muted"; className?: string }) {
  const styles = variant === "muted" ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50" : "border-indigo-200 bg-indigo-600 text-white hover:bg-indigo-700";
  return <button type="button" onClick={onClick} className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${styles} ${className}`}>{label}</button>;
}
