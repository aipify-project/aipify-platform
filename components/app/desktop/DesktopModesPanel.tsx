"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseDesktopModes, parseDesktopPreferences, type DesktopMode } from "@/lib/aipify/desktop";

type DesktopModesPanelProps = {
  labels: Record<string, string>;
};

const FOCUS_CATEGORIES = [
  "governance",
  "quality",
  "knowledge",
  "support",
  "integrations",
  "security",
  "unonight",
  "briefing",
] as const;

export function DesktopModesPanel({ labels }: DesktopModesPanelProps) {
  const [modes, setModes] = useState<DesktopMode[]>([]);
  const [modeKey, setModeKey] = useState("balanced");
  const [focusCategories, setFocusCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [modesRes, prefsRes] = await Promise.all([
      fetch("/api/aipify/desktop/modes"),
      fetch("/api/aipify/desktop/preferences"),
    ]);
    if (modesRes.ok) setModes(parseDesktopModes(await modesRes.json()));
    if (prefsRes.ok) {
      const prefs = parseDesktopPreferences(await prefsRes.json());
      setModeKey(prefs.mode_key);
      setFocusCategories(prefs.focus_categories);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function selectMode(key: string) {
    setSaving(true);
    const res = await fetch("/api/aipify/desktop/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode_key: key }),
    });
    if (res.ok) {
      const prefs = parseDesktopPreferences(await res.json());
      setModeKey(prefs.mode_key);
    }
    setSaving(false);
  }

  async function toggleCategory(cat: string) {
    const next = focusCategories.includes(cat)
      ? focusCategories.filter((c) => c !== cat)
      : [...focusCategories, cat];
    setFocusCategories(next);
    setSaving(true);
    await fetch("/api/aipify/desktop/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ focus_categories: next, mode_key: "focus" }),
    });
    setModeKey("focus");
    setSaving(false);
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/desktop" className="text-sm text-indigo-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      <div className="space-y-3">
        {modes.map((m) => (
          <button
            key={m.mode_key}
            type="button"
            disabled={saving}
            onClick={() => void selectMode(m.mode_key)}
            className={`w-full rounded-lg border p-4 text-left text-sm transition ${
              modeKey === m.mode_key
                ? "border-indigo-400 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="font-semibold">{m.name}</span>
            <p className="mt-1 text-gray-600">{m.description}</p>
            <p className="mt-2 text-xs text-gray-500">
              {labels.minSeverity}: {m.min_severity}
              {m.include_mini_chat ? ` · ${labels.miniChat}` : ""}
              {m.include_daily_brief ? ` · ${labels.dailyBrief}` : ""}
            </p>
          </button>
        ))}
      </div>

      {modeKey === "focus" ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold">{labels.focusCategories}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {FOCUS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                disabled={saving}
                onClick={() => void toggleCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs capitalize ${
                  focusCategories.includes(cat)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
