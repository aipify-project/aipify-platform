"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  EEC_CORE_PRINCIPLE,
  EEC_PHILOSOPHY,
  EEC_VISION,
  parseExecutionExcellenceCenter,
  type ExecutionExcellenceCenter,
} from "@/lib/execution-excellence-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  capabilityMaturityLink: string;
  changeManagementLink: string;
  organizationalHealthLink: string;
  continuousImprovementLink: string;
  goalsLink: string;
  dashboardTitle: string;
  initiativesTitle: string;
  dependenciesTitle: string;
  milestonesTitle: string;
  risksTitle: string;
  workflowTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  reviewsTitle: string;
  emptySection: string;
  dismiss: string;
  accept: string;
  completeReview: string;
  achieveMilestone: string;
  generateSummary: string;
  generateReport: string;
  humansDecide: string;
  privacyNote: string;
  owner: string;
  sponsor: string;
  progress: string;
  domains: Record<string, string>;
  healthLabels: Record<string, string>;
  riskStatuses: Record<string, string>;
  workflowStages: Record<string, string>;
  dependencyTypes: Record<string, string>;
  milestoneStatuses: Record<string, string>;
  riskTypes: Record<string, string>;
  reviewTypes: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const HEALTH_STYLES: Record<string, string> = {
  exceptional: "border-emerald-200 bg-emerald-50",
  strong: "border-teal-200 bg-teal-50",
  stable: "border-slate-200 bg-slate-50",
  needs_attention: "border-amber-200 bg-amber-50",
  critical: "border-rose-200 bg-rose-50",
};

const RISK_STYLES: Record<string, string> = {
  on_track: "text-emerald-700",
  stable: "text-slate-600",
  at_risk: "text-amber-700",
  stalled: "text-orange-700",
  critical: "text-rose-700",
};

