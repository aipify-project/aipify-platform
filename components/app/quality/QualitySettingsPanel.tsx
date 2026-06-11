"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseQualitySettings, type QualitySettings } from "@/lib/aipify/quality";

type QualitySettingsPanelProps = {
  labels: Record<string, string>;
};

export function QualitySettingsPanel({ labels }: QualitySettingsPanelProps) {
  const [settings, setSettings] = useState<QualitySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/quality/settings");
    if (res.ok) setSettings(parseQualitySettings(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function save(patch: Partial<QualitySettings>) {
    setSaving(true);
    const res = await fetch("/api/aipify/quality/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) setSettings(parseQualitySettings(await res.json()));
    setSaving(false);
  }

  if (loading || !settings) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/quality" className="text-sm text-violet-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-sm">
        <span>{labels.observationMode}</span>
        <input
          type="checkbox"
          checked={settings.observation_mode}
          onChange={(e) => void save({ observation_mode: e.target.checked })}
          disabled={saving}
        />
      </label>

      <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-sm">
        <span>{labels.notifyDevelopers}</span>
        <input
          type="checkbox"
          checked={settings.notify_developers}
          onChange={(e) => void save({ notify_developers: e.target.checked })}
          disabled={saving}
        />
      </label>

      <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-sm">
        <span>{labels.openKnowledgeGaps}</span>
        <input
          type="checkbox"
          checked={settings.open_knowledge_gaps}
          onChange={(e) => void save({ open_knowledge_gaps: e.target.checked })}
          disabled={saving}
        />
      </label>

      <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
        {labels.autoFixDisabled}
      </div>
    </div>
  );
}
