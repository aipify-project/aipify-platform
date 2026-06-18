"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatExecutiveMetric, formatOverviewMetric } from "@/lib/ui/overview-metrics";
import {
  parseEducationTrainingLearningOperationsCenter,
  type EducationTrainingLearningOperationsCenter,
} from "@/lib/aipify/education-training-learning-operations-pack";

type Props = { labels: Record<string, string> };

export function EducationTrainingLearningOperationsPackDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<EducationTrainingLearningOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentStatus, setStudentStatus] = useState("enrolled");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/education-training-learning-operations-pack/dashboard");
    if (res.ok) {
      setCenter(parseEducationTrainingLearningOperationsCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const createStudent = async () => {
    if (!studentName.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/education-training-learning-operations-pack/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_student",
        full_name: studentName.trim(),
        student_status: studentStatus,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setStudentName("");
      await load();
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} centered />
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const ops = center.operations ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricStudents, formatOverviewMetric(overview.students)],
            [labels.metricCourses, formatOverviewMetric(overview.courses)],
            [labels.metricPrograms, formatOverviewMetric(overview.programs)],
            [labels.metricInstructors, formatOverviewMetric(overview.instructors)],
            [labels.metricCompletion, formatOverviewMetric(overview.completion_rates)],
            [labels.metricCertification, formatOverviewMetric(overview.certification_rates)],
            [labels.metricOutcomes, formatOverviewMetric(overview.learning_outcomes)],
            [labels.metricHealth, formatOverviewMetric(overview.education_health_score)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.operationsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            [labels.openStudents, ops.students_route],
            [labels.openCourses, ops.courses_route],
            [labels.openPrograms, ops.programs_route],
            [labels.openInstructors, ops.instructors_route],
            [labels.openAssessments, ops.assessments_route],
            [labels.openCertifications, ops.certifications_route],
            [labels.openAcademy, ops.academy_route],
            [labels.openExecutive, center.executive_dashboard?.executive_route as string],
          ].map(([label, href]) =>
            href ? (
              <Link
                key={String(label)}
                href={href}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
              >
                {label}
              </Link>
            ) : null
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.studentsTitle}</h2>
        {(center.students ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noStudents}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.students ?? []).map((s) => (
              <li key={s.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span>
                  <span className="font-medium text-gray-900">{s.full_name}</span>
                  <span className="ml-2 text-gray-500">{s.progress_percent}%</span>
                </span>
                <span className="text-gray-600">{s.student_status}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.studentNamePlaceholder}
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={studentStatus}
            onChange={(e) => setStudentStatus(e.target.value)}
          >
            <option value="prospective">{labels.statusProspective}</option>
            <option value="enrolled">{labels.statusEnrolled}</option>
            <option value="active">{labels.statusActive}</option>
          </select>
          <button
            type="button"
            disabled={creating}
            onClick={() => void createStudent()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? labels.creating : labels.addStudent}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.coursesTitle}</h2>
        {(center.courses ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noCourses}</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {(center.courses ?? []).slice(0, 10).map((c) => (
              <li key={c.id} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span>{c.course_name}</span>
                <span>{c.completion_rate}% · {c.course_status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        <div className="mt-4 space-y-4">
          {(center.advisor_signals ?? []).map((sig) => (
            <article key={sig.id} className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{sig.observation}</p>
              {sig.recommendation ? (
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {labels.recommendation}: {sig.recommendation}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <p className="text-sm text-gray-500">
        {labels.academyCrossLink}{" "}
        <Link href={center.academy_route ?? "/app/academy"} className="underline">
          {labels.academyLink}
        </Link>
        {" · "}
        <Link href={center.industry_packs_route ?? "/app/industry-packs"} className="underline">
          {labels.industryPacksLink}
        </Link>
      </p>
    </div>
  );
}
