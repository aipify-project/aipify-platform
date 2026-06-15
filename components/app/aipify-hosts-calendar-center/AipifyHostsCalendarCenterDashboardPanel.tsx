"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsCalendarCenterActionResult,
  parseAipifyHostsCalendarCenterDashboard,
  type HostsCalendarBlockRow,
  type HostsCalendarCenterDashboard,
  type HostsCalendarCenterSectionKey,
  type HostsCalendarEventRow,
  type HostsCalendarViewKey,
  type HostsPropertyOccupancyRow,
} from "@/lib/aipify/aipify-hosts-calendar-center";

type Props = { labels: Record<string, string> };

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    available: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    occupied: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    arrival_today: "bg-sky-50 text-sky-800 ring-sky-200",
    departure_today: "bg-violet-50 text-violet-800 ring-violet-200",
    maintenance_blocked: "bg-amber-50 text-amber-900 ring-amber-200",
    inspection_blocked: "bg-orange-50 text-orange-900 ring-orange-200",
    unavailable: "bg-red-50 text-red-800 ring-red-200",
    confirmed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    pending: "bg-amber-50 text-amber-900 ring-amber-200",
    blocked: "bg-red-50 text-red-800 ring-red-200",
    completed: "bg-gray-100 text-gray-600 ring-gray-200",
    cancelled: "bg-gray-100 text-gray-500 ring-gray-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function eventTypeColor(type: string): string {
  const map: Record<string, string> = {
    reservation: "border-l-indigo-500",
    cleaning: "border-l-teal-500",
    maintenance: "border-l-amber-500",
    inspection: "border-l-orange-500",
    owner_block: "border-l-violet-500",
    operational_block: "border-l-red-500",
  };
  return map[type] ?? "border-l-gray-400";
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

function EventsTable({
  rows,
  labels,
  busy,
  onAddNotes,
}: {
  rows: HostsCalendarEventRow[];
  labels: Record<string, string>;
  busy: boolean;
  onAddNotes: (id: string, notes: string) => void;
}) {
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyEventsTitle} message={labels.emptyEventsMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.eventTitle}</th>
            <th className="px-4 py-3">{labels.eventType}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.startDate}</th>
            <th className="px-4 py-3">{labels.endDate}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.assignedUsers}</th>
            <th className="px-4 py-3">{labels.notes}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 border-l-4 ${eventTypeColor(row.event_type)}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{row.title}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "etype", row.event_type)}</td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{row.start_date}</td>
              <td className="px-4 py-3 text-gray-700">{row.end_date}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status)}`}>
                  {labelFor(labels, "estatus", row.status)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.assigned_users}</td>
              <td className="px-4 py-3 min-w-[180px]">
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={noteDraft[row.id] ?? row.internal_notes}
                    onChange={(e) => setNoteDraft({ ...noteDraft, [row.id]: e.target.value })}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onAddNotes(row.id, noteDraft[row.id] ?? row.internal_notes)}
                    className="text-xs font-medium text-indigo-700 disabled:opacity-60"
                  >
                    {labels.save}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OccupancyGrid({ rows, labels }: { rows: HostsPropertyOccupancyRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyOccupancyTitle} message={labels.emptyOccupancyMessage} />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((p) => (
        <div key={p.property_id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900">{p.property_name}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(p.occupancy_status)}`}>
              {labelFor(labels, "occ", p.occupancy_status)}
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div><dt className="text-gray-500">{labels.upcomingArrivals}</dt><dd className="font-medium">{p.upcoming_arrivals}</dd></div>
            <div><dt className="text-gray-500">{labels.upcomingDepartures}</dt><dd className="font-medium">{p.upcoming_departures}</dd></div>
          </dl>
        </div>
      ))}
    </div>
  );
}

