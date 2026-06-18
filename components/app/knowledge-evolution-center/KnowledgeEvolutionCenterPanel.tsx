"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  KEC_CORE_PRINCIPLE,
  KEC_PHILOSOPHY,
  KEC_VISION,
  parseKnowledgeEvolutionCenter,
  type KnowledgeEvolutionCenter,
} from "@/lib/knowledge-evolution-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  knowledgeCenterLink: string;
  organizationalLearningLink: string;
  organizationalMemoryLink: string;
  knowledgeEngineLink: string;
  employeeKnowledgeLink: string;
  dashboardTitle: string;
  domainsTitle: string;
  assetsTitle: string;
  reviewQueueTitle: string;
  versionHistoryTitle: string;
  smeTitle: string;
  lifecycleTitle: string;
  searchTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  reviewsTitle: string;
  emptySection: string;
  dismiss: string;
  accept: string;
  scheduleReview: string;
  completeReview: string;
  markImproved: string;
  generateReport: string;
  exportSnapshot: string;
  humansDecide: string;
  privacyNote: string;
  usage: string;
  daysSinceReview: string;
  domains: Record<string, string>;
  healthLabels: Record<string, string>;
  lifecycleStages: Record<string, string>;
  reviewTypes: Record<string, string>;
  validationTypes: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const HEALTH_STYLES: Record<string, string> = {
  excellent: "border-emerald-200 bg-emerald-50",
  healthy: "border-teal-200 bg-teal-50",
  needs_review: "border-amber-200 bg-amber-50",
  critical: "border-rose-200 bg-rose-50",
};

