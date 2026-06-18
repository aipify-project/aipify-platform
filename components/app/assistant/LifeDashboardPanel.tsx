"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  LIFE_AREAS,
  LIFE_PERSONALITIES,
  NOTIFICATION_FREQUENCIES,
  PROACTIVITY_LEVELS,
  parseLifeCenter,
  type LifeCenterBundle,
  type LifeOsSettings,
} from "@/lib/life-os";
import { formatDate } from "@/lib/i18n/format-date";

type LifeDashboardPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    saved: string;
    privacy: string;
    planWeek: string;
    planning: string;
    postpone: string;
    sections: {
      dailyBriefing: string;
      eveningReview: string;
      todayOverview: string;
      upcomingEvents: string;
      priorityTasks: string;
      familyReminders: string;
      suggestedActions: string;
      conflicts: string;
      proactiveQuestions: string;
      checklists: string;
      lifeBalance: string;
      settings: string;
    };
    settings: {
      proactivity: string;
      notifications: string;
      personality: string;
      dailyBriefing: string;
      eveningReview: string;
      energyAware: string;
      lifeAreas: string;
    };
    priorities: Record<string, string>;
    lifeAreas: Record<string, string>;
    personalities: Record<string, string>;
    proactivityLevels: Record<string, string>;
    notificationFrequencies: Record<string, string>;
    empty: string;
    viewMemories: string;
  };
};

const PRIORITY_STYLES: Record<string, string> = {
  critical: "bg-rose-100 text-rose-800",
  important: "bg-amber-100 text-amber-800",
  routine: "bg-sky-100 text-sky-800",
  optional: "bg-gray-100 text-gray-600",
};

