"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseBriefingSettings, type BriefingSettings } from "@/lib/aipify/briefing";

type BriefingSettingsPanelProps = {
  labels: Record<string, string>;
};

export function BriefingSettingsPanel({ labels }: BriefingSettingsPanelProps) {
  const [settings, setSettings] = useState<BriefingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/briefing/settings");
    if (res.ok) setSettings(parseBriefingSettings(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function save(patch: Partial<BriefingSettings>) {
    setSaving(true);
    const res = await fetch("/api/aipify/briefing/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) setSettings(parseBriefingSettings(await res.json()));
    setSaving(false);
  }

  if (loading || !settings) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  const toggles: Array<[keyof BriefingSettings, string]> = [
    ["enabled", labels.enabled],
    ["since_last_login_enabled", labels.sinceLastLogin],
    ["daily_brief_enabled", labels.dailyBrief],
    ["include_quality", labels.includeQuality],
    ["include_knowledge", labels.includeKnowledge],
    ["include_governance", labels.includeGovernance],
    ["include_support", labels.includeSupport],
    ["include_automation", labels.includeAutomation],
    ["include_insights", labels.includeInsights],
    ["include_integrations", labels.includeIntegrations],
    ["include_memory", labels.includeMemory],
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/briefing" className="text-sm text-indigo-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      {toggles.map(([key, label]) => (
        <label key={key} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <span>{label}</span>
          <input
            type="checkbox"
            checked={Boolean(settings[key])}
            onChange={(e) => void save({ [key]: e.target.checked })}
            disabled={saving}
          />
        </label>
      ))}

      <label className="block rounded-lg border border-gray-200 bg-white p-4 text-sm">
        <span className="text-gray-600">{labels.maxItems}</span>
        <input
          type="number"
          min={3}
          max={12}
          className="mt-2 w-full rounded border border-gray-200 px-2 py-1"
          value={settings.max_default_items}
          onChange={(e) => void save({ max_default_items: Number(e.target.value) })}
          disabled={saving}
        />
      </label>

      <label className="block rounded-lg border border-gray-200 bg-white p-4 text-sm">
        <span className="text-gray-600">{labels.dailyTime}</span>
        <input
          type="text"
          className="mt-2 w-full rounded border border-gray-200 px-2 py-1"
          value={settings.default_daily_time}
          onChange={(e) => void save({ default_daily_time: e.target.value })}
          disabled={saving}
        />
      </label>
    </div>
  );
}
