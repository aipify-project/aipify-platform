"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  OBS_CORE_PRINCIPLE,
  OBS_PHILOSOPHY,
  OBS_VISION,
  parsePlatformObservabilityCenter,
  type PlatformObservabilityCenter,
} from "@/lib/platform-observability-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  operationsLink: string;
  deploymentsLink: string;
  databaseGovernanceLink: string;
  automationControlLink: string;
  executiveLink: string;
  dashboardTitle: string;
  domainsTitle: string;
  servicesTitle: string;
  alertsTitle: string;
  correlationsTitle: string;
  investigationsTitle: string;
  feedsTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  reviewsTitle: string;
  emptySection: string;
  healthScore: string;
  dismiss: string;
  accept: string;
  acknowledge: string;
  resolve: string;
  investigate: string;
  completeInvestigation: string;
  completeReview: string;
  generateReport: string;
  generateSummary: string;
  humansDecide: string;
  privacyNote: string;
  healthBands: Record<string, string>;
  alertSeverities: Record<string, string>;
  domains: Record<string, string>;
  feedTypes: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const BAND_STYLES: Record<string, string> = {
  thriving: "bg-emerald-100 text-emerald-900",
  healthy: "bg-teal-100 text-teal-900",
  stable: "bg-sky-100 text-sky-900",
  attention_required: "bg-amber-100 text-amber-900",
  critical: "bg-rose-100 text-rose-900",
};

const SEVERITY_STYLES: Record<string, string> = {
  critical: "border-rose-200 bg-rose-50",
  high: "border-orange-200 bg-orange-50",
  moderate: "border-amber-200 bg-amber-50",
  minor: "border-slate-200 bg-slate-50",
  informational: "border-indigo-100 bg-indigo-50/40",
};

