"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  STRATEGIC_INTELLIGENCE_CORE_PRINCIPLE,
  STRATEGIC_INTELLIGENCE_PHILOSOPHY,
  STRATEGIC_INTELLIGENCE_VISION,
  parseExecutiveStrategicIntelligenceCenter,
  type ExecutiveStrategicIntelligenceCenter,
  type StrategicSignal,
} from "@/lib/executive-strategic-intelligence";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  decisionSupportLink: string;
  strategicFoundationLink: string;
  executiveIntelligenceLink: string;
  dashboardTitle: string;
  opportunitiesTitle: string;
  risksTitle: string;
  trendsTitle: string;
  prioritiesTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  reviewsTitle: string;
  scenariosTitle: string;
  emptySection: string;
  domain: string;
  impact: string;
  urgency: string;
  priorityMatrix: string;
  trend: string;
  escalate: string;
  prioritize: string;
  evaluate: string;
  monitor: string;
  accept: string;
  dismiss: string;
  completeReview: string;
  leadershipDecides: string;
  domains: Record<string, string>;
  reviewTypes: Record<string, string>;
  metrics: Record<string, string>;
  privacyNote: string;
};

type Props = { labels: PanelLabels };

const MATRIX_STYLES: Record<string, string> = {
  escalate: "bg-rose-100 text-rose-900",
  prioritize: "bg-amber-100 text-amber-900",
  evaluate: "bg-sky-100 text-sky-800",
  monitor: "bg-emerald-100 text-emerald-800",
};

