"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  OLC_CORE_PRINCIPLE,
  OLC_PHILOSOPHY,
  OLC_VISION,
  parseOrganizationalLearningCenter,
  type OrganizationalLearningCenter,
} from "@/lib/organizational-learning-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  knowledgeCenterLink: string;
  organizationalMemoryLink: string;
  learningReviewLink: string;
  knowledgeEngineLink: string;
  continuousImprovementLink: string;
  dashboardTitle: string;
  domainsTitle: string;
  lessonsTitle: string;
  patternsTitle: string;
  bestPracticesTitle: string;
  validationTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  reviewsTitle: string;
  emptySection: string;
  dismiss: string;
  accept: string;
  publishLesson: string;
  completeReview: string;
  generateSummary: string;
  generateReport: string;
  humansDecide: string;
  privacyNote: string;
  whatHappened: string;
  whatWorked: string;
  whatDidNotWork: string;
  whatShouldChange: string;
  whatShouldRemain: string;
  validationStage: string;
  domains: Record<string, string>;
  patternTypes: Record<string, string>;
  practiceTypes: Record<string, string>;
  healthLabels: Record<string, string>;
  validationStages: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const HEALTH_STYLES: Record<string, string> = {
  excellent: "border-emerald-200 bg-emerald-50",
  healthy: "border-teal-200 bg-teal-50",
  developing: "border-amber-200 bg-amber-50",
  needs_attention: "border-orange-200 bg-orange-50",
};

export function OrganizationalLearningCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalLearningCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizational-learning/center");
    if (res.ok) setCenter(parseOrganizationalLearningCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/organizational-learning/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const dash = center?.dashboard;
  const healthStyle = HEALTH_STYLES[dash?.learning_health_label ?? "developing"] ?? HEALTH_STYLES.developing;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.knowledge_center && <Link href={center.links.knowledge_center} className="text-slate-600 hover:underline">{labels.knowledgeCenterLink}</Link>}
        {center?.links?.organizational_memory && <Link href={center.links.organizational_memory} className="text-slate-600 hover:underline">{labels.organizationalMemoryLink}</Link>}
        {center?.links?.learning_review && <Link href={center.links.learning_review} className="text-slate-600 hover:underline">{labels.learningReviewLink}</Link>}
        {center?.links?.knowledge_center_engine && <Link href={center.links.knowledge_center_engine} className="text-slate-600 hover:underline">{labels.knowledgeEngineLink}</Link>}
        {center?.links?.continuous_improvement && <Link href={center.links.continuous_improvement} className="text-slate-600 hover:underline">{labels.continuousImprovementLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {OLC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {OLC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {OLC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className={`rounded-2xl border p-5 shadow-sm ${healthStyle}`}>
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {labels.healthLabels[dash.learning_health_label] ?? dash.learning_health_label} · {dash.learning_health_score}/100
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.lessonsCaptured} value={dash.lessons_captured} />
            <Metric label={labels.metrics.lessonsPublished} value={dash.lessons_published} />
            <Metric label={labels.metrics.validation} value={`${dash.validation_completion_pct}%`} />
            <Metric label={labels.metrics.utilization} value={`${dash.knowledge_utilization_pct}%`} />
            <Metric label={labels.metrics.adoption} value={`${dash.improvement_adoption_pct}%`} />
            <Metric label={labels.metrics.participation} value={`${dash.participation_satisfaction}/5`} />
            <Metric label={labels.metrics.trust} value={`${dash.executive_trust_indicator}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateSummary} onClick={() => void postAction({ action: "generate_learning_summary" })} />
              <ActionBtn label={labels.generateReport} variant="muted" onClick={() => void postAction({ action: "generate_lessons_report" })} />
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

      <Section title={labels.validationTitle} empty={center?.validation_workflow.length === 0} emptyLabel={labels.emptySection}>
        <ol className="mt-4 flex flex-wrap gap-2">
          {center?.validation_workflow.map((stage, idx) => (
            <li key={stage.stage} className="flex items-center gap-2 text-sm">
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-800">
                {idx + 1}. {labels.validationStages[stage.stage] ?? stage.label}
              </span>
              {idx < (center?.validation_workflow.length ?? 0) - 1 && <span className="text-gray-400">→</span>}
            </li>
          ))}
        </ol>
      </Section>

      <Section title={labels.lessonsTitle} empty={center?.lessons.length === 0} emptyLabel={labels.emptySection}>
        {center?.lessons.map((lesson) => (
          <li key={lesson.lesson_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">{labels.domains[lesson.domain] ?? lesson.domain}</p>
                <p className="font-medium text-gray-900">{lesson.title}</p>
              </div>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                {labels.validationStages[lesson.validation_stage] ?? lesson.validation_stage}
              </span>
            </div>
            <dl className="mt-3 space-y-2 text-gray-700">
              <LessonField label={labels.whatHappened} value={lesson.what_happened} />
              <LessonField label={labels.whatWorked} value={lesson.what_worked} />
              <LessonField label={labels.whatDidNotWork} value={lesson.what_did_not_work} />
              <LessonField label={labels.whatShouldChange} value={lesson.what_should_change} />
              <LessonField label={labels.whatShouldRemain} value={lesson.what_should_remain} />
            </dl>
            {center?.can_manage && lesson.validation_stage !== "published" && (
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionBtn label={labels.publishLesson} onClick={() => void postAction({ action: "publish_lesson", lesson_key: lesson.lesson_key })} />
              </div>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.patternsTitle} empty={center?.patterns.length === 0} emptyLabel={labels.emptySection}>
        {center?.patterns.map((pat) => (
          <li key={pat.pattern_key} className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.patternTypes[pat.pattern_type] ?? pat.pattern_type} · {pat.occurrence_count}×</p>
            <p className="mt-1 text-gray-800">{pat.message}</p>
            {center?.can_manage && (
              <button type="button" className="mt-2 text-xs text-slate-600 hover:underline" onClick={() => void postAction({ action: "dismiss_pattern", pattern_key: pat.pattern_key })}>{labels.dismiss}</button>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.bestPracticesTitle} empty={center?.best_practices.length === 0} emptyLabel={labels.emptySection}>
        {center?.best_practices.map((bp) => (
          <li key={bp.practice_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.practiceTypes[bp.practice_type] ?? bp.practice_type}</p>
            <p className="font-medium text-gray-900">{bp.title}</p>
            <p className="mt-1 text-gray-700">{bp.summary}</p>
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.strategic} value={center.executive_view.strategic_lessons} />
            <ExecField label={labels.executiveFields.maturity} value={center.executive_view.maturity_trends} />
            <ExecField label={labels.executiveFields.opportunities} value={center.executive_view.high_value_opportunities} />
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

function LessonField({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
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
