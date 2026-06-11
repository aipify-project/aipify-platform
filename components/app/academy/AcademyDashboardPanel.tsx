"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAcademyDashboard,
  type AcademyCourse,
  type AcademyDashboard,
} from "@/lib/aipify/academy";

type AcademyDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "enrolled":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function priorityClass(priority?: string) {
  switch (priority) {
    case "high":
      return "bg-rose-100 text-rose-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function AcademyDashboardPanel({ labels }: AcademyDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<AcademyDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [pillarFilter, setPillarFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/academy/dashboard");
    if (res.ok) setDashboard(parseAcademyDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/academy/briefings/generate", { method: "POST" });
    await load();
  };

  const enrollCourse = async (courseId: string) => {
    setActing(`enroll-${courseId}`);
    await fetch(`/api/aipify/academy/courses/${courseId}/enroll`, { method: "POST" });
    setActing(null);
    await load();
  };

  const completeCourse = async (courseId: string) => {
    setActing(`complete-${courseId}`);
    await fetch(`/api/aipify/academy/courses/${courseId}/complete`, { method: "POST" });
    setActing(null);
    await load();
  };

  const dismissRecommendation = async (recommendationId: string) => {
    setActing(`dismiss-${recommendationId}`);
    await fetch(`/api/aipify/academy/recommendations/${recommendationId}/dismiss`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const progressByCourse = new Map(
    dashboard.course_progress.map((p) => [p.course_title, p])
  );

  const filteredPaths =
    pillarFilter === "all"
      ? dashboard.learning_paths
      : dashboard.learning_paths.filter((lp) => lp.pillar === pillarFilter);

  const courseInProgress = (course: AcademyCourse) => {
    const progress = progressByCourse.get(course.title);
    return progress?.status === "in_progress" || progress?.status === "enrolled";
  };

  const courseCompleted = (course: AcademyCourse) =>
    progressByCourse.get(course.title)?.status === "completed";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        <Link href="/app/learning" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.learningEngine}
        </Link>
        <Link href="/app/partners" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.partners}
        </Link>
      </div>

      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <h2 className="text-sm font-semibold text-sky-900">{labels.learningReadiness}</h2>
        <p className="mt-2 text-4xl font-bold text-sky-800">
          {dashboard.readiness_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-sky-700">
          {dashboard.completion_rate_pct ?? 0}% {labels.completionRate} · {dashboard.participation_pct ?? 0}%{" "}
          {labels.participation}
        </p>
        <p className="mt-2 text-sm text-sky-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-sky-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.coursesCompleted, value: dashboard.courses_completed ?? 0 },
          { label: labels.coursesInProgress, value: dashboard.courses_in_progress ?? 0 },
          { label: labels.certificationProgress, value: `${dashboard.certification_progress_pct ?? 0}%` },
          { label: labels.digitalBadges, value: dashboard.digital_badges.length },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.learningPillars}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(dashboard.learning_pillars ?? []).map((pillar) => (
            <article key={pillar.pillar} className="rounded-lg border border-sky-100 bg-sky-50 p-4">
              <p className="font-medium text-sky-900">{pillar.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.learningPaths}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { id: "all", label: labels.filterAll },
            ...(dashboard.learning_pillars ?? []).map((p) => ({ id: p.pillar, label: p.label })),
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setPillarFilter(f.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                pillarFilter === f.id ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {filteredPaths.map((lp) => (
            <article key={lp.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs font-medium text-sky-700">{lp.pillar_label ?? lp.pillar}</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{lp.access_level}</span>
              </div>
              <p className="mt-2 font-medium text-gray-900">{lp.title}</p>
              <p className="mt-1 text-xs text-gray-600">{lp.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.courses}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.courses.map((course) => (
            <article key={course.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs capitalize text-gray-500">{course.format_type?.replace(/_/g, " ")}</span>
                <span className="text-xs text-gray-500">
                  {course.duration_minutes} {labels.minutes}
                </span>
              </div>
              <p className="mt-2 font-medium text-gray-900">{course.title}</p>
              <p className="mt-1 text-xs text-gray-600">{course.description}</p>
              {course.path_title ? (
                <p className="mt-1 text-xs text-sky-700">
                  {labels.path}: {course.path_title}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {!courseCompleted(course) && !courseInProgress(course) ? (
                  <button
                    type="button"
                    disabled={acting === `enroll-${course.id}`}
                    onClick={() => void enrollCourse(course.id)}
                    className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                  >
                    {labels.enrollCourse}
                  </button>
                ) : null}
                {courseInProgress(course) ? (
                  <button
                    type="button"
                    disabled={acting === `complete-${course.id}`}
                    onClick={() => void completeCourse(course.id)}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {labels.completeCourse}
                  </button>
                ) : null}
                {courseCompleted(course) ? (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass("completed")}`}>
                    {labels.completed}
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      {dashboard.course_progress.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.myProgress}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.course_progress.map((cp) => (
              <li key={cp.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{cp.course_title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(cp.status)}`}>
                  {cp.status?.replace(/_/g, " ")}
                </span>
                <span className="ml-2 text-xs text-gray-600">{cp.progress_pct}%</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recommendations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.recommendations.map((r) => (
              <article key={r.id} className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-amber-900">{r.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${priorityClass(r.priority)}`}>
                    {r.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs text-amber-800">{r.description}</p>
                {r.reason ? <p className="mt-1 text-xs text-amber-700">{r.reason}</p> : null}
                <button
                  type="button"
                  disabled={acting === `dismiss-${r.id}`}
                  onClick={() => void dismissRecommendation(r.id)}
                  className="mt-2 text-xs text-amber-800 underline hover:text-amber-900 disabled:opacity-50"
                >
                  {labels.dismiss}
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.digital_badges.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.digitalBadges}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.digital_badges.map((b) => (
              <span
                key={b.id}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
              >
                {b.title}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.organizational_reports.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.orgDashboard}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.organizational_reports.map((r) => (
              <article key={r.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs capitalize text-gray-500">{r.report_type?.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-gray-900">{r.title}</p>
                {r.summary ? <p className="mt-1 text-xs text-gray-600">{r.summary}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.academy_events.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.upcomingEvents}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.academy_events.map((e) => (
              <li key={e.id} className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm">
                <span className="font-medium text-indigo-900">{e.title}</span>
                <span className="ml-2 text-xs capitalize text-indigo-700">{e.event_type?.replace(/_/g, " ")}</span>
                {e.scheduled_at ? (
                  <span className="ml-2 text-xs text-indigo-600">{new Date(e.scheduled_at).toLocaleDateString()}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.community_resources.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.communityResources}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.community_resources.map((cr) => (
              <article key={cr.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{cr.title}</p>
                <p className="mt-1 text-xs text-gray-600">{cr.description}</p>
                <p className="mt-1 text-xs capitalize text-gray-500">{cr.resource_type?.replace(/_/g, " ")}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.role_based_learning && dashboard.role_based_learning.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.roleBasedLearning}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.role_based_learning.map((rb) => (
              <article key={rb.role} className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="font-medium text-gray-900">{rb.role}</p>
                <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
                  {rb.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.ai_learning_assistant ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50 p-4">
          <h2 className="text-sm font-semibold text-violet-900">{labels.aiLearningAssistant}</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-violet-800">
            {(dashboard.ai_learning_assistant.capabilities ?? []).map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          {dashboard.ai_learning_assistant.note ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.ai_learning_assistant.note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentBriefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
