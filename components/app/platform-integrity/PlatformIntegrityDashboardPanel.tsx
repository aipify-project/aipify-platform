"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePlatformIntegrityDashboard,
  type PlatformIntegrityDashboard,
  type IntegrityFinding,
  type IntegrityAction,
  type SelfAwarenessPlatformIntegrityBlueprint,
  type BlueprintObjective,
  type AbosSuccessCriterion,
} from "@/lib/aipify/platform-integrity";

type PlatformIntegrityDashboardPanelProps = {
  labels: Record<string, string>;
};

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
        <li key={String(item.key ?? item.observation ?? item.prompt ?? item.label)} className="rounded border border-gray-100 p-2 text-sm">
          <p className="font-medium text-gray-900">
            {item.emoji ? `${String(item.emoji)} ` : ""}
            {String(item.observation ?? item.prompt ?? item.label ?? "")}
          </p>
          {item.description || item.consideration ? (
            <p className="mt-1 text-xs text-gray-600">{String(item.description ?? item.consideration ?? "")}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function DimensionGrid({ block }: { block?: { principle?: string; dimensions?: Array<Record<string, unknown>> } }) {
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

function BoundaryGrid({ block }: { block?: { principle?: string; boundaries?: Array<Record<string, unknown>>; safeguards?: Array<Record<string, unknown>> } }) {
  const items = block?.boundaries ?? block?.safeguards;
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <ObjectiveCard
          key={String(item.key ?? item.label)}
          objective={{
            key: String(item.key ?? ""),
            label: String(item.label ?? ""),
            description: String(item.description ?? ""),
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

function SelfAwarenessBlueprintSections({
  blueprint,
  labels,
}: {
  blueprint: SelfAwarenessPlatformIntegrityBlueprint;
  labels: Record<string, string>;
}) {
  return (
    <>
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.blueprintTitle}</h2>
        {blueprint.distinction_note ? (
          <p className="mt-2 text-xs text-violet-800">{blueprint.distinction_note}</p>
        ) : null}
        {blueprint.mission ? <p className="mt-3 text-sm font-medium text-violet-900">{blueprint.mission}</p> : null}
        {blueprint.philosophy ? <p className="mt-1 text-sm text-violet-800">{blueprint.philosophy}</p> : null}
        {blueprint.abos_principle ? <p className="mt-2 text-xs text-violet-700">{blueprint.abos_principle}</p> : null}
        {blueprint.vision ? <p className="mt-2 text-xs italic text-violet-700">{blueprint.vision}</p> : null}
        {blueprint.privacy_note ? <p className="mt-2 text-xs text-violet-600">{blueprint.privacy_note}</p> : null}
      </section>

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

      {blueprint.platform_health_monitoring?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.platformHealthMonitoring}</h3>
          <p className="mt-2 text-sm text-gray-700">{blueprint.platform_health_monitoring.principle}</p>
          <DimensionGrid block={blueprint.platform_health_monitoring} />
        </section>
      ) : null}

      {blueprint.self_observation_examples?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.selfObservationExamples}</h3>
          <p className="mt-2 text-sm text-gray-700">{blueprint.self_observation_examples.principle}</p>
          <GuidanceList items={blueprint.self_observation_examples.examples ?? blueprint.self_observation_examples.observations} />
        </section>
      ) : null}

      {blueprint.capability_boundaries?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.capabilityBoundaries}</h3>
          <p className="mt-2 text-sm text-gray-700">{blueprint.capability_boundaries.principle}</p>
          <BoundaryGrid block={blueprint.capability_boundaries} />
        </section>
      ) : null}

      {blueprint.self_improvement_opportunities?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.selfImprovementOpportunities}</h3>
          <p className="mt-2 text-sm text-gray-700">{blueprint.self_improvement_opportunities.principle}</p>
          <GuidanceList items={blueprint.self_improvement_opportunities.examples ?? blueprint.self_improvement_opportunities.opportunities} />
        </section>
      ) : null}

      {blueprint.integrity_safeguards?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integritySafeguards}</h3>
          <p className="mt-2 text-sm text-gray-700">{blueprint.integrity_safeguards.principle}</p>
          <BoundaryGrid block={blueprint.integrity_safeguards} />
        </section>
      ) : null}

      {blueprint.companion_guidance?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionGuidance}</h3>
          <p className="mt-2 text-sm text-gray-700">{blueprint.companion_guidance.principle}</p>
          <GuidanceList items={blueprint.companion_guidance.examples} />
        </section>
      ) : null}

      {blueprint.self_love_connection?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.selfLoveConnection}</h3>
          <p className="mt-2 text-sm text-gray-700">{String(blueprint.self_love_connection.principle)}</p>
          {blueprint.self_love_connection.journey_phrase ? (
            <p className="mt-2 text-xs italic text-gray-600">{String(blueprint.self_love_connection.journey_phrase)}</p>
          ) : null}
        </section>
      ) : null}

      {blueprint.trust_connection?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
          <p className="mt-2 text-sm text-gray-700">{String(blueprint.trust_connection.principle)}</p>
        </section>
      ) : null}

      {blueprint.privacy_principles?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.privacyPrinciples}</h3>
          <p className="mt-2 text-sm text-gray-700">{blueprint.privacy_principles.principle}</p>
          {blueprint.privacy_principles.forbidden && blueprint.privacy_principles.forbidden.length > 0 ? (
            <>
              <p className="mt-3 text-xs font-medium text-gray-500">{labels.forbidden}</p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                {blueprint.privacy_principles.forbidden.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
          {blueprint.privacy_principles.required && blueprint.privacy_principles.required.length > 0 ? (
            <>
              <p className="mt-3 text-xs font-medium text-gray-500">{labels.required}</p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                {blueprint.privacy_principles.required.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}

      {blueprint.integration_links && blueprint.integration_links.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationLinks}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {blueprint.integration_links.map((link) => (
              <li key={link.label}>
                {link.route ? (
                  <Link href={link.route} className="font-medium text-indigo-700 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-900">{link.label}</span>
                )}
                {link.note ? <p className="text-xs text-gray-600">{link.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {blueprint.engagement_summary ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div><dt className="text-gray-500">{labels.openFindingsCount}</dt><dd>{String(blueprint.engagement_summary.open_findings ?? 0)}</dd></div>
            <div><dt className="text-gray-500">{labels.criticalFindingsCount}</dt><dd>{String(blueprint.engagement_summary.critical_findings ?? 0)}</dd></div>
            <div><dt className="text-gray-500">{labels.pendingActionsCount}</dt><dd>{String(blueprint.engagement_summary.pending_actions ?? 0)}</dd></div>
          </dl>
        </section>
      ) : null}

      {blueprint.success_criteria && blueprint.success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <SuccessCriteriaList criteria={blueprint.success_criteria} labels={labels} />
        </section>
      ) : null}
    </>
  );
}

function bandClass(band?: string) {
  switch (band) {
    case "exceptional":
      return "text-emerald-700";
    case "strong":
      return "text-teal-700";
    case "improvements_recommended":
      return "text-amber-700";
    case "concerns_identified":
      return "text-orange-700";
    case "critical_review_required":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

function severityClass(severity?: string) {
  switch (severity) {
    case "healthy":
      return "bg-emerald-100 text-emerald-800";
    case "monitor":
      return "bg-blue-100 text-blue-800";
    case "attention_required":
      return "bg-amber-100 text-amber-800";
    case "critical_review_required":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function FindingCard({
  finding,
  labels,
  acting,
  onAcknowledge,
}: {
  finding: IntegrityFinding;
  labels: Record<string, string>;
  acting: string | null;
  onAcknowledge: (id: string) => void;
}) {
  const actions = Array.isArray(finding.recommended_actions)
    ? (finding.recommended_actions as string[])
    : [];

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${severityClass(finding.severity)}`}>
          {finding.severity?.replace(/_/g, " ")}
        </span>
        <span className="text-xs capitalize text-gray-500">{finding.domain?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-2 font-medium text-gray-900">{finding.summary}</p>
      {finding.potential_impact ? (
        <p className="mt-1 text-sm text-gray-600">
          <span className="font-medium">{labels.potentialImpact}: </span>
          {finding.potential_impact}
        </p>
      ) : null}
      {actions.length > 0 ? (
        <ul className="mt-2 list-inside list-disc text-xs text-violet-700">
          {actions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      ) : null}
      {finding.governance_requirements ? (
        <p className="mt-2 text-xs text-amber-700">
          {labels.governance}: {finding.governance_requirements}
        </p>
      ) : null}
      {finding.status === "open" ? (
        <button
          type="button"
          disabled={acting === finding.id}
          onClick={() => onAcknowledge(finding.id)}
          className="mt-3 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {labels.acknowledge}
        </button>
      ) : null}
    </article>
  );
}

export function PlatformIntegrityDashboardPanel({ labels }: PlatformIntegrityDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<PlatformIntegrityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/platform-integrity/dashboard");
    if (res.ok) setDashboard(parsePlatformIntegrityDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/platform-integrity/briefings/generate", { method: "POST" });
    await load();
  };

  const acknowledgeFinding = async (id: string) => {
    setActing(id);
    await fetch(`/api/aipify/platform-integrity/findings/${id}/acknowledge`, { method: "POST" });
    setActing(null);
    await load();
  };

  const completeAction = async (id: string) => {
    setActing(id);
    await fetch(`/api/aipify/platform-integrity/actions/${id}/complete`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.integrityScore}</h2>
        <p className={`mt-2 text-4xl font-bold ${bandClass(dashboard.integrity_band)}`}>
          {dashboard.integrity_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className={`mt-1 text-sm font-medium ${bandClass(dashboard.integrity_band)}`}>
          {dashboard.integrity_band_label}
        </p>
        <p className="mt-2 text-sm text-indigo-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
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
        <h2 className="text-sm font-semibold text-gray-900">{labels.findings}</h2>
        {dashboard.findings.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noFindings}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {dashboard.findings.map((f) => (
              <FindingCard
                key={f.id}
                finding={f}
                labels={labels}
                acting={acting}
                onAcknowledge={acknowledgeFinding}
              />
            ))}
          </div>
        )}
      </section>

      {dashboard.actions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recommendedActions}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.actions.map((a: IntegrityAction) => (
              <li key={a.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <p className="text-gray-900">{a.action_description}</p>
                {a.requires_governance ? (
                  <p className="mt-1 text-xs text-amber-700">{labels.requiresGovernance}</p>
                ) : null}
                {a.status === "pending" ? (
                  <button
                    type="button"
                    disabled={acting === a.id}
                    onClick={() => completeAction(a.id)}
                    className="mt-2 rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {labels.completeAction}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.deprecated_assets.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.deprecatedAssets}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.deprecated_assets.map((d) => (
              <li key={d.id} className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm">
                <span className="font-medium capitalize text-amber-900">{d.asset_type}: </span>
                {d.asset_title}
                <p className="mt-1 text-xs text-amber-800">{d.reason}</p>
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

      {dashboard.review_domains && dashboard.review_domains.length > 0 ? (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.reviewDomains}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {dashboard.review_domains.map((d) => (
              <span key={d.key} className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">
                {d.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.self_awareness_platform_integrity_blueprint ? (
        <SelfAwarenessBlueprintSections
          blueprint={dashboard.self_awareness_platform_integrity_blueprint}
          labels={labels}
        />
      ) : null}
    </div>
  );
}
