"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseDesktopPreferences, type DesktopPreferences } from "@/lib/aipify/desktop";

type DesktopSettingsPanelProps = {
  labels: Record<string, string>;
};

export function DesktopSettingsPanel({ labels }: DesktopSettingsPanelProps) {
  const [prefs, setPrefs] = useState<DesktopPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/desktop/preferences");
    if (res.ok) setPrefs(parseDesktopPreferences(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function save(patch: Partial<DesktopPreferences>) {
    setSaving(true);
    const res = await fetch("/api/aipify/desktop/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) setPrefs(parseDesktopPreferences(await res.json()));
    setSaving(false);
  }

  if (loading || !prefs) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  const toggles: Array<[keyof DesktopPreferences, string]> = [
    ["enabled", labels.enabled],
    ["include_briefing", labels.includeBriefing],
    ["include_governance", labels.includeGovernance],
    ["include_quality", labels.includeQuality],
    ["include_support", labels.includeSupport],
    ["include_knowledge", labels.includeKnowledge],
    ["include_integrations", labels.includeIntegrations],
    ["include_security", labels.includeSecurity],
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/desktop" className="text-sm text-indigo-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      {toggles.map(([key, label]) => (
        <label key={key} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <span>{label}</span>
          <input
            type="checkbox"
            checked={Boolean(prefs[key])}
            onChange={(e) => void save({ [key]: e.target.checked })}
            disabled={saving}
          />
        </label>
      ))}

      <label className="block rounded-lg border border-gray-200 bg-white p-4 text-sm">
        <span className="text-gray-600">{labels.maxPerDay}</span>
        <input
          type="number"
          min={5}
          max={50}
          className="mt-2 w-full rounded border border-gray-200 px-2 py-1"
          value={prefs.max_notifications_per_day}
          onChange={(e) => void save({ max_notifications_per_day: Number(e.target.value) })}
          disabled={saving}
        />
      </label>

      <p className="text-xs text-gray-500">{labels.privacy}</p>
    </div>
  );
}
