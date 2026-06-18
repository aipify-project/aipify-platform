"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  OWC_CORE_PRINCIPLE,
  OWC_PHILOSOPHY,
  OWC_VISION,
  parseOrganizationalWisdomCenter,
  type OrganizationalWisdomCenter,
} from "@/lib/organizational-wisdom-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  organizationalMemoryLink: string;
  organizationalLearningLink: string;
  knowledgeEvolutionLink: string;
  strategicIntelligenceLink: string;
  decisionSupportLink: string;
  purposeValuesLink: string;
  dashboardTitle: string;
  lessonsTitle: string;
  reflectionsTitle: string;
  valuesTitle: string;
  patternsTitle: string;
  synthesisTitle: string;
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
  scheduleReview: string;
  generateReflection: string;
  generateSummary: string;
  exportInsights: string;
  humansDecide: string;
  privacyNote: string;
  wisdomScore: string;
  domains: Record<string, string>;
  healthLabels: Record<string, string>;
  timelineTypes: Record<string, string>;
  reviewTypes: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const HEALTH_STYLES: Record<string, string> = {
  exceptional: "border-emerald-200 bg-emerald-50",
  strong: "border-teal-200 bg-teal-50",
  maturing: "border-slate-200 bg-slate-50",
  developing: "border-amber-200 bg-amber-50",
  emerging: "border-rose-200 bg-rose-50",
};

