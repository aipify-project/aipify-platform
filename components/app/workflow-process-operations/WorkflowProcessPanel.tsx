"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  APPROVAL_STATUS_BADGES,
  AUTOMATION_LEVEL_BADGES,
  COMPONENT_TYPE_BADGES,
  HEALTH_STATUS_BADGES,
  WORKFLOW_PROCESS_TABS,
  WORKFLOW_STATUS_BADGES,
  parseWorkflowProcessCenter,
  type WorkflowProcessCenter,
  type WorkflowProcessLabels,
  type WorkflowProcessTab,
} from "@/lib/customer-workflow-process-operations";

type Props = {
  labels: WorkflowProcessLabels;
  backHref: string;
  initialTab?: WorkflowProcessTab;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemList({ items, labels }: { items: Record<string, unknown>[]; labels: WorkflowProcessLabels }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={String(
            item.workflow_key ?? item.template_key ?? item.automation_key ?? item.approval_key
              ?? item.component_key ?? item.step_key ?? item.bottleneck_key ?? item.pack_key ?? i
          )}
          className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm"
        >
          <p className="font-medium text-zinc-900">
            {String(
              item.workflow_name ?? item.template_name ?? item.automation_title ?? item.approval_title
                ?? item.component_title ?? item.step_title ?? item.bottleneck_title ?? item.pack_title ?? i
            )}
          </p>
          {item.summary ? <p className="mt-1 text-zinc-600">{String(item.summary)}</p> : null}
          {item.recommendation ? <p className="mt-1 text-indigo-700">{String(item.recommendation)}</p> : null}
          {item.owner_name ? <p className="mt-1 text-zinc-500">{String(item.owner_name)}</p> : null}
          {item.step_owner ? <p className="mt-1 text-zinc-500">{String(item.step_owner)}</p> : null}
          {item.approver_name ? <p className="mt-1 text-zinc-500">{String(item.approver_name)}</p> : null}
          {item.performance_score != null ? (
            <p className="mt-1 text-zinc-500">Performance: {String(item.performance_score)}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.health_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${HEALTH_STATUS_BADGES[String(item.health_status)] ?? HEALTH_STATUS_BADGES.healthy}`}>
                {labels.healthStatus[String(item.health_status) as keyof typeof labels.healthStatus] ?? String(item.health_status)}
              </span>
            ) : null}
            {item.workflow_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${WORKFLOW_STATUS_BADGES[String(item.workflow_status)] ?? WORKFLOW_STATUS_BADGES.active}`}>
                {labels.workflowStatus[String(item.workflow_status) as keyof typeof labels.workflowStatus] ?? String(item.workflow_status)}
              </span>
            ) : null}
            {item.automation_level ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${AUTOMATION_LEVEL_BADGES[String(item.automation_level)] ?? AUTOMATION_LEVEL_BADGES.assisted}`}>
                {labels.automationLevel[String(item.automation_level) as keyof typeof labels.automationLevel] ?? String(item.automation_level)}
              </span>
            ) : null}
            {item.approval_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${APPROVAL_STATUS_BADGES[String(item.approval_status)] ?? APPROVAL_STATUS_BADGES.pending}`}>
                {String(item.approval_status)}
              </span>
            ) : null}
            {item.component_type ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${COMPONENT_TYPE_BADGES[String(item.component_type)] ?? COMPONENT_TYPE_BADGES.action}`}>
                {String(item.component_type)}
              </span>
            ) : null}
            {item.workflow_id ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{String(item.workflow_id)}</span>
            ) : null}
            {item.department ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{String(item.department)}</span>
            ) : null}
            {item.governance_stage ? (
              <span className="inline-flex rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">{String(item.governance_stage)}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function WorkflowProcessPanel({ labels, backHref, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<WorkflowProcessCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<WorkflowProcessTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/workflow-process-operations");
    if (res.ok) setCenter(parseWorkflowProcessCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/workflow-process-operations/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, ...payload }),
      });
      if (res.ok) await load();
    } finally { setBusy(false); }
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;

  const overview = center.overview ?? {};
  const analytics = center.workflow_analytics ?? {};
  const executive = center.executive_dashboard ?? {};
  const companion = center.companion ?? {};
  const advisorPrompts = (companion.workflow_advisor_prompts as string[]) ?? [];
  const recommendations = center.recommendations ?? (executive.companion_recommendations as Record<string, unknown>[]) ?? [];
  const deptPerformance = (analytics.department_performance as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_workflows")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshWorkflows}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_workflow_report")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.generateWorkflowReport}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {WORKFLOW_PROCESS_TABS.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="space-y-8">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard label={labels.overview.totalWorkflows} value={Number(overview.total_workflows ?? 0)} />
            <OverviewCard label={labels.overview.activeWorkflows} value={Number(overview.active_workflows ?? 0)} />
            <OverviewCard label={labels.overview.healthyWorkflows} value={Number(overview.healthy_workflows ?? 0)} />
            <OverviewCard label={labels.overview.bottleneckWorkflows} value={Number(overview.bottleneck_workflows ?? 0)} />
            <OverviewCard label={labels.overview.openBottlenecks} value={Number(overview.open_bottlenecks ?? 0)} />
            <OverviewCard label={labels.overview.pendingApprovals} value={Number(overview.pending_approvals ?? 0)} />
            <OverviewCard label={labels.overview.delayedApprovals} value={Number(overview.delayed_approvals ?? 0)} />
            <OverviewCard label={labels.overview.automationCoverage} value={`${Number(overview.automation_coverage ?? 0)}%`} />
            <OverviewCard label={labels.overview.avgCompletionDays} value={Number(overview.avg_completion_days ?? 0)} />
            <OverviewCard label={labels.overview.failureRate} value={`${Number(overview.failure_rate ?? 0)}%`} />
          </dl>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.bottleneckDetection}</h2>
            <div className="mt-4"><ItemList items={center.bottlenecks ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "workflows" ? (
        <section className="space-y-6">
          <ItemList items={center.workflows ?? []} labels={labels} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.processMapping}</h2>
            <div className="mt-4"><ItemList items={center.process_steps ?? []} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.visualDesigner}</h2>
            <div className="mt-4"><ItemList items={center.components ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "templates" ? (
        <section><ItemList items={center.templates ?? []} labels={labels} /></section>
      ) : null}

      {tab === "automation" ? (
        <section><ItemList items={center.automations ?? []} labels={labels} /></section>
      ) : null}

      {tab === "approvals" ? (
        <section className="space-y-4">
          <ItemList items={center.approvals ?? []} labels={labels} />
          {(center.approvals ?? []).filter((a) => a.approval_status === "pending" || a.approval_status === "delayed").map((approval) => (
            <div key={String(approval.approval_key)} className="flex gap-2">
              <button type="button" disabled={busy}
                onClick={() => void runAction("grant_approval", { approval_key: approval.approval_key })}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                {labels.actions.grantApproval}
              </button>
              <button type="button" disabled={busy}
                onClick={() => void runAction("deny_approval", { approval_key: approval.approval_key })}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-800 disabled:opacity-50">
                {labels.actions.denyApproval}
              </button>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "monitoring" ? (
        <section className="space-y-6">
          <ItemList items={center.bottlenecks ?? []} labels={labels} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.crossDepartment}</h2>
            <div className="mt-4"><ItemList items={center.cross_department ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "analytics" ? (
        <section className="space-y-6">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <OverviewCard label="Avg completion (days)" value={Number(analytics.avg_completion_time_days ?? 0)} />
            <OverviewCard label="Approval delays" value={Number(analytics.approval_delays ?? 0)} />
            <OverviewCard label="Automation coverage" value={`${Number(analytics.automation_coverage ?? 0)}%`} />
          </dl>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.workflowAnalytics}</h2>
            <div className="mt-4"><ItemList items={deptPerformance} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.executiveDashboard}</h2>
            <div className="mt-4"><ItemList items={recommendations} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.businessPacks}</h2>
            <div className="mt-4"><ItemList items={center.business_packs ?? []} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.companionAdvisor}</h2>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              {advisorPrompts.map((prompt) => <li key={prompt}>· {prompt}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              {(center.audit_recent ?? []).map((entry, i) => (
                <li key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <span className="font-medium text-zinc-900">{entry.event_type}</span>
                  {entry.summary ? ` — ${entry.summary}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
