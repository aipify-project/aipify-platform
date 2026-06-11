"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  PAME_MEMORY_TYPES,
  type MemoryDashboard,
  type PersonalMemory,
  type PameMemoryType,
  parseAssistantCenter,
} from "@/lib/assistant-memory";
import { formatDate } from "@/lib/i18n/format-date";

type AssistantMemoryPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    back: string;
    remove: string;
    pause: string;
    complete: string;
    export: string;
    categories: Record<PameMemoryType, string>;
    sections: {
      importantPeople: string;
      upcomingEvents: string;
      activeTasks: string;
      recurringReminders: string;
      completedItems: string;
      recentlyAdded: string;
    };
    askBeforeRemembering: string;
    save: string;
    saved: string;
    principle: string;
  };
};

function MemorySection({
  title,
  items,
  locale,
  categoryLabels,
  onPause,
  onComplete,
  onRemove,
  labels,
}: {
  title: string;
  items: PersonalMemory[];
  locale: string;
  categoryLabels: Record<PameMemoryType, string>;
  onPause: (id: string) => void;
  onComplete: (id: string) => void;
  onRemove: (id: string) => void;
  labels: AssistantMemoryPanelProps["labels"];
}) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <ul className="mt-3 space-y-3">
        {items.map((memory) => (
          <li key={memory.id} className="rounded-xl border border-gray-100 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium text-gray-900">{memory.title}</h3>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {categoryLabels[memory.category]}
              </span>
              <span className="text-xs text-gray-400">{memory.status}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{memory.description}</p>
            {memory.memory_date && (
              <p className="mt-1 text-xs text-gray-500">
                {formatDate(memory.memory_date, locale)}
              </p>
            )}
            {memory.status === "active" && (
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => onPause(memory.id)}
                  className="text-amber-700 hover:underline"
                >
                  {labels.pause}
                </button>
                <button
                  type="button"
                  onClick={() => onComplete(memory.id)}
                  className="text-emerald-700 hover:underline"
                >
                  {labels.complete}
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(memory.id)}
                  className="text-rose-600 hover:underline"
                >
                  {labels.remove}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AssistantMemoryPanel({ locale, labels }: AssistantMemoryPanelProps) {
  const [dashboard, setDashboard] = useState<MemoryDashboard | undefined>();
  const [askBefore, setAskBefore] = useState(true);
  const [categories, setCategories] = useState<Record<PameMemoryType, boolean>>({
    important_people: true,
    events: true,
    tasks: true,
    habits: true,
    goals: true,
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/assistant/memory");
    if (res.ok) {
      const data = parseAssistantCenter(await res.json());
      setDashboard(data.dashboard);
      setAskBefore(data.ask_before_remembering ?? true);
      if (data.categories_enabled) {
        setCategories((prev) => ({ ...prev, ...data.categories_enabled }));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function updateStatus(id: string, status: string) {
    const supabase = (await import("@/lib/supabase/client")).createClient();
    await supabase.rpc("update_personal_memory_status", {
      p_memory_id: id,
      p_status: status,
    });
    await refresh();
  }

  async function saveSettings() {
    await fetch("/api/assistant/memory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ask_before_remembering: askBefore,
        categories_enabled: categories,
      }),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  async function exportMemories() {
    const res = await fetch("/api/assistant/export");
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aipify-personal-memories.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasAny =
    dashboard &&
    (dashboard.important_people.length > 0 ||
      dashboard.upcoming_events.length > 0 ||
      dashboard.active_tasks.length > 0 ||
      dashboard.recurring_reminders.length > 0 ||
      dashboard.completed_items.length > 0);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link href="/app/assistant" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-2 text-sm text-indigo-700">{labels.principle}</p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={askBefore}
            onChange={(e) => setAskBefore(e.target.checked)}
          />
          {labels.askBeforeRemembering}
        </label>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {PAME_MEMORY_TYPES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={categories[cat]}
                onChange={(e) =>
                  setCategories((prev) => ({ ...prev, [cat]: e.target.checked }))
                }
              />
              {labels.categories[cat]}
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void saveSettings()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            {saved ? labels.saved : labels.save}
          </button>
          <button
            type="button"
            onClick={() => void exportMemories()}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {labels.export}
          </button>
        </div>
      </section>

      {!hasAny ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <>
          <MemorySection
            title={labels.sections.importantPeople}
            items={dashboard?.important_people ?? []}
            locale={locale}
            categoryLabels={labels.categories}
            onPause={(id) => void updateStatus(id, "paused")}
            onComplete={(id) => void updateStatus(id, "completed")}
            onRemove={(id) => void updateStatus(id, "deleted")}
            labels={labels}
          />
          <MemorySection
            title={labels.sections.upcomingEvents}
            items={dashboard?.upcoming_events ?? []}
            locale={locale}
            categoryLabels={labels.categories}
            onPause={(id) => void updateStatus(id, "paused")}
            onComplete={(id) => void updateStatus(id, "completed")}
            onRemove={(id) => void updateStatus(id, "deleted")}
            labels={labels}
          />
          <MemorySection
            title={labels.sections.activeTasks}
            items={dashboard?.active_tasks ?? []}
            locale={locale}
            categoryLabels={labels.categories}
            onPause={(id) => void updateStatus(id, "paused")}
            onComplete={(id) => void updateStatus(id, "completed")}
            onRemove={(id) => void updateStatus(id, "deleted")}
            labels={labels}
          />
          <MemorySection
            title={labels.sections.recurringReminders}
            items={dashboard?.recurring_reminders ?? []}
            locale={locale}
            categoryLabels={labels.categories}
            onPause={(id) => void updateStatus(id, "paused")}
            onComplete={(id) => void updateStatus(id, "completed")}
            onRemove={(id) => void updateStatus(id, "deleted")}
            labels={labels}
          />
          <MemorySection
            title={labels.sections.completedItems}
            items={dashboard?.completed_items ?? []}
            locale={locale}
            categoryLabels={labels.categories}
            onPause={(id) => void updateStatus(id, "paused")}
            onComplete={(id) => void updateStatus(id, "completed")}
            onRemove={(id) => void updateStatus(id, "deleted")}
            labels={labels}
          />
          <MemorySection
            title={labels.sections.recentlyAdded}
            items={dashboard?.recently_added ?? []}
            locale={locale}
            categoryLabels={labels.categories}
            onPause={(id) => void updateStatus(id, "paused")}
            onComplete={(id) => void updateStatus(id, "completed")}
            onRemove={(id) => void updateStatus(id, "deleted")}
            labels={labels}
          />
        </>
      )}
    </div>
  );
}
