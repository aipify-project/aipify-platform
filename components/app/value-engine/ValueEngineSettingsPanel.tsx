"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseRoiSettings, type RoiSettings } from "@/lib/aipify/value-engine";

type ValueEngineSettingsPanelProps = {
  labels: Record<string, string>;
};

export function ValueEngineSettingsPanel({ labels }: ValueEngineSettingsPanelProps) {
  const [settings, setSettings] = useState<RoiSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/value/settings");
    if (res.ok) setSettings(parseRoiSettings(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(patch: Partial<RoiSettings>) {
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/aipify/value/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...settings, ...patch }),
    });
    if (res.ok) setSettings(parseRoiSettings(await res.json()));
    setSaving(false);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!settings) return null;

  return (
    <div className="space-y-6">
      <Link href="/app/value" className="text-sm text-emerald-600 hover:underline">{labels.back}</Link>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={settings.enabled}
          disabled={saving}
          onChange={(e) => void save({ enabled: e.target.checked })}
        />
        {labels.enableRoi}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        {([
          ["support_hourly_rate", labels.supportRate],
          ["admin_hourly_rate", labels.adminRate],
          ["management_hourly_rate", labels.managementRate],
          ["default_hourly_rate", labels.defaultRate],
        ] as const).map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="text-gray-600">{label}</span>
            <input
              type="number"
              min={0}
              step={1}
              disabled={saving}
              value={settings[key]}
              onChange={(e) => setSettings({ ...settings, [key]: Number(e.target.value) })}
              onBlur={() => void save({ [key]: settings[key] })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
        ))}
      </div>

      <label className="block text-sm">
        <span className="text-gray-600">{labels.currency}</span>
        <input
          type="text"
          disabled={saving}
          value={settings.currency}
          onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
          onBlur={() => void save({ currency: settings.currency })}
          className="mt-1 w-full max-w-xs rounded border border-gray-300 px-3 py-2"
        />
      </label>

      <p className="text-xs text-gray-500">{labels.roiDisclaimer}</p>
    </div>
  );
}