export function OrganizationalWisdomCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalWisdomCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizational-wisdom/center");
    if (res.ok) setCenter(parseOrganizationalWisdomCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/organizational-wisdom/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const dash = center?.dashboard;
  const healthStyle = HEALTH_STYLES[dash?.wisdom_health_label ?? "maturing"] ?? HEALTH_STYLES.maturing;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
        {center?.links?.organizational_memory && <Link href={center.links.organizational_memory} className="text-slate-600 hover:underline">{labels.organizationalMemoryLink}</Link>}
        {center?.links?.organizational_learning && <Link href={center.links.organizational_learning} className="text-slate-600 hover:underline">{labels.organizationalLearningLink}</Link>}
        {center?.links?.knowledge_evolution && <Link href={center.links.knowledge_evolution} className="text-slate-600 hover:underline">{labels.knowledgeEvolutionLink}</Link>}
        {center?.links?.strategic_intelligence && <Link href={center.links.strategic_intelligence} className="text-slate-600 hover:underline">{labels.strategicIntelligenceLink}</Link>}
        {center?.links?.decision_support && <Link href={center.links.decision_support} className="text-slate-600 hover:underline">{labels.decisionSupportLink}</Link>}
        {center?.links?.purpose_values && <Link href={center.links.purpose_values} className="text-slate-600 hover:underline">{labels.purposeValuesLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {OWC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {OWC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {OWC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className={`rounded-2xl border p-5 shadow-sm ${healthStyle}`}>
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {labels.healthLabels[dash.wisdom_health_label] ?? dash.wisdom_health_label} · {labels.wisdomScore}: {dash.wisdom_score}/100
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.insights} value={dash.insights_generated} />
            <Metric label={labels.metrics.lessons} value={dash.lessons_integrated} />
            <Metric label={labels.metrics.reflection} value={`${dash.reflection_participation_pct}%`} />
            <Metric label={labels.metrics.patterns} value={dash.historical_patterns} />
            <Metric label={labels.metrics.learning} value={`${dash.executive_learning_trend_pct}%`} />
            <Metric label={labels.metrics.quality} value={`${dash.decision_quality_satisfaction}/5`} />
            <Metric label={labels.metrics.confidence} value={`${dash.leadership_confidence}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateReflection} onClick={() => void postAction({ action: "generate_reflection_report" })} />
              <ActionBtn label={labels.generateSummary} variant="muted" onClick={() => void postAction({ action: "generate_executive_summary" })} />
              <ActionBtn label={labels.exportInsights} variant="muted" onClick={() => void postAction({ action: "export_historical_insights", period_label: "Current period" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.synthesisTitle} empty={center?.wisdom_synthesis.length === 0} emptyLabel={labels.emptySection}>
        {center?.wisdom_synthesis.map((src) => (
          <li key={src.source_key} className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-3 text-sm">
            {src.route_path ? (
              <Link href={src.route_path} className="font-medium text-indigo-700 hover:underline">{src.source_label}</Link>
            ) : (
              <p className="font-medium text-gray-900">{src.source_label}</p>
            )}
            <p className="mt-1 text-gray-700">{src.summary}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.lessonsTitle} empty={center?.lessons.length === 0} emptyLabel={labels.emptySection}>
        {center?.lessons.map((les) => (
          <li key={les.lesson_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="text-xs text-gray-500">{labels.domains[les.domain] ?? les.domain}</p>
            <p className="mt-1 font-medium text-gray-900">{les.title}</p>
            <p className="mt-2 text-gray-700">{les.summary}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.reflectionsTitle} empty={center?.reflection_prompts.length === 0} emptyLabel={labels.emptySection}>
        {center?.reflection_prompts.map((ref) => (
          <li key={ref.reflection_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.domains[ref.domain] ?? ref.domain}</p>
            <p className="mt-1 text-gray-800">{ref.prompt}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.valuesTitle} empty={center?.values_alignment.length === 0} emptyLabel={labels.emptySection}>
        {center?.values_alignment.map((val) => (
          <li key={val.value_key} className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-3 text-sm">
            <p className="font-medium text-gray-900">{val.label}</p>
            <p className="mt-1 text-gray-700">{val.guidance}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.patternsTitle} empty={center?.historical_patterns.length === 0} emptyLabel={labels.emptySection}>
        {center?.historical_patterns.map((pat) => (
          <li key={pat.pattern_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.domains[pat.domain] ?? pat.domain}</p>
            <p className="mt-1 font-medium text-gray-900">{pat.label}</p>
            <p className="mt-1 text-gray-700">{pat.summary}</p>
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
              <span className="text-xs text-indigo-700">{labels.wisdomScore}: {snap.wisdom_score}</span>
            </div>
            <p className="mt-1 text-gray-700">{snap.summary}</p>
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.themes} value={center.executive_view.emerging_themes} />
            <ExecField label={labels.executiveFields.learning} value={center.executive_view.learning_patterns} />
            <ExecField label={labels.executiveFields.lessons} value={center.executive_view.lessons_revisited} />
            <ExecField label={labels.executiveFields.indicators} value={center.executive_view.wisdom_indicators} />
          </dl>
        </section>
      )}

      <InsightSection title={labels.insightsTitle} items={center?.insights ?? []} canManage={center?.can_manage ?? false} dismissLabel={labels.dismiss} onDismiss={(key) => void postAction({ action: "dismiss_insight", insight_key: key })} />
      <RecommendationSection title={labels.recommendationsTitle} items={center?.recommendations ?? []} canManage={center?.can_manage ?? false} acceptLabel={labels.accept} dismissLabel={labels.dismiss} onAccept={(key) => void postAction({ action: "accept_recommendation", recommendation_key: key })} onDismiss={(key) => void postAction({ action: "dismiss_recommendation", recommendation_key: key })} />

      <Section title={labels.reviewsTitle} empty={center?.wisdom_reviews.length === 0} emptyLabel={labels.emptySection}>
        {center?.wisdom_reviews.map((rev) => (
          <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="text-xs text-gray-500">{labels.reviewTypes[rev.review_type] ?? rev.review_type}</p>
            <p className="mt-1 text-gray-700">{rev.prompt}</p>
            {rev.status !== "completed" && center?.can_manage && (
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionBtn label={labels.completeReview} onClick={() => void postAction({ action: "complete_review", review_key: rev.review_key })} />
                <ActionBtn label={labels.scheduleReview} variant="muted" onClick={() => void postAction({ action: "schedule_wisdom_review", review_key: rev.review_key })} />
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
