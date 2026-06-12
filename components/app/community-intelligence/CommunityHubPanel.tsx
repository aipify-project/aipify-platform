"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCommunityIntelligenceDashboard,
  type CommunityContribution,
  type CommunityIntelligenceDashboard,
  type CompanionExample,
  type CollectiveInsightCategory,
  type CommunityObjective,
  type BestPracticeDomain,
  type CollectiveObservationExample,
  type CollectiveSummaryCategory,
  type CollectiveSummaryType,
} from "@/lib/aipify/community-intelligence";

type CommunityHubPanelProps = {
  labels: Record<string, string>;
};

function InsightCard({ item, labels }: { item: CommunityContribution; labels: Record<string, string> }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
          {item.category_label ?? item.type_label ?? item.contribution_type?.replace(/_/g, " ")}
        </span>
        {item.rating_avg && item.rating_avg > 0 ? (
          <span className="text-xs text-amber-700">
            {item.rating_avg.toFixed(1)} ★ ({item.rating_count ?? 0})
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 font-medium text-gray-900">{item.title}</h3>
      {item.description ? <p className="mt-1 text-sm text-gray-600">{item.description}</p> : null}
    </article>
  );
}

export function CommunityHubPanel({ labels }: CommunityHubPanelProps) {
  const [dashboard, setDashboard] = useState<CommunityIntelligenceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/community-intelligence/dashboard");
    if (res.ok) setDashboard(parseCommunityIntelligenceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/community-intelligence/briefings/generate", { method: "POST" });
    await load();
  };

  const rateContribution = async (id: string, rating: number) => {
    setActing(id);
    await fetch(`/api/aipify/community-intelligence/contributions/${id}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const engagement = dashboard.engagement_summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/community/admin"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-violet-300"
        >
          {labels.adminDashboard}
        </Link>
        {(dashboard.clwbp_integration_links ?? dashboard.integration_links ?? []).map((link) =>
          link.route ? (
            <Link
              key={link.route + (link.label ?? "")}
              href={link.route}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:border-violet-300"
            >
              {link.label ?? link.route}
            </Link>
          ) : null
        )}
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.engineTitle}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.mission}</p>
        ) : null}
        {dashboard.community_philosophy ? (
          <p className="mt-2 text-sm text-violet-900">{dashboard.community_philosophy}</p>
        ) : dashboard.philosophy ? (
          <p className="mt-2 text-sm text-violet-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-violet-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.implementation_blueprint?.engine_phase ? (
          <p className="mt-1 text-xs text-violet-700">
            {dashboard.implementation_blueprint.phase ?? labels.blueprintPhase}
            {dashboard.implementation_blueprint.engine_phase ? ` · ${dashboard.implementation_blueprint.engine_phase}` : ""}
          </p>
        ) : null}
        {dashboard.collective_learning_wisdom_blueprint?.phase ? (
          <p className="mt-1 text-xs text-violet-700">
            {dashboard.collective_learning_wisdom_blueprint.phase}
          </p>
        ) : null}
        {dashboard.inform_not_prescribe_note ? (
          <p className="mt-2 text-xs italic text-violet-800">{dashboard.inform_not_prescribe_note}</p>
        ) : null}
      </section>

      {dashboard.clwbp_mission ? (
        <section className="rounded-xl border border-teal-200 bg-teal-50/40 p-6">
          <h2 className="text-sm font-semibold text-teal-900">{labels.clwbpEngineTitle}</h2>
          <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.clwbp_mission}</p>
          {dashboard.clwbp_philosophy ? (
            <p className="mt-2 text-sm text-teal-900">{dashboard.clwbp_philosophy}</p>
          ) : null}
          {dashboard.clwbp_abos_principle ? (
            <p className="mt-2 text-xs text-teal-800">{dashboard.clwbp_abos_principle}</p>
          ) : null}
          {dashboard.clwbp_distinction_note ? (
            <p className="mt-2 text-xs text-teal-700">{dashboard.clwbp_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.collective_summary ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.collectiveSummary}</h3>
          <CollectiveSummaryGrid summary={dashboard.collective_summary} labels={labels} />
          {dashboard.collective_summary.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.collective_summary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.contributionsTotal}: {engagement.contributions_total ?? 0}</span>
            <span>{labels.publishedContributions}: {engagement.published_contributions ?? 0}</span>
            <span>{labels.pendingReviewsCount}: {engagement.pending_reviews ?? 0}</span>
            <span>{labels.briefingsTotal}: {engagement.briefings_total ?? 0}</span>
            <span>{labels.briefingsLast30d}: {engagement.briefings_last_30d ?? 0}</span>
            <span>{labels.ratingsTotal}: {engagement.ratings_total ?? 0}</span>
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-violet-900">{labels.healthScore}</h2>
            <p className="mt-2 text-3xl font-bold text-violet-800">
              {dashboard.health_score ?? 0}
              <span className="text-lg font-normal text-gray-500">/100</span>
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-violet-900">{labels.intelligenceScore}</h2>
            <p className="mt-2 text-3xl font-bold text-violet-800">
              {dashboard.intelligence_score ?? dashboard.contribution_score ?? 0}
              <span className="text-lg font-normal text-gray-500">/100</span>
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-violet-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-violet-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      {dashboard.community_objectives && dashboard.community_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.communityObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.community_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.clwbp_objectives && dashboard.clwbp_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.clwbpObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.clwbp_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.collective_insight_examples?.categories &&
      dashboard.collective_insight_examples.categories.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.collectiveInsightExamples}</h3>
          {dashboard.collective_insight_examples.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.collective_insight_examples.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.collective_insight_examples.categories.map((category) => (
              <InsightCategoryCard key={category.domain ?? category.label} category={category} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.privacy_principles?.principle ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-4 text-sm text-indigo-900">
          <h3 className="text-sm font-semibold">{labels.privacyPrinciples}</h3>
          <p className="mt-2">{dashboard.privacy_principles.principle}</p>
          {dashboard.privacy_principles.must && dashboard.privacy_principles.must.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.privacy_principles.must.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.community_contributions_blueprint?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.communityContributions}</h3>
          <p className="mt-1 text-xs text-gray-500">{dashboard.community_contributions_blueprint.principle}</p>
          {dashboard.community_contributions_blueprint.contribution_types &&
          dashboard.community_contributions_blueprint.contribution_types.length > 0 ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {dashboard.community_contributions_blueprint.contribution_types.map((type) => (
                <div key={type.key ?? type.label} className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-sm">
                  <p className="font-medium text-gray-900">{type.label}</p>
                  {type.description ? <p className="mt-1 text-xs text-gray-600">{type.description}</p> : null}
                </div>
              ))}
            </div>
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

      {dashboard.collective_observations?.examples && dashboard.collective_observations.examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.collectiveObservations}</h3>
          {dashboard.collective_observations.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.collective_observations.principle}</p>
          ) : null}
          <div className="mt-3 space-y-3">
            {dashboard.collective_observations.examples.map((example) => (
              <CollectiveObservationCard key={example.key ?? example.scenario} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.best_practice_evolution?.domains && dashboard.best_practice_evolution.domains.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.bestPracticeEvolution}</h3>
          {dashboard.best_practice_evolution.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.best_practice_evolution.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.best_practice_evolution.domains.map((domain) => (
              <BestPracticeDomainCard key={domain.key ?? domain.label} domain={domain} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.clwbp_anonymization_principles?.principle ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-4 text-sm text-indigo-900">
          <h3 className="text-sm font-semibold">{labels.clwbpAnonymizationPrinciples}</h3>
          <p className="mt-2">{dashboard.clwbp_anonymization_principles.principle}</p>
          {dashboard.clwbp_anonymization_principles.must && dashboard.clwbp_anonymization_principles.must.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.clwbp_anonymization_principles.must.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.knowledge_center_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.knowledgeCenterConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.knowledge_center_connection.principle}</p>
          {dashboard.knowledge_center_connection.surfaces && dashboard.knowledge_center_connection.surfaces.length > 0 ? (
            <ul className="mt-2 space-y-2 text-xs text-gray-600">
              {dashboard.knowledge_center_connection.surfaces.map((surface) =>
                surface.route ? (
                  <li key={surface.route}>
                    <Link href={surface.route} className="font-medium text-violet-800 underline">
                      {surface.label}
                    </Link>
                    {surface.note ? ` — ${surface.note}` : null}
                  </li>
                ) : (
                  <li key={surface.label}>{surface.label}</li>
                )
              )}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_expert_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.salesExpertConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.sales_expert_connection.principle}</p>
          {dashboard.sales_expert_connection.examples && dashboard.sales_expert_connection.examples.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.sales_expert_connection.examples.map((ex) => (
                <li key={ex.domain}>{ex.domain}: {ex.signal}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.executive_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.executiveConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.executive_connection.principle}</p>
          {dashboard.executive_connection.signals && dashboard.executive_connection.signals.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.executive_connection.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          ) : null}
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

      {Array.isArray(dashboard.clwbp_success_criteria) && dashboard.clwbp_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-teal-200 p-4">
          <h3 className="text-sm font-semibold">{labels.clwbpSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.clwbp_success_criteria.map((item) => {
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

      {dashboard.clwbp_self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.clwbpSelfLoveConnection}</h3>
          <p className="mt-2">{dashboard.clwbp_self_love_connection.principle}</p>
          {dashboard.clwbp_self_love_connection.self_love_route ? (
            <Link href={dashboard.clwbp_self_love_connection.self_love_route} className="mt-2 inline-block text-xs underline">
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

      {dashboard.clwbp_trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.clwbpTrustConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.clwbp_trust_connection.principle}</p>
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

      {dashboard.clwbp_dogfooding?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.clwbpDogfooding}</h3>
          <p className="mt-2 text-gray-600">{dashboard.clwbp_dogfooding.principle}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.clwbp_dogfooding.aipify_group ? (
              <DogfoodingCard entry={dashboard.clwbp_dogfooding.aipify_group} title={labels.aipifyGroup} />
            ) : null}
            {dashboard.clwbp_dogfooding.unonight ? (
              <DogfoodingCard entry={dashboard.clwbp_dogfooding.unonight} title={labels.unonightPilot} />
            ) : null}
          </div>
        </section>
      ) : null}

      {dashboard.score_components ? (
        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.scoreComponents}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(dashboard.score_components).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs capitalize text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(value)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.featuredLearnings}</h2>
        {(dashboard.featured_learnings.length > 0 ? dashboard.featured_learnings : dashboard.featured_insights).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noInsights}</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(dashboard.featured_learnings.length > 0 ? dashboard.featured_learnings : dashboard.featured_insights).map((item) => (
              <InsightCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.bestPractices}</h2>
        {dashboard.best_practices.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noInsights}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.best_practices.map((item) => (
              <li key={item.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{item.title}</span>
                <span className="ml-2 text-xs text-gray-500">{item.type_label}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.popularResources}</h2>
        {(dashboard.popular_resources.length > 0 ? dashboard.popular_resources : dashboard.top_rated).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noInsights}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {(dashboard.popular_resources.length > 0 ? dashboard.popular_resources : dashboard.top_rated).map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm">
                <span className="text-gray-900">{item.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-700">
                    {(item.rating_avg ?? 0).toFixed(1)} ★
                  </span>
                  <button
                    type="button"
                    disabled={acting === item.id}
                    onClick={() => rateContribution(item.id, 5)}
                    className="rounded border border-amber-200 px-2 py-0.5 text-xs text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                  >
                    {labels.rate}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.industry_insights.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.industryInsights}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.industry_insights.map((item) => (
              <li key={item.id} className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
                {item.title}
                {item.description ? <p className="mt-1 text-xs text-indigo-800">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.blueprint_recommendations.length > 0 ? dashboard.blueprint_recommendations : dashboard.blueprint_discussions).length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.blueprintRecommendations}</h2>
          <ul className="mt-3 space-y-2">
            {(dashboard.blueprint_recommendations.length > 0 ? dashboard.blueprint_recommendations : dashboard.blueprint_discussions).map((item) => (
              <li key={item.id} className="rounded-lg border border-purple-100 bg-purple-50 px-3 py-2 text-sm text-purple-900">
                {item.title}
                {item.description ? <p className="mt-1 text-xs text-purple-800">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recently_validated.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentlyValidated}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recently_validated.map((item) => (
              <li key={item.id} className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-sm text-teal-900">
                {item.title}
                <span className="ml-2 text-xs text-teal-700">{item.type_label}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.briefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.intelligence_categories && dashboard.intelligence_categories.length > 0 ? (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.intelligenceCategories}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {dashboard.intelligence_categories.map((c) => (
              <span key={c.key} className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">
                {c.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.approval_workflow && dashboard.approval_workflow.length > 0 ? (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.approvalWorkflow}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {dashboard.approval_workflow.map((step, i) => (
              <span key={step.step} className="flex items-center gap-1 text-xs text-gray-600">
                {i > 0 ? <span className="text-gray-400">→</span> : null}
                <span className="rounded-full bg-white px-3 py-1 shadow-sm">{step.label}</span>
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {(dashboard.vision_phrases ?? []).length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {dashboard.vision_phrases?.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.clwbp_vision_phrases ?? []).length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4 text-sm text-teal-900">
          <h3 className="text-sm font-semibold">{labels.clwbpVisionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {dashboard.clwbp_vision_phrases?.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{dashboard.privacy_note ?? dashboard.safety_note}</p>
    </div>
  );
}

function ObjectiveCard({ objective }: { objective: CommunityObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-sm">
      <p className="font-medium text-gray-900">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function InsightCategoryCard({ category }: { category: CollectiveInsightCategory }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-sm">
      <p className="font-medium capitalize text-gray-900">{category.label ?? category.domain}</p>
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
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">
        {example.emoji ? `${example.emoji} ` : ""}
        {example.scenario}
      </p>
      {example.example ? <p className="mt-1 text-xs text-gray-600">{example.example}</p> : null}
    </div>
  );
}

function DogfoodingCard({ entry, title }: { entry: { role?: string; focus?: string[] }; title: string }) {
  return (
    <div className="rounded border border-gray-100 bg-gray-50/50 p-3 text-xs">
      <p className="font-semibold text-gray-900">{title}</p>
      {entry.role ? <p className="mt-1 text-gray-600">{entry.role}</p> : null}
      {entry.focus && entry.focus.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-0.5 text-gray-600">
          {entry.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function CollectiveObservationCard({ example }: { example: CollectiveObservationExample }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">
        {example.emoji ? `${example.emoji} ` : ""}
        {example.scenario}
      </p>
      {example.example ? <p className="mt-1 text-xs text-gray-600">{example.example}</p> : null}
    </div>
  );
}

function BestPracticeDomainCard({ domain }: { domain: BestPracticeDomain }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-sm">
      <p className="font-medium capitalize text-gray-900">{domain.label ?? domain.key}</p>
      {domain.signals && domain.signals.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
          {domain.signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function CollectiveSummaryGrid({
  summary,
  labels,
}: {
  summary: NonNullable<CommunityIntelligenceDashboard["collective_summary"]>;
  labels: Record<string, string>;
}) {
  return (
    <div className="mt-3 space-y-3">
      <div className="grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
        <span>{labels.tenantContributionsTotal}: {summary.tenant_contributions_total ?? 0}</span>
        <span>{labels.tenantPublished}: {summary.tenant_published ?? 0}</span>
        <span>{labels.ecosystemPublishedTotal}: {summary.ecosystem_published_total ?? 0}</span>
        <span>{labels.ecosystemRecent90d}: {summary.ecosystem_recent_90d ?? 0}</span>
        <span>{labels.ecosystemAvgRating}: {(summary.ecosystem_avg_rating ?? 0).toFixed(1)}</span>
      </div>
      {(summary.ecosystem_categories ?? []).length > 0 ? (
        <div>
          <p className="text-xs font-medium text-gray-700">{labels.ecosystemCategories}</p>
          <ul className="mt-1 space-y-1 text-xs text-gray-600">
            {(summary.ecosystem_categories as CollectiveSummaryCategory[]).map((cat) => (
              <li key={cat.category}>
                {cat.category_label ?? cat.category}: {cat.count ?? 0}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {(summary.ecosystem_contribution_types ?? []).length > 0 ? (
        <div>
          <p className="text-xs font-medium text-gray-700">{labels.ecosystemContributionTypes}</p>
          <ul className="mt-1 space-y-1 text-xs text-gray-600">
            {(summary.ecosystem_contribution_types as CollectiveSummaryType[]).map((t) => (
              <li key={t.contribution_type}>
                {t.type_label ?? t.contribution_type}: {t.count ?? 0}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
