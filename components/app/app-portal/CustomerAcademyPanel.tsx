"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CERTIFICATION_TYPES,
  parseAcademyOverview,
  type AcademyCourse,
  type CustomerAcademyLabels,
  type AcademyOverviewResponse,
} from "@/lib/app-portal/customer-academy";

type Props = { labels: CustomerAcademyLabels };

const SECTION_KEYS = ["getting_started", "product_training", "knowledge_center"] as const;

export function CustomerAcademyPanel({ labels }: Props) {
  const [data, setData] = useState<AcademyOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [completionStatus, setCompletionStatus] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [search, setSearch] = useState("");
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  const coursesBySection = useMemo(() => {
    const map = new Map<string, AcademyCourse[]>();
    for (const course of data?.courses ?? []) {
      const list = map.get(course.section) ?? [];
      list.push(course);
      map.set(course.section, list);
    }
    return map;
  }, [data?.courses]);

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
      body: JSON.stringify({ course_slug: assignSlug, department: assignDept, due_date: assignDue || undefined, required: true }),
    });
    setBusy(false);
    if (res.ok) {
      setShowAssign(false);
      void load();
    }
  }

  if (loading && !data && !error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error && !data?.found) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <p className="text-slate-600">{labels.accessDenied}</p>
      </div>
    );
  }

  const progress = data?.progress;
  const empty = (progress?.courses_started ?? 0) === 0 && (data?.assigned_training.length ?? 0) === 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      </div>

      {progress ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={labels.dashboard.completionRate} value={`${progress.completion_percent}%`} />
          <Stat label={labels.dashboard.coursesCompleted} value={String(progress.courses_completed)} />
          <Stat label={labels.dashboard.coursesStarted} value={String(progress.courses_started)} />
          <Stat label={labels.dashboard.outstanding} value={String(progress.outstanding_assignments)} />
        </section>
      ) : null}

      {data?.can_manage && (data.team_completion_rate > 0 || data.team_reporting.length > 0) ? (
        <Stat label={labels.dashboard.teamRate} value={`${data.team_completion_rate}%`} />
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          <option value="getting_started">{labels.sections.gettingStarted}</option>
          <option value="product_training">{labels.sections.productTraining}</option>
          <option value="knowledge_center">{labels.sections.knowledgeCenter}</option>
        </select>
        <select value={completionStatus} onChange={(e) => setCompletionStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.completionStatus}</option>
          <option value="not_started">{labels.filters.notStarted}</option>
          <option value="completed">{labels.filters.completed}</option>
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.difficulty}</option>
          <option value="beginner">{labels.difficulties.beginner}</option>
          <option value="intermediate">{labels.difficulties.intermediate}</option>
        </select>
        {data?.can_manage ? (
          <button type="button" onClick={() => setShowAssign(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.assign.title}</button>
        ) : null}
      </section>

      {showAssign && data?.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.assign.title}</h2>
          <select value={assignSlug} onChange={(e) => setAssignSlug(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">{labels.assign.course}</option>
            {(data.courses.filter((c) => c.content_type === "course")).map((c) => (
              <option key={c.slug} value={c.slug}>{c.title}</option>
            ))}
          </select>
          <select value={assignDept} onChange={(e) => setAssignDept(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="support">{labels.assign.supportTeam}</option>
            <option value="operations">{labels.assign.operationsTeam}</option>
            <option value="leadership">{labels.assign.leadershipTeam}</option>
          </select>
          <input type="date" value={assignDue} onChange={(e) => setAssignDue(e.target.value)} aria-label={labels.assign.dueDate} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button type="button" disabled={busy} onClick={() => void assignTraining()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{labels.assign.submit}</button>
            <button type="button" onClick={() => setShowAssign(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">{labels.assign.cancel}</button>
          </div>
        </section>
      ) : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <button type="button" disabled={busy} onClick={() => void completeCourse("welcome_to_aipify")} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{labels.emptyCta}</button>
        </section>
      ) : null}

      {(data?.recommended_courses.length ?? 0) > 0 ? (
        <CourseSection title={labels.dashboard.recommended} courses={data!.recommended_courses} labels={labels} onComplete={completeCourse} busy={busy} />
      ) : null}

      {SECTION_KEYS.map((section) => {
        const courses = coursesBySection.get(section)?.filter((c) => c.content_type === "course") ?? [];
        if (courses.length === 0) return null;
        const title = section === "getting_started" ? labels.sections.gettingStarted
          : section === "product_training" ? labels.sections.productTraining
          : labels.sections.knowledgeCenter;
        return <CourseSection key={section} title={title} courses={courses} labels={labels} onComplete={completeCourse} busy={busy} />;
      })}

      {(data?.assigned_training.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.sections.teamTraining}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data!.assigned_training.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <span>{a.course_title} · {a.required ? labels.course.required : labels.course.optional}</span>
                <span className={`text-xs ${a.status === "overdue" ? "text-red-700" : "text-slate-500"}`}>
                  {a.status === "overdue" ? labels.course.overdue : a.status}
                  {a.due_date ? ` · ${a.due_date}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.sections.certifications}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {CERTIFICATION_TYPES.map((type) => {
            const cert = data?.certifications.find((c) => c.certification_type === type);
            const status = cert?.status ?? "not_started";
            return (
              <div key={type} className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">{labels.certifications[type]}</p>
                <p className="mt-1 text-xs text-slate-500">{status === "earned" ? labels.course.completed : status}</p>
                {cert?.earned_at ? (
                  <p className="mt-1 text-xs text-emerald-700">{new Date(cert.earned_at).toLocaleDateString()}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {(coursesBySection.get("knowledge_center")?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.sections.knowledgeCenter}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {coursesBySection.get("knowledge_center")!.map((item) => (
              <li key={item.slug} className="flex justify-between gap-2">
                <span>{item.title}</span>
                <span className="text-xs text-slate-500">{labels.contentTypes[item.content_type as keyof typeof labels.contentTypes] ?? item.content_type}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data?.can_manage && (data.team_reporting.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.sections.teamReporting}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {data.team_reporting.map((team) => (
              <div key={team.department} className="rounded-xl border border-white bg-white/80 p-4">
                <p className="font-medium text-slate-900">{team.team}</p>
                <p className="mt-2 text-2xl font-semibold text-indigo-700">{team.completion_rate}%</p>
                <p className="mt-1 text-xs text-slate-500">{labels.team.assigned}: {team.assigned_count}</p>
                {team.overdue_count > 0 ? (
                  <p className="mt-1 text-xs text-amber-700">{labels.team.overdue}: {team.overdue_count}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {(data?.suggested_paths.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.suggestedPaths}</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {data!.suggested_paths.map((p) => <li key={p.id}>{p.title}</li>)}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.managersAssign}</dt><dd className="mt-1 text-slate-600">{labels.faq.managersAssignAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.partnerAcademy}</dt><dd className="mt-1 text-slate-600">{labels.faq.partnerAcademyAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function CourseSection({
  title,
  courses,
  labels,
  onComplete,
  busy,
}: {
  title: string;
  courses: AcademyCourse[];
  labels: CustomerAcademyLabels;
  onComplete: (slug: string) => void;
  busy: boolean;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {courses.map((course) => (
          <div key={course.slug} className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium text-slate-900">{course.title}</p>
            <p className="mt-1 text-xs text-slate-500">{course.duration_minutes} {labels.course.minutes} · {labels.difficulties[course.difficulty as keyof typeof labels.difficulties] ?? course.difficulty}</p>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{course.description}</p>
            {course.completed ? (
              <p className="mt-3 text-xs font-medium text-emerald-700">{labels.course.completed}</p>
            ) : (
              <button type="button" disabled={busy} onClick={() => onComplete(course.slug)} className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60">{labels.course.complete}</button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
