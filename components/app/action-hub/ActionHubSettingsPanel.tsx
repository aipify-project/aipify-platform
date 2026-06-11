"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseActionHubSettings, type ActionHubSettings } from "@/lib/aipify/action-hub";

type ActionHubSettingsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    settings: Record<string, string>;
  };
};

export function ActionHubSettingsPanel({ labels }: ActionHubSettingsPanelProps) {
  const [settings, setSettings] = useState<ActionHubSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/action-hub/settings");
    if (res.ok) setSettings(parseActionHubSettings(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/aipify/action-hub/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) setSettings(parseActionHubSettings(await res.json()));
    setSaving(false);
  }

  function toggle(key: keyof ActionHubSettings) {
    if (!settings || typeof settings[key] !== "boolean") return;
    setSettings({ ...settings, [key]: !settings[key] });
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  if (!settings) return null;

  const toggles: Array<keyof ActionHubSettings> = [
    "enabled",
    "auto_collect",
    "auto_assign",
    "require_approval_high_risk",
    "include_support",
    "include_quality",
    "include_governance",
    "include_memory",
    "include_knowledge",
    "include_briefing",
    "include_desktop",
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/actions" className="text-sm text-rose-700">
          {labels.back}
        </Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      <ul className="space-y-3">
        {toggles.map((key) => (
          <li key={key} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
            <span>{labels.settings[key] ?? key}</span>
            <input
              type="checkbox"
              checked={Boolean(settings[key])}
              onChange={() => toggle(key)}
            />
          </li>
        ))}
      </ul>

      <button
        type="button"
        disabled={saving}
        onClick={() => void save()}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {labels.save}
      </button>
    </div>
  );
}
