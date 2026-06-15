"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsOperationsActionResult,
  parseAipifyHostsOperationsDashboard,
  type HostsOperationsDashboard,
  type HostsOperationsSectionKey,
} from "@/lib/aipify/aipify-hosts-operations";

type Props = {
  labels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function statusBadge(status: string, labels: Record<string, string>): string {
  const map: Record<string, string> = {
    scheduled: "bg-sky-50 text-sky-800 ring-sky-200",
    ready: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    attention_required: "bg-amber-50 text-amber-900 ring-amber-200",
    completed: "bg-teal-50 text-teal-800 ring-teal-200",
    not_started: "bg-gray-100 text-gray-700 ring-gray-200",
    in_progress: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    requires_review: "bg-violet-50 text-violet-800 ring-violet-200",
    new: "bg-sky-50 text-sky-800 ring-sky-200",
    assigned: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    awaiting_response: "bg-amber-50 text-amber-900 ring-amber-200",
    resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    pending: "bg-amber-50 text-amber-900 ring-amber-200",
    awaiting_review: "bg-orange-50 text-orange-900 ring-orange-200",
    open: "bg-red-50 text-red-800 ring-red-200",
    under_review: "bg-amber-50 text-amber-900 ring-amber-200",
    low: "bg-gray-100 text-gray-700 ring-gray-200",
    medium: "bg-sky-50 text-sky-800 ring-sky-200",
    high: "bg-orange-50 text-orange-900 ring-orange-200",
    critical: "bg-red-50 text-red-900 ring-red-200",
    moderate: "bg-amber-50 text-amber-900 ring-amber-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function statusLabel(status: string, labels: Record<string, string>): string {
  const key = `status_${status}` as keyof typeof labels;
  return (labels[key] as string | undefined) ?? status.replace(/_/g, " ");
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function AipifyHostsOperationsDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsOperationsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsOperationsSectionKey>("today");
  const [activeFilter, setActiveFilter] = useState("today");
  const [propertyId, setPropertyId] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection, filter: activeFilter });
    if (propertyId) params.set("property_id", propertyId);
    const res = await fetch(`/api/aipify/aipify-hosts/operations/dashboard?${params.toString()}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsOperationsDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection, activeFilter, propertyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = async (
    action: "status_change" | "approve" | "decline" | "assign",
    itemId: string,
    board: string,
    newStatus?: string,
  ) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, item_id: itemId, board, new_status: newStatus }),
    });
    const result = parseAipifyHostsOperationsActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(labels.actionRecorded);
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  if (loading && !dashboard) {
    return <AipifyLoader label={labels.loading} centered fullPage />;
  }

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const snap = dashboard.today_snapshot;
  const boards = dashboard.boards;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6">
        <p className="text-sm font-medium text-teal-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-teal-900">{labels.governanceNote}</p>
        <Link
          href="/app/aipify-hosts"
          className="mt-4 inline-flex rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-50"
        >
          {labels.backToHosts}
        </Link>
      </section>

      {dashboard.notifications.length > 0 && (
        <section className="space-y-2">
          {dashboard.notifications.filter((n) => n.active).map((n) => (
            <div key={n.key} className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {n.message}
            </div>
          ))}
        </section>
      )}

      <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {dashboard.filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 ${
                activeFilter === f.key
                  ? "bg-teal-700 text-white ring-teal-700"
                  : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {dashboard.properties.length > 0 && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700">{labels.filterProperty}</span>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">{labels.allPropertiesOption}</option>
              {dashboard.properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </section>

      <nav className="flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
        {dashboard.sections.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActiveSection(s.key as HostsOperationsSectionKey)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium ${
              activeSection === s.key
                ? "border border-b-0 border-gray-200 bg-white text-teal-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {activeSection === "today" && (
        <section className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label={labels.arrivalsToday} value={snap.arrivals_today} />
            <MetricCard label={labels.departuresToday} value={snap.departures_today} />
            <MetricCard label={labels.openGuestRequests} value={snap.open_guest_requests} />
            <MetricCard label={labels.pendingApprovals} value={snap.pending_approvals} />
            <MetricCard label={labels.cleaningStatus} value={snap.cleaning_status} />
            <MetricCard label={labels.maintenanceStatus} value={snap.maintenance_status} />
            <MetricCard label={labels.activeIncidents} value={snap.active_incidents} />
          </dl>
          {snap.arrivals_today === 0 && (
            <EmptyBoard title={labels.emptyTodayTitle} message={labels.emptyTodayMessage} />
          )}
        </section>
      )}

      {activeSection === "arrivals" && (
        <section>
          {boards.arrivals.length === 0 ? (
            <EmptyBoard title={labels.emptyArrivalsTitle} message={labels.emptyArrivalsMessage} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">{labels.guestName}</th>
                    <th className="px-4 py-3">{labels.property}</th>
                    <th className="px-4 py-3">{labels.arrivalTime}</th>
                    <th className="px-4 py-3">{labels.checkInStatus}</th>
                    <th className="px-4 py-3">{labels.cleaningStatusCol}</th>
                    <th className="px-4 py-3">{labels.propertyReadiness}</th>
                  </tr>
                </thead>
                <tbody>
                  {boards.arrivals.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.guest_name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.property}</td>
                      <td className="px-4 py-3 text-gray-700">{row.arrival_time}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.check_in_status, labels)}`}>
                          {statusLabel(row.check_in_status, labels)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.cleaning_status, labels)}`}>
                          {statusLabel(row.cleaning_status, labels)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.property_readiness, labels)}`}>
                          {statusLabel(row.property_readiness, labels)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeSection === "departures" && (
        <section>
          {boards.departures.length === 0 ? (
            <EmptyBoard title={labels.emptyDeparturesTitle} message={labels.emptyDeparturesMessage} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">{labels.guestName}</th>
                    <th className="px-4 py-3">{labels.property}</th>
                    <th className="px-4 py-3">{labels.departureTime}</th>
                    <th className="px-4 py-3">{labels.checkoutStatus}</th>
                    <th className="px-4 py-3">{labels.inspectionStatus}</th>
                    <th className="px-4 py-3">{labels.cleaningAssigned}</th>
                  </tr>
                </thead>
                <tbody>
                  {boards.departures.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.guest_name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.property}</td>
                      <td className="px-4 py-3 text-gray-700">{row.departure_time}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.checkout_status, labels)}`}>
                          {statusLabel(row.checkout_status, labels)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.inspection_status, labels)}`}>
                          {statusLabel(row.inspection_status, labels)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row.cleaning_assigned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeSection === "cleaning" && (
        <section>
          {boards.cleaning.length === 0 ? (
            <EmptyBoard title={labels.emptyCleaningTitle} message={labels.emptyCleaningMessage} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">{labels.property}</th>
                    <th className="px-4 py-3">{labels.assignedCleaner}</th>
                    <th className="px-4 py-3">{labels.scheduledTime}</th>
                    <th className="px-4 py-3">{labels.completionStatus}</th>
                    <th className="px-4 py-3">{labels.reportedIssues}</th>
                    <th className="px-4 py-3">{labels.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {boards.cleaning.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
                      <td className="px-4 py-3 text-gray-700">{row.assigned_cleaner}</td>
                      <td className="px-4 py-3 text-gray-700">{row.scheduled_time}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.completion_status, labels)}`}>
                          {statusLabel(row.completion_status, labels)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.reported_issues ?? "—"}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void handleAction("status_change", row.id, "cleaning", "completed")}
                          className="text-xs font-medium text-teal-700 hover:text-teal-900 disabled:opacity-60"
                        >
                          {labels.markCompleted}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeSection === "maintenance" && (
        <section>
          {boards.maintenance.length === 0 ? (
            <EmptyBoard title={labels.emptyMaintenanceTitle} message={labels.emptyMaintenanceMessage} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">{labels.property}</th>
                    <th className="px-4 py-3">{labels.issueSummary}</th>
                    <th className="px-4 py-3">{labels.priority}</th>
                    <th className="px-4 py-3">{labels.assignedTo}</th>
                    <th className="px-4 py-3">{labels.dueDate}</th>
                    <th className="px-4 py-3">{labels.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {boards.maintenance.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
                      <td className="px-4 py-3 text-gray-700">{row.issue_summary}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.priority, labels)}`}>
                          {statusLabel(row.priority, labels)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row.assigned_to ?? labels.unassigned}</td>
                      <td className="px-4 py-3 text-gray-700">{row.due_date}</td>
                      <td className="px-4 py-3">
                        {!row.assigned_to && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void handleAction("assign", row.id, "maintenance")}
                            className="text-xs font-medium text-teal-700 hover:text-teal-900 disabled:opacity-60"
                          >
                            {labels.assignTask}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeSection === "guest_requests" && (
        <section>
          {boards.guest_requests.length === 0 ? (
            <EmptyBoard title={labels.emptyGuestRequestsTitle} message={labels.emptyGuestRequestsMessage} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">{labels.property}</th>
                    <th className="px-4 py-3">{labels.requestType}</th>
                    <th className="px-4 py-3">{labels.submittedTime}</th>
                    <th className="px-4 py-3">{labels.assignedTo}</th>
                    <th className="px-4 py-3">{labels.statusColumn}</th>
                  </tr>
                </thead>
                <tbody>
                  {boards.guest_requests.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
                      <td className="px-4 py-3 text-gray-700">{row.request_type}</td>
                      <td className="px-4 py-3 text-gray-700">{row.submitted_time}</td>
                      <td className="px-4 py-3 text-gray-700">{row.assigned_to ?? labels.unassigned}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status, labels)}`}>
                          {statusLabel(row.status, labels)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeSection === "incidents" && (
        <section>
          {boards.incidents.length === 0 ? (
            <EmptyBoard title={labels.emptyIncidentsTitle} message={labels.emptyIncidentsMessage} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">{labels.property}</th>
                    <th className="px-4 py-3">{labels.incidentType}</th>
                    <th className="px-4 py-3">{labels.severity}</th>
                    <th className="px-4 py-3">{labels.statusColumn}</th>
                    <th className="px-4 py-3">{labels.owner}</th>
                  </tr>
                </thead>
                <tbody>
                  {boards.incidents.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
                      <td className="px-4 py-3 text-gray-700">{row.incident_type}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.severity, labels)}`}>
                          {statusLabel(row.severity, labels)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status, labels)}`}>
                          {statusLabel(row.status, labels)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeSection === "approvals" && (
        <section>
          {boards.approvals.length === 0 ? (
            <EmptyBoard title={labels.emptyApprovalsTitle} message={labels.emptyApprovalsMessage} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">{labels.requestType}</th>
                    <th className="px-4 py-3">{labels.property}</th>
                    <th className="px-4 py-3">{labels.submittedBy}</th>
                    <th className="px-4 py-3">{labels.waitingSince}</th>
                    <th className="px-4 py-3">{labels.approvalStatus}</th>
                    <th className="px-4 py-3">{labels.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {boards.approvals.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.request_type}</td>
                      <td className="px-4 py-3 text-gray-700">{row.property}</td>
                      <td className="px-4 py-3 text-gray-700">{row.submitted_by}</td>
                      <td className="px-4 py-3 text-gray-700">{row.waiting_since}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.approval_status, labels)}`}>
                          {statusLabel(row.approval_status, labels)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void handleAction("approve", row.id, "approvals")}
                            className="text-xs font-medium text-emerald-700 hover:text-emerald-900 disabled:opacity-60"
                          >
                            {labels.approve}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void handleAction("decline", row.id, "approvals")}
                            className="text-xs font-medium text-gray-600 hover:text-gray-900 disabled:opacity-60"
                          >
                            {labels.decline}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {actionMessage && (
        <p className="rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900">{actionMessage}</p>
      )}
    </div>
  );
}
