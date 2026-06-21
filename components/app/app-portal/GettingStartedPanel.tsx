"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Compass,
  ListChecks,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppEmptyState, AppErrorState, AppLoadingState } from "@/components/app/design";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { formatDateTime } from "@/lib/i18n/format-date";
import {
  GETTING_STARTED_SUPPORT_HREF,
  parseOnboarding,
  computeApplicableProgress,
  filterValidMilestones,
  mapWorkflowStateForSemantic,
  partitionAdoptionFeatures,
  partitionCompletedTasks,
  partitionRemainingTasks,
  resolveNextIncompleteTask,
  resolveOverviewWorkflowState,
  resolveTaskHref,
  resolveTaskPriority,
  type OnboardingLabels,
  type OnboardingResponse,
} from "@/lib/app-portal/onboarding";

type Props = {
  labels: OnboardingLabels;
  locale: string;
  webAppResource?: {
    title: string;
    description: string;
    guideHref: string;
    guideLabel: string;
  };
};

const SECTION_ICONS: Record<string, LucideIcon> = {
  progress: ListChecks,
  nextAction: Compass,
  remaining: ListChecks,
  completed: CheckCircle2,
  adoption: TrendingUp,
  understanding: BookOpen,
};

function SectionHeading({ id, title }: { id: string; title: string }) {
  const Icon = SECTION_ICONS[id] ?? ListChecks;
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700 ring-1 ring-violet-100"
        aria-hidden="true"
      >
        <Icon className="h-[18px] w-[18px] stroke-[1.75]" />
      </span>
      <h2 className={AppPremiumShell.sectionTitle}>{title}</h2>
    </div>
  );
}

