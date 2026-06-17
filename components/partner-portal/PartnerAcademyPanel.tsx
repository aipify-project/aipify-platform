"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parsePartnerAcademyCertifications,
  parsePartnerAcademyCourses,
  parsePartnerAcademyDashboard,
  type PartnerAcademyCertification,
  type PartnerAcademyCourse,
  type PartnerAcademyDashboard,
} from "@/lib/partner-academy";

type Props = {
  labels: Record<string, string>;
};

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900">{value}</dd>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

export function PartnerAcademyPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<PartnerAcademyDashboard | null>(null);
  const [courses, setCourses] = useState<PartnerAcademyCourse[]>([]);
  const [certifications, setCertifications] = useState<PartnerAcademyCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [certLevel, setCertLevel] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [locale, setLocale] = useState("");
  const [search, setSearch] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (certLevel) params.set("cert_level", certLevel);
    if (difficulty) params.set("difficulty", difficulty);
    if (locale) params.set("locale", locale);
    if (search.trim()) params.set("search", search.trim());
    return params.toString();
  }, [category, certLevel, difficulty, locale, search, status]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [dashRes, coursesRes, certsRes] = await Promise.all([
        fetch("/api/partner/academy"),
        fetch(`/api/partner/academy/courses${queryString ? `?${queryString}` : ""}`),
        fetch("/api/partner/academy/certifications"),
      ]);

      if (dashRes.ok) setDashboard(parsePartnerAcademyDashboard(await dashRes.json()));
      if (coursesRes.ok) {
        const data = (await coursesRes.json()) as { courses?: unknown };
        setCourses(parsePartnerAcademyCourses(data));
      }
      if (certsRes.ok) {
        const data = (await certsRes.json()) as { certifications?: unknown };
        setCertifications(parsePartnerAcademyCertifications(data));
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [queryString]);

  useEffect(() => {
    void load();
  }, [load]);

  const startLearning = async (courseKey?: string) => {
    setBusy(true);
    setMessage(null);
    const key = courseKey ?? dashboard?.recommended_learning[0]?.course_key;
    if (!key) {
      setBusy(false);
      return;
    }
    const res = await fetch("/api/partner/academy/exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start_course_key: key }),
    });
    if (res.ok) {
      setMessage(labels.startedLearning);
      await load();
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  const takeExam = async (examKey: string) => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/partner/academy/exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exam_key: examKey, score_pct: 85 }),
    });
    if (res.ok) {
      setMessage(labels.examSubmitted);
      await load();
    } else {
      const err = (await res.json()) as { error?: string };
      setMessage(err.error ?? labels.actionFailed);
    }
    setBusy(false);
  };

  if (loading && !dashboard) {
    return (
      <div className="space-y-3">
        <AipifyLoader centered />
        <p className="text-center text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const showEmpty =
    dashboard.courses_completed === 0 &&
    dashboard.courses_in_progress === 0 &&
    courses.every((c) => c.status === "not_started");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{labels.title}</h2>
        <p className="mt-1 text-sm text-slate-600">{labels.subtitle}</p>
      </div>

      {showEmpty && (
        <PlatformEmptyState
          title={labels.emptyTitle}
          message={labels.emptyMessage}
          primaryAction={{
            label: labels.startLearning,
            onClick: () => void startLearning(),
          }}
        />
      )}

      {message && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          {message}
        </p>
      )}

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
        <p className="text-sm font-medium text-indigo-950">{dashboard.positioning}</p>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label={labels.academyProgress} value={`${dashboard.academy_progress_pct}%`} />
        <MetricCard label={labels.certificationsEarned} value={dashboard.certifications_earned} />
        <MetricCard label={labels.coursesInProgress} value={dashboard.courses_in_progress} />
        <MetricCard label={labels.coursesCompleted} value={dashboard.courses_completed} />
        <MetricCard
          label={labels.readinessScore}
          value={dashboard.partner_readiness_score}
          sub={labels.readinessSub}
        />
      </dl>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-slate-900">{labels.recommendedLearning}</h3>
        <ul className="mt-4 space-y-3">
          {dashboard.recommended_learning.map((item) => (
            <li
              key={item.course_key}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-600">{item.reason}</p>
              </div>
              <button
                type="button"
                disabled={busy || dashboard.access.limited_access}
                onClick={() => void startLearning(item.course_key)}
                className="rounded-lg bg-indigo-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-800 disabled:opacity-50"
              >
                {labels.startCourse}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-slate-900">{labels.searchFilters}</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filterCategory}</option>
            {dashboard.filters.categories.map((c) => (
              <option key={c} value={c}>
                {labelFor(labels, "category", c)}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filterStatus}</option>
            {dashboard.filters.statuses.map((s) => (
              <option key={s} value={s}>
                {labelFor(labels, "status", s)}
              </option>
            ))}
          </select>
          <select
            value={certLevel}
            onChange={(e) => setCertLevel(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filterCertLevel}</option>
            {dashboard.filters.certification_levels.map((l) => (
              <option key={l} value={l}>
                {labelFor(labels, "certLevel", l)}
              </option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filterDifficulty}</option>
            {dashboard.filters.difficulties.map((d) => (
              <option key={d} value={d}>
                {labelFor(labels, "difficulty", d)}
              </option>
            ))}
          </select>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filterLanguage}</option>
            {dashboard.filters.locales.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-slate-900">{labels.coursesTitle}</h3>
        {courses.length === 0 ? (
          <p className="text-sm text-slate-500">{labels.noCourses}</p>
        ) : (
          courses.map((course) => (
            <article key={course.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">
                    {labels.moduleLabel} {course.module_number}
                  </p>
                  <h4 className="mt-1 text-lg font-semibold text-slate-900">{course.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{course.summary}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {course.progress_pct}% · {labelFor(labels, "status", course.status)}
                </span>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {course.topic_tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-slate-900">{labels.certificationsTitle}</h3>
        <ul className="mt-4 space-y-3">
          {certifications.map((cert) => (
            <li key={cert.id} className="rounded-lg border border-slate-100 px-4 py-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-900">{cert.title}</p>
                  <p className="text-slate-600">
                    {labels.passingScore}: {cert.passing_score}% · {labels.attempts}:{" "}
                    {cert.attempts_used}/{cert.max_attempts}
                  </p>
                </div>
                <span className="text-slate-700">
                  {labelFor(labels, "certStatus", cert.certification_status)}
                </span>
              </div>
              {cert.exam &&
                cert.certification_status !== "earned" &&
                dashboard.access.can_take_exams && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void takeExam(cert.exam!.exam_key)}
                    className="mt-3 rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-50 disabled:opacity-50"
                  >
                    {labels.takeExam}
                  </button>
                )}
            </li>
          ))}
        </ul>
      </section>

      {dashboard.missing_certifications.length > 0 && (
        <section className="rounded-xl border border-amber-100 bg-amber-50/50 p-6">
          <h3 className="font-semibold text-slate-900">{labels.missingCertifications}</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {dashboard.missing_certifications.map((c) => (
              <li key={c.certification_key}>{c.title}</li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.timeline.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">{labels.timelineTitle}</h3>
          <ul className="mt-4 space-y-3">
            {dashboard.timeline.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-slate-600">{item.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
