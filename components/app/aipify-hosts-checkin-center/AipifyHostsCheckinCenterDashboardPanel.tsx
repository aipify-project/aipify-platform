"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsCheckinCenterActionResult,
  parseAipifyHostsCheckinCenterDashboard,
  type HostsCheckinCenterDashboard,
  type HostsCheckinCenterSectionKey,
  type HostsCheckinRow,
  type HostsCheckoutRow,
} from "@/lib/aipify/aipify-hosts-checkin-center";

type Props = { labels: Record<string, string> };

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    scheduled: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    preparing: "bg-amber-50 text-amber-900 ring-amber-200",
    ready: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    guest_arrived: "bg-sky-50 text-sky-800 ring-sky-200",
    completed: "bg-gray-100 text-gray-600 ring-gray-200",
    guest_departed: "bg-violet-50 text-violet-800 ring-violet-200",
    inspection_pending: "bg-orange-50 text-orange-900 ring-orange-200",
    cleaning_pending: "bg-amber-50 text-amber-900 ring-amber-200",
    ready_indicator: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    attention_required: "bg-amber-50 text-amber-900 ring-amber-200",
    not_ready: "bg-red-50 text-red-800 ring-red-200",
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

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ReadinessFlags({ row, labels }: { row: HostsCheckinRow; labels: Record<string, string> }) {
  const flags = [
    { key: "cleaning", ok: row.cleaning_completed },
    { key: "inspection", ok: row.inspection_completed },
    { key: "supplies", ok: row.supplies_ready },
    { key: "access", ok: row.access_instructions_available },
    { key: "team", ok: row.team_assigned_flag },
  ];
  return (
    <div className="flex flex-wrap gap-1">
      {flags.map((f) => (
        <span key={f.key} className={`rounded px-1.5 py-0.5 text-xs ${f.ok ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"}`}>
          {labels[`flag_${f.key}`]}
        </span>
      ))}
    </div>
  );
}

