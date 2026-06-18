"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  OHC_CORE_PRINCIPLE,
  OHC_PHILOSOPHY,
  OHC_VISION,
  parseOrganizationalHealthCenter,
  type HealthDomainScore,
  type OrganizationalHealthCenter,
} from "@/lib/organizational-health-center";

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
  opportunityDiscoveryLink: string;
  earlyWarningLink: string;
  workforceInsightsLink: string;
  organizationalHealthEngineLink: string;
  dashboardTitle: string;
  domainScoresTitle: string;
  indicatorsTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  earlyWarningsTitle: string;
  healthReviewsTitle: string;
  timelineTitle: string;
  emptySection: string;
  overallScore: string;
  trend: string;
  dismiss: string;
  accept: string;
  acknowledge: string;
  completeReview: string;
  generateReport: string;
  archiveSnapshot: string;
  humansDecide: string;
  privacyNote: string;
  domains: Record<string, string>;
  healthBands: Record<string, string>;
  trendDirections: Record<string, string>;
  reviewTypes: Record<string, string>;
  metrics: Record<string, string>;
};

type Props = { labels: PanelLabels };

const BAND_STYLES: Record<string, string> = {
  thriving: "bg-emerald-100 text-emerald-900",
  healthy: "bg-teal-100 text-teal-900",
  stable: "bg-sky-100 text-sky-800",
  needs_attention: "bg-amber-100 text-amber-900",
  critical_review: "bg-rose-100 text-rose-900",
};

const TREND_STYLES: Record<string, string> = {
  improving: "text-emerald-700",
  stable: "text-slate-600",
  declining: "text-amber-700",
  seasonal: "text-indigo-600",
  recovering: "text-teal-700",
};

