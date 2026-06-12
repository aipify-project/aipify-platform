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

      {dashboard.training_objectives && dashboard.training_objectives.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.trainingObjectives}</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {dashboard.training_objectives.map((item) => (
              <li key={String(item.key ?? item.label)}>
                <span className="font-medium text-gray-800">{String(item.label ?? "")}</span>
                {item.description ? <span className="text-gray-500"> — {String(item.description)}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.blueprint_learning_paths && dashboard.blueprint_learning_paths.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4">
          <h3 className="text-sm font-semibold text-violet-900">{labels.blueprintLearningPaths}</h3>
          <ul className="mt-3 space-y-3">
            {dashboard.blueprint_learning_paths.map((path) => (
              <li key={String(path.key ?? path.title)} className="rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm">
                <p className="font-medium text-violet-900">{path.title}</p>
                {path.designed_for && path.designed_for.length > 0 ? (
                  <p className="mt-1 text-xs text-violet-700">
                    {labels.designedFor}: {path.designed_for.join(", ")}
                  </p>
                ) : null}
                {path.topics && path.topics.length > 0 ? (
                  <ul className="mt-1 list-inside list-disc text-xs text-violet-800">
                    {path.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.learning_experiences && dashboard.learning_experiences.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.learningExperiences}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.learning_experiences.map((exp) => (
              <li key={exp}>{exp}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.certification_principles?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.certificationPrinciples}</h3>
          <p className="mt-2 text-gray-600">{dashboard.certification_principles.principle}</p>
          {dashboard.certification_principles.requirements?.map((req) => (
            <p key={req} className="mt-1 text-xs text-gray-500">
              {req}
            </p>
          ))}
        </section>
      ) : null}

      {dashboard.companion_examples && dashboard.companion_examples.length > 0 ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4">
          <h3 className="text-sm font-semibold text-emerald-900">{labels.companionExamples}</h3>
          <ul className="mt-2 space-y-2 text-sm text-emerald-900">
            {dashboard.companion_examples.map((exp) => (
              <li key={exp.key ?? exp.example}>
                {exp.emoji ? `${exp.emoji} ` : ""}
                {exp.example}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {Array.isArray(dashboard.blueprint_success_criteria) && dashboard.blueprint_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.blueprint_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.trust_connection_blueprint?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnectionBlueprint}</h3>
          <p className="mt-2 text-gray-600">{dashboard.trust_connection_blueprint.principle}</p>
        </section>
      ) : null}

      {dashboard.knowledge_center_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.knowledgeCenterConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.knowledge_center_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.engagement_summary ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-gray-500">{labels.activeLearningPaths}</dt>
              <dd className="font-medium">{dashboard.engagement_summary.active_learning_paths ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.userCompletedPaths}</dt>
              <dd className="font-medium">{dashboard.engagement_summary.user_completed_paths ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.trainingAssessments}</dt>
              <dd className="font-medium">{dashboard.engagement_summary.training_assessments ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.userActiveCertificates}</dt>
              <dd className="font-medium">{dashboard.engagement_summary.user_active_certificates ?? 0}</dd>
            </div>
          </dl>
          {dashboard.engagement_summary.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.engagement_summary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.blueprint_integration_links && dashboard.blueprint_integration_links.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.blueprint_integration_links.map((link) => (
              <li key={String(link.key ?? link.route)}>
                {link.route ? (
                  <Link href={link.route} className="font-medium text-teal-700 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium">{link.label}</span>
                )}
                {link.note ? <p className="text-xs text-gray-500">{link.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
