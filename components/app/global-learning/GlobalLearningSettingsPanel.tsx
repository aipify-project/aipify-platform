"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LEARNING_CATEGORIES, parseGlobalLearningSettings, type GlobalLearningSettings } from "@/lib/aipify/global-learning";

type GlobalLearningSettingsPanelProps = {
  labels: Record<string, string>;
};

const MODES = ["none", "anonymous_insights", "extended"] as const;

export function GlobalLearningSettingsPanel({ labels }: GlobalLearningSettingsPanelProps) {
  const [settings, setSettings] = useState<GlobalLearningSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/global-learning/settings");
    if (res.ok) setSettings(parseGlobalLearningSettings(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(patch: Partial<GlobalLearningSettings>) {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/aipify/global-learning/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      setSettings(parseGlobalLearningSettings(await res.json()));
      setMessage(labels.saved);
    }
    setSaving(false);
  }

  function toggleCategory(cat: string) {
    if (!settings) return;
    const cats = settings.enabled_categories ?? [];
    const next = cats.includes(cat) ? cats.filter((c) => c !== cat) : [...cats, cat];
    void save({ enabled_categories: next } as Partial<GlobalLearningSettings>);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!settings) return null;

  return (
    <div className="space-y-6">
      <Link href="/app/global-learning" className="text-sm text-violet-600 hover:underline">{labels.back}</Link>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">{labels.participationMode}</h2>
        <div className="space-y-2">
          {MODES.map((mode) => (
            <label key={mode} className="flex cursor-pointer items-start gap-2 rounded-lg border border-gray-200 p-3 text-sm">
              <input
                type="radio"
                name="participation_mode"
                checked={settings.participation_mode === mode}
                disabled={saving}
                onChange={() => void save({ participation_mode: mode } as Partial<GlobalLearningSettings>)}
              />
              <span>
                <span className="font-medium capitalize">{mode.replace(/_/g, " ")}</span>
                <span className="mt-0.5 block text-gray-600">{labels[`mode_${mode}`]}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold">{labels.learningCategories}</h2>
        <div className="flex flex-wrap gap-2">
          {LEARNING_CATEGORIES.map((cat) => {
            const selected = settings.enabled_categories?.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                disabled={saving || settings.participation_mode === "none"}
                onClick={() => toggleCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs capitalize ${
                  selected ? "bg-violet-600 text-white" : "border border-gray-300 text-gray-600"
                }`}
              >
                {cat.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>
      </section>

      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
