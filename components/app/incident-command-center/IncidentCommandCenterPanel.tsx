"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ICR_CORE_PRINCIPLE,
  ICR_PHILOSOPHY,
  ICR_VISION,
  parseIncidentCommandCenter,
  type IncidentCommandCenter,
  type IncidentEntry,
} from "@/lib/incident-command-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  operationsLink: string;
  observabilityLink: string;
  deploymentsLink: string;
  automationControlLink: string;
  executiveLink: string;
  dashboardTitle: string;
  incidentsTitle: string;
  timelineTitle: string;
  communicationsTitle: string;
  recoveryTitle: string;
  selfHealingTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  postReviewsTitle: string;
  executiveTitle: string;
  emptySection: string;
  dismiss: string;
  accept: string;
  advanceStatus: string;
  completeAction: string;
  sendCommunication: string;
  completeReview: string;
  closeIncident: string;
  generateReport: string;
  generateSummary: string;
  humansDecide: string;
  privacyNote: string;
  severityLevels: Record<string, string>;
  incidentCategories: Record<string, string>;
  incidentStatuses: Record<string, string>;
  communicationAudiences: Record<string, string>;
  healingOutcomes: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
  reviewFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const SEV_STYLES: Record<string, string> = {
  sev1: "border-rose-300 bg-rose-50",
  sev2: "border-orange-200 bg-orange-50",
  sev3: "border-amber-200 bg-amber-50",
  sev4: "border-slate-200 bg-slate-50",
  sev5: "border-indigo-100 bg-indigo-50/40",
};

