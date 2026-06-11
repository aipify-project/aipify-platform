"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseMemorySettings, type MemorySettings } from "@/lib/aipify/memory";

type MemorySettingsPanelProps = {
  labels: Record<string, string>;
};

export function MemorySettingsPanel({ labels }: MemorySettingsPanelProps) {
  const [settings, setSettings] = useState<MemorySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/memory-engine/settings");
    if (res.ok) setSettings(parseMemorySettings(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function save(patch: Partial<MemorySettings>) {
    setSaving(true);
    const res = await fetch("/api/aipify/memory-engine/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) setSettings(parseMemorySettings(await res.json()));
    setSaving(false);
  }

  if (loading || !settings) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  const toggles: Array<[keyof MemorySettings, string]> = [
    ["enabled", labels.enabled],
    ["auto_learn", labels.autoLearn],
    ["include_user_preferences", labels.includeUserPrefs],
    ["include_team_patterns", labels.includeTeamPatterns],
    ["include_tenant_rules", labels.includeTenantRules],
    ["explainability_required", labels.explainability],
    ["governance_review_required", labels.governanceReview],
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/memory" className="text-sm text-amber-800">{labels.back}</Link>
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
        <span className="text-gray-600">{labels.retentionDays}</span>
        <input
          type="number"
          min={30}
          max={730}
          className="mt-2 w-full rounded border border-gray-200 px-2 py-1"
          value={settings.retention_days}
          onChange={(e) => void save({ retention_days: Number(e.target.value) })}
          disabled={saving}
        />
      </label>

      <section className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm">
        <h2 className="font-semibold text-red-900">{labels.neverStoreTitle}</h2>
        <ul className="mt-2 list-disc pl-5 text-red-800">
          {labels.neverStoreItems.split("|").map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-gray-500">{labels.privacy}</p>
    </div>
  );
}
