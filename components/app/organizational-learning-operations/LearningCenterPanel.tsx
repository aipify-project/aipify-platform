"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  LEARNING_STATUS_BADGES,
  LESSON_STATUS_BADGES,
  ORGANIZATIONAL_LEARNING_TABS,
  PATTERN_TYPE_BADGES,
  PIPELINE_STAGE_BADGES,
  PRIORITY_BADGES,
  parseOrganizationalLearningCenter,
  type OrganizationalLearningCenter,
  type OrganizationalLearningLabels,
  type OrganizationalLearningTab,
} from "@/lib/customer-organizational-learning-operations";

type Props = {
  labels: OrganizationalLearningLabels;
  backHref: string;
  initialTab?: OrganizationalLearningTab;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemList({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={String(
            item.lesson_key ?? item.improvement_key ?? item.success_key ?? item.retrospective_key
              ?? item.pattern_key ?? item.library_key ?? item.opportunity_key ?? item.department_key
              ?? item.pack_key ?? i
          )}
          className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm"
        >
          <p className="font-medium text-zinc-900">
            {String(
              item.lesson_title ?? item.improvement_title ?? item.success_title
                ?? item.retrospective_title ?? item.pattern_title ?? item.library_title
                ?? item.opportunity_title ?? item.department_title ?? item.pack_title
                ?? item.title ?? i
            )}
          </p>
          {item.summary ? <p className="mt-1 text-zinc-600">{String(item.summary)}</p> : null}
          {item.owner_name ? <p className="mt-1 text-zinc-500">{String(item.owner_name)}</p> : null}
          {item.what_worked ? (
            <p className="mt-1 text-emerald-700">
              <span className="font-medium">Worked:</span> {String(item.what_worked)}
            </p>
          ) : null}
          {item.what_failed ? (
            <p className="mt-1 text-red-700">
              <span className="font-medium">Failed:</span> {String(item.what_failed)}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.lesson_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${LESSON_STATUS_BADGES[String(item.lesson_status)] ?? LESSON_STATUS_BADGES.open}`}>
                {String(item.lesson_status)}
              </span>
            ) : null}
            {item.pipeline_stage ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${PIPELINE_STAGE_BADGES[String(item.pipeline_stage)] ?? PIPELINE_STAGE_BADGES.suggestion}`}>
                {String(item.pipeline_stage)}
              </span>
            ) : null}
            {item.learning_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${LEARNING_STATUS_BADGES[String(item.learning_status)] ?? LEARNING_STATUS_BADGES.stagnating}`}>
                {String(item.learning_status)}
              </span>
            ) : null}
            {item.pattern_type ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${PATTERN_TYPE_BADGES[String(item.pattern_type)] ?? PATTERN_TYPE_BADGES.custom}`}>
                {String(item.pattern_type)}
              </span>
            ) : null}
            {item.priority ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${PRIORITY_BADGES[String(item.priority)] ?? PRIORITY_BADGES.moderate}`}>
                {String(item.priority)}
              </span>
            ) : null}
            {item.lesson_id ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{String(item.lesson_id)}</span>
            ) : null}
            {item.lesson_category ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{String(item.lesson_category)}</span>
            ) : null}
            {item.occurrence_count != null ? (
              <span className="inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700">{String(item.occurrence_count)}×</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LearningCenterPanel({ labels, backHref, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<OrganizationalLearningCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<OrganizationalLearningTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/organizational-learning-operations");
    if (res.ok) setCenter(parseOrganizationalLearningCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/organizational-learning-operations/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, ...payload }),
      });
      if (res.ok) await load();
    } finally { setBusy(false); }
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;

  const overview = center.overview ?? {};
  const executive = center.executive_dashboard ?? {};
  const companion = center.companion ?? {};
  const advisorPrompts = (companion.learning_advisor_prompts as string[]) ?? [];
  const recommendations = center.recommendations ?? (executive.companion_recommendations as Record<string, unknown>[]) ?? [];
  const projectLessons = (center.lessons ?? []).filter((l) => l.lesson_category === "project");
  const projectReviews = (center.reviews ?? []).filter((r) => r.retrospective_type === "project");
  const projectSuccesses = (center.successes ?? []).filter((s) => s.success_type === "project");

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_learning")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshLearning}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_learning_report")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.generateLearningReport}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("submit_improvement")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.submitImprovement}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {ORGANIZATIONAL_LEARNING_TABS.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="space-y-8">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard label={labels.overview.totalLessons} value={Number(overview.total_lessons ?? 0)} />
            <OverviewCard label={labels.overview.activeImprovements} value={Number(overview.active_improvements ?? 0)} />
            <OverviewCard label={labels.overview.successStories} value={Number(overview.success_stories ?? 0)} />
            <OverviewCard label={labels.overview.reviewsCompleted} value={Number(overview.reviews_completed ?? 0)} />
            <OverviewCard label={labels.overview.patternsDetected} value={Number(overview.patterns_detected ?? 0)} />
            <OverviewCard label={labels.overview.opportunities} value={Number(overview.opportunities ?? 0)} />
            <OverviewCard label={labels.overview.libraryItems} value={Number(overview.library_items ?? 0)} />
            <OverviewCard label={labels.overview.avgLearningScore} value={Number(overview.avg_learning_score ?? 0)} />
          </dl>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.executiveDashboard}</h2>
            <div className="mt-4"><ItemList items={(executive.top_lessons as Record<string, unknown>[]) ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.repeatedMistakes}</h2>
            <div className="mt-4"><ItemList items={center.patterns ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.departmentScores}</h2>
            <div className="mt-4"><ItemList items={center.department_scores ?? []} /></div>
          </div>
        </section>
      ) : null}

      {tab === "lessons" ? (
        <section><ItemList items={center.lessons ?? []} /></section>
      ) : null}

      {tab === "reviews" ? (
        <section className="space-y-4">
          <ItemList items={center.reviews ?? []} />
          {(center.reviews ?? []).filter((r) => r.retrospective_status === "in_progress" || r.retrospective_status === "scheduled").map((review) => (
            <button key={String(review.retrospective_key)} type="button" disabled={busy}
              onClick={() => void runAction("complete_review", { retrospective_key: review.retrospective_key })}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
              {labels.actions.completeReview}
            </button>
          ))}
        </section>
      ) : null}

      {tab === "projects" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.tabs.lessons}</h2>
            <div className="mt-4"><ItemList items={projectLessons} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.tabs.reviews}</h2>
            <div className="mt-4"><ItemList items={projectReviews} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.tabs.successes}</h2>
            <div className="mt-4"><ItemList items={projectSuccesses} /></div>
          </div>
        </section>
      ) : null}

      {tab === "improvements" ? (
        <section className="space-y-4">
          <ItemList items={center.improvements ?? []} />
          {(center.improvements ?? []).filter((i) => i.pipeline_stage === "review" || i.pipeline_stage === "suggestion").map((imp) => (
            <button key={String(imp.improvement_key)} type="button" disabled={busy}
              onClick={() => void runAction("approve_improvement", { improvement_key: imp.improvement_key })}
              className="mr-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
              Approve
            </button>
          ))}
        </section>
      ) : null}

      {tab === "successes" ? (
        <section><ItemList items={center.successes ?? []} /></section>
      ) : null}

      {tab === "recommendations" ? (
        <section className="space-y-6">
          <ItemList items={recommendations} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.improvementOpportunities}</h2>
            <div className="mt-4"><ItemList items={center.opportunities ?? []} /></div>
          </div>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.companionAdvisor}</h2>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              {advisorPrompts.map((prompt) => <li key={prompt}>· {prompt}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.learningLibrary}</h2>
            <div className="mt-4"><ItemList items={center.library ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.businessPacks}</h2>
            <div className="mt-4"><ItemList items={center.business_packs ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              {(center.audit_recent ?? []).map((entry, i) => (
                <li key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <span className="font-medium text-zinc-900">{entry.event_type}</span>
                  {entry.summary ? ` — ${entry.summary}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
