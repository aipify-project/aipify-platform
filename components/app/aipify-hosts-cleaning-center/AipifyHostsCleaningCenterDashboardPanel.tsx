"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsCleaningCenterActionResult,
  parseAipifyHostsCleaningCenterDashboard,
  type HostsCleaningCenterDashboard,
  type HostsCleaningCleanerRow,
  type HostsCleaningIssueRow,
  type HostsCleaningSectionKey,
  type HostsCleaningTaskRow,
  type HostsCleaningTimelineRow,
} from "@/lib/aipify/aipify-hosts-cleaning-center";

type Props = { labels: Record<string, string> };

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    scheduled: "bg-violet-50 text-violet-800 ring-violet-200",
    assigned: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    in_progress: "bg-sky-50 text-sky-800 ring-sky-200",
    awaiting_review: "bg-amber-50 text-amber-900 ring-amber-200",
    completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    requires_attention: "bg-red-50 text-red-800 ring-red-200",
    active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    unavailable: "bg-gray-100 text-gray-600 ring-gray-200",
    suspended: "bg-red-50 text-red-700 ring-red-200",
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

function ChecklistProgress({ task, labels }: { task: HostsCleaningTaskRow; labels: Record<string, string> }) {
  const { completed_count, total_count } = task.checklist;
  return (
    <div className="text-xs text-gray-600">
      {completed_count}/{total_count} {labels.checklistComplete}
    </div>
  );
}

