"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsTasksCenterActionResult,
  parseAipifyHostsTasksCenterDashboard,
  type HostsTaskRow,
  type HostsTasksCenterDashboard,
  type HostsTasksCenterSectionKey,
} from "@/lib/aipify/aipify-hosts-tasks-center";

type Props = { labels: Record<string, string> };

function priorityBadge(priority: string): string {
  const map: Record<string, string> = {
    low: "bg-gray-100 text-gray-700 ring-gray-200",
    medium: "bg-sky-50 text-sky-800 ring-sky-200",
    high: "bg-amber-50 text-amber-900 ring-amber-200",
    critical: "bg-red-50 text-red-800 ring-red-200",
  };
  return map[priority] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    not_started: "bg-gray-100 text-gray-700 ring-gray-200",
    in_progress: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    waiting: "bg-amber-50 text-amber-900 ring-amber-200",
    completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    cancelled: "bg-red-50 text-red-800 ring-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function TaskTable({
  rows,
  labels,
  onComplete,
  busy,
}: {
  rows: HostsTaskRow[];
  labels: Record<string, string>;
  onComplete: (id: string) => void;
  busy: boolean;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyTasksTitle} message={labels.emptyTasksMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.taskTitle}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.category}</th>
            <th className="px-4 py-3">{labels.priority}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.dueDate}</th>
            <th className="px-4 py-3">{labels.assignee}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.is_overdue ? "bg-red-50/40" : ""}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{row.title}</td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "cat", row.category)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${priorityBadge(row.priority)}`}>
                  {labelFor(labels, "priority", row.priority)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status)}`}>
                  {labelFor(labels, "status", row.status)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.due_date ?? row.scheduled_for ?? "—"}</td>
              <td className="px-4 py-3 text-gray-700">
                {row.assignee_name ?? (row.assignee_role ? labelFor(labels, "role", row.assignee_role) : "—")}
              </td>
              <td className="px-4 py-3">
                {row.status !== "completed" && row.status !== "cancelled" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onComplete(row.id)}
                    className="text-xs font-medium text-teal-700 hover:text-teal-900 disabled:opacity-60"
                  >
                    {labels.markCompleted}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AipifyHostsTasksCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsTasksCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsTasksCenterSectionKey>("active_tasks");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [playbookPropertyId, setPlaybookPropertyId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection });
    const res = await fetch(`/api/aipify/aipify-hosts/tasks-center/dashboard?${params.toString()}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsTasksCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/tasks-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsTasksCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(labels.actionRecorded);
      setNewTitle("");
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  if (loading && !dashboard) return <AipifyLoader label={labels.loading} centered fullPage />;

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const taskRows =
    activeSection === "active_tasks"
      ? dashboard.active_tasks
      : activeSection === "scheduled_tasks"
        ? dashboard.scheduled_tasks
        : activeSection === "completed_tasks"
          ? dashboard.completed_tasks
          : [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6">
        <p className="text-sm font-medium text-teal-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-teal-900">{labels.governanceNote}</p>
        <Link
          href="/app/aipify-hosts"
          className="mt-4 inline-flex rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-50"
        >
          {labels.backToHosts}
        </Link>
      </section>

      {dashboard.notifications.length > 0 && (
        <section className="space-y-2">
          {dashboard.notifications.filter((n) => n.active).map((n) => (
            <div key={n.key} className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {n.message}
            </div>
          ))}
        </section>
      )}

      <nav className="flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
        {dashboard.sections.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActiveSection(s.key as HostsTasksCenterSectionKey)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium ${
              activeSection === s.key
                ? "border border-b-0 border-gray-200 bg-white text-teal-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {(activeSection === "active_tasks" || activeSection === "scheduled_tasks" || activeSection === "completed_tasks") && (
        <div className="space-y-4">
          {activeSection === "active_tasks" && (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900">{labels.createTask}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={labels.taskTitlePlaceholder}
                  className="min-w-[200px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  disabled={busy || !newTitle.trim()}
                  onClick={() => void runAction({ action: "create_task", title: newTitle, category: "cleaning", priority: "medium" })}
                  className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {labels.addTask}
                </button>
              </div>
            </div>
          )}
          <TaskTable
            rows={taskRows}
            labels={labels}
            busy={busy}
            onComplete={(id) => void runAction({ action: "update_status", task_id: id, status: "completed" })}
          />
        </div>
      )}

      {activeSection === "playbooks" && (
        <div className="space-y-4">
          {dashboard.properties.length > 0 && (
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-gray-700">{labels.playbookProperty}</span>
              <select
                value={playbookPropertyId}
                onChange={(e) => setPlaybookPropertyId(e.target.value)}
                className="max-w-md rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">{labels.allPropertiesOption}</option>
                {dashboard.properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.display_name}</option>
                ))}
              </select>
            </label>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {dashboard.playbooks.map((pb) => (
              <article key={pb.key} className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="font-semibold text-gray-900">{pb.label}</h3>
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-gray-600">
                  {pb.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void runAction({
                      action: "initiate_playbook",
                      playbook_key: pb.key,
                      property_id: playbookPropertyId || undefined,
                    })
                  }
                  className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-100 disabled:opacity-60"
                >
                  {labels.initiatePlaybook}
                </button>
              </article>
            ))}
          </div>
          {dashboard.playbook_runs.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.activePlaybookRuns}</h3>
              <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
                {dashboard.playbook_runs.map((run) => (
                  <li key={run.id} className="px-4 py-3 text-sm">
                    <span className="font-medium text-gray-900">{labelFor(labels, "playbook", run.playbook_key)}</span>
                    <span className="text-gray-600"> · {run.property} · {run.started_at}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeSection === "templates" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {dashboard.templates.length === 0 ? (
            <EmptyBoard title={labels.emptyTemplatesTitle} message={labels.emptyTemplatesMessage} />
          ) : (
            dashboard.templates.map((tm) => (
              <article key={tm.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="font-semibold text-gray-900">{tm.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{tm.description}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {labelFor(labels, "cat", tm.category)}
                  {tm.recurrence ? ` · ${labelFor(labels, "recurrence", tm.recurrence)}` : ""}
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction({ action: "create_from_template", template_key: tm.template_key })}
                  className="mt-4 text-sm font-medium text-teal-700 hover:text-teal-900 disabled:opacity-60"
                >
                  {labels.useTemplate}
                </button>
              </article>
            ))
          )}
        </div>
      )}

      {actionMessage && (
        <p className="rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900">{actionMessage}</p>
      )}
    </div>
  );
}
