"use client";

import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Layers,
  Library,
  PlayCircle,
  Route,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppEmptyState, AppErrorState, AppLoadingState } from "@/components/app/design";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  CERTIFICATION_TYPES,
  CERTIFICATION_REQUIRED_COURSES,
  CUSTOMER_ACADEMY_SUPPORT_HREF,
  resolveCourseHref,
  computeOverviewMetrics,
  continueLearningCourses,
  coursesForSection,
  indexAssignmentsBySlug,
  isValidSortOption,
  knowledgeResources,
  mergeCourseCatalog,
  parseAcademyOverview,
  recommendedCoursesWithContext,
  resolveCourseState,
  sortCourses,
  certificationProgress,
  mapCertificationWorkflowState,
  teamHasAssignments,
  type AcademyOverviewResponse,
  type AcademySortOption,
  type CustomerAcademyLabels,
  type AcademyCourse,
  type AcademyAssignment,
} from "@/lib/app-portal/customer-academy";

type Props = {
  labels: CustomerAcademyLabels;
};

const SECTION_ICONS: Record<string, LucideIcon> = {
  overview: GraduationCap,
  continueLearning: PlayCircle,
  recommended: Sparkles,
  gettingStarted: BookOpen,
  productTraining: Layers,
  certifications: GraduationCap,
  teamLearning: Users,
  suggestedPaths: Route,
  knowledgeCenter: Library,
  understanding: BookOpen,
};

