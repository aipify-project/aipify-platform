"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCustomerLifecycleDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CompanionGuidanceExample,
  type CustomerLifecycleDashboard,
  type CustomerRecommendation,
  type IntegrationLink,
  type JourneyStage,
} from "@/lib/aipify/customer-lifecycle";

type CustomerLifecycleDashboardPanelProps = {
  labels: Record<string, string>;
};

function bandClass(band?: string) {
  switch (band) {
    case "thriving":
      return "text-emerald-700";
    case "healthy":
      return "text-teal-700";
    case "support_opportunity":
      return "text-amber-700";
    case "at_risk":
      return "text-orange-700";
    case "critical":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

function stageActive(stage: string, current?: string) {
  return stage === current;
}

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-sky-900">{objective.description}</p> : null}
    </div>
  );
}

function JourneyStageChip({ stage }: { stage: JourneyStage }) {
  return (
    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800" title={stage.purpose}>
      {stage.step ? `${stage.step}. ` : ""}
      {stage.label}
    </span>
  );
}

function CompanionGuidanceCard({ example }: { example: CompanionGuidanceExample }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <p className="font-medium">
        {example.emoji ? `${example.emoji} ` : ""}
        {example.prompt}
      </p>
      {example.consideration ? <p className="mt-1 text-xs text-gray-600">{example.consideration}</p> : null}
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

function RecommendationCard({
  rec,
  labels,
  acting,
  onAction,
}: {
  rec: CustomerRecommendation;
  labels: Record<string, string>;
  acting: string | null;
  onAction: (id: string, action: "accept" | "dismiss") => void;
}) {
  const busy = acting === rec.id;
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="text-xs capitalize text-gray-500">{rec.category?.replace(/_/g, " ")}</span>
        <span className="text-xs font-medium capitalize text-gray-600">{rec.priority}</span>
      </div>
      <p className="mt-1 font-medium text-gray-900">{rec.recommendation}</p>
      {rec.rationale ? <p className="mt-1 text-xs text-gray-500">{rec.rationale}</p> : null}
      {rec.status === "pending" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(rec.id, "accept")}
            className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {labels.accept}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(rec.id, "dismiss")}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {labels.dismiss}
          </button>
        </div>
      ) : null}
    </article>
  );
}

