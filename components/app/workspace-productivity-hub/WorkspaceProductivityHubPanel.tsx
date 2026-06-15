"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildWorkspaceFilterQuery,
  parseWorkspaceProductivityHub,
  PRIORITY_BADGES,
  STATUS_BADGES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type WorkspaceFilters,
  type WorkspaceProductivityHub,
  type WorkspaceProductivityHubLabels,
  type WorkspaceTask,
} from "@/lib/workspace-productivity-hub";

type WorkspaceProductivityHubPanelProps = {
  labels: WorkspaceProductivityHubLabels;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function Pill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export function WorkspaceProductivityHubPanel({ labels }: WorkspaceProductivityHubPanelProps) {
  const [hub, setHub] = useState<WorkspaceProductivityHub | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<WorkspaceFilters>({});
  const [draftFilters, setDraftFilters] = useState<WorkspaceFilters>({});
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");

  const load = useCallback(async (activeFilters: WorkspaceFilters) => {
    setLoading(true);
    const query = buildWorkspaceFilterQuery(activeFilters);
    const res = await fetch(`/api/workspace-productivity-hub/overview${query}`);
    if (res.ok) setHub(parseWorkspaceProductivityHub(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      const id = String(payload.task_id ?? payload.reminder_id ?? payload.note_id ?? action);
      setBusyId(id);
      try {
        const res = await fetch("/api/workspace-productivity-hub/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, payload }),
        });
        if (res.ok) {
          const data = (await res.json()) as { hub?: WorkspaceProductivityHub };
          if (data.hub) setHub(data.hub);
          else await load(filters);
        }
      } finally {
        setBusyId(null);
      }
    },
    [filters, load]
  );

  const suggestionMessage = (key: string, count?: number) => {
    const template = labels.suggestions[key] ?? key;
    return template.replace("{count}", String(count ?? 0));
  };

  if (loading && !hub) {
    return <p className="text-sm text-gray-600">{labels.loading}</p>;
  }

  if (!hub?.has_customer) {
    return <p className="text-sm text-gray-600">{labels.empty}</p>;
  }

  const overview = hub.overview;
  const myDay = hub.my_day;
  const insights = hub.insights;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
            <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
          </div>
          <Link href="/app" className="text-sm text-indigo-700 hover:text-indigo-900">
            {labels.back}
          </Link>
        </div>
        {hub.principle ? (
          <p className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm text-indigo-900">
            {hub.principle}
          </p>
        ) : null}
      </header>

      {Array.isArray(hub.suggestions) && hub.suggestions.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {labels.sections.suggestions}
          </h2>
          <div className="grid gap-2">
            {hub.suggestions.map((s) => (
              <div
                key={s.key}
                className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-950"
              >
                {suggestionMessage(s.message_key, s.count)}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {overview ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            {labels.sections.overview}
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <OverviewCard label={labels.overview.myTasks} value={overview.my_tasks} />
            <OverviewCard label={labels.overview.todayPriorities} value={overview.today_priorities} />
            <OverviewCard label={labels.overview.upcomingReminders} value={overview.upcoming_reminders} />
            <OverviewCard label={labels.overview.pendingApprovals} value={overview.pending_approvals} />
            <OverviewCard label={labels.overview.suggestedActions} value={overview.suggested_actions} />
            <OverviewCard label={labels.overview.completedThisWeek} value={overview.completed_this_week} />
          </dl>
          {overview.pending_approvals > 0 ? (
            <div className="mt-3">
              <Link href="/app/approvals" className="text-sm font-medium text-indigo-700 hover:text-indigo-900">
                {labels.viewApprovals}
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.quickActions}</h2>
        <p className="mt-1 text-xs text-gray-500">{labels.youDecide}</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">{labels.quickActions.createTask}</label>
            <div className="flex gap-2">
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={labels.searchPlaceholder}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={!newTaskTitle.trim() || busyId === "create_task"}
                onClick={() => {
                  void handleAction("create_task", { title: newTaskTitle.trim() }).then(() =>
                    setNewTaskTitle("")
                  );
                }}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {labels.quickActions.createTask}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">{labels.quickActions.addReminder}</label>
            <div className="flex gap-2">
              <input
                value={newReminderTitle}
                onChange={(e) => setNewReminderTitle(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={!newReminderTitle.trim() || busyId === "create_reminder"}
                onClick={() => {
                  void handleAction("create_reminder", {
                    title: newReminderTitle.trim(),
                    reminder_type: "one_time",
                    due_at: new Date(Date.now() + 3600000).toISOString(),
                  }).then(() => setNewReminderTitle(""));
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 disabled:opacity-50"
              >
                {labels.quickActions.addReminder}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">{labels.quickActions.addNote}</label>
            <div className="flex gap-2">
              <input
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={!newNoteTitle.trim() || busyId === "create_note"}
                onClick={() => {
                  void handleAction("create_note", {
                    title: newNoteTitle.trim(),
                    note_type: "personal",
                  }).then(() => setNewNoteTitle(""));
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 disabled:opacity-50"
              >
                {labels.quickActions.addNote}
              </button>
            </div>
          </div>
        </div>
      </section>

      {myDay ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">{labels.sections.myDay}</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">{labels.sections.todayTasks}</h3>
                {myDay.tasks.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">{labels.empty}</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {myDay.tasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        labels={labels}
                        busyId={busyId}
                        onComplete={(id) => void handleAction("complete_task", { task_id: id })}
                        onDelegate={(id) =>
                          void handleAction("delegate_task", {
                            task_id: id,
                            assignee_label: "Delegated",
                          })
                        }
                      />
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">{labels.sections.meetings}</h3>
                {myDay.meetings.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">{labels.empty}</p>
                ) : (
                  <ul className="mt-2 space-y-2 text-sm">
                    {myDay.meetings.map((m) => (
                      <li key={m.id} className="rounded-lg border border-gray-100 px-3 py-2">
                        <span className="font-medium">{m.title}</span>
                        <span className="ml-2 text-gray-500">{formatDateTime(m.starts_at)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">{labels.sections.focusAreas}</h2>
            <ul className="mt-4 space-y-2">
              {myDay.focus_areas.map((area) => (
                <li key={area.key} className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
                  {area.label}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700">{labels.sections.reminders}</h3>
              <ul className="mt-2 space-y-2">
                {(myDay.reminders ?? []).slice(0, 5).map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm">
                    <span>{r.title}</span>
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => void handleAction("dismiss_reminder", { reminder_id: r.id })}
                      className="text-xs text-gray-600 hover:text-gray-900"
                    >
                      {labels.quickActions.dismissReminder}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {insights ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.insights}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard label={labels.overview.completedThisWeek} value={insights.completed_this_week} />
            <OverviewCard
              label={labels.sections.avgCompletion}
              value={`${insights.average_completion_hours}h`}
            />
            <OverviewCard label={labels.sections.overdueItems} value={insights.overdue_items} />
            <OverviewCard
              label={labels.sections.focusTrend}
              value={labels.focusTrends[insights.focus_trend] ?? insights.focus_trend}
            />
          </dl>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.searchFilters}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <input
            value={draftFilters.search ?? ""}
            onChange={(e) => setDraftFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder={labels.searchPlaceholder}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <select
            value={draftFilters.status ?? ""}
            onChange={(e) =>
              setDraftFilters((f) => ({
                ...f,
                status: (e.target.value || undefined) as WorkspaceFilters["status"],
              }))
            }
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filters.allStatuses}</option>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {labels.statuses[s]}
              </option>
            ))}
          </select>
          <select
            value={draftFilters.priority ?? ""}
            onChange={(e) =>
              setDraftFilters((f) => ({
                ...f,
                priority: (e.target.value || undefined) as WorkspaceFilters["priority"],
              }))
            }
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filters.allPriorities}</option>
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {labels.priorities[p]}
              </option>
            ))}
          </select>
          <input
            value={draftFilters.category ?? ""}
            onChange={(e) => setDraftFilters((f) => ({ ...f, category: e.target.value }))}
            placeholder={labels.filters.category}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={draftFilters.due_from ?? ""}
            onChange={(e) => setDraftFilters((f) => ({ ...f, due_from: e.target.value }))}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={draftFilters.due_to ?? ""}
            onChange={(e) => setDraftFilters((f) => ({ ...f, due_to: e.target.value }))}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setFilters(draftFilters)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            {labels.applyFilters}
          </button>
          <button
            type="button"
            onClick={() => {
              setDraftFilters({});
              setFilters({});
            }}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800"
          >
            {labels.clearFilters}
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.tasks}</h2>
          {(hub.tasks ?? []).length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">{labels.empty}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {(hub.tasks ?? []).map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  labels={labels}
                  busyId={busyId}
                  onComplete={(id) => void handleAction("complete_task", { task_id: id })}
                  onDelegate={(id) =>
                    void handleAction("delegate_task", { task_id: id, assignee_label: "Delegated" })
                  }
                />
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">{labels.sections.notes}</h2>
            {(hub.notes ?? []).length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">{labels.empty}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {(hub.notes ?? []).map((note) => (
                  <li key={note.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{note.title}</span>
                      <Pill
                        label={labels.noteTypes[note.note_type] ?? note.note_type}
                        className="bg-slate-100 text-slate-700 ring-slate-200"
                      />
                    </div>
                    {note.body ? <p className="mt-1 text-gray-600">{note.body}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">{labels.sections.audit}</h2>
            {(hub.audit ?? []).length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">{labels.empty}</p>
            ) : (
              <ul className="mt-4 space-y-2 text-sm">
                {(hub.audit ?? []).map((entry) => (
                  <li key={entry.id} className="rounded-lg border border-gray-100 px-3 py-2">
                    <span className="text-gray-800">{entry.summary}</span>
                    <span className="mt-1 block text-xs text-gray-500">{formatDateTime(entry.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function TaskRow({
  task,
  labels,
  busyId,
  onComplete,
  onDelegate,
}: {
  task: WorkspaceTask;
  labels: WorkspaceProductivityHubLabels;
  busyId: string | null;
  onComplete: (id: string) => void;
  onDelegate: (id: string) => void;
}) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-3 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="font-medium text-gray-900">{task.title}</span>
          {task.description ? <p className="mt-1 text-gray-600">{task.description}</p> : null}
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill label={labels.priorities[task.priority]} className={PRIORITY_BADGES[task.priority]} />
            <Pill label={labels.statuses[task.status]} className={STATUS_BADGES[task.status]} />
            {task.category ? (
              <span className="text-xs text-gray-500">{task.category}</span>
            ) : null}
            {task.due_date ? (
              <span className="text-xs text-gray-500">{formatDate(task.due_date)}</span>
            ) : null}
            {task.assignee_label ? (
              <span className="text-xs text-gray-500">{task.assignee_label}</span>
            ) : null}
          </div>
        </div>
        {task.status !== "completed" && task.status !== "cancelled" ? (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busyId === task.id}
              onClick={() => onComplete(task.id)}
              className="text-xs font-medium text-green-700 hover:text-green-900"
            >
              {labels.quickActions.completeTask}
            </button>
            <button
              type="button"
              disabled={busyId === task.id}
              onClick={() => onDelegate(task.id)}
              className="text-xs font-medium text-indigo-700 hover:text-indigo-900"
            >
              {labels.quickActions.delegateTask}
            </button>
          </div>
        ) : null}
      </div>
    </li>
  );
}
