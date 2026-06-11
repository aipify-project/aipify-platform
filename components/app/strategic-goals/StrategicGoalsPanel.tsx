"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  GOAL_CATEGORIES,
  GOAL_PRIORITIES,
  parseStrategicGoalsCenter,
  type CreateGoalInput,
  type StrategicGoal,
  type StrategicGoalsCenter,
} from "@/lib/aipify/strategic-goals";

type StrategicGoalsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    youControl: string;
    privacy: string;
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    createGoal: string;
    saveGoal: string;
    cancel: string;
    archive: string;
    refresh: string;
    sections: {
      active: string;
      health: string;
      milestones: string;
      atRisk: string;
      recommended: string;
      completed: string;
      timeline: string;
      create: string;
    };
    statuses: Record<string, string>;
    categories: Record<string, string>;
    priorities: Record<string, string>;
    fields: {
      title: string;
      description: string;
      category: string;
      priority: string;
      baseline: string;
      target: string;
      current: string;
      unit: string;
      startDate: string;
      targetDate: string;
    };
    emptyActive: string;
    emptyAtRisk: string;
    emptyMilestones: string;
    emptyTimeline: string;
    emptyCompleted: string;
    progress: string;
  };
};

const STATUS_STYLES: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-700 border-gray-200",
  on_track: "bg-emerald-50 text-emerald-800 border-emerald-100",
  needs_attention: "bg-amber-50 text-amber-900 border-amber-100",
  at_risk: "bg-orange-50 text-orange-900 border-orange-100",
  behind_schedule: "bg-orange-50 text-orange-900 border-orange-100",
  completed: "bg-sky-50 text-sky-800 border-sky-100",
  archived: "bg-gray-100 text-gray-600 border-gray-200",
};

const PRIORITY_STYLES: Record<string, string> = {
  critical: "text-red-700",
  high: "text-orange-700",
  standard: "text-gray-700",
  low: "text-gray-500",
};

const EMPTY_FORM: CreateGoalInput = {
  title: "",
  description: "",
  category: "custom",
  priority: "standard",
  baseline_value: 0,
  target_value: 100,
  current_value: 0,
  measurement_unit: "",
  start_date: new Date().toISOString().slice(0, 10),
  target_date: "",
};

