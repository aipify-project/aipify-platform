"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAipifyUniversityDashboard,
  type AbosSuccessCriterion,
  type AipifyUniversityDashboard,
  type BlueprintObjective,
  type IntegrationLink,
  type UniversityPathway,
} from "@/lib/aipify/aipify-university";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-indigo-900">{objective.description}</p>
      ) : null}
    </div>
  );
}

function SuccessCriterionRow({
  criterion,
  metLabel,
  pendingLabel,
}: {
  criterion: AbosSuccessCriterion;
  metLabel: string;
  pendingLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
      <span className="text-gray-800">{criterion.label}</span>
      <span className={criterion.met ? "text-xs text-green-700" : "text-xs text-amber-700"}>
        {criterion.met ? metLabel : pendingLabel}
      </span>
      {criterion.note ? <p className="w-full text-xs text-gray-500">{criterion.note}</p> : null}
    </div>
  );
}

function PathwayRow({ pathway, minutesLabel }: { pathway: UniversityPathway; minutesLabel: string }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{pathway.title ?? pathway.pathway_key}</span>
        {pathway.estimated_minutes ? (
          <span className="text-xs text-gray-500">
            {pathway.estimated_minutes} {minutesLabel}
          </span>
        ) : null}
      </div>
      {pathway.description ? <p className="mt-1 text-xs text-gray-600">{pathway.description}</p> : null}
      {pathway.cross_link_route ? (
        <Link href={pathway.cross_link_route} className="mt-1 inline-block text-xs text-indigo-700">
          {pathway.cross_link_route}
        </Link>
      ) : null}
    </li>
  );
}

