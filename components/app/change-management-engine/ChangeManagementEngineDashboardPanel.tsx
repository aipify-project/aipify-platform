"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseChangeManagementEngineDashboard,
  type BlueprintObjective,
  type ChangeCommunicationPlanRecord,
  type ChangeInitiativeRecord,
  type ChangeManagementEngineDashboard,
  type ChangeMilestoneRecord,
  type CompanionGuidanceExample,
  type TransformationOrchestrationPhase127Blueprint,
  type OrganizationalRenewalPhase155Blueprint,
} from "@/lib/aipify/change-management-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{objective.label}</span>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
      {objective.examples && objective.examples.length > 0 ? (
        <ul className="mt-1 list-inside list-disc text-xs text-gray-500">
          {objective.examples.map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function GuidanceCard({ example }: { example: CompanionGuidanceExample }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">
        {example.emoji ? `${example.emoji} ` : ""}
        {example.scenario}
      </span>
      {example.example ? <p className="mt-1 text-xs text-gray-600">{example.example}</p> : null}
    </div>
  );
}

function SuccessCriterionRow({
  criterion,
  metLabel,
  pendingLabel,
}: {
  criterion: { key?: string; label?: string; met?: boolean; note?: string | null };
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

function Phase127Sections({
  phase127,
  phase127Note,
  labels,
}: {
  phase127: TransformationOrchestrationPhase127Blueprint;
  phase127Note?: string;
  labels: Record<string, string>;
}) {
  const phase127Links = phase127.cross_links ?? [];
  const companionExamples = phase127.companion_adaptation?.examples ?? [];

  return (
    <>
      {phase127Links.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {phase127Links.map((link) =>
            link.route ? (
              <Link key={link.route + (link.key ?? "")} href={link.route} className="rounded-lg border border-teal-200 px-3 py-1.5 text-sm">
                {link.label ?? link.route}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.phase127Title}</h2>
        {phase127.phase ? <p className="mt-1 text-xs text-teal-700">{phase127.phase}</p> : null}
        {phase127Note ? <p className="mt-2 text-xs text-teal-700">{phase127Note}</p> : null}
        {phase127.mission ? <p className="mt-2 text-sm font-medium text-teal-900">{phase127.mission}</p> : null}
        {phase127.philosophy ? <p className="mt-2 text-sm text-teal-900">{phase127.philosophy}</p> : null}
        {phase127.abos_principle ? <p className="mt-2 text-xs text-teal-800">{phase127.abos_principle}</p> : null}
        {phase127.privacy_note ? <p className="mt-2 text-xs text-teal-600">{phase127.privacy_note}</p> : null}
      </section>

      {phase127.objectives && phase127.objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127Objectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase127.objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {phase127.orchestration_center && phase127.orchestration_center.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127OrchestrationCenter}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {phase127.orchestration_center.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase127.roadmap_engine && phase127.roadmap_engine.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127RoadmapEngine}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase127.roadmap_engine.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase127.readiness_engine && phase127.readiness_engine.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127ReadinessEngine}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase127.readiness_engine.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase127.stakeholder_engagement && phase127.stakeholder_engagement.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127StakeholderEngagement}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase127.stakeholder_engagement.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase127.change_companion && phase127.change_companion.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127ChangeCompanion}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase127.change_companion.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase127.communication_orchestration?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127CommunicationOrchestration}</h3>
          <p className="mt-2 text-gray-700">{phase127.communication_orchestration.principle}</p>
          {phase127.communication_orchestration.types && phase127.communication_orchestration.types.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {phase127.communication_orchestration.types.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {phase127.transformation_risk_engine && phase127.transformation_risk_engine.length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.phase127TransformationRisk}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase127.transformation_risk_engine.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase127.adoption_intelligence?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127AdoptionIntelligence}</h3>
          <p className="mt-2 text-gray-700">{phase127.adoption_intelligence.principle}</p>
          {phase127.adoption_intelligence.indicators && phase127.adoption_intelligence.indicators.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {phase127.adoption_intelligence.indicators.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {phase127.transformation_memory_engine?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127TransformationMemory}</h3>
          <p className="mt-2 text-gray-700">{phase127.transformation_memory_engine.principle}</p>
          {phase127.transformation_memory_engine.captures && phase127.transformation_memory_engine.captures.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {phase127.transformation_memory_engine.captures.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {phase127.companion_limitations && phase127.companion_limitations.length > 0 ? (
        <section className="rounded-lg border border-red-100 bg-red-50/40 p-4 text-sm text-red-900">
          <h3 className="text-sm font-semibold">{labels.phase127Limitations}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {phase127.companion_limitations.map((item) => (
              <li key={item.key ?? item.label}>{item.label}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase127.self_love_transformation?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.phase127SelfLove}</h3>
          <p className="mt-2">{phase127.self_love_transformation.principle}</p>
          {phase127.self_love_transformation.patterns && phase127.self_love_transformation.patterns.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {phase127.self_love_transformation.patterns.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {phase127.knowledge_library && phase127.knowledge_library.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127KnowledgeLibrary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase127.knowledge_library.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {companionExamples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127CompanionAdaptation}</h3>
          {phase127.companion_adaptation?.principle ? (
            <p className="mt-2 text-sm text-gray-700">{phase127.companion_adaptation.principle}</p>
          ) : null}
          <div className="mt-3 space-y-3">
            {companionExamples.map((example) => (
              <div key={example.key ?? example.prompt} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium">
                  {example.emoji ? `${example.emoji} ` : ""}
                  {example.prompt}
                </span>
                {example.consideration ? <p className="mt-1 text-xs text-gray-600">{example.consideration}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {phase127.success_metrics && phase127.success_metrics.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127SuccessMetrics}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase127.success_metrics.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase127.success_criteria && phase127.success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase127SuccessCriteria}</h3>
          <div className="mt-3 space-y-2">
            {phase127.success_criteria.map((criterion) => (
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
    </>
  );
}

function Phase155Sections({
  phase155,
  phase155Note,
  labels,
}: {
  phase155: OrganizationalRenewalPhase155Blueprint;
  phase155Note?: string;
  labels: Record<string, string>;
}) {
  const phase155Links = phase155.integration_links ?? [];

  return (
    <>
      {phase155Links.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {phase155Links.map((link) =>
            link.route ? (
              <Link key={link.route + (link.key ?? "")} href={link.route} className="rounded-lg border border-violet-200 px-3 py-1.5 text-sm">
                {link.label ?? link.route}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.phase155Title}</h2>
        {phase155.phase ? <p className="mt-1 text-xs text-violet-700">{phase155.phase}</p> : null}
        {phase155Note ? <p className="mt-2 text-xs text-violet-700">{phase155Note}</p> : null}
        {phase155.mission ? <p className="mt-2 text-sm font-medium text-violet-900">{phase155.mission}</p> : null}
        {phase155.philosophy ? <p className="mt-2 text-sm text-violet-900">{phase155.philosophy}</p> : null}
        {phase155.abos_principle ? <p className="mt-2 text-xs text-violet-800">{phase155.abos_principle}</p> : null}
        {phase155.privacy_note ? <p className="mt-2 text-xs text-violet-600">{phase155.privacy_note}</p> : null}
      </section>

      {phase155.objectives && phase155.objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase155Objectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase155.objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {phase155.organizational_renewal_center && phase155.organizational_renewal_center.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase155RenewalCenter}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {phase155.organizational_renewal_center.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase155.reinvention_intelligence_engine && phase155.reinvention_intelligence_engine.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase155ReinventionIntelligence}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase155.reinvention_intelligence_engine.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase155.identity_preservation_framework?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase155IdentityPreservation}</h3>
          <p className="mt-2 text-gray-700">{phase155.identity_preservation_framework.principle}</p>
          {phase155.identity_preservation_framework.dimensions &&
          phase155.identity_preservation_framework.dimensions.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {phase155.identity_preservation_framework.dimensions.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {phase155.executive_renewal_reviews?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase155ExecutiveRenewal}</h3>
          <p className="mt-2 text-gray-700">{phase155.executive_renewal_reviews.principle}</p>
          {phase155.executive_renewal_reviews.dimensions &&
          phase155.executive_renewal_reviews.dimensions.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {phase155.executive_renewal_reviews.dimensions.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {phase155.renewal_companion && phase155.renewal_companion.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase155RenewalCompanion}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase155.renewal_companion.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase155.innovation_balance_engine?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase155InnovationBalance}</h3>
          <p className="mt-2 text-gray-700">{phase155.innovation_balance_engine.principle}</p>
          {phase155.innovation_balance_engine.balances && phase155.innovation_balance_engine.balances.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {phase155.innovation_balance_engine.balances.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {phase155.organizational_learning_engine?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase155OrganizationalLearning}</h3>
          <p className="mt-2 text-gray-700">{phase155.organizational_learning_engine.principle}</p>
          {phase155.organizational_learning_engine.learning_types &&
          phase155.organizational_learning_engine.learning_types.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {phase155.organizational_learning_engine.learning_types.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {phase155.renewal_memory_engine?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase155RenewalMemory}</h3>
          <p className="mt-2 text-gray-700">{phase155.renewal_memory_engine.principle}</p>
          {phase155.renewal_memory_engine.captures && phase155.renewal_memory_engine.captures.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {phase155.renewal_memory_engine.captures.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {phase155.companion_limitations && phase155.companion_limitations.length > 0 ? (
        <section className="rounded-lg border border-red-100 bg-red-50/40 p-4 text-sm text-red-900">
          <h3 className="text-sm font-semibold">{labels.phase155Limitations}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {phase155.companion_limitations.map((item) => (
              <li key={item.key ?? item.label}>{item.label}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase155.self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.phase155SelfLove}</h3>
          <p className="mt-2">{phase155.self_love_connection.principle}</p>
          {phase155.self_love_connection.patterns && phase155.self_love_connection.patterns.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {phase155.self_love_connection.patterns.map((item) => (
                <ObjectiveCard key={item.key ?? item.label} objective={item} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {phase155.security_requirements && phase155.security_requirements.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase155SecurityRequirements}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {phase155.security_requirements.map((item) => (
              <ObjectiveCard key={item.key ?? item.label} objective={item} />
            ))}
          </div>
        </section>
      ) : null}

      {phase155.vision_phrases && phase155.vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.phase155VisionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {phase155.vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase155.success_criteria && phase155.success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.phase155SuccessCriteria}</h3>
          <div className="mt-3 space-y-2">
            {phase155.success_criteria.map((criterion) => (
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
    </>
  );
}

export function ChangeManagementEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ChangeManagementEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [releasing, setReleasing] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/change-management-engine/dashboard");
    if (res.ok) setDashboard(parseChangeManagementEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const updateStatus = async (initiative: ChangeInitiativeRecord, status: string) => {
    if (!initiative.id) return;
    setUpdating(initiative.id);
    setActionError(null);
    const res = await fetch("/api/aipify/change-management-engine/initiatives", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initiative_id: initiative.id, status }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.updateFailed);
    } else {
      await load();
    }
    setUpdating(null);
  };

  const releaseCommunication = async (plan: ChangeCommunicationPlanRecord) => {
    if (!plan.id) return;
    setReleasing(plan.id);
    setActionError(null);
    const res = await fetch("/api/aipify/change-management-engine/communicate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "release", plan_id: plan.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.releaseFailed);
    } else {
      await load();
    }
    setReleasing(null);
  };

  const completeMilestone = async (milestone: ChangeMilestoneRecord) => {
    if (!milestone.id) return;
    setCompleting(milestone.id);
    setActionError(null);
    const res = await fetch("/api/aipify/change-management-engine/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete_milestone", milestone_id: milestone.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.milestoneFailed);
    } else {
      await load();
    }
    setCompleting(null);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const engagement = dashboard.engagement_summary;
  const blueprintLinks = dashboard.blueprint_integration_links ?? [];

  return (
    <div className="space-y-6">
      {blueprintLinks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {blueprintLinks.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label ?? link.route}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-indigo-700">{labels.distinctionNote}</p>
        {dashboard.implementation_blueprint_phase62?.phase ? (
          <p className="mt-1 text-xs text-indigo-600">
            {dashboard.implementation_blueprint_phase62.phase}
            {dashboard.implementation_blueprint_phase62.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase62.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.blueprint_mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">{dashboard.blueprint_mission}</p>
        ) : null}
        {dashboard.blueprint_philosophy ? (
          <p className="mt-2 text-sm text-indigo-900">{dashboard.blueprint_philosophy}</p>
        ) : null}
        {dashboard.blueprint_abos_principle ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.blueprint_abos_principle}</p>
        ) : null}
        {dashboard.blueprint_distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.blueprint_distinction_note}</p>
        ) : null}
        {dashboard.change_management_note ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.change_management_note}</p>
        ) : null}
      </section>

      {dashboard.blueprint_objectives && dashboard.blueprint_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.blueprint_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.blueprint_change_types && dashboard.blueprint_change_types.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.changeTypes}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.blueprint_change_types.map((changeType) => (
              <ObjectiveCard key={changeType.key ?? changeType.label} objective={changeType} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.readiness_assessment?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.readinessAssessment}</h3>
          <p className="mt-2 text-gray-700">{dashboard.readiness_assessment.principle}</p>
          {dashboard.readiness_assessment.dimensions && dashboard.readiness_assessment.dimensions.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.readiness_assessment.dimensions.map((dim) => (
                <ObjectiveCard key={dim.key ?? dim.label} objective={dim} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_guidance && dashboard.companion_guidance.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionGuidance}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.companion_guidance.map((example) => (
              <GuidanceCard key={example.key ?? example.scenario} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.communication_support?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.communicationSupport}</h3>
          <p className="mt-2 text-gray-700">{dashboard.communication_support.principle}</p>
          {dashboard.communication_support.resources && dashboard.communication_support.resources.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.communication_support.resources.map((resource) => (
                <ObjectiveCard key={resource.key ?? resource.label} objective={resource} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.adoption_support?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.adoptionSupport}</h3>
          <p className="mt-2 text-gray-700">{dashboard.adoption_support.principle}</p>
          {dashboard.adoption_support.supports && dashboard.adoption_support.supports.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.adoption_support.supports.map((support) => (
                <ObjectiveCard key={support.key ?? support.label} objective={support} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.resistance_awareness?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.resistanceAwareness}</h3>
          <p className="mt-2">{dashboard.resistance_awareness.principle}</p>
          {dashboard.resistance_awareness.common_concerns &&
          dashboard.resistance_awareness.common_concerns.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.resistance_awareness.common_concerns.map((concern) => (
                <ObjectiveCard key={concern.key ?? concern.label} objective={concern} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
          {dashboard.self_love_connection.practices && dashboard.self_love_connection.practices.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.self_love_connection.practices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.leadership_insights?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.leadershipInsights}</h3>
          <p className="mt-2 text-gray-700">{dashboard.leadership_insights.principle}</p>
          {dashboard.leadership_insights.insight_types && dashboard.leadership_insights.insight_types.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {dashboard.leadership_insights.insight_types.map((insight) => (
                <ObjectiveCard key={insight.key ?? insight.label} objective={insight} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-700">{dashboard.trust_connection.principle}</p>
          {dashboard.trust_connection.users_should_see && dashboard.trust_connection.users_should_see.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.trust_connection.users_should_see.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.totalInitiatives}: {engagement.total_initiatives ?? 0}</span>
            <span>{labels.activeInitiatives}: {engagement.active_initiatives ?? 0}</span>
            <span>{labels.completedInitiatives}: {engagement.completed_initiatives ?? 0}</span>
            <span>{labels.pendingMilestones}: {engagement.pending_milestones ?? 0}</span>
            <span>{labels.completedMilestones}: {engagement.completed_milestones ?? 0}</span>
            <span>{labels.pendingCommunications}: {engagement.pending_communications ?? 0}</span>
            <span>{labels.adoptionMetrics90d}: {engagement.adoption_metrics_90d ?? 0}</span>
          </div>
        </section>
      ) : null}

      {dashboard.success_criteria && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.success_criteria.map((criterion) => (
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

      {dashboard.vision_phrases && dashboard.vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4 text-sm text-indigo-900">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            {dashboard.vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.implementation_blueprint_phase127 ? (
        <Phase127Sections
          phase127={dashboard.implementation_blueprint_phase127}
          phase127Note={dashboard.transformation_orchestration_phase127_note}
          labels={labels}
        />
      ) : null}

      {dashboard.implementation_blueprint_phase155 ? (
        <Phase155Sections
          phase155={dashboard.implementation_blueprint_phase155}
          phase155Note={dashboard.organizational_renewal_phase155_note}
          labels={labels}
        />
      ) : null}

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.initiatives && dashboard.initiatives.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.initiatives}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.initiatives.map((initiative) => (
              <div key={initiative.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{initiative.initiative_name}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{initiative.change_type}</span>
                    <p className="mt-1 text-xs text-gray-600">{initiative.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{initiative.status}</span>
                    {initiative.status === "planning" && (
                      <button
                        type="button"
                        className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                        disabled={updating === initiative.id}
                        onClick={() => void updateStatus(initiative, "in_progress")}
                      >
                        {updating === initiative.id ? labels.updating : labels.startInitiative}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.milestones && dashboard.milestones.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.milestones}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-2 text-sm">
                <span className={milestone.status === "completed" ? "text-gray-400 line-through" : "text-gray-700"}>
                  {milestone.milestone_name}
                </span>
                {milestone.status === "pending" && (
                  <button
                    type="button"
                    className="rounded border border-green-300 px-2 py-0.5 text-xs text-green-700 disabled:opacity-50"
                    disabled={completing === milestone.id}
                    onClick={() => void completeMilestone(milestone)}
                  >
                    {completing === milestone.id ? labels.completing : labels.completeMilestone}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.communication_plans && dashboard.communication_plans.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.communications}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.communication_plans.map((plan) => (
              <div key={plan.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium">{plan.subject}</span>
                    <span className="ml-2 text-xs text-gray-500">{plan.communication_type}</span>
                    <p className="mt-1 text-xs text-gray-600">{plan.message_summary}</p>
                  </div>
                  {plan.status !== "released" && (
                    <button
                      type="button"
                      className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                      disabled={releasing === plan.id}
                      onClick={() => void releaseCommunication(plan)}
                    >
                      {releasing === plan.id ? labels.releasing : labels.releaseCommunication}
                    </button>
                  )}
                </div>
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
    </div>
  );
}
