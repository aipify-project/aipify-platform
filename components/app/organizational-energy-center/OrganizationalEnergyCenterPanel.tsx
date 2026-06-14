"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  OEC_CORE_PRINCIPLE,
  OEC_PHILOSOPHY,
  OEC_VISION,
  parseOrganizationalEnergyCenter,
  type OrganizationalEnergyCenter,
} from "@/lib/organizational-energy-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  organizationalFocusLink: string;
  organizationalHealthLink: string;
  organizationalResilienceLink: string;
  changeManagementLink: string;
  dashboardTitle: string;
  capacityTitle: string;
  patternsTitle: string;
  recoveryTitle: string;
  loadTrendsTitle: string;
  timelineTitle: string;
  snapshotsTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  reviewsTitle: string;
  emptySection: string;
  dismiss: string;
  accept: string;
  completeReview: string;
  discussPattern: string;
  scheduleRecovery: string;
  generateSummary: string;
  generateReport: string;
  exportSnapshot: string;
  humansDecide: string;
  privacyNote: string;
  energyScore: string;
  domains: Record<string, string>;
  healthLabels: Record<string, string>;
  patternTypes: Record<string, string>;
  timelineTypes: Record<string, string>;
  reviewTypes: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const HEALTH_STYLES: Record<string, string> = {
  thriving: "border-emerald-200 bg-emerald-50",
  healthy: "border-teal-200 bg-teal-50",
  balanced: "border-slate-200 bg-slate-50",
  strained: "border-amber-200 bg-amber-50",
  exhausted: "border-rose-200 bg-rose-50",
};

