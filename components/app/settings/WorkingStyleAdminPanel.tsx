"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AWSE_REMINDER_FREQUENCIES,
  DETAIL_LEVELS,
  SUMMARY_TIMES,
  WORKING_PROFILES,
  parseAwseCenter,
  type AwseCenterBundle,
  type AwseNotificationCategories,
  type AwseUserPreferences,
} from "@/lib/adaptive-working-style-engine";

type WorkingStyleAdminPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    saved: string;
    reset: string;
    resetConfirm: string;
    youControl: string;
    transparency: string;
    adaptationSuggestion: string;
    starterNote: string;
    sections: {
      profile: string;
      detail: string;
      reminders: string;
      focus: string;
      learning: string;
      categories: string;
      summary: string;
      enterprise: string;
    };
    fields: {
      workingProfile: string;
      detailLevel: string;
      reminderFrequency: string;
      summaryTime: string;
      focusMode: string;
      adaptiveLearning: string;
    };
    profiles: Record<string, string>;
    detailLevels: Record<string, string>;
    reminderLevels: Record<string, string>;
    summaryTimes: Record<string, string>;
    categories: Record<string, string>;
    enterpriseEmpty: string;
  };
};

const CATEGORY_KEYS = ["email", "task", "meeting", "support", "sales", "relationship"] as const;

export function WorkingStyleAdminPanel({ labels }: WorkingStyleAdminPanelProps) {
  const [center, setCenter] = useState<AwseCenterBundle | null>(null);
  const [prefs, setPrefs] = useState<AwseUserPreferences | null>(null);
  const [categories, setCategories] = useState<AwseNotificationCategories>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/working-style");
    if (res.ok) {
      const data = parseAwseCenter(await res.json());
      setCenter(data);
      if (data.preferences) {
        setPrefs(data.preferences);
        setCategories(data.preferences.preferred_notification_categories);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function save() {
    if (!prefs) return;
    await fetch("/api/working-style", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        working_profile: prefs.working_profile,
        detail_level: prefs.detail_level,
        reminder_frequency: prefs.reminder_frequency,
        preferred_summary_time: prefs.preferred_summary_time,
        preferred_notification_categories: categories,
        focus_mode_enabled: prefs.focus_mode_enabled,
        adaptive_learning_enabled: prefs.adaptive_learning_enabled,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    void refresh();
  }

  async function reset() {
    if (!window.confirm(labels.resetConfirm)) return;
    await fetch("/api/working-style", { method: "DELETE" });
    void refresh();
  }

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center?.has_customer || !prefs) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  const caps = center.capabilities;
  const adaptiveAllowed = caps?.adaptive_learning_allowed ?? false;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
            {labels.back}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void reset()}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {labels.reset}
          </button>
          <button
            type="button"
            onClick={() => void save()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {saved ? labels.saved : labels.save}
          </button>
        </div>
      </div>

      <p className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
        {labels.youControl}
      </p>

      {center.transparency_note ? (
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">{labels.transparency}: </span>
          {center.transparency_note}
        </p>
      ) : null}

      {center.adaptation_suggestion ? (
        <p className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
          <span className="font-medium">{labels.adaptationSuggestion}: </span>
          {center.adaptation_suggestion}
        </p>
      ) : null}

      {caps?.manual_preferences_only ? (
        <p className="text-sm text-gray-500">{labels.starterNote}</p>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.profile}</h2>
        <label className="block text-sm text-gray-700">
          {labels.fields.workingProfile}
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={prefs.working_profile}
            onChange={(e) =>
              setPrefs({ ...prefs, working_profile: e.target.value as AwseUserPreferences["working_profile"] })
            }
          >
            {WORKING_PROFILES.map((p) => (
              <option key={p} value={p}>
                {labels.profiles[p] ?? p}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.detail}</h2>
        <label className="block text-sm text-gray-700">
          {labels.fields.detailLevel}
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={prefs.detail_level}
            onChange={(e) =>
              setPrefs({ ...prefs, detail_level: e.target.value as AwseUserPreferences["detail_level"] })
            }
          >
            {DETAIL_LEVELS.map((d) => (
              <option key={d} value={d}>
                {labels.detailLevels[d] ?? d}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.reminders}</h2>
        <label className="block text-sm text-gray-700">
          {labels.fields.reminderFrequency}
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={prefs.reminder_frequency}
            onChange={(e) =>
              setPrefs({
                ...prefs,
                reminder_frequency: e.target.value as AwseUserPreferences["reminder_frequency"],
              })
            }
          >
            {AWSE_REMINDER_FREQUENCIES.map((r) => (
              <option key={r} value={r}>
                {labels.reminderLevels[r] ?? r}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.summary}</h2>
        <label className="block text-sm text-gray-700">
          {labels.fields.summaryTime}
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={prefs.preferred_summary_time}
            onChange={(e) =>
              setPrefs({
                ...prefs,
                preferred_summary_time: e.target.value as AwseUserPreferences["preferred_summary_time"],
              })
            }
          >
            {SUMMARY_TIMES.map((t) => (
              <option key={t} value={t}>
                {labels.summaryTimes[t] ?? t}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.categories}</h2>
        {CATEGORY_KEYS.map((key) => (
          <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={categories[key] !== false}
              onChange={(e) => setCategories({ ...categories, [key]: e.target.checked })}
            />
            {labels.categories[key] ?? key}
          </label>
        ))}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.focus}</h2>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={prefs.focus_mode_enabled}
            onChange={(e) => setPrefs({ ...prefs, focus_mode_enabled: e.target.checked })}
          />
          {labels.fields.focusMode}
        </label>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.learning}</h2>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={prefs.adaptive_learning_enabled}
            disabled={!adaptiveAllowed}
            onChange={(e) =>
              setPrefs({ ...prefs, adaptive_learning_enabled: e.target.checked })
            }
          />
          {labels.fields.adaptiveLearning}
        </label>
      </section>

      {caps?.enterprise_templates ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-2">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.enterprise}</h2>
          {center.department_templates && center.department_templates.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {center.department_templates.map((t) => (
                <li key={t.id} className="rounded-lg border border-gray-100 px-3 py-2">
                  <span className="font-medium">{t.department_name}</span>
                  {" — "}
                  {labels.profiles[t.working_profile] ?? t.working_profile}
                  {t.is_default ? " (default)" : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">{labels.enterpriseEmpty}</p>
          )}
        </section>
      ) : null}
    </div>
  );
}
