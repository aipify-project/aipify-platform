"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAnalyticsCenter,
  type AnalyticsCenter,
  type AnalyticsManagementLabels,
} from "@/lib/analytics-management";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab =
  | "executive"
  | "operations"
  | "employees"
  | "departments"
  | "businessPacks"
  | "domains"
  | "financial"
  | "productivity"
  | "reports";

type Props = {
  labels: AnalyticsManagementLabels;
  initialTab?: Tab;
};

export function AnalyticsManagementPanel({ labels, initialTab }: Props) {
  const [center, setCenter] = useState<AnalyticsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab ?? "executive");
  const [busy, setBusy] = useState(false);
  const [reportName, setReportName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/analytics");
    if (res.ok) setCenter(parseAnalyticsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/analytics/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  }
  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const exec = center.executive_dashboard ?? {};
  const ops = center.operations ?? {};
  const routes = center.routes;
  const scope = center.visibility?.scope ?? "personal";

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: "executive", label: labels.executive, show: scope === "organization" },
    { key: "operations", label: labels.operations, show: true },
    { key: "departments", label: labels.departments, show: scope !== "personal" },
    { key: "employees", label: labels.employees, show: true },
    { key: "domains", label: labels.domains, show: scope === "organization" },
    { key: "businessPacks", label: labels.businessPacks, show: scope === "organization" },
    { key: "financial", label: labels.financial, show: scope === "organization" },
    { key: "productivity", label: labels.productivity, show: true },
    { key: "reports", label: labels.reports, show: scope === "organization" },
  ].filter((t): t is { key: Tab; label: string; show: boolean } => t.show);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.coaching_note ? <p className="mt-1 text-sm text-gray-500">{center.coaching_note}</p> : null}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {routes?.insights ? <Link href={routes.insights} className="text-indigo-700 hover:underline">{labels.insightsLink}</Link> : null}
          {routes?.tasks ? <Link href={routes.tasks} className="text-indigo-700 hover:underline">{labels.tasksLink}</Link> : null}
          {routes?.assets ? <Link href={routes.assets} className="text-indigo-700 hover:underline">{labels.assetsLink}</Link> : null}
          <Link href="/app/organizational-intelligence" className="text-indigo-700 hover:underline">{labels.orgIntelligenceLink}</Link>
        </div>
      </div>

      {scope === "organization" && exec ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {([
            [labels.organizationHealth, exec.organization_health],
            [labels.activeEmployees, exec.active_employees],
            [labels.openTasks, exec.open_tasks],
            [labels.overdueTasks, exec.overdue_tasks],
            [labels.upcomingDeadlines, exec.upcoming_deadlines],
          ] as [string, unknown][]).map(([label, value]) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">{String(value ?? "—")}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "executive" && scope === "organization" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <MetricCard label={labels.departments} value={exec.departments} />
          <MetricCard label={labels.businessPacks} value={exec.business_packs_active} />
          <MetricCard label={labels.domains} value={exec.domains_active} />
          <MetricCard label="Workflow activity (30d)" value={exec.workflow_executions_30d} />
          <MetricCard label="License seats used" value={exec.license_seats_used} />
        </div>
      ) : null}

      {tab === "operations" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title="Tasks" data={ops.tasks as Record<string, unknown>} />
          <SectionCard title="Workflows" data={ops.workflows as Record<string, unknown>} />
          <SectionCard title="Calendar" data={ops.calendar as Record<string, unknown>} />
          {center.assets ? <SectionCard title="Assets" data={center.assets} /> : null}
          {center.communication ? <SectionCard title="Communication" data={center.communication} /> : null}
          {center.knowledge ? <SectionCard title="Knowledge" data={center.knowledge} /> : null}
        </div>
      ) : null}

      {tab === "departments" ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.departments ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noData} message={labels.noDataHint} primaryAction={{ label: labels.insightsLink, href: routes?.insights ?? "/app/insights" }} />
          ) : (
            (center.departments ?? []).map((d, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
                <h3 className="font-semibold text-gray-900">{String(d.department_name ?? "")}</h3>
                <p className="mt-2 text-gray-600">
                  {String(d.employee_count ?? 0)} employees · {String(d.open_tasks ?? 0)} open · {String(d.overdue_tasks ?? 0)} overdue
                </p>
                {d.completion_rate != null ? <p className="text-gray-500">Completion rate: {String(d.completion_rate)}%</p> : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "employees" ? (
        <div className="space-y-2">
          {(center.employees ?? []).map((e, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-medium text-gray-900">{String(e.display_name ?? "")}</p>
              <p className="text-gray-500">{String(e.department_name ?? "")} · {String(e.assigned_tasks ?? 0)} assigned · {String(e.overdue_tasks ?? 0)} overdue</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "domains" ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.domains ?? []).map((d, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-semibold text-gray-900">{String(d.domain ?? "")}</p>
              <p className="text-gray-500">{String(d.tasks ?? 0)} tasks · {String(d.documents ?? 0)} documents · {String(d.pack_installations ?? 0)} packs</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "businessPacks" ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.business_packs ?? []).map((p, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-semibold text-gray-900">{String(p.pack_key ?? "")}</p>
              <p className="text-gray-500">{String(p.license_status ?? "")} · Adoption {String(p.adoption_rate ?? 0)}%</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "financial" && center.financial ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 grid gap-4 sm:grid-cols-3 text-sm">
          <MetricCard label="Asset value" value={center.financial.asset_value} />
          <MetricCard label="Maintenance (YTD)" value={center.financial.maintenance_costs_ytd} />
          <MetricCard label="License renewals (90d)" value={center.financial.license_renewals_90d} />
        </div>
      ) : null}

      {tab === "productivity" && center.productivity ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 grid gap-4 sm:grid-cols-2 text-sm">
          <MetricCard label="Tasks completed (30d)" value={center.productivity.task_completion_30d} />
          <MetricCard label="Workflow success rate" value={`${String(center.productivity.workflow_success_rate ?? 0)}%`} />
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className="space-y-4">
          <form
            className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void runAction("create_report", { report_name: reportName, export_format: "pdf", report_type: "executive" });
              setReportName("");
            }}
          >
            <input value={reportName} onChange={(e) => setReportName(e.target.value)} placeholder="Executive report name" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
            <button type="submit" disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.createReport}</button>
          </form>
          {(center.reports ?? []).map((r, i) => (
            <div key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">{String(r.report_name ?? "")}</p>
                <p className="text-gray-500">{String(r.report_type ?? "")} · {String(r.export_format ?? "pdf").toUpperCase()}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" disabled={busy} onClick={() => void runAction("export_report", { report_id: r.id, export_format: "pdf" })} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium">{labels.exportReport}</button>
                <button type="button" disabled={busy} onClick={() => void runAction("schedule_report", { report_id: r.id, schedule_cadence: "weekly" })} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-800">{labels.scheduleReport}</button>
              </div>
            </div>
          ))}
          {(center.scheduled_reports ?? []).length > 0 ? (
            <section>
              <h2 className="text-sm font-semibold text-gray-900">Scheduled</h2>
              <ul className="mt-2 space-y-2">
                {(center.scheduled_reports ?? []).map((s, i) => (
                  <li key={i} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm">
                    {String(s.report_name ?? "")} · {String(s.schedule_cadence ?? "")}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">{labels.auditLog}</h2>
          <ul className="mt-3 space-y-2">
            {center.audit_recent.slice(0, 8).map((a, i) => (
              <li key={i} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm">
                <p className="font-medium text-gray-900">{a.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{String(value ?? "—")}</p>
    </div>
  );
}

function SectionCard({ title, data }: { title: string; data?: Record<string, unknown> }) {
  if (!data) return null;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <ul className="mt-2 space-y-1 text-gray-600">
        {Object.entries(data).map(([k, v]) => (
          <li key={k}><span className="capitalize">{k.replace(/_/g, " ")}</span>: {String(v ?? "—")}</li>
        ))}
      </ul>
    </div>
  );
}