export function LifeDashboardPanel({ locale, labels }: LifeDashboardPanelProps) {
  const [center, setCenter] = useState<LifeCenterBundle | null>(null);
  const [settings, setSettings] = useState<LifeOsSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [planning, setPlanning] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/assistant/life");
    if (res.ok) {
      const data = parseLifeCenter(await res.json());
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
    await fetch("/api/assistant/life", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  async function postponeTask(memoryId: string) {
    await fetch("/api/assistant/life/postpone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memory_id: memoryId }),
    });
    await refresh();
  }

  async function toggleChecklistItem(itemId: string, completed: boolean) {
    await fetch("/api/assistant/life/checklists", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: itemId, completed }),
    });
    await refresh();
  }

  async function planWeek() {
    setPlanning(labels.planning);
    const res = await fetch("/api/assistant/life", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "plan_week" }),
    });
    if (res.ok) {
      const data = (await res.json()) as { reply?: string };
      setPlanning(data.reply ?? null);
    } else {
      setPlanning(null);
    }
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const briefing = center?.daily_briefing;
  const evening = center?.evening_review;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link href="/app/assistant" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center?.privacy_note && (
          <p className="mt-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
            {center.privacy_note}
          </p>
        )}
      </div>

      {briefing && (
        <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.dailyBriefing}</h2>
          <p className="mt-2 text-lg font-medium text-gray-900">{briefing.greeting}</p>
          {briefing.highlights.length > 0 && (
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-700">
              {briefing.highlights.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-sm text-indigo-700">{briefing.prompt}</p>
          <button
            type="button"
            onClick={() => void planWeek()}
            className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            {labels.planWeek}
          </button>
          {planning && <p className="mt-3 text-sm text-gray-700">{planning}</p>}
        </section>
      )}

      {evening && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.eveningReview}</h2>
          {evening.completed_today.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase text-gray-500">Completed</p>
              <ul className="mt-1 space-y-1 text-sm text-gray-700">
                {evening.completed_today.map((item) => (
                  <li key={item.id}>✓ {item.title}</li>
                ))}
              </ul>
            </div>
          )}
          {evening.still_pending.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase text-gray-500">Pending</p>
              <ul className="mt-1 space-y-1 text-sm text-gray-700">
                {evening.still_pending.map((item) => (
                  <li key={item.id}>○ {item.title}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-3 text-sm text-indigo-700">{evening.prompt}</p>
        </section>
      )}

      {center?.conflicts && center.conflicts.length > 0 && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <h2 className="text-base font-semibold text-rose-900">{labels.sections.conflicts}</h2>
          <ul className="mt-2 space-y-2 text-sm text-rose-800">
            {center.conflicts.map((c, i) => (
              <li key={`${c.type}-${i}`}>{c.message}</li>
            ))}
          </ul>
        </section>
      )}

      <LifeItemSection
        title={labels.sections.todayOverview}
        items={center?.today_overview ?? []}
        locale={locale}
        labels={labels}
        onPostpone={postponeTask}
      />

      <LifeItemSection
        title={labels.sections.priorityTasks}
        items={center?.priority_tasks ?? []}
        locale={locale}
        labels={labels}
        onPostpone={postponeTask}
      />

      <LifeItemSection
        title={labels.sections.upcomingEvents}
        items={center?.upcoming_events ?? []}
        locale={locale}
        labels={labels}
        onPostpone={postponeTask}
      />

      {center?.family_reminders && center.family_reminders.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.familyReminders}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {center.family_reminders.map((r) => (
              <li key={r.id}>
                <span className="font-medium">{r.title}</span>
                {r.memory_date && (
                  <span className="ml-2 text-gray-500">
                    {formatDate(r.memory_date, locale)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center?.proactive_questions && center.proactive_questions.length > 0 && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
          <h2 className="text-base font-semibold text-gray-900">
            {labels.sections.proactiveQuestions}
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            {center.proactive_questions.map((q) => (
              <li key={q.id}>{q.message}</li>
            ))}
          </ul>
        </section>
      )}

      {center?.suggested_actions && center.suggested_actions.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.suggestedActions}</h2>
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            {center.suggested_actions.map((a) => (
              <li key={a.id}>{a.message}</li>
            ))}
          </ul>
        </section>
      )}

      {center?.checklists && center.checklists.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.checklists}</h2>
          <div className="mt-3 space-y-4">
            {center.checklists.map((cl) => (
              <div key={cl.id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-gray-900">{cl.title}</h3>
                  <span className="text-xs text-gray-500">{cl.progress}%</span>
                </div>
                <ul className="mt-2 space-y-2">
                  {cl.items.map((item) => (
                    <li key={item.id}>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={Boolean(item.completed_at)}
                          onChange={(e) =>
                            void toggleChecklistItem(item.id, e.target.checked)
                          }
                        />
                        {item.title}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {center?.life_balance && Object.keys(center.life_balance.by_area).length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.lifeBalance}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(center.life_balance.by_area).map(([area, count]) => (
              <span
                key={area}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                {labels.lifeAreas[area] ?? area}: {count}
              </span>
            ))}
          </div>
          {center.life_balance.overload_days.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-amber-800">
              {center.life_balance.overload_days.map((d) => (
                <li key={d.date}>{d.message}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {center?.energy_hint && (
        <p className="text-sm text-gray-600 italic">{center.energy_hint}</p>
      )}

      {settings && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.settings}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-gray-700">
              {labels.settings.proactivity}
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={settings.proactivity_level}
                onChange={(e) =>
                  setSettings((s) =>
                    s ? { ...s, proactivity_level: e.target.value as LifeOsSettings["proactivity_level"] } : s
                  )
                }
              >
                {PROACTIVITY_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {labels.proactivityLevels[l]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-gray-700">
              {labels.settings.notifications}
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={settings.notification_frequency}
                onChange={(e) =>
                  setSettings((s) =>
                    s
                      ? {
                          ...s,
                          notification_frequency: e.target
                            .value as LifeOsSettings["notification_frequency"],
                        }
                      : s
                  )
                }
              >
                {NOTIFICATION_FREQUENCIES.map((f) => (
                  <option key={f} value={f}>
                    {labels.notificationFrequencies[f]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-gray-700 sm:col-span-2">
              {labels.settings.personality}
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={settings.personality}
                onChange={(e) =>
                  setSettings((s) =>
                    s ? { ...s, personality: e.target.value as LifeOsSettings["personality"] } : s
                  )
                }
              >
                {LIFE_PERSONALITIES.map((p) => (
                  <option key={p} value={p}>
                    {labels.personalities[p]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={settings.daily_briefing_enabled}
                onChange={(e) =>
                  setSettings((s) =>
                    s ? { ...s, daily_briefing_enabled: e.target.checked } : s
                  )
                }
              />
              {labels.settings.dailyBriefing}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={settings.evening_review_enabled}
                onChange={(e) =>
                  setSettings((s) =>
                    s ? { ...s, evening_review_enabled: e.target.checked } : s
                  )
                }
              />
              {labels.settings.eveningReview}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={settings.energy_aware_enabled}
                onChange={(e) =>
                  setSettings((s) =>
                    s ? { ...s, energy_aware_enabled: e.target.checked } : s
                  )
                }
              />
              {labels.settings.energyAware}
            </label>
          </div>
          <p className="mt-4 text-xs font-medium uppercase text-gray-500">
            {labels.settings.lifeAreas}
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {LIFE_AREAS.map((area) => (
              <label key={area} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={settings.life_areas_enabled[area]}
                  onChange={(e) =>
                    setSettings((s) =>
                      s
                        ? {
                            ...s,
                            life_areas_enabled: {
                              ...s.life_areas_enabled,
                              [area]: e.target.checked,
                            },
                          }
                        : s
                    )
                  }
                />
                {labels.lifeAreas[area]}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void saveSettings()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            {saved ? labels.saved : labels.save}
          </button>
        </section>
      )}

      <Link href="/app/assistant/memory" className="text-sm text-indigo-600 hover:underline">
        {labels.viewMemories}
      </Link>
    </div>
  );
}

function LifeItemSection({
  title,
  items,
  locale,
  labels,
  onPostpone,
}: {
  title: string;
  items: Array<{
    id: string;
    title: string;
    memory_date: string | null;
    priority: string;
    life_area: string;
    reschedule_suggested?: boolean;
    postponed_count?: number;
  }>;
  locale: string;
  labels: LifeDashboardPanelProps["labels"];
  onPostpone: (id: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-gray-100 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-gray-900">{item.title}</span>
              <span
                className={`rounded px-2 py-0.5 text-xs ${PRIORITY_STYLES[item.priority] ?? PRIORITY_STYLES.optional}`}
              >
                {labels.priorities[item.priority] ?? item.priority}
              </span>
              <span className="text-xs text-gray-500">
                {labels.lifeAreas[item.life_area] ?? item.life_area}
              </span>
            </div>
            {item.memory_date && (
              <p className="mt-1 text-xs text-gray-500">
                {formatDate(item.memory_date, locale)}
              </p>
            )}
            {item.reschedule_suggested && (
              <p className="mt-2 text-xs text-amber-700">
                Postponed {item.postponed_count ?? 0} times — consider rescheduling.
              </p>
            )}
            <button
              type="button"
              onClick={() => onPostpone(item.id)}
              className="mt-2 text-xs text-indigo-600 hover:underline"
            >
              {labels.postpone}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
