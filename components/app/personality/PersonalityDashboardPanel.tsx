"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parsePersonalityDashboard, type PersonalityDashboard } from "@/lib/aipify/personality";

type PersonalityDashboardPanelProps = {
  labels: Record<string, string>;
};

export function PersonalityDashboardPanel({ labels }: PersonalityDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<PersonalityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/personality/dashboard");
    if (res.ok) setDashboard(parsePersonalityDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateSettings = async (patch: Record<string, unknown>) => {
    setSaving(true);
    await fetch("/api/aipify/personality/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSaving(false);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      {(dashboard.mission || dashboard.abos_principle || dashboard.vision) && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          {dashboard.mission ? (
            <p className="text-sm font-medium text-gray-900">{dashboard.mission}</p>
          ) : null}
          {dashboard.abos_principle ? (
            <p className="mt-2 text-sm text-amber-800">{dashboard.abos_principle}</p>
          ) : null}
          {dashboard.vision ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.vision}</p>
          ) : null}
          {dashboard.distinction_note ? (
            <p className="mt-3 rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2 text-xs text-amber-900">
              {dashboard.distinction_note}
            </p>
          ) : null}
        </section>
      )}

      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
        <h2 className="text-sm font-semibold text-amber-900">{labels.currentMode}</h2>
        <p className="mt-2 text-lg font-medium capitalize text-gray-900">
          {dashboard.personality_mode?.replace(/_/g, " ")}
        </p>
        <p className="mt-2 text-xs text-amber-800">{dashboard.golden_rule}</p>
        {dashboard.crisis_mode_active ? (
          <p className="mt-3 rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-xs text-orange-900">
            {labels.crisisSuppression}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {dashboard.personality_modes?.map((mode) => (
            <button
              key={mode.mode}
              type="button"
              disabled={saving}
              onClick={() => void updateSettings({ personality_mode: mode.mode })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium disabled:opacity-50 ${
                dashboard.personality_mode === mode.mode
                  ? "border-amber-500 bg-amber-100 text-amber-900"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {mode.label}
              {mode.recommended ? " ★" : ""}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dashboard.humor_enabled ?? true}
              disabled={saving}
              onChange={(e) => void updateSettings({ humor_enabled: e.target.checked })}
            />
            {labels.humorEnabled}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dashboard.emoji_enabled ?? true}
              disabled={saving}
              onChange={(e) => void updateSettings({ emoji_enabled: e.target.checked })}
            />
            {labels.emojiEnabled}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dashboard.playful_moments_enabled ?? true}
              disabled={saving}
              onChange={(e) => void updateSettings({ playful_moments_enabled: e.target.checked })}
            />
            {labels.playfulMomentsEnabled}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dashboard.bell_moments_enabled ?? true}
              disabled={saving}
              onChange={(e) => void updateSettings({ bell_moments_enabled: e.target.checked })}
            />
            {labels.bellMomentsEnabled}
          </label>
        </div>
        {dashboard.playful_currently_allowed === false && !dashboard.crisis_mode_active ? (
          <p className="mt-3 text-xs text-gray-600">{labels.playfulSuppressed}</p>
        ) : null}
      </section>

      {dashboard.playful_moments_seed ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/40 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.playfulBellTitle}</h2>
          <p className="mt-2 text-xs text-violet-800">{dashboard.playful_moments_seed.core_idea}</p>
          <p className="mt-3 text-xs font-medium text-violet-900">{labels.bellMoments}</p>
          <ul className="mt-2 space-y-2">
            {dashboard.playful_moments_seed.bell_personality_moments?.map((moment) => (
              <li
                key={moment.context}
                className="rounded-lg border border-violet-100 bg-white px-3 py-2 text-xs text-gray-700"
              >
                <span className="mr-2">{moment.emoji}</span>
                {moment.text}
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold text-gray-900">{labels.whenToUse}</h3>
              <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
                {dashboard.playful_moments_seed.when_to_use?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-red-900">{labels.whenNotToUse}</h3>
              <ul className="mt-2 list-inside list-disc text-xs text-red-800">
                {dashboard.playful_moments_seed.when_not_to_use?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          {dashboard.playful_moments_seed.fox_exchange ? (
            <div className="mt-4 rounded-lg border border-violet-100 bg-white px-4 py-3 text-sm">
              <p className="text-xs font-medium text-gray-500">{labels.foxExchange}</p>
              <p className="mt-1 text-gray-800">
                &ldquo;{dashboard.playful_moments_seed.fox_exchange.user_says}&rdquo;
              </p>
              <p className="mt-2 text-xs font-medium text-violet-700">{labels.aipifyResponds}</p>
              <p className="mt-1 text-gray-700">
                {dashboard.playful_moments_seed.fox_exchange.aipify_responds}
              </p>
              {dashboard.playful_moments_seed.fox_exchange.follow_up ? (
                <p className="mt-2 text-xs text-gray-600">
                  {dashboard.playful_moments_seed.fox_exchange.follow_up}
                </p>
              ) : null}
            </div>
          ) : null}
          {dashboard.playful_moments_seed.memory_principle ? (
            <p className="mt-4 text-xs text-violet-900">{dashboard.playful_moments_seed.memory_principle}</p>
          ) : null}
          {dashboard.playful_moments_seed.final_principle ? (
            <p className="mt-2 text-xs font-medium text-violet-900">
              {dashboard.playful_moments_seed.final_principle}
            </p>
          ) : null}
        </section>
      ) : null}

      {dashboard.humor_principles ? (
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-gray-900">{labels.humorShould}</h3>
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {dashboard.humor_principles.should?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-4">
            <h3 className="text-sm font-semibold text-red-900">{labels.humorShouldNever}</h3>
            <ul className="mt-2 list-inside list-disc text-xs text-red-800">
              {dashboard.humor_principles.should_never?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-gray-900">{labels.humorAppropriate}</h3>
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {dashboard.humor_appropriate?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-4">
            <h3 className="text-sm font-semibold text-red-900">{labels.humorNever}</h3>
            <ul className="mt-2 list-inside list-disc text-xs text-red-800">
              {dashboard.humor_never?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {dashboard.personal_connection_notes && dashboard.personal_connection_notes.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.personalConnection}</h3>
          <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
            {dashboard.personal_connection_notes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.example_exchanges && dashboard.example_exchanges.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.exampleExchanges}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.example_exchanges.map((ex, i) => (
              <li key={i} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                <p className="text-xs font-medium text-gray-500">{labels.userSays}</p>
                <p className="mt-1 text-gray-800">&ldquo;{ex.user_says}&rdquo;</p>
                <p className="mt-2 text-xs font-medium text-amber-700">{labels.aipifyResponds}</p>
                <p className="mt-1 text-gray-700">{ex.aipify_responds}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.examplesSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.example_messages?.map((ex, i) => (
            <li key={i} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800">
              {ex.message}
              {!ex.humor_allowed ? (
                <p className="mt-1 text-xs text-gray-500">{labels.humorSuppressed}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {dashboard.trust_boundaries && dashboard.trust_boundaries.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.trustBoundaries}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.trust_boundaries.map((boundary, i) => (
              <li key={i} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                <p className="text-xs text-red-700">
                  <span className="font-medium">{labels.avoid}:</span> {boundary.avoid}
                </p>
                <p className="mt-1 text-xs text-emerald-800">
                  <span className="font-medium">{labels.prefer}:</span> {boundary.prefer}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_note ? (
        <p className="rounded-lg border border-violet-100 bg-violet-50/50 px-4 py-3 text-xs text-violet-900">
          {dashboard.self_love_note}
        </p>
      ) : null}

      {dashboard.integration_links && dashboard.integration_links.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.relatedEngines}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.integration_links.map((link) => (
              <li key={link.route} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                <Link href={link.route} className="font-medium text-amber-800 hover:underline">
                  {link.label}
                </Link>
                <p className="mt-1 text-xs text-gray-600">{link.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
