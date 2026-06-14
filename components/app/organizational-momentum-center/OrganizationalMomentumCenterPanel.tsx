"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  OMMC_CORE_PRINCIPLE,
  OMMC_PHILOSOPHY,
  OMMC_VISION,
  parseOrganizationalMomentumCenter,
  type OrganizationalMomentumCenter,
} from "@/lib/organizational-momentum-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  organizationalTrustLink: string;
  organizationalStewardshipLink: string;
  organizationalSimplicityLink: string;
  organizationalPurposeLink: string;
  dashboardTitle: string;
  signalsTitle: string;
  recognitionTitle: string;
  reviewsTitle: string;
  timelineTitle: string;
  achievementsTitle: string;
  snapshotsTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  sessionsTitle: string;
  emptySection: string;
  dismiss: string;
  accept: string;
  completeReview: string;
  completeSession: string;
  scheduleSession: string;
  recognizeMilestone: string;
  generateSummary: string;
  printReport: string;
  exportSnapshot: string;
  coordinateCelebration: string;
  archiveAchievement: string;
  humansDecide: string;
  privacyNote: string;
  momentumScore: string;
  domains: Record<string, string>;
  signalTypes: Record<string, string>;
  signalTones: Record<string, string>;
  recognitionStatuses: Record<string, string>;
  recognitionTypes: Record<string, string>;
  healthLabels: Record<string, string>;
  timelineTypes: Record<string, string>;
  reviewTypes: Record<string, string>;
  sessionTypes: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const HEALTH_STYLES: Record<string, string> = {
  accelerating: "border-emerald-200 bg-emerald-50",
  strong: "border-teal-200 bg-teal-50",
  steady: "border-slate-200 bg-slate-50",
  slowing: "border-amber-200 bg-amber-50",
  stalled: "border-rose-200 bg-rose-50",
};

const TONE_STYLES: Record<string, string> = {
  positive: "border-emerald-100 bg-emerald-50/30",
  neutral: "border-slate-100 bg-slate-50/30",
  attention: "border-amber-100 bg-amber-50/30",
};

