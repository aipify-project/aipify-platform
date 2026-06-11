"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseWorkflowOrchestrationEngineDashboard,
  type WorkflowOrchestrationEngineDashboard,
} from "@/lib/aipify/workflow-orchestration-engine";

type Props = { labels: Record<string, string> };

export function WorkflowOrchestrationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<WorkflowOrchestrationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/workflow-orchestration-engine/dashboard");
    if (res.ok) setDashboard(parseWorkflowOrchestrationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createFromTemplate = async (templateKey: string) => {
    setActionMessage(null);
    const res = await fetch("/api/aipify/workflow-orchestration-engine/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_key: templateKey }),
    });
    if (res.ok) {
      setActionMessage(labels.templateCreated);
      await load();
    } else {
      const err = (await res.json()) as { error?: string };
      setActionMessage(err.error ?? labels.actionFailed);
    }
  };

  const setStatus = async (workflowId: string, status: string) => {
    setActionMessage(null);
    const res = await fetch(`/api/aipify/workflow-orchestration-engine/workflows/${workflowId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setActionMessage(labels.statusUpdated);
      await load();
    } else {
      const err = (await res.json()) as { error?: string };
      setActionMessage(err.error ?? labels.actionFailed);
    }
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const workflows = (dashboard.workflows ?? []) as Array<Record<string, unknown>>;
  const templates = (dashboard.templates ?? []) as Array<Record<string, unknown>>;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.safety_note && (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.safety_note}</p>
        )}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
          {actionMessage}
        </p>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs font-medium text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => (
              <li key={pr}>{pr}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.templates}</h3>
        <p className="mt-1 text-xs text-gray-500">{labels.templatesHint}</p>
        <ul className="mt-4 space-y-3">
          {templates.map((tpl) => (
            <li
              key={String(tpl.template_key)}
              className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-gray-100 p-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{String(tpl.template_name)}</p>
                <p className="text-xs text-gray-600">{String(tpl.description)}</p>
              </div>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                onClick={() => void createFromTemplate(String(tpl.template_key))}
              >
                {labels.useTemplate}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.workflows}</h3>
        {workflows.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noWorkflows}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {workflows.map((wf) => (
              <li
                key={String(wf.id)}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{String(wf.workflow_name)}</p>
                  <p className="text-xs text-gray-500">
                    {String(wf.status)} · {String(wf.trust_level)} · {String(wf.step_count)} {labels.steps}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {wf.status === "draft" && (
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={() => void setStatus(String(wf.id), "active")}
                    >
                      {labels.activate}
                    </button>
                  )}
                  {wf.status === "active" && (
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={() => void setStatus(String(wf.id), "paused")}
                    >
                      {labels.pause}
                    </button>
                  )}
                  {wf.status === "paused" && (
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                      onClick={() => void setStatus(String(wf.id), "active")}
                    >
                      {labels.resume}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
