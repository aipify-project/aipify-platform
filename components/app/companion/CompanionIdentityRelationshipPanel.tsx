"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  COMPANION_IDENTITY_CORE_PRINCIPLE,
  COMPANION_IDENTITY_VISION,
  COMPANION_OFFICIAL_NAME,
  INTRODUCTION_FRAMEWORK,
  parseCompanionIdentityRelationshipCenter,
  type CompanionIdentityRelationshipCenter,
} from "@/lib/companion-identity-relationship";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  visionTitle: string;
  identitySettingsTitle: string;
  displayName: string;
  officialNameNote: string;
  relationshipMode: string;
  communicationPrefsTitle: string;
  tonePreference: string;
  proactivityLevel: string;
  humorPreference: string;
  notificationStyle: string;
  encouragementPreference: string;
  briefingStyle: string;
  personalization: string;
  saveSettings: string;
  trustIndicatorsTitle: string;
  milestonesTitle: string;
  reviewsTitle: string;
  personalizationTitle: string;
  introductionTitle: string;
  submitReview: string;
  achieved: string;
  pending: string;
  privacyNote: string;
  trustAdoptionLink: string;
  lifeEventsLink: string;
  legacyIdentityLink: string;
  assistantIdentityLink: string;
  modes: Record<string, string>;
};

type CompanionIdentityRelationshipPanelProps = {
  labels: PanelLabels;
};

export function CompanionIdentityRelationshipPanel({ labels }: CompanionIdentityRelationshipPanelProps) {
  const [center, setCenter] = useState<CompanionIdentityRelationshipCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState(COMPANION_OFFICIAL_NAME);
  const [relationshipMode, setRelationshipMode] = useState("hybrid");
  const [tone, setTone] = useState("conversational");
  const [proactivity, setProactivity] = useState("moderate");
  const [humor, setHumor] = useState("subtle");
  const [reviewResponses, setReviewResponses] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/companion-identity-relationship/center");
    if (res.ok) {
      const parsed = parseCompanionIdentityRelationshipCenter(await res.json());
      setCenter(parsed);
      if (parsed.settings) {
        setDisplayName(parsed.settings.companion_display_name);
        setRelationshipMode(parsed.settings.relationship_mode);
        setTone(parsed.settings.tone_preference);
        setProactivity(parsed.settings.proactivity_level);
        setHumor(parsed.settings.humor_preference);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveSettings = async () => {
    await fetch("/api/companion-identity-relationship/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_preferences",
        companion_display_name: displayName,
        relationship_mode: relationshipMode,
        tone_preference: tone,
        proactivity_level: proactivity,
        humor_preference: humor,
      }),
    });
    await load();
  };

  const submitReview = async (reviewKey: string) => {
    const response = reviewResponses[reviewKey];
    if (!response?.trim()) return;
    await fetch("/api/companion-identity-relationship/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "answer_review",
        review_key: reviewKey,
        user_response: response,
      }),
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.trust_adoption && (
          <Link href={center.links.trust_adoption} className="text-sky-600 hover:underline">
            {labels.trustAdoptionLink}
          </Link>
        )}
        {center?.links?.life_events && (
          <Link href={center.links.life_events} className="text-sky-600 hover:underline">
            {labels.lifeEventsLink}
          </Link>
        )}
        {center?.links?.companion_identity_engine && (
          <Link href={center.links.companion_identity_engine} className="text-sky-600 hover:underline">
            {labels.legacyIdentityLink}
          </Link>
        )}
        {center?.links?.assistant_identity && (
          <Link href={center.links.assistant_identity} className="text-sky-600 hover:underline">
            {labels.assistantIdentityLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          {labels.corePrinciple}: {COMPANION_IDENTITY_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.visionTitle}: {COMPANION_IDENTITY_VISION}
        </p>
        {center?.privacy_note && (
          <p className="mt-2 text-sm text-gray-500">
            {labels.privacyNote}: {center.privacy_note}
          </p>
        )}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.introductionTitle}</h2>
        <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-sky-100 bg-sky-50/50 p-4 text-sm text-gray-800">
          {center?.introduction_framework ?? INTRODUCTION_FRAMEWORK}
        </pre>
      </section>

      {center?.can_manage && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.identitySettingsTitle}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-gray-600">{labels.displayName}</span>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2"
              />
              <span className="text-xs text-gray-500">
                {labels.officialNameNote}: {COMPANION_OFFICIAL_NAME}
              </span>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-gray-600">{labels.relationshipMode}</span>
              <select
                value={relationshipMode}
                onChange={(e) => setRelationshipMode(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2"
              >
                <option value="business">{labels.modes.business}</option>
                <option value="companion">{labels.modes.companion}</option>
                <option value="hybrid">{labels.modes.hybrid}</option>
              </select>
            </label>
          </div>

          <h3 className="mt-6 font-medium text-gray-900">{labels.communicationPrefsTitle}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <label className="flex flex-col gap-1">
              <span>{labels.tonePreference}</span>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="rounded-lg border px-3 py-2">
                <option value="formal">Formal</option>
                <option value="conversational">Conversational</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span>{labels.proactivityLevel}</span>
              <select
                value={proactivity}
                onChange={(e) => setProactivity(e.target.value)}
                className="rounded-lg border px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span>{labels.humorPreference}</span>
              <select value={humor} onChange={(e) => setHumor(e.target.value)} className="rounded-lg border px-3 py-2">
                <option value="none">None</option>
                <option value="subtle">Subtle</option>
                <option value="moderate">Moderate</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={() => void saveSettings()}
            className="mt-4 rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
          >
            {labels.saveSettings}
          </button>
        </section>
      )}

      {center && center.trust_indicators.length > 0 && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <h2 className="font-semibold text-emerald-900">{labels.trustIndicatorsTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            {center.trust_indicators.map((signal) => (
              <div key={signal.signal_key} className="rounded-xl border border-emerald-100 bg-white p-4">
                <p className="text-gray-600">{signal.label}</p>
                <p className="mt-1 text-2xl font-bold text-emerald-900">{signal.score}%</p>
                <p className="text-xs text-gray-500">{signal.trend}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {center && center.milestones.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.milestonesTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center.milestones.map((milestone) => (
              <li key={milestone.milestone_key} className="flex justify-between rounded-lg border px-3 py-2">
                <span>{milestone.title}</span>
                <span className="text-gray-500">
                  {milestone.achieved_at ? labels.achieved : labels.pending}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.personalization_status.length > 0 && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-900">{labels.personalizationTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center.personalization_status.map((pref) => (
              <li key={pref.preference_key} className="rounded-lg border border-violet-100 bg-white px-3 py-2">
                <span className="font-medium">{pref.category.replace(/_/g, " ")}</span>
                {pref.value && (
                  <p className="mt-1 text-xs text-gray-600">{JSON.stringify(pref.value)}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.pending_reviews.length > 0 && (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold text-amber-900">{labels.reviewsTitle}</h2>
          <ul className="mt-4 space-y-4 text-sm">
            {center.pending_reviews.map((review) => (
              <li key={review.review_key} className="rounded-xl border border-amber-100 bg-white p-4">
                <p className="text-gray-800">{review.question}</p>
                {center.can_record && (
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={reviewResponses[review.review_key] ?? ""}
                      onChange={(e) =>
                        setReviewResponses((prev) => ({
                          ...prev,
                          [review.review_key]: e.target.value,
                        }))
                      }
                      placeholder="Your preference…"
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => void submitReview(review.review_key)}
                      className="rounded-lg bg-amber-700 px-4 py-2 text-xs font-medium text-white hover:bg-amber-800"
                    >
                      {labels.submitReview}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
