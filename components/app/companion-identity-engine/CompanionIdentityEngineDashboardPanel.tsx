"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCompanionIdentityEngineDashboard,
  type CompanionIdentityEngineDashboard,
  type HumanPartnershipIntegrationLink,
  type HumanPartnershipObjective,
  type IdentityTrait,
  type ModuleConsistencyEntry,
  type SignatureElement,
} from "@/lib/aipify/companion-identity-engine";

type Props = { labels: Record<string, string> };

export function CompanionIdentityEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CompanionIdentityEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [signatureEnabled, setSignatureEnabled] = useState(true);
  const [bellMomentsEnabled, setBellMomentsEnabled] = useState(true);
  const [selfLoveRefsEnabled, setSelfLoveRefsEnabled] = useState(true);
  const [playfulEnabled, setPlayfulEnabled] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/companion-identity-engine/dashboard");
    if (res.ok) {
      const parsed = parseCompanionIdentityEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.signature_elements_enabled === "boolean") {
        setSignatureEnabled(parsed.settings.signature_elements_enabled);
      }
      if (typeof parsed.settings?.bell_moments_enabled === "boolean") {
        setBellMomentsEnabled(parsed.settings.bell_moments_enabled);
      }
      if (typeof parsed.settings?.self_love_refs_enabled === "boolean") {
        setSelfLoveRefsEnabled(parsed.settings.self_love_refs_enabled);
      }
      if (typeof parsed.settings?.playful_when_appropriate === "boolean") {
        setPlayfulEnabled(parsed.settings.playful_when_appropriate);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveSettings() {
    setSavingSettings(true);
    setActionError(null);
    const res = await fetch("/api/aipify/companion-identity-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signature_elements_enabled: signatureEnabled,
        bell_moments_enabled: bellMomentsEnabled,
        self_love_refs_enabled: selfLoveRefsEnabled,
        playful_when_appropriate: playfulEnabled,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.settingsFailed);
    } else {
      await load();
    }
    setSavingSettings(false);
  }

  async function exportReport() {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/companion-identity-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    }
    setExporting(false);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const permissions = dashboard.permissions ?? {};
  const canManage = Boolean(permissions.can_manage);
  const canExport = Boolean(permissions.can_export);
  const traits = dashboard.core_identity_traits ?? [];
  const commRules = dashboard.communication_style_rules ?? [];
  const personalityTraits = dashboard.personality_traits ?? [];
  const signatureElements = dashboard.signature_elements ?? [];
  const modules = dashboard.module_consistency ?? [];
  const integrationLinks = dashboard.integration_links ?? {};
  const fox = dashboard.fox_exchange;
  const characteristics = dashboard.companion_characteristics ?? [];
  const commStandards = dashboard.communication_standards ?? [];
  const playfulMoments = dashboard.playful_moments ?? [];
  const selfLoveImpl = dashboard.self_love_implementation;
  const memoryRules = dashboard.companion_memory_rules;
  const orgBoundaries = dashboard.org_configuration_boundaries;
  const successCriteria = dashboard.success_criteria ?? [];
  const visionPhrases = dashboard.vision_phrases ?? [];
  const blueprint = dashboard.implementation_blueprint;
  const namingPolicy = dashboard.companion_naming_policy;
  const labelReplacements = namingPolicy?.label_replacements ?? [];
  const supportExamples = namingPolicy?.support_panel_examples ?? [];
  const namingPhilosophy = namingPolicy?.companion_philosophy ?? [];
  const namingVisionPhrases = namingPolicy?.vision_phrases ?? [];
  const namingFaq = namingPolicy?.faq_items ?? [];
  const globalPolicy = dashboard.aipify_first_language_policy;
  const globalLabelReplacements = globalPolicy?.label_replacements ?? [];
  const appliesToSurfaces = globalPolicy?.applies_to_surfaces ?? [];
  const technicalExceptions = globalPolicy?.technical_exceptions ?? [];
  const partnershipObjectives = dashboard.human_partnership_objectives ?? [];
  const partnershipQuestions = dashboard.human_partnership_questions;
  const evolutionPrinciples = dashboard.human_partnership_evolution_principles;
  const personalization = dashboard.human_partnership_personalization;
  const healthyDependency = dashboard.human_partnership_healthy_dependency;
  const partnershipGuidance = dashboard.human_partnership_companion_guidance;
  const evolutionStages = dashboard.human_partnership_evolution_stages;
  const partnershipSelfLove = dashboard.human_partnership_self_love;
  const partnershipLeadership = dashboard.human_partnership_leadership;
  const partnershipTrust = dashboard.human_partnership_trust;
  const partnershipPrivacy = dashboard.human_partnership_privacy;
  const partnershipSuccessCriteria = dashboard.human_partnership_success_criteria ?? [];
  const partnershipVisionPhrases = dashboard.human_partnership_vision_phrases ?? [];
  const partnershipIntegrationLinks = dashboard.human_partnership_integration_links ?? [];
  const blueprint99 = dashboard.implementation_blueprint_phase99;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-indigo-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs text-indigo-700">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-1 text-xs text-indigo-700">{dashboard.vision}</p> : null}
        <p className="mt-2 text-xs text-indigo-700">
          {dashboard.distinction_note ?? labels.distinctionNote}
        </p>
        {blueprint?.phase ? (
          <p className="mt-2 text-xs font-medium text-indigo-800">{blueprint.phase}</p>
        ) : null}
        {dashboard.companion_identity_engine_note ? (
          <p className="mt-1 text-xs text-indigo-600">{dashboard.companion_identity_engine_note}</p>
        ) : null}
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      {namingPolicy && (
        <section className="rounded-lg border border-sky-200 bg-sky-50/40 p-4">
          <h3 className="text-sm font-semibold">{labels.companionNamingTitle}</h3>
          <p className="mt-1 text-xs text-sky-900">{labels.companionNamingSubtitle}</p>
          {namingPolicy.principle ? (
            <p className="mt-2 text-sm text-gray-700">{namingPolicy.principle}</p>
          ) : null}
          {labelReplacements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-700">{labels.companionNamingReplacements}</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {labelReplacements.map((item) => (
                  <li key={item.avoid ?? item.use} className="flex flex-wrap gap-2">
                    <span className="text-red-700 line-through">{item.avoid}</span>
                    <span className="text-gray-500">→</span>
                    <span className="font-medium text-emerald-800">{item.use}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {supportExamples.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-700">{labels.companionNamingSupportExamples}</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {supportExamples.map((item) => (
                  <li key={item.old ?? item.new} className="flex flex-wrap gap-2">
                    <span className="text-red-700 line-through">{item.old}</span>
                    <span className="text-gray-500">→</span>
                    <span className="font-medium text-emerald-800">{item.new}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {namingPhilosophy.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-700">{labels.companionNamingPhilosophy}</h4>
              <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                {namingPhilosophy.map((phrase, i) => (
                  <li key={i}>{phrase}</li>
                ))}
              </ul>
            </div>
          )}
          {namingVisionPhrases.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-700">{labels.companionNamingVision}</h4>
              <ul className="mt-2 space-y-1 text-sm italic text-sky-900">
                {namingVisionPhrases.map((phrase, i) => (
                  <li key={i}>{phrase}</li>
                ))}
              </ul>
            </div>
          )}
          {namingFaq.length > 0 && (
            <div className="mt-4 space-y-3">
              <h4 className="text-xs font-medium text-gray-700">{labels.companionNamingFaq}</h4>
              {namingFaq.map((item) => (
                <div key={item.key ?? item.question} className="rounded border border-sky-100 bg-white p-3 text-sm">
                  <div className="font-medium">{item.question}</div>
                  {item.answer ? <p className="mt-1 text-xs text-gray-600">{item.answer}</p> : null}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {globalPolicy && (
        <section className="rounded-lg border border-violet-200 bg-violet-50/40 p-4">
          <h3 className="text-sm font-semibold">{labels.aipifyFirstLanguageTitle}</h3>
          <p className="mt-1 text-xs text-violet-900">{labels.aipifyFirstLanguageSubtitle}</p>
          {globalPolicy.core_principle ? (
            <p className="mt-2 text-sm text-gray-700">{globalPolicy.core_principle}</p>
          ) : null}
          {globalPolicy.marketing_principle ? (
            <p className="mt-2 text-xs text-violet-800">{globalPolicy.marketing_principle}</p>
          ) : null}
          {globalLabelReplacements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-700">{labels.aipifyFirstLanguageReplacements}</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {globalLabelReplacements.map((item) => (
                  <li key={item.avoid ?? item.use} className="flex flex-wrap gap-2">
                    <span className="text-red-700 line-through">{item.avoid}</span>
                    <span className="text-gray-500">→</span>
                    <span className="font-medium text-emerald-800">{item.use}</span>
                    {item.example ? (
                      <span className="w-full text-xs text-gray-500">{item.example}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {appliesToSurfaces.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-700">{labels.aipifyFirstLanguageAppliesTo}</h4>
              <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                {appliesToSurfaces.map((surface, i) => (
                  <li key={i}>{surface}</li>
                ))}
              </ul>
            </div>
          )}
          {technicalExceptions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-700">{labels.aipifyFirstLanguageExceptions}</h4>
              <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                {technicalExceptions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {(dashboard.human_partnership_mission || blueprint99?.phase) && (
        <section className="rounded-xl border border-rose-200 bg-rose-50/40 p-6">
          <h2 className="text-sm font-semibold">{labels.humanPartnershipTitle}</h2>
          <p className="mt-1 text-xs text-rose-900">{labels.humanPartnershipSubtitle}</p>
          {dashboard.human_partnership_mission ? (
            <p className="mt-2 text-sm font-medium text-rose-900">{dashboard.human_partnership_mission}</p>
          ) : null}
          {dashboard.human_partnership_philosophy ? (
            <p className="mt-2 text-xs text-rose-900">{dashboard.human_partnership_philosophy}</p>
          ) : null}
          {dashboard.human_partnership_abos_principle ? (
            <p className="mt-1 text-xs font-medium text-rose-800">{dashboard.human_partnership_abos_principle}</p>
          ) : null}
          {dashboard.human_partnership_vision ? (
            <p className="mt-2 text-xs italic text-rose-700">{dashboard.human_partnership_vision}</p>
          ) : null}
          {dashboard.human_partnership_distinction_note ? (
            <p className="mt-2 text-xs text-rose-700">{dashboard.human_partnership_distinction_note}</p>
          ) : null}
          {dashboard.human_partnership_note ? (
            <p className="mt-1 text-xs text-rose-600">{dashboard.human_partnership_note}</p>
          ) : null}
        </section>
      )}

      {partnershipObjectives.length > 0 && (
        <section className="rounded-lg border border-rose-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipObjectives}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {partnershipObjectives.map((obj: HumanPartnershipObjective) => (
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

      {partnershipQuestions?.questions && Array.isArray(partnershipQuestions.questions) && (
        <section className="rounded-lg border border-rose-100 bg-rose-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipQuestions}</h3>
          {partnershipQuestions.principle ? (
            <p className="mt-2 text-xs text-rose-900">{partnershipQuestions.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {partnershipQuestions.questions.map((q) => (
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

      {evolutionPrinciples?.principles && evolutionPrinciples.principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipEvolutionPrinciples}</h3>
          {evolutionPrinciples.principle ? (
            <p className="mt-2 text-xs text-gray-600">{evolutionPrinciples.principle}</p>
          ) : null}
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {evolutionPrinciples.principles.map((p) => (
              <li key={p.key ?? p.label} className="rounded border border-gray-100 px-3 py-2 text-xs">
                <span className="font-medium">
                  {p.emoji ? `${p.emoji} ` : ""}
                  {p.label}
                </span>
                {p.description ? <p className="mt-1 text-gray-500">{p.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {personalization?.dimensions && personalization.dimensions.length > 0 && (
        <section className="rounded-lg border border-violet-100 bg-violet-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipPersonalization}</h3>
          {personalization.principle ? (
            <p className="mt-2 text-xs text-violet-900">{personalization.principle}</p>
          ) : null}
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {personalization.dimensions.map((dim) => (
              <li key={dim.key ?? dim.label} className="rounded border border-violet-100 bg-white px-3 py-2 text-xs">
                <span className="font-medium">{dim.label}</span>
                {dim.description ? <p className="mt-1 text-gray-500">{dim.description}</p> : null}
              </li>
            ))}
          </ul>
          {personalization.boundary_note ? (
            <p className="mt-3 text-xs text-violet-700">{personalization.boundary_note}</p>
          ) : null}
        </section>
      )}

      {healthyDependency && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipHealthyDependency}</h3>
          {healthyDependency.principle ? (
            <p className="mt-2 text-xs text-amber-900">{healthyDependency.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {(healthyDependency.encourage?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-medium text-emerald-700">{labels.humanPartnershipEncourage}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {healthyDependency.encourage!.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {(healthyDependency.avoid?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-medium text-red-700">{labels.humanPartnershipAvoid}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {healthyDependency.avoid!.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {evolutionStages?.stages && evolutionStages.stages.length > 0 && (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipEvolutionStages}</h3>
          {evolutionStages.principle ? (
            <p className="mt-2 text-xs text-indigo-900">{evolutionStages.principle}</p>
          ) : null}
          <ol className="mt-3 space-y-2">
            {evolutionStages.stages.map((stage) => (
              <li key={stage.key ?? stage.label} className="rounded border border-indigo-100 bg-white px-3 py-2 text-sm">
                <span className="font-medium">
                  {stage.stage ? `${stage.stage}. ` : ""}
                  {stage.emoji ? `${stage.emoji} ` : ""}
                  {stage.label}
                </span>
                {stage.description ? <p className="mt-1 text-xs text-gray-600">{stage.description}</p> : null}
              </li>
            ))}
          </ol>
          {evolutionStages.progression_note ? (
            <p className="mt-3 text-xs text-indigo-700">{evolutionStages.progression_note}</p>
          ) : null}
        </section>
      )}

      {partnershipGuidance?.examples && partnershipGuidance.examples.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipCompanionGuidance}</h3>
          {partnershipGuidance.principle ? (
            <p className="mt-2 text-xs text-gray-600">{partnershipGuidance.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {partnershipGuidance.examples.map((ex) => (
              <li key={ex.key ?? ex.prompt} className="rounded border border-gray-100 px-3 py-2 text-xs">
                <span className="font-medium">
                  {ex.emoji ? `${ex.emoji} ` : ""}
                  {ex.prompt}
                </span>
                {ex.consideration ? <p className="mt-1 text-gray-500">{ex.consideration}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {partnershipSelfLove && (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipSelfLove}</h3>
          {partnershipSelfLove.principle ? (
            <p className="mt-2 text-sm text-gray-700">{partnershipSelfLove.principle}</p>
          ) : null}
          {(partnershipSelfLove.quotes?.length ?? 0) > 0 && (
            <ul className="mt-2 space-y-1 text-sm italic text-emerald-900">
              {partnershipSelfLove.quotes!.map((quote, i) => (
                <li key={i}>{quote}</li>
              ))}
            </ul>
          )}
          {partnershipSelfLove.journey_phrase ? (
            <p className="mt-2 text-xs text-emerald-700">{partnershipSelfLove.journey_phrase}</p>
          ) : null}
        </section>
      )}

      {partnershipLeadership?.practices && partnershipLeadership.practices.length > 0 && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipLeadership}</h3>
          {partnershipLeadership.principle ? (
            <p className="mt-2 text-xs text-gray-600">{partnershipLeadership.principle}</p>
          ) : null}
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {partnershipLeadership.practices.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {partnershipTrust && (
        <section className="rounded-lg border border-sky-100 bg-sky-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipTrust}</h3>
          {partnershipTrust.principle ? (
            <p className="mt-2 text-xs text-sky-900">{partnershipTrust.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {(partnershipTrust.organizations_should_understand?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700">{labels.humanPartnershipOrgTrust}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {partnershipTrust.organizations_should_understand!.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {(partnershipTrust.leaders_should_know?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700">{labels.humanPartnershipLeaderTrust}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {partnershipTrust.leaders_should_know!.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {partnershipPrivacy && (
        <section className="rounded-lg border border-red-100 bg-red-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipPrivacy}</h3>
          {partnershipPrivacy.principle ? (
            <p className="mt-2 text-xs text-red-900">{partnershipPrivacy.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {(partnershipPrivacy.forbidden?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-medium text-red-700">{labels.humanPartnershipForbidden}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {partnershipPrivacy.forbidden!.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {(partnershipPrivacy.required?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-medium text-emerald-700">{labels.humanPartnershipRequired}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {partnershipPrivacy.required!.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {partnershipSuccessCriteria.length > 0 && (
        <section className="rounded-lg border border-rose-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {partnershipSuccessCriteria.map((item) => {
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

      {partnershipVisionPhrases.length > 0 && (
        <section className="rounded-lg border border-rose-100 bg-rose-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipVisionPhrases}</h3>
          <ul className="mt-2 space-y-1 text-sm italic text-rose-900">
            {partnershipVisionPhrases.map((phrase, i) => (
              <li key={i}>{phrase}</li>
            ))}
          </ul>
        </section>
      )}

      {partnershipIntegrationLinks.length > 0 && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.humanPartnershipIntegrationLinks}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {partnershipIntegrationLinks.map((link: HumanPartnershipIntegrationLink) => {
              const route = link.route ?? "";
              const isExternalDoc = route.endsWith(".md");
              return (
                <li key={link.key ?? link.label}>
                  {route && !isExternalDoc ? (
                    <Link href={route} className="text-indigo-600 hover:underline">
                      {link.label ?? link.key}
                    </Link>
                  ) : (
                    <span className="text-gray-700">{link.label ?? link.key}</span>
                  )}
                  {link.note ? <span className="ml-2 text-xs text-gray-500">{link.note}</span> : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        {canExport ? (
          <button
            type="button"
            className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
            disabled={exporting}
            onClick={() => void exportReport()}
          >
            {exporting ? labels.exporting : labels.exportReport}
          </button>
        ) : null}
      </div>

      {successCriteria.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {successCriteria.map((item) => {
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

      {characteristics.length > 0 && (
        <section className="rounded-lg border border-indigo-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.companionCharacteristics}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {characteristics.map((c) => (
              <li key={c.key ?? c.label} className="rounded border border-indigo-50 p-3 text-sm">
                <div className="font-medium">
                  {c.emoji ? `${c.emoji} ` : ""}
                  {c.label}
                </div>
                {c.description ? <p className="mt-1 text-xs text-gray-600">{c.description}</p> : null}
                {c.principle_note ? (
                  <p className="mt-1 text-xs text-emerald-700">{c.principle_note}</p>
                ) : null}
                {c.route ? (
                  <Link href={c.route} className="mt-1 inline-block text-xs text-indigo-600 hover:underline">
                    {c.route}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {commStandards.length > 0 && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.communicationStandards}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {commStandards.map((s) => (
              <li key={s.key ?? s.label}>
                <span className="font-medium">{s.label}</span>
                {s.rule ? <span className="text-gray-600"> — {s.rule}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {playfulMoments.length > 0 && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.playfulMoments}</h3>
          <p className="mt-1 text-xs text-amber-800">{labels.playfulMomentsNote}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {playfulMoments.map((m) => (
              <li key={m.key ?? m.label} className="rounded border border-amber-100 bg-white p-2 text-sm">
                <div className="font-medium">
                  {m.emoji ? `${m.emoji} ` : ""}
                  {m.label}
                </div>
                {m.description ? <p className="mt-1 text-xs text-gray-600">{m.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {selfLoveImpl && (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.selfLoveImplementation}</h3>
          {selfLoveImpl.principle ? (
            <p className="mt-2 text-sm text-gray-700">{selfLoveImpl.principle}</p>
          ) : null}
          {selfLoveImpl.boundary_note ? (
            <p className="mt-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
              {selfLoveImpl.boundary_note}
            </p>
          ) : null}
          {(selfLoveImpl.influences?.length ?? 0) > 0 && (
            <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
              {selfLoveImpl.influences?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {memoryRules && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.companionMemory}</h3>
          {memoryRules.principle ? (
            <p className="mt-2 text-sm text-gray-700">{memoryRules.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {(memoryRules.allowed?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-medium text-emerald-700">{labels.memoryAllowed}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {memoryRules.allowed?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {(memoryRules.forbidden?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-medium text-red-700">{labels.memoryForbidden}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {memoryRules.forbidden?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {orgBoundaries && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.orgConfigBoundaries}</h3>
          {orgBoundaries.boundary_note ? (
            <p className="mt-2 text-xs text-gray-600">{orgBoundaries.boundary_note}</p>
          ) : null}
          {(orgBoundaries.configurable?.length ?? 0) > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-medium text-gray-700">{labels.orgConfigurable}</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {orgBoundaries.configurable?.map((item) => (
                  <li key={item.key ?? item.label}>
                    <span className="font-medium">{item.label}</span>
                    {item.via ? <span className="text-gray-500"> — {item.via}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(orgBoundaries.consistent?.length ?? 0) > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-medium text-gray-700">{labels.orgAlwaysConsistent}</h4>
              <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                {orgBoundaries.consistent?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {visionPhrases.length > 0 && (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 space-y-1 text-sm italic text-violet-900">
            {visionPhrases.map((phrase, i) => (
              <li key={i}>{phrase}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-gray-500">{labels.modulesTracked}</dt>
            <dd className="font-medium">{String(summary.modules_tracked ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">{labels.modulesAligned}</dt>
            <dd className="font-medium">{String(summary.modules_aligned ?? 0)}</dd>
          </div>
        </dl>
      </section>

      {traits.length > 0 && (
        <section className="rounded-lg border border-indigo-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.coreIdentityTraits}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {traits.map((t: IdentityTrait) => (
              <li key={t.key ?? t.label} className="rounded border border-indigo-50 p-2">
                <div className="font-medium">{t.label}</div>
                {t.description ? <div className="mt-1 text-xs text-gray-600">{t.description}</div> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {commRules.length > 0 && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.communicationStyle}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {commRules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </section>
      )}

      {personalityTraits.length > 0 && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.personalityTraits}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {personalityTraits.map((trait, i) => (
              <li key={i}>{trait}</li>
            ))}
          </ul>
        </section>
      )}

      {signatureElements.length > 0 && (
        <section className="rounded-lg border border-indigo-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.signatureElements}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {signatureElements.map((el: SignatureElement) => (
              <li key={el.key ?? el.label} className="rounded border border-indigo-50 p-2">
                <div className="font-medium">{el.label}</div>
                {el.description ? <div className="mt-1 text-xs text-gray-600">{el.description}</div> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {fox && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.foxExchange}</h3>
          {fox.title ? <p className="mt-1 text-xs text-amber-800">{fox.title}</p> : null}
          {fox.setup ? <p className="mt-2 text-sm italic text-gray-700">{fox.setup}</p> : null}
          {fox.response ? <p className="mt-1 text-sm text-gray-800">{fox.response}</p> : null}
          {fox.note ? <p className="mt-2 text-xs text-gray-600">{fox.note}</p> : null}
        </section>
      )}

      {dashboard.self_love_note && (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.selfLoveNote}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.self_love_note}</p>
        </section>
      )}

      {dashboard.learning_journey_philosophy && (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.learningJourneyTitle}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.learning_journey_philosophy}</p>
          {dashboard.learning_journey_standard_note ? (
            <p className="mt-2 text-xs text-violet-800">{dashboard.learning_journey_standard_note}</p>
          ) : null}
          {dashboard.learning_journey_abos_principle ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.learning_journey_abos_principle}</p>
          ) : null}
          {dashboard.vision_rose_phrase ? (
            <p className="mt-3 text-sm italic text-violet-900">{dashboard.vision_rose_phrase}</p>
          ) : null}
        </section>
      )}

      {dashboard.capability_gap_examples && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.capabilityGapExamples}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {(dashboard.capability_gap_examples.avoid?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-medium text-red-700">{labels.capabilityGapAvoid}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {dashboard.capability_gap_examples.avoid?.map((phrase, i) => (
                    <li key={i}>{phrase}</li>
                  ))}
                </ul>
              </div>
            )}
            {(dashboard.capability_gap_examples.prefer?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-medium text-emerald-700">{labels.capabilityGapPrefer}</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                  {dashboard.capability_gap_examples.prefer?.map((phrase, i) => (
                    <li key={i}>{phrase}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {(dashboard.growth_principle_phrases?.length ?? 0) > 0 && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.growthPrinciplePhrases}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.growth_principle_phrases?.map((phrase, i) => (
              <li key={i}>{phrase}</li>
            ))}
          </ul>
        </section>
      )}

      {modules.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.moduleConsistency}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {modules.map((m: ModuleConsistencyEntry) => (
              <li
                key={m.id ?? m.module_key}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-100 p-2"
              >
                <div>
                  <div className="font-medium">{m.label}</div>
                  {m.route ? (
                    <Link href={m.route} className="text-xs text-indigo-600 hover:underline">
                      {m.route}
                    </Link>
                  ) : null}
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    m.identity_aligned ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {m.identity_aligned ? labels.aligned : labels.reviewNeeded}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {canManage && (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.identitySettings}</h3>
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={signatureEnabled}
                onChange={(e) => setSignatureEnabled(e.target.checked)}
              />
              {labels.signatureElementsEnabled}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bellMomentsEnabled}
                onChange={(e) => setBellMomentsEnabled(e.target.checked)}
              />
              {labels.bellMomentsEnabled}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selfLoveRefsEnabled}
                onChange={(e) => setSelfLoveRefsEnabled(e.target.checked)}
              />
              {labels.selfLoveRefsEnabled}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={playfulEnabled}
                onChange={(e) => setPlayfulEnabled(e.target.checked)}
              />
              {labels.playfulWhenAppropriate}
            </label>
          </div>
          <button
            type="button"
            disabled={savingSettings}
            onClick={() => void saveSettings()}
            className="mt-3 rounded bg-indigo-600 px-3 py-1.5 text-xs text-white disabled:opacity-50"
          >
            {savingSettings ? labels.saving : labels.saveSettings}
          </button>
        </section>
      )}

      {Object.keys(integrationLinks).length > 0 && (
        <section className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {Object.entries(integrationLinks).map(([key, href]) => {
              const path = String(href);
              const isExternalDoc = path.endsWith(".md");
              return (
                <li key={key}>
                  {isExternalDoc ? (
                    <span className="text-gray-600">{key}: {path}</span>
                  ) : (
                    <Link href={path} className="text-indigo-600 hover:underline">
                      {key}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
