"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseUnifiedTaskFollowUpEngineDashboard,
  type CompanionAssistanceExample,
  type OrganizationTask,
  type PriorityLevel,
  type TaskObjective,
  type UnifiedTaskFollowUpEngineDashboard,
} from "@/lib/aipify/unified-task-follow-up-engine";

type Props = { labels: Record<string, string> };

function TaskList({
  tasks,
  labels,
  onComplete,
  onReminder,
  onEscalate,
}: {
  tasks: OrganizationTask[];
  labels: Record<string, string>;
  onComplete: (task: OrganizationTask) => void;
  onReminder: (task: OrganizationTask) => void;
  onEscalate: (task: OrganizationTask) => void;
}) {
  if (tasks.length === 0) {
    return <p className="mt-2 text-sm text-gray-500">{labels.noTasks}</p>;
  }

  return (
    <ul className="mt-3 space-y-2 text-sm">
      {tasks.map((task) => (
        <li key={task.id} className="rounded border border-gray-100 p-3">
          <div className="font-medium">{task.title}</div>
          {task.description && <p className="mt-1 text-xs text-gray-600">{task.description}</p>}
          <div className="mt-1 text-xs text-gray-500">
            {task.priority} · {task.status}
            {task.due_date ? ` · ${task.due_date}` : ""}
            {task.source_type ? ` · ${task.source_type}` : ""}
          </div>
          {task.status !== "completed" && task.status !== "cancelled" && task.id && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded border px-2 py-0.5 text-xs"
                onClick={() => onComplete(task)}
              >
                {labels.completeTask}
              </button>
              <button
                type="button"
                className="rounded border px-2 py-0.5 text-xs"
                onClick={() => onReminder(task)}
              >
                {labels.scheduleReminder}
              </button>
              <button
                type="button"
                className="rounded border px-2 py-0.5 text-xs"
                onClick={() => onEscalate(task)}
              >
                {labels.escalateTask}
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function UnifiedTaskFollowUpEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<UnifiedTaskFollowUpEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/unified-task-follow-up-engine/dashboard");
    if (res.ok) setDashboard(parseUnifiedTaskFollowUpEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const taskAction = async (payload: Record<string, unknown>) => {
    setActionError(null);
    const res = await fetch("/api/aipify/unified-task-follow-up-engine/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
      return false;
    }
    await load();
    return true;
  };

  const createTask = async () => {
    setCreating(true);
    await taskAction({
      title: labels.defaultTaskTitle,
      description: labels.defaultTaskDescription,
      priority: "medium",
      due_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      source_type: "manual",
    });
    setCreating(false);
  };

  const completeTask = async (task: OrganizationTask) => {
    if (!task.id) return;
    await taskAction({ action: "complete", task_id: task.id });
  };

  const scheduleReminder = async (task: OrganizationTask) => {
    if (!task.id) return;
    await taskAction({ action: "schedule_reminder", task_id: task.id, channel: "in_app" });
  };

  const escalateTask = async (task: OrganizationTask) => {
    if (!task.id) return;
    await taskAction({
      action: "escalate",
      task_id: task.id,
      reason: labels.defaultEscalationReason,
    });
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/unified-task-follow-up-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    }
    setExporting(false);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const sections = dashboard.sections ?? {};
  const blueprint = dashboard.implementation_blueprint;
  const successCriteria = dashboard.success_criteria ?? [];
  const taskObjectives = dashboard.task_objectives ?? [];
  const priorityLevels = dashboard.priority_framework?.levels ?? [];
  const companionExamples = dashboard.companion_assistance_examples ?? [];
  const integrationLinks = dashboard.integration_links ?? [];
  const visionPhrases = dashboard.vision_phrases ?? [];
  const bellExamples = dashboard.bell_moments?.examples ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-teal-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs font-medium text-teal-900">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-1 text-xs italic text-teal-700">{dashboard.vision}</p> : null}
        <p className="mt-2 text-xs text-teal-700">{dashboard.distinction_note ?? labels.distinctionNote}</p>
        {blueprint?.phase ? (
          <p className="mt-2 text-xs font-medium text-teal-800">{blueprint.phase}</p>
        ) : null}
        {dashboard.unified_task_follow_up_engine_note ? (
          <p className="mt-1 text-xs text-teal-600">{dashboard.unified_task_follow_up_engine_note}</p>
        ) : null}
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
          disabled={creating}
          onClick={() => void createTask()}
        >
          {creating ? labels.creating : labels.createTask}
        </button>
        <button
          type="button"
          className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      {successCriteria.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {successCriteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-gray-500">{labels.myOpenTasks}</dt><dd>{String(summary.my_open_tasks ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.overdueTasks}</dt><dd>{String(summary.overdue_tasks ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.criticalTasks}</dt><dd>{String(summary.critical_tasks ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.upcomingDeadlines}</dt><dd>{String(summary.upcoming_deadlines_7d ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.completedTasks30d}</dt><dd>{String(summary.completed_tasks_30d ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.teamOpenTasks}</dt><dd>{String(summary.team_open_tasks ?? 0)}</dd></div>
        </dl>
      </section>

      {taskObjectives.length > 0 && (
        <section className="rounded-lg border border-teal-100 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.taskObjectives}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {taskObjectives.map((obj: TaskObjective) => (
              <li key={obj.key ?? obj.label}>{obj.label}</li>
            ))}
          </ul>
        </section>
      )}

      {priorityLevels.length > 0 && (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.priorityFramework}</h3>
          {dashboard.priority_framework?.principle ? (
            <p className="mt-1 text-xs text-teal-800">{dashboard.priority_framework.principle}</p>
          ) : null}
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {priorityLevels.map((level: PriorityLevel) => (
              <li key={level.key ?? level.label} className="rounded border border-teal-50 p-3 text-sm">
                <div className="font-medium">{level.label}</div>
                {level.focus ? <p className="mt-1 text-xs text-gray-600">{level.focus}</p> : null}
              </li>
            ))}
          </ul>
          {dashboard.priority_framework?.recommendation_note ? (
            <p className="mt-2 text-xs text-teal-700">{dashboard.priority_framework.recommendation_note}</p>
          ) : null}
          {dashboard.priority_framework?.priority_focus_engine_note ? (
            <p className="mt-1 text-xs text-teal-600">{dashboard.priority_framework.priority_focus_engine_note}</p>
          ) : null}
        </section>
      )}

      {companionExamples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.companionAssistance}</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {companionExamples.map((ex: CompanionAssistanceExample) => (
              <li key={ex.key ?? ex.scenario} className="rounded border border-gray-100 p-3">
                {ex.scenario ? <div className="text-xs font-medium text-gray-500">{ex.scenario}</div> : null}
                {ex.example ? <p className="mt-1 italic text-gray-700">&ldquo;{ex.example}&rdquo;</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {bellExamples.length > 0 && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.bellMoments}</h3>
          {dashboard.bell_moments?.principle ? (
            <p className="mt-1 text-xs text-amber-800">{dashboard.bell_moments.principle}</p>
          ) : null}
          <ul className="mt-2 list-inside list-disc text-sm text-amber-900">
            {bellExamples.map((ex, i) => (
              <li key={ex.key ?? i}>{ex.text}</li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.principles && dashboard.principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.principles.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
      )}

      {integrationLinks.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {integrationLinks.map((link) => (
              <li key={link.route ?? link.label}>
                {link.route ? (
                  <Link
                    href={link.route}
                    className="inline-block rounded border border-teal-200 px-2 py-1 text-xs text-teal-800 hover:bg-teal-50"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span className="text-xs text-gray-600">{link.label}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {visionPhrases.length > 0 && (
        <section className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
            {visionPhrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.myTasks}</h3>
        <TaskList
          tasks={sections.my_tasks ?? []}
          labels={labels}
          onComplete={(t) => void completeTask(t)}
          onReminder={(t) => void scheduleReminder(t)}
          onEscalate={(t) => void escalateTask(t)}
        />
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.teamTasks}</h3>
        <TaskList
          tasks={sections.team_tasks ?? []}
          labels={labels}
          onComplete={(t) => void completeTask(t)}
          onReminder={(t) => void scheduleReminder(t)}
          onEscalate={(t) => void escalateTask(t)}
        />
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.overdueTasksSection}</h3>
        <TaskList
          tasks={sections.overdue_tasks ?? []}
          labels={labels}
          onComplete={(t) => void completeTask(t)}
          onReminder={(t) => void scheduleReminder(t)}
          onEscalate={(t) => void escalateTask(t)}
        />
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.upcomingDeadlinesSection}</h3>
        <TaskList
          tasks={sections.upcoming_deadlines ?? []}
          labels={labels}
          onComplete={(t) => void completeTask(t)}
          onReminder={(t) => void scheduleReminder(t)}
          onEscalate={(t) => void escalateTask(t)}
        />
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.criticalTasksSection}</h3>
        <TaskList
          tasks={sections.critical_tasks ?? []}
          labels={labels}
          onComplete={(t) => void completeTask(t)}
          onReminder={(t) => void scheduleReminder(t)}
          onEscalate={(t) => void escalateTask(t)}
        />
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.completedTasksSection}</h3>
        <TaskList
          tasks={sections.completed_tasks ?? []}
          labels={labels}
          onComplete={(t) => void completeTask(t)}
          onReminder={(t) => void scheduleReminder(t)}
          onEscalate={(t) => void escalateTask(t)}
        />
      </section>

      {dashboard.integration_summaries && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-x-auto text-xs text-gray-600">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
