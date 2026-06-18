"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGratitudeRecognitionDashboard,
  type BellMomentsBlueprint,
  type BoundaryPhrases,
  type GratitudeMoment,
  type GratitudeMomentTypeInfo,
  type GratitudeRecognitionDashboard,
  type HumanMomentsBlueprintSection,
  type HumanMomentsCompanionExample,
  type HumanMomentsObjective,
  type IntegrationLinkItem,
  type OrganizationalRecognitionObjective,
  type OrganizationalRecognitionSection,
  type RecognitionCategory,
  type RecognitionRosesBlueprint,
  type RedRoseMoment,
  type SelfRecognitionBlueprint,
} from "@/lib/aipify/gratitude-recognition-engine";

type Props = { labels: Record<string, string> };

function momentTypeBadgeClass(momentType?: string) {
  switch (momentType) {
    case "exceptional_support":
      return "bg-sky-100 text-sky-800";
    case "milestone":
      return "bg-violet-100 text-violet-800";
    case "customer_appreciation":
      return "bg-emerald-100 text-emerald-800";
    case "consistent_helper":
      return "bg-amber-100 text-amber-800";
    case "above_and_beyond":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function statusBadgeClass(status?: string) {
  switch (status) {
    case "celebrated":
      return "bg-emerald-100 text-emerald-800";
    case "acknowledged":
      return "bg-sky-100 text-sky-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function GratitudeRecognitionEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<GratitudeRecognitionDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [sendingRose, setSendingRose] = useState(false);
  const [roseSent, setRoseSent] = useState(false);
  const [digitalRoseEnabled, setDigitalRoseEnabled] = useState(true);
  const [gratitudeMomentsEnabled, setGratitudeMomentsEnabled] = useState(true);
  const [redirectRomantic, setRedirectRomantic] = useState(true);
  const [recipientLabel, setRecipientLabel] = useState("");
  const [messageSummary, setMessageSummary] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/gratitude-recognition-engine/dashboard");
    if (res.ok) {
      const parsed = parseGratitudeRecognitionDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.digital_rose_enabled === "boolean") {
        setDigitalRoseEnabled(parsed.settings.digital_rose_enabled);
      }
      if (typeof parsed.settings?.gratitude_moments_enabled === "boolean") {
        setGratitudeMomentsEnabled(parsed.settings.gratitude_moments_enabled);
      }
      if (typeof parsed.settings?.redirect_romantic_language === "boolean") {
        setRedirectRomantic(parsed.settings.redirect_romantic_language);
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
    const res = await fetch("/api/aipify/gratitude-recognition-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        digital_rose_enabled: digitalRoseEnabled,
        gratitude_moments_enabled: gratitudeMomentsEnabled,
        redirect_romantic_language: redirectRomantic,
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
    const res = await fetch("/api/aipify/gratitude-recognition-engine/export", {
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

  async function sendRose() {
    setSendingRose(true);
    setActionError(null);
    setRoseSent(false);
    const res = await fetch("/api/aipify/gratitude-recognition-engine/rose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient_label: recipientLabel,
        message_summary: messageSummary,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.roseFailed);
    } else {
      setRoseSent(true);
      setRecipientLabel("");
      setMessageSummary("");
      await load();
    }
    setSendingRose(false);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const permissions = dashboard.permissions ?? {};
  const canManage = Boolean(permissions.can_manage);
  const canExport = Boolean(permissions.can_export);
  const canSendRose = Boolean(permissions.can_send_rose);
  const recentMoments = dashboard.recent_moments ?? [];
  const momentTypes = dashboard.gratitude_moment_types ?? [];
  const redRose = dashboard.red_rose_moment;
  const boundaryPhrases = dashboard.boundary_phrases;
  const recentRoses = dashboard.recent_roses ?? {};
  const integrationLinks = dashboard.integration_links ?? {};
  const blueprint = dashboard.implementation_blueprint;
  const recognitionCategories = dashboard.recognition_categories ?? [];
  const bellMoments = dashboard.bell_moments;
  const recognitionRoses = dashboard.recognition_roses;
  const selfRecognition = dashboard.self_recognition;
  const selfLoveConnection = dashboard.self_love_connection;
  const trustConnection = dashboard.trust_connection;
  const orgBoundaries = dashboard.org_configuration_boundaries;
  const successCriteria = dashboard.success_criteria ?? [];
  const visionPhrases = dashboard.vision_phrases ?? [];
  const blueprint53 = dashboard.implementation_blueprint_phase53;
  const humanObjectives = dashboard.human_moments_objectives ?? [];
  const birthdayExperiences = dashboard.birthday_experiences;
  const professionalAnniversaries = dashboard.professional_anniversaries;
  const certificationCelebrations = dashboard.certification_celebrations;
  const communityContributions = dashboard.community_contributions;
  const humanSelfLove = dashboard.human_moments_self_love_connection;
  const companionPrinciples = dashboard.companion_principles;
  const privacyPrinciples = dashboard.privacy_principles;
  const humanMomentsSummary = dashboard.human_moments_summary ?? {};
  const humanSettings = dashboard.human_moments_settings ?? {};
  const humanSuccessCriteria = dashboard.human_moments_success_criteria ?? [];
  const humanVisionPhrases = dashboard.human_moments_vision_phrases ?? [];
  const lehmbpLinks = dashboard.lehmbp_integration_links ?? [];
  const blueprint97 = dashboard.implementation_blueprint_phase97;
  const orgRecognitionObjectives = dashboard.organizational_recognition_objectives ?? [];
  const recognitionMoments = dashboard.recognition_moments;
  const companionRecognitionPrompts = dashboard.companion_recognition_prompts;
  const peerRecognition = dashboard.peer_recognition;
  const leadershipRecognition = dashboard.leadership_recognition;
  const customerAppreciation = dashboard.customer_appreciation;
  const salesExpertRecognition = dashboard.sales_expert_recognition;
  const orgSelfLove = dashboard.organizational_self_love_connection;
  const leadershipInsights = dashboard.leadership_insights;
  const orgTrustConnection = dashboard.organizational_trust_connection;
  const orgPrivacyPrinciples = dashboard.organizational_privacy_principles;
  const orgRecognitionSummary = dashboard.organizational_recognition_summary ?? {};
  const orgSuccessCriteria = dashboard.organizational_recognition_success_criteria ?? [];
  const orgVisionPhrases = dashboard.organizational_recognition_vision_phrases ?? [];
  const oraebp97Links = dashboard.oraebp97_integration_links ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-rose-200 bg-rose-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-rose-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs font-medium text-rose-900">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-1 text-xs italic text-rose-700">{dashboard.vision}</p> : null}
        <p className="mt-2 text-xs text-rose-700">{dashboard.distinction_note ?? labels.distinctionNote}</p>
        {blueprint?.phase ? (
          <p className="mt-2 text-xs font-medium text-rose-800">{blueprint.phase}</p>
        ) : null}
        {dashboard.gratitude_recognition_engine_note ? (
          <p className="mt-1 text-xs text-rose-600">{dashboard.gratitude_recognition_engine_note}</p>
        ) : null}
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}
      {roseSent ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {labels.roseSent}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {canExport ? (
          <button
            type="button"
            className="rounded border border-rose-300 px-3 py-1 text-xs text-rose-800 disabled:opacity-50"
            disabled={exporting}
            onClick={() => void exportReport()}
          >
            {exporting ? labels.exporting : labels.exportReport}
          </button>
        ) : null}
      </div>

      {blueprint53?.title ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/40 p-6">
          <h2 className="text-sm font-semibold">{labels.humanMomentsTitle}</h2>
          {dashboard.human_moments_mission ? (
            <p className="mt-2 text-sm">{dashboard.human_moments_mission}</p>
          ) : null}
          {dashboard.human_moments_philosophy ? (
            <p className="mt-2 text-xs text-violet-900">{dashboard.human_moments_philosophy}</p>
          ) : null}
          {dashboard.human_moments_abos_principle ? (
            <p className="mt-1 text-xs font-medium text-violet-800">{dashboard.human_moments_abos_principle}</p>
          ) : null}
          <p className="mt-2 text-xs font-medium text-violet-800">{blueprint53.title}</p>
          {dashboard.human_moments_distinction_note ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.human_moments_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      {humanObjectives.length > 0 && (
        <section className="rounded-lg border border-violet-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.humanMomentsObjectives}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {humanObjectives.map((obj: HumanMomentsObjective) => (
              <li key={obj.key ?? obj.label} className="rounded border border-violet-50 p-3 text-sm">
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

      {birthdayExperiences && (
        <section className="rounded-lg border border-rose-100 bg-rose-50/30 p-4">
          <h3 className="text-sm font-semibold">
            {birthdayExperiences.emoji ? `${birthdayExperiences.emoji} ` : ""}
            {labels.birthdayExperiences}
          </h3>
          {birthdayExperiences.principle ? (
            <p className="mt-2 text-xs text-rose-900">{birthdayExperiences.principle}</p>
          ) : null}
          {(birthdayExperiences.companion_examples?.length ?? 0) > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {(birthdayExperiences as HumanMomentsBlueprintSection).companion_examples!.map((ex, i) => (
                <li key={ex.key ?? i} className="rounded border border-rose-100 bg-white px-3 py-2 text-xs">
                  {ex.example ?? ex.text}
                </li>
              ))}
            </ul>
          ) : null}
          {birthdayExperiences.future_scaffold ? (
            <p className="mt-2 text-xs text-gray-500">{birthdayExperiences.future_scaffold}</p>
          ) : null}
        </section>
      )}

      {professionalAnniversaries && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4">
          <h3 className="text-sm font-semibold">
            {professionalAnniversaries.emoji ? `${professionalAnniversaries.emoji} ` : ""}
            {labels.professionalAnniversaries}
          </h3>
          {professionalAnniversaries.principle ? (
            <p className="mt-2 text-xs text-amber-900">{professionalAnniversaries.principle}</p>
          ) : null}
          {(professionalAnniversaries.milestones?.length ?? 0) > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {(professionalAnniversaries as HumanMomentsBlueprintSection).milestones!.map((m, i) => (
                <li key={m.years ?? i} className="rounded border border-amber-100 bg-white px-3 py-2 text-xs">
                  <span className="font-medium">{m.label}</span>
                  {m.example ? <span className="mt-1 block text-gray-600">{m.example}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {certificationCelebrations && (
        <section className="rounded-lg border border-sky-100 bg-sky-50/30 p-4">
          <h3 className="text-sm font-semibold">
            {certificationCelebrations.emoji ? `${certificationCelebrations.emoji} ` : ""}
            {labels.certificationCelebrations}
          </h3>
          {certificationCelebrations.principle ? (
            <p className="mt-2 text-xs text-sky-900">{certificationCelebrations.principle}</p>
          ) : null}
          {(certificationCelebrations.companion_examples?.length ?? 0) > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {(certificationCelebrations as HumanMomentsBlueprintSection).companion_examples!.map((ex, i) => (
                <li key={ex.key ?? i} className="rounded border border-sky-100 bg-white px-3 py-2 text-xs">
                  {ex.text ?? ex.example}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {communityContributions && (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
          <h3 className="text-sm font-semibold">
            {communityContributions.emoji ? `${communityContributions.emoji} ` : ""}
            {labels.communityContributions}
          </h3>
          {communityContributions.principle ? (
            <p className="mt-2 text-xs text-emerald-900">{communityContributions.principle}</p>
          ) : null}
          {(communityContributions.examples?.length ?? 0) > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {(communityContributions.examples as HumanMomentsCompanionExample[]).map((ex, i) => (
                <li key={i} className="rounded border border-emerald-100 bg-white px-3 py-2 text-xs">
                  {typeof ex === "string" ? ex : (ex.text ?? ex.example)}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {companionPrinciples && (
        <section className="rounded-lg border border-violet-100 bg-violet-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.companionPrinciples}</h3>
          {companionPrinciples.principle ? (
            <p className="mt-2 text-sm text-gray-700">{companionPrinciples.principle}</p>
          ) : null}
          {(companionPrinciples.qualities?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
              {companionPrinciples.qualities?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : null}
          {companionPrinciples.cultural_note ? (
            <p className="mt-2 text-xs text-gray-500">{companionPrinciples.cultural_note}</p>
          ) : null}
        </section>
      )}

      {privacyPrinciples && (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.privacyPrinciples}</h3>
          {privacyPrinciples.principle ? (
            <p className="mt-2 text-gray-600">{privacyPrinciples.principle}</p>
          ) : null}
          {(privacyPrinciples.controls?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {privacyPrinciples.controls?.map((c, i) => (
                <li key={c.key ?? i}>{c.label}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {humanMomentsSummary.summary_text ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.humanMomentsSummary}</h3>
          <p className="mt-2 text-sm">{humanMomentsSummary.summary_text}</p>
          {humanMomentsSummary.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{humanMomentsSummary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {humanSettings.display_preference ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600">
          <h3 className="text-sm font-semibold text-gray-800">{labels.humanMomentsPreferences}</h3>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            <div>
              <dt>{labels.birthdayVisible}</dt>
              <dd>{humanSettings.birthday_visible ? labels.yes : labels.no}</dd>
            </div>
            <div>
              <dt>{labels.anniversaryVisible}</dt>
              <dd>{humanSettings.anniversary_visible ? labels.yes : labels.no}</dd>
            </div>
            <div>
              <dt>{labels.displayPreference}</dt>
              <dd className="capitalize">{humanSettings.display_preference}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {humanSelfLove && (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.humanMomentsSelfLove}</h3>
          {humanSelfLove.principle ? <p className="mt-2 text-sm text-gray-700">{humanSelfLove.principle}</p> : null}
          {(humanSelfLove.practices?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
              {humanSelfLove.practices?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {humanSuccessCriteria.length > 0 && (
        <section className="rounded-lg border border-violet-200 p-4">
          <h3 className="text-sm font-semibold">{labels.humanMomentsSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {humanSuccessCriteria.map((item) => {
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

      {(humanVisionPhrases.length ?? 0) > 0 && (
        <section className="rounded-lg border border-violet-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.humanMomentsVisionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {humanVisionPhrases.map((phrase, i) => (
              <li key={i}>{phrase}</li>
            ))}
          </ul>
        </section>
      )}

      {lehmbpLinks.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.humanMomentsIntegrationLinks}</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs">
            {lehmbpLinks.map((link: IntegrationLinkItem) => (
              <li key={link.key ?? link.label}>
                {link.route ? (
                  <Link href={link.route} className="text-violet-700 underline">
                    {link.label ?? link.key}
                  </Link>
                ) : (
                  <span className="text-gray-600">{link.label}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {blueprint97?.title ? (
        <section className="rounded-xl border border-sky-200 bg-sky-50/40 p-6">
          <h2 className="text-sm font-semibold">{labels.organizationalRecognitionTitle}</h2>
          {dashboard.organizational_recognition_mission ? (
            <p className="mt-2 text-sm">{dashboard.organizational_recognition_mission}</p>
          ) : null}
          {dashboard.organizational_recognition_philosophy ? (
            <p className="mt-2 text-xs text-sky-900">{dashboard.organizational_recognition_philosophy}</p>
          ) : null}
          {dashboard.organizational_recognition_abos_principle ? (
            <p className="mt-1 text-xs font-medium text-sky-800">{dashboard.organizational_recognition_abos_principle}</p>
          ) : null}
          {dashboard.organizational_recognition_vision ? (
            <p className="mt-1 text-xs italic text-sky-700">{dashboard.organizational_recognition_vision}</p>
          ) : null}
          <p className="mt-2 text-xs font-medium text-sky-800">{blueprint97.title}</p>
          {dashboard.organizational_recognition_distinction_note ? (
            <p className="mt-2 text-xs text-sky-700">{dashboard.organizational_recognition_distinction_note}</p>
          ) : null}
          {dashboard.organizational_recognition_engine_note ? (
            <p className="mt-1 text-xs text-sky-600">{dashboard.organizational_recognition_engine_note}</p>
          ) : null}
        </section>
      ) : null}

      {orgRecognitionObjectives.length > 0 && (
        <section className="rounded-lg border border-sky-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.organizationalRecognitionObjectives}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {orgRecognitionObjectives.map((obj: OrganizationalRecognitionObjective) => (
              <li key={obj.key ?? obj.label} className="rounded border border-sky-50 p-3 text-sm">
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

      {recognitionMoments?.categories && Array.isArray(recognitionMoments.categories) && recognitionMoments.categories.length > 0 ? (
        <section className="rounded-lg border border-sky-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.recognitionMoments}</h3>
          {recognitionMoments.principle ? (
            <p className="mt-2 text-xs text-gray-600">{recognitionMoments.principle}</p>
          ) : null}
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recognitionMoments.categories.map((cat) => (
              <li key={cat.key ?? cat.label} className="rounded border border-sky-50 p-3 text-sm">
                <div className="font-medium">
                  {cat.emoji ? `${cat.emoji} ` : ""}
                  {cat.label}
                </div>
                {cat.description ? <p className="mt-1 text-xs text-gray-600">{cat.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {companionRecognitionPrompts?.prompts && Array.isArray(companionRecognitionPrompts.prompts) && companionRecognitionPrompts.prompts.length > 0 ? (
        <section className="rounded-lg border border-sky-100 bg-sky-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.companionRecognitionPrompts}</h3>
          {companionRecognitionPrompts.principle ? (
            <p className="mt-2 text-xs text-sky-900">{companionRecognitionPrompts.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {companionRecognitionPrompts.prompts.map((item, i) => (
              <li key={item.key ?? i} className="rounded border border-sky-100 bg-white px-3 py-2 text-xs">
                {item.emoji ? `${item.emoji} ` : ""}
                {item.prompt}
                {item.consideration ? <p className="mt-1 text-gray-500">{item.consideration}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {peerRecognition?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.peerRecognition}</h3>
          <p className="mt-2 text-sm text-gray-700">{peerRecognition.principle}</p>
          {(peerRecognition.gestures?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {peerRecognition.gestures?.map((g, i) => (
                <li key={g.key ?? i}>
                  {g.emoji ? `${g.emoji} ` : ""}
                  {g.label}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {leadershipRecognition?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.leadershipRecognition}</h3>
          <p className="mt-2 text-gray-600">{leadershipRecognition.principle}</p>
          {(leadershipRecognition.practices?.length ?? 0) > 0 ? (
            <ul className="mt-2 space-y-2 text-xs">
              {(leadershipRecognition as OrganizationalRecognitionSection).practices?.map((item, i) => {
                if (typeof item === "string") return <li key={i}>{item}</li>;
                return (
                  <li key={item.key ?? i} className="rounded border border-gray-100 px-3 py-2">
                    {item.emoji ? `${item.emoji} ` : ""}
                    {item.label}
                    {item.description ? ` — ${item.description}` : ""}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      ) : null}

      {customerAppreciation?.principle ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.customerAppreciation}</h3>
          <p className="mt-2 text-sm text-gray-700">{customerAppreciation.principle}</p>
          {(customerAppreciation.dimensions?.length ?? 0) > 0 ? (
            <ul className="mt-2 space-y-2 text-xs">
              {customerAppreciation.dimensions?.map((d, i) => (
                <li key={d.key ?? i}>
                  {d.emoji ? `${d.emoji} ` : ""}
                  <span className="font-medium">{d.label}</span>
                  {d.description ? ` — ${d.description}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {salesExpertRecognition?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.salesExpertRecognition}</h3>
          <p className="mt-2 text-sm text-gray-700">{salesExpertRecognition.principle}</p>
          {(salesExpertRecognition.milestones?.length ?? 0) > 0 ? (
            <ul className="mt-2 space-y-2 text-xs">
              {salesExpertRecognition.milestones?.map((m, i) => (
                <li key={m.key ?? i}>
                  {m.emoji ? `${m.emoji} ` : ""}
                  {m.label}
                  {m.description ? ` — ${m.description}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {orgSelfLove?.principle ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.organizationalSelfLove}</h3>
          <p className="mt-2 text-sm text-gray-700">{orgSelfLove.principle}</p>
          {(orgSelfLove.quotes?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-sm italic text-gray-700">
              {orgSelfLove.quotes?.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {leadershipInsights?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.leadershipInsights}</h3>
          <p className="mt-2 text-gray-600">{leadershipInsights.principle}</p>
          {(leadershipInsights.insights?.length ?? 0) > 0 ? (
            <ul className="mt-2 space-y-2 text-xs">
              {leadershipInsights.insights?.map((ins, i) => (
                <li key={ins.key ?? i}>
                  {ins.emoji ? `${ins.emoji} ` : ""}
                  <span className="font-medium">{ins.label}</span>
                  {ins.description ? ` — ${ins.description}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {orgTrustConnection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.organizationalTrustConnection}</h3>
          <p className="mt-2 text-gray-600">{orgTrustConnection.principle}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 text-xs">
            {(orgTrustConnection.users_should_see?.length ?? 0) > 0 && (
              <div>
                <h4 className="font-semibold text-emerald-700">{labels.usersShouldSee}</h4>
                <ul className="mt-2 list-inside list-disc text-gray-600">
                  {orgTrustConnection.users_should_see?.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {(orgTrustConnection.operators_should_understand?.length ?? 0) > 0 && (
              <div>
                <h4 className="font-semibold text-sky-700">{labels.operatorsShouldUnderstand}</h4>
                <ul className="mt-2 list-inside list-disc text-gray-600">
                  {orgTrustConnection.operators_should_understand?.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {orgPrivacyPrinciples?.principle ? (
        <section className="rounded-lg border border-sky-100 bg-sky-50/20 p-4">
          <h3 className="text-sm font-semibold">{labels.organizationalPrivacyPrinciples}</h3>
          <p className="mt-2 text-xs text-gray-600">{orgPrivacyPrinciples.principle}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 text-xs">
            {(orgPrivacyPrinciples.must_avoid?.length ?? 0) > 0 && (
              <div>
                <h4 className="font-semibold text-red-700">{labels.mustAvoid}</h4>
                <ul className="mt-2 list-inside list-disc text-gray-600">
                  {orgPrivacyPrinciples.must_avoid?.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {(orgPrivacyPrinciples.required?.length ?? 0) > 0 && (
              <div>
                <h4 className="font-semibold text-emerald-700">{labels.required}</h4>
                <ul className="mt-2 list-inside list-disc text-gray-600">
                  {orgPrivacyPrinciples.required?.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {orgRecognitionSummary.summary_text ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.organizationalRecognitionSummary}</h3>
          <p className="mt-2 text-sm">{orgRecognitionSummary.summary_text}</p>
          {orgRecognitionSummary.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{orgRecognitionSummary.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {orgSuccessCriteria.length > 0 && (
        <section className="rounded-lg border border-sky-200 p-4">
          <h3 className="text-sm font-semibold">{labels.organizationalRecognitionSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {orgSuccessCriteria.map((item) => {
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

      {(orgVisionPhrases.length ?? 0) > 0 && (
        <section className="rounded-lg border border-sky-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.organizationalRecognitionVisionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {orgVisionPhrases.map((phrase, i) => (
              <li key={i}>{phrase}</li>
            ))}
          </ul>
        </section>
      )}

      {oraebp97Links.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.organizationalRecognitionIntegrationLinks}</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs">
            {oraebp97Links.map((link: IntegrationLinkItem) => (
              <li key={link.key ?? link.label}>
                {link.route ? (
                  <Link href={link.route} className="text-sky-700 underline">
                    {link.label ?? link.key}
                  </Link>
                ) : (
                  <span className="text-gray-600">{link.label}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {successCriteria.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
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

      {recognitionCategories.length > 0 && (
        <section className="rounded-lg border border-rose-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.recognitionCategories}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recognitionCategories.map((cat: RecognitionCategory) => (
              <li key={cat.key ?? cat.label} className="rounded border border-rose-50 p-3 text-sm">
                <div className="font-medium">{cat.label}</div>
                {(cat.focus?.length ?? 0) > 0 ? (
                  <p className="mt-1 text-xs text-gray-500">{cat.focus?.join(" · ")}</p>
                ) : null}
                {(cat.examples?.length ?? 0) > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
                    {cat.examples?.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {bellMoments && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4">
          <h3 className="text-sm font-semibold">
            {bellMoments.emoji ? `${bellMoments.emoji} ` : ""}
            {labels.bellMoments}
          </h3>
          {bellMoments.principle ? <p className="mt-2 text-xs text-amber-900">{bellMoments.principle}</p> : null}
          {bellMoments.frequency_note ? (
            <p className="mt-1 text-xs text-gray-600">{bellMoments.frequency_note}</p>
          ) : null}
          {(bellMoments.examples?.length ?? 0) > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {(bellMoments as BellMomentsBlueprint).examples!.map((ex, i) => (
                <li key={ex.key ?? i} className="rounded border border-amber-100 bg-white px-3 py-2 text-xs">
                  {ex.text}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {recognitionRoses && (
        <section className="rounded-lg border border-rose-200 bg-rose-50/30 p-4">
          <h3 className="text-sm font-semibold">
            {recognitionRoses.emoji ? `${recognitionRoses.emoji} ` : ""}
            {labels.recognitionRoses}
          </h3>
          {recognitionRoses.principle ? (
            <p className="mt-2 text-xs text-rose-900">{recognitionRoses.principle}</p>
          ) : null}
          {recognitionRoses.boundary_note ? (
            <p className="mt-2 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
              {recognitionRoses.boundary_note}
            </p>
          ) : null}
          {(recognitionRoses.examples?.length ?? 0) > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {(recognitionRoses as RecognitionRosesBlueprint).examples!.map((ex, i) => (
                <li key={ex.key ?? i} className="rounded border border-rose-100 bg-white px-3 py-2 text-xs">
                  {ex.text}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {selfRecognition && (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.selfRecognition}</h3>
          {selfRecognition.principle ? (
            <p className="mt-2 text-sm text-gray-700">{selfRecognition.principle}</p>
          ) : null}
          {(selfRecognition.examples?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
              {(selfRecognition as SelfRecognitionBlueprint).examples!.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {selfLoveConnection && (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          {selfLoveConnection.principle ? (
            <p className="mt-2 text-sm text-gray-700">{selfLoveConnection.principle}</p>
          ) : null}
          {selfLoveConnection.boundary_note ? (
            <p className="mt-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
              {selfLoveConnection.boundary_note}
            </p>
          ) : null}
          {(selfLoveConnection.influences?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
              {selfLoveConnection.influences?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {trustConnection && (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          {trustConnection.principle ? (
            <p className="mt-2 text-gray-600">{trustConnection.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-4 sm:grid-cols-2 text-xs">
            {(trustConnection.prefer?.length ?? 0) > 0 && (
              <div>
                <h4 className="font-semibold text-emerald-700">{labels.preferPhrases}</h4>
                <ul className="mt-2 list-inside list-disc text-gray-600">
                  {trustConnection.prefer?.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {(trustConnection.avoid?.length ?? 0) > 0 && (
              <div>
                <h4 className="font-semibold text-red-700">{labels.avoidPhrases}</h4>
                <ul className="mt-2 list-inside list-disc text-gray-600">
                  {trustConnection.avoid?.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {orgBoundaries && (
        <section className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600">
          <h3 className="text-sm font-semibold text-gray-800">{labels.orgConfiguration}</h3>
          {orgBoundaries.boundary_note ? <p className="mt-2">{orgBoundaries.boundary_note}</p> : null}
          {(orgBoundaries.configurable?.length ?? 0) > 0 ? (
            <ul className="mt-2 list-inside list-disc">
              {orgBoundaries.configurable?.map((item, i) => (
                <li key={item.key ?? i}>
                  {item.label}
                  {item.via ? ` — ${item.via}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {(visionPhrases.length ?? 0) > 0 && (
        <section className="rounded-lg border border-rose-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {visionPhrases.map((phrase, i) => (
              <li key={i}>{phrase}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-gray-500">{labels.momentCount}</dt>
            <dd>{String(summary.moment_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.roseCount}</dt>
            <dd>{String(summary.rose_count ?? recentRoses.count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.digitalRoseEnabled}</dt>
            <dd>{summary.digital_rose_enabled ? labels.yes : labels.no}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.gratitudeMomentsEnabled}</dt>
            <dd>{summary.gratitude_moments_enabled ? labels.yes : labels.no}</dd>
          </div>
        </dl>
      </section>

      {momentTypes.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.gratitudeMomentTypes}</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {(momentTypes as GratitudeMomentTypeInfo[]).map((mt) => (
              <li key={mt.key ?? mt.label} className="rounded border border-rose-100 bg-rose-50/30 p-3">
                <div className="font-medium">{mt.label}</div>
                {mt.description ? <p className="mt-1 text-xs text-gray-600">{mt.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {redRose && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.redRoseMoment}</h3>
          {redRose.feature_description ? (
            <p className="mt-2 text-xs text-gray-600">{redRose.feature_description}</p>
          ) : null}
          {redRose.digital_rose_symbol ? (
            <p className="mt-2 text-xs text-rose-700">{redRose.digital_rose_symbol}</p>
          ) : null}
          {Array.isArray(redRose.example_exchange) && redRose.example_exchange.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {(redRose as RedRoseMoment).example_exchange!.map((line, i) => (
                <li
                  key={i}
                  className={`rounded border px-3 py-2 text-xs ${
                    line.role === "user" ? "border-gray-200 bg-gray-50" : "border-rose-100 bg-rose-50/40"
                  }`}
                >
                  <span className="font-medium capitalize">{line.role}: </span>
                  {line.text}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {boundaryPhrases && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.boundaryPhrases}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <h4 className="font-semibold text-red-700">{labels.avoidPhrases}</h4>
              <ul className="mt-2 list-inside list-disc text-gray-600">
                {((boundaryPhrases as BoundaryPhrases).avoid ?? []).map((p, i) => (
                  <li key={i}>{String(p)}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-700">{labels.preferPhrases}</h4>
              <ul className="mt-2 list-inside list-disc text-gray-600">
                {((boundaryPhrases as BoundaryPhrases).prefer ?? []).map((p, i) => (
                  <li key={i}>{String(p)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {recentMoments.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recentMoments}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(recentMoments as GratitudeMoment[]).map((moment) => (
              <li key={moment.id} className="rounded border border-gray-100 p-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${momentTypeBadgeClass(moment.moment_type)}`}
                  >
                    {moment.moment_type?.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusBadgeClass(moment.status)}`}
                  >
                    {moment.status}
                  </span>
                  {moment.recognition_target_role ? (
                    <span className="text-xs text-gray-500">
                      → {moment.recognition_target_role.replace(/_/g, " ")}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-gray-700">{moment.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.self_love_note || dashboard.trust_note) && (
        <section className="rounded-lg border border-gray-200 p-4 text-xs text-gray-600">
          {dashboard.self_love_note ? (
            <div>
              <h4 className="font-semibold text-gray-700">{labels.selfLoveNote}</h4>
              <p className="mt-1">{dashboard.self_love_note}</p>
            </div>
          ) : null}
          {dashboard.trust_note ? (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700">{labels.trustNote}</h4>
              <p className="mt-1">{dashboard.trust_note}</p>
            </div>
          ) : null}
        </section>
      )}

      {canSendRose && digitalRoseEnabled ? (
        <section className="rounded-lg border border-rose-200 bg-rose-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.sendDigitalRose}</h3>
          <p className="mt-1 text-xs text-gray-600">{labels.sendDigitalRoseHint}</p>
          <div className="mt-3 space-y-3">
            <label className="flex flex-col gap-1 text-sm">
              <span>{labels.recipientLabel}</span>
              <input
                type="text"
                value={recipientLabel}
                onChange={(e) => setRecipientLabel(e.target.value)}
                maxLength={120}
                className="rounded border border-gray-200 px-2 py-1 text-sm"
                placeholder={labels.recipientPlaceholder}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>{labels.messageSummary}</span>
              <textarea
                value={messageSummary}
                onChange={(e) => setMessageSummary(e.target.value)}
                maxLength={500}
                rows={3}
                className="rounded border border-gray-200 px-2 py-1 text-sm"
                placeholder={labels.messagePlaceholder}
              />
            </label>
            <button
              type="button"
              disabled={sendingRose || !recipientLabel.trim() || !messageSummary.trim()}
              onClick={() => void sendRose()}
              className="rounded border border-rose-300 px-3 py-1 text-xs text-rose-800 disabled:opacity-50"
            >
              {sendingRose ? labels.sendingRose : labels.sendRose}
            </button>
          </div>
        </section>
      ) : null}

      {canManage ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.gratitudeSettings}</h3>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={digitalRoseEnabled}
                onChange={(e) => setDigitalRoseEnabled(e.target.checked)}
              />
              {labels.digitalRoseToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={gratitudeMomentsEnabled}
                onChange={(e) => setGratitudeMomentsEnabled(e.target.checked)}
              />
              {labels.gratitudeMomentsToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={redirectRomantic}
                onChange={(e) => setRedirectRomantic(e.target.checked)}
              />
              {labels.redirectRomanticToggle}
            </label>
            <button
              type="button"
              disabled={savingSettings}
              onClick={() => void saveSettings()}
              className="rounded border border-rose-300 px-3 py-1 text-xs text-rose-800 disabled:opacity-50"
            >
              {savingSettings ? labels.saving : labels.saveSettings}
            </button>
          </div>
        </section>
      ) : null}

      {Object.keys(integrationLinks).length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs">
            {Object.entries(integrationLinks).map(([key, href]) => {
              const path = String(href);
              const isExternalDoc = path.endsWith(".md");
              return (
                <li key={key}>
                  {isExternalDoc ? (
                    <span className="text-gray-600">{key.replace(/_/g, " ")}: {path}</span>
                  ) : (
                    <Link href={path} className="text-rose-700 underline">
                      {key.replace(/_/g, " ")}
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