export function OrganizationalEnergyCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalEnergyCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizational-energy/center");
    if (res.ok) setCenter(parseOrganizationalEnergyCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/organizational-energy/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  const dash = center?.dashboard;
  const healthStyle = HEALTH_STYLES[dash?.energy_health_label ?? "balanced"] ?? HEALTH_STYLES.balanced;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
        {center?.links?.organizational_focus && <Link href={center.links.organizational_focus} className="text-slate-600 hover:underline">{labels.organizationalFocusLink}</Link>}
        {center?.links?.organizational_health && <Link href={center.links.organizational_health} className="text-slate-600 hover:underline">{labels.organizationalHealthLink}</Link>}
        {center?.links?.organizational_resilience && <Link href={center.links.organizational_resilience} className="text-slate-600 hover:underline">{labels.organizationalResilienceLink}</Link>}
        {center?.links?.change_management && <Link href={center.links.change_management} className="text-slate-600 hover:underline">{labels.changeManagementLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {OEC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {OEC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {OEC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className={`rounded-2xl border p-5 shadow-sm ${healthStyle}`}>
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {labels.healthLabels[dash.energy_health_label] ?? dash.energy_health_label} · {labels.energyScore}: {dash.energy_score}/100
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.recovery} value={dash.recovery_opportunities} />
            <Metric label={labels.metrics.focusAlerts} value={dash.focus_alerts} />
            <Metric label={labels.metrics.initiativeLoad} value={`${dash.initiative_load_pct}%`} />
            <Metric label={labels.metrics.reviewIntensity} value={`${dash.review_intensity_pct}%`} />
            <Metric label={labels.metrics.changeSaturation} value={`${dash.change_saturation_pct}%`} />
            <Metric label={labels.metrics.recoveryHeadroom} value={dash.recovery_headroom} />
            <Metric label={labels.metrics.confidence} value={`${dash.leadership_confidence}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateSummary} onClick={() => void postAction({ action: "generate_executive_summary" })} />
              <ActionBtn label={labels.generateReport} variant="muted" onClick={() => void postAction({ action: "generate_sustainability_report" })} />
              <ActionBtn label={labels.exportSnapshot} variant="muted" onClick={() => void postAction({ action: "export_energy_snapshot", period_label: "Current period" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.capacityTitle} empty={center?.capacity_indicators.length === 0} emptyLabel={labels.emptySection}>
        {center?.capacity_indicators.map((cap) => (
          <li key={cap.capacity_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.domains[cap.domain] ?? cap.domain}</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-gray-900">{cap.label}</p>
              <span className="text-xs text-gray-600">{cap.value_label} · {cap.trend}</span>
            </div>
          </li>
        ))}
      </Section>

      <Section title={labels.patternsTitle} empty={center?.energy_patterns.length === 0} emptyLabel={labels.emptySection}>
        {center?.energy_patterns.map((pat) => (
          <li key={pat.pattern_key} className="rounded-xl border border-amber-100 bg-amber-50/30 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.patternTypes[pat.pattern_type] ?? pat.pattern_type}</p>
            <p className="mt-1 text-gray-800">{pat.message}</p>
            {center?.can_manage && (
              <div className="mt-2 flex gap-2">
                <ActionBtn label={labels.discussPattern} onClick={() => void postAction({ action: "discuss_pattern", pattern_key: pat.pattern_key })} />
                <ActionBtn label={labels.dismiss} variant="muted" onClick={() => void postAction({ action: "dismiss_pattern", pattern_key: pat.pattern_key })} />
              </div>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.recoveryTitle} empty={center?.recovery_opportunities.length === 0} emptyLabel={labels.emptySection}>
        {center?.recovery_opportunities.map((rec) => (
          <li key={rec.recovery_key} className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-3 text-sm">
            <p className="font-medium text-gray-900">{rec.label}</p>
            <p className="mt-1 text-gray-700">{rec.guidance}</p>
            {center?.can_manage && (
              <ActionBtn label={labels.scheduleRecovery} className="mt-2" onClick={() => void postAction({ action: "schedule_recovery", recovery_key: rec.recovery_key })} />
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.loadTrendsTitle} empty={center?.load_trends.length === 0} emptyLabel={labels.emptySection}>
        {center?.load_trends.map((trend) => (
          <li key={trend.trend_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900">{trend.label}</p>
                <p className="text-xs text-gray-500">{trend.period_label}</p>
              </div>
              <span className="text-xs font-medium text-indigo-700">{trend.load_pct}%</span>
            </div>
          </li>
        ))}
      </Section>

      <Section title={labels.timelineTitle} empty={center?.timeline.length === 0} emptyLabel={labels.emptySection}>
        {center?.timeline.map((evt) => (
          <li key={evt.timeline_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.timelineTypes[evt.event_type] ?? evt.event_type}</p>
            <p className="mt-1 font-medium text-gray-900">{evt.label}</p>
            {evt.summary && <p className="mt-1 text-gray-700">{evt.summary}</p>}
          </li>
        ))}
      </Section>

      <Section title={labels.snapshotsTitle} empty={center?.snapshots.length === 0} emptyLabel={labels.emptySection}>
        {center?.snapshots.map((snap) => (
          <li key={snap.snapshot_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium text-gray-900">{snap.period_label}</p>
              <span className="text-xs text-indigo-700">{labels.energyScore}: {snap.energy_score}</span>
            </div>
            <p className="mt-1 text-gray-700">{snap.summary}</p>
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.leadership} value={center.executive_view.leadership_demand} />
            <ExecField label={labels.executiveFields.pacing} value={center.executive_view.strategic_pacing} />
            <ExecField label={labels.executiveFields.recovery} value={center.executive_view.recovery_opportunities} />
            <ExecField label={labels.executiveFields.execution} value={center.executive_view.sustainable_execution} />
          </dl>
        </section>
      )}

      <InsightSection title={labels.insightsTitle} items={center?.insights ?? []} canManage={center?.can_manage ?? false} dismissLabel={labels.dismiss} onDismiss={(key) => void postAction({ action: "dismiss_insight", insight_key: key })} />
      <RecommendationSection title={labels.recommendationsTitle} items={center?.recommendations ?? []} canManage={center?.can_manage ?? false} acceptLabel={labels.accept} dismissLabel={labels.dismiss} onAccept={(key) => void postAction({ action: "accept_recommendation", recommendation_key: key })} onDismiss={(key) => void postAction({ action: "dismiss_recommendation", recommendation_key: key })} />

      <Section title={labels.reviewsTitle} empty={center?.energy_reviews.length === 0} emptyLabel={labels.emptySection}>
        {center?.energy_reviews.map((rev) => (
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