export function GettingStartedPanel({ labels, locale, webAppResource }: Props) {
  const [data, setData] = useState<OnboardingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [hiddenMilestones, setHiddenMilestones] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/aipify/onboarding");
    if (res.ok) {
      setData(parseOnboarding(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.error.body);
    }
    setLoading(false);
  }, [labels.error.body]);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = useCallback(
    async (body: Record<string, string>) => {
      setBusy(true);
      const res = await fetch("/api/aipify/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) setData(parseOnboarding(await res.json()));
      setBusy(false);
    },
    []
  );

  const checklist = useMemo(() => data?.checklist ?? [], [data?.checklist]);
  const progress = useMemo(() => computeApplicableProgress(checklist), [checklist]);
  const workflowState = useMemo(
    () => resolveOverviewWorkflowState(data?.overview, checklist),
    [data?.overview, checklist]
  );
  const nextTask = useMemo(() => resolveNextIncompleteTask(checklist), [checklist]);
  const remaining = useMemo(() => partitionRemainingTasks(checklist), [checklist]);
  const completed = useMemo(() => partitionCompletedTasks(checklist), [checklist]);
  const visibleCompleted = useMemo(
    () => completed.filter((t) => !hiddenMilestones.has(t.key)),
    [completed, hiddenMilestones]
  );
  const adoptionFeatures = useMemo(
    () => partitionAdoptionFeatures(checklist, data?.adoption_insights),
    [checklist, data?.adoption_insights]
  );
  const activeMilestones = useMemo(
    () =>
      filterValidMilestones(data?.milestones ?? [], data?.connected_integrations ?? 0).filter(
        (m) => !hiddenMilestones.has(m.key)
      ),
    [data?.milestones, data?.connected_integrations, hiddenMilestones]
  );

  if (loading) {
    return (
      <div className={AppPremiumShell.page}>
        <AppLoadingState message={labels.loading} />
      </div>
    );
  }

  if (error || !data?.found) {
    return (
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
        <AppErrorState
          title={labels.error.title}
          description={error || labels.error.body}
          onRetry={() => void load()}
          retryLabel={labels.error.retry}
          returnHref={GETTING_STARTED_SUPPORT_HREF}
          returnLabel={labels.backToSupport}
        />
      </div>
    );
  }

  const showStartEmpty = !data.started;
  const workflowSemantic = mapWorkflowStateForSemantic(workflowState);
  const continueHref = nextTask ? resolveTaskHref(nextTask.key) : undefined;

  return (
    <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
      <header className="space-y-4 border-b border-aipify-border pb-6">
        <nav className="text-sm text-aipify-text-muted" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>{labels.breadcrumbSupport}</li>
            <li aria-hidden="true">→</li>
            <li className="font-medium text-aipify-text">{labels.breadcrumbGettingStarted}</li>
          </ol>
        </nav>
        <Link
          href={GETTING_STARTED_SUPPORT_HREF}
          className="text-sm font-medium text-aipify-companion hover:underline"
        >
          ← {labels.backToSupport}
        </Link>
        <div className="space-y-2">
          <p className={AppPremiumShell.eyebrow}>{labels.eyebrow}</p>
          <h1 className={AppPremiumShell.pageTitle}>{labels.title}</h1>
          <p className={AppPremiumShell.pageDescription}>{labels.subtitle}</p>
        </div>
      </header>

      {showStartEmpty ? (
        <div className="space-y-4">
          <AppEmptyState title={labels.empty.title} description={labels.empty.body} />
          <button
            type="button"
            disabled={busy}
            onClick={() => void patch({ action: "start" })}
            className="inline-flex min-h-11 items-center rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {labels.empty.action}
          </button>
        </div>
      ) : (
        <>
          <section className={`${AppPremiumShell.elevatedCard} space-y-5 p-6`}>
            <SectionHeading id="progress" title={labels.sections.progress} />
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <p className={AppPremiumShell.metricLabel}>{labels.progress.percentComplete}</p>
                <p className={AppPremiumShell.metricValue}>{progress.progress_percent}%</p>
              </div>
              <div>
                <p className={AppPremiumShell.metricLabel}>{labels.progress.stepsCompleted}</p>
                <p className="text-lg font-semibold text-aipify-text">
                  {progress.completed}/{progress.total}
                </p>
              </div>
              <div>
                <p className={AppPremiumShell.metricLabel}>{labels.progress.workflowState}</p>
                <SemanticBadge
                  type="workflow"
                  value={workflowSemantic}
                  label={labels.workflowStates[workflowState]}
                />
              </div>
              {data.overview?.last_updated_at ? (
                <div>
                  <p className={AppPremiumShell.metricLabel}>{labels.progress.lastUpdated}</p>
                  <p className="text-sm text-aipify-text-secondary">
                    {formatDateTime(data.overview.last_updated_at, locale)}
                  </p>
                </div>
              ) : null}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-aipify-surface-muted">
              <div
                className="h-full rounded-full bg-aipify-companion transition-all"
                style={{ width: `${progress.progress_percent}%` }}
              />
            </div>
            <p className="text-sm text-aipify-text-muted">{labels.progress.advisory}</p>
            {continueHref ? (
              <Link
                href={continueHref}
                className="inline-flex rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                {labels.progress.continueSetup}
              </Link>
            ) : null}
          </section>

          {nextTask ? (
            <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
              <SectionHeading id="nextAction" title={labels.sections.nextAction} />
              <div className="rounded-xl border border-aipify-border bg-violet-50/30 p-4">
                <p className="font-medium text-aipify-text">
                  {labels.tasks[nextTask.key as keyof typeof labels.tasks] ?? nextTask.key}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <SemanticBadge
                    type="workflow"
                    value={mapWorkflowStateForSemantic(
                      nextTask.status === "completed" ? "completed" : "in_progress"
                    )}
                    label={labels.taskStatuses[nextTask.status]}
                  />
                  {resolveTaskHref(nextTask.key) ? (
                    <Link
                      href={resolveTaskHref(nextTask.key)!}
                      className="text-sm font-medium text-aipify-companion hover:underline"
                    >
                      {labels.actions.open}
                    </Link>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          {remaining.length > 0 ? (
            <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
              <SectionHeading id="remaining" title={labels.sections.remaining} />
              <ul className="space-y-3">
                {remaining.map((task) => {
                  const priority = resolveTaskPriority(task);
                  const href = resolveTaskHref(task.key);
                  return (
                    <li
                      key={task.key}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-aipify-border px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-aipify-text">
                          {labels.tasks[task.key as keyof typeof labels.tasks] ?? task.key}
                        </p>
                        <p className="mt-1 text-xs text-aipify-text-muted">
                          {labels.categories[task.category as keyof typeof labels.categories] ?? task.category}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <SemanticBadge
                          type="severity"
                          value={priority === "required" ? "high" : priority === "recommended" ? "medium" : "low"}
                          label={labels.taskPriorities[priority]}
                        />
                        {href ? (
                          <Link href={href} className="text-sm font-medium text-aipify-companion hover:underline">
                            {labels.actions.open}
                          </Link>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {visibleCompleted.length > 0 ? (
            <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
              <SectionHeading id="completed" title={labels.sections.completed} />
              <ul className="space-y-2">
                {visibleCompleted.map((task) => (
                  <li
                    key={task.key}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm"
                  >
                    <span className="flex items-center gap-2 text-emerald-900">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      {labels.tasks[task.key as keyof typeof labels.tasks] ?? task.key}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-emerald-800">
                      {task.completed_at ? formatDateTime(task.completed_at, locale) : null}
                      <button
                        type="button"
                        className="underline hover:no-underline"
                        onClick={() =>
                          setHiddenMilestones((prev) => new Set(prev).add(task.key))
                        }
                      >
                        {labels.actions.hide}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {activeMilestones.length > 0 ? (
            <section className="space-y-3">
              {activeMilestones.map((m) => (
                <div
                  key={m.key}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-4"
                >
                  <p className="flex items-center gap-2 text-sm font-medium text-emerald-950">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    {labels.milestones[m.key as keyof typeof labels.milestones] ?? m.key}
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setHiddenMilestones((prev) => new Set(prev).add(m.key));
                      void patch({ action: "dismiss_milestone", milestone_key: m.key });
                    }}
                    className="text-xs text-emerald-800 underline hover:no-underline"
                  >
                    {labels.actions.hide}
                  </button>
                </div>
              ))}
            </section>
          ) : null}

          {adoptionFeatures.explored.length > 0 || adoptionFeatures.recommended.length > 0 ? (
            <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
              <SectionHeading id="adoption" title={labels.sections.adoption} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-aipify-border p-4">
                  <p className="text-sm font-medium text-aipify-text-secondary">{labels.adoption.explored}</p>
                  {adoptionFeatures.explored.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm text-aipify-text">
                      {adoptionFeatures.explored.map((t) => (
                        <li key={t.key}>
                          {labels.tasks[t.key as keyof typeof labels.tasks] ?? t.key}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-aipify-text-muted">{labels.adoption.noneExplored}</p>
                  )}
                </div>
                <div className="rounded-xl border border-aipify-border p-4">
                  <p className="text-sm font-medium text-aipify-text-secondary">{labels.adoption.recommended}</p>
                  {adoptionFeatures.recommended.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm text-aipify-text">
                      {adoptionFeatures.recommended.map((t) => (
                        <li key={t.key} className="flex items-center justify-between gap-2">
                          <span>{labels.tasks[t.key as keyof typeof labels.tasks] ?? t.key}</span>
                          {resolveTaskHref(t.key) ? (
                            <Link href={resolveTaskHref(t.key)!} className="text-aipify-companion hover:underline">
                              {labels.actions.open}
                            </Link>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-aipify-text-muted">{labels.adoption.noneRecommended}</p>
                  )}
                </div>
              </div>
              {(data.adoption_insights?.suggested_business_packs.length ?? 0) > 0 ? (
                <div className="rounded-xl border border-aipify-border bg-aipify-surface-muted/40 p-4">
                  <p className="text-sm font-medium text-aipify-text-secondary">{labels.adoption.suggestedPacks}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.adoption_insights!.suggested_business_packs.map((p) => (
                      <span
                        key={p}
                        className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-900"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}
        </>
      )}

      <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
        <SectionHeading id="understanding" title={labels.sections.understanding} />
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-aipify-text">{labels.understanding.revisit}</dt>
            <dd className="mt-1 text-aipify-text-secondary">{labels.understanding.revisitAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-aipify-text">{labels.understanding.progressMeaning}</dt>
            <dd className="mt-1 text-aipify-text-secondary">{labels.understanding.progressMeaningAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-aipify-text">{labels.understanding.permissions}</dt>
            <dd className="mt-1 text-aipify-text-secondary">{labels.understanding.permissionsAnswer}</dd>
          </div>
        </dl>
      </section>

      {webAppResource ? (
        <section className={`${AppPremiumShell.elevatedCard} space-y-3 p-6`}>
          <h2 className="text-lg font-semibold text-aipify-text">{webAppResource.title}</h2>
          <p className="text-sm text-aipify-text-secondary">{webAppResource.description}</p>
          <Link
            href={webAppResource.guideHref}
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-aipify-companion hover:text-aipify-companion/80"
          >
            {webAppResource.guideLabel}
          </Link>
        </section>
      ) : null}
    </div>
  );
}