export function StrategicGoalsPanel({ labels }: StrategicGoalsPanelProps) {
  const [center, setCenter] = useState<StrategicGoalsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateGoalInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/goals");
    if (res.ok) setCenter(parseStrategicGoalsCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function createGoal() {
    if (!form.title.trim()) return;
    setSaving(true);
    const res = await fetch("/api/aipify/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        target_date: form.target_date || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      setForm(EMPTY_FORM);
      void refresh();
    }
  }

  async function archiveGoal(id: string) {
    await fetch(`/api/aipify/goals/${id}/archive`, { method: "POST" });
    void refresh();
  }

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;
  if (!center?.has_customer) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  if (center.upgrade_required || !center.has_access) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <Link href="/app" className="text-sm text-indigo-600 hover:underline">
          {labels.back}
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">{labels.upgradeTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.upgradeBody}</p>
          <Link
            href="/app/settings/billing"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.upgradeCta}
          </Link>
        </div>
      </div>
    );
  }

  const active = center.active_goals ?? [];
  const atRisk = center.goals_at_risk ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app" className="text-sm text-indigo-600 hover:underline">
            {labels.back}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {labels.refresh}
          </button>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.createGoal}
          </button>
        </div>
      </div>

      <p className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
        {labels.youControl}
      </p>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.health}</h2>
        <p className="mt-2 text-sm text-gray-700">{center.briefing}</p>
        {center.health_summary ? (
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>
              {labels.statuses.on_track}: {center.health_summary.on_track}
            </span>
            <span>
              {labels.sections.atRisk}: {center.health_summary.needs_attention}
            </span>
            <span>
              {labels.sections.active}: {center.health_summary.total_active}
            </span>
          </div>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.create}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm text-gray-700">{labels.fields.title}</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm text-gray-700">{labels.fields.description}</span>
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">{labels.fields.category}</span>
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as CreateGoalInput["category"] })
                }
              >
                {GOAL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {labels.categories[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">{labels.fields.priority}</span>
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as CreateGoalInput["priority"] })
                }
              >
                {GOAL_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {labels.priorities[p]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">{labels.fields.baseline}</span>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.baseline_value}
                onChange={(e) => setForm({ ...form, baseline_value: Number(e.target.value) })}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">{labels.fields.target}</span>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.target_value}
                onChange={(e) => setForm({ ...form, target_value: Number(e.target.value) })}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">{labels.fields.current}</span>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.current_value}
                onChange={(e) => setForm({ ...form, current_value: Number(e.target.value) })}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">{labels.fields.unit}</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.measurement_unit}
                onChange={(e) => setForm({ ...form, measurement_unit: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">{labels.fields.startDate}</span>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">{labels.fields.targetDate}</span>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={form.target_date ?? ""}
                onChange={(e) => setForm({ ...form, target_date: e.target.value })}
              />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void createGoal()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {labels.saveGoal}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
            >
              {labels.cancel}
            </button>
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.active}</h2>
        {active.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.emptyActive}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {active.map((goal: StrategicGoal) => (
              <GoalCard key={goal.id} goal={goal} labels={labels} onArchive={() => void archiveGoal(goal.id)} />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.atRisk}</h2>
        {atRisk.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.emptyAtRisk}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {atRisk.map((goal: StrategicGoal) => (
              <GoalCard key={goal.id} goal={goal} labels={labels} onArchive={() => void archiveGoal(goal.id)} />
            ))}
          </ul>
        )}
      </section>

      {(center.recommended_actions?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.recommended}</h2>
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            {center.recommended_actions!.map((item) => (
              <li key={item.goal_id} className="rounded-xl border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{item.goal_title}</p>
                <p className="text-gray-600">{item.recommendation}</p>
                <p className="mt-1 text-xs text-indigo-700">{item.action_center_hint}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.milestones}</h2>
          {(center.upcoming_milestones ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.emptyMilestones}</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {center.upcoming_milestones!.map((m) => (
                <li key={m.id}>
                  · {m.goal_title} — {m.milestone_name}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.completed}</h2>
          {(center.completed_goals ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.emptyCompleted}</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {center.completed_goals!.map((g) => (
                <li key={g.id}>· {g.title}</li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.timeline}</h2>
        {(center.goal_timeline ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.emptyTimeline}</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            {center.goal_timeline!.map((a) => (
              <li key={a.id} className="flex justify-between gap-4 border-b border-gray-50 pb-2">
                <span>
                  {a.goal_title}: {a.activity_description}
                </span>
                <span className="shrink-0 text-gray-500">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {center.privacy_note ? (
        <p className="text-xs text-gray-500">
          {labels.privacy}: {center.privacy_note}
        </p>
      ) : null}
    </div>
  );
}

function GoalCard({
  goal,
  labels,
  onArchive,
}: {
  goal: StrategicGoal;
  labels: StrategicGoalsPanelProps["labels"];
  onArchive: () => void;
}) {
  return (
    <li className="rounded-xl border border-gray-100 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900">{goal.title}</p>
          <p className="text-xs text-gray-500">
            {labels.categories[goal.category]} ·{" "}
            <span className={PRIORITY_STYLES[goal.priority]}>{labels.priorities[goal.priority]}</span>
          </p>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[goal.status]}`}
        >
          {labels.statuses[goal.status]}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{goal.health_explanation}</p>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{labels.progress}</span>
          <span>{goal.progress_percent}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${Math.min(100, goal.progress_percent)}%` }}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={onArchive}
        className="mt-3 text-sm text-gray-500 hover:underline"
      >
        {labels.archive}
      </button>
    </li>
  );
}
