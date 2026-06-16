"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsBookingCenterActionResult,
  parseAipifyHostsBookingCenterDashboard,
  type HostsBookingCancellationRow,
  type HostsBookingCenterDashboard,
  type HostsBookingReports,
  type HostsBookingReservationRow,
  type HostsBookingSectionKey,
  type HostsBookingTimelineRow,
} from "@/lib/aipify/aipify-hosts-booking-center";

type Props = { labels: Record<string, string> };

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    inquiry: "bg-gray-100 text-gray-700 ring-gray-200",
    pending: "bg-amber-50 text-amber-900 ring-amber-200",
    confirmed: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    checked_in: "bg-sky-50 text-sky-800 ring-sky-200",
    checked_out: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    cancelled: "bg-red-50 text-red-800 ring-red-200",
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

function ReservationsTable({
  rows,
  labels,
  busy,
  onAction,
}: {
  rows: HostsBookingReservationRow[];
  labels: Record<string, string>;
  busy: boolean;
  onAction: (body: Record<string, unknown>) => void;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyReservationsTitle} message={labels.emptyReservationsMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.reference}</th>
            <th className="px-4 py-3">{labels.guestName}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.checkIn}</th>
            <th className="px-4 py-3">{labels.checkOut}</th>
            <th className="px-4 py-3">{labels.guests}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.is_arrival_today ? "bg-sky-50/30" : row.is_departure_today ? "bg-violet-50/30" : ""}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{row.reservation_reference}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{row.guest_name}</div>
                {row.booking_channel && <div className="text-xs text-gray-500">{row.booking_channel}</div>}
              </td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 text-gray-600">
                {row.check_in_date}
                {row.is_arrival_today && <span className="ml-1 text-xs font-medium text-sky-800">{labels.arrivalToday}</span>}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {row.check_out_date}
                {row.is_departure_today && <span className="ml-1 text-xs font-medium text-violet-800">{labels.departureToday}</span>}
              </td>
              <td className="px-4 py-3 text-gray-700">{row.number_of_guests}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.booking_status)}`}>{labelFor(labels, "bookingStatus", row.booking_status)}</span>
              </td>
              <td className="px-4 py-3 min-w-[220px]">
                <div className="flex flex-wrap gap-2">
                  {row.property_id && (
                    <Link href={`/app/aipify-hosts/properties?property=${row.property_id}`} className="text-xs font-medium text-indigo-700">{labels.viewProperty}</Link>
                  )}
                  <Link href="/app/aipify-hosts/guests" className="text-xs font-medium text-indigo-700">{labels.openGuestProfile}</Link>
                  <Link href="/app/aipify-hosts/check-in" className="text-xs font-medium text-indigo-700">{labels.openCheckIn}</Link>
                  {row.booking_status === "pending" && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "confirm_reservation", reservation_id: row.id })} className="text-xs font-medium text-emerald-700 disabled:opacity-60">{labels.confirmReservation}</button>
                  )}
                  {row.booking_status === "confirmed" && row.is_arrival_today && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "check_in_guest", reservation_id: row.id })} className="text-xs font-medium text-sky-700 disabled:opacity-60">{labels.checkInGuest}</button>
                  )}
                  {row.booking_status === "checked_in" && (
                    <button type="button" disabled={busy} onClick={() => onAction({ action_type: "check_out_guest", reservation_id: row.id })} className="text-xs font-medium text-emerald-700 disabled:opacity-60">{labels.checkOutGuest}</button>
                  )}
                  <button type="button" disabled={busy} onClick={() => onAction({ action_type: "update_internal_notes", reservation_id: row.id, notes: row.internal_notes || labels.defaultNote })} className="text-xs font-medium text-gray-700 disabled:opacity-60">{labels.updateNotes}</button>
                  <button type="button" disabled={busy} onClick={() => onAction({ action_type: "validate_availability", reservation_id: row.id })} className="text-xs font-medium text-amber-700 disabled:opacity-60">{labels.validateAvailability}</button>
                </div>
                {row.internal_notes && <p className="mt-1 text-xs text-gray-500 line-clamp-1">{row.internal_notes}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CancellationsTable({ rows, labels }: { rows: HostsBookingCancellationRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyCancellationsTitle} message={labels.emptyCancellationsMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.reference}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.cancellationDate}</th>
            <th className="px-4 py-3">{labels.reason}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.reservation_reference}</td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 text-gray-600">{row.cancellation_date}</td>
              <td className="px-4 py-3 text-gray-700">{row.cancellation_reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportsPanel({ reports, labels }: { reports: HostsBookingReports | null; labels: Record<string, string> }) {
  if (!reports) return <EmptyBoard title={labels.emptyReportsTitle} message={labels.emptyReportsMessage} />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">{labels.reportSummary}</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-gray-500">{labels.totalReservations}</dt><dd className="font-medium">{reports.total_reservations}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">{labels.avgNights}</dt><dd className="font-medium">{reports.avg_nights}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">{labels.avgGuests}</dt><dd className="font-medium">{reports.avg_guests}</dd></div>
        </dl>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">{labels.byStatus}</h3>
        <ul className="mt-3 space-y-1 text-sm">
          {Object.entries(reports.by_status).map(([k, v]) => (
            <li key={k} className="flex justify-between"><span>{labelFor(labels, "bookingStatus", k)}</span><span className="font-medium">{v}</span></li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2">
        <h3 className="text-sm font-semibold text-gray-900">{labels.byChannel}</h3>
        <ul className="mt-3 flex flex-wrap gap-4 text-sm">
          {Object.entries(reports.by_channel).map(([k, v]) => (
            <li key={k} className="rounded-lg bg-gray-50 px-3 py-2"><span className="font-medium">{k}</span> · {v}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TimelineList({ rows, labels }: { rows: HostsBookingTimelineRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return null;
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">{labels.bookingTimeline}</h3>
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

export function AipifyHostsBookingCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsBookingCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsBookingSectionKey>("upcoming_bookings");
  const [propertyFilter, setPropertyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [guestFilter, setGuestFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection });
    if (propertyFilter) params.set("property_id", propertyFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (guestFilter) params.set("guest_name", guestFilter);
    const res = await fetch(`/api/aipify/aipify-hosts/booking-center/dashboard?${params}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsBookingCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection, propertyFilter, statusFilter, guestFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/booking-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsBookingCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(result.summary ?? labels.actionRecorded);
      await load();
    } else {
      setActionMessage(result.summary ?? labels.actionFailed);
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
      <section className="rounded-2xl border border-blue-100 bg-blue-50/40 p-6">
        <p className="text-sm font-medium text-blue-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-blue-900">{labels.governanceNote}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/app/aipify-hosts" className="inline-flex rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50">
            {labels.backToHosts}
          </Link>
          <Link href="/app/aipify-hosts/knowledge" className="inline-flex rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50">
            {labels.viewKnowledge}
          </Link>
        </div>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.arrivalsToday} value={dashboard.stats.arrivals_today} />
        <MetricCard label={labels.departuresToday} value={dashboard.stats.departures_today} />
        <MetricCard label={labels.upcomingReservations} value={dashboard.stats.upcoming_reservations} />
        <MetricCard label={labels.recentCancellations} value={dashboard.stats.recent_cancellations} sub={dashboard.stats.recent_cancellations > 0 ? labels.last30Days : undefined} />
      </dl>

      <section className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-gray-600">
          {labels.filterProperty}
          <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm">
            <option value="">{labels.allProperties}</option>
            {dashboard.properties.map((p) => (
              <option key={p.id} value={p.id}>{p.display_name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-gray-600">
          {labels.filterStatus}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm">
            <option value="">{labels.allStatuses}</option>
            {dashboard.booking_statuses.map((s) => (
              <option key={s} value={s}>{labelFor(labels, "bookingStatus", s)}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-gray-600">
          {labels.filterGuest}
          <input value={guestFilter} onChange={(e) => setGuestFilter(e.target.value)} placeholder={labels.guestNamePlaceholder} className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm" />
        </label>
      </section>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsBookingSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-blue-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {activeSection === "cancellations" && (
        <CancellationsTable rows={dashboard.cancellations} labels={labels} />
      )}
      {activeSection === "booking_reports" && (
        <ReportsPanel reports={dashboard.booking_reports} labels={labels} />
      )}
      {activeSection !== "cancellations" && activeSection !== "booking_reports" && (
        <ReservationsTable rows={dashboard.reservations} labels={labels} busy={busy} onAction={(body) => void runAction(body)} />
      )}

      <TimelineList rows={dashboard.timeline} labels={labels} />
    </div>
  );
}
