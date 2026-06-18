"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FOCUS_PERIODS,
  INTERRUPTION_HANDLING,
  PROACTIVITY_LEVELS,
  parseAttentionCenter,
  type AttentionCenterBundle,
  type TagSettings,
} from "@/lib/attention-guardian";
import { formatDate } from "@/lib/i18n/format-date";

type AttentionDashboardPanelProps = {
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
    activateFocus: string;
    endFocus: string;
    viewContext: string;
    sections: {
      state: string;
      briefing: string;
      evening: string;
      focus: string;
      blocks: string;
      weekly: string;
      meetings: string;
      energy: string;
      goals: string;
      recovery: string;
      priorities: string;
      activity: string;
      settings: string;
    };
    settings: {
      focusProtection: string;
      proactivity: string;
      interruptions: string;
      energy: string;
      goalAlignment: string;
      meetings: string;
      recovery: string;
      dailyBriefing: string;
      endOfDay: string;
      tracking: string;
      focusPeriod: string;
    };
    attentionStates: Record<string, string>;
    focusPeriods: Record<string, string>;
    interruptionHandling: Record<string, string>;
    proactivityLevels: Record<string, string>;
    empty: string;
    focusActive: string;
  };
};

const STATE_STYLES: Record<string, string> = {
  focused: "bg-indigo-100 text-indigo-800",
  balanced: "bg-emerald-100 text-emerald-800",
  overloaded: "bg-rose-100 text-rose-800",
  distracted: "bg-amber-100 text-amber-800",
  recovery_needed: "bg-violet-100 text-violet-800",
  planning_required: "bg-sky-100 text-sky-800",
};

