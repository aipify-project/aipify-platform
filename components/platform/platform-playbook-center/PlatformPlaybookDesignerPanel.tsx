"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FLOW_NODES,
  DESIGNER_TRIGGER_TYPES,
  PLAYBOOK_PRIORITIES,
  PLAYBOOK_CATEGORIES,
  STATUS_BADGES,
  PRIORITY_BADGES,
  OUTCOME_BADGES,
  type DesignerSurface,
} from "@/lib/platform-playbook-center/constants";
import {
  parsePlatformPlaybookDesigner,
  formatDuration,
  type PlatformPlaybookCenterLabels,
  type PlatformPlaybookDesigner,
  type Playbook,
  type PlaybookCondition,
  type PlaybookApprovalCheckpoint,
} from "@/lib/platform-playbook-center";

type PlatformPlaybookDesignerPanelProps = {
  playbookId?: string;
  surface: DesignerSurface;
  labels: PlatformPlaybookCenterLabels;
  backHref: string;
};

function FlowNode({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xs rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-center text-sm font-medium text-indigo-900">
        {label}
      </div>
      <div className="my-1 text-indigo-300" aria-hidden>
        ↓
      </div>
    </div>
  );
}

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

export function PlatformPlaybookDesignerPanel({
  playbookId,
  surface,
  labels,
  backHref,
}: PlatformPlaybookDesignerPanelProps) {
  const [designer, setDesigner] = useState<PlatformPlaybookDesigner | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Playbook>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ surface });
    if (playbookId) params.set("playbook_id", playbookId);
    const res = await fetch(`/api/platform-playbook-center/designer?${params}`);
    if (res.ok) {
      const parsed = parsePlatformPlaybookDesigner(await res.json());
      setDesigner(parsed);
      if (parsed?.playbook) setForm(parsed.playbook);
    }
    setLoading(false);
  }, [playbookId, surface]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = useCallback(
    async (payload: Record<string, unknown>) => {
      setBusy(true);
      setTestMessage(null);
      try {
        const res = await fetch("/api/platform-playbook-center/designer/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, surface, playbook_id: playbookId }),
        });
        if (res.ok) {
          const parsed = parsePlatformPlaybookDesigner(await res.json());
          setDesigner(parsed);
          if (parsed?.playbook) setForm(parsed.playbook);
          if (parsed?.test_result?.message) setTestMessage(parsed.test_result.message);
        }
      } finally {
        setBusy(false);
      }
    },
    [playbookId, surface]
  );

  const saveDesigner = () => {
    if (!playbookId || !form) return;
    void handleAction({
      action: "save_designer",
      name: form.name,
      description: form.description,
      owner: form.owner,
      department: form.department,
      priority: form.priority,
      category: form.category,
      trigger_type: form.trigger_type,
      completion_rule: form.completion_rule,
      condition_summary: form.condition_summary,
      requires_approval: form.requires_approval,
      notification_config: form.notification_config,
      conditions: form.conditions ?? [],
      approvals: form.approvals ?? [],
    });
  };

  if (loading && !designer) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-72 rounded-lg bg-gray-100" />
          <div className="h-48 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!designer?.has_access) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p className="text-sm text-gray-600">{labels.emptyState}</p>
        <Link href={backHref} className="mt-4 inline-block text-sm text-indigo-600">← {labels.back}</Link>
      </div>
    );
  }

  const pb = designer.playbook;
  const isSuper = surface === "super";

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <header>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">
          {pb ? pb.name : isSuper ? labels.superAdmin.title : labels.designer.title}
        </h1>
        <p className="mt-2 text-sm text-gray-600">{labels.designer.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm text-indigo-900">
          {designer.principle}
        </p>
      </header>

      {isSuper && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.superAdmin.analyzeAdoption}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-xs text-gray-500">{labels.superAdmin.totalPlaybooks}</dt>
              <dd className="text-2xl font-semibold">{designer.super.total_playbooks}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.overview.activePlaybooks}</dt>
              <dd className="text-2xl font-semibold">{designer.super.active_playbooks}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.superAdmin.reviewFailures}</dt>
              <dd className="text-2xl font-semibold">{designer.super.failed_executions_7d}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.superAdmin.templatesPublished}</dt>
              <dd className="text-2xl font-semibold">{designer.super.templates_published}</dd>
            </div>
          </dl>
        </section>
      )}

      {!playbookId && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.templates}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {designer.templates.map((t) => (
              <Link
                key={t.id}
                href={isSuper ? `/super/playbooks/${t.id}/designer` : `/platform/operations/playbooks/${t.id}/designer`}
                className="rounded-xl border border-gray-100 p-4 hover:border-indigo-200 hover:bg-indigo-50/30"
              >
                <p className="font-medium text-gray-900">{t.name}</p>
                <p className="mt-1 text-xs text-gray-500">{labels.categories[t.category]}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {pb && (
        <>
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.visualFlow}</h2>
            <div className="mt-6 flex flex-col items-center py-4">
              {FLOW_NODES.map((node, i) => (
                <div key={node} className="flex flex-col items-center">
                  <FlowNode label={labels.flowNodes[node]} />
                  {i === FLOW_NODES.length - 1 ? null : null}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.fieldSettings}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="text-xs text-gray-500">{labels.table.name}</span>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  value={form.name ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                <span className="text-xs text-gray-500">{labels.table.owner}</span>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  value={form.owner ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                <span className="text-xs text-gray-500">{labels.table.department}</span>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  value={form.department ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                <span className="text-xs text-gray-500">{labels.table.priority}</span>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  value={form.priority ?? "normal"}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Playbook["priority"] }))}
                >
                  {PLAYBOOK_PRIORITIES.map((p) => (
                    <option key={p} value={p}>{labels.priorities[p]}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="text-xs text-gray-500">{labels.table.category}</span>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  value={form.category ?? "support_operations"}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Playbook["category"] }))}
                >
                  {PLAYBOOK_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{labels.categories[c]}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="text-xs text-gray-500">{labels.table.triggerType}</span>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  value={form.trigger_type ?? "manual_start"}
                  onChange={(e) => setForm((f) => ({ ...f, trigger_type: e.target.value as Playbook["trigger_type"] }))}
                >
                  {DESIGNER_TRIGGER_TYPES.map((tt) => (
                    <option key={tt} value={tt}>{labels.triggerTypes[tt]}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="mt-4 block text-sm">
              <span className="text-xs text-gray-500">{labels.table.description}</span>
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                rows={3}
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusPill label={labels.statuses[pb.status]} className={STATUS_BADGES[pb.status]} />
              <StatusPill label={labels.priorities[pb.priority]} className={PRIORITY_BADGES[pb.priority]} />
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.conditions}</h2>
            <p className="mt-1 text-xs text-gray-500">{labels.designer.ifLabel} … {labels.designer.thenLabel}</p>
            <ul className="mt-4 space-y-2">
              {(form.conditions ?? []).map((c, idx) => (
                <li key={c.id ?? idx} className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-100 p-3 text-sm">
                  <span className="font-medium text-gray-700">{labels.designer.ifLabel}</span>
                  <span>{labels.conditions[c.condition_key]}</span>
                  <span className="font-medium text-gray-700">{labels.designer.thenLabel}</span>
                  <span className="text-gray-600">{labels.designer.completionRules}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-3 rounded-lg border border-gray-200 px-3 py-1.5 text-xs hover:bg-gray-50"
              onClick={() => {
                const next: PlaybookCondition = {
                  id: `new-${Date.now()}`,
                  condition_key: "customer_plan_enterprise",
                  operator: "equals",
                  condition_value: "enterprise",
                  sort_order: (form.conditions?.length ?? 0) + 1,
                };
                setForm((f) => ({ ...f, conditions: [...(f.conditions ?? []), next] }));
              }}
            >
              {labels.designer.addCondition}
            </button>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.approvalRequirements}</h2>
            <ul className="mt-4 space-y-2">
              {(form.approvals ?? pb.approvals).map((a, idx) => (
                <li key={a.id ?? idx} className="rounded-lg border border-gray-100 p-3 text-sm">
                  <span className="font-medium">{labels.approvalRoles[a.approval_role]}</span>
                  {a.label ? <span className="text-gray-600"> — {a.label}</span> : null}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-3 rounded-lg border border-gray-200 px-3 py-1.5 text-xs hover:bg-gray-50"
              onClick={() => {
                const next: PlaybookApprovalCheckpoint = {
                  id: `new-${Date.now()}`,
                  approval_role: "platform_admin",
                  label: "Approval checkpoint",
                  step_order: (form.approvals?.length ?? 0) + 1,
                };
                setForm((f) => ({ ...f, approvals: [...(f.approvals ?? []), next] }));
              }}
            >
              {labels.designer.addApproval}
            </button>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.steps}</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700">
              {pb.steps.map((step) => (
                <li key={step.id}>
                  <span className="font-medium">{labels.stepActions[step.action_type]}</span>
                  {step.label ? ` — ${step.label}` : null}
                </li>
              ))}
            </ol>
            <label className="mt-4 block text-sm">
              <span className="text-xs text-gray-500">{labels.designer.completionRules}</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                value={form.completion_rule ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, completion_rule: e.target.value }))}
              />
            </label>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.triggers}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(["on_start", "on_approval", "on_complete", "on_failure"] as const).map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.notification_config?.[key] ?? true}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        notification_config: {
                          on_start: f.notification_config?.on_start ?? true,
                          on_approval: f.notification_config?.on_approval ?? true,
                          on_complete: f.notification_config?.on_complete ?? true,
                          on_failure: f.notification_config?.on_failure ?? true,
                          [key]: e.target.checked,
                        },
                      }))
                    }
                  />
                  {labels.notifications[key === "on_start" ? "onStart" : key === "on_approval" ? "onApproval" : key === "on_complete" ? "onComplete" : "onFailure"]}
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-6">
            <h2 className="font-semibold text-indigo-950">{labels.testMode.title}</h2>
            <p className="mt-2 text-sm text-indigo-900">{labels.testMode.description}</p>
            {testMessage ? (
              <p className="mt-3 rounded-lg bg-white px-4 py-3 text-sm text-green-800">{testMessage}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                onClick={() => void handleAction({ action: "test_playbook", started_by: "Designer" })}
              >
                {labels.actions.runTest}
              </button>
              <button
                type="button"
                disabled={busy}
                className="rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm text-indigo-900 disabled:opacity-50"
                onClick={saveDesigner}
              >
                {busy ? labels.actions.applying : labels.actions.saveDesigner}
              </button>
              {isSuper && (
                <>
                  <button
                    type="button"
                    disabled={busy}
                    className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
                    onClick={() => void handleAction({ action: "publish_template" })}
                  >
                    {labels.actions.publishTemplate}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    className="rounded-lg border px-4 py-2 text-sm text-red-700 disabled:opacity-50"
                    onClick={() => void handleAction({ action: "disable_workflow" })}
                  >
                    {labels.superAdmin.disableWorkflow}
                  </button>
                </>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.executionHistory}</h2>
            {designer.executions.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
            ) : (
              <div className="mt-4 space-y-4">
                {designer.executions.map((exec) => (
                  <article key={exec.id} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span><strong>{labels.table.startedBy}:</strong> {exec.started_by || exec.owner || "—"}</span>
                      <span><strong>{labels.table.startTime}:</strong> {new Date(exec.executed_at).toLocaleString()}</span>
                      <span><strong>{labels.table.currentStatus}:</strong> {labels.executionStatuses[exec.current_status]}</span>
                      <span><strong>{labels.table.completedSteps}:</strong> {exec.completed_steps}</span>
                      <span><strong>{labels.table.failedSteps}:</strong> {exec.failed_steps}</span>
                      {exec.completed_at ? (
                        <span><strong>{labels.table.completionTime}:</strong> {new Date(exec.completed_at).toLocaleString()}</span>
                      ) : null}
                    </div>
                    {exec.steps.length > 0 && (
                      <ul className="mt-3 space-y-1 text-xs text-gray-600">
                        {exec.steps.map((step) => (
                          <li key={step.id} className="flex flex-wrap items-center gap-2">
                            <span>{step.step_label}</span>
                            <StatusPill
                              label={step.step_status}
                              className={
                                step.step_status === "completed"
                                  ? OUTCOME_BADGES.successful
                                  : step.step_status === "failed"
                                    ? OUTCOME_BADGES.failed
                                    : "bg-gray-100 text-gray-700 ring-gray-200"
                              }
                            />
                            {step.step_status === "failed" && (
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  className="rounded border px-1.5 py-0.5 text-xs"
                                  onClick={() => void handleAction({ action: "retry_step", step_id: step.id })}
                                >
                                  {labels.errorHandling.retry}
                                </button>
                                <button
                                  type="button"
                                  className="rounded border px-1.5 py-0.5 text-xs"
                                  onClick={() => void handleAction({ action: "skip_step", step_id: step.id })}
                                >
                                  {labels.errorHandling.skip}
                                </button>
                                <button
                                  type="button"
                                  className="rounded border px-1.5 py-0.5 text-xs"
                                  onClick={() => void handleAction({ action: "escalate_step", step_id: step.id })}
                                >
                                  {labels.errorHandling.escalate}
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-2 text-xs text-gray-500">{formatDuration(exec.duration_seconds)}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        <ul className="mt-4 divide-y divide-gray-100">
          {designer.audit.map((entry) => (
            <li key={entry.id} className="py-3 text-sm">
              <p className="text-gray-900">{entry.summary}</p>
              <p className="mt-1 text-xs text-gray-500">{entry.event_type} · {new Date(entry.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
