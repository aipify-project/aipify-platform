"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parsePersonalizationSettings, type PersonalizationSettings } from "@/lib/aipify/workstyle";

type PersonalizationSettingsPanelProps = {
  labels: Record<string, string>;
};

export function PersonalizationSettingsPanel({ labels }: PersonalizationSettingsPanelProps) {
  const [settings, setSettings] = useState<PersonalizationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/workstyle/settings");
    if (res.ok) setSettings(parsePersonalizationSettings(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateProfile = async (patch: Record<string, unknown>) => {
    setSaving(true);
    await fetch("/api/aipify/workstyle/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    await load();
  };

  const acceptSuggestion = async (id: string) => {
    await fetch(`/api/aipify/workstyle/suggestions/${id}/accept`, { method: "POST" });
    await load();
  };

  const dismissSuggestion = async (id: string) => {
    await fetch(`/api/aipify/workstyle/suggestions/${id}/dismiss`, { method: "POST" });
    await load();
  };

  const disablePersonalization = async () => {
    await fetch("/api/aipify/workstyle/profile", { method: "DELETE" });
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!settings?.has_customer || !settings.profile) return null;

  const profile = settings.profile;

  const selectField = (
    key: keyof typeof profile,
    options: string[] | undefined,
    label: string
  ) => (
    <label className="block text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <select
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        value={String(profile[key])}
        disabled={saving || !profile.personalization_enabled}
        onChange={(e) => void updateProfile({ [key]: e.target.value })}
      >
        {(options ?? []).map((opt) => (
          <option key={opt} value={opt}>
            {opt.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="space-y-6">
      <Link href="/app/settings" className="text-sm font-medium text-indigo-600 hover:underline">
        {labels.back}
      </Link>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.youControl}</h2>
        <p className="mt-2 text-xs text-indigo-800">{labels.privacyNote}</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={profile.personalization_enabled}
              disabled={saving}
              onChange={(e) =>
                e.target.checked
                  ? void updateProfile({ personalization_enabled: true })
                  : void disablePersonalization()
              }
            />
            {labels.personalizationEnabled}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={profile.humor_enabled}
              disabled={saving || !profile.personalization_enabled}
              onChange={(e) => void updateProfile({ humor_enabled: e.target.checked })}
            />
            {labels.humorEnabled}
          </label>
        </div>
        {saved ? <p className="mt-2 text-xs text-emerald-700">{labels.saved}</p> : null}
      </section>

      {settings.suggestions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.suggestionsSection}</h2>
          <p className="mt-1 text-xs text-gray-500">{labels.suggestionsNote}</p>
          <ul className="mt-3 space-y-2">
            {settings.suggestions.map((s) => (
              <li key={s.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                <p>{s.suggestion}</p>
                <p className="mt-1 text-xs capitalize text-gray-500">
                  {labels.confidence}: {s.confidence_level}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => void acceptSuggestion(s.id)}
                    className="rounded border border-indigo-400 px-2 py-0.5 text-xs font-medium text-indigo-900 hover:bg-indigo-50"
                  >
                    {labels.accept}
                  </button>
                  <button
                    type="button"
                    onClick={() => void dismissSuggestion(s.id)}
                    className="rounded border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {labels.dismiss}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2">
        {selectField("communication_style", settings.dimensions?.communication, labels.communication)}
        {selectField("notification_style", settings.dimensions?.notification, labels.notifications)}
        {selectField("learning_style", settings.dimensions?.learning, labels.learning)}
        {selectField("explanation_style", settings.dimensions?.explanation, labels.explanation)}
        {selectField("collaboration_style", settings.dimensions?.collaboration, labels.collaboration)}
        {selectField("desktop_style", settings.dimensions?.desktop, labels.desktop)}
      </section>

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
