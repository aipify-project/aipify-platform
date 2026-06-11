"use client";

import { useCallback, useEffect, useState } from "react";
import { parseDesktopReminders, type DesktopReminder } from "@/lib/aipify/desktop";
import { formatDate } from "@/lib/i18n/format-date";

type DesktopRemindersPanelProps = {
  labels: Record<string, string>;
  locale: string;
};

export function DesktopRemindersPanel({ labels, locale }: DesktopRemindersPanelProps) {
  const [reminders, setReminders] = useState<DesktopReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/desktop/reminders");
    if (res.ok) setReminders(parseDesktopReminders(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function createReminder() {
    if (!title.trim()) return;
    await fetch("/api/aipify/desktop/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        due_at: dueAt || new Date(Date.now() + 86400000).toISOString(),
        reminder_type: "personal",
      }),
    });
    setTitle("");
    setDueAt("");
    await refresh();
  }

  async function cancel(id: string) {
    await fetch(`/api/aipify/desktop/reminders/${id}`, { method: "DELETE" });
    await refresh();
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold">{labels.create}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={labels.titlePlaceholder}
            className="min-w-[200px] flex-1 rounded border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="rounded border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void createReminder()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
          >
            {labels.add}
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold">{labels.upcoming}</h2>
        {reminders.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.empty}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {reminders.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 rounded border border-gray-100 px-3 py-2 text-sm">
                <div>
                  <span className="font-medium">{r.title}</span>
                  <span className="block text-xs text-gray-500">
                    {formatDate(r.due_at, locale)} · {r.reminder_type}
                  </span>
                </div>
                {r.status === "scheduled" ? (
                  <button
                    type="button"
                    onClick={() => void cancel(r.id)}
                    className="text-xs text-gray-500 hover:text-red-600"
                  >
                    {labels.cancel}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