export function IncidentCommandCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<IncidentCommandCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/incident-command/center");
    if (res.ok) setCenter(parseIncidentCommandCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/incident-command/action", {
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
        {center?.links?.operations && <Link href={center.links.operations} className="text-slate-600 hover:underline">{labels.operationsLink}</Link>}
        {center?.links?.observability && <Link href={center.links.observability} className="text-slate-600 hover:underline">{labels.observabilityLink}</Link>}
        {center?.links?.deployments && <Link href={center.links.deployments} className="text-slate-600 hover:underline">{labels.deploymentsLink}</Link>}
        {center?.links?.automation_control && <Link href={center.links.automation_control} className="text-slate-600 hover:underline">{labels.automationControlLink}</Link>}
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {ICR_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {ICR_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {ICR_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.active} value={dash.active_incidents} />
            <Metric label={labels.metrics.major} value={dash.major_incidents} />
            <Metric label={labels.metrics.mttr} value={`${dash.mean_time_to_recovery_minutes}m`} />
            <Metric label={labels.metrics.recoveryProgress} value={`${dash.recovery_progress_pct}%`} />
            <Metric label={labels.metrics.selfHealing} value={`${dash.self_healing_success_rate}%`} />
            <Metric label={labels.metrics.detection} value={`${dash.mean_time_to_detection_minutes}m`} />
            <Metric label={labels.metrics.acknowledgment} value={`${dash.mean_time_to_acknowledgment_minutes}m`} />
            <Metric label={labels.metrics.resilience} value={dash.operational_resilience_score} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateReport} onClick={() => void postAction({ action: "generate_incident_report" })} />
              <ActionBtn label={labels.generateSummary} variant="muted" onClick={() => void postAction({ action: "generate_executive_summary" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.incidentsTitle} empty={center?.incidents.length === 0} emptyLabel={labels.emptySection}>
        {center?.incidents.map((inc) => (
          <IncidentRow key={inc.incident_key} inc={inc} labels={labels} canManage={center?.can_manage ?? false} onAction={postAction} />
        ))}
      </Section>

      <Section title={labels.timelineTitle} empty={center?.timeline.length === 0} emptyLabel={labels.emptySection}>
        {center?.timeline.map((evt) => (
          <li key={evt.timeline_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="font-medium text-gray-900">{evt.event_label}</p>
            <p className="mt-1 text-gray-700">{evt.event_summary}</p>
            <p className="mt-1 text-xs text-gray-500">{evt.incident_key}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.recoveryTitle} empty={center?.recovery_actions.length === 0} emptyLabel={labels.emptySection}>
        {center?.recovery_actions.map((action) => (
          <li key={action.action_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-gray-800">{action.label}</p>
              <span className="text-xs text-gray-500">{action.status}</span>
            </div>
            {center?.can_manage && action.status !== "completed" && (
              <ActionBtn label={labels.completeAction} className="mt-2" onClick={() => void postAction({ action: "complete_recovery_action", action_key: action.action_key })} />
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.selfHealingTitle} empty={center?.self_healing.length === 0} emptyLabel={labels.emptySection}>
        {center?.self_healing.map((heal) => (
          <li key={heal.healing_key} className="rounded-xl border border-teal-100 bg-teal-50/30 p-3 text-sm">
            <p className="text-gray-800">{heal.message}</p>
            <p className="mt-1 text-xs text-gray-500">{labels.healingOutcomes[heal.outcome] ?? heal.outcome}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.communicationsTitle} empty={center?.communications.length === 0} emptyLabel={labels.emptySection}>
        {center?.communications.map((com) => (
          <li key={com.communication_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900">{com.title}</p>
                <p className="mt-1 text-xs text-gray-500">{labels.communicationAudiences[com.audience] ?? com.audience} · {com.status}</p>
                <p className="mt-2 text-gray-700">{com.content}</p>
              </div>
            </div>
            {center?.can_manage && com.status === "draft" && (
              <ActionBtn label={labels.sendCommunication} className="mt-3" onClick={() => void postAction({ action: "send_communication", communication_key: com.communication_key })} />
            )}
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.major} value={String(center.executive_view.active_major_incidents)} />
            <ExecField label={labels.executiveFields.impact} value={center.executive_view.business_impact_summary} />
            <ExecField label={labels.executiveFields.confidence} value={center.executive_view.recovery_confidence} />
            <ExecField label={labels.executiveFields.strategy} value={center.executive_view.strategic_implication} />
          </dl>
        </section>
      )}

      <InsightSection title={labels.insightsTitle} items={center?.insights ?? []} canManage={center?.can_manage ?? false} dismissLabel={labels.dismiss} onDismiss={(key) => void postAction({ action: "dismiss_insight", insight_key: key })} />
      <RecommendationSection title={labels.recommendationsTitle} items={center?.recommendations ?? []} canManage={center?.can_manage ?? false} acceptLabel={labels.accept} dismissLabel={labels.dismiss} onAccept={(key) => void postAction({ action: "accept_recommendation", recommendation_key: key })} onDismiss={(key) => void postAction({ action: "dismiss_recommendation", recommendation_key: key })} />

      <Section title={labels.postReviewsTitle} empty={center?.post_reviews.length === 0} emptyLabel={labels.emptySection}>
        {center?.post_reviews.map((rev) => (
          <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="font-medium text-gray-900">{rev.incident_key}</p>
            <dl className="mt-3 space-y-2">
              <ReviewField label={labels.reviewFields.what} value={rev.what_happened} />
              <ReviewField label={labels.reviewFields.causes} value={rev.root_causes} />
              <ReviewField label={labels.reviewFields.recovery} value={rev.recovery_effectiveness} />
              <ReviewField label={labels.reviewFields.lessons} value={rev.lessons_learned} />
              <ReviewField label={labels.reviewFields.improvements} value={rev.improvements_required} />
            </dl>
            {rev.status !== "completed" && center?.can_manage && (
              <ActionBtn label={labels.completeReview} className="mt-3" onClick={() => void postAction({ action: "complete_post_review", review_key: rev.review_key })} />
            )}
          </li>
        ))}
      </Section>

      {center?.privacy_note && <p className="text-xs text-gray-500">{labels.privacyNote}: {center.privacy_note}</p>}
    </div>
  );
}

function IncidentRow({ inc, labels, canManage, onAction }: { inc: IncidentEntry; labels: PanelLabels; canManage: boolean; onAction: (p: Record<string, unknown>) => Promise<void> }) {
  return (
    <li className={`rounded-xl border p-4 text-sm ${SEV_STYLES[inc.severity] ?? SEV_STYLES.sev3}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900">{inc.title}</p>
          <p className="mt-1 text-gray-700">{inc.summary}</p>
          <p className="mt-2 text-xs text-gray-500">
            {labels.severityLevels[inc.severity] ?? inc.severity} · {labels.incidentCategories[inc.category] ?? inc.category} · {labels.incidentStatuses[inc.status] ?? inc.status}
          </p>
          <p className="mt-1 text-xs text-gray-600">Owner: {inc.owner}</p>
          {inc.impact_summary && <p className="mt-2 text-gray-700">{inc.impact_summary}</p>}
        </div>
      </div>
      {canManage && inc.status !== "closed" && (
        <div className="mt-3 flex flex-wrap gap-2">
          <ActionBtn label={labels.advanceStatus} onClick={() => void onAction({ action: "advance_status", incident_key: inc.incident_key })} />
          {inc.status === "resolved" && (
            <ActionBtn label={labels.closeIncident} variant="muted" onClick={() => void onAction({ action: "close_incident", incident_key: inc.incident_key })} />
          )}
        </div>
      )}
    </li>
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

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-gray-800">{value}</dd>
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
