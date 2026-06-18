"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  RESILIENCE_CORE_PRINCIPLE,
  RESILIENCE_PHILOSOPHY,
  RESILIENCE_VISION,
  parseOrganizationalResilienceCenter,
  type OrganizationalResilienceCenter,
} from "@/lib/organizational-resilience-center";

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
  resilienceEngineLink: string;
  continuityLink: string;
  dashboardTitle: string;
  scoreDimensionsTitle: string;
  dependenciesTitle: string;
  reviewsTitle: string;
  scenariosTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveReviewsTitle: string;
  emptySection: string;
  domain: string;
  severity: string;
  reviewState: string;
  readiness: string;
  dismiss: string;
  accept: string;
  acknowledge: string;
  completeReview: string;
  humansDecide: string;
  privacyNote: string;
  domains: Record<string, string>;
  scoreLevels: Record<string, string>;
  reviewStates: Record<string, string>;
  readinessLevels: Record<string, string>;
  reviewTypes: Record<string, string>;
  metrics: Record<string, string>;
  dimensions: Record<string, string>;
};

type Props = { labels: PanelLabels };

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-rose-100 text-rose-900",
  high: "bg-amber-100 text-amber-900",
  medium: "bg-sky-100 text-sky-800",
  low: "bg-gray-100 text-gray-700",
};

const REVIEW_STATE_STYLES: Record<string, string> = {
  current: "bg-emerald-100 text-emerald-800",
  review_recommended: "bg-sky-100 text-sky-900",
  attention_needed: "bg-amber-100 text-amber-900",
  critical: "bg-rose-100 text-rose-900",
};

const READINESS_STYLES: Record<string, string> = {
  prepared: "bg-emerald-100 text-emerald-800",
  moderate: "bg-amber-100 text-amber-900",
  needs_planning: "bg-slate-100 text-slate-700",
};

export function OrganizationalResilienceCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalResilienceCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizational-resilience/center");
    if (res.ok) setCenter(parseOrganizationalResilienceCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/organizational-resilience/action", {
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
          <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>
        )}
        {center?.links?.decision_support && (
          <Link href={center.links.decision_support} className="text-slate-600 hover:underline">{labels.decisionSupportLink}</Link>
        )}
        {center?.links?.strategic_intelligence && (
          <Link href={center.links.strategic_intelligence} className="text-slate-600 hover:underline">{labels.strategicIntelligenceLink}</Link>
        )}
        {center?.links?.continuous_improvement && (
          <Link href={center.links.continuous_improvement} className="text-slate-600 hover:underline">{labels.continuousImprovementLink}</Link>
        )}
        {center?.links?.resilience_engine && (
          <Link href={center.links.resilience_engine} className="text-slate-600 hover:underline">{labels.resilienceEngineLink}</Link>
        )}
        {center?.links?.continuity && (
          <Link href={center.links.continuity} className="text-slate-600 hover:underline">{labels.continuityLink}</Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
          {labels.corePrinciple}: {RESILIENCE_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {RESILIENCE_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {RESILIENCE_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <>
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label={labels.metrics.resilienceScore} value={`${dash.resilience_score}%`} />
              <Metric label={labels.metrics.resilienceLabel} value={labels.scoreLevels[dash.resilience_label] ?? dash.resilience_label} />
              <Metric label={labels.metrics.criticalDependencies} value={dash.critical_dependencies} />
              <Metric label={labels.metrics.reviewsCompleted} value={dash.reviews_completed} />
              <Metric label={labels.metrics.reviewsPending} value={dash.reviews_pending} />
              <Metric label={labels.metrics.recoveryCapability} value={dash.recovery_capability} />
              <Metric label={labels.metrics.executiveConfidence} value={`${dash.executive_confidence}/5`} />
              <Metric label={labels.metrics.companionUsefulness} value={`${dash.companion_usefulness}/5`} />
            </dl>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">{labels.scoreDimensionsTitle}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Metric label={labels.dimensions.knowledge} value={`${dash.knowledge_resilience}%`} />
              <Metric label={labels.dimensions.operational} value={`${dash.operational_resilience}%`} />
              <Metric label={labels.dimensions.workforce} value={`${dash.workforce_resilience}%`} />
              <Metric label={labels.dimensions.technical} value={`${dash.technical_resilience}%`} />
              <Metric label={labels.dimensions.governance} value={`${dash.governance_resilience}%`} />
            </dl>
          </section>
        </>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.dependenciesTitle}</h2>
        {center?.dependencies.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptySection}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {center?.dependencies.map((dep) => (
              <li key={dep.dependency_key} className="rounded-xl border border-gray-100 p-4 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="font-semibold text-gray-900">{dep.title}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SEVERITY_STYLES[dep.severity] ?? SEVERITY_STYLES.medium}`}>
                    {dep.severity}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{dep.message}</p>
                <p className="mt-2 text-xs text-gray-500">{labels.domain}: {labels.domains[dep.domain] ?? dep.domain}</p>
                {center?.can_manage && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ActionBtn label={labels.acknowledge} onClick={() => void postAction({ action: "acknowledge_dependency", dependency_key: dep.dependency_key })} />
                    <ActionBtn label={labels.dismiss} variant="muted" onClick={() => void postAction({ action: "dismiss_dependency", dependency_key: dep.dependency_key })} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.reviewsTitle}</h2>
        <ul className="mt-4 space-y-3">
          {center?.preparedness_reviews.map((rev) => (
            <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-semibold text-gray-900">{rev.title}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${REVIEW_STATE_STYLES[rev.review_state] ?? REVIEW_STATE_STYLES.current}`}>
                  {labels.reviewStates[rev.review_state] ?? rev.review_state}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{rev.summary}</p>
              <p className="mt-2 text-xs text-gray-500">{labels.domain}: {labels.domains[rev.domain] ?? rev.domain}</p>
              {rev.status === "pending" && center?.can_manage && (
                <ActionBtn label={labels.completeReview} className="mt-3" onClick={() => void postAction({ action: "complete_review", review_key: rev.review_key })} />
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.scenariosTitle}</h2>
        <ul className="mt-4 space-y-3">
          {center?.scenarios.map((sc) => (
            <li key={sc.scenario_key} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-semibold text-gray-900">{sc.title}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${READINESS_STYLES[sc.readiness_level] ?? READINESS_STYLES.moderate}`}>
                  {labels.readinessLevels[sc.readiness_level] ?? sc.readiness_level}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{sc.prompt}</p>
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
            <li key={rev.exec_review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
              <p className="font-medium text-gray-900">{labels.reviewTypes[rev.review_type] ?? rev.review_type}</p>
              <p className="mt-1 text-gray-700">{rev.prompt}</p>
              {rev.status === "pending" && center?.can_manage && (
                <ActionBtn label={labels.completeReview} className="mt-3" onClick={() => void postAction({ action: "complete_executive_review", exec_review_key: rev.exec_review_key })} />
              )}
            </li>
          ))}
        </ul>
      </section>

      {center?.privacy_note && (
        <p className="text-xs text-gray-500">{labels.privacyNote}: {center.privacy_note}</p>
      )}
    </div>
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