export function OrganizationalHealthCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalHealthCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizational-health/center");
    if (res.ok) setCenter(parseOrganizationalHealthCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/organizational-health/action", {
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
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
        {center?.links?.decision_support && <Link href={center.links.decision_support} className="text-slate-600 hover:underline">{labels.decisionSupportLink}</Link>}
        {center?.links?.strategic_intelligence && <Link href={center.links.strategic_intelligence} className="text-slate-600 hover:underline">{labels.strategicIntelligenceLink}</Link>}
        {center?.links?.continuous_improvement && <Link href={center.links.continuous_improvement} className="text-slate-600 hover:underline">{labels.continuousImprovementLink}</Link>}
        {center?.links?.organizational_resilience && <Link href={center.links.organizational_resilience} className="text-slate-600 hover:underline">{labels.organizationalResilienceLink}</Link>}
        {center?.links?.opportunity_discovery && <Link href={center.links.opportunity_discovery} className="text-slate-600 hover:underline">{labels.opportunityDiscoveryLink}</Link>}
        {center?.links?.early_warning && <Link href={center.links.early_warning} className="text-slate-600 hover:underline">{labels.earlyWarningLink}</Link>}
        {center?.links?.workforce_insights && <Link href={center.links.workforce_insights} className="text-slate-600 hover:underline">{labels.workforceInsightsLink}</Link>}
        {center?.links?.organizational_health_engine && <Link href={center.links.organizational_health_engine} className="text-slate-600 hover:underline">{labels.organizationalHealthEngineLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {OHC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {OHC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {OHC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">{labels.overallScore}</p>
              <p className="text-3xl font-bold text-gray-900">{dash.overall_health_score}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${BAND_STYLES[dash.overall_health_band] ?? BAND_STYLES.stable}`}>
                {labels.healthBands[dash.overall_health_band] ?? dash.overall_health_band}
              </span>
            </div>
          </div>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.improving} value={dash.domains_improving} />
            <Metric label={labels.metrics.needsAttention} value={dash.domains_needing_attention} />
            <Metric label={labels.metrics.openWarnings} value={dash.open_warnings} />
            <Metric label={labels.metrics.reviewsPending} value={dash.reviews_pending} />
            <Metric label={labels.metrics.confidence} value={`${dash.executive_confidence}/5`} />
            <Metric label={labels.metrics.reviewCompletion} value={`${dash.review_completion_rate}%`} />
            <Metric label={labels.metrics.usefulness} value={`${dash.recommendation_usefulness}/5`} />
            <Metric label={labels.metrics.satisfaction} value={`${dash.leadership_satisfaction}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateReport} onClick={() => void postAction({ action: "generate_report" })} />
              <ActionBtn label={labels.archiveSnapshot} variant="muted" onClick={() => void postAction({ action: "archive_snapshot" })} />
            </div>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.domainScoresTitle}</h2>
        {center?.domain_scores.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptySection}</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {center?.domain_scores.map((domain) => (
              <DomainCard key={domain.domain_key} domain={domain} labels={labels} />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.indicatorsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.indicators.map((ind) => (
            <li key={ind.indicator_key} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-gray-900">{ind.title}</p>
                <span className={`text-xs font-medium ${TREND_STYLES[ind.trend_direction] ?? TREND_STYLES.stable}`}>
                  {labels.trendDirections[ind.trend_direction] ?? ind.trend_direction}
                </span>
              </div>
              <p className="mt-1 text-gray-700">{ind.message}</p>
              <p className="mt-1 text-xs text-gray-500">{labels.domains[ind.domain_key] ?? ind.domain_key}</p>
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

      <section className="rounded-2xl border border-amber-100 bg-amber-50/20 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.earlyWarningsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.early_warnings.map((warn) => (
            <li key={warn.warning_key} className="rounded-xl border border-amber-100 bg-white p-3 text-sm">
              <p className="text-gray-800">{warn.message}</p>
              {center?.can_manage && warn.status === "open" && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <ActionBtn label={labels.acknowledge} onClick={() => void postAction({ action: "acknowledge_warning", warning_key: warn.warning_key })} />
                  <ActionBtn label={labels.dismiss} variant="muted" onClick={() => void postAction({ action: "dismiss_warning", warning_key: warn.warning_key })} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.healthReviewsTitle}</h2>
        <ul className="mt-4 space-y-3">
          {center?.health_reviews.map((rev) => (
            <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
              <p className="font-medium text-gray-900">{labels.reviewTypes[rev.review_type] ?? rev.review_type}</p>
              <p className="mt-1 text-gray-700">{rev.prompt}</p>
              {rev.status !== "completed" && center?.can_manage && (
                <ActionBtn label={labels.completeReview} className="mt-3" onClick={() => void postAction({ action: "complete_review", review_key: rev.review_key })} />
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.timelineTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.timeline.map((evt) => (
            <li key={evt.event_key} className="rounded-xl border border-gray-100 p-3 text-sm">
              <p className="font-medium text-gray-900">{evt.period_label}</p>
              <p className="mt-1 text-gray-700">{evt.summary}</p>
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
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-lg font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function DomainCard({ domain, labels }: { domain: HealthDomainScore; labels: PanelLabels }) {
  return (
    <li className="rounded-xl border border-gray-100 p-4 text-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-gray-900">{labels.domains[domain.domain_key] ?? domain.domain_key}</p>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${BAND_STYLES[domain.health_band] ?? BAND_STYLES.stable}`}>
          {labels.healthBands[domain.health_band] ?? domain.health_band}
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{domain.score}</p>
      <p className={`mt-1 text-xs font-medium ${TREND_STYLES[domain.trend_direction] ?? TREND_STYLES.stable}`}>
        {labels.trend}: {labels.trendDirections[domain.trend_direction] ?? domain.trend_direction}
      </p>
      {domain.summary && <p className="mt-2 text-gray-600">{domain.summary}</p>}
    </li>
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
    variant === "primary"
      ? "rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
      : "rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50";
  return (
    <button type="button" className={`${styles} ${className}`} onClick={onClick}>
      {label}
    </button>
  );
}
