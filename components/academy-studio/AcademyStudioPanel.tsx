"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  DIFFICULTY_BADGES,
  parseAcademyStudioCenter,
  STATUS_BADGES,
  type AcademyCourse,
  type AcademyStudioCenter,
  type AcademyStudioLabels,
  type AcademySurface,
} from "@/lib/academy-studio";

type AcademyStudioPanelProps = {
  surface: AcademySurface;
  labels: AcademyStudioLabels;
  backHref: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function Pill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

export function AcademyStudioPanel({ surface, labels, backHref }: AcademyStudioPanelProps) {
  const [center, setCenter] = useState<AcademyStudioCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [exportPreview, setExportPreview] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/academy-studio/overview?surface=${surface}`);
    if (res.ok) setCenter(parseAcademyStudioCenter(await res.json()));
    setLoading(false);
  }, [surface]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      const id = String(payload.course_id ?? action);
      setBusyId(id);
      try {
        const res = await fetch("/api/academy-studio/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, payload, surface }),
        });
        const data = (await res.json()) as { center?: AcademyStudioCenter; action?: { export?: unknown } };
        if (data.center) setCenter(data.center);
        else await load();
        if (action === "export_fiverr_package" && data.action?.export) {
          setExportPreview(JSON.stringify(data.action.export, null, 2));
        }
      } finally {
        setBusyId(null);
      }
    },
    [load, surface]
  );

  const recommendationText = (key: string, count?: number) => {
    const template = labels.recommendations[key as keyof typeof labels.recommendations] ?? key.replace(/_/g, " ");
    return template.replace("{count}", String(count ?? 0));
  };

  if (loading && !center) {
    return <AipifyLoader label={labels.loading} centered fullPage />;
  }

  if (!center?.has_access) {
    return (
      <PlatformEmptyState
        title={labels.emptyStateTitle ?? labels.emptyState}
        message={labels.emptyStateDescription ?? labels.emptyState}
        secondaryAction={{
          label: labels.viewDocumentation ?? labels.back,
          href: "/app/settings/employee-knowledge",
        }}
      />
    );
  }

  const overview = center.overview;
  const analytics = center.analytics;
  const isSuper = surface === "super";
  const isPartner = surface === "partner";

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
            <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
          </div>
          <Link href={backHref} className="text-sm text-indigo-700 hover:text-indigo-900">
            {labels.back}
          </Link>
        </div>
        {center.principle ? (
          <p className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm text-indigo-900">
            {center.principle}
          </p>
        ) : null}
      </header>

      {overview ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            {labels.sections.overview}
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <OverviewCard label={labels.overview.activeCourses} value={overview.active_courses} />
            <OverviewCard label={labels.overview.certifiedUsers} value={overview.certified_users} />
            <OverviewCard label={labels.overview.expiringCertifications} value={overview.expiring_certifications} />
            <OverviewCard label={labels.overview.completionRate} value={`${overview.completion_rate}%`} />
            <OverviewCard label={labels.overview.coursesRequiringReview} value={overview.courses_requiring_review} />
            <OverviewCard label={labels.overview.recommendedImprovements} value={overview.recommended_improvements} />
          </dl>
        </section>
      ) : null}

      {isSuper && center.workflow && center.workflow.length > 0 ? (
        <section id="academy-create-course" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.workflow}</h2>
          <p className="mt-1 text-xs text-gray-500">{labels.workflow.title}</p>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {center.workflow.map((step) => (
              <li key={step.step} className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
                <span className="font-medium">{labels.workflowSteps[step.step]}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={labels.table.title}
              className="min-w-[200px] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              disabled={!newTitle.trim() || busyId === "create_course"}
              onClick={() => void handleAction("create_course", { title: newTitle.trim() }).then(() => setNewTitle(""))}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {labels.quickActions.createCourse}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">{labels.youDecide}</p>
        </section>
      ) : null}

      {Array.isArray(center.recommendations) && center.recommendations.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {labels.sections.recommendations}
          </h2>
          <div className="grid gap-2">
            {center.recommendations.map((r) => (
              <div key={r.key} className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
                {recommendationText(r.message_key, r.count)}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {analytics && !isPartner ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.analytics}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <OverviewCard label={labels.analytics.completionRate} value={`${analytics.completion_rate}%`} />
            <OverviewCard label={labels.analytics.passRate} value={`${analytics.pass_rate}%`} />
            <OverviewCard label={labels.analytics.averageScore} value={analytics.average_score} />
            <OverviewCard label={labels.analytics.dropOffRate} value={`${analytics.module_drop_off_rate}%`} />
            <OverviewCard label={labels.analytics.retraining} value={analytics.retraining_opportunities} />
          </dl>
          {analytics.most_difficult_questions.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">{labels.analytics.difficultQuestions}</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {analytics.most_difficult_questions.map((q) => (
                  <li key={q.prompt} className="rounded-lg border border-gray-100 px-3 py-2">
                    {q.prompt}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <section id="academy-create-course" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.courses}</h2>
        {(center.courses ?? []).length === 0 ? (
          <PlatformEmptyState
            title={labels.emptyStateTitle ?? labels.emptyState}
            message={labels.emptyStateDescription ?? labels.emptyState}
            primaryAction={{
              label: labels.createFirstProgram ?? labels.quickActions.createCourse,
              onClick: () => document.getElementById("academy-create-course")?.scrollIntoView(),
            }}
            secondaryAction={{
              label: labels.viewDocumentation ?? labels.back,
              href: "/app/settings/employee-knowledge",
            }}
            className="mt-4"
          />
        ) : (
          <ul className="mt-4 space-y-4">
            {(center.courses ?? []).map((course) => (
              <CourseRow
                key={course.id}
                course={course}
                labels={labels}
                isSuper={isSuper}
                isPartner={isPartner}
                busyId={busyId}
                onAction={handleAction}
              />
            ))}
          </ul>
        )}
      </section>

      {isSuper && center.video_production_readiness ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.production}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {Object.entries(center.video_production_readiness).map(([key, value]) => (
              <li key={key} className="rounded-lg border border-gray-100 px-3 py-2 capitalize">
                {key.replace(/_/g, " ")}: <span className="font-medium">{value}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {exportPreview ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.export.fiverrTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">{labels.export.fiverrHint}</p>
          <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-gray-50 p-4 text-xs">{exportPreview}</pre>
        </section>
      ) : null}

      {!isPartner && (center.audit ?? []).length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {(center.audit ?? []).map((entry) => (
              <li key={entry.id} className="rounded-lg border border-gray-100 px-3 py-2">
                <span className="text-gray-800">{entry.summary}</span>
                <span className="mt-1 block text-xs text-gray-500">
                  {new Date(entry.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function CourseRow({
  course,
  labels,
  isSuper,
  isPartner,
  busyId,
  onAction,
}: {
  course: AcademyCourse;
  labels: AcademyStudioLabels;
  isSuper: boolean;
  isPartner: boolean;
  busyId: string | null;
  onAction: (action: string, payload: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <li className="rounded-xl border border-gray-100 px-4 py-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gray-900">{course.title}</span>
            <Pill label={labels.courseStatuses[course.status]} className={STATUS_BADGES[course.status]} />
            <Pill label={labels.difficulties[course.difficulty]} className={DIFFICULTY_BADGES[course.difficulty]} />
          </div>
          {course.description ? <p className="mt-2 text-gray-600">{course.description}</p> : null}
          {course.objective ? <p className="mt-1 text-xs text-indigo-800">{course.objective}</p> : null}
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
            <span>{labels.table.audience}: {labels.audiences[course.audience]}</span>
            <span>{labels.table.language}: {labels.languages[course.language]}</span>
            <span>{labels.table.duration}: {course.estimated_duration_minutes} min</span>
            <span>{labels.table.threshold}: {course.passing_threshold}%</span>
            <span>{labels.table.modules}: {course.modules.length}</span>
          </div>
          {course.modules.length > 0 ? (
            <ul className="mt-3 space-y-1 border-t border-gray-100 pt-3">
              {course.modules.map((m) => (
                <li key={m.id} className="text-xs text-gray-700">
                  {m.module_order}. {m.title} — {labels.moduleTypes[m.module_type]}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          {isPartner ? (
            <button
              type="button"
              disabled={busyId === course.id}
              onClick={() => void onAction("start_course", { course_id: course.id })}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
            >
              {labels.quickActions.startCourse}
            </button>
          ) : null}
          {isSuper ? (
            <>
              <button
                type="button"
                disabled={busyId === course.id}
                onClick={() => void onAction("generate_outline", { course_id: course.id })}
                className="text-xs font-medium text-indigo-700 hover:text-indigo-900"
              >
                {labels.quickActions.generateOutline}
              </button>
              <button
                type="button"
                disabled={busyId === course.id}
                onClick={() => void onAction("generate_materials", { course_id: course.id })}
                className="text-xs font-medium text-indigo-700 hover:text-indigo-900"
              >
                {labels.quickActions.generateMaterials}
              </button>
              <button
                type="button"
                disabled={busyId === course.id}
                onClick={() => void onAction("generate_quiz", { course_id: course.id, topic: course.title })}
                className="text-xs font-medium text-indigo-700 hover:text-indigo-900"
              >
                {labels.quickActions.generateQuiz}
              </button>
              {course.status !== "published" ? (
                <button
                  type="button"
                  disabled={busyId === course.id}
                  onClick={() => void onAction("publish_course", { course_id: course.id })}
                  className="text-xs font-medium text-green-700 hover:text-green-900"
                >
                  {labels.quickActions.publishCourse}
                </button>
              ) : null}
              <button
                type="button"
                disabled={busyId === course.id}
                onClick={() => void onAction("export_fiverr_package", { course_id: course.id })}
                className="text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                {labels.quickActions.exportFiverr}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </li>
  );
}
