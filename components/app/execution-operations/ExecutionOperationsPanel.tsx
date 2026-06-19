"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  ExecutionActionCatalogItem,
  ExecutionOperationsCenter,
  ExecutionOperationsLabels,
  ExecutionOperationsTab,
  ExecutionRequest,
} from "@/lib/execution-operations";
import { parseExecutionOperationsCenter } from "@/lib/execution-operations/parse";

type Tab = ExecutionOperationsTab;

type Props = {
  labels: ExecutionOperationsLabels;
  initialTab?: Tab;
  titleOverride?: string;
  subtitleOverride?: string;
  visibleTabs?: Tab[];
};

function ActionCard({
  action,
  labels,
}: {
  action: ExecutionActionCatalogItem;
  labels: ExecutionOperationsLabels;
}) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs uppercase text-aipify-text-muted">{action.action_category?.replace(/_/g, " ")}</p>
      <p className="font-medium text-aipify-text">{action.title}</p>
      {action.description ? <p className="mt-1 text-aipify-text-secondary">{action.description}</p> : null}
      {action.risk_level ? <p className="mt-1 text-xs text-aipify-text-muted">{labels.riskLevel}: {action.risk_level}</p> : null}
    </div>
  );
}

function RequestCard({
  request,
  labels,
  onApprove,
  onReject,
  onExecute,
  busy,
}: {
  request: ExecutionRequest;
  labels: ExecutionOperationsLabels;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onExecute?: (id: string) => void;
  busy?: boolean;
}) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs uppercase text-aipify-text-muted">{request.action_category?.replace(/_/g, " ")} · {request.status}</p>
      <p className="font-medium text-aipify-text">{request.title}</p>
      {request.summary ? <p className="mt-1 text-aipify-text-secondary">{request.summary}</p> : null}
      {request.risk_level ? <p className="mt-1 text-xs text-aipify-text-muted">{labels.riskLevel}: {request.risk_level}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {onApprove ? (
          <button type="button" disabled={busy} onClick={() => onApprove(request.id)} className={`${AipifyShellClasses.primaryButton} text-xs`}>
            {labels.approveAction}
          </button>
        ) : null}
        {onReject ? (
          <button type="button" disabled={busy} onClick={() => onReject(request.id)} className={`${AipifyShellClasses.secondaryButton} text-xs`}>
            {labels.rejectAction}
          </button>
        ) : null}
        {onExecute ? (
          <button type="button" disabled={busy} onClick={() => onExecute(request.id)} className={`${AipifyShellClasses.primaryButton} text-xs`}>
            {labels.executeAction}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function ExecutionOperationsPanel({ labels, initialTab = "overview", titleOverride, subtitleOverride, visibleTabs }: Props) {
  const [center, setCenter] = useState<ExecutionOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ExecutionActionCatalogItem[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/execution-operations");
    if (res.ok) setCenter(parseExecutionOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/execution-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  async function runSearch() {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setBusy(true);
    const res = await fetch(`/api/app/execution-operations/search?q=${encodeURIComponent(searchQuery.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(Array.isArray(data.results) ? data.results : []);
    }
    setBusy(false);
  }

  if (loading && !center) {
    return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  }
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  const overview = center.overview ?? {};
  const executive = center.executive_dashboard ?? {};
  const assistant = center.companion_assistant ?? {};
  const routes = center.routes ?? {};

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "pending_actions", label: labels.pendingActions },
    { id: "approved_actions", label: labels.approvedActions },
    { id: "execution_history", label: labels.executionHistory },
    { id: "integrations", label: labels.integrations },
    { id: "permissions", label: labels.permissions },
    { id: "approvals", label: labels.approvals },
    { id: "reports", label: labels.reports },
    { id: "executive", label: labels.executive },
  ];
  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.id)) : allTabs;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{titleOverride ?? labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{subtitleOverride ?? labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
      </header>

      <div className={`${AipifyShellClasses.surfaceCard} flex flex-wrap gap-2 p-3`}>
        <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={labels.searchPlaceholder} className="min-w-[200px] flex-1 rounded-md border border-aipify-border bg-white px-3 py-2 text-sm" />
        <button type="button" disabled={busy} onClick={() => void runSearch()} className={`${AipifyShellClasses.primaryButton} text-sm`}>{labels.searchActions}</button>
        <Link href={routes.actions ?? "/app/execution/actions"} className={`${AipifyShellClasses.secondaryButton} text-sm`}>{labels.actionCatalog}</Link>
        <Link href={routes.templates ?? "/app/execution/templates"} className={`${AipifyShellClasses.secondaryButton} text-sm`}>{labels.executionTemplates}</Link>
      </div>

      {searchResults.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {searchResults.map((a) => <ActionCard key={a.id} action={a} labels={labels} />)}
        </section>
      ) : null}

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} className={tab === item.id ? `${AipifyShellClasses.primaryButton} text-sm` : `${AipifyShellClasses.secondaryButton} text-sm`}>{item.label}</button>
        ))}
      </nav>

      {tab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {([[labels.catalogCount, overview.catalog_count], [labels.pendingCount, overview.pending_actions], [labels.completedCount, overview.completed_actions], [labels.successRate, overview.success_rate_pct], [labels.templateCount, overview.template_count]] as const).map(([label, value]) => (
              <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs uppercase text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-aipify-text">{String(value ?? 0)}{label === labels.successRate ? "%" : ""}</p>
              </div>
            ))}
          </div>
          {Array.isArray(center.execution_workflow) ? (
            <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h2 className="font-semibold text-aipify-text">{labels.executionWorkflow}</h2>
              <p className="mt-2 text-aipify-text-secondary">{center.execution_workflow.join(" → ")}</p>
            </div>
          ) : null}
          {(center.action_catalog ?? []).length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {center.action_catalog?.slice(0, 9).map((a) => <ActionCard key={a.id} action={a} labels={labels} />)}
            </div>
          ) : null}
          {(center.execution_templates ?? []).length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-aipify-text">{labels.executionTemplates}</h2>
              {center.execution_templates?.map((t) => (
                <div key={t.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <p className="font-medium text-aipify-text">{t.title}</p>
                  {t.description ? <p className="mt-1 text-aipify-text-secondary">{t.description}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
        </>
      ) : null}

      {tab === "pending_actions" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.pending_actions ?? []).length === 0 ? <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} /> : center.pending_actions?.map((r) => (
            <RequestCard key={r.id} request={r} labels={labels} busy={busy} onApprove={(id) => void runAction("approve_action", { request_id: id })} onReject={(id) => void runAction("reject_action", { request_id: id })} />
          ))}
        </div>
      ) : null}

      {tab === "approved_actions" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.approved_actions ?? []).map((r) => (
            <RequestCard key={r.id} request={r} labels={labels} busy={busy} onExecute={(id) => void runAction("execute_action", { request_id: id })} />
          ))}
        </div>
      ) : null}

      {tab === "execution_history" ? (
        <div className="space-y-3">
          {(center.execution_history ?? []).map((r) => (
            <div key={r.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{r.title} · {r.status}</p>
              {r.summary ? <p className="mt-1 text-aipify-text-secondary">{r.summary}</p> : null}
              {r.executed_at ? <p className="mt-1 text-xs text-aipify-text-muted">{r.executed_at}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {tab === "integrations" ? (
        <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <h2 className="font-semibold text-aipify-text">{labels.integrations}</h2>
          {Array.isArray(center.integrations?.engines) ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-aipify-text-secondary">
              {(center.integrations.engines as string[]).map((e) => <li key={e}>{e}</li>)}
            </ul>
          ) : null}
          {center.external_action_framework ? (
            <p className="mt-3 text-xs text-aipify-text-muted">{String((center.external_action_framework as Record<string, unknown>).note ?? "")}</p>
          ) : null}
        </div>
      ) : null}

      {tab === "permissions" ? (
        <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <h2 className="font-semibold text-aipify-text">{labels.permissionEngine}</h2>
          {Array.isArray(center.permission_engine?.checks) ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-aipify-text-secondary">
              {(center.permission_engine.checks as string[]).map((c) => <li key={c}>{c.replace(/_/g, " ")}</li>)}
            </ul>
          ) : null}
        </div>
      ) : null}

      {tab === "approvals" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.approvalEscalation}</h2>
            {center.approval_escalation?.example ? (
              <p className="mt-2 text-aipify-text-secondary">
                {String((center.approval_escalation.example as Record<string, unknown>).trigger ?? "")}
              </p>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(center.pending_actions ?? []).map((r) => (
              <RequestCard key={r.id} request={r} labels={labels} busy={busy} onApprove={(id) => void runAction("approve_action", { request_id: id })} onReject={(id) => void runAction("reject_action", { request_id: id })} />
            ))}
          </div>
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.reports ?? {}).map(([key, value]) => (
            <div key={key} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs uppercase text-aipify-text-muted">{key.replace(/_/g, " ")}</p>
              <p className="mt-1 font-medium text-aipify-text">{String(value ?? "—")}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "executive" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.executiveDashboard}</h2>
            <p className="mt-2 text-aipify-text-secondary">
              {labels.pendingCount}: {String(executive.pending_approvals ?? "—")} · {labels.completedCount}: {String(executive.completed_actions ?? "—")} · {labels.successRate}: {String(executive.success_rate_pct ?? "—")}%
            </p>
            {Array.isArray(executive.companion_recommendations) ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-aipify-text-secondary">
                {executive.companion_recommendations.map((h) => <li key={String(h)}>{String(h)}</li>)}
              </ul>
            ) : null}
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.executionMonitoring}</h2>
            {Array.isArray(center.execution_monitoring?.companion_monitoring) ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-aipify-text-secondary">
                {(center.execution_monitoring.companion_monitoring as string[]).map((m) => <li key={m}>{m}</li>)}
              </ul>
            ) : null}
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.companionAssistant}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-aipify-text-secondary">
              {Array.isArray(assistant.prompts) ? assistant.prompts.map((p) => <li key={String(p)}>{String(p)}</li>) : null}
            </ul>
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.executionQueue}</h2>
            {(center.execution_queue ?? []).map((q) => (
              <div key={q.id} className="mt-3 border-t border-aipify-border pt-3">
                <p className="text-aipify-text">{q.request_title ?? q.step_label} · {q.queue_status}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {(center.audit_recent ?? []).length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <div className="space-y-2">
            {center.audit_recent?.map((entry) => (
              <div key={`${entry.action}-${entry.created_at}`} className={`${AipifyShellClasses.surfaceCard} p-3 text-xs text-aipify-text-secondary`}>
                <span className="font-medium text-aipify-text">{entry.action}</span> — {entry.summary}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
