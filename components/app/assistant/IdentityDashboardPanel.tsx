"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  COMMUNICATION_STYLES,
  IDENTITY_MODES,
  IDENTITY_TONES,
  NAME_USAGE_OPTIONS,
  NOTIFICATION_STYLES,
  PROACTIVITY_LEVELS,
  RESPONSE_LENGTHS,
  SOCIAL_STYLES,
  parseIdentityCenter,
  type IdentityCenterBundle,
  type IdentityProfile,
} from "@/lib/identity-engine";

type IdentityDashboardPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    saved: string;
    privacy: string;
    explainability: string;
    sections: {
      onboarding: string;
      profile: string;
      observations: string;
      history: string;
      boundaries: string;
      notifications: string;
      settings: string;
    };
    onboarding: {
      start: string;
      complete: string;
      useName: string;
      dailySummaries: string;
      reminders: string;
    };
    observations: {
      yes: string;
      no: string;
      later: string;
    };
    modes: Record<string, string>;
    communicationStyles: Record<string, string>;
    proactivityLevels: Record<string, string>;
    tones: Record<string, string>;
    nameUsage: Record<string, string>;
    socialStyles: Record<string, string>;
    responseLengths: Record<string, string>;
    notificationStyles: Record<string, string>;
    viewMemories: string;
    viewLife: string;
  };
};

