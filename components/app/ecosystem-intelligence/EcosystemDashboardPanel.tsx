"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseEcosystemIntelligenceDashboard,
  type AbosSuccessCriterion,
  type BlueprintGuidanceBlock,
  type BlueprintObjective,
  type EcosystemIntelligenceDashboard,
  type EcosystemRelationship,
  type EcosystemDependency,
  type EcosystemRisk,
  type EcosystemOpportunity,
} from "@/lib/aipify/ecosystem-intelligence";

type EcosystemDashboardPanelProps = {
  labels: Record<string, string>;
};

function bandClass(band?: string) {
  switch (band) {
    case "highly_resilient":
      return "text-emerald-700";
    case "healthy":
      return "text-teal-700";
    case "improvement_opportunities":
      return "text-amber-700";
    case "risk_concerns":
      return "text-orange-700";
    case "critical_vulnerabilities":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

function severityClass(severity?: string) {
  switch (severity) {
    case "low":
      return "bg-blue-100 text-blue-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "critical":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 p-3 text-sm">
      <p className="font-medium text-gray-900">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function GuidanceList({ items }: { items?: Array<Record<string, unknown>> }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li
          key={String(item.key ?? item.question ?? item.prompt ?? item.signal ?? item.label)}
          className="rounded border border-gray-100 p-2 text-sm"
        >
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
  if (!block?.categories || block.categories.length === 0) return null;
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {block.categories.map((category) => (
        <div key={String(category.key ?? category.label)} className="rounded-lg border border-gray-100 p-3 text-sm">
          <p className="font-medium text-gray-900">{String(category.label ?? "")}</p>
          {category.description ? (
            <p className="mt-1 text-xs text-gray-600">{String(category.description)}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function DimensionGrid({ block }: { block?: BlueprintGuidanceBlock }) {
  if (!block?.dimensions || block.dimensions.length === 0) return null;
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {block.dimensions.map((dim) => (
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
            <span
              className={`rounded px-2 py-0.5 text-xs ${criterion.met ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-600"}`}
            >
              {criterion.met ? labels.criterionMet : labels.criterionPending}
            </span>
          </div>
          {criterion.note ? <p className="mt-1 text-xs text-gray-600">{criterion.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}

function importanceClass(importance?: string) {
  switch (importance) {
    case "critical":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function RelationshipCard({
  relationship,
  labels,
}: {
  relationship: EcosystemRelationship;
  labels: Record<string, string>;
}) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900">{relationship.relationship_name}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${importanceClass(relationship.strategic_importance)}`}
        >
          {relationship.strategic_importance}
        </span>
      </div>
      <p className="mt-1 text-xs capitalize text-gray-500">
        {relationship.category?.replace(/_/g, " ")} · {labels.dependency}: {relationship.dependency_level}
      </p>
      {relationship.description ? (
        <p className="mt-2 text-sm text-gray-600">{relationship.description}</p>
      ) : null}
      {relationship.value_contribution ? (
        <p className="mt-1 text-xs text-teal-700">{relationship.value_contribution}</p>
      ) : null}
      {relationship.primary_owner ? (
        <div className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
          <p>
            <span className="font-medium">{labels.primaryOwner}:</span> {relationship.primary_owner}
          </p>
          {relationship.secondary_owner ? (
            <p className="mt-0.5">
              <span className="font-medium">{labels.secondaryOwner}:</span> {relationship.secondary_owner}
            </p>
          ) : null}
          {relationship.continuity_owner ? (
            <p className="mt-0.5">
              <span className="font-medium">{labels.continuityOwner}:</span> {relationship.continuity_owner}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function EcosystemDashboardPanel({ labels }: EcosystemDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<EcosystemIntelligenceDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/ecosystem-intelligence/dashboard");
    if (res.ok) setDashboard(parseEcosystemIntelligenceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/ecosystem-intelligence/briefings/generate", { method: "POST" });
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const blueprint = dashboard.ecosystem_intelligence_external_relationship_blueprint;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.ecosystemScore}</h2>
        <p className={`mt-2 text-4xl font-bold ${bandClass(dashboard.ecosystem_band)}`}>
          {dashboard.ecosystem_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className={`mt-1 text-sm font-medium ${bandClass(dashboard.ecosystem_band)}`}>
          {dashboard.ecosystem_band_label}
        </p>
        <p className="mt-2 text-sm text-teal-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-teal-700">{dashboard.safety_note}</p>
        {dashboard.consent_required && !dashboard.external_monitoring_consent ? (
          <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {labels.consentNote}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

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
        <h2 className="text-sm font-semibold text-gray-900">{labels.relationshipMaps}</h2>
        {dashboard.relationships.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noRelationships}</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.relationships.map((r) => (
              <RelationshipCard key={r.id} relationship={r} labels={labels} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.criticalDependencies}</h2>
        {dashboard.critical_dependencies.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noDependencies}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.critical_dependencies.map((d: EcosystemDependency) => (
              <li key={d.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-gray-900">{d.dependency_name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${severityClass(d.criticality_level)}`}
                  >
                    {d.criticality_level}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  {d.relationship_name} · {d.dependency_type?.replace(/_/g, " ")}
                </p>
                {d.continuity_plan_reference ? (
                  <p className="mt-1 text-xs text-teal-700">{d.continuity_plan_reference}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.externalRisks}</h2>
        {dashboard.external_risks.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noRisks}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {dashboard.external_risks.map((r: EcosystemRisk) => (
              <article key={r.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${severityClass(r.severity)}`}
                  >
                    {r.severity}
                  </span>
                  <span className="text-xs capitalize text-gray-500">{r.risk_type?.replace(/_/g, " ")}</span>
                </div>
                <p className="mt-2 text-sm text-gray-900">{r.risk_description}</p>
                {r.mitigation_recommendation ? (
                  <p className="mt-2 text-xs text-violet-700">{r.mitigation_recommendation}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.partnershipOpportunities}</h2>
        {dashboard.partnership_opportunities.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noOpportunities}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.partnership_opportunities.map((o: EcosystemOpportunity) => (
              <li key={o.id} className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-sm">
                <p className="font-medium text-teal-900">{o.title}</p>
                <p className="mt-1 text-xs text-teal-800">{o.description}</p>
                <span className="mt-1 inline-block text-xs capitalize text-teal-600">
                  {o.opportunity_type?.replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

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

      {dashboard.relationship_categories && dashboard.relationship_categories.length > 0 ? (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.relationshipCategories}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {dashboard.relationship_categories.map((c) => (
              <span key={c.key} className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">
                {c.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.review_frequencies && dashboard.review_frequencies.length > 0 ? (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.reviewFrequencies}</h2>
          <ul className="mt-2 space-y-2">
            {dashboard.review_frequencies.map((f) => (
              <li key={f.key} className="text-sm text-gray-700">
                <span className="font-medium">{f.label}:</span> {f.purpose}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {blueprint?.implementation_blueprint_phase88?.phase ? (
        <>
          <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
            <h2 className="text-sm font-semibold text-amber-900">{labels.phase88Title}</h2>
            <p className="mt-1 text-xs text-amber-700">
              {blueprint.implementation_blueprint_phase88.phase}
              {blueprint.implementation_blueprint_phase88.engine_phase
                ? ` · ${blueprint.implementation_blueprint_phase88.engine_phase}`
                : ""}
            </p>
            {blueprint.distinction_note ? (
              <p className="mt-2 text-xs text-amber-700">{blueprint.distinction_note}</p>
            ) : null}
            {blueprint.mission ? (
              <p className="mt-2 text-sm font-medium text-amber-900">{blueprint.mission}</p>
            ) : null}
            {blueprint.philosophy ? (
              <p className="mt-2 text-sm text-amber-900">{blueprint.philosophy}</p>
            ) : null}
            {blueprint.abos_principle ? (
              <p className="mt-2 text-xs text-amber-800">{blueprint.abos_principle}</p>
            ) : null}
            {blueprint.vision ? (
              <p className="mt-2 text-xs italic text-amber-800">{blueprint.vision}</p>
            ) : null}
          </section>

          {(blueprint.integration_links ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {blueprint.integration_links?.map((link) =>
                link.route ? (
                  <Link
                    key={link.route}
                    href={link.route}
                    className="rounded-lg border border-amber-200 px-3 py-1.5 text-sm"
                  >
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          ) : null}

          {blueprint.objectives && blueprint.objectives.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {blueprint.objectives.map((obj) => (
                  <ObjectiveCard key={obj.key ?? obj.label} objective={obj} />
                ))}
              </div>
            </section>
          ) : null}

          {blueprint.blueprint_relationship_categories?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintRelationshipCategories}</h3>
              <p className="mt-2 text-sm text-gray-700">{blueprint.blueprint_relationship_categories.principle}</p>
              <CategoryGrid block={blueprint.blueprint_relationship_categories} />
            </section>
          ) : null}

          {blueprint.relationship_insights?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.relationshipInsights}</h3>
              <p className="mt-2 text-sm text-gray-700">{blueprint.relationship_insights.principle}</p>
              <GuidanceList items={blueprint.relationship_insights.insights} />
            </section>
          ) : null}

          {blueprint.partnership_health?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.partnershipHealth}</h3>
              <p className="mt-2 text-sm text-gray-700">{blueprint.partnership_health.principle}</p>
              <DimensionGrid block={blueprint.partnership_health} />
            </section>
          ) : null}

          {blueprint.customer_relationship_intelligence?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.customerRelationshipIntelligence}</h3>
              <p className="mt-2 text-sm text-gray-700">{blueprint.customer_relationship_intelligence.principle}</p>
              <GuidanceList items={blueprint.customer_relationship_intelligence.signals} />
            </section>
          ) : null}

          {blueprint.community_connection?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.communityConnection}</h3>
              <p className="mt-2 text-sm text-gray-700">{blueprint.community_connection.principle}</p>
              <GuidanceList items={blueprint.community_connection.connections} />
            </section>
          ) : null}

          {blueprint.companion_guidance?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.companionGuidance}</h3>
              <p className="mt-2 text-sm text-gray-700">{blueprint.companion_guidance.principle}</p>
              <GuidanceList items={blueprint.companion_guidance.examples} />
            </section>
          ) : null}

          {blueprint.leadership_insights?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.leadershipInsights}</h3>
              <p className="mt-2 text-sm text-gray-700">{blueprint.leadership_insights.principle}</p>
              <GuidanceList items={blueprint.leadership_insights.insights} />
            </section>
          ) : null}

          {blueprint.self_love_connection?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.selfLoveConnection}</h3>
              <p className="mt-2 text-sm text-gray-700">{blueprint.self_love_connection.principle}</p>
              {blueprint.self_love_connection.journey_phrase ? (
                <p className="mt-2 text-xs italic text-gray-600">{blueprint.self_love_connection.journey_phrase}</p>
              ) : null}
            </section>
          ) : null}

          {blueprint.trust_connection?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
              <p className="mt-2 text-sm text-gray-700">{blueprint.trust_connection.principle}</p>
            </section>
          ) : null}

          {blueprint.limitation_principles?.principle ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.limitationPrinciples}</h3>
              <p className="mt-2 text-sm text-gray-700">{blueprint.limitation_principles.principle}</p>
              {blueprint.limitation_principles.forbidden && blueprint.limitation_principles.forbidden.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-gray-500">{labels.forbidden}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                    {blueprint.limitation_principles.forbidden.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {blueprint.limitation_principles.required && blueprint.limitation_principles.required.length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-gray-500">{labels.required}</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                    {blueprint.limitation_principles.required.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          ) : null}

          {blueprint.engagement_summary ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-gray-500">{labels.activeRelationships}</dt>
                  <dd>{String(blueprint.engagement_summary.active_relationships ?? 0)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">{labels.openRisksCount}</dt>
                  <dd>{String(blueprint.engagement_summary.open_risks ?? 0)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">{labels.openOpportunities}</dt>
                  <dd>{String(blueprint.engagement_summary.open_opportunities ?? 0)}</dd>
                </div>
              </dl>
            </section>
          ) : null}

          {blueprint.success_criteria && blueprint.success_criteria.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
              <SuccessCriteriaList criteria={blueprint.success_criteria} labels={labels} />
            </section>
          ) : null}

          {blueprint.vision_phrases && blueprint.vision_phrases.length > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">{labels.visionPhrases}</h3>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
                {blueprint.vision_phrases.map((phrase) => (
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
