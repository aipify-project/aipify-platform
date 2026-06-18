"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseAssistantIdentityBundle, type AssistantIdentityBundle } from "@/lib/aipify/assistant-identity";

type AssistantIdentitySettingsPanelProps = {
  labels: Record<string, string>;
  styleOptions: Record<string, string>;
  uncertaintyOptions: Record<string, string>;
};

export function AssistantIdentitySettingsPanel({
  labels,
  styleOptions,
  uncertaintyOptions,
}: AssistantIdentitySettingsPanelProps) {
  const [bundle, setBundle] = useState<AssistantIdentityBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/assistant-identity/profile");
    if (res.ok) setBundle(parseAssistantIdentityBundle(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveProfile(patch: Record<string, unknown>) {
    setSaving(true);
    await fetch("/api/aipify/assistant-identity/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await load();
    setSaving(false);
  }

  async function savePrefs(patch: Record<string, unknown>) {
    setSaving(true);
    await fetch("/api/aipify/assistant-identity/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await load();
    setSaving(false);
  }

  async function resetWelcome() {
    if (!confirm(labels.resetConfirm)) return;
    await fetch("/api/aipify/assistant-identity/reset", { method: "POST" });
    await load();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!bundle?.has_customer) return null;

  const profile = bundle.profile ?? {};
  const prefs = bundle.preferences ?? {};

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/settings" className="text-sm text-teal-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      <section className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <label className="block text-sm">
          <span className="font-medium">{labels.ownerName}</span>
          <input
            type="text"
            defaultValue={profile.assistant_owner_name ?? ""}
            onBlur={(e) => void saveProfile({ assistant_owner_name: e.target.value })}
            className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">{labels.greetingName}</span>
          <input
            type="text"
            defaultValue={profile.preferred_address_name ?? ""}
            onBlur={(e) => void saveProfile({ preferred_address_name: e.target.value })}
            className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">{labels.communicationStyle}</span>
          <select
            defaultValue={profile.preferred_communication_style ?? "professional_warm"}
            onChange={(e) => void saveProfile({ preferred_communication_style: e.target.value })}
            className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
          >
            {Object.entries(styleOptions).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">{labels.uncertainty}</span>
          <select
            defaultValue={profile.uncertainty_handling_preference ?? "ask_first"}
            onChange={(e) => void saveProfile({ uncertainty_handling_preference: e.target.value })}
            className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
          >
            {Object.entries(uncertaintyOptions).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            defaultChecked={prefs.use_name_in_greetings ?? true}
            onChange={(e) => void savePrefs({ use_name_in_greetings: e.target.checked })}
          />
          {labels.useNameInGreetings}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            defaultChecked={prefs.allow_personalized_phrases ?? true}
            onChange={(e) => void savePrefs({ allow_personalized_phrases: e.target.checked })}
          />
          {labels.allowPersonalized}
        </label>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/app/welcome" className="rounded-lg border border-gray-200 px-4 py-2 text-sm">{labels.redoWelcome}</Link>
        <button type="button" onClick={() => void resetWelcome()} className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700">{labels.resetWelcome}</button>
      </div>
      <p className="text-xs text-gray-500">{labels.privacy}</p>
    </div>
  );
}