function CheckinTable({
  rows,
  labels,
  busy,
  onAction,
}: {
  rows: HostsCheckinRow[];
  labels: Record<string, string>;
  busy: boolean;
  onAction: (id: string, action: string) => void;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyCheckinsTitle} message={labels.emptyCheckinsMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.guestName}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.checkInDate}</th>
            <th className="px-4 py-3">{labels.checkOutDate}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.readyScore}</th>
            <th className="px-4 py-3">{labels.readiness}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{row.guest_name}</div>
                <div className="text-xs text-gray-500">{row.guest_info_summary}</div>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{row.check_in_date}</td>
              <td className="px-4 py-3 text-gray-700">{row.expected_check_out_date}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.checkin_status)}`}>
                  {labelFor(labels, "cistatus", row.checkin_status)}
                </span>
              </td>
              <td className="px-4 py-3 font-semibold text-gray-900">{row.ready_score}%</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.readiness_indicator)}`}>
                  {labelFor(labels, "readyind", row.readiness_indicator)}
                </span>
                <div className="mt-1"><ReadinessFlags row={row} labels={labels} /></div>
              </td>
              <td className="px-4 py-3 min-w-[220px]">
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy} onClick={() => onAction(row.id, "view_guest_information")} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.viewGuestInfo}</button>
                  <button type="button" disabled={busy} onClick={() => onAction(row.id, "view_access_instructions")} className="text-xs font-medium text-sky-700 disabled:opacity-60">{labels.viewAccess}</button>
                  <button type="button" disabled={busy} onClick={() => onAction(row.id, "confirm_property_ready")} className="text-xs font-medium text-emerald-700 disabled:opacity-60">{labels.confirmReady}</button>
                  <button type="button" disabled={busy} onClick={() => onAction(row.id, "assign_outstanding_tasks")} className="text-xs font-medium text-violet-700 disabled:opacity-60">{labels.assignTasks}</button>
                  {row.checkin_status !== "guest_arrived" && (
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "guest_arrived")} className="text-xs font-medium text-teal-700 disabled:opacity-60">{labels.guestArrived}</button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">{row.access_instructions}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CheckoutTable({
  rows,
  labels,
  busy,
  onAction,
  showReviews,
}: {
  rows: HostsCheckoutRow[];
  labels: Record<string, string>;
  busy: boolean;
  onAction: (id: string, action: string) => void;
  showReviews?: boolean;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyCheckoutsTitle} message={labels.emptyCheckoutsMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.guestName}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.checkoutDate}</th>
            <th className="px-4 py-3">{labels.status}</th>
            {showReviews && <th className="px-4 py-3">{labels.departureOutcome}</th>}
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.guest_name}</td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{row.checkout_date}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.checkout_status)}`}>
                  {labelFor(labels, "costatus", row.checkout_status)}
                </span>
              </td>
              {showReviews && (
                <td className="px-4 py-3 text-gray-700">
                  {labelFor(labels, "outcome", row.departure_outcome)}
                  {row.review_notes && <p className="text-xs text-gray-500 mt-1">{row.review_notes}</p>}
                </td>
              )}
              <td className="px-4 py-3 min-w-[200px]">
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy} onClick={() => onAction(row.id, "schedule_cleaning")} className="text-xs font-medium text-teal-700 disabled:opacity-60">{labels.scheduleCleaning}</button>
                  <button type="button" disabled={busy} onClick={() => onAction(row.id, "schedule_inspection")} className="text-xs font-medium text-orange-700 disabled:opacity-60">{labels.scheduleInspection}</button>
                  <button type="button" disabled={busy} onClick={() => onAction(row.id, "record_property_status")} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.recordStatus}</button>
                  <button type="button" disabled={busy} onClick={() => onAction(row.id, "report_issues")} className="text-xs font-medium text-red-700 disabled:opacity-60">{labels.reportIssues}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AipifyHostsCheckinCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsCheckinCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsCheckinCenterSectionKey>("upcoming_check_ins");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch(`/api/aipify/aipify-hosts/checkin-center/dashboard?section=${activeSection}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsCheckinCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  const runCheckinAction = (id: string, actionType: string) => {
    void runAction({ action_type: actionType, record_type: "checkin", record_id: id });
  };

  const runCheckoutAction = (id: string, actionType: string) => {
    void runAction({
      action_type: actionType,
      record_type: "checkout",
      record_id: id,
      maintenance: actionType === "report_issues" ? true : undefined,
      departure_outcome: actionType === "report_issues" ? "follow_up_required" : undefined,
      notes: actionType === "record_property_status" ? "Departure recorded" : actionType === "report_issues" ? "Issue reported from Check-In Center" : undefined,
    });
  };

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/checkin-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsCheckinCenterActionResult(await res.json());
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

  const isCheckoutSection = activeSection === "upcoming_check_outs" || activeSection === "checkout_reviews";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-6">
        <p className="text-sm font-medium text-rose-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-rose-900">{labels.governanceNote}</p>
        <Link href="/app/aipify-hosts" className="mt-4 inline-flex rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-900 hover:bg-rose-50">
          {labels.backToHosts}
        </Link>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.todaysCheckIns} value={dashboard.stats.todays_check_ins} />
        <MetricCard label={labels.todaysCheckOuts} value={dashboard.stats.todays_check_outs} />
        <MetricCard label={labels.propertiesAttention} value={dashboard.stats.properties_requiring_attention} />
        <MetricCard label={labels.activeStays} value={dashboard.stats.active_stays} />
      </dl>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900">{labels.readinessOverview}</h3>
        <dl className="mt-3 grid grid-cols-3 gap-4 text-sm">
          <div><dt className="text-gray-500">{labels.readyCount}</dt><dd className="text-lg font-semibold text-emerald-700">{dashboard.stats.readiness_ready}</dd></div>
          <div><dt className="text-gray-500">{labels.attentionCount}</dt><dd className="text-lg font-semibold text-amber-700">{dashboard.stats.readiness_attention}</dd></div>
          <div><dt className="text-gray-500">{labels.notReadyCount}</dt><dd className="text-lg font-semibold text-red-700">{dashboard.stats.readiness_not_ready}</dd></div>
        </dl>
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm sm:grid-cols-4">
          <div><dt className="text-gray-500">{labels.arrivalTasks}</dt><dd className="font-medium">{dashboard.task_preparation.arrival_tasks}</dd></div>
          <div><dt className="text-gray-500">{labels.departureTasks}</dt><dd className="font-medium">{dashboard.task_preparation.departure_tasks}</dd></div>
          <div><dt className="text-gray-500">{labels.inspectionTasks}</dt><dd className="font-medium">{dashboard.task_preparation.inspection_tasks}</dd></div>
          <div><dt className="text-gray-500">{labels.cleaningTasks}</dt><dd className="font-medium">{dashboard.task_preparation.cleaning_tasks}</dd></div>
        </dl>
      </section>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsCheckinCenterSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-rose-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {isCheckoutSection ? (
        <CheckoutTable
          rows={activeSection === "checkout_reviews" ? dashboard.checkout_reviews : dashboard.check_outs}
          labels={labels}
          busy={busy}
          onAction={runCheckoutAction}
          showReviews={activeSection === "checkout_reviews"}
        />
      ) : (
        <CheckinTable rows={dashboard.check_ins} labels={labels} busy={busy} onAction={runCheckinAction} />
      )}
    </div>
  );
}
