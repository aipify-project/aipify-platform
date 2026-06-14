"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ORLC_CORE_PRINCIPLE,
  ORLC_PHILOSOPHY,
  ORLC_VISION,
  parseOrganizationalRenewalCenter,
  type OrganizationalRenewalCenter,
} from "@/lib/organizational-renewal-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  organizationalFlourishingLink: string;
  organizationalLearningLink: string;
  organizationalAdaptabilityLink: string;
  dashboardTitle: string;
  opportunitiesTitle: string;
  balanceTitle: string;
  initiativesTitle: string;
  reviewsTitle: string;
  timelineTitle: string;
  milestonesTitle: string;
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
  scheduleReflection: string;
  completeInitiative: string;
  generateReport: string;
  printSummary: string;
  exportSnapshot: string;
  coordinateDiscussion: string;
  archiveMilestone: string;
  humansDecide: string;
  privacyNote: string;
  renewalScore: string;
  strategicReassessment: string;
  domains: Record<string, string>;
  opportunityTypes: Record<string, string>;
  opportunityTones: Record<string, string>;
  balanceTypes: Record<string, string>;
  initiativeStatuses: Record<string, string>;
  healthLabels: Record<string, string>;
  timelineTypes: Record<string, string>;
  reviewTypes: Record<string, string>;
  sessionTypes: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const HEALTH_STYLES: Record<string, string> = {
  thriving: "border-emerald-200 bg-emerald-50",
  healthy: "border-teal-200 bg-teal-50",
  developing: "border-slate-200 bg-slate-50",
  renewal_recommended: "border-amber-200 bg-amber-50",
  stagnation_risk: "border-rose-200 bg-rose-50",
};

const TONE_STYLES: Record<string, string> = {
  positive: "border-emerald-100 bg-emerald-50/30",
  neutral: "border-slate-100 bg-slate-50/30",
  attention: "border-amber-100 bg-amber-50/30",
};

