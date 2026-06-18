"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CMG_CORE_PRINCIPLE,
  CMG_PHILOSOPHY,
  CMG_VISION,
  parseChangeManagementCenter,
  type ChangeInitiative,
  type ChangeManagementCenter,
} from "@/lib/change-management-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  organizationalHealthLink: string;
  continuousImprovementLink: string;
  organizationalResilienceLink: string;
  decisionSupportLink: string;
  dashboardTitle: string;
  initiativesTitle: string;
  stakeholdersTitle: string;
  communicationsTitle: string;
  trainingTitle: string;
  adoptionTitle: string;
  feedbackTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  reviewsTitle: string;
  emptySection: string;
  dismiss: string;
  accept: string;
  advanceWorkflow: string;
  sendCommunication: string;
  completeTraining: string;
  reviewFeedback: string;
  completeReview: string;
  generatePlan: string;
  generateReport: string;
  humansDecide: string;
  privacyNote: string;
  readinessBands: Record<string, string>;
  changeCategories: Record<string, string>;
  workflowStages: Record<string, string>;
  stakeholderRoles: Record<string, string>;
  communicationAudiences: Record<string, string>;
  feedbackTypes: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const READINESS_STYLES: Record<string, string> = {
  ready: "bg-emerald-100 text-emerald-900",
  mostly_ready: "bg-teal-100 text-teal-900",
  attention_needed: "bg-amber-100 text-amber-900",
  not_ready: "bg-rose-100 text-rose-900",
};

export function ChangeManagementCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<ChangeManagementCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/change-management/center");
    if (res.ok) setCenter(parseChangeManagementCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/change-management/action", {
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
        {center?.links?.organizational_health && <Link href={center.links.organizational_health} className="text-slate-600 hover:underline">{labels.organizationalHealthLink}</Link>}
        {center?.links?.continuous_improvement && <Link href={center.links.continuous_improvement} className="text-slate-600 hover:underline">{labels.continuousImprovementLink}</Link>}
        {center?.links?.organizational_resilience && <Link href={center.links.organizational_resilience} className="text-slate-600 hover:underline">{labels.organizationalResilienceLink}</Link>}
        {center?.links?.decision_support && <Link href={center.links.decision_support} className="text-slate-600 hover:underline">{labels.decisionSupportLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {CMG_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {CMG_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {CMG_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.active} value={dash.active_initiatives} />
            <Metric label={labels.metrics.adoption} value={`${dash.average_adoption_pct}%`} />
            <Metric label={labels.metrics.readiness} value={dash.average_readiness_score} />
            <Metric label={labels.metrics.training} value={`${dash.training_completion_pct}%`} />
            <Metric label={labels.metrics.communications} value={dash.communications_sent} />
            <Metric label={labels.metrics.engagement} value={`${dash.stakeholder_engagement_score}/5`} />
            <Metric label={labels.metrics.confidence} value={`${dash.employee_confidence_score}/5`} />
            <Metric label={labels.metrics.success} value={`${dash.initiative_success_rate}%`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generatePlan} onClick={() => void postAction({ action: "generate_communication_plan" })} />
              <ActionBtn label={labels.generateReport} variant="muted" onClick={() => void postAction({ action: "generate_adoption_report" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.initiativesTitle} empty={center?.initiatives.length === 0} emptyLabel={labels.emptySection}>
        {center?.initiatives.map((init) => (
          <InitiativeRow key={init.initiative_key} init={init} labels={labels} canManage={center?.can_manage ?? false} onAction={postAction} />
        ))}
      </Section>

      <Section title={labels.stakeholdersTitle} empty={center?.stakeholders.length === 0} emptyLabel={labels.emptySection}>
        {center?.stakeholders.map((st) => (
          <li key={st.stakeholder_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="font-medium text-gray-900">{st.label}</p>
            <p className="mt-1 text-xs text-gray-500">{labels.stakeholderRoles[st.role_type] ?? st.role_type} · {st.engagement_level}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.communicationsTitle} empty={center?.communications.length === 0} emptyLabel={labels.emptySection}>
        {center?.communications.map((com) => (
          <li key={com.communication_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="font-medium text-gray-900">{com.title}</p>
            <p className="mt-1 text-xs text-gray-500">{labels.communicationAudiences[com.audience] ?? com.audience} · {com.status}</p>
            <p className="mt-2 text-gray-700">{com.content}</p>
            {center?.can_manage && com.status === "draft" && (
              <ActionBtn label={labels.sendCommunication} className="mt-3" onClick={() => void postAction({ action: "send_communication", communication_key: com.communication_key })} />
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.trainingTitle} empty={center?.training.length === 0} emptyLabel={labels.emptySection}>
        {center?.training.map((tr) => (
          <li key={tr.training_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-gray-800">{tr.label}</p>
              <p className="text-sm font-medium text-gray-900">{tr.completion_pct}%</p>
            </div>
            {center?.can_manage && tr.status !== "completed" && (
              <ActionBtn label={labels.completeTraining} className="mt-2" onClick={() => void postAction({ action: "complete_training", training_key: tr.training_key })} />
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.adoptionTitle} empty={center?.adoption_metrics.length === 0} emptyLabel={labels.emptySection}>
        {center?.adoption_metrics.map((m) => (
          <li key={m.metric_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-gray-800">{m.label}</p>
              <p className="font-semibold text-gray-900">{m.value_label}</p>
            </div>
          </li>
        ))}
      </Section>

      <Section title={labels.feedbackTitle} empty={center?.feedback.length === 0} emptyLabel={labels.emptySection}>
        {center?.feedback.map((fb) => (
          <li key={fb.feedback_key} className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.feedbackTypes[fb.feedback_type] ?? fb.feedback_type}</p>
            <p className="mt-1 text-gray-800">{fb.message}</p>
            {center?.can_manage && fb.status === "open" && (
              <ActionBtn label={labels.reviewFeedback} className="mt-2" variant="muted" onClick={() => void postAction({ action: "review_feedback", feedback_key: fb.feedback_key })} />
            )}
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.adoption} value={center.executive_view.adoption_confidence} />
            <ExecField label={labels.executiveFields.sentiment} value={center.executive_view.stakeholder_sentiment} />
            <ExecField label={labels.executiveFields.actions} value={center.executive_view.leadership_actions} />
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

function InitiativeRow({ init, labels, canManage, onAction }: { init: ChangeInitiative; labels: PanelLabels; canManage: boolean; onAction: (p: Record<string, unknown>) => Promise<void> }) {
  return (
    <li className="rounded-xl border border-gray-100 p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900">{init.title}</p>
          <p className="mt-1 text-gray-700">{init.summary}</p>
          <p className="mt-2 text-xs text-gray-500">
            {labels.changeCategories[init.category] ?? init.category} · {labels.workflowStages[init.workflow_stage] ?? init.workflow_stage}
          </p>
          <p className="mt-1 text-xs text-gray-600">Sponsor: {init.sponsor} · Owner: {init.owner}</p>
        </div>
        <div className="text-right">
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${READINESS_STYLES[init.readiness_band] ?? READINESS_STYLES.mostly_ready}`}>
            {labels.readinessBands[init.readiness_band] ?? init.readiness_band}
          </span>
          <p className="mt-1 text-sm font-semibold text-gray-900">{init.adoption_pct}% adoption</p>
        </div>
      </div>
      {canManage && init.status === "active" && init.workflow_stage !== "lessons_captured" && (
        <ActionBtn label={labels.advanceWorkflow} className="mt-3" onClick={() => void onAction({ action: "advance_workflow", initiative_key: init.initiative_key })} />
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
