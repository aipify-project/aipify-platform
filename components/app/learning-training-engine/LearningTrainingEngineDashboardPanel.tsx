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

      {dashboard.human_potential_mission ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50/50 p-6">
          <h2 className="text-sm font-semibold text-rose-900">{labels.humanPotentialTitle}</h2>
          <p className="mt-2 text-sm text-rose-900">{dashboard.human_potential_mission}</p>
          {dashboard.human_potential_philosophy ? (
            <p className="mt-2 text-sm text-rose-800">{dashboard.human_potential_philosophy}</p>
          ) : null}
          {dashboard.human_potential_distinction_note ? (
            <p className="mt-2 text-xs text-rose-700">{dashboard.human_potential_distinction_note}</p>
          ) : null}
          {dashboard.human_potential_vision ? (
            <p className="mt-2 text-sm font-medium italic text-rose-900">{dashboard.human_potential_vision}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.human_potential_objectives && dashboard.human_potential_objectives.length > 0 ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4">
          <h3 className="text-sm font-semibold text-rose-900">{labels.humanPotentialObjectives}</h3>
          <ul className="mt-3 space-y-2 text-sm text-rose-900">
            {dashboard.human_potential_objectives.map((item) => (
              <li key={String(item.key ?? item.label)}>
                <span className="font-medium">{String(item.label ?? "")}</span>
                {item.description ? <span className="text-rose-700"> — {String(item.description)}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.human_potential_development_questions?.questions &&
      dashboard.human_potential_development_questions.questions.length > 0 ? (
        <section className="rounded-lg border border-rose-100 bg-white p-4">
          <h3 className="text-sm font-semibold text-rose-900">{labels.humanPotentialDevelopmentQuestions}</h3>
          <ul className="mt-3 space-y-2 text-sm text-rose-900">
            {dashboard.human_potential_development_questions.questions.map((q) => (
              <li key={q.key ?? q.question}>
                {q.emoji ? `${q.emoji} ` : ""}
                <span className="font-medium">{q.question}</span>
                {q.description ? <p className="text-xs text-rose-700">{q.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.human_potential_strength_based_development?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.humanPotentialStrengthBased}</h3>
          <p className="mt-2 text-gray-600">{dashboard.human_potential_strength_based_development.principle}</p>
          {dashboard.human_potential_strength_based_development.practices?.map((p) => (
            <p key={p} className="mt-1 text-xs text-gray-500">
              {p}
            </p>
          ))}
        </section>
      ) : null}

      {dashboard.human_potential_learning_pathways && dashboard.human_potential_learning_pathways.length > 0 ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4">
          <h3 className="text-sm font-semibold text-rose-900">{labels.humanPotentialLearningPathways}</h3>
          <ul className="mt-3 space-y-3">
            {dashboard.human_potential_learning_pathways.map((path) => (
              <li key={String(path.key ?? path.title)} className="rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm">
                <p className="font-medium text-rose-900">{path.title}</p>
                {path.designed_for && path.designed_for.length > 0 ? (
                  <p className="mt-1 text-xs text-rose-700">
                    {labels.designedFor}: {path.designed_for.join(", ")}
                  </p>
                ) : null}
                {path.topics && path.topics.length > 0 ? (
                  <ul className="mt-1 list-inside list-disc text-xs text-rose-800">
                    {path.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                ) : null}
                {path.cross_link ? (
                  <Link href={path.cross_link} className="mt-1 inline-block text-xs text-teal-700 hover:underline">
                    {path.cross_link_note ?? path.cross_link}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.human_potential_career_companion_support?.principle ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4">
          <h3 className="text-sm font-semibold text-emerald-900">{labels.humanPotentialCareerCompanion}</h3>
          <p className="mt-2 text-sm text-emerald-900">{dashboard.human_potential_career_companion_support.principle}</p>
          {dashboard.human_potential_career_companion_support.companion_name ? (
            <p className="mt-1 text-xs text-emerald-700">
              {dashboard.human_potential_career_companion_support.companion_name}
              {dashboard.human_potential_career_companion_support.not_label
                ? ` — ${labels.humanPotentialNotAiCoach}`
                : null}
            </p>
          ) : null}
          {dashboard.human_potential_career_companion_support.examples?.map((exp) => (
            <p key={exp.key ?? exp.prompt} className="mt-2 text-sm text-emerald-900">
              {exp.emoji ? `${exp.emoji} ` : ""}
              {exp.prompt}
            </p>
          ))}
        </section>
      ) : null}

      {dashboard.human_potential_talent_mobility?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.humanPotentialTalentMobility}</h3>
          <p className="mt-2 text-gray-600">{dashboard.human_potential_talent_mobility.principle}</p>
          {dashboard.human_potential_talent_mobility.dimensions?.map((dim) => (
            <p key={dim.key ?? dim.label} className="mt-1 text-xs text-gray-500">
              <span className="font-medium text-gray-700">{dim.label}</span>
              {dim.description ? ` — ${dim.description}` : ""}
            </p>
          ))}
        </section>
      ) : null}

      {dashboard.human_potential_recognition_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.humanPotentialRecognition}</h3>
          <p className="mt-2">{dashboard.human_potential_recognition_connection.principle}</p>
          {dashboard.human_potential_recognition_connection.recognition_types?.map((rt) => (
            <p key={rt.key ?? rt.label} className="mt-1 text-xs">
              {rt.emoji ? `${rt.emoji} ` : ""}
              {rt.label}
            </p>
          ))}
        </section>
      ) : null}

      {dashboard.human_potential_privacy_principles?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.humanPotentialPrivacy}</h3>
          <p className="mt-2 text-gray-600">{dashboard.human_potential_privacy_principles.principle}</p>
          {dashboard.human_potential_privacy_principles.forbidden?.map((f) => (
            <p key={f} className="mt-1 text-xs text-gray-500">
              {f}
            </p>
          ))}
        </section>
      ) : null}

      {Array.isArray(dashboard.human_potential_success_criteria) &&
      dashboard.human_potential_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-rose-100 p-4">
          <h3 className="text-sm font-semibold text-rose-900">{labels.humanPotentialSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.human_potential_success_criteria.map((item) => {
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

      {dashboard.human_potential_self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.humanPotentialSelfLove}</h3>
          <p className="mt-2">{dashboard.human_potential_self_love_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.human_potential_trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.humanPotentialTrust}</h3>
          <p className="mt-2 text-gray-600">{dashboard.human_potential_trust_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.human_potential_engagement_summary ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.humanPotentialEngagement}</h3>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-gray-500">{labels.humanPotentialPathways}</dt>
              <dd className="font-medium">{dashboard.human_potential_engagement_summary.learning_pathways ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.userCompletedPaths}</dt>
              <dd className="font-medium">{dashboard.human_potential_engagement_summary.user_completed_paths ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.humanPotentialMobilityDimensions}</dt>
              <dd className="font-medium">
                {dashboard.human_potential_engagement_summary.talent_mobility_dimensions ?? 0}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.humanPotentialDevelopmentQuestionsCount}</dt>
              <dd className="font-medium">{dashboard.human_potential_engagement_summary.development_questions ?? 0}</dd>
            </div>
          </dl>
          {dashboard.human_potential_engagement_summary.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.human_potential_engagement_summary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.human_potential_integration_links && dashboard.human_potential_integration_links.length > 0 ? (
        <section className="rounded-lg border border-rose-100 p-4">
          <h3 className="text-sm font-semibold text-rose-900">{labels.humanPotentialIntegrationLinks}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.human_potential_integration_links.map((link) => (
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
