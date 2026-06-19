"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  formatEventTime,
  parseCalendarManagementCenter,
  statusLabel,
  type CalendarEvent,
  type CalendarManagementCenter,
  type CalendarManagementLabels,
  type CalendarView,
} from "@/lib/calendar-management";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab =
  | "myCalendar"
  | "teamCalendar"
  | "departmentCalendar"
  | "resourceCalendar"
  | "bookings"
  | "approvals"
  | "schedules"
  | "reports";

function EventRow({
  event,
  labels,
  onCancel,
  onApprove,
  onReject,
  showActions,
}: {
  event: CalendarEvent;
  labels: CalendarManagementLabels;
  onCancel?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {event.event_number ? (
              <span className="text-xs font-mono text-gray-500">{event.event_number}</span>
            ) : null}
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {statusLabel(labels, event.status)}
            </span>
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-800">
              {event.event_type.replace(/_/g, " ")}
            </span>
          </div>
          <h3 className="mt-1 font-semibold text-gray-900">{event.title}</h3>
          {event.description ? <p className="mt-1 text-sm text-gray-600 line-clamp-2">{event.description}</p> : null}
          <p className="mt-2 text-xs text-gray-500">{formatEventTime(event.starts_at, event.ends_at)}</p>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
            {event.location ? <span>{labels.location}: {event.location}</span> : null}
            {event.business_pack_key ? <span>{labels.pack}: {event.business_pack_key}</span> : null}
          </div>
        </div>
        {showActions ? (
          <div className="flex flex-wrap gap-2">
            {onApprove && event.status === "awaiting_approval" ? (
              <button type="button" onClick={() => onApprove(event.id)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white">
                {labels.approve}
              </button>
            ) : null}
            {onReject && event.status === "awaiting_approval" ? (
              <button type="button" onClick={() => onReject(event.id)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700">
                {labels.reject}
              </button>
            ) : null}
            {onCancel && event.status !== "cancelled" ? (
              <button type="button" onClick={() => onCancel(event.id)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700">
                {labels.cancel}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function EmptyEvents({ labels }: { labels: CalendarManagementLabels }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <p className="font-medium text-gray-900">{labels.noEvents}</p>
      <p className="mt-1 text-sm text-gray-600">{labels.noEventsHint}</p>
    </div>
  );
}

export function CalendarManagementPanel({ labels }: { labels: CalendarManagementLabels }) {
  const [center, setCenter] = useState<CalendarManagementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("myCalendar");
  const [view, setView] = useState<CalendarView>("agenda");
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [location, setLocation] = useState("");
  const [resourceId, setResourceId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/calendar");
    if (res.ok) setCenter(parseCalendarManagementCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/calendar/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  async function createEvent() {
    if (!title.trim() || !startsAt || !endsAt) return;
    await runAction("create_event", {
      title: title.trim(),
      description: description.trim(),
      starts_at: new Date(startsAt).toISOString(),
      ends_at: new Date(endsAt).toISOString(),
      location: location.trim() || undefined,
      resource_id: resourceId || undefined,
    });
    setTitle("");
    setDescription("");
    setStartsAt("");
    setEndsAt("");
    setLocation("");
    setResourceId("");
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return (
      <AipifyModuleAccessDenied message={labels.accessDenied} />
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "myCalendar", label: labels.myCalendar },
    { key: "teamCalendar", label: labels.teamCalendar },
    { key: "departmentCalendar", label: labels.departmentCalendar },
    { key: "resourceCalendar", label: labels.resourceCalendar },
    { key: "bookings", label: labels.bookings },
    { key: "approvals", label: labels.approvals },
    { key: "schedules", label: labels.schedules },
    { key: "reports", label: labels.reports },
  ];

  const viewOptions: { key: CalendarView; label: string }[] = [
    { key: "day", label: labels.viewDay },
    { key: "week", label: labels.viewWeek },
    { key: "month", label: labels.viewMonth },
    { key: "agenda", label: labels.viewAgenda },
  ];

  const overview = center.overview;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.personal_calendar_route ? (
          <Link href={center.personal_calendar_route} className="mt-3 inline-block text-sm text-indigo-700 hover:underline">
            {labels.personalCalendarLink}
          </Link>
        ) : null}
      </div>

      {overview ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label={labels.upcoming} value={overview.upcoming} />
          <StatCard label={labels.myCalendar} value={overview.my_upcoming} />
          <StatCard label={labels.pendingApprovals} value={overview.pending_approvals} highlight="indigo" />
          <StatCard label={labels.conflicts} value={overview.conflicts} highlight="amber" />
          <StatCard label={labels.leavePending} value={overview.leave_pending} />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {viewOptions.map((v) => (
          <button key={v.key} type="button" onClick={() => setView(v.key)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${view === v.key ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-700"}`}>
            {v.label}
          </button>
        ))}
      </div>

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-2 sm:flex-wrap sm:overflow-visible">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "myCalendar" ? (
        <div className="space-y-4">
          <CreateEventForm
            labels={labels}
            resources={center.resources ?? []}
            title={title}
            description={description}
            startsAt={startsAt}
            endsAt={endsAt}
            location={location}
            resourceId={resourceId}
            busy={busy}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onStartsAtChange={setStartsAt}
            onEndsAtChange={setEndsAt}
            onLocationChange={setLocation}
            onResourceIdChange={setResourceId}
            onSubmit={() => void createEvent()}
          />
          <EventList
            events={center.my_calendar ?? []}
            labels={labels}
            onCancel={(id) => void runAction("cancel_event", { event_id: id })}
          />
        </div>
      ) : null}

      {tab === "teamCalendar" ? (
        <EventList events={center.team_calendar ?? []} labels={labels} />
      ) : null}

      {tab === "departmentCalendar" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.department_calendar?.length ?? 0) === 0 ? (
            <EmptyEvents labels={labels} />
          ) : (
            center.department_calendar?.map((d) => (
              <div key={d.department_id} className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-gray-900">{d.department_name}</h3>
                <p className="mt-2 text-sm text-gray-600">{labels.upcoming}: {d.upcoming}</p>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "resourceCalendar" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.resources?.length ?? 0) === 0 ? (
            <EmptyEvents labels={labels} />
          ) : (
            center.resources?.map((r) => (
              <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-gray-900">{r.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{r.resource_type.replace(/_/g, " ")}</p>
                {r.location ? <p className="mt-1 text-xs text-gray-500">{labels.location}: {r.location}</p> : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "bookings" ? (
        <div className="space-y-3">
          {(center.bookings?.length ?? 0) === 0 ? (
            <EmptyEvents labels={labels} />
          ) : (
            center.bookings?.map((b) => (
              <div key={b.booking_id} className={`rounded-xl border p-4 ${b.conflict_warning ? "border-amber-200 bg-amber-50/40" : "border-gray-200 bg-white"}`}>
                <p className="font-semibold text-gray-900">{b.event_title}</p>
                <p className="mt-1 text-sm text-gray-600">{labels.resource}: {b.resource_name}</p>
                <p className="mt-1 text-xs text-gray-500">{new Date(b.starts_at).toLocaleString()}</p>
                {b.conflict_warning ? <p className="mt-2 text-xs font-medium text-amber-800">{labels.conflicts}</p> : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "approvals" ? (
        <div className="space-y-3">
          {(center.approvals?.length ?? 0) === 0 ? (
            <EmptyEvents labels={labels} />
          ) : (
            center.approvals?.map((a) => (
              <div key={a.approval_id} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                <p className="font-semibold text-gray-900">{a.event_title}</p>
                <p className="mt-1 text-xs text-gray-500">{new Date(a.starts_at).toLocaleString()}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" disabled={busy} onClick={() => void runAction("approve_event", { event_id: a.event_id })} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white">
                    {labels.approve}
                  </button>
                  <button type="button" disabled={busy} onClick={() => void runAction("reject_event", { event_id: a.event_id })} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700">
                    {labels.reject}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "schedules" ? (
        <div className="space-y-3">
          {(center.schedules?.length ?? 0) === 0 ? (
            <EmptyEvents labels={labels} />
          ) : (
            center.schedules?.map((s) => (
              <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="font-semibold text-gray-900">{s.title}</p>
                <p className="mt-1 text-sm text-gray-600">{labels.frequency}: {s.frequency}</p>
                <p className="mt-1 text-xs text-gray-500">{new Date(s.next_run_at).toLocaleString()}</p>
              </div>
            ))
          )}
          {(center.sync_connections?.length ?? 0) > 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-4">
              <p className="text-sm font-medium text-gray-900">{labels.syncPending}</p>
              <ul className="mt-2 space-y-1 text-xs text-gray-600">
                {center.sync_connections?.map((s) => (
                  <li key={s.id}>{s.provider} — {s.connection_status} ({s.sync_mode})</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === "reports" && center.reports ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.upcoming} value={center.reports.meeting_volume} />
            <StatCard label={labels.bookings} value={center.reports.booking_count} />
            {(center.reports.by_pack ?? []).map((p) => (
              <StatCard key={p.pack_key} label={`${labels.pack}: ${p.pack_key}`} value={p.count} />
            ))}
          </div>
          {center.manager_dashboard ? (
            <div className="rounded-xl border border-violet-100 bg-violet-50/30 p-4">
              <h3 className="font-semibold text-gray-900">{labels.managerDashboard}</h3>
              <p className="mt-2 text-sm text-gray-600">{center.manager_dashboard.team_availability_note}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string | number; highlight?: "amber" | "indigo" }) {
  const cls = highlight === "amber" ? "border-amber-100 bg-amber-50/40" : highlight === "indigo" ? "border-indigo-100 bg-indigo-50/40" : "border-gray-200 bg-white";
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function EventList({
  events,
  labels,
  onCancel,
}: {
  events: CalendarEvent[];
  labels: CalendarManagementLabels;
  onCancel?: (id: string) => void;
}) {
  if (events.length === 0) return <EmptyEvents labels={labels} />;
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventRow key={event.id} event={event} labels={labels} showActions={Boolean(onCancel)} onCancel={onCancel} />
      ))}
    </div>
  );
}

function CreateEventForm({
  labels,
  resources,
  title,
  description,
  startsAt,
  endsAt,
  location,
  resourceId,
  busy,
  onTitleChange,
  onDescriptionChange,
  onStartsAtChange,
  onEndsAtChange,
  onLocationChange,
  onResourceIdChange,
  onSubmit,
}: {
  labels: CalendarManagementLabels;
  resources: { id: string; name: string }[];
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  resourceId: string;
  busy: boolean;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onStartsAtChange: (v: string) => void;
  onEndsAtChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onResourceIdChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">{labels.createEvent}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-gray-700">{labels.eventTitle}</span>
          <input value={title} onChange={(e) => onTitleChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-gray-700">{labels.eventDescription}</span>
          <textarea value={description} onChange={(e) => onDescriptionChange(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">{labels.startsAt}</span>
          <input type="datetime-local" value={startsAt} onChange={(e) => onStartsAtChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">{labels.endsAt}</span>
          <input type="datetime-local" value={endsAt} onChange={(e) => onEndsAtChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">{labels.location}</span>
          <input value={location} onChange={(e) => onLocationChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        {resources.length > 0 ? (
          <label className="block">
            <span className="text-sm font-medium text-gray-700">{labels.resource}</span>
            <select value={resourceId} onChange={(e) => onResourceIdChange(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">—</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
      <button type="button" disabled={busy || !title.trim() || !startsAt || !endsAt} onClick={onSubmit} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
        {labels.save}
      </button>
    </div>
  );
}
