"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  OAD_CORE_PRINCIPLE,
  OAD_PHILOSOPHY,
  OAD_VISION,
  parseOrganizationalAdaptabilityCenter,
  type OrganizationalAdaptabilityCenter,
} from "@/lib/organizational-adaptability-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  organizationalResilienceLink: string;
  changeManagementLink: string;
  organizationalLearningLink: string;
  organizationalEnergyLink: string;
  dashboardTitle: string;
  signalsTitle: string;
  opportunitiesTitle: string;
  responsivenessTitle: string;
  prioritiesTitle: string;
  historyTitle: string;
  snapshotsTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  reviewsTitle: string;
  emptySection: string;
  dismiss: string;
  accept: string;
  completeReview: string;
  discussSignal: string;
  scheduleReflection: string;
  generateSummary: string;
  generateReport: string;
  exportSnapshot: string;
  humansDecide: string;
  privacyNote: string;
  owner: string;
  adaptabilityScore: string;
  domains: Record<string, string>;
  healthLabels: Record<string, string>;
  signalTypes: Record<string, string>;
  historyTypes: Record<string, string>;
  reviewTypes: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const HEALTH_STYLES: Record<string, string> = {
  exceptional: "border-emerald-200 bg-emerald-50",
  strong: "border-teal-200 bg-teal-50",
  stable: "border-slate-200 bg-slate-50",
  developing: "border-amber-200 bg-amber-50",
  rigid: "border-rose-200 bg-rose-50",
};

export function OrganizationalAdaptabilityCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalAdaptabilityCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizational-adaptability/center");
    if (res.ok) setCenter(parseOrganizationalAdaptabilityCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/organizational-adaptability/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  const dash = center?.dashboard;
  const healthStyle = HEALTH_STYLES[dash?.adaptability_health_label ?? "stable"] ?? HEALTH_STYLES.stable;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
        {center?.links?.organizational_resilience && <Link href={center.links.organizational_resilience} className="text-slate-600 hover:underline">{labels.organizationalResilienceLink}</Link>}
        {center?.links?.change_management && <Link href={center.links.change_management} className="text-slate-600 hover:underline">{labels.changeManagementLink}</Link>}
        {center?.links?.organizational_learning && <Link href={center.links.organizational_learning} className="text-slate-600 hover:underline">{labels.organizationalLearningLink}</Link>}
        {center?.links?.organizational_energy && <Link href={center.links.organizational_energy} className="text-slate-600 hover:underline">{labels.organizationalEnergyLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {OAD_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {OAD_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {OAD_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className={`rounded-2xl border p-5 shadow-sm ${healthStyle}`}>
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {labels.healthLabels[dash.adaptability_health_label] ?? dash.adaptability_health_label} · {labels.adaptabilityScore}: {dash.adaptability_score}/100
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.opportunities} value={dash.adaptation_opportunities} />
            <Metric label={labels.metrics.emergingChanges} value={dash.emerging_changes} />
            <Metric label={labels.metrics.responsiveness} value={`${dash.responsiveness_pct}%`} />
            <Metric label={labels.metrics.learning} value={`${dash.learning_integration_pct}%`} />
            <Metric label={labels.metrics.readiness} value={`${dash.change_readiness_pct}%`} />
            <Metric label={labels.metrics.recovery} value={`${dash.recovery_flexibility_pct}%`} />
            <Metric label={labels.metrics.confidence} value={`${dash.leadership_confidence}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateSummary} onClick={() => void postAction({ action: "generate_executive_summary" })} />
              <ActionBtn label={labels.generateReport} variant="muted" onClick={() => void postAction({ action: "generate_adaptability_report" })} />
              <ActionBtn label={labels.scheduleReflection} variant="muted" onClick={() => void postAction({ action: "schedule_reflection_session" })} />
              <ActionBtn label={labels.exportSnapshot} variant="muted" onClick={() => void postAction({ action: "export_trend_snapshot", period_label: "Current period" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.signalsTitle} empty={center?.change_signals.length === 0} emptyLabel={labels.emptySection}>
        {center?.change_signals.map((sig) => (
          <li key={sig.signal_key} className="rounded-xl border border-amber-100 bg-amber-50/30 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.signalTypes[sig.signal_type] ?? sig.signal_type} · {labels.domains[sig.domain] ?? sig.domain}</p>
            <p className="mt-1 text-gray-800">{sig.message}</p>
            {center?.can_manage && (
              <div className="mt-2 flex gap-2">
                <ActionBtn label={labels.discussSignal} onClick={() => void postAction({ action: "discuss_signal", signal_key: sig.signal_key })} />
                <ActionBtn label={labels.dismiss} variant="muted" onClick={() => void postAction({ action: "dismiss_signal", signal_key: sig.signal_key })} />
              </div>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.opportunitiesTitle} empty={center?.adaptation_opportunities.length === 0} emptyLabel={labels.emptySection}>
        {center?.adaptation_opportunities.map((opp) => (
          <li key={opp.opportunity_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">{labels.domains[opp.domain] ?? opp.domain}</p>
                <p className="font-medium text-gray-900">{opp.title}</p>
              </div>
              <span className="text-xs font-medium text-indigo-700">{labels.adaptabilityScore}: {opp.adaptability_score}</span>
            </div>
            <p className="mt-2 text-gray-700">{opp.summary}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.responsivenessTitle} empty={center?.responsiveness_indicators.length === 0} emptyLabel={labels.emptySection}>
        {center?.responsiveness_indicators.map((ind) => (
          <li key={ind.indicator_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.domains[ind.domain] ?? ind.domain}</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-gray-900">{ind.label}</p>
              <span className="text-xs text-gray-600">{ind.value_label} · {ind.trend}</span>
            </div>
          </li>
        ))}
      </Section>

      <Section title={labels.prioritiesTitle} empty={center?.executive_priorities.length === 0} emptyLabel={labels.emptySection}>
        {center?.executive_priorities.map((pri) => (
          <li key={pri.priority_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="font-medium text-gray-900">{pri.title}</p>
            <p className="mt-2 text-gray-700">{pri.summary}</p>
            <p className="mt-2 text-xs text-gray-500">{labels.owner}: {pri.owner_label}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.historyTitle} empty={center?.adaptation_history.length === 0} emptyLabel={labels.emptySection}>
        {center?.adaptation_history.map((entry) => (
          <li key={entry.history_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.historyTypes[entry.history_type] ?? entry.history_type}</p>
            <p className="mt-1 font-medium text-gray-900">{entry.label}</p>
            {entry.summary && <p className="mt-1 text-gray-700">{entry.summary}</p>}
          </li>
        ))}
      </Section>

      <Section title={labels.snapshotsTitle} empty={center?.snapshots.length === 0} emptyLabel={labels.emptySection}>
        {center?.snapshots.map((snap) => (
          <li key={snap.snapshot_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium text-gray-900">{snap.period_label}</p>
              <span className="text-xs text-indigo-700">{labels.adaptabilityScore}: {snap.adaptability_score}</span>
            </div>
            <p className="mt-1 text-gray-700">{snap.summary}</p>
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.flexibility} value={center.executive_view.strategic_flexibility} />
            <ExecField label={labels.executiveFields.responsiveness} value={center.executive_view.responsiveness_trends} />
            <ExecField label={labels.executiveFields.learning} value={center.executive_view.learning_integration} />
            <ExecField label={labels.executiveFields.opportunities} value={center.executive_view.adaptation_opportunities} />
          </dl>
        </section>
      )}

      <InsightSection title={labels.insightsTitle} items={center?.insights ?? []} canManage={center?.can_manage ?? false} dismissLabel={labels.dismiss} onDismiss={(key) => void postAction({ action: "dismiss_insight", insight_key: key })} />
      <RecommendationSection title={labels.recommendationsTitle} items={center?.recommendations ?? []} canManage={center?.can_manage ?? false} acceptLabel={labels.accept} dismissLabel={labels.dismiss} onAccept={(key) => void postAction({ action: "accept_recommendation", recommendation_key: key })} onDismiss={(key) => void postAction({ action: "dismiss_recommendation", recommendation_key: key })} />

      <Section title={labels.reviewsTitle} empty={center?.adaptability_reviews.length === 0} emptyLabel={labels.emptySection}>
        {center?.adaptability_reviews.map((rev) => (
          <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="text-xs text-gray-500">{labels.reviewTypes[rev.review_type] ?? rev.review_type}</p>
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