export function PlatformObservabilityCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<PlatformObservabilityCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-observability/center");
    if (res.ok) setCenter(parsePlatformObservabilityCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/platform-observability/action", {
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
        {center?.links?.operations && <Link href={center.links.operations} className="text-slate-600 hover:underline">{labels.operationsLink}</Link>}
        {center?.links?.deployments && <Link href={center.links.deployments} className="text-slate-600 hover:underline">{labels.deploymentsLink}</Link>}
        {center?.links?.database_governance && <Link href={center.links.database_governance} className="text-slate-600 hover:underline">{labels.databaseGovernanceLink}</Link>}
        {center?.links?.automation_control && <Link href={center.links.automation_control} className="text-slate-600 hover:underline">{labels.automationControlLink}</Link>}
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {OBS_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {OBS_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {OBS_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">{labels.healthScore}</p>
              <p className="text-3xl font-bold text-gray-900">{dash.platform_health_score}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${BAND_STYLES[dash.platform_health_band] ?? BAND_STYLES.healthy}`}>
                {labels.healthBands[dash.platform_health_band] ?? dash.platform_health_band}
              </span>
            </div>
          </div>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.criticalAlerts} value={dash.critical_alerts} />
            <Metric label={labels.metrics.openAlerts} value={dash.open_alerts} />
            <Metric label={labels.metrics.availability} value={`${dash.service_availability_pct}%`} />
            <Metric label={labels.metrics.selfHealing} value={dash.self_healing_events} />
            <Metric label={labels.metrics.mttr} value={`${dash.mean_time_to_understanding_minutes}m`} />
            <Metric label={labels.metrics.detection} value={`${dash.incident_detection_speed_minutes}m`} />
            <Metric label={labels.metrics.alertUsefulness} value={`${dash.alert_usefulness_score}/5`} />
            <Metric label={labels.metrics.confidence} value={`${dash.operational_confidence}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateReport} onClick={() => void postAction({ action: "generate_health_report" })} />
              <ActionBtn label={labels.generateSummary} variant="muted" onClick={() => void postAction({ action: "generate_incident_summary" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.alertsTitle} empty={center?.alerts.length === 0} emptyLabel={labels.emptySection}>
        {center?.alerts.map((alert) => (
          <li key={alert.alert_key} className={`rounded-xl border p-4 text-sm ${SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.informational}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900">{alert.title}</p>
                <p className="mt-1 text-gray-700">{alert.message}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {labels.alertSeverities[alert.severity] ?? alert.severity}
                  {alert.domain ? ` · ${labels.domains[alert.domain] ?? alert.domain}` : ""}
                </p>
              </div>
              <span className="text-xs font-medium text-gray-600">{alert.status}</span>
            </div>
            {center?.can_manage && alert.status === "open" && (
              <div className="mt-3 flex gap-2">
                <ActionBtn label={labels.acknowledge} onClick={() => void postAction({ action: "acknowledge_alert", alert_key: alert.alert_key })} />
                <ActionBtn label={labels.resolve} variant="muted" onClick={() => void postAction({ action: "resolve_alert", alert_key: alert.alert_key })} />
              </div>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.domainsTitle} empty={center?.domain_metrics.length === 0} emptyLabel={labels.emptySection}>
        {center?.domain_metrics.map((metric) => (
          <li key={metric.metric_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">{labels.domains[metric.domain] ?? metric.domain}</p>
                <p className="font-medium text-gray-900">{metric.label}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{metric.value_label}</p>
                <p className="text-xs text-gray-500">{metric.trend} · {metric.status}</p>
              </div>
            </div>
          </li>
        ))}
      </Section>

      <Section title={labels.servicesTitle} empty={center?.service_signals.length === 0} emptyLabel={labels.emptySection}>
        {center?.service_signals.map((sig) => (
          <li key={sig.signal_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-gray-900">{sig.service_name}</p>
              <p className="text-sm text-gray-700">{sig.availability_pct}% · {sig.status}</p>
            </div>
          </li>
        ))}
      </Section>

      <Section title={labels.correlationsTitle} empty={center?.correlations.length === 0} emptyLabel={labels.emptySection}>
        {center?.correlations.map((corr) => (
          <li key={corr.correlation_key} className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-3 text-sm">
            <p className="text-gray-800">{corr.summary}</p>
            <p className="mt-1 text-xs text-gray-500">{corr.confidence} · {corr.systems_involved.join(", ")}</p>
            {center?.can_manage && corr.status !== "dismissed" && (
              <ActionBtn label={labels.dismiss} className="mt-2" variant="muted" onClick={() => void postAction({ action: "dismiss_correlation", correlation_key: corr.correlation_key })} />
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.investigationsTitle} empty={center?.investigations.length === 0} emptyLabel={labels.emptySection}>
        {center?.investigations.map((inv) => (
          <li key={inv.investigation_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="font-medium text-gray-900">{inv.title}</p>
            <p className="mt-2 text-gray-700"><span className="font-medium">Impact:</span> {inv.impact_assessment}</p>
            <p className="mt-1 text-gray-700"><span className="font-medium">Timeline:</span> {inv.timeline_summary}</p>
            <p className="mt-1 text-gray-700"><span className="font-medium">Recovery:</span> {inv.recovery_recommendation}</p>
            {center?.can_manage && inv.status !== "completed" && inv.status !== "archived" && (
              <div className="mt-3 flex gap-2">
                {inv.status === "open" && (
                  <ActionBtn label={labels.investigate} onClick={() => void postAction({ action: "start_investigation", investigation_key: inv.investigation_key })} />
                )}
                {inv.status === "in_progress" && (
                  <ActionBtn label={labels.completeInvestigation} onClick={() => void postAction({ action: "complete_investigation", investigation_key: inv.investigation_key })} />
                )}
              </div>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.feedsTitle} empty={center?.feeds.length === 0} emptyLabel={labels.emptySection}>
        {center?.feeds.map((feed) => (
          <li key={feed.feed_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.feedTypes[feed.feed_type] ?? feed.feed_type}</p>
            <p className="mt-1 text-gray-800">{feed.message}</p>
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.impact} value={center.executive_view.organizational_impact} />
            <ExecField label={labels.executiveFields.reliability} value={center.executive_view.service_reliability} />
            <ExecField label={labels.executiveFields.maturity} value={center.executive_view.operational_maturity} />
            <ExecField label={labels.executiveFields.experience} value={center.executive_view.customer_experience_trend} />
            <ExecField label={labels.executiveFields.strategy} value={center.executive_view.strategic_implication} />
          </dl>
        </section>
      )}

      <InsightSection title={labels.insightsTitle} items={center?.insights ?? []} canManage={center?.can_manage ?? false} dismissLabel={labels.dismiss} onDismiss={(key) => void postAction({ action: "dismiss_insight", insight_key: key })} />
      <RecommendationSection title={labels.recommendationsTitle} items={center?.recommendations ?? []} canManage={center?.can_manage ?? false} acceptLabel={labels.accept} dismissLabel={labels.dismiss} onAccept={(key) => void postAction({ action: "accept_recommendation", recommendation_key: key })} onDismiss={(key) => void postAction({ action: "dismiss_recommendation", recommendation_key: key })} />

      <Section title={labels.reviewsTitle} empty={center?.governance_reviews.length === 0} emptyLabel={labels.emptySection}>
        {center?.governance_reviews.map((rev) => (
          <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="font-medium text-gray-900">{rev.review_type}</p>
            <p className="mt-1 text-gray-700">{rev.prompt}</p>
            {rev.status !== "completed" && center?.can_manage && (
              <ActionBtn label={labels.completeReview} className="mt-3" onClick={() => void postAction({ action: "complete_review", review_key: rev.review_key })} />
            )}
          </li>
        ))}
      </Section>

      {center?.privacy_note && <p className="text-xs text-gray-500">{labels.privacyNote}: {center.privacy_note}</p>}
    </div>
  );
}

function Section({ title, empty, emptyLabel, children }: { title: string; empty?: boolean; emptyLabel: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {empty ? <p className="mt-4 text-sm text-gray-500">{emptyLabel}</p> : <ul className="mt-4 space-y-3">{children}</ul>}
    </section>
  );
}

function InsightSection({ title, items, canManage, dismissLabel, onDismiss }: { title: string; items: { insight_key: string; message: string }[]; canManage: boolean; dismissLabel: string; onDismiss: (key: string) => void }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.map((ins) => (
          <li key={ins.insight_key} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 text-sm">
            <p className="text-gray-800">{ins.message}</p>
            {canManage && <button type="button" className="mt-2 text-xs text-slate-600 hover:underline" onClick={() => onDismiss(ins.insight_key)}>{dismissLabel}</button>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecommendationSection({ title, items, canManage, acceptLabel, dismissLabel, onAccept, onDismiss }: { title: string; items: { recommendation_key: string; message: string }[]; canManage: boolean; acceptLabel: string; dismissLabel: string; onAccept: (key: string) => void; onDismiss: (key: string) => void }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.map((rec) => (
          <li key={rec.recommendation_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-gray-800">{rec.message}</p>
            {canManage && (
              <div className="mt-2 flex gap-2">
                <ActionBtn label={acceptLabel} onClick={() => onAccept(rec.recommendation_key)} />
                <ActionBtn label={dismissLabel} variant="muted" onClick={() => onDismiss(rec.recommendation_key)} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExecField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-gray-800">{value}</dd>
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

function ActionBtn({ label, onClick, variant = "primary", className = "" }: { label: string; onClick: () => void; variant?: "primary" | "muted"; className?: string }) {
  const styles = variant === "primary"
    ? "rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
    : "rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50";
  return <button type="button" className={`${styles} ${className}`} onClick={onClick}>{label}</button>;
}