export function AipifyUniversityDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyUniversityDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/aipify-university/dashboard");
    if (res.ok) setDashboard(parseAipifyUniversityDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] =
    dashboard.aubp115_cross_links ?? dashboard.integration_links ?? [];
  const limitationItems = dashboard.limitation_principles?.must_avoid ?? [];
  const selfLovePractices = dashboard.self_love_in_learning?.practices ?? [];
  const coachingExamples = (dashboard.companion_coaching?.examples ?? []) as Array<{
    emoji?: string;
    example?: string;
  }>;
  const securityPrograms = (dashboard.security_training?.programs ?? []) as Array<{
    title?: string;
    route?: string;
  }>;
  const executiveTopics = (dashboard.executive_education?.topics ?? []) as string[];
  const retentionFeatures = (dashboard.knowledge_retention?.features ?? []) as string[];
  const onboardingItems = (dashboard.onboarding_acceleration?.items ?? []) as string[];
  const wellbeingSignals = (dashboard.wellbeing_aware_learning?.signals ?? []) as string[];
  const kcOutputs = (dashboard.knowledge_center_integration?.outputs ?? []) as string[];
  const analyticsMetrics = (dashboard.learning_analytics_meta?.metrics ?? []) as Array<{
    label?: string;
  }>;
  const certifications = (dashboard.certification_framework?.certifications ?? []) as Array<{
    title?: string;
  }>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/learning-training-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.learningTraining}
        </Link>
        <Link href="/app/learning" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.learningEngine}
        </Link>
        <Link href="/app/certification-achievement-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.certifications}
        </Link>
        <Link href="/app/knowledge-center-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        <Link href="/app/self-love-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.selfLove}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5">
        <p className="text-sm font-medium text-indigo-800">{labels.learningScore}</p>
        <p className="text-3xl font-bold text-indigo-900">{dashboard.aggregate_learning_score ?? 0}</p>
        <p className="mt-2 text-sm text-indigo-800">{dashboard.philosophy}</p>
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.wellbeing_aware_enabled ? (
          <p className="mt-2 text-xs text-indigo-600">{labels.wellbeingAware}</p>
        ) : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activePathways}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.active_pathways ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.participationRate}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.participation_rate ?? 0}%</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.completionRate}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.completion_rate ?? 0}%</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.microLearningEvents}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.micro_learning_events ?? 0}</p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.pathways}</h3>
        {(dashboard.pathways ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.pathways
              .filter((p) =>
                [
                  "executive_leadership",
                  "support_excellence",
                  "companion_adoption",
                  "security_awareness",
                  "governance_excellence",
                  "commerce_excellence",
                  "growth_partner",
                  "department_specific",
                  "new_employee_onboarding",
                ].includes(String(p.pathway_type))
              )
              .map((pathway, idx) => (
                <PathwayRow key={String(pathway.id ?? idx)} pathway={pathway} minutesLabel={labels.minutes} />
              ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.microLearning}</h3>
        <p className="mt-1 text-xs text-gray-500">
          {String(dashboard.micro_learning_engine?.principle ?? "")}
        </p>
        {(dashboard.micro_learning_recent ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.micro_learning_recent.map((event, idx) => (
              <li key={String(event.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-gray-600">{event.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.companionCoaching}</h3>
        <p className="mt-1 text-sm text-gray-600">{String(dashboard.companion_coaching?.principle ?? "")}</p>
        {coachingExamples.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {coachingExamples.map((ex, idx) => (
              <li key={idx} className="rounded-lg border border-indigo-50 bg-indigo-50/30 px-3 py-2 text-sm">
                {ex.emoji ? `${ex.emoji} ` : ""}
                {ex.example}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.onboardingAcceleration}</h3>
        {onboardingItems.length > 0 ? (
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-700">
            {onboardingItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.knowledgeRetention}</h3>
        {retentionFeatures.length > 0 ? (
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-700">
            {retentionFeatures.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.executiveCenter}</h3>
        {executiveTopics.length > 0 ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {executiveTopics.map((topic, idx) => (
              <li key={idx} className="rounded border border-gray-100 px-3 py-2 text-sm">
                {topic}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.learningAnalytics}</h3>
        {analyticsMetrics.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {analyticsMetrics.map((metric, idx) => (
              <span key={idx} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                {metric.label}
              </span>
            ))}
          </div>
        ) : null}
        {dashboard.analytics_snapshot ? (
          <p className="mt-3 text-xs text-gray-500">
            {labels.aggregateScore}: {dashboard.analytics_snapshot.aggregate_learning_score ?? 0}
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.certifications}</h3>
        {certifications.length > 0 ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {certifications.map((cert, idx) => (
              <li key={idx} className="rounded border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
                {cert.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        )}
      </section>

      <section className="rounded-xl border border-rose-100 bg-rose-50/30 p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.selfLoveInLearning}</h3>
        <p className="mt-1 text-sm text-gray-700">{dashboard.self_love_in_learning?.principle}</p>
        {selfLovePractices.length > 0 ? (
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-700">
            {selfLovePractices.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-xl border border-amber-100 bg-amber-50/30 p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.wellbeingAware}</h3>
        <p className="mt-1 text-sm text-gray-700">{String(dashboard.wellbeing_aware_learning?.principle ?? "")}</p>
        {wellbeingSignals.length > 0 ? (
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-700">
            {wellbeingSignals.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.securityTraining}</h3>
        {securityPrograms.length > 0 ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {securityPrograms.map((program, idx) => (
              <li key={idx} className="rounded border border-gray-100 px-3 py-2 text-sm">
                {program.route ? (
                  <Link href={program.route} className="text-indigo-700">
                    {program.title}
                  </Link>
                ) : (
                  program.title
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.kcIntegration}</h3>
        {kcOutputs.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {kcOutputs.map((output, idx) => (
              <span key={idx} className="rounded-full bg-sky-100 px-3 py-1 text-xs text-sky-800">
                {output}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.integrationLinks}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {integrationLinks.map((link) => (
            <Link
              key={link.key ?? link.route}
              href={link.route ?? "#"}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
              title={link.note}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(dashboard.aipify_university_objectives ?? []).map((objective, idx) => (
            <ObjectiveCard key={String(objective.key ?? idx)} objective={objective} />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.limitationPrinciples}</h3>
        {limitationItems.length > 0 ? (
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-700">
            {limitationItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
        <div className="mt-3 space-y-2">
          {(dashboard.success_criteria ?? []).map((criterion, idx) => (
            <SuccessCriterionRow
              key={String(criterion.key ?? idx)}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </div>
      </section>

      {dashboard.privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.privacy_note}</p>
      ) : null}
    </div>
  );
}