function BlocksTable({
  rows,
  labels,
  busy,
  onUnblock,
}: {
  rows: HostsCalendarBlockRow[];
  labels: Record<string, string>;
  busy: boolean;
  onUnblock: (id: string) => void;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyBlocksTitle} message={labels.emptyBlocksMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.startDate}</th>
            <th className="px-4 py-3">{labels.endDate}</th>
            <th className="px-4 py-3">{labels.blockReason}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 text-gray-900">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{row.start_date}</td>
              <td className="px-4 py-3 text-gray-700">{row.end_date}</td>
              <td className="px-4 py-3 text-gray-700">{row.block_reason}</td>
              <td className="px-4 py-3">
                <button type="button" disabled={busy} onClick={() => onUnblock(row.id)} className="text-xs font-medium text-teal-700 disabled:opacity-60">{labels.unblockDates}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AgendaList({ rows, labels }: { rows: HostsCalendarEventRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyEventsTitle} message={labels.emptyEventsMessage} />;
  const sorted = [...rows].sort((a, b) => a.start_date.localeCompare(b.start_date));
  return (
    <ul className="space-y-2">
      {sorted.map((e) => (
        <li key={e.id} className={`rounded-lg border border-gray-200 border-l-4 bg-white px-4 py-3 ${eventTypeColor(e.event_type)}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-gray-900">{e.title}</span>
            <span className="text-xs text-gray-500">{e.start_date} → {e.end_date}</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{e.property} · {labelFor(labels, "etype", e.event_type)} · {e.assigned_users}</p>
        </li>
      ))}
    </ul>
  );
}

export function AipifyHostsCalendarCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsCalendarCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsCalendarCenterSectionKey>("master_calendar");
  const [activeView, setActiveView] = useState<HostsCalendarViewKey>("month");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [filterProperty, setFilterProperty] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [filterEventType, setFilterEventType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newEventType, setNewEventType] = useState("reservation");
  const [newPropertyId, setNewPropertyId] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newAssigned, setNewAssigned] = useState("");
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockProperty, setBlockProperty] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection, view: activeView });
    if (filterProperty) params.set("property_id", filterProperty);
    if (filterTeam) params.set("team_member", filterTeam);
    if (filterEventType) params.set("event_type", filterEventType);
    if (filterDateFrom) params.set("date_from", filterDateFrom);
    if (filterDateTo) params.set("date_to", filterDateTo);
    const res = await fetch(`/api/aipify/aipify-hosts/calendar-center/dashboard?${params}`);
    if (res.ok) {
      const parsed = parseAipifyHostsCalendarCenterDashboard(await res.json());
      setDashboard(parsed);
      if (parsed) setActiveView(parsed.active_view as HostsCalendarViewKey);
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection, activeView, filterProperty, filterTeam, filterEventType, filterDateFrom, filterDateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/calendar-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsCalendarCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(result.summary ?? labels.actionRecorded);
      setNewTitle("");
      setBlockReason("");
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

  const showEvents = activeSection !== "calendar_settings";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6">
        <p className="text-sm font-medium text-teal-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-teal-900">{labels.governanceNote}</p>
        <Link href="/app/aipify-hosts" className="mt-4 inline-flex rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-50">
          {labels.backToHosts}
        </Link>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label={labels.occupancyRate} value={`${dashboard.stats.occupancy_rate}%`} />
        <MetricCard label={labels.availableNights} value={dashboard.stats.available_nights} />
        <MetricCard label={labels.blockedNights} value={dashboard.stats.blocked_nights} />
        <MetricCard label={labels.upcomingArrivals} value={dashboard.stats.upcoming_arrivals} />
        <MetricCard label={labels.upcomingDepartures} value={dashboard.stats.upcoming_departures} />
      </dl>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsCalendarCenterSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-teal-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {showEvents && activeSection !== "occupancy_overview" && activeSection !== "availability_management" && (
        <section className="flex flex-wrap gap-2">
          {dashboard.calendar_views.map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setActiveView(view as HostsCalendarViewKey)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                activeView === view ? "bg-gray-800 text-white" : "border border-gray-200 bg-white text-gray-600"
              }`}
            >
              {labelFor(labels, "view", view)}
            </button>
          ))}
        </section>
      )}

      {showEvents && (
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.filters}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <select value={filterProperty} onChange={(e) => setFilterProperty(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">{labels.allProperties}</option>
              {dashboard.properties.map((p) => (
                <option key={p.id} value={p.id}>{p.display_name}</option>
              ))}
            </select>
            <select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">{labels.allTeamMembers}</option>
              {dashboard.team_members.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select value={filterEventType} onChange={(e) => setFilterEventType(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">{labels.allEventTypes}</option>
              {dashboard.event_types.map((t) => (
                <option key={t} value={t}>{labelFor(labels, "etype", t)}</option>
              ))}
            </select>
            <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <button type="button" onClick={() => void load()} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">{labels.applyFilters}</button>
          </div>
          <p className="text-xs text-gray-500">{labels.dateRange}: {dashboard.date_range.from} — {dashboard.date_range.to}</p>
        </section>
      )}

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {activeSection === "occupancy_overview" && (
        <OccupancyGrid rows={dashboard.property_occupancy} labels={labels} />
      )}

      {activeSection === "availability_management" && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">{labels.blockDates}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <select value={blockProperty} onChange={(e) => setBlockProperty(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="">{labels.selectProperty}</option>
                {dashboard.properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.display_name}</option>
                ))}
              </select>
              <input type="date" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input type="date" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input type="text" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder={labels.blockReasonPlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy || !blockStart || !blockEnd}
                onClick={() => void runAction({ action: "calendar_action", action_type: "block_dates", property_id: blockProperty || undefined, start_date: blockStart, end_date: blockEnd, reason: blockReason })}
                className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
              >
                {labels.blockDates}
              </button>
              <button
                type="button"
                disabled={busy || !blockStart || !blockEnd}
                onClick={() => void runAction({ action: "calendar_action", action_type: "create_operational_hold", property_id: blockProperty || undefined, start_date: blockStart, end_date: blockEnd, notes: blockReason })}
                className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-100 disabled:opacity-60"
              >
                {labels.createOperationalHold}
              </button>
            </div>
          </div>
          <BlocksTable rows={dashboard.blocked_periods} labels={labels} busy={busy} onUnblock={(id) => void runAction({ action: "calendar_action", action_type: "unblock_dates", block_id: id })} />
        </>
      )}

      {activeSection === "calendar_settings" && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">{labels.calendarSettingsTitle}</h3>
          <p className="text-sm text-gray-600">{labels.defaultViewLabel}: <strong>{labelFor(labels, "view", dashboard.calendar_settings.default_view)}</strong></p>
          <div className="flex flex-wrap gap-2">
            {dashboard.calendar_views.map((view) => (
              <button
                key={view}
                type="button"
                disabled={busy}
                onClick={() => void runAction({ action: "calendar_action", action_type: "update_default_view", default_view: view })}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  dashboard.calendar_settings.default_view === view ? "bg-teal-700 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                } disabled:opacity-60`}
              >
                {labelFor(labels, "view", view)}
              </button>
            ))}
          </div>
        </div>
      )}

      {(activeSection === "master_calendar" || activeSection === "property_calendars") && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">{labels.createEvent}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={labels.eventTitlePlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <select value={newEventType} onChange={(e) => setNewEventType(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                {dashboard.event_types.map((t) => (
                  <option key={t} value={t}>{labelFor(labels, "etype", t)}</option>
                ))}
              </select>
              <select value={newPropertyId} onChange={(e) => setNewPropertyId(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="">{labels.allProperties}</option>
                {dashboard.properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.display_name}</option>
                ))}
              </select>
              <input type="date" value={newStart} onChange={(e) => setNewStart(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input type="date" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input type="text" value={newAssigned} onChange={(e) => setNewAssigned(e.target.value)} placeholder={labels.assignedUsersPlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <button
              type="button"
              disabled={busy || !newTitle.trim() || !newStart || !newEnd}
              onClick={() => void runAction({ action: "create_event", title: newTitle, event_type: newEventType, property_id: newPropertyId || undefined, start_date: newStart, end_date: newEnd, assigned_users: newAssigned || undefined })}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {labels.createEvent}
            </button>
          </div>
          {activeView === "agenda" ? (
            <AgendaList rows={dashboard.calendar_events} labels={labels} />
          ) : (
            <EventsTable
              rows={dashboard.calendar_events}
              labels={labels}
              busy={busy}
              onAddNotes={(id, notes) => void runAction({ action: "calendar_action", action_type: "add_internal_notes", event_id: id, notes })}
            />
          )}
        </>
      )}
    </div>
  );
}
