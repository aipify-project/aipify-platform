"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseRealWorldActionsExecutionAction,
  parseRealWorldActionsExecutionCenter,
  type ActionHistoryItem,
  type ActionInstance,
  type ActionProvider,
  type ActionRegistryItem,
  type ActionSectionItem,
  type CompanionActionRequest,
  type ExecutiveActionMetric,
  type RealWorldActionsExecutionCenter,
} from "@/lib/real-world-actions-execution-center";
import type { RealWorldActionsExecutionCenterLabels } from "@/lib/real-world-actions-execution-center/labels";
import { ActionExecutionStatusBadge } from "./ActionExecutionStatusBadge";
import { RiskLevelBadge } from "./RiskLevelBadge";

type Props = { labels: RealWorldActionsExecutionCenterLabels };

function SectionCard({ title, items }: { title: string; items: ActionSectionItem[] }) {
  if (items.length === 0) return null;
  const item = items[0];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-1 font-semibold text-zinc-900">{item.title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      {item.metricValue ? <p className="mt-2 text-lg font-bold text-rose-900">{item.metricLabel}: {item.metricValue}</p> : null}
    </div>
  );
}

function InstanceList({
  items,
  labels,
  canManage,
  busy,
  onAction,
}: {
  items: ActionInstance[];
  labels: RealWorldActionsExecutionCenterLabels;
  canManage: boolean;
  busy: boolean;
  onAction: (id: string, action: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-zinc-900">{item.actionName}</p>
              <p className="mt-1 text-xs text-zinc-500 capitalize">
                {labels.category}: {item.actionCategory.replace(/_/g, " ")} · {labels.provider}: {item.providerName}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                {labels.owner}: {item.ownerName} · {labels.stage}: {item.executionStage.replace(/_/g, " ")}
                {item.costLabel && item.costLabel !== "—" ? ` · ${labels.cost}: ${item.costLabel}` : null}
              </p>
              {item.resultLabel ? <p className="mt-1 text-sm text-zinc-600">{labels.result}: {item.resultLabel}</p> : null}
            </div>
            <div className="flex flex-col items-end gap-2">
              <RiskLevelBadge risk={item.riskLevel} labels={labels.risk} />
              <ActionExecutionStatusBadge statusKey={item.statusKey} labels={labels.status} />
            </div>
          </div>
          {canManage && item.executionStage !== "completed" && item.executionStage !== "failed" ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" disabled={busy} onClick={() => onAction(item.id, "approve")} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.approve}</button>
              <button type="button" disabled={busy} onClick={() => onAction(item.id, "reject")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.reject}</button>
              <button type="button" disabled={busy} onClick={() => onAction(item.id, "escalate")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.escalate}</button>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function RealWorldActionsExecutionCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<RealWorldActionsExecutionCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/actions/execution");
    if (res.ok) setCenter(parseRealWorldActionsExecutionCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/actions/execution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseRealWorldActionsExecutionAction(await res.json()).ok) await load();
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
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-rose-900">{center.governanceNote}</p> : null}
          {center.executionWorkflow ? <p className="mt-2 text-xs text-zinc-600">{labels.executionWorkflow}: {center.executionWorkflow}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/app/actions/inbox" className="text-rose-700 hover:underline">{labels.links.legacyInbox}</Link>
            <Link href="/app/actions/settings" className="text-rose-700 hover:underline">{labels.links.legacySettings}</Link>
            <Link href="/app/approvals" className="text-rose-700 hover:underline">{labels.links.approvals}</Link>
            <Link href="/app/action-center" className="text-rose-700 hover:underline">{labels.links.actionCenter}</Link>
          </div>
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.enterpriseControls.title}</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-700">
          <span>{center.enterpriseControls.actionsEnabled ? labels.enterpriseControls.enabled : labels.enterpriseControls.disabled}</span>
          {center.enterpriseControls.multiLevelApprovalsRequired ? <span>{labels.enterpriseControls.multiLevel}</span> : null}
        </div>
      </section>

      {center.executiveDashboard.length > 0 ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveDashboard.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.executiveDashboard.map((m: ExecutiveActionMetric) => (
              <div key={m.id} className="rounded-xl border border-rose-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-rose-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SectionCard title={labels.sections.availableActions} items={center.sections.availableActions} />
        <SectionCard title={labels.sections.pendingActions} items={center.sections.pendingActions} />
        <SectionCard title={labels.sections.approvedActions} items={center.sections.approvedActions} />
        <SectionCard title={labels.sections.completedActions} items={center.sections.completedActions} />
        <SectionCard title={labels.sections.failedActions} items={center.sections.failedActions} />
        <SectionCard title={labels.sections.actionHistory} items={center.sections.actionHistory} />
      </div>

      {center.actionRegistry.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.actionRegistry.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.actionRegistry.map((r: ActionRegistryItem) => (
              <div key={r.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{r.actionName}</p>
                  <RiskLevelBadge risk={r.riskLevel} labels={labels.risk} />
                </div>
                <p className="mt-1 text-xs capitalize text-zinc-500">{labels.category}: {r.actionCategory.replace(/_/g, " ")}</p>
                <p className="mt-1 text-sm text-zinc-600">{labels.provider}: {r.providerName}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {r.approvalRequired ? labels.approvalRequired : "—"}
                </p>
                <div className="mt-2">
                  <ActionExecutionStatusBadge statusKey={r.statusKey} labels={labels.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.pendingActions.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.approvalEngine.title}</h2>
          <InstanceList items={center.pendingActions} labels={labels} canManage={!!center.canManage} busy={busy} onAction={(id, action) => void handleAction("instance", id, action)} />
        </section>
      ) : null}

      {center.approvedActions.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.sections.approvedActions}</h2>
          <InstanceList items={center.approvedActions} labels={labels} canManage={false} busy={busy} onAction={() => {}} />
        </section>
      ) : null}

      {center.actionProviders.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.actionProviders.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.actionProviders.map((p: ActionProvider) => (
              <div key={p.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{p.providerName}</p>
                <p className="mt-1 text-xs capitalize text-zinc-500">{p.providerType.replace(/_/g, " ")}</p>
                <p className="mt-2 text-sm text-zinc-600">{p.healthLabel}</p>
                <div className="mt-2">
                  <ActionExecutionStatusBadge statusKey={p.statusKey} labels={labels.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.companionRequests.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionRequests.title}</h2>
          <ul className="space-y-3">
            {center.companionRequests.map((item: CompanionActionRequest) => (
              <li key={item.id} className="rounded-xl border border-rose-200 bg-rose-50/30 p-4">
                <p className="font-medium text-zinc-900">&ldquo;{item.requestText}&rdquo;</p>
                {item.explanation ? <p className="mt-2 text-sm text-zinc-600"><span className="font-medium">{labels.companionRequests.explanation}:</span> {item.explanation}</p> : null}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                  {item.costLabel && item.costLabel !== "—" ? <span>{labels.cost}: {item.costLabel}</span> : null}
                  <span>{labels.companionRequests.risk}: </span>
                  <RiskLevelBadge risk={item.riskLevel} labels={labels.risk} />
                  {item.approvalRequired ? <span className="text-rose-800">{labels.approvalRequired}</span> : null}
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "approve")} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.approve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "reject")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.reject}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "acknowledge")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.actionHistory.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.actionHistory.title}</h2>
          <ul className="space-y-2">
            {center.actionHistory.map((h: ActionHistoryItem) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-100 bg-white px-4 py-3">
                <div>
                  <p className="font-medium text-zinc-900">{h.actionName}</p>
                  <p className="text-xs text-zinc-500">{labels.user}: {h.userName} · {labels.date}: {h.executedAtLabel}</p>
                  {h.resultLabel ? <p className="mt-1 text-sm text-zinc-600">{h.resultLabel}</p> : null}
                </div>
                <ActionExecutionStatusBadge statusKey={h.statusKey} labels={labels.status} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(center.completedActions.length > 0 || center.failedActions.length > 0) ? (
        <section className="space-y-6">
          {center.completedActions.length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-900">{labels.sections.completedActions}</h2>
              <InstanceList items={center.completedActions} labels={labels} canManage={false} busy={busy} onAction={() => {}} />
            </div>
          ) : null}
          {center.failedActions.length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-900">{labels.sections.failedActions}</h2>
              <InstanceList items={center.failedActions} labels={labels} canManage={false} busy={busy} onAction={() => {}} />
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