export function IdentityDashboardPanel({ labels }: IdentityDashboardPanelProps) {
  const [center, setCenter] = useState<IdentityCenterBundle | null>(null);
  const [profile, setProfile] = useState<IdentityProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/assistant/identity");
    if (res.ok) {
      const data = parseIdentityCenter(await res.json());
      setCenter(data);
      if (data.profile) setProfile(data.profile);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveProfile(patch: Partial<IdentityProfile> & { onboarding_completed?: boolean }) {
    await fetch("/api/assistant/identity", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    await refresh();
  }

  async function respondObservation(id: string, response: "yes" | "no" | "later") {
    await fetch("/api/assistant/identity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "respond_observation", observation_id: id, response }),
    });
    await refresh();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const showOnboarding = profile && !profile.onboarding_completed;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link href="/app/assistant" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center?.privacy_note && (
          <p className="mt-2 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-900">
            {center.privacy_note}
          </p>
        )}
        {center?.explainability && (
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium">{labels.explainability}: </span>
            {center.explainability}
          </p>
        )}
      </div>

      {showOnboarding && profile && (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.onboarding}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.onboarding.start}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {IDENTITY_MODES.filter((m) => m !== "custom").map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() =>
                  void saveProfile({ identity_mode: mode, onboarding_completed: true })
                }
                className="rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm text-indigo-800 hover:bg-indigo-100"
              >
                {labels.modes[mode]}
              </button>
            ))}
          </div>
        </section>
      )}

      {center?.pending_observations && center.pending_observations.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.observations}</h2>
          <ul className="mt-3 space-y-4">
            {center.pending_observations.map((obs) => (
              <li key={obs.id} className="rounded-xl border border-amber-100 bg-white p-4 text-sm">
                <p className="text-gray-800">{obs.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void respondObservation(obs.id, "yes")}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white"
                  >
                    {labels.observations.yes}
                  </button>
                  <button
                    type="button"
                    onClick={() => void respondObservation(obs.id, "no")}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs"
                  >
                    {labels.observations.no}
                  </button>
                  <button
                    type="button"
                    onClick={() => void respondObservation(obs.id, "later")}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs"
                  >
                    {labels.observations.later}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.settings}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <SelectField
              label={labels.sections.profile}
              value={profile.identity_mode}
              options={IDENTITY_MODES.map((m) => ({ value: m, label: labels.modes[m] }))}
              onChange={(v) => setProfile((p) => (p ? { ...p, identity_mode: v as IdentityProfile["identity_mode"] } : p))}
            />
            <SelectField
              label="Communication"
              value={profile.communication_style}
              options={COMMUNICATION_STYLES.map((s) => ({
                value: s,
                label: labels.communicationStyles[s],
              }))}
              onChange={(v) =>
                setProfile((p) =>
                  p ? { ...p, communication_style: v as IdentityProfile["communication_style"] } : p
                )
              }
            />
            <SelectField
              label="Proactivity"
              value={profile.proactivity_level}
              options={PROACTIVITY_LEVELS.map((l) => ({
                value: l,
                label: labels.proactivityLevels[l],
              }))}
              onChange={(v) =>
                setProfile((p) =>
                  p ? { ...p, proactivity_level: v as IdentityProfile["proactivity_level"] } : p
                )
              }
            />
            <SelectField
              label="Tone"
              value={profile.tone}
              options={IDENTITY_TONES.map((t) => ({ value: t, label: labels.tones[t] }))}
              onChange={(v) =>
                setProfile((p) => (p ? { ...p, tone: v as IdentityProfile["tone"] } : p))
              }
            />
            <SelectField
              label="Name usage"
              value={profile.name_usage}
              options={NAME_USAGE_OPTIONS.map((n) => ({ value: n, label: labels.nameUsage[n] }))}
              onChange={(v) =>
                setProfile((p) => (p ? { ...p, name_usage: v as IdentityProfile["name_usage"] } : p))
              }
            />
            <SelectField
              label="Response length"
              value={profile.response_length}
              options={RESPONSE_LENGTHS.map((r) => ({
                value: r,
                label: labels.responseLengths[r],
              }))}
              onChange={(v) =>
                setProfile((p) =>
                  p ? { ...p, response_length: v as IdentityProfile["response_length"] } : p
                )
              }
            />
            <SelectField
              label="Social style"
              value={profile.social_interaction_style}
              options={SOCIAL_STYLES.map((s) => ({ value: s, label: labels.socialStyles[s] }))}
              onChange={(v) =>
                setProfile((p) =>
                  p
                    ? { ...p, social_interaction_style: v as IdentityProfile["social_interaction_style"] }
                    : p
                )
              }
            />
            <SelectField
              label={labels.sections.notifications}
              value={profile.notification_style}
              options={NOTIFICATION_STYLES.map((n) => ({
                value: n,
                label: labels.notificationStyles[n],
              }))}
              onChange={(v) =>
                setProfile((p) =>
                  p ? { ...p, notification_style: v as IdentityProfile["notification_style"] } : p
                )
              }
            />
          </div>

          <div className="mt-4 space-y-2">
            {(
              [
                ["push", "Push"],
                ["email", "Email"],
                ["calendar", "Calendar"],
                ["in_app", "In-app"],
                ["daily_summaries", labels.onboarding.dailySummaries],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={profile.notification_preferences[key]}
                  onChange={(e) =>
                    setProfile((p) =>
                      p
                        ? {
                            ...p,
                            notification_preferences: {
                              ...p.notification_preferences,
                              [key]: e.target.checked,
                            },
                          }
                        : p
                    )
                  }
                />
                {label}
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={() => profile && void saveProfile(profile)}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            {saved ? labels.saved : labels.save}
          </button>
        </section>
      )}

      {center?.boundary_principles && (
        <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.boundaries}</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {center.boundary_principles.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      )}

      {center?.interaction_history && center.interaction_history.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.history}</h2>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            {center.interaction_history.map((h) => (
              <li key={h.id}>
                {h.description}
                <span className="ml-2 text-xs text-gray-400">({h.status})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-4">
        <Link href="/app/assistant/life" className="text-sm text-indigo-600 hover:underline">
          {labels.viewLife}
        </Link>
        <Link href="/app/assistant/memory" className="text-sm text-indigo-600 hover:underline">
          {labels.viewMemories}
        </Link>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm text-gray-700">
      {label}
      <select
        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
