"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalResilienceEngineDashboard,
  type AbosSuccessCriterion,
  type BlueprintGuidanceBlock,
  type BlueprintObjective,
  type OrganizationalResilienceEngineDashboard,
  type ResiliencePlanRecord,
  type ResilienceVulnerabilityRecord,
} from "@/lib/aipify/organizational-resilience-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 p-3 text-sm">
      <p className="font-medium text-gray-900">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function ObjectiveList({ items }: { items?: BlueprintObjective[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ObjectiveCard key={item.key ?? item.label} objective={item} />
      ))}
    </div>
  );
}

function GuidanceList({ items }: { items?: Array<Record<string, unknown>> }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={String(item.key ?? item.question ?? item.prompt ?? item.signal)} className="rounded border border-gray-100 p-2 text-sm">
          <p className="font-medium text-gray-900">
            {item.emoji ? `${String(item.emoji)} ` : ""}
            {String(item.question ?? item.prompt ?? item.signal ?? item.label ?? "")}
          </p>
          {item.description || item.consideration ? (
            <p className="mt-1 text-xs text-gray-600">{String(item.description ?? item.consideration ?? "")}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function CategoryGrid({ block }: { block?: BlueprintGuidanceBlock }) {
  const items = block?.categories ?? block?.domains;
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {items.map((category) => (
        <div key={String(category.key ?? category.label)} className="rounded-lg border border-gray-100 p-3 text-sm">
          <p className="font-medium text-gray-900">{String(category.label ?? "")}</p>
          {Array.isArray(category.examples) && category.examples.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {(category.examples as string[]).map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function SuccessCriteriaList({
  criteria,
  labels,
}: {
  criteria?: AbosSuccessCriterion[];
  labels: Record<string, string>;
}) {
  if (!criteria || criteria.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2 text-sm">
      {criteria.map((criterion) => (
        <li key={criterion.key ?? criterion.label} className="rounded border border-gray-100 p-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-900">{criterion.label}</span>
            <span className={`rounded px-2 py-0.5 text-xs ${criterion.met ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-600"}`}>
              {criterion.met ? labels.criterionMet : labels.criterionPending}
            </span>
          </div>
          {criterion.note ? <p className="mt-1 text-xs text-gray-600">{criterion.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export function OrganizationalResilienceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<OrganizationalResilienceEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<string | null>(null);
  const [resolving, setResolving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-resilience-engine/dashboard");
    if (res.ok) setDashboard(parseOrganizationalResilienceEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const approvePlan = async (plan: ResiliencePlanRecord) => {
    if (!plan.id) return;
    setApproving(plan.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-resilience-engine/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", plan_id: plan.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.approveFailed);
    } else {
      await load();
    }
    setApproving(null);
  };

  const submitForReview = async (plan: ResiliencePlanRecord) => {
    if (!plan.id) return;
    setUpdating(plan.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-resilience-engine/plans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: plan.id, status: "under_review" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.updateFailed);
    } else {
      await load();
    }
    setUpdating(null);
  };

  const recordSimulation = async (plan: ResiliencePlanRecord) => {
    if (!plan.id) return;
    setSimulating(plan.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-resilience-engine/simulations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan_id: plan.id,
        simulation_type: "tabletop",
        outcomes_metadata: { summary: "Tabletop exercise recorded from dashboard" },
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.simulationFailed);
    } else {
      await load();
    }
    setSimulating(null);
  };

  const resolveVulnerability = async (vulnerability: ResilienceVulnerabilityRecord) => {
    if (!vulnerability.id) return;
    setResolving(vulnerability.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-resilience-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resolve_vulnerability", vulnerability_id: vulnerability.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.resolveFailed);
    } else {
      await load();
    }
    setResolving(null);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-gray-900">{dashboard.mission}</p>
        ) : null}
        {dashboard.abos_principle ? (
          <p className="mt-2 text-sm text-gray-700">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-gray-600">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.vision ? (
          <p className="mt-2 text-xs italic text-gray-500">{dashboard.vision}</p>
        ) : null}
      </section>

      {dashboard.resilience_dimensions && dashboard.resilience_dimensions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.dimensions}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.resilience_dimensions.map((dimension) => (
              <div key={dimension.key ?? dimension.label} className="rounded-lg border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">{dimension.label}</p>
                {dimension.examples && dimension.examples.length > 0 ? (
                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
                    {dimension.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.executive_summary && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveSummary}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.executive_summary, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.plans && dashboard.plans.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.plans}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.plans.map((plan) => (
              <div key={plan.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{plan.plan_name}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{plan.scenario_type}</span>
                    <p className="mt-1 text-xs text-gray-600">
                      {labels.reviewFrequency}: {plan.review_frequency}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{plan.status}</span>
                    {plan.status === "draft" && (
                      <>
                        <button
                          type="button"
                          className="rounded border border-teal-300 px-2 py-0.5 text-xs text-teal-700 disabled:opacity-50"
                          disabled={updating === plan.id}
                          onClick={() => void submitForReview(plan)}
                        >
                          {updating === plan.id ? labels.updating : labels.submitReview}
                        </button>
                        <button
                          type="button"
                          className="rounded border border-teal-300 px-2 py-0.5 text-xs text-teal-700 disabled:opacity-50"
                          disabled={approving === plan.id}
                          onClick={() => void approvePlan(plan)}
                        >
                          {approving === plan.id ? labels.approving : labels.approvePlan}
                        </button>
                      </>
                    )}
                    {plan.status === "active" && (
                      <button
                        type="button"
                        className="rounded border border-teal-300 px-2 py-0.5 text-xs text-teal-700 disabled:opacity-50"
                        disabled={simulating === plan.id}
                        onClick={() => void recordSimulation(plan)}
                      >
                        {simulating === plan.id ? labels.recording : labels.recordSimulation}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.vulnerabilities && dashboard.vulnerabilities.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.vulnerabilities}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.vulnerabilities.map((vulnerability) => (
              <div key={vulnerability.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{vulnerability.title}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{vulnerability.severity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{vulnerability.status}</span>
                    {vulnerability.status === "open" && (
                      <button
                        type="button"
                        className="rounded border border-teal-300 px-2 py-0.5 text-xs text-teal-700 disabled:opacity-50"
                        disabled={resolving === vulnerability.id}
                        onClick={() => void resolveVulnerability(vulnerability)}
                      >
                        {resolving === vulnerability.id ? labels.resolving : labels.resolve}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.simulations && dashboard.simulations.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.simulations}</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            {dashboard.simulations.map((sim) => (
              <div key={sim.id} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{sim.simulation_type}</span>
                <span className="ml-2 text-xs">{sim.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.implementation_blueprint_phase81?.phase ? (
        <>
          <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
            <h2 className="text-sm font-semibold">{labels.phase81Title}</h2>
            <p className="mt-1 text-xs text-amber-700">
              {dashboard.implementation_blueprint_phase81.phase}
              {dashboard.implementation_blueprint_phase81.engine_phase
                ? ` · ${dashboard.implementation_blueprint_phase81.engine_phase}`
                : ""}
            </p>
            {dashboard.blueprint_distinction_note ? (
              <p className="mt-2 text-xs text-amber-700">{dashboard.blueprint_distinction_note}</p>
            ) : null}
            {dashboard.blueprint_mission ? (
              <p className="mt-2 text-sm font-medium text-amber-900">{dashboard.blueprint_mission}</p>
            ) : null}
            {dashboard.blueprint_philosophy ? (
              <p className="mt-2 text-sm text-amber-900">{dashboard.blueprint_philosophy}</p>
            ) : null}
            {dashboard.blueprint_abos_principle ? (
              <p className="mt-2 text-xs text-amber-800">{dashboard.blueprint_abos_principle}</p>
            ) : null}
            {dashboard.risk_navigation_engine_note ? (
              <p className="mt-2 text-xs text-amber-800">{dashboard.risk_navigation_engine_note}</p>
            ) : null}
          </section>

          {(dashboard.blueprint_integration_links ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {dashboard.blueprint_integration_links?.map((link) =>
                link.route ? (
                  <Link key={link.route} href={link.route} className="rounded-lg border border-amber-200 px-3 py-1.5 text-sm">
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          ) : null}

          {dashboard.blueprint_objectives && dashboard.blueprint_objectives.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dashboard.blueprint_objectives.map((obj) => (
                  <ObjectiveCard key={obj.key ?? obj.label} objective={obj} />
                ))}
              </div>
            </section>
          ) : null}

          {dashboard.risk_categories?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.riskCategories}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.risk_categories.principle}</p>
              <CategoryGrid block={dashboard.risk_categories} />
            </section>
          ) : null}

          {dashboard.risk_questions?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.riskQuestions}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.risk_questions.principle}</p>
              <GuidanceList items={dashboard.risk_questions.questions} />
            </section>
          ) : null}

          {dashboard.companion_guidance?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.companionGuidance}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.companion_guidance.principle}</p>
              <GuidanceList items={dashboard.companion_guidance.examples} />
            </section>
          ) : null}

          {dashboard.risk_preparedness?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.riskPreparedness}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.risk_preparedness.principle}</p>
              {dashboard.risk_preparedness.dimensions && dashboard.risk_preparedness.dimensions.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {dashboard.risk_preparedness.dimensions.map((dim) => (
                    <ObjectiveCard
                      key={String(dim.key ?? dim.label)}
                      objective={{
                        key: String(dim.key ?? ""),
                        label: String(dim.label ?? ""),
                        description: String(dim.description ?? ""),
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {dashboard.risk_opportunity_balance?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.riskOpportunityBalance}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.risk_opportunity_balance.principle}</p>
              <GuidanceList items={dashboard.risk_opportunity_balance.guidance} />
            </section>
          ) : null}

          {dashboard.leadership_insights?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.leadershipInsights}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.leadership_insights.principle}</p>
              <GuidanceList items={dashboard.leadership_insights.insight_types} />
            </section>
          ) : null}

          {dashboard.blueprint_self_love_connection?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfLoveConnection}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.blueprint_self_love_connection.principle}</p>
              {dashboard.blueprint_self_love_connection.journey_phrase ? (
                <p className="mt-2 text-xs italic text-gray-600">{dashboard.blueprint_self_love_connection.journey_phrase}</p>
              ) : null}
            </section>
          ) : null}

          {dashboard.blueprint_trust_connection?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.blueprint_trust_connection.principle}</p>
            </section>
          ) : null}

          {dashboard.limitation_principles?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.limitationPrinciples}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.limitation_principles.principle}</p>
              {dashboard.limitation_principles.forbidden && dashboard.limitation_principles.forbidden.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-gray-500">{labels.forbidden}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                    {dashboard.limitation_principles.forbidden.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {dashboard.limitation_principles.required && dashboard.limitation_principles.required.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-gray-500">{labels.required}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                    {dashboard.limitation_principles.required.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          ) : null}

          {dashboard.engagement_summary ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div><dt className="text-gray-500">{labels.activePlans}</dt><dd>{String(dashboard.engagement_summary.active_plans ?? 0)}</dd></div>
                <div><dt className="text-gray-500">{labels.openVulnerabilities}</dt><dd>{String(dashboard.engagement_summary.open_vulnerabilities ?? 0)}</dd></div>
                <div><dt className="text-gray-500">{labels.completedSimulations}</dt><dd>{String(dashboard.engagement_summary.completed_simulations ?? 0)}</dd></div>
              </dl>
            </section>
          ) : null}

          {dashboard.blueprint_success_criteria && dashboard.blueprint_success_criteria.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
              <SuccessCriteriaList criteria={dashboard.blueprint_success_criteria} labels={labels} />
            </section>
          ) : null}

          {dashboard.blueprint_vision_phrases && dashboard.blueprint_vision_phrases.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.visionPhrases}</h3>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
                {dashboard.blueprint_vision_phrases.map((phrase) => (
                  <li key={phrase}>{phrase}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}

      {dashboard.implementation_blueprint_phase91?.phase ? (
        <>
          <section className="rounded-xl border border-rose-200 bg-rose-50/50 p-6">
            <h2 className="text-sm font-semibold">{labels.phase91Title}</h2>
            <p className="mt-1 text-xs text-rose-700">
              {dashboard.implementation_blueprint_phase91.phase}
              {dashboard.implementation_blueprint_phase91.engine_phase
                ? ` · ${dashboard.implementation_blueprint_phase91.engine_phase}`
                : ""}
            </p>
            {dashboard.recovery_distinction_note ? (
              <p className="mt-2 text-xs text-rose-700">{dashboard.recovery_distinction_note}</p>
            ) : null}
            {dashboard.recovery_mission ? (
              <p className="mt-2 text-sm font-medium text-rose-900">{dashboard.recovery_mission}</p>
            ) : null}
            {dashboard.recovery_philosophy ? (
              <p className="mt-2 text-sm text-rose-900">{dashboard.recovery_philosophy}</p>
            ) : null}
            {dashboard.recovery_abos_principle ? (
              <p className="mt-2 text-xs text-rose-800">{dashboard.recovery_abos_principle}</p>
            ) : null}
            {dashboard.recovery_engine_note ? (
              <p className="mt-2 text-xs text-rose-800">{dashboard.recovery_engine_note}</p>
            ) : null}
            {dashboard.recovery_vision ? (
              <p className="mt-2 text-xs italic text-rose-700">{dashboard.recovery_vision}</p>
            ) : null}
          </section>

          {(dashboard.recovery_integration_links ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {dashboard.recovery_integration_links?.map((link) =>
                link.route ? (
                  <Link key={link.route} href={link.route} className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm">
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          ) : null}

          {dashboard.recovery_objectives && dashboard.recovery_objectives.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoveryObjectives}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dashboard.recovery_objectives.map((obj) => (
                  <ObjectiveCard key={obj.key ?? obj.label} objective={obj} />
                ))}
              </div>
            </section>
          ) : null}

          {dashboard.recovery_resilience_domains?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.resilienceDomains}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.recovery_resilience_domains.principle}</p>
              <CategoryGrid block={dashboard.recovery_resilience_domains} />
            </section>
          ) : null}

          {dashboard.recovery_resilience_questions?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.resilienceQuestions}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.recovery_resilience_questions.principle}</p>
              <GuidanceList items={dashboard.recovery_resilience_questions.questions} />
            </section>
          ) : null}

          {dashboard.recovery_companion_guidance?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoveryCompanionGuidance}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.recovery_companion_guidance.principle}</p>
              <GuidanceList items={dashboard.recovery_companion_guidance.examples} />
            </section>
          ) : null}

          {dashboard.recovery_reflection?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoveryReflection}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.recovery_reflection.principle}</p>
              {dashboard.recovery_reflection.dimensions && dashboard.recovery_reflection.dimensions.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {dashboard.recovery_reflection.dimensions.map((dim) => (
                    <ObjectiveCard
                      key={String(dim.key ?? dim.label)}
                      objective={{
                        key: String(dim.key ?? ""),
                        label: String(dim.label ?? ""),
                        description: String(dim.description ?? ""),
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {dashboard.recovery_learning_through_adversity &&
          typeof dashboard.recovery_learning_through_adversity.principle === "string" ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.learningThroughAdversity}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.recovery_learning_through_adversity.principle}</p>
              {Array.isArray(dashboard.recovery_learning_through_adversity.practices) ? (
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
                  {(dashboard.recovery_learning_through_adversity.practices as string[]).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          {dashboard.recovery_leadership_insights?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoveryLeadershipInsights}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.recovery_leadership_insights.principle}</p>
              <GuidanceList items={dashboard.recovery_leadership_insights.insight_types} />
            </section>
          ) : null}

          {dashboard.recovery_self_love_connection?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoverySelfLoveConnection}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.recovery_self_love_connection.principle}</p>
              {dashboard.recovery_self_love_connection.journey_phrase ? (
                <p className="mt-2 text-xs italic text-gray-600">{dashboard.recovery_self_love_connection.journey_phrase}</p>
              ) : null}
            </section>
          ) : null}

          {dashboard.recovery_trust_connection?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoveryTrustConnection}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.recovery_trust_connection.principle}</p>
            </section>
          ) : null}

          {dashboard.recovery_limitation_principles?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoveryLimitationPrinciples}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.recovery_limitation_principles.principle}</p>
              {dashboard.recovery_limitation_principles.forbidden &&
              dashboard.recovery_limitation_principles.forbidden.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-gray-500">{labels.forbidden}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                    {dashboard.recovery_limitation_principles.forbidden.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {dashboard.recovery_limitation_principles.required &&
              dashboard.recovery_limitation_principles.required.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-gray-500">{labels.required}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                    {dashboard.recovery_limitation_principles.required.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          ) : null}

          {dashboard.recovery_engagement_summary ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoveryEngagementSummary}</h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div><dt className="text-gray-500">{labels.activePlans}</dt><dd>{String(dashboard.recovery_engagement_summary.active_plans ?? 0)}</dd></div>
                <div><dt className="text-gray-500">{labels.completedReviews}</dt><dd>{String(dashboard.recovery_engagement_summary.completed_reviews ?? 0)}</dd></div>
                <div><dt className="text-gray-500">{labels.completedSimulations}</dt><dd>{String(dashboard.recovery_engagement_summary.completed_simulations ?? 0)}</dd></div>
              </dl>
            </section>
          ) : null}

          {dashboard.recovery_success_criteria && dashboard.recovery_success_criteria.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoverySuccessCriteria}</h3>
              <SuccessCriteriaList criteria={dashboard.recovery_success_criteria} labels={labels} />
            </section>
          ) : null}

          {dashboard.recovery_vision_phrases && dashboard.recovery_vision_phrases.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoveryVisionPhrases}</h3>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
                {dashboard.recovery_vision_phrases.map((phrase) => (
                  <li key={phrase}>{phrase}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}

      {dashboard.implementation_blueprint_phase128?.phase ? (
        <>
          <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
            <h2 className="text-sm font-semibold">{labels.phase128Title}</h2>
            <p className="mt-1 text-xs text-sky-700">
              {dashboard.implementation_blueprint_phase128.phase}
              {dashboard.implementation_blueprint_phase128.engine_phase
                ? ` · ${dashboard.implementation_blueprint_phase128.engine_phase}`
                : ""}
              {dashboard.implementation_blueprint_phase128.era
                ? ` · ${dashboard.implementation_blueprint_phase128.era}`
                : ""}
            </p>
            {dashboard.continuity_companion_distinction_note ? (
              <p className="mt-2 text-xs text-sky-700">{dashboard.continuity_companion_distinction_note}</p>
            ) : null}
            {dashboard.continuity_companion_mission ? (
              <p className="mt-2 text-sm font-medium text-sky-900">{dashboard.continuity_companion_mission}</p>
            ) : null}
            {dashboard.continuity_companion_philosophy ? (
              <p className="mt-2 text-sm text-sky-900">{dashboard.continuity_companion_philosophy}</p>
            ) : null}
            {dashboard.continuity_companion_abos_principle ? (
              <p className="mt-2 text-xs text-sky-800">{dashboard.continuity_companion_abos_principle}</p>
            ) : null}
            {dashboard.continuity_companion_engine_note ? (
              <p className="mt-2 text-xs text-sky-800">{dashboard.continuity_companion_engine_note}</p>
            ) : null}
            {dashboard.continuity_companion_vision ? (
              <p className="mt-2 text-xs italic text-sky-700">{dashboard.continuity_companion_vision}</p>
            ) : null}
          </section>

          {(dashboard.continuity_companion_cross_links ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {dashboard.continuity_companion_cross_links?.map((link) =>
                link.route ? (
                  <Link key={link.route + String(link.label)} href={link.route} className="rounded-lg border border-sky-200 px-3 py-1.5 text-sm">
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          ) : null}

          {dashboard.continuity_companion_objectives && dashboard.continuity_companion_objectives.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.continuityCompanionObjectives}</h3>
              <ObjectiveList items={dashboard.continuity_companion_objectives} />
            </section>
          ) : null}

          {dashboard.resilience_center && dashboard.resilience_center.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.resilienceCenter}</h3>
              <ObjectiveList items={dashboard.resilience_center} />
            </section>
          ) : null}

          {dashboard.business_continuity_engine && dashboard.business_continuity_engine.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.businessContinuityEngine}</h3>
              <ObjectiveList items={dashboard.business_continuity_engine} />
            </section>
          ) : null}

          {dashboard.resilience_assessment && dashboard.resilience_assessment.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.resilienceAssessment}</h3>
              <ObjectiveList items={dashboard.resilience_assessment} />
            </section>
          ) : null}

          {dashboard.dependency_protection?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.dependencyProtection}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.dependency_protection.principle}</p>
              <CategoryGrid block={{ categories: dashboard.dependency_protection.examples as Array<Record<string, unknown>> | undefined }} />
            </section>
          ) : null}

          {dashboard.recovery_orchestration && dashboard.recovery_orchestration.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoveryOrchestration}</h3>
              <ObjectiveList items={dashboard.recovery_orchestration} />
            </section>
          ) : null}

          {dashboard.resilience_companion_supports && dashboard.resilience_companion_supports.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.resilienceCompanionSupports}</h3>
              <ObjectiveList items={dashboard.resilience_companion_supports} />
            </section>
          ) : null}

          {dashboard.leadership_continuity_supports?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.leadershipContinuitySupports}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.leadership_continuity_supports.principle}</p>
              <ObjectiveList
                items={(dashboard.leadership_continuity_supports.supports ?? []).map((item) => ({
                  key: String(item.key ?? ""),
                  label: String(item.label ?? ""),
                  description: String(item.description ?? ""),
                }))}
              />
            </section>
          ) : null}

          {dashboard.resilience_exercise_framework?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.resilienceExerciseFramework}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.resilience_exercise_framework.principle}</p>
              <ObjectiveList
                items={(dashboard.resilience_exercise_framework.exercise_types ?? []).map((item) => ({
                  key: String(item.key ?? ""),
                  label: String(item.label ?? ""),
                  description: String(item.description ?? ""),
                }))}
              />
            </section>
          ) : null}

          {dashboard.continuity_companion_adaptation?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.continuityCompanionAdaptation}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.continuity_companion_adaptation.principle}</p>
              <GuidanceList items={dashboard.continuity_companion_adaptation.examples} />
            </section>
          ) : null}

          {dashboard.continuity_self_love_connection?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.continuitySelfLoveConnection}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.continuity_self_love_connection.principle}</p>
              {dashboard.continuity_self_love_connection.journey_phrase ? (
                <p className="mt-2 text-xs italic text-gray-600">{dashboard.continuity_self_love_connection.journey_phrase}</p>
              ) : null}
            </section>
          ) : null}

          {dashboard.continuity_knowledge_library && dashboard.continuity_knowledge_library.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.continuityKnowledgeLibrary}</h3>
              <ObjectiveList items={dashboard.continuity_knowledge_library} />
            </section>
          ) : null}

          {dashboard.continuity_companion_limitation_principles?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.continuityCompanionLimitationPrinciples}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.continuity_companion_limitation_principles.principle}</p>
              {dashboard.continuity_companion_limitation_principles.forbidden &&
              dashboard.continuity_companion_limitation_principles.forbidden.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-gray-500">{labels.forbidden}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                    {dashboard.continuity_companion_limitation_principles.forbidden.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {dashboard.continuity_companion_limitation_principles.required &&
              dashboard.continuity_companion_limitation_principles.required.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-gray-500">{labels.required}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                    {dashboard.continuity_companion_limitation_principles.required.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          ) : null}

          {dashboard.continuity_companion_engagement_summary ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.continuityCompanionEngagementSummary}</h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div><dt className="text-gray-500">{labels.activePlans}</dt><dd>{String(dashboard.continuity_companion_engagement_summary.phase128_active_plans ?? dashboard.continuity_companion_engagement_summary.active_plans ?? 0)}</dd></div>
                <div><dt className="text-gray-500">{labels.openVulnerabilities}</dt><dd>{String(dashboard.continuity_companion_engagement_summary.phase128_open_vulnerabilities ?? dashboard.continuity_companion_engagement_summary.open_vulnerabilities ?? 0)}</dd></div>
                <div><dt className="text-gray-500">{labels.completedSimulations}</dt><dd>{String(dashboard.continuity_companion_engagement_summary.phase128_completed_simulations ?? dashboard.continuity_companion_engagement_summary.completed_simulations ?? 0)}</dd></div>
              </dl>
            </section>
          ) : null}

          {dashboard.continuity_companion_success_criteria && dashboard.continuity_companion_success_criteria.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.continuityCompanionSuccessCriteria}</h3>
              <SuccessCriteriaList criteria={dashboard.continuity_companion_success_criteria} labels={labels} />
            </section>
          ) : null}
        </>
      ) : null}

      {dashboard.implementation_blueprint_phase136?.phase ? (
        <>
          <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
            <h2 className="text-sm font-semibold">{labels.phase136Title}</h2>
            <p className="mt-1 text-xs text-violet-700">
              {dashboard.implementation_blueprint_phase136.phase}
              {dashboard.implementation_blueprint_phase136.engine_phase
                ? ` · ${dashboard.implementation_blueprint_phase136.engine_phase}`
                : ""}
              {dashboard.implementation_blueprint_phase136.era
                ? ` · ${dashboard.implementation_blueprint_phase136.era}`
                : ""}
            </p>
            {dashboard.self_healing_distinction_note ? (
              <p className="mt-2 text-xs text-violet-700">{dashboard.self_healing_distinction_note}</p>
            ) : null}
            {dashboard.self_healing_mission ? (
              <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.self_healing_mission}</p>
            ) : null}
            {dashboard.self_healing_philosophy ? (
              <p className="mt-2 text-sm text-violet-900">{dashboard.self_healing_philosophy}</p>
            ) : null}
            {dashboard.self_healing_abos_principle ? (
              <p className="mt-2 text-xs text-violet-800">{dashboard.self_healing_abos_principle}</p>
            ) : null}
            {dashboard.self_healing_operations_engine_note ? (
              <p className="mt-2 text-xs text-violet-800">{dashboard.self_healing_operations_engine_note}</p>
            ) : null}
            {dashboard.self_healing_vision ? (
              <p className="mt-2 text-xs italic text-violet-700">{dashboard.self_healing_vision}</p>
            ) : null}
          </section>

          {(dashboard.self_healing_integration_links ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {dashboard.self_healing_integration_links?.map((link) =>
                link.route ? (
                  <Link key={link.route + String(link.label)} href={link.route} className="rounded-lg border border-violet-200 px-3 py-1.5 text-sm">
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          ) : null}

          {dashboard.self_healing_objectives && dashboard.self_healing_objectives.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfHealingObjectives}</h3>
              <ObjectiveList items={dashboard.self_healing_objectives} />
            </section>
          ) : null}

          {dashboard.self_healing_operations_center && dashboard.self_healing_operations_center.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfHealingOperationsCenter}</h3>
              <ObjectiveList items={dashboard.self_healing_operations_center} />
            </section>
          ) : null}

          {dashboard.operational_health_engine && dashboard.operational_health_engine.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.operationalHealthEngine}</h3>
              <ObjectiveList items={dashboard.operational_health_engine} />
            </section>
          ) : null}

          {dashboard.recovery_detection_engine && dashboard.recovery_detection_engine.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoveryDetectionEngine}</h3>
              <ObjectiveList items={dashboard.recovery_detection_engine} />
            </section>
          ) : null}

          {dashboard.self_healing_framework?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfHealingFramework}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.self_healing_framework.principle}</p>
              <ObjectiveList
                items={(dashboard.self_healing_framework.includes ?? []).map((item) => ({
                  key: String(item.key ?? ""),
                  label: String(item.label ?? ""),
                  description: String(item.description ?? ""),
                }))}
              />
            </section>
          ) : null}

          {dashboard.recovery_companion_supports && dashboard.recovery_companion_supports.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoveryCompanionSupports}</h3>
              <ObjectiveList items={dashboard.recovery_companion_supports} />
            </section>
          ) : null}

          {dashboard.incident_learning_engine && dashboard.incident_learning_engine.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.incidentLearningEngine}</h3>
              <ObjectiveList items={dashboard.incident_learning_engine} />
            </section>
          ) : null}

          {dashboard.recovery_orchestration_engine && dashboard.recovery_orchestration_engine.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.recoveryOrchestrationEngine}</h3>
              <ObjectiveList items={dashboard.recovery_orchestration_engine} />
            </section>
          ) : null}

          {dashboard.organizational_healing_principles && dashboard.organizational_healing_principles.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.organizationalHealingPrinciples}</h3>
              <ObjectiveList items={dashboard.organizational_healing_principles} />
            </section>
          ) : null}

          {dashboard.self_healing_companion_adaptation?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfHealingCompanionAdaptation}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.self_healing_companion_adaptation.principle}</p>
              <GuidanceList items={dashboard.self_healing_companion_adaptation.examples} />
            </section>
          ) : null}

          {dashboard.self_healing_self_love_connection?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfHealingSelfLoveConnection}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.self_healing_self_love_connection.principle}</p>
              {dashboard.self_healing_self_love_connection.journey_phrase ? (
                <p className="mt-2 text-xs italic text-gray-600">{dashboard.self_healing_self_love_connection.journey_phrase}</p>
              ) : null}
            </section>
          ) : null}

          {dashboard.self_healing_security_requirements && dashboard.self_healing_security_requirements.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfHealingSecurityRequirements}</h3>
              <ObjectiveList items={dashboard.self_healing_security_requirements} />
            </section>
          ) : null}

          {dashboard.self_healing_limitation_principles?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfHealingLimitationPrinciples}</h3>
              <p className="mt-2 text-sm text-gray-700">{dashboard.self_healing_limitation_principles.principle}</p>
              {dashboard.self_healing_limitation_principles.forbidden &&
              dashboard.self_healing_limitation_principles.forbidden.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-gray-500">{labels.forbidden}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                    {dashboard.self_healing_limitation_principles.forbidden.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {dashboard.self_healing_limitation_principles.required &&
              dashboard.self_healing_limitation_principles.required.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-gray-500">{labels.required}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                    {dashboard.self_healing_limitation_principles.required.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          ) : null}

          {dashboard.self_healing_recovery_events && dashboard.self_healing_recovery_events.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfHealingRecoveryEvents}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {dashboard.self_healing_recovery_events.map((event) => (
                  <li key={String(event.id ?? event.event_title)} className="rounded border border-gray-100 p-2">
                    <span className="font-medium text-gray-900">{event.event_title}</span>
                    {event.status ? <span className="ml-2 text-xs text-gray-500">{event.status}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {dashboard.self_healing_recovery_recommendations && dashboard.self_healing_recovery_recommendations.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfHealingRecoveryRecommendations}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {dashboard.self_healing_recovery_recommendations.map((rec) => (
                  <li key={String(rec.id ?? rec.recommendation_title)} className="rounded border border-gray-100 p-2">
                    <span className="font-medium text-gray-900">{rec.recommendation_title}</span>
                    {rec.status ? <span className="ml-2 text-xs text-gray-500">{rec.status}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {dashboard.self_healing_engagement_summary ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfHealingEngagementSummary}</h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div><dt className="text-gray-500">{labels.openRecoveryEvents}</dt><dd>{String(dashboard.self_healing_engagement_summary.phase136_open_events ?? 0)}</dd></div>
                <div><dt className="text-gray-500">{labels.recoveringEvents}</dt><dd>{String(dashboard.self_healing_engagement_summary.phase136_recovering_events ?? 0)}</dd></div>
                <div><dt className="text-gray-500">{labels.pendingRecommendations}</dt><dd>{String(dashboard.self_healing_engagement_summary.phase136_pending_recommendations ?? 0)}</dd></div>
              </dl>
            </section>
          ) : null}

          {dashboard.self_healing_success_criteria && dashboard.self_healing_success_criteria.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfHealingSuccessCriteria}</h3>
              <SuccessCriteriaList criteria={dashboard.self_healing_success_criteria} labels={labels} />
            </section>
          ) : null}

          {dashboard.self_healing_vision_phrases && dashboard.self_healing_vision_phrases.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfHealingVisionPhrases}</h3>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
                {dashboard.self_healing_vision_phrases.map((phrase) => (
                  <li key={phrase}>{phrase}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
