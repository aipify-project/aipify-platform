"use client";

import { useCallback, useEffect, useState } from "react";
import { parsePersonalityDashboard, type PersonalityDashboard } from "@/lib/aipify/personality";

type PersonalityDashboardPanelProps = {
  labels: Record<string, string>;
};

export function PersonalityDashboardPanel({ labels }: PersonalityDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<PersonalityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/personality/dashboard");
    if (res.ok) setDashboard(parsePersonalityDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateSettings = async (patch: Record<string, unknown>) => {
    setSaving(true);
    await fetch("/api/aipify/personality/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSaving(false);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
        <h2 className="text-sm font-semibold text-amber-900">{labels.currentMode}</h2>
        <p className="mt-2 text-lg font-medium capitalize text-gray-900">
          {dashboard.personality_mode?.replace(/_/g, " ")}
        </p>
        <p className="mt-2 text-xs text-amber-800">{dashboard.golden_rule}</p>
        {dashboard.crisis_mode_active ? (
          <p className="mt-3 rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-xs text-orange-900">
            {labels.crisisSuppression}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {dashboard.personality_modes?.map((mode) => (
            <button
              key={mode.mode}
              type="button"
              disabled={saving}
              onClick={() => void updateSettings({ personality_mode: mode.mode })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium disabled:opacity-50 ${
                dashboard.personality_mode === mode.mode
                  ? "border-amber-500 bg-amber-100 text-amber-900"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {mode.label}
              {mode.recommended ? " ★" : ""}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dashboard.humor_enabled ?? true}
              disabled={saving}
              onChange={(e) => void updateSettings({ humor_enabled: e.target.checked })}
            />
            {labels.humorEnabled}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dashboard.emoji_enabled ?? true}
              disabled={saving}
              onChange={(e) => void updateSettings({ emoji_enabled: e.target.checked })}
            />
            {labels.emojiEnabled}
          </label>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.humorAppropriate}</h3>
          <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
            {dashboard.humor_appropriate?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-red-100 bg-red-50/50 p-4">
          <h3 className="text-sm font-semibold text-red-900">{labels.humorNever}</h3>
          <ul className="mt-2 list-inside list-disc text-xs text-red-800">
            {dashboard.humor_never?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.examplesSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.example_messages?.map((ex, i) => (
            <li key={i} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800">
              {ex.message}
              {!ex.humor_allowed ? (
                <p className="mt-1 text-xs text-gray-500">{labels.humorSuppressed}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