export function OrganizationalRenewalCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalRenewalCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizational-renewal/center");
    if (res.ok) setCenter(parseOrganizationalRenewalCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/organizational-renewal/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  const dash = center?.dashboard;
  const healthStyle = HEALTH_STYLES[dash?.renewal_health_label ?? "healthy"] ?? HEALTH_STYLES.healthy;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
        {center?.links?.organizational_flourishing && <Link href={center.links.organizational_flourishing} className="text-slate-600 hover:underline">{labels.organizationalFlourishingLink}</Link>}
        {center?.links?.organizational_learning && <Link href={center.links.organizational_learning} className="text-slate-600 hover:underline">{labels.organizationalLearningLink}</Link>}
        {center?.links?.organizational_adaptability && <Link href={center.links.organizational_adaptability} className="text-slate-600 hover:underline">{labels.organizationalAdaptabilityLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {ORLC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {ORLC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {ORLC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className={`rounded-2xl border p-5 shadow-sm ${healthStyle}`}>
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {labels.healthLabels[dash.renewal_health_label] ?? dash.renewal_health_label} · {labels.renewalScore}: {dash.renewal_score}/100 · {labels.strategicReassessment}: {dash.strategic_reassessment_pct}%
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.adaptability} value={`${dash.strategic_adaptability_pct}%`} />
            <Metric label={labels.metrics.learning} value={`${dash.learning_participation_pct}%`} />
            <Metric label={labels.metrics.leadership} value={`${dash.leadership_reflection_pct}%`} />
            <Metric label={labels.metrics.capability} value={`${dash.capability_development_pct}%`} />
            <Metric label={labels.metrics.momentum} value={`${dash.improvement_momentum_pct}%`} />
            <Metric label={labels.metrics.integration} value={`${dash.learning_integration_pct}%`} />
            <Metric label={labels.metrics.initiatives} value={dash.initiatives_in_progress} />
            <Metric label={labels.metrics.reviews} value={dash.reviews_completed} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateReport} onClick={() => void postAction({ action: "generate_renewal_report" })} />
              <ActionBtn label={labels.printSummary} variant="muted" onClick={() => void postAction({ action: "print_executive_summary" })} />
              <ActionBtn label={labels.exportSnapshot} variant="muted" onClick={() => void postAction({ action: "export_renewal_snapshot", period_label: "Current quarter" })} />
              <ActionBtn label={labels.coordinateDiscussion} variant="muted" onClick={() => void postAction({ action: "coordinate_reassessment_discussion" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.opportunitiesTitle} empty={center?.renewal_opportunities.length === 0} emptyLabel={labels.emptySection}>
        {center?.renewal_opportunities.map((opp) => (
          <li key={opp.opportunity_key} className={`rounded-xl border p-4 text-sm ${TONE_STYLES[opp.opportunity_tone] ?? TONE_STYLES.neutral}`}>
            <p className="text-xs text-gray-500">{labels.domains[opp.domain] ?? opp.domain} · {labels.opportunityTypes[opp.opportunity_type] ?? opp.opportunity_type}</p>
            <p className="mt-1 font-medium text-gray-900">{opp.title}</p>
            <p className="mt-2 text-gray-700">{opp.summary}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.balanceTitle} empty={center?.balance_prompts.length === 0} emptyLabel={labels.emptySection}>
        {center?.balance_prompts.map((bal) => (
          <li key={bal.balance_key} className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-4 text-sm">
            <p className="text-xs text-gray-500">{labels.balanceTypes[bal.balance_type] ?? bal.balance_type}</p>
            <p className="mt-1 font-medium text-gray-900">{bal.title}</p>
            <p className="mt-2 text-gray-700">{bal.summary}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.initiativesTitle} empty={center?.renewal_initiatives.length === 0} emptyLabel={labels.emptySection}>
        {center?.renewal_initiatives.map((ini) => (
          <li key={ini.initiative_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-xs text-gray-500">{labels.domains[ini.domain] ?? ini.domain}</p>
              <span className="text-xs font-medium text-indigo-700">{labels.initiativeStatuses[ini.status] ?? ini.status}</span>
            </div>
            <p className="mt-1 font-medium text-gray-900">{ini.title}</p>
            <p className="mt-2 text-gray-700">{ini.summary}</p>
            {ini.status !== "completed" && center?.can_manage && (
              <div className="mt-3">
                <ActionBtn label={labels.completeInitiative} onClick={() => void postAction({ action: "complete_initiative", initiative_key: ini.initiative_key })} />
              </div>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.reviewsTitle} empty={center?.renewal_reviews.length === 0} emptyLabel={labels.emptySection}>
        {center?.renewal_reviews.map((rev) => (
          <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="text-xs text-gray-500">{labels.reviewTypes[rev.review_type] ?? rev.review_type}</p>
            <p className="mt-1 text-gray-700">{rev.prompt}</p>
            {rev.status !== "completed" && center?.can_manage && (
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionBtn label={labels.completeReview} onClick={() => void postAction({ action: "complete_review", review_key: rev.review_key })} />
                <ActionBtn label={labels.scheduleReflection} variant="muted" onClick={() => void postAction({ action: "schedule_reflection_session", review_key: rev.review_key })} />
              </div>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.timelineTitle} empty={center?.timeline.length === 0} emptyLabel={labels.emptySection}>
        {center?.timeline.map((evt) => (
          <li key={evt.timeline_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.timelineTypes[evt.event_type] ?? evt.event_type} · {labels.domains[evt.domain] ?? evt.domain}</p>
            <p className="mt-1 font-medium text-gray-900">{evt.label}</p>
            {evt.summary && <p className="mt-1 text-gray-700">{evt.summary}</p>}
          </li>
        ))}
      </Section>

      <Section title={labels.milestonesTitle} empty={center?.renewal_milestones.length === 0} emptyLabel={labels.emptySection}>
        {center?.renewal_milestones.map((ms) => (
          <li key={ms.milestone_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.domains[ms.domain] ?? ms.domain}</p>
            <p className="mt-1 font-medium text-gray-900">{ms.title}</p>
            <p className="mt-1 text-gray-700">{ms.summary}</p>
          </li>
        ))}
        {center?.can_manage && (
          <li className="pt-2">
            <ActionBtn label={labels.archiveMilestone} onClick={() => void postAction({ action: "archive_renewal_milestone", title: "Renewal milestone", summary: "Renewal milestone archived via Renewal Center." })} />
          </li>
        )}
      </Section>

      <Section title={labels.snapshotsTitle} empty={center?.snapshots.length === 0} emptyLabel={labels.emptySection}>
        {center?.snapshots.map((snap) => (
          <li key={snap.snapshot_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium text-gray-900">{snap.period_label}</p>
              <span className="text-xs text-indigo-700">{labels.renewalScore}: {snap.renewal_score}</span>
            </div>
            <p className="mt-1 text-gray-700">{snap.summary}</p>
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.strategic} value={center.executive_view.strategic_evolution} />
            <ExecField label={labels.executiveFields.leadership} value={center.executive_view.leadership_development} />
            <ExecField label={labels.executiveFields.capability} value={center.executive_view.capability_readiness} />
            <ExecField label={labels.executiveFields.opportunities} value={center.executive_view.renewal_opportunities} />
          </dl>
        </section>
      )}

      <InsightSection title={labels.insightsTitle} items={center?.insights ?? []} canManage={center?.can_manage ?? false} dismissLabel={labels.dismiss} onDismiss={(key) => void postAction({ action: "dismiss_insight", insight_key: key })} />
      <RecommendationSection title={labels.recommendationsTitle} items={center?.recommendations ?? []} canManage={center?.can_manage ?? false} acceptLabel={labels.accept} dismissLabel={labels.dismiss} onAccept={(key) => void postAction({ action: "accept_recommendation", recommendation_key: key })} onDismiss={(key) => void postAction({ action: "dismiss_recommendation", recommendation_key: key })} />

      <Section title={labels.sessionsTitle} empty={center?.renewal_sessions.length === 0} emptyLabel={labels.emptySection}>
        {center?.renewal_sessions.map((sess) => (
          <li key={sess.session_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="text-xs text-gray-500">{labels.sessionTypes[sess.session_type] ?? sess.session_type}</p>
            <p className="mt-1 text-gray-700">{sess.prompt}</p>
            {sess.status !== "completed" && center?.can_manage && (
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionBtn label={labels.completeSession} onClick={() => void postAction({ action: "complete_session", session_key: sess.session_key })} />
                <ActionBtn label={labels.scheduleReflection} variant="muted" onClick={() => void postAction({ action: "schedule_reflection_session", session_key: sess.session_key })} />
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
