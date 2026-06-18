"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalMemoryEngineDashboard,
  type ContinuityBlueprintSection,
  type ContinuityCompanionExample,
  type ContinuityObjective,
  type MemoryLegacyCategory,
  type EnterpriseIntelligenceBlueprintItem,
  type MemoryLegacyBlueprintSection,
  type OrganizationalMemoryEngineDashboard,
} from "@/lib/aipify/organizational-memory-engine";

type Props = { labels: Record<string, string> };

export function OrganizationalMemoryEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<OrganizationalMemoryEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/organizational-memory-engine/dashboard");
    if (res.ok) setDashboard(parseOrganizationalMemoryEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const blueprint55 = dashboard.implementation_blueprint_phase55;
  const continuityObjectives = dashboard.continuity_objectives ?? [];
  const continuityCategories = dashboard.continuity_memory_categories ?? [];
  const orgContinuity = dashboard.organizational_continuity;
  const individualContinuity = dashboard.individual_continuity;
  const memoryManagement = dashboard.memory_management;
  const continuitySelfLove = dashboard.continuity_self_love_connection;
  const continuityTrust = dashboard.continuity_trust_privacy;
  const continuityCompanion = dashboard.continuity_companion_principles;
  const continuitySummary = dashboard.continuity_summary ?? {};
  const continuitySuccessCriteria = dashboard.continuity_success_criteria ?? [];
  const mcebpLinks = dashboard.mcebp_integration_links ?? [];
  const blueprint94 = dashboard.implementation_blueprint_phase94;
  const memoryLegacyObjectives = dashboard.memory_legacy_objectives ?? [];
  const memoryLegacyCategories = dashboard.memory_legacy_categories ?? [];
  const memoryLegacyQuestions = dashboard.memory_legacy_questions;
  const memoryLegacyPreservation = dashboard.memory_legacy_preservation;
  const memoryLegacyCompanion = dashboard.memory_legacy_companion_guidance;
  const memoryLegacyKc = dashboard.memory_legacy_knowledge_center_connection;
  const memoryLegacyMeeting = dashboard.memory_legacy_meeting_companion_connection;
  const memoryLegacySelfLove = dashboard.memory_legacy_self_love_connection;
  const memoryLegacyTrust = dashboard.memory_legacy_trust_connection;
  const memoryLegacyPrivacy = dashboard.memory_legacy_privacy_principles;
  const memoryLegacyEngagement = dashboard.memory_legacy_engagement_summary ?? {};
  const memoryLegacySuccessCriteria = dashboard.memory_legacy_success_criteria ?? [];
  const omlebp94Links = dashboard.omlebp94_integration_links ?? [];
  const blueprint126 = dashboard.implementation_blueprint_phase126;
  const phase126Objectives = dashboard.phase126_objectives ?? [];
  const phase126MemoryCenter = dashboard.phase126_memory_center ?? [];
  const phase126MemoryArchive = dashboard.phase126_memory_archive_engine ?? [];
  const phase126LegacyCaptures = dashboard.phase126_legacy_engine_captures;
  const phase126Succession = dashboard.phase126_succession_intelligence ?? [];
  const phase126Storytelling = dashboard.phase126_storytelling_framework ?? [];
  const phase126KnowledgeProtection = dashboard.phase126_critical_knowledge_protection ?? [];
  const phase126MemoryDiscovery = dashboard.phase126_memory_discovery;
  const phase126LegacyCompanion = dashboard.phase126_legacy_companion ?? [];
  const phase126CompanionLimits = dashboard.phase126_companion_limitations ?? [];
  const phase126SelfLove = dashboard.phase126_self_love_connection;
  const phase126Heritage = dashboard.phase126_heritage_library ?? [];
  const phase126CompanionAdaptation = dashboard.phase126_companion_adaptation;
  const phase126LimitationPrinciples = dashboard.phase126_limitation_principles;
  const phase126Engagement = dashboard.phase126_engagement_summary ?? {};
  const phase126SuccessCriteria = dashboard.phase126_success_criteria ?? [];
  const omlebp126Links = dashboard.omlebp126_cross_links ?? [];
  const blueprint152 = dashboard.implementation_blueprint_phase152;
  const phase152Objectives = dashboard.phase152_objectives ?? [];
  const phase152LegacyCenter = dashboard.phase152_legacy_center ?? [];
  const phase152Succession = dashboard.phase152_succession_intelligence_engine ?? [];
  const phase152CriticalKnowledge = dashboard.phase152_critical_knowledge_engine ?? [];
  const phase152ExecutiveLegacy = dashboard.phase152_executive_legacy_reviews;
  const phase152LegacyCompanion = dashboard.phase152_legacy_companion ?? [];
  const phase152ContinuityReadiness = dashboard.phase152_continuity_readiness_framework ?? [];
  const phase152Storytelling = dashboard.phase152_organizational_storytelling_engine;
  const phase152InstitutionalMemory = dashboard.phase152_institutional_memory_library ?? [];
  const phase152CompanionLimits = dashboard.phase152_companion_limitations ?? [];
  const phase152SelfLove = dashboard.phase152_self_love_connection;
  const phase152Security = dashboard.phase152_security_requirements;
  const phase152Engagement = dashboard.phase152_engagement_summary ?? {};
  const phase152SuccessCriteria = dashboard.phase152_success_criteria ?? [];
  const olsibp152Links = dashboard.olsibp152_integration_links ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/memory" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.legacyMemory}
        </Link>
        <Link href="/app/legacy-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.legacyEngine}
        </Link>
        <Link href="/app/future-leaders-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.futureLeadersEngine}
        </Link>
        <Link href="/app/continuity" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.continuityEngine}
        </Link>
        <Link href="/app/learning" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.learningEngine}
        </Link>
        <Link href="/app/assistant/memory" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.personalMemory}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.mission}</p>
        ) : null}
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-violet-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.knowledge_vs_memory_note ? (
          <p className="mt-2 text-xs italic text-violet-700">{dashboard.knowledge_vs_memory_note}</p>
        ) : null}
        {dashboard.vision ? (
          <p className="mt-2 text-xs text-gray-600">{dashboard.vision}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-gray-500">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.privacy_note ? (
          <p className="mt-2 text-xs text-gray-500">{dashboard.privacy_note}</p>
        ) : null}
      </section>

      {blueprint55?.title ? (
        <section className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-6">
          <h2 className="text-sm font-semibold">{labels.continuityTitle}</h2>
          {dashboard.continuity_mission ? (
            <p className="mt-2 text-sm">{dashboard.continuity_mission}</p>
          ) : null}
          {dashboard.continuity_philosophy ? (
            <p className="mt-2 text-xs text-indigo-900">{dashboard.continuity_philosophy}</p>
          ) : null}
          {dashboard.continuity_abos_principle ? (
            <p className="mt-1 text-xs font-medium text-indigo-800">{dashboard.continuity_abos_principle}</p>
          ) : null}
          <p className="mt-2 text-xs font-medium text-indigo-800">{blueprint55.title}</p>
          {dashboard.continuity_distinction_note ? (
            <p className="mt-2 text-xs text-indigo-700">{dashboard.continuity_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      {continuityObjectives.length > 0 && (
        <section className="rounded-lg border border-indigo-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.continuityObjectives}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {continuityObjectives.map((obj: ContinuityObjective) => (
              <li key={obj.key ?? obj.label} className="rounded border border-indigo-50 p-3 text-sm">
                <div className="font-medium">
                  {obj.emoji ? `${obj.emoji} ` : ""}
                  {obj.label}
                </div>
                {obj.description ? <p className="mt-1 text-xs text-gray-600">{obj.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {continuityCategories.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.continuityMemoryCategories}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {continuityCategories.map((cat) => (
              <li key={cat.key ?? cat.label} className="rounded border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">
                  {cat.emoji ? `${cat.emoji} ` : ""}
                  {cat.label}
                </span>
                {cat.description ? <p className="mt-1 text-xs text-gray-500">{cat.description}</p> : null}
                {cat.maps_to ? <p className="mt-1 text-xs text-gray-400">{cat.maps_to}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {orgContinuity && (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h3 className="text-sm font-semibold">
            {orgContinuity.emoji ? `${orgContinuity.emoji} ` : ""}
            {labels.organizationalContinuity}
          </h3>
          {orgContinuity.principle ? (
            <p className="mt-2 text-xs text-violet-900">{orgContinuity.principle}</p>
          ) : null}
          {(orgContinuity.companion_examples?.length ?? 0) > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {(orgContinuity as ContinuityBlueprintSection).companion_examples!.map((ex, i) => (
                <li key={ex.key ?? i} className="rounded border border-violet-100 bg-white px-3 py-2 text-xs">
                  {(ex as ContinuityCompanionExample).example ?? ex.text}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {individualContinuity && (
        <section className="rounded-lg border border-rose-100 bg-rose-50/30 p-4">
          <h3 className="text-sm font-semibold">
            {individualContinuity.emoji ? `${individualContinuity.emoji} ` : ""}
            {labels.individualContinuity}
          </h3>
          {individualContinuity.principle ? (
            <p className="mt-2 text-xs text-rose-900">{individualContinuity.principle}</p>
          ) : null}
          {individualContinuity.pame_boundary ? (
            <p className="mt-2 text-xs text-rose-700">{individualContinuity.pame_boundary}</p>
          ) : null}
          {(individualContinuity.companion_examples?.length ?? 0) > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {(individualContinuity as ContinuityBlueprintSection).companion_examples!.map((ex, i) => (
                <li key={ex.key ?? i} className="rounded border border-rose-100 bg-white px-3 py-2 text-xs">
                  {(ex as ContinuityCompanionExample).example ?? ex.text}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {memoryManagement && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.memoryManagement}</h3>
          {memoryManagement.principle ? (
            <p className="mt-2 text-xs text-gray-600">{memoryManagement.principle}</p>
          ) : null}
          {(memoryManagement.controls?.length ?? 0) > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {(memoryManagement as ContinuityBlueprintSection).controls!.map((ctrl) => (
                <li
                  key={ctrl.key ?? ctrl.label}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs"
                >
                  {ctrl.label}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {continuitySelfLove && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.continuitySelfLove}</h3>
          {continuitySelfLove.principle ? <p className="mt-2 text-xs">{continuitySelfLove.principle}</p> : null}
          {(continuitySelfLove.practices?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs">
              {(continuitySelfLove as ContinuityBlueprintSection).practices!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {continuityTrust && (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.continuityTrustPrivacy}</h3>
          {continuityTrust.principle ? (
            <p className="mt-2 text-xs text-gray-600">{continuityTrust.principle}</p>
          ) : null}
          {(continuityTrust.commitments?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
              {(continuityTrust as ContinuityBlueprintSection).commitments!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {continuityCompanion && (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.continuityCompanionPrinciples}</h3>
          {continuityCompanion.principle ? (
            <p className="mt-2 text-xs text-indigo-900">{continuityCompanion.principle}</p>
          ) : null}
        </section>
      )}

      {continuitySummary.summary_text ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.continuitySummary}</h3>
          <p className="mt-2 text-gray-700">{continuitySummary.summary_text}</p>
          {continuitySummary.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{continuitySummary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {continuitySuccessCriteria.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.continuitySuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {continuitySuccessCriteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {mcebpLinks.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.continuityIntegrationLinks}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {mcebpLinks.map((link) => {
              const route = typeof link.route === "string" ? link.route : null;
              const label = typeof link.label === "string" ? link.label : route ?? "";
              return (
                <li key={label}>
                  {route ? (
                    <Link href={route} className="text-indigo-600 hover:underline">
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                  {link.note ? <span className="ml-2 text-xs text-gray-500">{link.note}</span> : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {blueprint94?.title || blueprint94?.phase ? (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-6">
          <h2 className="text-sm font-semibold">{labels.memoryLegacyTitle}</h2>
          {dashboard.memory_legacy_mission ? (
            <p className="mt-2 text-sm font-medium text-emerald-900">{dashboard.memory_legacy_mission}</p>
          ) : null}
          {dashboard.memory_legacy_philosophy ? (
            <p className="mt-2 text-xs text-emerald-900">{dashboard.memory_legacy_philosophy}</p>
          ) : null}
          {dashboard.memory_legacy_abos_principle ? (
            <p className="mt-1 text-xs font-medium text-emerald-800">{dashboard.memory_legacy_abos_principle}</p>
          ) : null}
          {dashboard.memory_legacy_vision ? (
            <p className="mt-2 text-xs italic text-emerald-700">{dashboard.memory_legacy_vision}</p>
          ) : null}
          {dashboard.memory_legacy_distinction_note ? (
            <p className="mt-2 text-xs text-emerald-700">{dashboard.memory_legacy_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      {memoryLegacyObjectives.length > 0 && (
        <section className="rounded-lg border border-emerald-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.memoryLegacyObjectives}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {memoryLegacyObjectives.map((obj: ContinuityObjective) => (
              <li key={obj.key ?? obj.label} className="rounded border border-emerald-50 p-3 text-sm">
                <div className="font-medium">
                  {obj.emoji ? `${obj.emoji} ` : ""}
                  {obj.label}
                </div>
                {obj.description ? <p className="mt-1 text-xs text-gray-600">{obj.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {memoryLegacyCategories.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.memoryLegacyCategories}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {memoryLegacyCategories.map((cat: MemoryLegacyCategory) => (
              <li key={cat.key ?? cat.label} className="rounded border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">
                  {cat.emoji ? `${cat.emoji} ` : ""}
                  {cat.label}
                </span>
                {cat.description ? <p className="mt-1 text-xs text-gray-500">{cat.description}</p> : null}
                {cat.sub_items && cat.sub_items.length > 0 ? (
                  <ul className="mt-1 list-inside list-disc text-xs text-gray-400">
                    {cat.sub_items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {memoryLegacyQuestions?.questions && Array.isArray(memoryLegacyQuestions.questions) && (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.memoryLegacyQuestions}</h3>
          {memoryLegacyQuestions.principle ? (
            <p className="mt-2 text-xs text-emerald-900">{memoryLegacyQuestions.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {(memoryLegacyQuestions.questions as MemoryLegacyBlueprintSection["questions"])!.map((q) => (
              <li key={q.key ?? q.question} className="rounded border border-emerald-100 bg-white px-3 py-2 text-xs">
                <span className="font-medium">
                  {q.emoji ? `${q.emoji} ` : ""}
                  {q.question}
                </span>
                {q.description ? <p className="mt-1 text-gray-500">{q.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {memoryLegacyPreservation && (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.memoryLegacyPreservation}</h3>
          {memoryLegacyPreservation.principle ? (
            <p className="mt-2 text-xs text-violet-900">{memoryLegacyPreservation.principle}</p>
          ) : null}
          {memoryLegacyPreservation.boundary_note ? (
            <p className="mt-2 text-xs text-violet-700">{memoryLegacyPreservation.boundary_note}</p>
          ) : null}
          {(memoryLegacyPreservation.dimensions?.length ?? 0) > 0 ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {memoryLegacyPreservation.dimensions!.map((dim) => (
                <li key={dim.key ?? dim.label} className="rounded border border-violet-100 bg-white px-3 py-2 text-xs">
                  <span className="font-medium">
                    {dim.emoji ? `${dim.emoji} ` : ""}
                    {dim.label}
                  </span>
                  {dim.description ? <p className="mt-1 text-gray-500">{dim.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {memoryLegacyCompanion && (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.memoryLegacyCompanionGuidance}</h3>
          {memoryLegacyCompanion.principle ? (
            <p className="mt-2 text-xs text-indigo-900">{memoryLegacyCompanion.principle}</p>
          ) : null}
          {(memoryLegacyCompanion.examples?.length ?? 0) > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {memoryLegacyCompanion.examples!.map((ex, i) => (
                <li key={ex.key ?? i} className="rounded border border-indigo-100 bg-white px-3 py-2 text-xs">
                  {ex.prompt ?? ex.example ?? ex.text}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {(memoryLegacyKc || memoryLegacyMeeting) && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.memoryLegacyConnections}</h3>
          {memoryLegacyKc?.principle ? (
            <p className="mt-2 text-xs text-gray-600">{memoryLegacyKc.principle}</p>
          ) : null}
          {memoryLegacyMeeting?.principle ? (
            <p className="mt-2 text-xs text-gray-600">{memoryLegacyMeeting.principle}</p>
          ) : null}
        </section>
      )}

      {memoryLegacySelfLove && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.memoryLegacySelfLove}</h3>
          {memoryLegacySelfLove.principle ? <p className="mt-2 text-xs">{memoryLegacySelfLove.principle}</p> : null}
          {(memoryLegacySelfLove.practices?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs">
              {memoryLegacySelfLove.practices!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {memoryLegacyTrust && (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.memoryLegacyTrust}</h3>
          {memoryLegacyTrust.principle ? (
            <p className="mt-2 text-xs text-gray-600">{memoryLegacyTrust.principle}</p>
          ) : null}
          {(memoryLegacyTrust.organizations_should_understand?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
              {memoryLegacyTrust.organizations_should_understand!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {memoryLegacyPrivacy && (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.memoryLegacyPrivacy}</h3>
          {memoryLegacyPrivacy.principle ? (
            <p className="mt-2 text-xs text-gray-600">{memoryLegacyPrivacy.principle}</p>
          ) : null}
          {(memoryLegacyPrivacy.forbidden?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
              {memoryLegacyPrivacy.forbidden!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {typeof memoryLegacyEngagement.active_memory_records === "number" ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.memoryLegacyEngagement}</h3>
          <p className="mt-2 text-gray-700">
            {labels.activeRecords}: {String(memoryLegacyEngagement.active_memory_records ?? 0)} ·{" "}
            {labels.activeDecisions}: {String(memoryLegacyEngagement.active_decisions ?? 0)} ·{" "}
            {labels.pendingReviews}: {String(memoryLegacyEngagement.pending_reviews ?? 0)}
          </p>
          {memoryLegacyEngagement.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{memoryLegacyEngagement.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {memoryLegacySuccessCriteria.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.memoryLegacySuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {memoryLegacySuccessCriteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {omlebp94Links.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.memoryLegacyIntegrationLinks}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {omlebp94Links.map((link) => {
              const route = typeof link.route === "string" ? link.route : null;
              const label = typeof link.label === "string" ? link.label : route ?? "";
              return (
                <li key={label}>
                  {route ? (
                    <Link href={route} className="text-emerald-600 hover:underline">
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                  {link.note ? <span className="ml-2 text-xs text-gray-500">{link.note}</span> : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {blueprint126?.phase ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50/40 p-6">
          <h2 className="text-sm font-semibold">{labels.phase126Title}</h2>
          {dashboard.phase126_mission ? (
            <p className="mt-2 text-sm font-medium text-rose-900">{dashboard.phase126_mission}</p>
          ) : null}
          {dashboard.phase126_philosophy ? (
            <p className="mt-2 text-xs text-rose-900">{dashboard.phase126_philosophy}</p>
          ) : null}
          {dashboard.phase126_abos_principle ? (
            <p className="mt-1 text-xs font-medium text-rose-800">{dashboard.phase126_abos_principle}</p>
          ) : null}
          {dashboard.phase126_vision ? (
            <p className="mt-2 text-xs italic text-rose-700">{dashboard.phase126_vision}</p>
          ) : null}
          {dashboard.phase126_distinction_note ? (
            <p className="mt-2 text-xs text-rose-700">{dashboard.phase126_distinction_note}</p>
          ) : null}
          {dashboard.organizational_memory_enterprise_note ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.organizational_memory_enterprise_note}</p>
          ) : null}
        </section>
      ) : null}

      {phase126Objectives.length > 0 && (
        <section className="rounded-lg border border-rose-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.phase126Objectives}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {phase126Objectives.map((obj: ContinuityObjective) => (
              <li key={obj.key ?? obj.label} className="rounded border border-rose-50 p-3 text-sm">
                <div className="font-medium">
                  {obj.emoji ? `${obj.emoji} ` : ""}
                  {obj.label}
                </div>
                {obj.description ? <p className="mt-1 text-xs text-gray-600">{obj.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase126MemoryCenter.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.phase126MemoryCenter}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {phase126MemoryCenter.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-gray-100 px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase126MemoryArchive.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.phase126MemoryArchive}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase126MemoryArchive.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-gray-100 px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase126LegacyCaptures && (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.phase126LegacyCaptures}</h3>
          {phase126LegacyCaptures.principle ? (
            <p className="mt-2 text-xs text-violet-900">{phase126LegacyCaptures.principle}</p>
          ) : null}
          {phase126LegacyCaptures.boundary_note ? (
            <p className="mt-2 text-xs text-violet-700">{phase126LegacyCaptures.boundary_note}</p>
          ) : null}
          {(phase126LegacyCaptures.captures?.length ?? 0) > 0 ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {(phase126LegacyCaptures.captures as EnterpriseIntelligenceBlueprintItem[]).map((cap) => (
                <li key={cap.key ?? cap.label} className="rounded border border-violet-100 bg-white px-3 py-2 text-xs">
                  <span className="font-medium">{cap.label}</span>
                  {cap.description ? <p className="mt-1 text-gray-500">{cap.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {phase126Succession.length > 0 && (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.phase126Succession}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase126Succession.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-indigo-100 bg-white px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase126Storytelling.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.phase126Storytelling}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase126Storytelling.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-gray-100 px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase126KnowledgeProtection.length > 0 && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.phase126KnowledgeProtection}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase126KnowledgeProtection.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-amber-100 bg-white px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase126MemoryDiscovery?.questions && Array.isArray(phase126MemoryDiscovery.questions) && (
        <section className="rounded-lg border border-rose-100 bg-rose-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.phase126MemoryDiscovery}</h3>
          {phase126MemoryDiscovery.principle ? (
            <p className="mt-2 text-xs text-rose-900">{phase126MemoryDiscovery.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {(phase126MemoryDiscovery.questions as MemoryLegacyBlueprintSection["questions"])!.map((q) => (
              <li key={q.key ?? q.question} className="rounded border border-rose-100 bg-white px-3 py-2 text-xs">
                <span className="font-medium">
                  {q.emoji ? `${q.emoji} ` : ""}
                  {q.question}
                </span>
                {q.description ? <p className="mt-1 text-gray-500">{q.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase126LegacyCompanion.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.phase126LegacyCompanion}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase126LegacyCompanion.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-gray-100 px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase126CompanionAdaptation && (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.phase126CompanionAdaptation}</h3>
          {phase126CompanionAdaptation.principle ? (
            <p className="mt-2 text-xs text-indigo-900">{phase126CompanionAdaptation.principle}</p>
          ) : null}
          {(phase126CompanionAdaptation.examples?.length ?? 0) > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {phase126CompanionAdaptation.examples!.map((ex, i) => (
                <li key={ex.key ?? i} className="rounded border border-indigo-100 bg-white px-3 py-2 text-xs">
                  {ex.prompt ?? ex.example ?? ex.text}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {phase126CompanionLimits.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.phase126CompanionLimitations}</h3>
          <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
            {phase126CompanionLimits.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label}>
                {item.label}
                {item.description ? ` — ${item.description}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase126SelfLove && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.phase126SelfLove}</h3>
          {phase126SelfLove.principle ? <p className="mt-2 text-xs">{phase126SelfLove.principle}</p> : null}
          {(phase126SelfLove.practices?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs">
              {(phase126SelfLove.practices as Array<{ label?: string; description?: string }>).map((item) => (
                <li key={item.label}>{item.label}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {phase126Heritage.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.phase126HeritageLibrary}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase126Heritage.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-gray-100 px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase126LimitationPrinciples && (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.phase126LimitationPrinciples}</h3>
          {phase126LimitationPrinciples.principle ? (
            <p className="mt-2 text-xs text-gray-600">{phase126LimitationPrinciples.principle}</p>
          ) : null}
          {(phase126LimitationPrinciples.forbidden?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
              {phase126LimitationPrinciples.forbidden!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {typeof phase126Engagement.objectives_count === "number" ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.phase126Engagement}</h3>
          <p className="mt-2 text-gray-700">
            {labels.activeRecords}: {String(phase126Engagement.phase126_active_records ?? 0)} ·{" "}
            {labels.activeDecisions}: {String(phase126Engagement.phase126_active_decisions ?? 0)} ·{" "}
            {labels.pendingReviews}: {String(phase126Engagement.phase126_pending_reviews ?? 0)}
          </p>
          {phase126Engagement.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{String(phase126Engagement.privacy_note)}</p>
          ) : null}
        </section>
      ) : null}

      {phase126SuccessCriteria.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.phase126SuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {phase126SuccessCriteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {omlebp126Links.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.phase126IntegrationLinks}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {omlebp126Links.map((link) => {
              const route = typeof link.route === "string" ? link.route : null;
              const label = typeof link.label === "string" ? link.label : route ?? "";
              return (
                <li key={label}>
                  {route ? (
                    <Link href={route} className="text-rose-600 hover:underline">
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                  {link.note ? <span className="ml-2 text-xs text-gray-500">{link.note}</span> : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {dashboard.phase126_privacy_note ? (
        <section className="rounded-lg border border-gray-100 px-4 py-3 text-xs text-gray-500">
          {dashboard.phase126_privacy_note}
        </section>
      ) : null}

      {blueprint152?.phase ? (
        <section className="rounded-xl border border-teal-200 bg-teal-50/40 p-6">
          <h2 className="text-sm font-semibold">{labels.phase152Title}</h2>
          {dashboard.phase152_mission ? (
            <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.phase152_mission}</p>
          ) : null}
          {dashboard.phase152_philosophy ? (
            <p className="mt-2 text-xs text-teal-900">{dashboard.phase152_philosophy}</p>
          ) : null}
          {dashboard.phase152_abos_principle ? (
            <p className="mt-1 text-xs font-medium text-teal-800">{dashboard.phase152_abos_principle}</p>
          ) : null}
          {dashboard.phase152_vision ? (
            <p className="mt-2 text-xs italic text-teal-700">{dashboard.phase152_vision}</p>
          ) : null}
          {dashboard.phase152_distinction_note ? (
            <p className="mt-2 text-xs text-teal-700">{dashboard.phase152_distinction_note}</p>
          ) : null}
          {dashboard.organizational_legacy_succession_note ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.organizational_legacy_succession_note}</p>
          ) : null}
        </section>
      ) : null}

      {phase152Objectives.length > 0 && (
        <section className="rounded-lg border border-teal-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.phase152Objectives}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {phase152Objectives.map((obj: ContinuityObjective) => (
              <li key={obj.key ?? obj.label} className="rounded border border-teal-50 p-3 text-sm">
                <div className="font-medium">
                  {obj.emoji ? `${obj.emoji} ` : ""}
                  {obj.label}
                </div>
                {obj.description ? <p className="mt-1 text-xs text-gray-600">{obj.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase152LegacyCenter.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.phase152LegacyCenter}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {phase152LegacyCenter.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-gray-100 px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase152Succession.length > 0 && (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.phase152Succession}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase152Succession.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-indigo-100 bg-white px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase152CriticalKnowledge.length > 0 && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.phase152CriticalKnowledge}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase152CriticalKnowledge.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-amber-100 bg-white px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase152ExecutiveLegacy && (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.phase152ExecutiveLegacy}</h3>
          {phase152ExecutiveLegacy.principle ? (
            <p className="mt-2 text-xs text-violet-900">{phase152ExecutiveLegacy.principle}</p>
          ) : null}
          {(phase152ExecutiveLegacy.dimensions?.length ?? 0) > 0 ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {(phase152ExecutiveLegacy.dimensions as EnterpriseIntelligenceBlueprintItem[]).map((dim) => (
                <li key={dim.key ?? dim.label} className="rounded border border-violet-100 bg-white px-3 py-2 text-xs">
                  <span className="font-medium">{dim.label}</span>
                  {dim.description ? <p className="mt-1 text-gray-500">{dim.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {phase152LegacyCompanion.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.phase152LegacyCompanion}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase152LegacyCompanion.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-gray-100 px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase152ContinuityReadiness.length > 0 && (
        <section className="rounded-lg border border-indigo-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.phase152ContinuityReadiness}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase152ContinuityReadiness.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-indigo-50 px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase152Storytelling && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.phase152Storytelling}</h3>
          {phase152Storytelling.principle ? (
            <p className="mt-2 text-xs text-gray-700">{phase152Storytelling.principle}</p>
          ) : null}
          {phase152Storytelling.boundary_note ? (
            <p className="mt-2 text-xs text-gray-500">{phase152Storytelling.boundary_note}</p>
          ) : null}
          {Array.isArray(phase152Storytelling.story_types) && phase152Storytelling.story_types.length > 0 ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {(phase152Storytelling.story_types as EnterpriseIntelligenceBlueprintItem[]).map((story) => (
                <li key={story.key ?? story.label} className="rounded border border-gray-100 px-3 py-2 text-xs">
                  <span className="font-medium">{story.label}</span>
                  {story.description ? <p className="mt-1 text-gray-500">{story.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {phase152InstitutionalMemory.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.phase152InstitutionalMemory}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase152InstitutionalMemory.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label} className="rounded border border-gray-100 px-3 py-2 text-xs">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-gray-500">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase152CompanionLimits.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.phase152CompanionLimitations}</h3>
          <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
            {phase152CompanionLimits.map((item: EnterpriseIntelligenceBlueprintItem) => (
              <li key={item.key ?? item.label}>
                {item.label}
                {item.description ? ` — ${item.description}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase152SelfLove && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.phase152SelfLove}</h3>
          {phase152SelfLove.principle ? <p className="mt-2 text-xs">{phase152SelfLove.principle}</p> : null}
          {(phase152SelfLove.practices?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs">
              {(phase152SelfLove.practices as Array<{ label?: string; description?: string }>).map((item) => (
                <li key={item.label}>{item.label}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {phase152Security && (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.phase152Security}</h3>
          {phase152Security.principle ? (
            <p className="mt-2 text-xs text-gray-600">{phase152Security.principle}</p>
          ) : null}
          {(() => {
            const requirements = phase152Security.requirements;
            if (!Array.isArray(requirements) || requirements.length === 0) return null;
            return (
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {(requirements as EnterpriseIntelligenceBlueprintItem[]).map((req) => (
                <li key={req.key ?? req.label} className="rounded border border-gray-100 px-3 py-2 text-xs">
                  <span className="font-medium">{req.label}</span>
                  {req.description ? <p className="mt-1 text-gray-500">{req.description}</p> : null}
                </li>
              ))}
            </ul>
            );
          })()}
        </section>
      )}

      {typeof phase152Engagement.phase152_objectives_count === "number" ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.phase152Engagement}</h3>
          <p className="mt-2 text-gray-700">
            {labels.successionPlans}: {String(phase152Engagement.phase152_active_succession_plans ?? 0)} ·{" "}
            {labels.knowledgeEntries}: {String(phase152Engagement.phase152_active_knowledge_entries ?? 0)} ·{" "}
            {labels.legacyReviews}: {String(phase152Engagement.phase152_pending_legacy_reviews ?? 0)} ·{" "}
            {labels.storyRecords}: {String(phase152Engagement.phase152_active_story_records ?? 0)}
          </p>
          {phase152Engagement.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{String(phase152Engagement.privacy_note)}</p>
          ) : null}
        </section>
      ) : null}

      {phase152SuccessCriteria.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.phase152SuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {phase152SuccessCriteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {olsibp152Links.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.phase152IntegrationLinks}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {olsibp152Links.map((link) => {
              const route = typeof link.route === "string" ? link.route : null;
              const label = typeof link.label === "string" ? link.label : route ?? "";
              return (
                <li key={label}>
                  {route ? (
                    <Link href={route} className="text-teal-600 hover:underline">
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                  {link.note ? <span className="ml-2 text-xs text-gray-500">{link.note}</span> : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {dashboard.phase152_privacy_note ? (
        <section className="rounded-lg border border-gray-100 px-4 py-3 text-xs text-gray-500">
          {dashboard.phase152_privacy_note}
        </section>
      ) : null}

      {dashboard.memory_categories && dashboard.memory_categories.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.memoryCategories}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.memory_categories.map((cat) => (
              <li key={cat.key ?? cat.label} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{cat.label}</span>
                {cat.examples && cat.examples.length > 0 ? (
                  <ul className="mt-1 list-inside list-disc text-xs text-gray-500">
                    {cat.examples.map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.memory_capabilities && dashboard.memory_capabilities.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.memoryCapabilities}</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {dashboard.memory_capabilities.map((cap) => (
              <li key={cap.key ?? cap.label} className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs">
                {cap.label}
              </li>
            ))}
          </ul>
          {dashboard.capability_examples && dashboard.capability_examples.length > 0 ? (
            <ul className="mt-3 space-y-1 text-xs italic text-gray-600">
              {dashboard.capability_examples.map((ex) => (
                <li key={ex}>&ldquo;{ex}&rdquo;</li>
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
                <li key={label}>
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

      {dashboard.trust_connection ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          {dashboard.trust_connection.principle ? (
            <p className="mt-2 text-gray-600">{dashboard.trust_connection.principle}</p>
          ) : null}
          {dashboard.trust_connection.organizations_should_understand &&
          dashboard.trust_connection.organizations_should_understand.length > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
              {dashboard.trust_connection.organizations_should_understand.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.memory_levels && dashboard.memory_levels.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.memoryLevels}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.memory_levels.map((level) => (
              <li key={level.level} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{level.label}</span>
                <p className="mt-1 text-xs text-gray-500">{level.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_note ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          {dashboard.self_love_note}
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeRecords}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.active_records ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.archivedRecords}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.archived_records ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeDecisions}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.active_decisions ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.pendingReviews}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.pending_reviews ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recentLearnings}</h3>
        {dashboard.recent_learnings.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.recent_learnings.map((item) => (
              <li key={item.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{item.title}</span>
                {item.memory_level ? (
                  <span className="ml-2 text-xs text-gray-400">({item.memory_level})</span>
                ) : null}
                {item.category ? (
                  <span className="ml-2 text-xs text-gray-500">{item.category}</span>
                ) : null}
                {item.summary ? <p className="mt-1 text-gray-600">{item.summary}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recurringThemes}</h3>
        {dashboard.recurring_themes.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {dashboard.recurring_themes.map((theme) => (
              <li
                key={theme.category}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs"
              >
                {theme.category} · {String(theme.count ?? 0)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.frequentlyReferenced}</h3>
        {dashboard.frequently_referenced.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.frequently_referenced.map((item) => (
              <li key={item.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {item.title}
                {typeof item.reference_count === "number" ? (
                  <span className="ml-2 text-xs text-gray-500">
                    {labels.references}: {item.reference_count}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.archivedDecisions}</h3>
        {dashboard.archived_decisions.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.archived_decisions.map((item) => (
              <li key={item.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {item.decision_title}
                {item.review_date ? (
                  <span className="ml-2 text-xs text-gray-500">{item.review_date}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recommendedReviews}</h3>
        {dashboard.recommended_reviews.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.recommended_reviews.map((item) => (
              <li key={item.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {item.review_type} · {item.scheduled_at}
                {item.status ? (
                  <span className="ml-2 text-xs text-gray-500">{item.status}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {dashboard.principles.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.integration_links && dashboard.integration_links.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {dashboard.integration_links.map((link) => {
              const route = typeof link.route === "string" ? link.route : null;
              const label = typeof link.label === "string" ? link.label : route ?? "";
              return (
                <li key={label}>
                  {route ? (
                    <Link href={route} className="text-violet-600 hover:underline">
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
