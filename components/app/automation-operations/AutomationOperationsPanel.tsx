"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  AutomationExecution,
  AutomationOperationsCenter,
  AutomationOperationsLabels,
  AutomationOperationsTab,
  AutomationTemplate,
  AutomationWorkflow,
} from "@/lib/automation-operations";
import { parseAutomationOperationsCenter } from "@/lib/automation-operations/parse";

type Tab = AutomationOperationsTab;

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  needs_review: "bg-amber-50 text-amber-900 ring-amber-200",
  approval_required: "bg-orange-50 text-orange-900 ring-orange-200",
  disabled: "bg-gray-100 text-gray-600 ring-gray-200",
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  failed: "bg-red-50 text-red-900 ring-red-200",
  pending_approval: "bg-amber-50 text-amber-900 ring-amber-200",
  running: "bg-sky-50 text-sky-900 ring-sky-200",
};

type Props = {
  labels: AutomationOperationsLabels;
  initialTab?: Tab;
  titleOverride?: string;
  visibleTabs?: Tab[];
};

export function AutomationOperationsPanel({ labels, initialTab = "overview", titleOverride, visibleTabs }: Props) {
  const [center, setCenter] = useState<AutomationOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [workflowName, setWorkflowName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/automation-operations");
    if (res.ok) setCenter(parseAutomationOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/automation-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const overview = center.overview ?? {};
  const safety = center.safety_controls ?? {};
  const workflows = center.workflows ?? [];
  const triggers = center.triggers ?? [];
  const actions = center.actions ?? [];
  const conditions = center.conditions ?? {};
  const approvals = center.approvals ?? [];
  const templates = center.templates ?? [];
  const history = center.history ?? [];
  const monitoring = center.monitoring ?? {};
  const reports = center.reports ?? {};
  const companion = center.companion_insights ?? {};
  const emergencyStop = safety.emergency_stop_enabled === true;

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "workflows", label: labels.workflows },
    { id: "triggers", label: labels.triggers },
    { id: "actions", label: labels.actions },
    { id: "approvals", label: labels.approvals },
    { id: "conditions", label: labels.conditions },
    { id: "templates", label: labels.templates },
    { id: "history", label: labels.history },
    { id: "reports", label: labels.reports },
  ];
  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.id)) : allTabs;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{titleOverride ?? labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
        {center.philosophy ? <p className="mt-1 text-xs text-aipify-text-muted">{center.philosophy}</p> : null}
      </header>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={
              tab === item.id
                ? `${AipifyShellClasses.primaryButton} text-sm`
                : `${AipifyShellClasses.secondaryButton} text-sm`
            }
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <>
          {emergencyStop ? (
            <div className={`${AipifyShellClasses.surfaceCard} border-l-4 border-red-500 p-4 text-sm text-red-900`}>
              {labels.emergencyStop} — automation execution paused.
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                [labels.activeWorkflows, overview.active_workflows],
                [labels.draftWorkflows, overview.draft_workflows],
                [labels.approvalRequired, overview.approval_required],
                [labels.executions7d, overview.executions_7d],
                [labels.successRate, overview.success_rate != null ? `${overview.success_rate}%` : undefined],
                [labels.templatesAvailable, overview.templates_available],
                [labels.needsReview, overview.needs_review],
                [labels.disabledWorkflows, overview.disabled_workflows],
              ] as [string, string | number | undefined][]
            ).map(([label, value]) => (
              <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy || emergencyStop} onClick={() => void runAction("set_emergency_stop", { enabled: !emergencyStop })} className={emergencyStop ? AipifyShellClasses.primaryButton : AipifyShellClasses.secondaryButton}>
              {emergencyStop ? labels.resumeAutomation : labels.emergencyStop}
            </button>
          </div>
          <section className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.safetyControls}</h2>
            <ul className="mt-2 space-y-1 text-aipify-text-secondary">
              <li>{labels.approvalAware}</li>
              <li>Max executions/hour: {String(safety.max_executions_per_hour ?? "—")}</li>
              <li>Max notifications/workflow: {String(safety.max_notifications_per_workflow ?? "—")}</li>
            </ul>
          </section>
          {companion ? (
            <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <h2 className="text-sm font-semibold text-aipify-text">{labels.companionInsights}</h2>
              {Array.isArray(companion.active_automations) && (companion.active_automations as Record<string, unknown>[]).length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm text-aipify-text-secondary">
                  {(companion.active_automations as Record<string, unknown>[]).map((row, i) => (
                    <li key={i}>{String(row.name ?? "")} · {String(row.trigger_type ?? "").replace(/_/g, " ")}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}
          <p className="text-sm text-aipify-text-secondary">
            {labels.approvals}:{" "}
            <Link href="/app/approvals" className="text-aipify-accent underline">/app/approvals</Link>
          </p>
        </>
      ) : null}

      {tab === "workflows" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} placeholder={labels.workflowName} className={AipifyShellClasses.input} />
            <button type="button" disabled={busy || !workflowName.trim()} onClick={() => void runAction("create_workflow", { name: workflowName.trim() }).then(() => setWorkflowName(""))} className={AipifyShellClasses.primaryButton}>
              {labels.createWorkflow}
            </button>
          </div>
          {workflows.length === 0 ? (
            <PlatformEmptyState title={labels.noWorkflows} message={labels.emptyHint} />
          ) : (
            workflows.map((wf: AutomationWorkflow) => (
              <div key={wf.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-aipify-text-muted">{wf.workflow_number ?? wf.id.slice(0, 8)}</p>
                    <h3 className="font-semibold text-aipify-text">{wf.name}</h3>
                    <p className="capitalize text-aipify-text-secondary">{wf.trigger_type.replace(/_/g, " ")} · {wf.execution_count ?? 0} runs</p>
                    {wf.description ? <p className="mt-1 text-aipify-text-secondary">{wf.description}</p> : null}
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[wf.status] ?? STATUS_STYLE.draft}`}>
                    {wf.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {wf.status === "draft" ? (
                    <button type="button" disabled={busy || emergencyStop} onClick={() => void runAction("activate_workflow", { workflow_id: wf.id })} className={AipifyShellClasses.primaryButton}>
                      {labels.activateWorkflow}
                    </button>
                  ) : null}
                  {wf.status === "active" || wf.status === "approval_required" ? (
                    <>
                      <button type="button" disabled={busy || emergencyStop} onClick={() => void runAction("execute_workflow", { workflow_id: wf.id })} className={AipifyShellClasses.primaryButton}>
                        {labels.executeWorkflow}
                      </button>
                      <button type="button" disabled={busy} onClick={() => void runAction("disable_workflow", { workflow_id: wf.id })} className={AipifyShellClasses.secondaryButton}>
                        {labels.disableWorkflow}
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "triggers" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {triggers.map((tr) => (
            <div key={tr.key} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h3 className="font-semibold text-aipify-text">{tr.label}</h3>
              <p className="text-xs text-aipify-text-muted">{tr.key}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "actions" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((act) => (
            <div key={act.key} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h3 className="font-semibold text-aipify-text">{act.label}</h3>
              <p className="text-xs text-aipify-text-muted">{act.key}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "approvals" ? (
        <div className="space-y-4">
          <p className="text-sm text-aipify-text-secondary">{labels.approvalAware}</p>
          {approvals.length === 0 ? (
            <PlatformEmptyState title={labels.noApprovals} message={labels.emptyHint} />
          ) : (
            approvals.map((item, i) => (
              <div key={String(item.execution_id ?? i)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{String(item.execution_number ?? "")}</p>
                <p className="capitalize text-aipify-text-secondary">{String(item.status ?? "").replace(/_/g, " ")}</p>
                <button type="button" disabled={busy} onClick={() => void runAction("grant_approval", { execution_id: item.execution_id })} className={`mt-3 ${AipifyShellClasses.primaryButton}`}>
                  {labels.grantApproval}
                </button>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "conditions" ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <h2 className="font-semibold text-aipify-text">{labels.conditions}</h2>
          {Array.isArray(conditions.operators) ? (
            <p className="mt-2 text-aipify-text-secondary">Operators: {(conditions.operators as string[]).join(", ")}</p>
          ) : null}
          {conditions.example ? <p className="mt-2 text-aipify-text-secondary">{String(conditions.example)}</p> : null}
          {conditions.supports_nested === true ? <p className="mt-1 text-aipify-text-muted">Nested conditions supported.</p> : null}
        </section>
      ) : null}

      {tab === "templates" ? (
        <div className="space-y-4">
          {templates.length === 0 ? (
            <PlatformEmptyState title={labels.noTemplates} message={labels.emptyHint} />
          ) : (
            templates.map((tpl: AutomationTemplate) => (
              <div key={tpl.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted capitalize">{tpl.category.replace(/_/g, " ")}</p>
                <h3 className="font-semibold text-aipify-text">{tpl.title}</h3>
                {tpl.description ? <p className="mt-1 text-aipify-text-secondary">{tpl.description}</p> : null}
                <p className="mt-1 capitalize text-aipify-text-muted">{tpl.trigger_type.replace(/_/g, " ")}{tpl.business_pack_key ? ` · ${tpl.business_pack_key}` : ""}</p>
                <button type="button" disabled={busy} onClick={() => void runAction("create_from_template", { template_id: tpl.id })} className={`mt-3 ${AipifyShellClasses.primaryButton}`}>
                  {labels.createFromTemplate}
                </button>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "history" ? (
        <div className="space-y-4">
          {history.length === 0 ? (
            <PlatformEmptyState title={labels.noHistory} message={labels.emptyHint} />
          ) : (
            history.map((ex: AutomationExecution) => (
              <div key={ex.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-aipify-text-muted">{ex.execution_number ?? ex.id.slice(0, 8)}</p>
                    {ex.result_summary ? <p className="text-aipify-text-secondary">{ex.result_summary}</p> : null}
                    {ex.error_message ? <p className="text-red-700">{ex.error_message}</p> : null}
                    {ex.duration_ms != null ? <p className="text-aipify-text-muted">{ex.duration_ms}ms</p> : null}
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[ex.status] ?? STATUS_STYLE.running}`}>
                    {ex.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className="space-y-4">
          <section className={`${AipifyShellClasses.surfaceCard} space-y-2 p-4 text-sm`}>
            <p>{labels.workflows}: {String(reports.workflow_usage ?? 0)}</p>
            <p>{labels.history}: {String(reports.execution_volume ?? 0)} executions</p>
            <p>{labels.failedExecutions}: {String(reports.failure_rate ?? 0)}% failure rate</p>
          </section>
          <section className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.monitoring}</h2>
            <ul className="mt-2 space-y-1 text-aipify-text-secondary">
              <li>Executions: {String(monitoring.executions ?? 0)}</li>
              <li>Successes: {String(monitoring.successes ?? 0)}</li>
              <li>Failures: {String(monitoring.failures ?? 0)}</li>
              <li>{labels.pendingApprovals}: {String(monitoring.pending_approval ?? 0)}</li>
              <li>{labels.successRate}: {String(monitoring.success_rate ?? 100)}%</li>
            </ul>
          </section>
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
          <h2 className="text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <ul className="mt-3 space-y-1 text-xs text-aipify-text-secondary">
            {center.audit_recent.slice(0, 10).map((entry, i) => (
              <li key={i}>{entry.summary} · {entry.created_at ? new Date(entry.created_at).toLocaleString() : ""}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
