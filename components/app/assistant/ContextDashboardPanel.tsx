"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CONTEXT_MODES,
  PROACTIVE_ASSISTANCE_LEVELS,
  parseContextCenter,
  type ContextCenterBundle,
  type ContextSettings,
} from "@/lib/context-engine";
import { formatDate } from "@/lib/i18n/format-date";

type ContextDashboardPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    saved: string;
    privacy: string;
    analyze: string;
    viewCalendars: string;
    sections: {
      mode: string;
      calendars: string;
      briefing: string;
      evening: string;
      events: string;
      tasks: string;
      conflicts: string;
      workload: string;
      suggestions: string;
      proactive: string;
      settings: string;
    };
    settings: {
      contextMode: string;
      proactive: string;
      dailyBriefing: string;
      eveningReview: string;
      conflicts: string;
      cognitiveLoad: string;
    };
    contextModes: Record<string, string>;
    proactiveLevels: Record<string, string>;
    workloadLevels: Record<string, string>;
    empty: string;
  };
};

const WORKLOAD_STYLES: Record<string, string> = {
  high: "bg-rose-100 text-rose-800",
  moderate: "bg-amber-100 text-amber-800",
  low: "bg-emerald-100 text-emerald-800",
};

export function ContextDashboardPanel({ locale, labels }: ContextDashboardPanelProps) {
  const [center, setCenter] = useState<ContextCenterBundle | null>(null);
  const [settings, setSettings] = useState<ContextSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/assistant/context");
    if (res.ok) {
      const data = parseContextCenter(await res.json());
      setCenter(data);
      if (data.settings) setSettings(data.settings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveSettings() {
    if (!settings) return;
    await fetch("/api/assistant/context", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    await refresh();
  }

  async function runAnalysis() {
    await fetch("/api/assistant/context/analyze", { method: "POST" });
    await refresh();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  const briefing = center?.daily_briefing;
  const evening = center?.evening_review;
  const workloadLevel = center?.workload?.level ?? "low";

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link href="/app/assistant" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center?.privacy_note && (
          <p className="mt-2 rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-900">
            {center.privacy_note}
          </p>
        )}
      </div>

      {briefing?.enabled && briefing.greeting && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
            {labels.sections.briefing}
          </h2>
          <p className="mt-2 font-medium text-gray-900">{briefing.greeting}</p>
          {Array.isArray(briefing.today_events) && briefing.today_events.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {briefing.today_events.map((e) => (
                <li key={e.id}>
                  · {e.title} — {formatDate(e.starts_at, locale)}
                </li>
              ))}
            </ul>
          )}
          {Array.isArray(briefing.upcoming_reminders) && briefing.upcoming_reminders.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {briefing.upcoming_reminders.map((r) => (
                <li key={r.id}>
                  · {r.title}
                  {r.memory_date ? ` — ${formatDate(r.memory_date, locale)}` : ""}
                </li>
              ))}
            </ul>
          )}
          {briefing.prompt && (
            <p className="mt-3 text-sm text-indigo-800">{briefing.prompt}</p>
          )}
        </section>
      )}

      {evening?.enabled && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-700">
            {labels.sections.evening}
          </h2>
          {Array.isArray(evening.completed_today) && evening.completed_today.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-500">Completed</p>
              <ul className="mt-1 space-y-1 text-sm">
                {evening.completed_today.map((item) => (
                  <li key={item.id}>✓ {item.title}</li>
                ))}
              </ul>
            </div>
          )}
          {Array.isArray(evening.still_outstanding) && evening.still_outstanding.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-500">Outstanding</p>
              <ul className="mt-1 space-y-1 text-sm">
                {evening.still_outstanding.map((item) => (
                  <li key={item.id}>· {item.title}</li>
                ))}
              </ul>
            </div>
          )}
          {evening.prompt && <p className="mt-3 text-sm text-violet-800">{evening.prompt}</p>}
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">{labels.sections.mode}</h2>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
            {labels.contextModes[settings?.context_mode ?? "auto"] ?? settings?.context_mode}
          </span>
        </div>
        {center?.workload && (
          <p className="mt-3">
            <span className="text-xs text-gray-500">{labels.sections.workload}: </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${WORKLOAD_STYLES[workloadLevel] ?? WORKLOAD_STYLES.low}`}
            >
              {labels.workloadLevels[workloadLevel] ?? workloadLevel}
            </span>
          </p>
        )}
        <button
          type="button"
          onClick={() => void runAnalysis()}
          className="mt-3 text-sm text-indigo-600 hover:underline"
        >
          {labels.analyze}
        </button>
      </section>

      {center?.cognitive_load?.alert && center.cognitive_load.message && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-sm font-semibold text-amber-900">{labels.sections.workload}</h2>
          <p className="mt-2 text-sm text-amber-800">{center.cognitive_load.message}</p>
        </section>
      )}

      {Array.isArray(center?.conflicts) && center.conflicts.length > 0 && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <h2 className="text-sm font-semibold text-rose-900">{labels.sections.conflicts}</h2>
          <ul className="mt-2 space-y-1 text-sm text-rose-800">
            {center.conflicts.map((c, i) => (
              <li key={i}>· {c.message}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.calendars}</h2>
        {Array.isArray(center?.connected_calendars) && center.connected_calendars.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm">
            {center.connected_calendars.map((c) => (
              <li key={c.id} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span>{c.display_name}</span>
                <span className="text-xs text-gray-500">{c.connection_status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">{labels.empty}</p>
        )}
        <Link href="/app/assistant/calendars" className="mt-3 inline-block text-sm text-indigo-600 hover:underline">
          {labels.viewCalendars}
        </Link>
      </section>

      {Array.isArray(center?.upcoming_events) && center.upcoming_events.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.events}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {center.upcoming_events.map((e) => (
              <li key={e.id} className="rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-medium">{e.title}</span>
                <span className="ml-2 text-gray-500">{formatDate(e.starts_at, locale)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.suggested_actions) && center.suggested_actions.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.suggestions}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {center.suggested_actions.map((a) => (
              <li key={a.id}>· {a.message}</li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.proactive_assistance) && center.proactive_assistance.length > 0 && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
          <h2 className="font-semibold text-emerald-900">{labels.sections.proactive}</h2>
          <ul className="mt-3 space-y-2 text-sm text-emerald-800">
            {center.proactive_assistance.map((msg, i) => (
              <li key={i}>· {msg}</li>
            ))}
          </ul>
        </section>
      )}

      {settings && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.settings}</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="text-gray-600">{labels.settings.contextMode}</span>
              <select
                value={settings.context_mode}
                onChange={(e) =>
                  setSettings({ ...settings, context_mode: e.target.value as ContextSettings["context_mode"] })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                {CONTEXT_MODES.map((m) => (
                  <option key={m} value={m}>
                    {labels.contextModes[m] ?? m}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">{labels.settings.proactive}</span>
              <select
                value={settings.proactive_assistance}
                onChange={(e) =>
                  setSettings({ ...settings, proactive_assistance: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                {PROACTIVE_ASSISTANCE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {labels.proactiveLevels[l] ?? l}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.daily_briefing_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, daily_briefing_enabled: e.target.checked })
                }
              />
              {labels.settings.dailyBriefing}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.evening_review_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, evening_review_enabled: e.target.checked })
                }
              />
              {labels.settings.eveningReview}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.conflict_detection_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, conflict_detection_enabled: e.target.checked })
                }
              />
              {labels.settings.conflicts}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.cognitive_load_alerts_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, cognitive_load_alerts_enabled: e.target.checked })
                }
              />
              {labels.settings.cognitiveLoad}
            </label>
            <button
              type="button"
              onClick={() => void saveSettings()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {saved ? labels.saved : labels.save}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