function CleaningTasksTable({
  rows,
  labels,
  busy,
  cleaners,
  onAction,
}: {
  rows: HostsCleaningTaskRow[];
  labels: Record<string, string>;
  busy: boolean;
  cleaners: HostsCleaningCleanerRow[];
  onAction: (body: Record<string, unknown>) => void;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyTasksTitle} message={labels.emptyTasksMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.category}</th>
            <th className="px-4 py-3">{labels.departureDate}</th>
            <th className="px-4 py-3">{labels.arrivalDate}</th>
            <th className="px-4 py-3">{labels.assignedCleaner}</th>
            <th className="px-4 py-3">{labels.dueTime}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.checklist}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.is_overdue ? "bg-red-50/30" : row.cleaning_status === "requires_attention" ? "bg-amber-50/30" : ""}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
              <td className="px-4 py-3">{labelFor(labels, "category", row.category)}</td>
              <td className="px-4 py-3 text-gray-600">{row.departure_date || "—"}</td>
              <td className="px-4 py-3 text-gray-600">{row.arrival_date || "—"}</td>
              <td className="px-4 py-3 text-gray-700">{row.assigned_cleaner}</td>
              <td className="px-4 py-3 text-gray-600">{row.due_time ? row.due_time.slice(0, 16).replace("T", " ") : "—"}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.cleaning_status)}`}>{labelFor(labels, "cleaningStatus", row.cleaning_status)}</span>
                {row.is_overdue && <span className="ml-1 text-xs font-medium text-red-700">{labels.overdue}</span>}
              </td>
              <td className="px-4 py-3"><ChecklistProgress task={row} labels={labels} /></td>
              <td className="px-4 py-3 min-w-[200px]">
                <div className="flex flex-wrap gap-2">
                  {row.cleaning_status === "scheduled" && cleaners[0] && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "assign_cleaner", cleaning_task_id: row.id, cleaner_id: cleaners[0].id })} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.assignCleaner}</button>
                  )}
                  {row.cleaner_id && row.cleaning_status === "assigned" && cleaners[1] && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "reassign_cleaner", cleaning_task_id: row.id, cleaner_id: cleaners[1].id })} className="text-xs font-medium text-violet-700 disabled:opacity-60">{labels.reassignCleaner}</button>
                  )}
                  {row.cleaning_status === "assigned" && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "start_cleaning", cleaning_task_id: row.id })} className="text-xs font-medium text-sky-700 disabled:opacity-60">{labels.startCleaning}</button>
                  )}
                  {["in_progress", "requires_attention"].includes(row.cleaning_status) && (
                    <>
                      <button type="button" disabled={busy} onClick={() => onAction({ action_type: "mark_complete", cleaning_task_id: row.id, notes: labels.completedNote })} className="text-xs font-medium text-emerald-700 disabled:opacity-60">{labels.markComplete}</button>
                      <button type="button" disabled={busy} onClick={() => onAction({ action_type: "report_issue", cleaning_task_id: row.id, issue_category: "maintenance_required", notes: labels.issueReportNote })} className="text-xs font-medium text-red-700 disabled:opacity-60">{labels.reportIssue}</button>
                    </>
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

function CleanersTable({ rows, labels }: { rows: HostsCleaningCleanerRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyTeamsTitle} message={labels.emptyTeamsMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.cleanerName}</th>
            <th className="px-4 py-3">{labels.contact}</th>
            <th className="px-4 py-3">{labels.assignedProperties}</th>
            <th className="px-4 py-3">{labels.activeTasks}</th>
            <th className="px-4 py-3">{labels.status}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.cleaner_name}</td>
              <td className="px-4 py-3 text-gray-700">
                <div className="text-xs">{row.contact_email || row.contact_phone || "—"}</div>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {Array.isArray(row.assigned_properties) ? (row.assigned_properties as string[]).join(", ") || "—" : "—"}
              </td>
              <td className="px-4 py-3 text-gray-700">{row.active_tasks}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.cleaner_status)}`}>{labelFor(labels, "cleanerStatus", row.cleaner_status)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IssuesList({ rows, labels }: { rows: HostsCleaningIssueRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return null;
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-5">
      <h3 className="text-sm font-semibold text-amber-950">{labels.issuesAttention}</h3>
      <ul className="mt-3 space-y-2">
        {rows.slice(0, 5).map((row) => (
          <li key={row.id} className="text-sm text-amber-900">
            <span className="font-medium">{row.property}</span> — {labelFor(labels, "issueCategory", row.issue_category)}: {row.description}
          </li>
        ))}
      </ul>
    </section>
  );
}

function TimelineList({ rows, labels }: { rows: HostsCleaningTimelineRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return null;
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">{labels.cleaningTimeline}</h3>
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

export function AipifyHostsCleaningCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsCleaningCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsCleaningSectionKey>("todays_cleaning");
  const [statusFilter, setStatusFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection });
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/aipify/aipify-hosts/cleaning-center/dashboard?${params}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsCleaningCenterDashboard(await res.json()));
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
    const res = await fetch("/api/aipify/aipify-hosts/cleaning-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsCleaningCenterActionResult(await res.json());
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
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
        <p className="text-sm font-medium text-emerald-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-emerald-900">{labels.governanceNote}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/app/aipify-hosts" className="inline-flex rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50">
            {labels.backToHosts}
          </Link>
          <Link href="/app/aipify-hosts/knowledge" className="inline-flex rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50">
            {labels.viewKnowledge}
          </Link>
        </div>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.cleaningsToday} value={dashboard.stats.cleanings_today} />
        <MetricCard label={labels.overdueCleanings} value={dashboard.stats.overdue_cleanings} sub={dashboard.stats.overdue_cleanings > 0 ? labels.overdue : undefined} />
        <MetricCard label={labels.awaitingCleaning} value={dashboard.stats.properties_awaiting_cleaning} />
        <MetricCard label={labels.issuesAttention} value={dashboard.stats.issues_requiring_attention} sub={dashboard.stats.issues_requiring_attention > 0 ? labels.needsAttention : undefined} />
      </dl>

      <IssuesList rows={dashboard.issues} labels={labels} />

      <section className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-gray-600">
          {labels.filterStatus}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm"
          >
            <option value="">{labels.allStatuses}</option>
            {["scheduled", "assigned", "in_progress", "awaiting_review", "completed", "requires_attention"].map((s) => (
              <option key={s} value={s}>{labelFor(labels, "cleaningStatus", s)}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={() => void runAction({
            action_type: "schedule_deep_cleaning",
            notes: JSON.stringify({
              property_id: dashboard.properties[0]?.id ?? null,
              scheduled_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
            }),
          })}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {labels.scheduleDeepCleaning}
        </button>
      </section>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsCleaningSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-emerald-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {activeSection === "cleaning_teams" ? (
        <CleanersTable rows={dashboard.cleaners} labels={labels} />
      ) : (
        <CleaningTasksTable rows={dashboard.cleaning_tasks} labels={labels} busy={busy} cleaners={dashboard.cleaners} onAction={(body) => void runAction(body)} />
      )}

      <TimelineList rows={dashboard.timeline} labels={labels} />
    </div>
  );
}