function SectionHeading({ id, title }: { id: string; title: string }) {
  const Icon = SECTION_ICONS[id] ?? GraduationCap;
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

export function CustomerAcademyPanel({ labels }: Props) {
  const [data, setData] = useState<AcademyOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [completionStatus, setCompletionStatus] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<AcademySortOption>("title");
  const [showAssign, setShowAssign] = useState(false);
  const [assignSlug, setAssignSlug] = useState("");
  const [assignDept, setAssignDept] = useState("support");
  const [assignDue, setAssignDue] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (completionStatus) params.set("completion_status", completionStatus);
    if (difficulty) params.set("difficulty", difficulty);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/academy?${params}`);
    if (res.ok) {
      setData(parseAcademyOverview(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [category, completionStatus, difficulty, search, labels.accessDenied]);

  useEffect(() => {
    void load();
  }, [load]);

  const catalog = useMemo(() => {
    if (!data) return [];
    return mergeCourseCatalog(data.courses, data.recommended_courses, data.assigned_training);
  }, [data]);

  const assignmentMap = useMemo(
    () => indexAssignmentsBySlug(data?.assigned_training ?? []),
    [data?.assigned_training]
  );

  const metrics = useMemo(
    () => computeOverviewMetrics(data?.progress, catalog, data?.assigned_training ?? []),
    [data?.progress, catalog, data?.assigned_training]
  );

  const continueCourses = useMemo(
    () => continueLearningCourses(catalog, data?.assigned_training ?? []),
    [catalog, data?.assigned_training]
  );

  const recommended = useMemo(
    () => recommendedCoursesWithContext(data?.recommended_courses ?? [], catalog),
    [data?.recommended_courses, catalog]
  );

  const recommendedSlugs = useMemo(() => new Set(recommended.map((c) => c.slug)), [recommended]);
  const continueSlugs = useMemo(() => new Set(continueCourses.map((c) => c.slug)), [continueCourses]);

  const gettingStartedCourses = useMemo(
    () => sortCourses(coursesForSection(catalog, "getting_started", new Set([...recommendedSlugs, ...continueSlugs])), sortBy),
    [catalog, recommendedSlugs, continueSlugs, sortBy]
  );

  const productCourses = useMemo(
    () => sortCourses(coursesForSection(catalog, "product_training", new Set([...recommendedSlugs, ...continueSlugs])), sortBy),
    [catalog, recommendedSlugs, continueSlugs, sortBy]
  );

  const knowledgeItems = useMemo(() => knowledgeResources(catalog), [catalog]);

  async function enrollCourse(slug: string) {
    setBusy(true);
    await fetch(`/api/aipify/academy/courses/${slug}/enroll`, { method: "POST" });
    setBusy(false);
    void load();
  }

  async function completeCourse(slug: string) {
    setBusy(true);
    const res = await fetch("/api/aipify/academy/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_slug: slug }),
    });
    setBusy(false);
    if (res.ok) void load();
  }

  async function assignTraining() {
    if (!assignSlug) return;
    setBusy(true);
    const res = await fetch("/api/aipify/academy/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_slug: assignSlug,
        department: assignDept,
        due_date: assignDue || undefined,
        required: true,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setShowAssign(false);
      void load();
    }
  }

  if (loading && !data && !error) {
    return (
      <div className={AppPremiumShell.page}>
        <AppLoadingState message={labels.loading} />
      </div>
    );
  }

  if (error && !data?.found) {
    return (
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
        <AppErrorState
          title={labels.error.title}
          description={error || labels.error.body}
          onRetry={() => void load()}
          retryLabel={labels.error.retry}
          returnHref={CUSTOMER_ACADEMY_SUPPORT_HREF}
          returnLabel={labels.backToSupport}
        />
      </div>
    );
  }

  const teamAssigned = teamHasAssignments(metrics, data?.team_reporting.length ?? 0);
  const completionSlugs = new Set(catalog.filter((c) => c.completed).map((c) => c.slug));

  return (
    <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
      <header className="space-y-4 border-b border-aipify-border pb-6">
        <nav className="text-sm text-aipify-text-muted" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>{labels.breadcrumbSupport}</li>
            <li aria-hidden="true">→</li>
            <li className="font-medium text-aipify-text">{labels.breadcrumbAcademy}</li>
          </ol>
        </nav>
        <Link
          href={CUSTOMER_ACADEMY_SUPPORT_HREF}
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

      <section className="space-y-4">
        <SectionHeading id="overview" title={labels.overview.personalCompletion} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [labels.overview.available, metrics.available],
              [labels.overview.assigned, metrics.assigned],
              [labels.overview.started, metrics.started],
              [labels.overview.inProgress, metrics.in_progress],
              [labels.overview.completed, metrics.completed],
              [labels.overview.overdue, metrics.overdue],
              [labels.overview.personalCompletion, `${metrics.completion_percent}%`],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className={`${AppPremiumShell.elevatedCard} p-4`}>
              <p className={AppPremiumShell.metricLabel}>{label}</p>
              <p className={`mt-1 ${AppPremiumShell.metricValue}`}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-aipify-border px-3 py-2 text-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => {
            const v = e.target.value;
            if (isValidSortOption(v)) setSortBy(v);
          }}
          aria-label={labels.filters.sortBy}
          className="rounded-lg border border-aipify-border px-3 py-2 text-sm"
        >
          <option value="">{labels.filters.sortBy}</option>
          <option value="title">{labels.filters.sortTitle}</option>
          <option value="duration">{labels.filters.sortDuration}</option>
          <option value="difficulty">{labels.filters.sortDifficulty}</option>
          <option value="section">{labels.filters.sortSection}</option>
          <option value="progress">{labels.filters.sortProgress}</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-aipify-border px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          <option value="getting_started">{labels.sections.gettingStarted}</option>
          <option value="product_training">{labels.sections.productTraining}</option>
          <option value="knowledge_center">{labels.sections.knowledgeCenter}</option>
        </select>
        <select value={completionStatus} onChange={(e) => setCompletionStatus(e.target.value)} className="rounded-lg border border-aipify-border px-3 py-2 text-sm">
          <option value="">{labels.filters.completionStatus}</option>
          <option value="not_started">{labels.filters.notStarted}</option>
          <option value="in_progress">{labels.filters.inProgress}</option>
          <option value="completed">{labels.filters.completed}</option>
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-lg border border-aipify-border px-3 py-2 text-sm">
          <option value="">{labels.filters.difficulty}</option>
          <option value="beginner">{labels.difficulties.beginner}</option>
          <option value="intermediate">{labels.difficulties.intermediate}</option>
        </select>
        {data?.can_manage ? (
          <button
            type="button"
            onClick={() => setShowAssign(true)}
            className="rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            {labels.assign.title}
          </button>
        ) : null}
      </section>

      {showAssign && data?.can_manage ? (
        <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
          <h2 className="font-semibold">{labels.assign.title}</h2>
          <select value={assignSlug} onChange={(e) => setAssignSlug(e.target.value)} className="w-full rounded-lg border border-aipify-border px-3 py-2 text-sm">
            <option value="">{labels.assign.course}</option>
            {catalog.filter((c) => c.content_type === "course").map((c) => (
              <option key={c.slug} value={c.slug}>{c.title}</option>
            ))}
          </select>
          <select value={assignDept} onChange={(e) => setAssignDept(e.target.value)} className="w-full rounded-lg border border-aipify-border px-3 py-2 text-sm">
            <option value="support">{labels.assign.supportTeam}</option>
            <option value="operations">{labels.assign.operationsTeam}</option>
            <option value="leadership">{labels.assign.leadershipTeam}</option>
          </select>
          <input
            type="date"
            value={assignDue}
            onChange={(e) => setAssignDue(e.target.value)}
            aria-label={labels.assign.dueDate}
            className="w-full rounded-lg border border-aipify-border px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button type="button" disabled={busy} onClick={() => void assignTraining()} className="rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {labels.assign.submit}
            </button>
            <button type="button" onClick={() => setShowAssign(false)} className="rounded-lg border border-aipify-border px-4 py-2 text-sm">
              {labels.assign.cancel}
            </button>
          </div>
        </section>
      ) : null}

      {continueCourses.length > 0 ? (
        <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
          <SectionHeading id="continueLearning" title={labels.sections.continueLearning} />
          <CourseGrid
            courses={continueCourses}
            labels={labels}
            assignmentMap={assignmentMap}
            busy={busy}
            onEnroll={(slug) => void enrollCourse(slug)}
            onComplete={(slug) => void completeCourse(slug)}
          />
        </section>
      ) : (
        <p className="text-sm text-aipify-text-muted">{labels.empty.continueLearning}</p>
      )}

      {recommended.length > 0 ? (
        <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
          <SectionHeading id="recommended" title={labels.sections.recommended} />
          <CourseGrid
            courses={recommended}
            labels={labels}
            assignmentMap={assignmentMap}
            busy={busy}
            showReason
            onEnroll={(slug) => void enrollCourse(slug)}
            onComplete={(slug) => void completeCourse(slug)}
          />
        </section>
      ) : null}

      {gettingStartedCourses.length > 0 ? (
        <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
          <SectionHeading id="gettingStarted" title={labels.sections.gettingStarted} />
          <CourseGrid
            courses={gettingStartedCourses}
            labels={labels}
            assignmentMap={assignmentMap}
            busy={busy}
            onEnroll={(slug) => void enrollCourse(slug)}
            onComplete={(slug) => void completeCourse(slug)}
          />
        </section>
      ) : null}

      {productCourses.length > 0 ? (
        <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
          <SectionHeading id="productTraining" title={labels.sections.productTraining} />
          <CourseGrid
            courses={productCourses}
            labels={labels}
            assignmentMap={assignmentMap}
            busy={busy}
            onEnroll={(slug) => void enrollCourse(slug)}
            onComplete={(slug) => void completeCourse(slug)}
          />
        </section>
      ) : null}

      <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
        <SectionHeading id="certifications" title={labels.sections.certifications} />
        <div className="grid gap-3 sm:grid-cols-2">
          {CERTIFICATION_TYPES.map((type) => {
            const cert = data?.certifications.find((c) => c.certification_type === type);
            const status = cert?.status ?? "not_started";
            const required = cert?.required_courses ?? CERTIFICATION_REQUIRED_COURSES[type] ?? [];
            const completedCount = required.filter((slug) => completionSlugs.has(slug)).length;
            const progressPct = certificationProgress(cert, required.length, completedCount);
            const workflowValue = mapCertificationWorkflowState(status);
            return (
              <div key={type} className="rounded-xl border border-aipify-border p-4">
                <p className="font-medium text-aipify-text">{labels.certifications[type]}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SemanticBadge
                    type="workflow"
                    value={workflowValue}
                    label={labels.certificationStates[status] ?? status}
                  />
                  <span className="text-xs text-aipify-text-muted">{progressPct}%</span>
                  {required.length > 0 ? (
                    <span className="text-xs text-aipify-text-muted">
                      {completedCount}/{required.length} courses
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {data?.can_manage ? (
        <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
          <SectionHeading id="teamLearning" title={labels.sections.teamLearning} />
          {!teamAssigned ? (
            <div className="space-y-4">
              <AppEmptyState title={labels.team.noAssignments} description={labels.empty.teamLearning} />
              <button
                type="button"
                onClick={() => setShowAssign(true)}
                className="inline-flex min-h-11 items-center rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                {labels.assign.action}
              </button>
            </div>
          ) : (data.assigned_training.length ?? 0) > 0 ? (
            <ul className="space-y-2 text-sm">
              {data.assigned_training.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-aipify-border pb-2">
                  <Link href={resolveCourseHref(a.course_slug)} className="font-medium text-aipify-companion hover:underline">
                    {a.course_title}
                  </Link>
                  <SemanticBadge
                    type="workflow"
                    value={a.status === "overdue" ? "overdue" : a.status === "in_progress" ? "in_progress" : "pending"}
                    label={labels.courseStates[a.status === "overdue" ? "overdue" : a.status === "in_progress" ? "in_progress" : "assigned"]}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-aipify-text-muted">{labels.empty.teamLearning}</p>
          )}
        </section>
      ) : null}

      {(data?.suggested_paths.length ?? 0) > 0 ? (
        <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
          <SectionHeading id="suggestedPaths" title={labels.sections.suggestedPaths} />
          <div className="grid gap-3 sm:grid-cols-3">
            {data!.suggested_paths.map((p) => (
              <Link
                key={p.id}
                href={p.href ?? `/app/support/academy?section=${p.section}`}
                className="rounded-xl border border-aipify-border p-4 hover:border-aipify-companion hover:bg-violet-50/30"
              >
                <p className="font-medium text-aipify-text">{p.title}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {knowledgeItems.length > 0 ? (
        <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
          <SectionHeading id="knowledgeCenter" title={labels.sections.knowledgeCenter} />
          <ul className="space-y-2 text-sm">
            {knowledgeItems.map((item) => (
              <li key={item.slug} className="flex flex-wrap items-center justify-between gap-2">
                <Link href={item.href ?? `/app/support/knowledge/${item.slug}`} className="text-aipify-companion hover:underline">
                  {item.title}
                </Link>
                <SemanticBadge
                  type="lifecycle"
                  value="enabled"
                  label={labels.contentTypes[item.content_type as keyof typeof labels.contentTypes] ?? item.content_type}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
        <SectionHeading id="understanding" title={labels.sections.understanding} />
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-aipify-text">{labels.understanding.whatIs}</dt>
            <dd className="mt-1 text-aipify-text-secondary">{labels.understanding.whatIsAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-aipify-text">{labels.understanding.managersAssign}</dt>
            <dd className="mt-1 text-aipify-text-secondary">{labels.understanding.managersAssignAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-aipify-text">{labels.understanding.partnerAcademy}</dt>
            <dd className="mt-1 text-aipify-text-secondary">{labels.understanding.partnerAcademyAnswer}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function CourseGrid({
  courses,
  labels,
  assignmentMap,
  busy,
  showReason,
  onEnroll,
  onComplete,
}: {
  courses: AcademyCourse[];
  labels: CustomerAcademyLabels;
  assignmentMap: Map<string, AcademyAssignment>;
  busy: boolean;
  showReason?: boolean;
  onEnroll: (slug: string) => void;
  onComplete: (slug: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {courses.map((course) => {
        const assignment = assignmentMap.get(course.slug);
        const state = resolveCourseState(course, assignment);
        const workflowValue =
          state === "completed"
            ? "completed"
            : state === "overdue"
              ? "overdue"
              : state === "in_progress"
                ? "in_progress"
                : state === "locked"
                  ? "blocked"
                  : "pending";
        const actionLabel =
          state === "completed"
            ? labels.courseActions.review
            : state === "in_progress"
              ? labels.courseActions.continue
              : state === "locked"
                ? labels.courseStates.locked
                : labels.courseActions.start;
        const reasonKey = course.recommendation_reason as keyof typeof labels.recommendations | undefined;

        return (
          <div key={course.slug} className="rounded-xl border border-aipify-border p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium text-aipify-text">{course.title}</p>
              <SemanticBadge type="workflow" value={workflowValue} label={labels.courseStates[state]} />
            </div>
            <p className="mt-1 text-xs text-aipify-text-muted">
              {course.duration_minutes} min ·{" "}
              {labels.difficulties[course.difficulty as keyof typeof labels.difficulties] ?? course.difficulty}
            </p>
            {showReason && reasonKey ? (
              <p className="mt-2 text-xs text-aipify-text-secondary">{labels.recommendations[reasonKey]}</p>
            ) : null}
            <p className="mt-2 text-sm text-aipify-text-secondary line-clamp-2">{course.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {state === "completed" ? (
                <Link href={course.href ?? resolveCourseHref(course.slug)} className="text-sm font-medium text-aipify-companion hover:underline">
                  {labels.courseActions.review}
                </Link>
              ) : state === "locked" ? null : state === "not_started" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onEnroll(course.slug)}
                  className="rounded-lg bg-aipify-companion px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                >
                  {actionLabel}
                </button>
              ) : (
                <>
                  <Link
                    href={course.href ?? resolveCourseHref(course.slug)}
                    className="rounded-lg bg-aipify-companion px-3 py-1.5 text-xs font-medium text-white"
                  >
                    {labels.courseActions.continue}
                  </Link>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onComplete(course.slug)}
                    className="rounded-lg border border-aipify-border px-3 py-1.5 text-xs font-medium disabled:opacity-60"
                  >
                    {labels.courseActions.complete}
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