export function StrategicIntelligenceCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<ExecutiveStrategicIntelligenceCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/executive-strategic-intelligence/center");
    if (res.ok) setCenter(parseExecutiveStrategicIntelligenceCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/executive-strategic-intelligence/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const dash = center?.dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && (
          <Link href={center.links.executive} className="text-slate-600 hover:underline">
            {labels.executiveLink}
          </Link>
        )}
        {center?.links?.decision_support && (
          <Link href={center.links.decision_support} className="text-slate-600 hover:underline">
            {labels.decisionSupportLink}
          </Link>
        )}
        {center?.links?.strategic_foundation && (
          <Link href={center.links.strategic_foundation} className="text-slate-600 hover:underline">
            {labels.strategicFoundationLink}
          </Link>
        )}
        {center?.links?.executive_intelligence && (
          <Link href={center.links.executive_intelligence} className="text-slate-600 hover:underline">
            {labels.executiveIntelligenceLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
          {labels.corePrinciple}: {STRATEGIC_INTELLIGENCE_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.philosophyTitle}: {STRATEGIC_INTELLIGENCE_PHILOSOPHY}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {labels.visionTitle}: {STRATEGIC_INTELLIGENCE_VISION}
        </p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.leadershipDecides}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.opportunities} value={dash.opportunities_count} />
            <Metric label={labels.metrics.risks} value={dash.risks_count} />
            <Metric label={labels.metrics.trends} value={dash.trends_count} />
            <Metric label={labels.metrics.escalations} value={dash.escalations_count} />
            <Metric label={labels.metrics.reviewsPending} value={dash.reviews_pending} />
            <Metric label={labels.metrics.satisfaction} value={`${dash.executive_satisfaction}/5`} />
            <Metric label={labels.metrics.trust} value={`${dash.leadership_trust_score}%`} />
          </dl>
        </section>
      )}

      <SignalSection title={labels.opportunitiesTitle} signals={center?.opportunities ?? []} labels={labels} canRecord={center?.can_record ?? false} onAction={postAction} />
      <SignalSection title={labels.risksTitle} signals={center?.risks ?? []} labels={labels} canRecord={center?.can_record ?? false} onAction={postAction} />
      <SignalSection title={labels.trendsTitle} signals={center?.trends ?? []} labels={labels} canRecord={center?.can_record ?? false} onAction={postAction} />
      <SignalSection title={labels.prioritiesTitle} signals={center?.priorities ?? []} labels={labels} canRecord={center?.can_record ?? false} onAction={postAction} />

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.insightsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.executive_insights.map((ins) => (
            <li key={ins.insight_key} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 text-sm">
              <p className="text-gray-800">{ins.message}</p>
              {center?.can_manage && (
                <button type="button" className="mt-2 text-xs text-slate-600 hover:underline" onClick={() => void postAction({ action: "dismiss_insight", insight_key: ins.insight_key })}>
                  {labels.dismiss}
                </button>
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
              <div className="mt-2 flex flex-wrap gap-2">
                {center?.can_record && (
                  <ActionBtn label={labels.accept} onClick={() => void postAction({ action: "accept_recommendation", recommendation_key: rec.recommendation_key })} />
                )}
                {center?.can_manage && (
                  <ActionBtn label={labels.dismiss} variant="muted" onClick={() => void postAction({ action: "dismiss_recommendation", recommendation_key: rec.recommendation_key })} />
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.reviewsTitle}</h2>
          <ul className="mt-4 space-y-2">
            {center?.strategic_reviews.map((rev) => (
              <li key={rev.review_key} className="rounded-xl border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">{labels.reviewTypes[rev.review_type] ?? rev.review_type}</p>
                <p className="mt-1 text-gray-700">{rev.prompt}</p>
                {rev.status === "pending" && center?.can_record && (
                  <ActionBtn label={labels.completeReview} className="mt-2" onClick={() => void postAction({ action: "complete_review", review_key: rev.review_key })} />
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.scenariosTitle}</h2>
          <ul className="mt-4 space-y-2">
            {center?.scenario_prompts.map((sc) => (
              <li key={sc.key} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-gray-800">
                {sc.prompt}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {center?.privacy_note && (
        <p className="text-xs text-gray-500">
          {labels.privacyNote}: {center.privacy_note}
        </p>
      )}
    </div>
  );
}

function SignalSection({
  title,
  signals,
  labels,
  canRecord,
  onAction,
}: {
  title: string;
  signals: StrategicSignal[];
  labels: PanelLabels;
  canRecord: boolean;
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {signals.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">{labels.emptySection}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {signals.map((signal) => (
            <SignalCard key={signal.signal_key} signal={signal} labels={labels} canRecord={canRecord} onAction={onAction} />
          ))}
        </ul>
      )}
    </section>
  );
}

function SignalCard({
  signal,
  labels,
  canRecord,
  onAction,
}: {
  signal: StrategicSignal;
  labels: PanelLabels;
  canRecord: boolean;
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const matrixLabel = labels[signal.priority_matrix as keyof PanelLabels] as string | undefined;
  return (
    <li className="rounded-xl border border-gray-100 p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-semibold text-gray-900">{signal.title}</p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${MATRIX_STYLES[signal.priority_matrix] ?? MATRIX_STYLES.evaluate}`}>
          {matrixLabel ?? signal.priority_matrix}
        </span>
      </div>
      <p className="mt-2 text-gray-700">{signal.summary}</p>
      <p className="mt-2 text-xs text-gray-500">
        {labels.domain}: {labels.domains[signal.domain] ?? signal.domain} · {labels.impact}: {signal.impact} · {labels.urgency}: {signal.urgency}
        {signal.trend_direction ? ` · ${labels.trend}: ${signal.trend_direction}` : ""}
      </p>
      {canRecord && (
        <div className="mt-3 flex flex-wrap gap-2">
          {signal.priority_matrix !== "escalate" && (
            <ActionBtn label={labels.escalate} variant="muted" onClick={() => void onAction({ action: "update_priority", signal_key: signal.signal_key, priority_matrix: "escalate" })} />
          )}
          {signal.priority_matrix !== "prioritize" && (
            <ActionBtn label={labels.prioritize} variant="muted" onClick={() => void onAction({ action: "update_priority", signal_key: signal.signal_key, priority_matrix: "prioritize" })} />
          )}
          <ActionBtn label={labels.dismiss} variant="muted" onClick={() => void onAction({ action: "dismiss_signal", signal_key: signal.signal_key })} />
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

function ActionBtn({
  label,
  onClick,
  variant = "primary",
  className = "",
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "muted";
  className?: string;
}) {
  const styles =
    variant === "muted"
      ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      : "border-indigo-200 bg-indigo-600 text-white hover:bg-indigo-700";
  return (
    <button type="button" onClick={onClick} className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${styles} ${className}`}>
      {label}
    </button>
  );
}
