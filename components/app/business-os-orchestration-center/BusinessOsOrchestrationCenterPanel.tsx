"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseBusinessOsOrchestrationAction,
  parseBusinessOsOrchestrationCenter,
  type ApprovalItem,
  type AutomationItem,
  type BusinessOsOrchestrationCenter,
  type CompanionOrchestrationItem,
  type CrossSystemTask,
  type DependencyItem,
  type ExecutiveOrchestrationMetric,
  type OrchestrationSectionItem,
  type PackOrchestrationItem,
  type WorkflowItem,
  type WorkflowTemplate,
} from "@/lib/business-os-orchestration-center";
import type { BusinessOsOrchestrationCenterLabels } from "@/lib/business-os-orchestration-center/labels";
import { getAutomationRunStatusLabel } from "@/lib/business-os-orchestration-center/labels";
import { OrchestrationStatusBadge } from "./OrchestrationStatusBadge";

type Props = { labels: BusinessOsOrchestrationCenterLabels };

function SectionCard({ title, items }: { title: string; items: OrchestrationSectionItem[] }) {
  if (items.length === 0) return null;
  const item = items[0];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-1 font-semibold text-zinc-900">{item.title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      {item.metricValue ? <p className="mt-2 text-lg font-bold text-indigo-900">{item.metricLabel}: {item.metricValue}</p> : null}
    </div>
  );
}

export function BusinessOsOrchestrationCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<BusinessOsOrchestrationCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/orchestration");
    if (res.ok) setCenter(parseBusinessOsOrchestrationCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/orchestration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseBusinessOsOrchestrationAction(await res.json()).ok) await load();
    setBusy(false);
  };

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-indigo-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/app/orchestration/flows" className="text-indigo-700 hover:underline">{labels.links.legacyFlows}</Link>
            <Link href="/app/orchestration/rules" className="text-indigo-700 hover:underline">{labels.links.legacyRules}</Link>
            <Link href="/app/orchestration/events" className="text-indigo-700 hover:underline">{labels.links.legacyEvents}</Link>
            <Link href="/app/orchestration/settings" className="text-indigo-700 hover:underline">{labels.links.legacySettings}</Link>
          </div>
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      {center.executiveDashboard.length > 0 ? (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveDashboard.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.executiveDashboard.map((m: ExecutiveOrchestrationMetric) => (
              <div key={m.id} className="rounded-xl border border-indigo-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-indigo-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <SectionCard title={labels.sections.activeWorkflows} items={center.sections.activeWorkflows} />
        <SectionCard title={labels.sections.pendingApprovals} items={center.sections.pendingApprovals} />
        <SectionCard title={labels.sections.runningAutomations} items={center.sections.runningAutomations} />
        <SectionCard title={labels.sections.crossSystemTasks} items={center.sections.crossSystemTasks} />
        <SectionCard title={labels.sections.businessPackOrchestration} items={center.sections.businessPackOrchestration} />
        <SectionCard title={labels.sections.workflowTemplates} items={center.sections.workflowTemplates} />
        <SectionCard title={labels.sections.orchestrationAnalytics} items={center.sections.orchestrationAnalytics} />
      </div>

      {center.workflowOrchestration.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.workflowOrchestration.title}</h2>
          <ul className="space-y-3">
            {center.workflowOrchestration.map((w: WorkflowItem) => (
              <li key={w.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{w.workflowName}</p>
                    <p className="mt-1 text-xs text-zinc-500">{labels.owner}: {w.ownerName} · {labels.currentStep}: {w.currentStep}</p>
                    {w.stepsSummary ? <p className="mt-2 text-sm text-indigo-800">{labels.steps}: {w.stepsSummary}</p> : null}
                  </div>
                  <OrchestrationStatusBadge statusKey={w.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.approvalOrchestration.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.approvalOrchestration.title}</h2>
          <ul className="space-y-3">
            {center.approvalOrchestration.map((a: ApprovalItem) => (
              <li key={a.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{a.approvalType}</p>
                    <p className="mt-1 font-medium text-zinc-900">{a.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{labels.owner}: {a.ownerName} · {labels.deadline}: {a.deadlineLabel} · {labels.priority}: {a.priorityLevel}</p>
                  </div>
                  <OrchestrationStatusBadge statusKey={a.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("approval", a.id, "approve")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.approve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("approval", a.id, "escalate")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.escalate}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.automationRegistry.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.automationRegistry.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.automationRegistry.map((a: AutomationItem) => (
              <div key={a.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{a.automationName}</p>
                  <OrchestrationStatusBadge statusKey={a.statusKey} labels={labels.status} />
                </div>
                <p className="mt-1 text-xs text-zinc-500">{getAutomationRunStatusLabel(a.runStatus, labels.automationRegistry)} · {labels.owner}: {a.ownerName}</p>
                <p className="mt-2 text-sm text-zinc-600">{labels.lastRun}: {a.lastRunLabel} · {labels.successRate}: {a.successRateLabel}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.crossSystemActions.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.crossSystemActions.title}</h2>
          <ul className="space-y-3">
            {center.crossSystemActions.map((c: CrossSystemTask) => (
              <li key={c.id} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                <p className="text-xs font-medium uppercase text-indigo-700">{c.actionSystem}</p>
                <p className="mt-1 font-medium text-zinc-900">{c.title}</p>
                {c.summary ? <p className="mt-1 text-sm text-zinc-600">{c.summary}</p> : null}
                {c.stepsSummary ? <p className="mt-2 text-sm text-indigo-800">{labels.steps}: {c.stepsSummary}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.businessPackOrchestration.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.businessPackOrchestration.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.businessPackOrchestration.map((p: PackOrchestrationItem) => (
              <div key={p.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium capitalize text-zinc-900">{p.packKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-sm font-medium">{p.title}</p>
                {p.summary ? <p className="mt-1 text-sm text-zinc-600">{p.summary}</p> : null}
                <p className="mt-2 text-xs text-indigo-700">{labels.businessPackOrchestration.workflows}: {p.coordinatedWorkflows}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.dependencyManagement.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.dependencyManagement.title}</h2>
          <ul className="space-y-3">
            {center.dependencyManagement.map((d: DependencyItem) => (
              <li key={d.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-amber-800">{d.dependencyType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{d.title}</p>
                    {d.summary ? <p className="mt-1 text-sm text-zinc-600">{d.summary}</p> : null}
                    {d.blockerLabel ? <p className="mt-2 text-sm font-medium text-amber-900">{labels.blocker}: {d.blockerLabel}</p> : null}
                  </div>
                  <OrchestrationStatusBadge statusKey={d.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("dependency", d.id, "acknowledge")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("dependency", d.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.workflowTemplates.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.workflowTemplates.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.workflowTemplates.map((t: WorkflowTemplate) => (
              <div key={t.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{t.title}</p>
                {t.summary ? <p className="mt-1 text-sm text-zinc-600">{t.summary}</p> : null}
                {t.stepsSummary ? <p className="mt-2 text-xs text-indigo-800">{labels.steps}: {t.stepsSummary}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.companionAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionAdvisor.map((item: CompanionOrchestrationItem) => (
              <li key={item.id} className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4">
                <p className="text-xs font-medium uppercase text-indigo-700">{item.recommendationType.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-zinc-900">{item.recommendation}</p>
                {item.reason ? <p className="mt-2 text-sm text-zinc-600"><span className="font-medium">{labels.companionAdvisor.reason}:</span> {item.reason}</p> : null}
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "acknowledge")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