function JsonDimensionList({
  data,
  keyField = "label",
  descField = "description",
}: {
  data?: Record<string, unknown>;
  keyField?: string;
  descField?: string;
}) {
  const items = data?.dimensions ?? data?.signals ?? data?.opportunities ?? data?.capabilities;
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2">
      {(items as Array<Record<string, string>>).map((item, i) => (
        <li key={item.key ?? item[keyField] ?? i} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
          <span className="font-medium">
            {item.emoji ? `${item.emoji} ` : ""}
            {item[keyField]}
          </span>
          {item[descField] ? <p className="mt-1 text-xs text-gray-600">{item[descField]}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export function CustomerLifecycleDashboardPanel({ labels }: CustomerLifecycleDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<CustomerLifecycleDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/customer-lifecycle/dashboard");
    if (res.ok) setDashboard(parseCustomerLifecycleDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/customer-lifecycle/briefings/generate", { method: "POST" });
    await load();
  };

  const onRecommendationAction = async (id: string, action: "accept" | "dismiss") => {
    setActing(id);
    await fetch(`/api/aipify/customer-lifecycle/recommendations/${id}/${action}`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] = dashboard.cjibp108_integration_links ?? [];
  const engagement = dashboard.customer_journey_intelligence_engagement_summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/customer-success-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.customerSuccessEngine}
        </Link>
        <Link href="/app/customer-onboarding-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.customerOnboarding}
        </Link>
        <Link href="/app/partners" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.growthPartners}
        </Link>
        <Link
          href="/app/meeting-collaboration-intelligence-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.meetingCompanion}
        </Link>
        <Link href="/app/value-realization-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.valueRealization}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        {integrationLinks.map((link) =>
          link.route ? (
            <Link key={link.route + (link.key ?? "")} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null,
        )}
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.blueprintTitle}</h2>
        {dashboard.implementation_blueprint_phase108?.phase ? (
          <p className="mt-1 text-xs text-indigo-700">
            {dashboard.implementation_blueprint_phase108.phase}
            {dashboard.implementation_blueprint_phase108.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase108.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.customer_journey_intelligence_mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">{dashboard.customer_journey_intelligence_mission}</p>
        ) : null}
        {dashboard.customer_journey_intelligence_philosophy ? (
          <p className="mt-2 text-sm text-indigo-900">{dashboard.customer_journey_intelligence_philosophy}</p>
        ) : null}
        {dashboard.customer_journey_intelligence_abos_principle ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.customer_journey_intelligence_abos_principle}</p>
        ) : null}
        {dashboard.customer_journey_intelligence_distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.customer_journey_intelligence_distinction_note}</p>
        ) : null}
        {dashboard.customer_journey_intelligence_engine_note ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.customer_journey_intelligence_engine_note}</p>
        ) : null}
        {dashboard.customer_journey_intelligence_vision ? (
          <p className="mt-2 text-xs italic text-indigo-800">{dashboard.customer_journey_intelligence_vision}</p>
        ) : null}
        {dashboard.customer_journey_intelligence_privacy_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.customer_journey_intelligence_privacy_note}</p>
        ) : null}
      </section>

      {dashboard.customer_journey_intelligence_objectives &&
      dashboard.customer_journey_intelligence_objectives.length > 0 ? (
        <section className="rounded-xl border border-sky-200 p-6">
          <h3 className="text-sm font-semibold text-sky-900">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.customer_journey_intelligence_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.customer_journey_stages && dashboard.customer_journey_stages.length > 0 ? (
        <section className="rounded-xl border border-sky-200 p-6">
          <h3 className="text-sm font-semibold text-sky-900">{labels.customerJourneyStages}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.customer_journey_stages.map((stage) => (
              <JourneyStageChip key={stage.key ?? stage.label} stage={stage} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.journey_insights ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.journeyInsights}</h3>
          {typeof dashboard.journey_insights.principle === "string" ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.journey_insights.principle}</p>
          ) : null}
          <JsonDimensionList data={dashboard.journey_insights} />
        </section>
      ) : null}

      {dashboard.customer_experience_dashboard ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.customerExperienceDashboard}</h3>
          {typeof dashboard.customer_experience_dashboard.principle === "string" ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.customer_experience_dashboard.principle}</p>
          ) : null}
          <JsonDimensionList data={dashboard.customer_experience_dashboard} />
        </section>
      ) : null}

      {dashboard.onboarding_intelligence ? (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-6">
          <h3 className="text-sm font-semibold text-emerald-900">{labels.onboardingIntelligence}</h3>
          {typeof dashboard.onboarding_intelligence.principle === "string" ? (
            <p className="mt-2 text-sm text-emerald-900">{dashboard.onboarding_intelligence.principle}</p>
          ) : null}
          <JsonDimensionList data={dashboard.onboarding_intelligence} />
        </section>
      ) : null}

      {dashboard.adoption_intelligence ? (
        <section className="rounded-xl border border-teal-200 bg-teal-50/30 p-6">
          <h3 className="text-sm font-semibold text-teal-900">{labels.adoptionIntelligence}</h3>
          {typeof dashboard.adoption_intelligence.principle === "string" ? (
            <p className="mt-2 text-sm text-teal-900">{dashboard.adoption_intelligence.principle}</p>
          ) : null}
          <JsonDimensionList data={dashboard.adoption_intelligence} />
        </section>
      ) : null}

      {dashboard.customer_success_companion_guidance?.examples &&
      dashboard.customer_success_companion_guidance.examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionGuidance}</h3>
          {dashboard.customer_success_companion_guidance.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.customer_success_companion_guidance.principle}</p>
          ) : null}
          {dashboard.customer_success_companion_guidance.companion_name ? (
            <p className="mt-1 text-xs text-gray-600">
              {dashboard.customer_success_companion_guidance.companion_name}
              {dashboard.customer_success_companion_guidance.not_label
                ? ` — ${labels.notGenericAi}: ${dashboard.customer_success_companion_guidance.not_label}`
                : ""}
            </p>
          ) : null}
          <div className="mt-3 space-y-2">
            {dashboard.customer_success_companion_guidance.examples.map((example) => (
              <CompanionGuidanceCard key={example.key ?? example.prompt} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.customer_journey_privacy_principles ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50/30 p-6">
          <h3 className="text-sm font-semibold text-rose-900">{labels.privacyPrinciples}</h3>
          {dashboard.customer_journey_privacy_principles.principle ? (
            <p className="mt-2 text-sm text-rose-900">{dashboard.customer_journey_privacy_principles.principle}</p>
          ) : null}
          {dashboard.customer_journey_privacy_principles.must_avoid &&
          dashboard.customer_journey_privacy_principles.must_avoid.length > 0 ? (
            <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-rose-800">
              {dashboard.customer_journey_privacy_principles.must_avoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.customer_journey_self_love_connection?.quotes &&
      dashboard.customer_journey_self_love_connection.quotes.length > 0 ? (
        <section className="rounded-xl border border-sky-200 bg-sky-50/30 p-6">
          <h3 className="text-sm font-semibold text-sky-900">{labels.selfLoveConnection}</h3>
          {dashboard.customer_journey_self_love_connection.principle ? (
            <p className="mt-2 text-sm text-sky-900">{dashboard.customer_journey_self_love_connection.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-xs italic text-sky-800">
            {dashboard.customer_journey_self_love_connection.quotes.map((quote) => (
              <li key={quote}>{quote}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.customer_journey_intelligence_success_criteria &&
      dashboard.customer_journey_intelligence_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.customer_journey_intelligence_success_criteria.map((criterion) => (
              <SuccessCriterionRow
                key={criterion.key ?? criterion.label}
                criterion={criterion}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}

      {engagement ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: labels.engagementMilestones, value: engagement.milestones_count ?? 0 },
            { label: labels.engagementQuickWins, value: engagement.quick_wins_count ?? 0 },
            { label: labels.engagementRecommendations, value: engagement.pending_recommendations ?? 0 },
            { label: labels.engagementOnboarding, value: Math.round(engagement.onboarding_completion ?? 0) },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs text-gray-500">{m.label}</p>
              <p className="text-lg font-semibold text-gray-900">{m.value}</p>
            </div>
          ))}
        </section>
      ) : null}

      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <h2 className="text-sm font-semibold text-sky-900">{labels.successScore}</h2>
        <p className={`mt-2 text-4xl font-bold ${bandClass(dashboard.health_band)}`}>
          {dashboard.success_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className={`mt-1 text-sm font-medium ${bandClass(dashboard.health_band)}`}>
          {dashboard.health_band_label}
        </p>
        <p className="mt-2 text-sm text-sky-800">
          {labels.currentStage}: <span className="font-medium">{dashboard.lifecycle_stage_label}</span>
        </p>
        <p className="mt-1 text-xs text-sky-700">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-sky-600">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      {dashboard.lifecycle_stages && dashboard.lifecycle_stages.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.lifecycleStages}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.lifecycle_stages.map((s) => (
              <span
                key={s.key}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  stageActive(s.key, dashboard.lifecycle_stage)
                    ? "bg-sky-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                title={s.purpose}
              >
                {s.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.score_components ? (
        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.scoreComponents}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(dashboard.score_components).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs capitalize text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(value)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.quick_wins.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-emerald-800">{labels.quickWins}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.quick_wins.map((w) => (
              <li key={w.id} className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                {w.description}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.milestones.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.milestones}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.milestones.map((m) => (
              <li key={m.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
                {m.description}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.signals ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {Array.isArray(dashboard.signals.positive) && dashboard.signals.positive.length > 0 ? (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
              <h3 className="text-sm font-semibold text-emerald-800">{labels.positiveSignals}</h3>
              <ul className="mt-2 space-y-1">
                {dashboard.signals.positive.map((s, i) => (
                  <li key={i} className="text-sm text-emerald-900">{s}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {Array.isArray(dashboard.signals.risk) && dashboard.signals.risk.length > 0 ? (
            <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
              <h3 className="text-sm font-semibold text-amber-800">{labels.riskSignals}</h3>
              <ul className="mt-2 space-y-1">
                {dashboard.signals.risk.map((s, i) => (
                  <li key={i} className="text-sm text-amber-900">{s}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h2>
        {dashboard.recommendations.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noRecommendations}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {dashboard.recommendations.map((r) => (
              <RecommendationCard
                key={r.id}
                rec={r}
                labels={labels}
                acting={acting}
                onAction={onRecommendationAction}
              />
            ))}
          </div>
        )}
      </section>

      {dashboard.playbooks.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.playbooks}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.playbooks.map((p) => {
              const content = p.content as { focus?: string; steps?: string[] } | undefined;
              return (
                <div key={p.id} className="rounded-lg border border-gray-200 p-4">
                  <p className="font-medium text-gray-900">{p.playbook_name}</p>
                  <p className="text-xs capitalize text-gray-500">{p.audience?.replace(/_/g, " ")}</p>
                  {content?.focus ? <p className="mt-2 text-sm text-gray-600">{content.focus}</p> : null}
                  {content?.steps ? (
                    <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
                      {content.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
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
    </div>
  );
}