export function OrganizationalMomentumCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalMomentumCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizational-momentum/center");
    if (res.ok) setCenter(parseOrganizationalMomentumCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/organizational-momentum/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  const dash = center?.dashboard;
  const healthStyle = HEALTH_STYLES[dash?.momentum_health_label ?? "steady"] ?? HEALTH_STYLES.steady;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
        {center?.links?.organizational_trust && <Link href={center.links.organizational_trust} className="text-slate-600 hover:underline">{labels.organizationalTrustLink}</Link>}
        {center?.links?.organizational_stewardship && <Link href={center.links.organizational_stewardship} className="text-slate-600 hover:underline">{labels.organizationalStewardshipLink}</Link>}
        {center?.links?.organizational_simplicity && <Link href={center.links.organizational_simplicity} className="text-slate-600 hover:underline">{labels.organizationalSimplicityLink}</Link>}
        {center?.links?.organizational_purpose && <Link href={center.links.organizational_purpose} className="text-slate-600 hover:underline">{labels.organizationalPurposeLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {OMMC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {OMMC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {OMMC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className={`rounded-2xl border p-5 shadow-sm ${healthStyle}`}>
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {labels.healthLabels[dash.momentum_health_label] ?? dash.momentum_health_label} · {labels.momentumScore}: {dash.momentum_score}/100
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.trend} value={`${dash.progress_trend_pct}%`} />
            <Metric label={labels.metrics.positive} value={`${dash.positive_momentum_pct}%`} />
            <Metric label={labels.metrics.initiative} value={`${dash.initiative_progression_pct}%`} />
            <Metric label={labels.metrics.reviews} value={`${dash.review_participation_pct}%`} />
            <Metric label={labels.metrics.consistency} value={`${dash.strategic_consistency_pct}%`} />
            <Metric label={labels.metrics.learning} value={`${dash.learning_integration_pct}%`} />
            <Metric label={labels.metrics.pendingRecognitions} value={dash.pending_recognitions} />
            <Metric label={labels.metrics.confidence} value={`${dash.leadership_confidence}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateSummary} onClick={() => void postAction({ action: "generate_momentum_summary" })} />
              <ActionBtn label={labels.printReport} variant="muted" onClick={() => void postAction({ action: "print_executive_report" })} />
              <ActionBtn label={labels.exportSnapshot} variant="muted" onClick={() => void postAction({ action: "export_progress_snapshot", period_label: "Current period" })} />
              <ActionBtn label={labels.coordinateCelebration} variant="muted" onClick={() => void postAction({ action: "coordinate_milestone_celebration" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.signalsTitle} empty={center?.momentum_signals.length === 0} emptyLabel={labels.emptySection}>
        {center?.momentum_signals.map((sig) => (
          <li key={sig.signal_key} className={`rounded-xl border p-4 text-sm ${TONE_STYLES[sig.signal_tone] ?? TONE_STYLES.neutral}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-xs text-gray-500">{labels.domains[sig.domain] ?? sig.domain} · {labels.signalTypes[sig.signal_type] ?? sig.signal_type}</p>
              <span className="text-xs font-medium text-gray-700">{labels.signalTones[sig.signal_tone] ?? sig.signal_tone}</span>
            </div>
            <p className="mt-1 font-medium text-gray-900">{sig.title}</p>
            <p className="mt-2 text-gray-700">{sig.summary}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.recognitionTitle} empty={center?.milestone_recognitions.length === 0} emptyLabel={labels.emptySection}>
        {center?.milestone_recognitions.map((rec) => (
          <li key={rec.recognition_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-xs text-gray-500">{labels.domains[rec.domain] ?? rec.domain} · {labels.recognitionTypes[rec.recognition_type] ?? rec.recognition_type}</p>
              <span className="text-xs font-medium text-indigo-700">{labels.recognitionStatuses[rec.status] ?? rec.status}</span>
            </div>
            <p className="mt-1 font-medium text-gray-900">{rec.title}</p>
            <p className="mt-2 text-gray-700">{rec.summary}</p>
            {rec.status !== "recognized" && center?.can_manage && (
              <div className="mt-3">
                <ActionBtn label={labels.recognizeMilestone} onClick={() => void postAction({ action: "recognize_milestone", recognition_key: rec.recognition_key })} />
              </div>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.reviewsTitle} empty={center?.momentum_reviews.length === 0} emptyLabel={labels.emptySection}>
        {center?.momentum_reviews.map((rev) => (
          <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="text-xs text-gray-500">{labels.reviewTypes[rev.review_type] ?? rev.review_type}</p>
            <p className="mt-1 text-gray-700">{rev.prompt}</p>
            {rev.status !== "completed" && center?.can_manage && (
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionBtn label={labels.completeReview} onClick={() => void postAction({ action: "complete_review", review_key: rev.review_key })} />
                <ActionBtn label={labels.scheduleSession} variant="muted" onClick={() => void postAction({ action: "schedule_reflection_session", review_key: rev.review_key })} />
              </div>
            )}
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

      <Section title={labels.achievementsTitle} empty={center?.archived_achievements.length === 0} emptyLabel={labels.emptySection}>
        {center?.archived_achievements.map((ach) => (
          <li key={ach.achievement_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.domains[ach.domain] ?? ach.domain}</p>
            <p className="mt-1 font-medium text-gray-900">{ach.title}</p>
            <p className="mt-1 text-gray-700">{ach.summary}</p>
          </li>
        ))}
        {center?.can_manage && (
          <li className="pt-2">
            <ActionBtn label={labels.archiveAchievement} onClick={() => void postAction({ action: "archive_achievement_timeline", title: "Achievement timeline", summary: "Achievement timeline archived via Momentum Center." })} />
          </li>
        )}
      </Section>

      <Section title={labels.snapshotsTitle} empty={center?.snapshots.length === 0} emptyLabel={labels.emptySection}>
        {center?.snapshots.map((snap) => (
          <li key={snap.snapshot_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium text-gray-900">{snap.period_label}</p>
              <span className="text-xs text-indigo-700">{labels.momentumScore}: {snap.momentum_score}</span>
            </div>
            <p className="mt-1 text-gray-700">{snap.summary}</p>
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.strategic} value={center.executive_view.strategic_progress} />
            <ExecField label={labels.executiveFields.consistency} value={center.executive_view.leadership_consistency} />
            <ExecField label={labels.executiveFields.confidence} value={center.executive_view.organizational_confidence} />
            <ExecField label={labels.executiveFields.opportunities} value={center.executive_view.long_term_opportunities} />
          </dl>
        </section>
      )}

      <InsightSection title={labels.insightsTitle} items={center?.insights ?? []} canManage={center?.can_manage ?? false} dismissLabel={labels.dismiss} onDismiss={(key) => void postAction({ action: "dismiss_insight", insight_key: key })} />
      <RecommendationSection title={labels.recommendationsTitle} items={center?.recommendations ?? []} canManage={center?.can_manage ?? false} acceptLabel={labels.accept} dismissLabel={labels.dismiss} onAccept={(key) => void postAction({ action: "accept_recommendation", recommendation_key: key })} onDismiss={(key) => void postAction({ action: "dismiss_recommendation", recommendation_key: key })} />

      <Section title={labels.sessionsTitle} empty={center?.momentum_sessions.length === 0} emptyLabel={labels.emptySection}>
        {center?.momentum_sessions.map((sess) => (
          <li key={sess.session_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="text-xs text-gray-500">{labels.sessionTypes[sess.session_type] ?? sess.session_type}</p>
            <p className="mt-1 text-gray-700">{sess.prompt}</p>
            {sess.status !== "completed" && center?.can_manage && (
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionBtn label={labels.completeSession} onClick={() => void postAction({ action: "complete_session", session_key: sess.session_key })} />
                <ActionBtn label={labels.scheduleSession} variant="muted" onClick={() => void postAction({ action: "schedule_reflection_session", session_key: sess.session_key })} />
              </div>
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
