"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseTaskManagementCenter,
  priorityLabel,
  statusLabel,
  type TaskManagementCenter,
  type TaskManagementLabels,
  type TaskRecord,
} from "@/lib/task-management";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab =
  | "overview"
  | "myTasks"
  | "assignedByMe"
  | "departmentTasks"
  | "completed"
  | "approvals"
  | "templates"
  | "reports";

function TaskRow({
  task,
  labels,
  onComplete,
  onApprove,
  onReject,
  onEscalate,
  showActions,
}: {
  task: TaskRecord;
  labels: TaskManagementLabels;
  onComplete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onEscalate?: (id: string) => void;
  showActions?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {task.task_number ? (
              <span className="text-xs font-mono text-gray-500">{task.task_number}</span>
            ) : null}
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {statusLabel(labels, task.status)}
            </span>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-800">
              {priorityLabel(labels, task.priority)}
            </span>
          </div>
          <h3 className="mt-1 font-semibold text-gray-900">{task.title}</h3>
          {task.description ? <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p> : null}
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
            {task.due_date ? <span>{labels.dueDate}: {task.due_date}</span> : null}
            {task.business_pack_key ? <span>{labels.pack}: {task.business_pack_key}</span> : null}
          </div>
        </div>
        {showActions ? (
          <div className="flex flex-wrap gap-2">
            {onComplete && task.status !== "completed" && task.status !== "cancelled" ? (
              <button type="button" onClick={() => onComplete(task.id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                {labels.complete}
              </button>
            ) : null}
            {onApprove && task.status === "awaiting_approval" ? (
              <button type="button" onClick={() => onApprove(task.id)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">
                {labels.approve}
              </button>
            ) : null}
            {onReject && task.status === "awaiting_approval" ? (
              <button type="button" onClick={() => onReject(task.id)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                {labels.reject}
              </button>
            ) : null}
            {onEscalate && task.status !== "completed" ? (
              <button type="button" onClick={() => onEscalate(task.id)} className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50">
                {labels.escalate}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function EmptyTasks({ labels }: { labels: TaskManagementLabels }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <p className="font-medium text-gray-900">{labels.noTasks}</p>
      <p className="mt-1 text-sm text-gray-600">{labels.noTasksHint}</p>
    </div>
  );
}

export function TaskManagementPanel({ labels }: { labels: TaskManagementLabels }) {
  const [center, setCenter] = useState<TaskManagementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");
  const [dueDate, setDueDate] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/tasks");
    if (res.ok) setCenter(parseTaskManagementCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/tasks/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  async function createTask() {
    if (!title.trim()) return;
    await runAction("create_task", {
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: dueDate || undefined,
    });
    setTitle("");
    setDescription("");
    setDueDate("");
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return (
      <AipifyModuleAccessDenied message={labels.accessDenied} />
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: labels.overview },
    { key: "myTasks", label: labels.myTasks },
    { key: "assignedByMe", label: labels.assignedByMe },
    { key: "departmentTasks", label: labels.departmentTasks },
    { key: "completed", label: labels.completed },
    { key: "approvals", label: labels.approvals },
    { key: "templates", label: labels.templates },
    { key: "reports", label: labels.reports },
  ];

  const overview = center.overview;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
      </div>

      {overview ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label={labels.open} value={overview.open} />
          <StatCard label={labels.myTasks} value={overview.my_open} />
          <StatCard label={labels.overdue} value={overview.overdue} highlight="amber" />
          <StatCard label={labels.awaitingApproval} value={overview.awaiting_approval} highlight="indigo" />
          <StatCard label={labels.completed} value={overview.completed_30d} />
          <StatCard label={labels.completionRate} value={`${overview.completion_rate}%`} />
        </div>
      ) : null}

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-2 sm:flex-wrap sm:overflow-visible">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="space-y-4">
          <CreateTaskForm
            labels={labels}
            title={title}
            description={description}
            priority={priority}
            dueDate={dueDate}
            busy={busy}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onPriorityChange={setPriority}
            onDueDateChange={setDueDate}
            onSubmit={() => void createTask()}
          />
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">{labels.myTasks}</h2>
            {(center.my_tasks?.length ?? 0) === 0 ? (
              <EmptyTasks labels={labels} />
            ) : (
              center.my_tasks?.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  labels={labels}
                  showActions
                  onComplete={(id) => void runAction("complete_task", { task_id: id })}
                  onEscalate={(id) => void runAction("escalate_task", { task_id: id })}
                />
              ))
            )}
          </section>
        </div>
      ) : null}

      {tab === "myTasks" ? (
        <TaskList
          tasks={center.my_tasks ?? []}
          labels={labels}
          onComplete={(id) => void runAction("complete_task", { task_id: id })}
          onEscalate={(id) => void runAction("escalate_task", { task_id: id })}
        />
      ) : null}

      {tab === "assignedByMe" ? (
        <TaskList tasks={center.assigned_by_me ?? []} labels={labels} />
      ) : null}

      {tab === "departmentTasks" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.department_tasks?.length ?? 0) === 0 ? (
            <EmptyTasks labels={labels} />
          ) : (
            center.department_tasks?.map((d) => (
              <div key={d.department_id} className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-gray-900">{d.department_name}</h3>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                  <div><dt className="text-gray-500">{labels.open}</dt><dd className="font-semibold">{d.open}</dd></div>
                  <div><dt className="text-gray-500">{labels.overdue}</dt><dd className="font-semibold text-amber-700">{d.overdue}</dd></div>
                  <div><dt className="text-gray-500">{labels.completed}</dt><dd className="font-semibold text-emerald-700">{d.completed}</dd></div>
                </dl>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "completed" ? (
        <TaskList tasks={center.completed ?? []} labels={labels} />
      ) : null}

      {tab === "approvals" ? (
        <div className="space-y-3">
          {(center.approvals?.length ?? 0) === 0 ? (
            <EmptyTasks labels={labels} />
          ) : (
            center.approvals?.map((a) => (
              <div key={a.approval_id} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                <p className="font-semibold text-gray-900">{a.task_title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" disabled={busy} onClick={() => void runAction("approve_task", { task_id: a.task_id })} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white">
                    {labels.approve}
                  </button>
                  <button type="button" disabled={busy} onClick={() => void runAction("reject_task", { task_id: a.task_id })} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700">
                    {labels.reject}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "templates" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.templates?.length ?? 0) === 0 ? (
            <EmptyTasks labels={labels} />
          ) : (
            center.templates?.map((tpl) => (
              <div key={tpl.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-gray-900">{tpl.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{tpl.description}</p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction("create_from_template", { template_key: tpl.template_key })}
                  className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {labels.useTemplate}
                </button>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "reports" && center.reports ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label={labels.open} value={center.reports.open_tasks} />
          <StatCard label={labels.completed} value={center.reports.completed_tasks} />
          <StatCard label={labels.overdue} value={center.reports.overdue_tasks} highlight="amber" />
          <StatCard label={labels.priorityCritical} value={center.reports.by_priority.critical} highlight="red" />
          <StatCard label={labels.priorityHigh} value={center.reports.by_priority.high} />
          {(center.reports.by_pack ?? []).map((p) => (
            <StatCard key={p.pack_key} label={`${labels.pack}: ${p.pack_key}`} value={p.count} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string | number; highlight?: "amber" | "indigo" | "red" }) {
  const cls =
    highlight === "amber" ? "border-amber-100 bg-amber-50/40" :
    highlight === "indigo" ? "border-indigo-100 bg-indigo-50/40" :
    highlight === "red" ? "border-red-100 bg-red-50/40" :
    "border-gray-200 bg-white";
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function TaskList({
  tasks,
  labels,
  onComplete,
  onEscalate,
}: {
  tasks: TaskRecord[];
  labels: TaskManagementLabels;
  onComplete?: (id: string) => void;
  onEscalate?: (id: string) => void;
}) {
  if (tasks.length === 0) return <EmptyTasks labels={labels} />;
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          labels={labels}
          showActions={Boolean(onComplete || onEscalate)}
          onComplete={onComplete}
          onEscalate={onEscalate}
        />
      ))}
    </div>
  );
}

function CreateTaskForm({
  labels,
  title,
  description,
  priority,
  dueDate,
  busy,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onDueDateChange,
  onSubmit,
}: {
  labels: TaskManagementLabels;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  busy: boolean;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onPriorityChange: (v: string) => void;
  onDueDateChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">{labels.createTask}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-gray-700">{labels.taskTitle}</span>
          <input value={title} onChange={(e) => onTitleChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-gray-700">{labels.taskDescription}</span>
          <textarea value={description} onChange={(e) => onDescriptionChange(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">{labels.priority}</span>
          <select value={priority} onChange={(e) => onPriorityChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="low">{labels.priorityLow}</option>
            <option value="normal">{labels.priorityNormal}</option>
            <option value="high">{labels.priorityHigh}</option>
            <option value="critical">{labels.priorityCritical}</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">{labels.dueDate}</span>
          <input type="date" value={dueDate} onChange={(e) => onDueDateChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
      </div>
      <button type="button" disabled={busy || !title.trim()} onClick={onSubmit} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
        {labels.save}
      </button>
    </div>
  );
}
