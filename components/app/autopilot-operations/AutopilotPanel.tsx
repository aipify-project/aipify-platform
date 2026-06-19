"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  AUTOPILOT_TABS,
  CONFIDENCE_BADGES,
  POLICY_CATEGORY_BADGES,
  QUEUE_STATUS_BADGES,
  SIGNAL_STATUS_BADGES,
  WORKFLOW_STATUS_BADGES,
  parseAutopilotCenter,
  type AutopilotCenter,
  type AutopilotLabels,
  type AutopilotQueueItem,
  type AutopilotTab,
} from "@/lib/customer-autopilot-operations";

type Props = {
  labels: AutopilotLabels;
  backHref: string;
  initialTab?: AutopilotTab;
  visibleTabs?: AutopilotTab[];
  titleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function JsonList({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-900">
            {String(
              item.policy_title ?? item.rule_title ?? item.chain_title ?? item.action_title
                ?? item.queue_title ?? item.workflow_title ?? item.schedule_title
                ?? item.signal_title ?? item.boundary_title ?? i
            )}
          </p>
          {item.summary ? <p className="mt-1 text-zinc-600">{String(item.summary)}</p> : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.policy_category ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${POLICY_CATEGORY_BADGES[String(item.policy_category)] ?? POLICY_CATEGORY_BADGES.approval_required}`}>
                {String(item.policy_category)}
              </span>
            ) : null}
            {item.queue_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${QUEUE_STATUS_BADGES[String(item.queue_status)] ?? QUEUE_STATUS_BADGES.pending_approval}`}>
                {String(item.queue_status)}
              </span>
            ) : null}
            {item.confidence_level ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${CONFIDENCE_BADGES[String(item.confidence_level)] ?? CONFIDENCE_BADGES.moderate}`}>
                {String(item.confidence_level)}
              </span>
            ) : null}
            {item.workflow_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${WORKFLOW_STATUS_BADGES[String(item.workflow_status)] ?? WORKFLOW_STATUS_BADGES.available}`}>
                {String(item.workflow_status)}
              </span>
            ) : null}
            {item.signal_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${SIGNAL_STATUS_BADGES[String(item.signal_status)] ?? SIGNAL_STATUS_BADGES.monitoring}`}>
                {String(item.signal_status)}
              </span>
            ) : null}
            {item.pre_approved === true ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">pre-approved</span>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
}

function QueueCard({ item, labels, busy, onApprove, onDeny }: {
  item: AutopilotQueueItem; labels: AutopilotLabels; busy: boolean;
  onApprove: (key: string) => void; onDeny: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <JsonList items={[item as unknown as Record<string, unknown>]} />
      {item.queue_status === "pending_approval" ? (
        <div className="mt-3 flex gap-2">
          <button type="button" disabled={busy} onClick={() => onApprove(item.queue_key)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
            {labels.actions.approveQueueItem}
          </button>
          <button type="button" disabled={busy} onClick={() => onDeny(item.queue_key)}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
            {labels.actions.denyQueueItem}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function AutopilotPanel({ labels, backHref, initialTab = "overview", visibleTabs, titleOverride }: Props) {
  const tabs = visibleTabs ?? AUTOPILOT_TABS;
  const [center, setCenter] = useState<AutopilotCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<AutopilotTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/autopilot-operations");
    if (res.ok) setCenter(parseAutopilotCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/autopilot-operations/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
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
  const profile = String(overview.autopilot_profile ?? center.settings?.autopilot_profile ?? "balanced");
  const advisorPrompts = (center.integrations?.autopilot_profiles ? Object.keys(center.integrations.autopilot_profiles as object) : []) as string[];
  const recommendations = (center.reports?.companion_recommendations as Record<string, unknown>[]) ?? [];
  const insights = center.insights ?? {};

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_autopilot")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshAutopilot}
        </button>
        <Link href="/app/autopilot/workflows" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openWorkflows}</Link>
        <Link href="/app/approvals" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openApprovals}</Link>
        <Link href="/app/proactive" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openProactive}</Link>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-zinc-600">{labels.overview.autopilotProfile}</p>
        <p className="mt-1 text-lg font-semibold text-zinc-900">{labels.profiles[profile as keyof typeof labels.profiles] ?? profile}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.activePolicies} value={Number(overview.active_policies ?? 0)} />
          <OverviewCard label={labels.overview.automationRulesActive} value={Number(overview.automation_rules_active ?? 0)} />
          <OverviewCard label={labels.overview.preparedActionsReady} value={Number(overview.prepared_actions_ready ?? 0)} />
          <OverviewCard label={labels.overview.pendingApprovals} value={Number(overview.pending_approvals ?? 0)} />
          <OverviewCard label={labels.overview.executionInProgress} value={Number(overview.execution_in_progress ?? 0)} />
          <OverviewCard label={labels.overview.activeWorkflows} value={Number(overview.active_workflows ?? 0)} />
          <OverviewCard label={labels.overview.watchtowerAlerts} value={Number(overview.watchtower_alerts ?? 0)} />
          <OverviewCard label={labels.overview.policyCompliancePct} value={`${Number(overview.policy_compliance_pct ?? 0)}%`} />
          <OverviewCard label={labels.overview.timeSavedHours} value={Number(overview.time_saved_hours ?? 0)} />
        </dl>
      ) : null}

      {tab === "policies" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("create_policy", { policy_title: "New Policy" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.createPolicy}
          </button>
          <JsonList items={center.policies ?? []} />
        </section>
      ) : null}

      {tab === "automation_rules" ? (
        <section><JsonList items={center.automation_rules ?? []} /></section>
      ) : null}

      {tab === "approval_chains" ? (
        <section><JsonList items={center.approval_chains ?? []} /></section>
      ) : null}

      {tab === "prepared_actions" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("generate_prepared_action", { action_title: "Prepared Action" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.generatePreparedAction}
          </button>
          <JsonList items={center.prepared_actions ?? []} />
        </section>
      ) : null}

      {tab === "execution_queue" ? (
        <section className="space-y-3">
          {(center.execution_queue ?? []).map((item) => (
            <QueueCard key={item.queue_key} item={item} labels={labels} busy={busy}
              onApprove={(key) => void runAction("approve_queue_item", { queue_key: key })}
              onDeny={(key) => void runAction("deny_queue_item", { queue_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "insights" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.watchtower}</h2>
            <div className="mt-4"><JsonList items={center.watchtower ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.boundaries}</h2>
            <div className="mt-4"><JsonList items={center.boundaries ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.smartScheduling}</h2>
            <div className="mt-4"><JsonList items={center.schedules ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.confidenceEngine}</h2>
            <div className="mt-4"><JsonList items={(insights.decision_packs as Record<string, unknown>[]) ?? []} /></div>
          </div>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <JsonList items={recommendations} />
        </section>
      ) : null}

      {(center.workflows ?? []).length && tab === "insights" ? (
        <section>
          <h2 className="font-semibold text-zinc-900">{labels.workflowsTitle}</h2>
          <div className="mt-4 space-y-3">
            {(center.workflows ?? []).map((wf) => (
              <div key={String(wf.workflow_key)}>
                <JsonList items={[wf]} />
                {wf.workflow_status === "available" ? (
                  <button type="button" disabled={busy}
                    onClick={() => void runAction("activate_workflow", { workflow_key: wf.workflow_key })}
                    className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                    {labels.actions.activateWorkflow}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.executive_dashboard ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
        </section>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.companionAdvisor}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
          {["What prepared actions are ready?", "What approvals are pending?", "What workflows are active?", "What boundaries apply?"].map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      {(center.audit_recent ?? []).length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            {(center.audit_recent ?? []).map((entry, i) => (
              <li key={i}>{entry.summary || entry.event_type}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
