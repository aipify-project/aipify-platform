"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ACCOUNTABILITY_LEVELS,
  GOAL_CATEGORIES,
  parseGoalsCenter,
  type GdeSettings,
  type GoalsCenterBundle,
  type UserGoal,
} from "@/lib/goals-dreams-engine";

type GoalsDashboardPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    saved: string;
    privacy: string;
    export: string;
    checkIn: string;
    completeMilestone: string;
    pause: string;
    sections: {
      active: string;
      completed: string;
      milestones: string;
      actions: string;
      nextSteps: string;
      celebrations: string;
      checkIns: string;
      settings: string;
    };
    settings: {
      accountability: string;
      proactive: string;
      celebrations: string;
      setbacks: string;
      checkInDays: string;
    };
    categories: Record<string, string>;
    accountabilityLevels: Record<string, string>;
    empty: string;
  };
};

const PROGRESS_STYLES = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
];

export function GoalsDashboardPanel({ labels }: GoalsDashboardPanelProps) {
  const [center, setCenter] = useState<GoalsCenterBundle | null>(null);
  const [settings, setSettings] = useState<GdeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/assistant/goals");
    if (res.ok) {
      const data = parseGoalsCenter(await res.json());
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
    await fetch("/api/assistant/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  async function completeMilestone(milestoneId: string) {
    await fetch("/api/assistant/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete_milestone", milestone_id: milestoneId }),
    });
    await refresh();
  }

  async function checkInGoal(goalId: string) {
    await fetch("/api/assistant/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "check_in", goal_id: goalId }),
    });
    await refresh();
  }

  async function pauseGoal(goalId: string) {
    await fetch("/api/assistant/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_goal", goal_id: goalId, status: "paused" }),
    });
    await refresh();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  const activeGoals = center?.active_goals ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link href="/app/assistant" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center?.privacy_note && (
          <p className="mt-2 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-900">
            {center.privacy_note}
          </p>
        )}
        {center?.check_in_prompt && (
          <p className="mt-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {center.check_in_prompt}
          </p>
        )}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">{labels.sections.active}</h2>
          <a href="/api/assistant/goals/export" className="text-xs text-indigo-600 hover:underline">
            {labels.export}
          </a>
        </div>
        {activeGoals.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {activeGoals.map((goal: UserGoal, idx) => (
              <li key={goal.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{goal.title}</p>
                    <p className="text-xs text-gray-500">
                      {labels.categories[goal.category] ?? goal.category} · {goal.progress_percent}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void checkInGoal(goal.id)}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      {labels.checkIn}
                    </button>
                    <button
                      type="button"
                      onClick={() => void pauseGoal(goal.id)}
                      className="text-xs text-gray-500 hover:underline"
                    >
                      {labels.pause}
                    </button>
                  </div>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full ${PROGRESS_STYLES[idx % PROGRESS_STYLES.length]}`}
                    style={{ width: `${goal.progress_percent}%` }}
                  />
                </div>
                {goal.why_matters && (
                  <p className="mt-2 text-xs text-gray-600">{goal.why_matters}</p>
                )}
                {Array.isArray(goal.milestones) && goal.milestones.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500">{labels.sections.milestones}</p>
                    <ul className="mt-1 space-y-1 text-sm">
                      {goal.milestones.map((m) => (
                        <li key={m.id} className="flex items-center justify-between gap-2">
                          <span
                            className={
                              m.status === "completed"
                                ? "text-gray-400 line-through"
                                : "text-gray-700"
                            }
                          >
                            {m.status === "in_progress" ? "→ " : "· "}
                            {m.title}
                          </span>
                          {m.status !== "completed" && m.status === "in_progress" && (
                            <button
                              type="button"
                              onClick={() => void completeMilestone(m.id)}
                              className="text-xs text-emerald-600 hover:underline"
                            >
                              {labels.completeMilestone}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(goal.actions) && goal.actions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-500">{labels.sections.actions}</p>
                    <ul className="mt-1 space-y-1 text-sm text-gray-600">
                      {goal.actions.map((a) => (
                        <li key={a.id}>· {a.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.empty}</p>
        )}
      </section>

      {Array.isArray(center?.recommended_next_steps) && center.recommended_next_steps.length > 0 && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold text-indigo-900">{labels.sections.nextSteps}</h2>
          <ul className="mt-3 space-y-2 text-sm text-indigo-800">
            {center.recommended_next_steps.map((s) => (
              <li key={s.goal_id}>· {s.message}</li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.celebrations) && center.celebrations.length > 0 && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
          <h2 className="font-semibold text-emerald-900">{labels.sections.celebrations}</h2>
          <ul className="mt-3 space-y-2 text-sm text-emerald-800">
            {center.celebrations.map((c) => (
              <li key={c.id}>🎉 {c.message}</li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.completed_goals) && center.completed_goals.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.completed}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {center.completed_goals.map((g) => (
              <li key={g.id}>✓ {g.title}</li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.check_ins) && center.check_ins.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.checkIns}</h2>
          <ul className="mt-3 space-y-2 text-xs text-gray-600">
            {center.check_ins.map((c) => (
              <li key={c.id}>{c.message}</li>
            ))}
          </ul>
        </section>
      )}

      {settings && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.settings}</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="text-gray-600">{labels.settings.accountability}</span>
              <select
                value={settings.default_accountability}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    default_accountability: e.target.value as GdeSettings["default_accountability"],
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                {ACCOUNTABILITY_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {labels.accountabilityLevels[l] ?? l}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.proactive_suggestions_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, proactive_suggestions_enabled: e.target.checked })
                }
              />
              {labels.settings.proactive}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.celebration_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, celebration_enabled: e.target.checked })
                }
              />
              {labels.settings.celebrations}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.setback_support_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, setback_support_enabled: e.target.checked })
                }
              />
              {labels.settings.setbacks}
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
