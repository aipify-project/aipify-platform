"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseLearningEngineDashboard,
  type AdaptiveLearningPathway,
  type CapabilityQuestion,
  type CompanionExample,
  type CompanionGuidanceExample,
  type LearningEngineDashboard,
  type LearningObjective,
  type LearningSignal,
  type LearningSourceCategory,
} from "@/lib/aipify/learning-engine";
import { formatDate } from "@/lib/i18n/format-date";

type LearningEngineDashboardPanelProps = {
  locale: string;
  labels: Record<string, string>;
};

export function LearningEngineDashboardPanel({ locale, labels }: LearningEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<LearningEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/learning-engine/dashboard");
    if (res.ok) setDashboard(parseLearningEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function collect() {
    setCollecting(true);
    await fetch("/api/aipify/learning-engine/collect", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    await load();
    setCollecting(false);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return <div className="p-6 text-sm text-gray-600">{labels.empty}</div>;

  const m = dashboard.metrics;
  const engagement = dashboard.engagement_summary;
  const metricCards = [
    { label: labels.totalEvents, value: m.total_events },
    { label: labels.positiveFeedback, value: m.positive_feedback },
    { label: labels.negativeFeedback, value: m.negative_feedback },
    { label: labels.falsePositivesReduced, value: m.false_positives_reduced },
    { label: labels.suggestionsImproved, value: m.suggestions_improved },
    { label: labels.noisyReduced, value: m.noisy_notifications_reduced },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
          <p className="mt-2 text-sm text-teal-800">{labels.principle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/learning/review" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.reviewCenter}</Link>
          <Link href="/app/learning/feedback" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.feedback}</Link>
          <Link href="/app/learning/rules" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.rules}</Link>
          <Link href="/app/learning/settings" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.settings}</Link>
          <Link href="/app/learning/audit" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.audit}</Link>
          <button type="button" disabled={collecting} onClick={() => void collect()} className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50">{labels.collect}</button>
        </div>
      </div>

      {(dashboard.integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.integration_links?.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label ?? link.route}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.engineTitle}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.mission}</p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-teal-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.core_principle ? (
          <p className="mt-2 text-sm font-medium text-teal-800">{dashboard.core_principle}</p>
        ) : null}
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-teal-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.implementation_blueprint?.engine_phase ? (
          <p className="mt-1 text-xs text-teal-700">
            {dashboard.implementation_blueprint.phase ?? labels.blueprintPhase}
            {dashboard.implementation_blueprint.engine_phase ? ` · ${dashboard.implementation_blueprint.engine_phase}` : ""}
          </p>
        ) : null}
      </section>

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.eventsTotal}: {engagement.learning_events_total ?? 0}</span>
            <span>{labels.eventsLast30d}: {engagement.learning_events_last_30d ?? 0}</span>
            <span>{labels.feedbackTotal}: {engagement.feedback_total ?? 0}</span>
            <span>{labels.scoresTotal}: {engagement.learning_scores_total ?? 0}</span>
            <span>{labels.activeMemory}: {engagement.active_learning_memory ?? 0}</span>
            <span>{labels.activeRules}: {engagement.active_learned_rules ?? 0}</span>
          </div>
        </section>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((c) => (
          <div key={c.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{c.value}</p>
          </div>
        ))}
      </div>

      {dashboard.learning_objectives && dashboard.learning_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.learningObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.learning_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.learning_sources?.categories && dashboard.learning_sources.categories.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.learningSources}</h3>
          {dashboard.learning_sources.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.learning_sources.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.learning_sources.categories.map((category) => (
              <SourceCategoryCard key={category.domain ?? category.label} category={category} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.adaptation_principles?.principle ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.adaptationPrinciples}</h3>
          <p className="mt-2">{dashboard.adaptation_principles.principle}</p>
          {dashboard.adaptation_principles.should && dashboard.adaptation_principles.should.length > 0 ? (
            <>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide">{labels.adaptationShould}</p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-xs">
                {dashboard.adaptation_principles.should.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
          {dashboard.adaptation_principles.should_not && dashboard.adaptation_principles.should_not.length > 0 ? (
            <>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide">{labels.adaptationShouldNot}</p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-xs">
                {dashboard.adaptation_principles.should_not.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_examples && dashboard.companion_examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionExamples}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.companion_examples.map((example) => (
              <CompanionExampleCard key={example.key ?? example.scenario} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {Array.isArray(dashboard.success_criteria) && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.success_criteria.map((item) => {
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
          {dashboard.self_love_connection.self_love_route ? (
            <Link href={dashboard.self_love_connection.self_love_route} className="mt-2 inline-block text-xs underline">
              {labels.openSelfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.trust_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.dogfooding?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.dogfooding}</h3>
          <p className="mt-2 text-gray-600">{dashboard.dogfooding.principle}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.dogfooding.aipify_group ? (
              <DogfoodingCard entry={dashboard.dogfooding.aipify_group} title={labels.aipifyGroup} />
            ) : null}
            {dashboard.dogfooding.unonight ? (
              <DogfoodingCard entry={dashboard.dogfooding.unonight} title={labels.unonightPilot} />
            ) : null}
          </div>
        </section>
      ) : null}

      {(dashboard.vision_phrases ?? []).length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4 text-sm text-teal-900">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {dashboard.vision_phrases?.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.adaptive_organizational_mission ? (
        <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
          <h2 className="text-sm font-semibold text-indigo-900">{labels.adaptiveOrganizationalTitle}</h2>
          <p className="mt-2 text-sm font-medium text-indigo-900">{dashboard.adaptive_organizational_mission}</p>
          {dashboard.adaptive_organizational_philosophy ? (
            <p className="mt-2 text-sm text-indigo-800">{dashboard.adaptive_organizational_philosophy}</p>
          ) : null}
          {dashboard.adaptive_organizational_distinction_note ? (
            <p className="mt-2 text-xs text-indigo-700">{dashboard.adaptive_organizational_distinction_note}</p>
          ) : null}
          {dashboard.adaptive_organizational_vision ? (
            <p className="mt-2 text-sm font-medium italic text-indigo-900">{dashboard.adaptive_organizational_vision}</p>
          ) : null}
          {dashboard.adaptive_organizational_abos_principle ? (
            <p className="mt-2 text-xs text-indigo-800">{dashboard.adaptive_organizational_abos_principle}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.adaptive_organizational_objectives && dashboard.adaptive_organizational_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveOrganizationalObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.adaptive_organizational_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.adaptive_organizational_learning_signals?.signals &&
      dashboard.adaptive_organizational_learning_signals.signals.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveOrganizationalLearningSignals}</h3>
          {dashboard.adaptive_organizational_learning_signals.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.adaptive_organizational_learning_signals.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.adaptive_organizational_learning_signals.signals.map((signal) => (
              <LearningSignalCard key={signal.key ?? signal.label} signal={signal} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.adaptive_organizational_capability_questions?.questions &&
      dashboard.adaptive_organizational_capability_questions.questions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveOrganizationalCapabilityQuestions}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.adaptive_organizational_capability_questions.questions.map((q) => (
              <CapabilityQuestionCard key={q.key ?? q.question} question={q} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.adaptive_organizational_pathways && dashboard.adaptive_organizational_pathways.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveOrganizationalAdaptivePathways}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.adaptive_organizational_pathways.map((pathway) => (
              <AdaptivePathwayCard key={pathway.key ?? pathway.title} pathway={pathway} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.adaptive_organizational_companion_guidance?.principle ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4 text-sm">
          <h3 className="text-sm font-semibold text-emerald-900">{labels.adaptiveOrganizationalCompanionGuidance}</h3>
          <p className="mt-2 text-emerald-900">{dashboard.adaptive_organizational_companion_guidance.principle}</p>
          {dashboard.adaptive_organizational_companion_guidance.companion_name ? (
            <p className="mt-1 text-xs text-emerald-800">
              {dashboard.adaptive_organizational_companion_guidance.companion_name}
              {dashboard.adaptive_organizational_companion_guidance.not_label
                ? ` — ${labels.adaptiveOrganizationalNotAiCoach}`
                : ""}
            </p>
          ) : null}
          {dashboard.adaptive_organizational_companion_guidance.examples?.map((example) => (
            <CompanionGuidanceCard key={example.key ?? example.prompt} example={example} />
          ))}
        </section>
      ) : null}

      {dashboard.adaptive_organizational_knowledge_reinforcement?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.adaptiveOrganizationalKnowledgeReinforcement}</h3>
          <p className="mt-2 text-gray-600">{dashboard.adaptive_organizational_knowledge_reinforcement.principle}</p>
          {dashboard.adaptive_organizational_knowledge_reinforcement.practices?.map((practice) => (
            <p key={practice} className="mt-1 text-xs text-gray-500">· {practice}</p>
          ))}
        </section>
      ) : null}

      {dashboard.adaptive_organizational_community_learning?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.adaptiveOrganizationalCommunityLearning}</h3>
          <p className="mt-2 text-gray-600">{dashboard.adaptive_organizational_community_learning.principle}</p>
        </section>
      ) : null}

      {dashboard.adaptive_organizational_leadership_insights?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.adaptiveOrganizationalLeadershipInsights}</h3>
          <p className="mt-2 text-gray-600">{dashboard.adaptive_organizational_leadership_insights.principle}</p>
          {dashboard.adaptive_organizational_leadership_insights.insights?.map((insight) => (
            <div key={insight.key ?? insight.label} className="mt-2 rounded border border-gray-100 bg-gray-50/50 px-3 py-2 text-xs">
              <p className="font-medium text-gray-900">{insight.label}</p>
              {insight.description ? <p className="mt-1 text-gray-600">{insight.description}</p> : null}
            </div>
          ))}
        </section>
      ) : null}

      {dashboard.adaptive_organizational_privacy_principles?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm">
          <h3 className="text-sm font-semibold text-rose-900">{labels.adaptiveOrganizationalPrivacy}</h3>
          <p className="mt-2 text-rose-900">{dashboard.adaptive_organizational_privacy_principles.principle}</p>
          {dashboard.adaptive_organizational_privacy_principles.forbidden?.map((item) => (
            <p key={item} className="mt-1 text-xs text-rose-800">· {item}</p>
          ))}
        </section>
      ) : null}

      {Array.isArray(dashboard.adaptive_organizational_success_criteria) &&
      dashboard.adaptive_organizational_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.adaptiveOrganizationalSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.adaptive_organizational_success_criteria.map((item) => {
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

      {dashboard.adaptive_organizational_self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.adaptiveOrganizationalSelfLove}</h3>
          <p className="mt-2">{dashboard.adaptive_organizational_self_love_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.adaptive_organizational_trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.adaptiveOrganizationalTrust}</h3>
          <p className="mt-2 text-gray-600">{dashboard.adaptive_organizational_trust_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.adaptive_organizational_engagement_summary ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.adaptiveOrganizationalEngagement}</h3>
          <dl className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <div>
              <dt>{labels.adaptiveOrganizationalLearningSignalsCount}</dt>
              <dd className="font-medium">{dashboard.adaptive_organizational_engagement_summary.learning_signals ?? 0}</dd>
            </div>
            <div>
              <dt>{labels.adaptiveOrganizationalAdaptivePathwaysCount}</dt>
              <dd className="font-medium">{dashboard.adaptive_organizational_engagement_summary.adaptive_pathways ?? 0}</dd>
            </div>
            <div>
              <dt>{labels.adaptiveOrganizationalCapabilityQuestionsCount}</dt>
              <dd className="font-medium">{dashboard.adaptive_organizational_engagement_summary.capability_questions ?? 0}</dd>
            </div>
          </dl>
          {dashboard.adaptive_organizational_engagement_summary.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.adaptive_organizational_engagement_summary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.adaptive_organizational_integration_links &&
      dashboard.adaptive_organizational_integration_links.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.adaptive_organizational_integration_links.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm">
                {link.label ?? link.route}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      {(dashboard.adaptive_organizational_vision_phrases ?? []).length > 0 ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4 text-sm text-indigo-900">
          <h3 className="text-sm font-semibold">{labels.adaptiveOrganizationalVisionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {dashboard.adaptive_organizational_vision_phrases?.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          <h2 className="text-sm font-semibold">{labels.topPatterns}</h2>
          {dashboard.top_patterns.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noPatterns}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {dashboard.top_patterns.map((p) => (
                <li key={p.pattern_key} className="rounded border border-white bg-white px-3 py-2">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{p.pattern_key}</span>
                    <span className="text-teal-700">{Math.round(p.current_score)}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{p.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          <h2 className="text-sm font-semibold">{labels.recentEvents}</h2>
          {dashboard.recent_events.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noEvents}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {dashboard.recent_events.map((e) => (
                <li key={e.id} className="rounded border border-white bg-white px-3 py-2">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{e.event_type}</span>
                    <span className="text-xs text-gray-400">{formatDate(e.created_at, locale)}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{e.source_module} · {e.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="text-xs text-gray-500">{dashboard.privacy_note ?? labels.privacy}</p>
    </div>
  );
}

function ObjectiveCard({ objective }: { objective: LearningObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function SourceCategoryCard({ category }: { category: LearningSourceCategory }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{category.label}</p>
      {category.signals && category.signals.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
          {category.signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function CompanionExampleCard({ example }: { example: CompanionExample }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">
        {example.emoji ? `${example.emoji} ` : ""}{example.scenario}
      </p>
      {example.example ? <p className="mt-1 text-xs text-gray-600">{example.example}</p> : null}
    </div>
  );
}

function DogfoodingCard({ entry, title }: { entry: { role?: string; focus?: string[] }; title: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{title}</p>
      {entry.role ? <p className="mt-1 text-xs text-gray-600">{entry.role}</p> : null}
      {entry.focus && entry.focus.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-500">
          {entry.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function LearningSignalCard({ signal }: { signal: LearningSignal }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{signal.label}</p>
      {signal.description ? <p className="mt-1 text-xs text-gray-600">{signal.description}</p> : null}
      {signal.cross_link ? (
        <Link href={signal.cross_link} className="mt-2 inline-block text-xs underline">
          {signal.cross_link}
        </Link>
      ) : null}
    </div>
  );
}

function CapabilityQuestionCard({ question }: { question: CapabilityQuestion }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">
        {question.emoji ? `${question.emoji} ` : ""}{question.question}
      </p>
      {question.description ? <p className="mt-1 text-xs text-gray-600">{question.description}</p> : null}
    </div>
  );
}

function AdaptivePathwayCard({ pathway }: { pathway: AdaptiveLearningPathway }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{pathway.title}</p>
      {pathway.description ? <p className="mt-1 text-xs text-gray-600">{pathway.description}</p> : null}
      {pathway.topics && pathway.topics.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-500">
          {pathway.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      ) : null}
      {pathway.cross_link ? (
        <Link href={pathway.cross_link} className="mt-2 inline-block text-xs underline">
          {pathway.cross_link_note ?? pathway.cross_link}
        </Link>
      ) : null}
    </div>
  );
}

function CompanionGuidanceCard({ example }: { example: CompanionGuidanceExample }) {
  return (
    <div className="mt-2 rounded border border-emerald-100 bg-white/60 px-3 py-2 text-xs text-emerald-900">
      <p>
        {example.emoji ? `${example.emoji} ` : ""}{example.prompt}
      </p>
      {example.consideration ? <p className="mt-1 text-emerald-700">{example.consideration}</p> : null}
    </div>
  );
}
