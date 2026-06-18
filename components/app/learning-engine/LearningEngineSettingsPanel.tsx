"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseLearningEngineSettings, type LearningEngineSettings } from "@/lib/aipify/learning-engine";

type LearningEngineSettingsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    reset: string;
    resetConfirm: string;
    settings: Record<string, string>;
  };
};

export function LearningEngineSettingsPanel({ labels }: LearningEngineSettingsPanelProps) {
  const [settings, setSettings] = useState<LearningEngineSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/learning-engine/settings");
    if (res.ok) setSettings(parseLearningEngineSettings(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/aipify/learning-engine/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) setSettings(parseLearningEngineSettings(await res.json()));
    setSaving(false);
  }

  async function resetLearning() {
    if (!confirm(labels.resetConfirm)) return;
    await fetch("/api/aipify/learning-engine/reset", { method: "POST" });
    await load();
  }

  function toggle(key: keyof LearningEngineSettings) {
    if (!settings || typeof settings[key] !== "boolean") return;
    setSettings({ ...settings, [key]: !settings[key] });
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!settings) return null;

  const toggles: Array<keyof LearningEngineSettings> = [
    "enabled", "allow_support_learning", "allow_quality_learning", "allow_automation_learning",
    "allow_notification_learning", "allow_briefing_learning", "allow_action_learning",
    "require_admin_review_rules",
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/learning" className="text-sm text-teal-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      <ul className="space-y-3">
        {toggles.map((key) => (
          <li key={key} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
            <span>{labels.settings[key] ?? key}</span>
            <input type="checkbox" checked={Boolean(settings[key])} onChange={() => toggle(key)} />
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={saving} onClick={() => void save()} className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50">{labels.save}</button>
        <button type="button" onClick={() => void resetLearning()} className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700">{labels.reset}</button>
      </div>
    </div>
  );
}
