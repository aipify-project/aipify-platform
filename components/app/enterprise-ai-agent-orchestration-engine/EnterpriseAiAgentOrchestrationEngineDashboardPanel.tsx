"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/shared/AipifyLoader";
import {
  parseEnterpriseAiAgentOrchestrationCenter,
  type EnterpriseAiAgentOrchestrationCenter,
} from "@/lib/aipify/enterprise-ai-agent-orchestration-engine";

type Props = { labels: Record<string, string> };

export function EnterpriseAiAgentOrchestrationEngineDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<EnterpriseAiAgentOrchestrationCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("normal");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-ai-agent-orchestration-engine/dashboard");
    if (res.ok) {
      setCenter(parseEnterpriseAiAgentOrchestrationCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const assignTask = async () => {
    if (!taskTitle.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-ai-agent-orchestration-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "assign_task",
        task_title: taskTitle.trim(),
        priority: taskPriority,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setTaskTitle("");
      await load();
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const ops = center.operations ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
        <h2 className="text-lg font-semibold">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-slate-300">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricActiveAgents, overview.active_agents ?? 0],
            [labels.metricActiveTasks, overview.active_tasks ?? 0],
            [labels.metricRunningWorkflows, overview.running_workflows ?? 0],
            [labels.metricCompletedWorkflows, overview.completed_workflows ?? 0],
            [labels.metricPendingApprovals, overview.pending_approvals ?? 0],
            [labels.metricAutomationRate, `${overview.automation_success_rate ?? 0}%`],
            [labels.metricHealth, overview.orchestration_health_score ?? 0],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg bg-slate-800/80 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-1 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.operationsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            [labels.openAgents, ops.agents_route],
            [labels.openTeams, ops.teams_route],
            [labels.openRouting, ops.routing_route],
            [labels.openWorkflows, ops.workflows_route],
            [labels.openApprovals, ops.approvals_route],
            [labels.openIntelligence, ops.intelligence_route],
            [labels.openGovernance, ops.governance_route],
            [labels.openEvents, ops.events_route],
            [labels.openFlows, ops.flows_route],
            [labels.openRules, ops.rules_route],
            [labels.openSettings, ops.settings_route],
          ].map(([label, href]) =>
            href ? (
              <Link
                key={String(label)}
                href={href}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
              >
                {label}
              </Link>
            ) : null
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.agentsTitle}</h2>
        {(center.agents ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noAgents}</p>
        ) : (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {(center.agents ?? []).map((agent) => (
              <li key={agent.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <p className="font-medium text-gray-900">{agent.agent_name}</p>
                <p className="text-gray-600">
                  {agent.agent_type} · {agent.agent_status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.tasksTitle}</h2>
        {(center.tasks ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noTasks}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.tasks ?? []).slice(0, 8).map((task) => (
              <li key={task.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span className="font-medium text-gray-900">{task.task_title}</span>
                <span className="text-gray-600">
                  {task.task_status} · {task.priority}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.taskTitlePlaceholder}
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
          >
            <option value="low">{labels.priorityLow}</option>
            <option value="normal">{labels.priorityNormal}</option>
            <option value="high">{labels.priorityHigh}</option>
            <option value="critical">{labels.priorityCritical}</option>
          </select>
          <button
            type="button"
            disabled={creating}
            onClick={() => void assignTask()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? labels.creating : labels.addTask}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        <div className="mt-4 space-y-4">
          {(center.advisor_signals ?? []).map((sig) => (
            <article key={sig.id} className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{sig.observation}</p>
              {sig.recommendation ? (
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {labels.recommendation}: {sig.recommendation}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500">{center.abos_principle}</p>
    </div>
  );
}