export function AttentionDashboardPanel({ locale, labels }: AttentionDashboardPanelProps) {
  const [center, setCenter] = useState<AttentionCenterBundle | null>(null);
  const [settings, setSettings] = useState<TagSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/assistant/attention");
    if (res.ok) {
      const data = parseAttentionCenter(await res.json());
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
    await fetch("/api/assistant/attention", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  async function runAnalysis() {
    await fetch("/api/assistant/attention/analyze", { method: "POST" });
    await refresh();
  }

  async function endFocus() {
    await fetch("/api/assistant/attention", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deactivate_focus" }),
    });
    await refresh();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const state = center?.attention_state ?? "balanced";
  const briefing = center?.daily_focus_briefing as {
    enabled?: boolean;
    greeting?: string;
    priorities?: Array<{ rank: number; title: string }>;
    focus_window?: string;
    prompt?: string;
  } | null;
  const evening = center?.end_of_day_review as {
    enabled?: boolean;
    completed_today?: Array<{ id: string; title: string }>;
    still_outstanding?: Array<{ id: string; title: string }>;
    prompt?: string;
  } | null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link href="/app/assistant" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center?.privacy_note && (
          <p className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
            {center.privacy_note}
          </p>
        )}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold text-gray-900">{labels.sections.state}</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${STATE_STYLES[state] ?? STATE_STYLES.balanced}`}
          >
            {labels.attentionStates[state] ?? state}
          </span>
        </div>
        {center?.active_focus_session && (
          <p className="mt-3 text-sm text-indigo-800">
            {labels.focusActive}: {center.active_focus_session.title}
            {center.active_focus_session.ends_at && (
              <span className="text-gray-500">
                {" "}
                — until {formatDate(center.active_focus_session.ends_at, locale)}
              </span>
            )}
          </p>
        )}
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={() => void runAnalysis()}
            className="text-sm text-indigo-600 hover:underline"
          >
            {labels.analyze}
          </button>
          {center?.active_focus_session ? (
            <button
              type="button"
              onClick={() => void endFocus()}
              className="text-sm text-gray-600 hover:underline"
            >
              {labels.endFocus}
            </button>
          ) : null}
        </div>
      </section>

      {briefing?.enabled && briefing.greeting && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
            {labels.sections.briefing}
          </h2>
          <p className="mt-2 font-medium text-gray-900">{briefing.greeting}</p>
          {Array.isArray(briefing.priorities) && briefing.priorities.length > 0 && (
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-700">
              {briefing.priorities.map((p) => (
                <li key={p.rank}>{p.title}</li>
              ))}
            </ol>
          )}
          {briefing.prompt && <p className="mt-3 text-sm text-indigo-800">{briefing.prompt}</p>}
        </section>
      )}

      {evening?.enabled && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-700">
            {labels.sections.evening}
          </h2>
          {Array.isArray(evening.completed_today) && evening.completed_today.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm">
              {evening.completed_today.map((item) => (
                <li key={item.id}>✓ {item.title}</li>
              ))}
            </ul>
          )}
          {Array.isArray(evening.still_outstanding) && evening.still_outstanding.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-gray-700">
              {evening.still_outstanding.map((item) => (
                <li key={item.id}>· {item.title}</li>
              ))}
            </ul>
          )}
          {evening.prompt && <p className="mt-3 text-sm text-violet-800">{evening.prompt}</p>}
        </section>
      )}

      {center?.weekly_attention && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.weekly}</h2>
          <ul className="mt-3 space-y-1 text-sm text-gray-700">
            {Object.entries(center.weekly_attention).map(([key, pct]) => (
              <li key={key}>
                {key.replace(/_/g, " ")}: {pct}%
              </li>
            ))}
          </ul>
          {center.weekly_prompt && (
            <p className="mt-3 text-sm text-gray-600">{center.weekly_prompt}</p>
          )}
        </section>
      )}

      {center?.meeting_analysis?.alert && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-900">{labels.sections.meetings}</h2>
          <p className="mt-2 text-sm text-amber-800">{center.meeting_analysis.alert}</p>
        </section>
      )}

      {Array.isArray(center?.energy_insights) && center.energy_insights.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.energy}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {center.energy_insights.map((msg, i) => (
              <li key={i}>· {msg}</li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.goal_alignment) && center.goal_alignment.length > 0 && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
          <h2 className="font-semibold text-emerald-900">{labels.sections.goals}</h2>
          <ul className="mt-3 space-y-2 text-sm text-emerald-800">
            {center.goal_alignment.map((g) => (
              <li key={g.goal_id}>· {g.message}</li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.recovery_alerts) && center.recovery_alerts.length > 0 && (
        <section className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
          <h2 className="font-semibold text-violet-900">{labels.sections.recovery}</h2>
          <ul className="mt-2 space-y-1 text-sm text-violet-800">
            {center.recovery_alerts.map((msg, i) => (
              <li key={i}>· {msg}</li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.priority_defense) && center.priority_defense.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.priorities}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {center.priority_defense.map((p) => (
              <li key={p.id}>· {p.message}</li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.protected_blocks) && center.protected_blocks.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.blocks}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {center.protected_blocks.map((b) => (
              <li key={b.id} className="rounded-lg bg-gray-50 px-3 py-2">
                {b.title} — {formatDate(b.starts_at, locale)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {settings && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.settings}</h2>
          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.focus_protection_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, focus_protection_enabled: e.target.checked })
                }
              />
              {labels.settings.focusProtection}
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">{labels.settings.proactivity}</span>
              <select
                value={settings.proactivity_level}
                onChange={(e) =>
                  setSettings({ ...settings, proactivity_level: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                {PROACTIVITY_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {labels.proactivityLevels[l] ?? l}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">{labels.settings.interruptions}</span>
              <select
                value={settings.interruption_handling}
                onChange={(e) =>
                  setSettings({ ...settings, interruption_handling: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                {INTERRUPTION_HANDLING.map((l) => (
                  <option key={l} value={l}>
                    {labels.interruptionHandling[l] ?? l}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">{labels.settings.focusPeriod}</span>
              <select
                value={settings.preferred_focus_period}
                onChange={(e) =>
                  setSettings({ ...settings, preferred_focus_period: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                {FOCUS_PERIODS.map((p) => (
                  <option key={p} value={p}>
                    {labels.focusPeriods[p] ?? p}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.attention_tracking_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, attention_tracking_enabled: e.target.checked })
                }
              />
              {labels.settings.tracking}
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

      <Link href="/app/assistant/context" className="text-sm text-indigo-600 hover:underline">
        {labels.viewContext}
      </Link>
    </div>
  );
}