export function ExecutionExcellenceCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<ExecutionExcellenceCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/execution-excellence/center");
    if (res.ok) setCenter(parseExecutionExcellenceCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/execution-excellence/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const dash = center?.dashboard;
  const healthStyle = HEALTH_STYLES[dash?.execution_health_label ?? "stable"] ?? HEALTH_STYLES.stable;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
        {center?.links?.capability_maturity && <Link href={center.links.capability_maturity} className="text-slate-600 hover:underline">{labels.capabilityMaturityLink}</Link>}
        {center?.links?.change_management && <Link href={center.links.change_management} className="text-slate-600 hover:underline">{labels.changeManagementLink}</Link>}
        {center?.links?.organizational_health && <Link href={center.links.organizational_health} className="text-slate-600 hover:underline">{labels.organizationalHealthLink}</Link>}
        {center?.links?.continuous_improvement && <Link href={center.links.continuous_improvement} className="text-slate-600 hover:underline">{labels.continuousImprovementLink}</Link>}
        {center?.links?.goals_okr && <Link href={center.links.goals_okr} className="text-slate-600 hover:underline">{labels.goalsLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {EEC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {EEC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {EEC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className={`rounded-2xl border p-5 shadow-sm ${healthStyle}`}>
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {labels.healthLabels[dash.execution_health_label] ?? dash.execution_health_label} · {dash.execution_health_score}/100
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.inProgress} value={dash.initiatives_in_progress} />
            <Metric label={labels.metrics.atRisk} value={dash.objectives_at_risk} />
            <Metric label={labels.metrics.momentum} value={`${dash.execution_momentum_pct}%`} />
            <Metric label={labels.metrics.milestones} value={dash.milestones_achieved} />
            <Metric label={labels.metrics.dependencies} value={dash.dependency_count} />
            <Metric label={labels.metrics.completion} value={`${dash.completion_trend_pct}%`} />
            <Metric label={labels.metrics.reviews} value={`${dash.review_consistency_pct}%`} />
            <Metric label={labels.metrics.confidence} value={`${dash.leadership_confidence}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateSummary} onClick={() => void postAction({ action: "generate_execution_summary" })} />
              <ActionBtn label={labels.generateReport} variant="muted" onClick={() => void postAction({ action: "generate_initiative_report" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.workflowTitle} empty={center?.execution_workflow.length === 0} emptyLabel={labels.emptySection}>
        <ol className="mt-4 flex flex-wrap gap-2">
          {center?.execution_workflow.map((stage, idx) => (
            <li key={stage.stage} className="flex items-center gap-2 text-sm">
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-800">
                {idx + 1}. {labels.workflowStages[stage.stage] ?? stage.label}
              </span>
              {idx < (center?.execution_workflow.length ?? 0) - 1 && <span className="text-gray-400">→</span>}
            </li>
          ))}
        </ol>
      </Section>

      <Section title={labels.initiativesTitle} empty={center?.initiatives.length === 0} emptyLabel={labels.emptySection}>
        {center?.initiatives.map((init) => (
          <li key={init.initiative_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">{labels.domains[init.domain] ?? init.domain}</p>
                <p className="font-medium text-gray-900">{init.title}</p>
              </div>
              <span className={`text-xs font-medium ${RISK_STYLES[init.risk_status] ?? RISK_STYLES.stable}`}>
                {labels.riskStatuses[init.risk_status] ?? init.risk_status}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{init.summary}</p>
            <p className="mt-2 text-xs text-gray-500">
              {labels.owner}: {init.owner_label} · {labels.sponsor}: {init.sponsor_label} · {labels.progress}: {init.progress_pct}%
            </p>
          </li>
        ))}
      </Section>

      <Section title={labels.dependenciesTitle} empty={center?.dependencies.length === 0} emptyLabel={labels.emptySection}>
        {center?.dependencies.map((dep) => (
          <li key={dep.dependency_key} className="rounded-xl border border-amber-100 bg-amber-50/30 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.dependencyTypes[dep.dependency_type] ?? dep.dependency_type}</p>
            <p className="mt-1 text-gray-800">{dep.message}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.milestonesTitle} empty={center?.milestones.length === 0} emptyLabel={labels.emptySection}>
        {center?.milestones.map((ms) => (
          <li key={ms.milestone_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium text-gray-900">{ms.label}</p>
              <span className="text-xs text-gray-500">{labels.milestoneStatuses[ms.milestone_status] ?? ms.milestone_status}</span>
            </div>
            {center?.can_manage && ms.milestone_status !== "achieved" && (
              <ActionBtn label={labels.achieveMilestone} className="mt-2" variant="muted" onClick={() => void postAction({ action: "achieve_milestone", milestone_key: ms.milestone_key })} />
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.risksTitle} empty={center?.execution_risks.length === 0} emptyLabel={labels.emptySection}>
        {center?.execution_risks.map((risk) => (
          <li key={risk.risk_key} className="rounded-xl border border-rose-100 bg-rose-50/20 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.riskTypes[risk.risk_type] ?? risk.risk_type}</p>
            <p className="mt-1 text-gray-800">{risk.message}</p>
            {center?.can_manage && (
              <button type="button" className="mt-2 text-xs text-slate-600 hover:underline" onClick={() => void postAction({ action: "dismiss_risk", risk_key: risk.risk_key })}>{labels.dismiss}</button>
            )}
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.capacity} value={center.executive_view.execution_capacity} />
            <ExecField label={labels.executiveFields.progress} value={center.executive_view.strategic_progress} />
            <ExecField label={labels.executiveFields.confidence} value={center.executive_view.initiative_confidence} />
            <ExecField label={labels.executiveFields.focus} value={center.executive_view.leadership_focus} />
          </dl>
        </section>
      )}

      <InsightSection title={labels.insightsTitle} items={center?.insights ?? []} canManage={center?.can_manage ?? false} dismissLabel={labels.dismiss} onDismiss={(key) => void postAction({ action: "dismiss_insight", insight_key: key })} />
      <RecommendationSection title={labels.recommendationsTitle} items={center?.recommendations ?? []} canManage={center?.can_manage ?? false} acceptLabel={labels.accept} dismissLabel={labels.dismiss} onAccept={(key) => void postAction({ action: "accept_recommendation", recommendation_key: key })} onDismiss={(key) => void postAction({ action: "dismiss_recommendation", recommendation_key: key })} />

      <Section title={labels.reviewsTitle} empty={center?.execution_reviews.length === 0} emptyLabel={labels.emptySection}>
        {center?.execution_reviews.map((rev) => (
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
