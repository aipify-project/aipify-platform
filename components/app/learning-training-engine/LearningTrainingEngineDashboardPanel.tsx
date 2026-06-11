"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseLearningTrainingEngineDashboard,
  type LearningTrainingEngineDashboard,
} from "@/lib/aipify/learning-training-engine";

type Props = { labels: Record<string, string> };

function statusClass(status?: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "in_progress":
      return "bg-sky-100 text-sky-800";
    case "expired":
      return "bg-rose-100 text-rose-800";
    case "not_started":
      return "bg-stone-100 text-stone-700";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function LearningTrainingEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<LearningTrainingEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/learning-training-engine/dashboard");
    if (res.ok) setDashboard(parseLearningTrainingEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const onboarding = dashboard.onboarding_integration ?? {};
  const teamReadiness = dashboard.team_readiness ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/customer-onboarding-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.onboarding}
        </Link>
        <Link href="/app/learning" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.learningEngine}
        </Link>
        <Link href="/app/knowledge-center-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-violet-700">{dashboard.distinction_note}</p>
        ) : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.assigned_paths}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.assigned_paths ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.completed_paths}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.completed_paths ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.in_progress_paths}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.in_progress_paths ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.overdue_paths}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.overdue_paths ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.onboardingIntegration}</h3>
        <p className="mt-2 text-sm text-gray-600">
          {labels.currentStep}: {String(onboarding.current_step ?? "welcome")} ·{" "}
          {String(onboarding.completion_percentage ?? 0)}%
        </p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.assignedPaths}</h3>
        {(dashboard.assigned_paths ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.assigned_paths.map((item, idx) => (
              <li key={String(item.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span>{String(item.path_title ?? item.path_key)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(item.status as string)}`}>
                    {String(item.status ?? "not_started")}
                  </span>
                  <span className="text-xs text-gray-500">{String(item.completion_percentage ?? 0)}%</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recommendedPaths}</h3>
        {(dashboard.recommended_paths ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.recommended_paths.map((item, idx) => (
              <li key={String(item.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <p className="font-medium">{String(item.title ?? item.path_key)}</p>
                <p className="text-xs text-gray-500">{String(item.recommendation_reason ?? "")}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.overdueTraining}</h3>
        {(dashboard.overdue_training ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.overdue_training.map((item, idx) => (
              <li key={String(item.path_key ?? idx)} className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm">
                {String(item.path_title ?? item.path_key)} · {String(item.completion_percentage ?? 0)}%
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recommendedModules}</h3>
        {(dashboard.recommended_modules ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.recommended_modules.map((item, idx) => (
              <li key={String(item.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.title ?? item.module_key)} · {String(item.content_type ?? "article")} ·{" "}
                {String(item.estimated_duration ?? 0)} {labels.minutes}
              </li>
            ))}
          </ul>
        )}
      </section>

      {!teamReadiness.access_denied ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.teamReadiness}</h3>
          <p className="mt-2 text-sm text-gray-600">
            {labels.readinessScore}: {String(teamReadiness.readiness_score ?? 0)}% ·{" "}
            {labels.averageCompletion}: {String(teamReadiness.average_completion ?? 0)}%
          </p>
          <p className="mt-1 text-xs text-gray-500">{String(teamReadiness.privacy_note ?? "")}</p>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.availablePaths}</h3>
        {(dashboard.learning_paths ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.learning_paths.map((item, idx) => (
              <li key={String(item.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.title ?? item.path_key)} · {String(item.category ?? "")} ·{" "}
                {String(item.target_role ?? "")}
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.principles?.length ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
