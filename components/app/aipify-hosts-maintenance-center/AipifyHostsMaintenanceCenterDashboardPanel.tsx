"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsMaintenanceCenterActionResult,
  parseAipifyHostsMaintenanceCenterDashboard,
  type HostsMaintenanceCenterDashboard,
  type HostsMaintenanceContractorRow,
  type HostsMaintenanceSectionKey,
  type HostsMaintenanceTimelineRow,
  type HostsPreventiveScheduleRow,
  type HostsWorkOrderRow,
} from "@/lib/aipify/aipify-hosts-maintenance-center";

type Props = { labels: Record<string, string> };

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function priorityBadge(priority: string): string {
  const map: Record<string, string> = {
    low: "bg-gray-100 text-gray-700 ring-gray-200",
    medium: "bg-sky-50 text-sky-800 ring-sky-200",
    high: "bg-amber-50 text-amber-900 ring-amber-200",
    critical: "bg-red-50 text-red-800 ring-red-200",
  };
  return map[priority] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    new: "bg-gray-100 text-gray-700 ring-gray-200",
    assigned: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    scheduled: "bg-violet-50 text-violet-800 ring-violet-200",
    in_progress: "bg-sky-50 text-sky-800 ring-sky-200",
    waiting_parts: "bg-amber-50 text-amber-900 ring-amber-200",
    completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    cancelled: "bg-gray-100 text-gray-500 ring-gray-200",
    active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    preferred: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    inactive: "bg-gray-100 text-gray-500 ring-gray-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function WorkOrdersTable({
  rows,
  labels,
  busy,
  contractors,
  onAction,
}: {
  rows: HostsWorkOrderRow[];
  labels: Record<string, string>;
  busy: boolean;
  contractors: HostsMaintenanceContractorRow[];
  onAction: (body: Record<string, unknown>) => void;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyWorkOrdersTitle} message={labels.emptyWorkOrdersMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.description}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.category}</th>
            <th className="px-4 py-3">{labels.priority}</th>
            <th className="px-4 py-3">{labels.assignedTo}</th>
            <th className="px-4 py-3">{labels.dueDate}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.is_overdue ? "bg-red-50/30" : row.priority === "critical" ? "bg-amber-50/30" : ""}`}>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{row.description}</div>
                {row.contractor !== "—" && <div className="text-xs text-gray-500">{row.contractor}</div>}
              </td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3">{labelFor(labels, "category", row.category)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${priorityBadge(row.priority)}`}>{labelFor(labels, "priority", row.priority)}</span>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.assigned_to}</td>
              <td className="px-4 py-3 text-gray-600">{row.due_date || "—"}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.wo_status)}`}>{labelFor(labels, "woStatus", row.wo_status)}</span>
                {row.is_overdue && <span className="ml-1 text-xs font-medium text-red-700">{labels.overdue}</span>}
              </td>
              <td className="px-4 py-3 min-w-[180px]">
                <div className="flex flex-wrap gap-2">
                  {row.wo_status === "new" && contractors[0] && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "assign_contractor", work_order_id: row.id, contractor_id: contractors[0].id })} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.assignContractor}</button>
                  )}
                  {row.wo_status !== "scheduled" && row.wo_status !== "completed" && row.wo_status !== "cancelled" && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "schedule_maintenance", work_order_id: row.id })} className="text-xs font-medium text-violet-700 disabled:opacity-60">{labels.scheduleMaintenance}</button>
                  )}
                  {row.wo_status === "scheduled" && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "start_work_order", work_order_id: row.id })} className="text-xs font-medium text-sky-700 disabled:opacity-60">{labels.startWork}</button>
                  )}
                  {row.wo_status === "in_progress" && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "close_work_order", work_order_id: row.id, notes: labels.closedNote })} className="text-xs font-medium text-emerald-700 disabled:opacity-60">{labels.closeWorkOrder}</button>
                  )}
                  {row.priority !== "critical" && row.wo_status !== "completed" && row.wo_status !== "cancelled" && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "change_priority", work_order_id: row.id, priority: "critical" })} className="text-xs font-medium text-red-700 disabled:opacity-60">{labels.escalatePriority}</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PreventiveTable({ rows, labels }: { rows: HostsPreventiveScheduleRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyPreventiveTitle} message={labels.emptyPreventiveMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.taskName}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.category}</th>
            <th className="px-4 py-3">{labels.recurrence}</th>
            <th className="px-4 py-3">{labels.nextDue}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.is_due ? "bg-amber-50/40" : ""}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{row.task_name}</td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3">{labelFor(labels, "category", row.category)}</td>
              <td className="px-4 py-3">{labelFor(labels, "recurrence", row.recurrence)}</td>
              <td className="px-4 py-3 text-gray-600">
                {row.next_due_date}
                {row.is_due && <span className="ml-1 text-xs font-medium text-amber-800">{labels.dueNow}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContractorsTable({ rows, labels }: { rows: HostsMaintenanceContractorRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyContractorsTitle} message={labels.emptyContractorsMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.companyName}</th>
            <th className="px-4 py-3">{labels.contact}</th>
            <th className="px-4 py-3">{labels.tradeCategory}</th>
            <th className="px-4 py-3">{labels.coverageArea}</th>
            <th className="px-4 py-3">{labels.status}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.company_name}</td>
              <td className="px-4 py-3 text-gray-700">
                <div>{row.contact_name}</div>
                <div className="text-xs text-gray-500">{row.contact_email || row.contact_phone}</div>
              </td>
              <td className="px-4 py-3">{labelFor(labels, "category", row.trade_category)}</td>
              <td className="px-4 py-3 text-gray-600">{row.coverage_area}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.contractor_status)}`}>{labelFor(labels, "contractorStatus", row.contractor_status)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TimelineList({ rows, labels }: { rows: HostsMaintenanceTimelineRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return null;
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">{labels.maintenanceTimeline}</h3>
      <ul className="mt-3 space-y-2">
        {rows.slice(0, 8).map((row) => (
          <li key={row.id} className="flex items-start justify-between gap-3 text-sm">
            <span className="text-gray-800">{labelFor(labels, "timelineEvent", row.event_type)} — {row.summary || "—"}</span>
            <span className="shrink-0 text-xs text-gray-500">{row.occurred_at ? row.occurred_at.slice(0, 10) : ""}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AipifyHostsMaintenanceCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsMaintenanceCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsMaintenanceSectionKey>("open_work_orders");
  const [statusFilter, setStatusFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection });
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/aipify/aipify-hosts/maintenance-center/dashboard?${params}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsMaintenanceCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/maintenance-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsMaintenanceCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(result.summary ?? labels.actionRecorded);
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  if (loading && !dashboard) return <AipifyLoader label={labels.loading} centered fullPage />;

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6">
        <p className="text-sm font-medium text-teal-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-teal-900">{labels.governanceNote}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/app/aipify-hosts" className="inline-flex rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-50">
            {labels.backToHosts}
          </Link>
          <Link href="/app/aipify-hosts/knowledge" className="inline-flex rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-50">
            {labels.viewKnowledge}
          </Link>
        </div>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.openWorkOrders} value={dashboard.stats.open_work_orders} />
        <MetricCard label={labels.criticalItems} value={dashboard.stats.critical_items} sub={dashboard.stats.critical_items > 0 ? labels.needsAttention : undefined} />
        <MetricCard label={labels.upcomingPreventive} value={dashboard.stats.upcoming_preventive} />
        <MetricCard label={labels.overdueTasks} value={dashboard.stats.overdue_tasks} sub={dashboard.stats.overdue_tasks > 0 ? labels.overdue : undefined} />
      </dl>

      <section className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-gray-600">
          {labels.filterStatus}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm"
          >
            <option value="">{labels.allStatuses}</option>
            {["new", "assigned", "scheduled", "in_progress", "waiting_parts", "completed", "cancelled"].map((s) => (
              <option key={s} value={s}>{labelFor(labels, "woStatus", s)}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={() => void runAction({
            action_type: "create_work_order",
            priority: "medium",
            notes: JSON.stringify({
              description: labels.demoWorkOrderDescription,
              category: "general_repairs",
              property_id: dashboard.properties[0]?.id ?? null,
              due_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
            }),
          })}
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {labels.createWorkOrder}
        </button>
      </section>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsMaintenanceSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-teal-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {(activeSection === "open_work_orders" || activeSection === "scheduled_maintenance" || activeSection === "completed_maintenance") && (
        <WorkOrdersTable rows={dashboard.work_orders} labels={labels} busy={busy} contractors={dashboard.contractors} onAction={(body) => void runAction(body)} />
      )}
      {activeSection === "preventive_maintenance" && (
        <PreventiveTable rows={dashboard.preventive_schedules} labels={labels} />
      )}
      {activeSection === "contractors" && (
        <ContractorsTable rows={dashboard.contractors} labels={labels} />
      )}

      <TimelineList rows={dashboard.timeline} labels={labels} />
    </div>
  );
}
