"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CMC_CORE_PRINCIPLE,
  CMC_PHILOSOPHY,
  CMC_VISION,
  parseCapabilityMaturityCenter,
  type CapabilityMaturityCenter,
} from "@/lib/capability-maturity-center";

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
  organizationalLearningLink: string;
  knowledgeEvolutionLink: string;
  maturityEngineLink: string;
  dashboardTitle: string;
  capabilitiesTitle: string;
  milestonesTitle: string;
  roadmapTitle: string;
  snapshotsTitle: string;
  maturityLevelsTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  reviewsTitle: string;
  emptySection: string;
  dismiss: string;
  accept: string;
  captureSnapshot: string;
  completeReview: string;
  launchInitiative: string;
  generateReport: string;
  generateSummary: string;
  humansDecide: string;
  privacyNote: string;
  currentLevel: string;
  previousLevel: string;
  score: string;
  domains: Record<string, string>;
  maturityLevels: Record<string, string>;
  priorityTypes: Record<string, string>;
  momentumLabels: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const MOMENTUM_STYLES: Record<string, string> = {
  up: "text-emerald-700",
  stable: "text-slate-600",
  down: "text-amber-700",
};

export function CapabilityMaturityCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<CapabilityMaturityCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/capability-maturity/center");
    if (res.ok) setCenter(parseCapabilityMaturityCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/capability-maturity/action", {
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
        {center?.links?.organizational_learning && <Link href={center.links.organizational_learning} className="text-slate-600 hover:underline">{labels.organizationalLearningLink}</Link>}
        {center?.links?.knowledge_evolution && <Link href={center.links.knowledge_evolution} className="text-slate-600 hover:underline">{labels.knowledgeEvolutionLink}</Link>}
        {center?.links?.capability_maturity_engine && <Link href={center.links.capability_maturity_engine} className="text-slate-600 hover:underline">{labels.maturityEngineLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {CMC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {CMC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {CMC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">{dash.overall_maturity_level} · {dash.overall_maturity_score}/100</p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.assessed} value={dash.capabilities_assessed} />
            <Metric label={labels.metrics.strongest} value={dash.strongest_count} />
            <Metric label={labels.metrics.developing} value={dash.developing_count} />
            <Metric label={labels.metrics.improving} value={dash.improving_count} />
            <Metric label={labels.metrics.opportunities} value={dash.improvement_opportunities} />
            <Metric label={labels.metrics.confidence} value={`${dash.executive_confidence}/5`} />
            <Metric label={labels.metrics.participation} value={`${dash.participation_satisfaction}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateReport} onClick={() => void postAction({ action: "generate_maturity_report" })} />
              <ActionBtn label={labels.generateSummary} variant="muted" onClick={() => void postAction({ action: "generate_executive_summary" })} />
              <ActionBtn label={labels.captureSnapshot} variant="muted" onClick={() => void postAction({ action: "capture_snapshot", label: "Executive snapshot" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.maturityLevelsTitle} empty={center?.maturity_levels.length === 0} emptyLabel={labels.emptySection}>
        {center?.maturity_levels.map((level) => (
          <li key={level.key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="font-medium text-gray-900">Level {level.level}: {labels.maturityLevels[level.key] ?? level.label}</p>
            <p className="mt-1 text-gray-700">{level.description}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.capabilitiesTitle} empty={center?.capabilities.length === 0} emptyLabel={labels.emptySection}>
        {center?.capabilities.map((cap) => (
          <li key={cap.capability_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">{labels.domains[cap.domain] ?? cap.domain}</p>
                <p className="font-medium text-gray-900">{cap.label}</p>
              </div>
              <span className={`text-xs font-medium ${MOMENTUM_STYLES[cap.momentum] ?? MOMENTUM_STYLES.stable}`}>
                {labels.momentumLabels[cap.momentum] ?? cap.momentum}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{cap.summary}</p>
            <p className="mt-2 text-xs text-gray-500">
              {labels.currentLevel}: {cap.current_level_label} ({cap.maturity_score}) · {labels.previousLevel}: {cap.previous_level_label}
            </p>
          </li>
        ))}
      </Section>

      <Section title={labels.milestonesTitle} empty={center?.milestones.length === 0} emptyLabel={labels.emptySection}>
        {center?.milestones.map((ms) => (
          <li key={ms.milestone_key} className="rounded-xl border border-teal-100 bg-teal-50/20 p-3 text-sm">
            <p className="font-medium text-gray-900">{ms.label}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.roadmapTitle} empty={center?.roadmap.length === 0} emptyLabel={labels.emptySection}>
        {center?.roadmap.map((item) => (
          <li key={item.roadmap_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="text-xs text-gray-500">{labels.priorityTypes[item.priority_type] ?? item.priority_type} · {labels.domains[item.related_domain] ?? item.related_domain}</p>
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="mt-1 text-gray-700">{item.summary}</p>
            {center?.can_manage && (
              <ActionBtn label={labels.launchInitiative} className="mt-3" onClick={() => void postAction({ action: "launch_initiative", roadmap_key: item.roadmap_key })} />
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.snapshotsTitle} empty={center?.snapshots.length === 0} emptyLabel={labels.emptySection}>
        {center?.snapshots.map((snap) => (
          <li key={snap.snapshot_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="font-medium text-gray-900">{snap.label} · {snap.overall_score}/100</p>
            <p className="mt-1 text-gray-700">{snap.summary}</p>
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.strengths} value={center.executive_view.organizational_strengths} />
            <ExecField label={labels.executiveFields.gaps} value={center.executive_view.capability_gaps} />
            <ExecField label={labels.executiveFields.momentum} value={center.executive_view.improvement_momentum} />
            <ExecField label={labels.executiveFields.readiness} value={center.executive_view.strategic_readiness} />
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