export function KnowledgeEvolutionCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<KnowledgeEvolutionCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/knowledge-evolution/center");
    if (res.ok) setCenter(parseKnowledgeEvolutionCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/knowledge-evolution/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const dash = center?.dashboard;
  const healthStyle = HEALTH_STYLES[dash?.knowledge_health_label ?? "healthy"] ?? HEALTH_STYLES.healthy;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.knowledge_center && <Link href={center.links.knowledge_center} className="text-slate-600 hover:underline">{labels.knowledgeCenterLink}</Link>}
        {center?.links?.organizational_learning && <Link href={center.links.organizational_learning} className="text-slate-600 hover:underline">{labels.organizationalLearningLink}</Link>}
        {center?.links?.organizational_memory && <Link href={center.links.organizational_memory} className="text-slate-600 hover:underline">{labels.organizationalMemoryLink}</Link>}
        {center?.links?.knowledge_center_engine && <Link href={center.links.knowledge_center_engine} className="text-slate-600 hover:underline">{labels.knowledgeEngineLink}</Link>}
        {center?.links?.employee_knowledge && <Link href={center.links.employee_knowledge} className="text-slate-600 hover:underline">{labels.employeeKnowledgeLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {KEC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {KEC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {KEC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className={`rounded-2xl border p-5 shadow-sm ${healthStyle}`}>
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {labels.healthLabels[dash.knowledge_health_label] ?? dash.knowledge_health_label} · {dash.knowledge_health_score}/100
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.totalAssets} value={dash.total_assets} />
            <Metric label={labels.metrics.requiringReview} value={dash.articles_requiring_review} />
            <Metric label={labels.metrics.outdated} value={dash.outdated_indicators} />
            <Metric label={labels.metrics.recentlyImproved} value={dash.recently_improved} />
            <Metric label={labels.metrics.reviewCompletion} value={`${dash.review_completion_pct}%`} />
            <Metric label={labels.metrics.searchEffectiveness} value={`${dash.search_effectiveness_pct}%`} />
            <Metric label={labels.metrics.utilization} value={`${dash.utilization_rate_pct}%`} />
            <Metric label={labels.metrics.trust} value={`${dash.executive_trust_indicator}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateReport} onClick={() => void postAction({ action: "generate_knowledge_report" })} />
              <ActionBtn label={labels.exportSnapshot} variant="muted" onClick={() => void postAction({ action: "export_health_snapshot" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.domainsTitle} empty={center?.domain_metrics.length === 0} emptyLabel={labels.emptySection}>
        {center?.domain_metrics.map((m) => (
          <li key={m.metric_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">{labels.domains[m.domain] ?? m.domain}</p>
                <p className="font-medium text-gray-900">{m.label}</p>
              </div>
              <p className="font-semibold text-gray-900">{m.value_label}</p>
            </div>
          </li>
        ))}
      </Section>

      <Section title={labels.lifecycleTitle} empty={center?.knowledge_lifecycle.length === 0} emptyLabel={labels.emptySection}>
        <ol className="mt-4 flex flex-wrap gap-2">
          {center?.knowledge_lifecycle.map((stage, idx) => (
            <li key={stage.stage} className="flex items-center gap-2 text-sm">
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-800">
                {idx + 1}. {labels.lifecycleStages[stage.stage] ?? stage.label}
              </span>
              {idx < (center?.knowledge_lifecycle.length ?? 0) - 1 && <span className="text-gray-400">→</span>}
            </li>
          ))}
        </ol>
      </Section>

      <Section title={labels.assetsTitle} empty={center?.assets.length === 0} emptyLabel={labels.emptySection}>
        {center?.assets.map((asset) => (
          <li key={asset.asset_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">{labels.domains[asset.domain] ?? asset.domain}</p>
                <p className="font-medium text-gray-900">{asset.title}</p>
              </div>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                {labels.healthLabels[asset.health_status] ?? asset.health_status}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{asset.summary}</p>
            <p className="mt-1 text-xs text-gray-500">
              {labels.usage}: {asset.usage_count} · {labels.daysSinceReview}: {asset.days_since_review} · {labels.lifecycleStages[asset.lifecycle_stage] ?? asset.lifecycle_stage}
            </p>
            {center?.can_manage && (
              <ActionBtn label={labels.markImproved} className="mt-3" variant="muted" onClick={() => void postAction({ action: "mark_improved", asset_key: asset.asset_key })} />
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.reviewQueueTitle} empty={center?.review_queue.length === 0} emptyLabel={labels.emptySection}>
        {center?.review_queue.map((item) => (
          <li key={item.review_key} className="rounded-xl border border-amber-100 bg-amber-50/30 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.reviewTypes[item.review_type] ?? item.review_type}</p>
            <p className="mt-1 text-gray-800">{item.message}</p>
            {center?.can_manage && (
              <div className="mt-2 flex gap-2">
                <ActionBtn label={labels.scheduleReview} onClick={() => void postAction({ action: "schedule_review", review_key: item.review_key })} />
                <ActionBtn label={labels.completeReview} variant="muted" onClick={() => void postAction({ action: "complete_review", review_key: item.review_key, asset_key: item.asset_key })} />
              </div>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.versionHistoryTitle} empty={center?.version_history.length === 0} emptyLabel={labels.emptySection}>
        {center?.version_history.map((ver) => (
          <li key={ver.version_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="font-medium text-gray-900">{ver.version_label} · {ver.contributor_label}</p>
            <p className="mt-1 text-gray-700">{ver.change_summary}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.smeTitle} empty={center?.sme_assignments.length === 0} emptyLabel={labels.emptySection}>
        {center?.sme_assignments.map((sme) => (
          <li key={sme.assignment_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="font-medium text-gray-900">{sme.sme_label}</p>
            <p className="mt-1 text-xs text-gray-500">{labels.validationTypes[sme.validation_type] ?? sme.validation_type} · {sme.status}</p>
          </li>
        ))}
      </Section>

      {center?.search_optimization && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.searchTitle}</h2>
          <p className="mt-2 text-sm text-gray-700">{center.search_optimization.summary}</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{labels.metrics.searchEffectiveness}: {center.search_optimization.discoverability_score}/100</p>
        </section>
      )}

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.maturity} value={center.executive_view.knowledge_maturity} />
            <ExecField label={labels.executiveFields.risks} value={center.executive_view.risk_indicators} />
            <ExecField label={labels.executiveFields.validation} value={center.executive_view.validation_participation} />
            <ExecField label={labels.executiveFields.momentum} value={center.executive_view.improvement_momentum} />
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
              <ActionBtn label={labels.completeReview} className="mt-3" onClick={() => void postAction({ action: "complete_governance_review", review_key: rev.review_key })} />
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
