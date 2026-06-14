"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  DPL_CORE_PRINCIPLE,
  DPL_PHILOSOPHY,
  DPL_VISION,
  parseDeploymentGovernanceCenter,
  type DeploymentEntry,
  type DeploymentGovernanceCenter,
} from "@/lib/deployment-governance-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  operationsLink: string;
  databaseGovernanceLink: string;
  automationControlLink: string;
  updatesLink: string;
  executiveLink: string;
  dashboardTitle: string;
  deploymentsTitle: string;
  checklistTitle: string;
  postValidationTitle: string;
  rollbackTitle: string;
  approvalsTitle: string;
  releaseNotesTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  reviewsTitle: string;
  emptySection: string;
  healthScore: string;
  productionVersion: string;
  dismiss: string;
  accept: string;
  approve: string;
  advance: string;
  passCheck: string;
  validate: string;
  completeReview: string;
  generateReport: string;
  rollbackReview: string;
  humansDecide: string;
  privacyNote: string;
  deploymentTypes: Record<string, string>;
  deploymentStatuses: Record<string, string>;
  pipelineStages: Record<string, string>;
  healthBands: Record<string, string>;
  approvalLevels: Record<string, string>;
  metrics: Record<string, string>;
};

type Props = { labels: PanelLabels };

const BAND_STYLES: Record<string, string> = {
  excellent: "bg-emerald-100 text-emerald-900",
  healthy: "bg-teal-100 text-teal-900",
  needs_attention: "bg-amber-100 text-amber-900",
  critical: "bg-rose-100 text-rose-900",
};

export function DeploymentGovernanceCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<DeploymentGovernanceCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/deployment-governance/center");
    if (res.ok) setCenter(parseDeploymentGovernanceCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/deployment-governance/action", {
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
        {center?.links?.database_governance && <Link href={center.links.database_governance} className="text-slate-600 hover:underline">{labels.databaseGovernanceLink}</Link>}
        {center?.links?.automation_control && <Link href={center.links.automation_control} className="text-slate-600 hover:underline">{labels.automationControlLink}</Link>}
        {center?.links?.updates && <Link href={center.links.updates} className="text-slate-600 hover:underline">{labels.updatesLink}</Link>}
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {DPL_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {DPL_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {DPL_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.productionVersion}: <span className="font-medium text-gray-900">{dash.current_production_version}</span></p>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">{labels.healthScore}</p>
              <p className="text-3xl font-bold text-gray-900">{dash.deployment_health_score}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${BAND_STYLES[dash.deployment_health_band] ?? BAND_STYLES.healthy}`}>
                {labels.healthBands[dash.deployment_health_band] ?? dash.deployment_health_band}
              </span>
            </div>
          </div>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.pending} value={dash.pending_deployments} />
            <Metric label={labels.metrics.failed} value={dash.failed_deployments} />
            <Metric label={labels.metrics.releases} value={dash.recent_releases} />
            <Metric label={labels.metrics.rollbackReady} value={dash.rollback_ready_count} />
            <Metric label={labels.metrics.successRate} value={`${dash.deployment_success_rate}%`} />
            <Metric label={labels.metrics.validationRate} value={`${dash.validation_completion_rate}%`} />
            <Metric label={labels.metrics.mttr} value={`${dash.mean_time_to_recovery_hours}h`} />
            <Metric label={labels.metrics.confidence} value={`${dash.operational_confidence}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4">
              <ActionBtn label={labels.generateReport} onClick={() => void postAction({ action: "generate_report" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.deploymentsTitle} empty={center?.deployments.length === 0} emptyLabel={labels.emptySection}>
        {center?.deployments.map((dep) => (
          <DeploymentRow key={dep.deployment_key} dep={dep} labels={labels} canManage={center?.can_manage ?? false} onAction={postAction} />
        ))}
      </Section>

      <Section title={labels.checklistTitle} empty={center?.checklist_items.length === 0} emptyLabel={labels.emptySection}>
        {center?.checklist_items.map((item) => (
          <li key={item.checklist_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className={item.is_critical ? "font-medium text-gray-900" : "text-gray-800"}>{item.label}</span>
              <span className="text-xs text-gray-500">{item.status}</span>
            </div>
            {center?.can_manage && item.status === "pending" && (
              <ActionBtn label={labels.passCheck} className="mt-2" onClick={() => void postAction({ action: "mark_checklist_passed", checklist_key: item.checklist_key })} />
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.approvalsTitle} empty={center?.approvals.length === 0} emptyLabel={labels.emptySection}>
        {center?.approvals.map((ap) => (
          <li key={ap.approval_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="font-medium text-gray-900">{labels.approvalLevels[String(ap.approval_level)] ?? ap.approver_role}</p>
            <p className="mt-1 text-gray-600">{ap.approver_role} · {ap.status}</p>
            {center?.can_manage && ap.status === "pending" && (
              <div className="mt-2 flex gap-2">
                <ActionBtn label={labels.approve} onClick={() => void postAction({ action: "approve_deployment", approval_key: ap.approval_key })} />
              </div>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.rollbackTitle} empty={center?.rollback_points.length === 0} emptyLabel={labels.emptySection}>
        {center?.rollback_points.map((rb) => (
          <li key={rb.rollback_key} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-sm">
            <p className="font-medium text-gray-900">{rb.version_label}</p>
            <p className="mt-1 text-gray-700">{rb.recovery_notes}</p>
            {center?.can_manage && (
              <ActionBtn label={labels.rollbackReview} className="mt-2" variant="muted" onClick={() => void postAction({ action: "request_rollback_review", rollback_key: rb.rollback_key })} />
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.postValidationTitle} empty={center?.post_validations.length === 0} emptyLabel={labels.emptySection}>
        {center?.post_validations.map((v) => (
          <li key={v.validation_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-gray-800">{v.label}</p>
            {center?.can_manage && v.status === "pending" && (
              <ActionBtn label={labels.validate} className="mt-2" onClick={() => void postAction({ action: "run_post_validation", validation_key: v.validation_key })} />
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.releaseNotesTitle} empty={center?.release_notes.length === 0} emptyLabel={labels.emptySection}>
        {center?.release_notes.map((note) => (
          <li key={note.note_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="font-medium text-gray-900">{note.title}</p>
            <p className="mt-1 text-xs text-gray-500">{note.audience}</p>
            <p className="mt-2 text-gray-700">{note.content}</p>
          </li>
        ))}
      </Section>

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

function DeploymentRow({ dep, labels, canManage, onAction }: { dep: DeploymentEntry; labels: PanelLabels; canManage: boolean; onAction: (p: Record<string, unknown>) => Promise<void> }) {
  return (
    <li className="rounded-xl border border-gray-100 p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900">{dep.version_label}</p>
          <p className="mt-1 text-gray-700">{dep.summary}</p>
          <p className="mt-1 text-xs text-gray-500">
            {labels.deploymentTypes[dep.deployment_type] ?? dep.deployment_type} · {labels.pipelineStages[dep.pipeline_stage] ?? dep.pipeline_stage}
          </p>
        </div>
        <span className="text-xs font-medium text-gray-600">{labels.deploymentStatuses[dep.status] ?? dep.status}</span>
      </div>
      {canManage && dep.status !== "archived" && dep.pipeline_stage !== "archived" && (
        <ActionBtn label={labels.advance} className="mt-3" onClick={() => void onAction({ action: "advance_pipeline", deployment_key: dep.deployment_key })} />
      )}
    </li>
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
