"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseSchedulingOperationsCenter,
  type BookingItem,
  type ResourceItem,
  type ScheduleEventItem,
  type SchedulingOperationsCenter,
  type SchedulingOperationsLabels,
} from "@/lib/scheduling-operations";

type Tab =
  | "overview"
  | "calendar"
  | "events"
  | "bookings"
  | "appointments"
  | "resources"
  | "availability"
  | "reports";

type CalendarView = "day" | "week" | "month" | "agenda";

const STATUS_STYLE: Record<string, string> = {
  planned: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  scheduled: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  confirmed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  requires_action: "bg-amber-50 text-amber-900 ring-amber-200",
  awaiting_approval: "bg-amber-50 text-amber-900 ring-amber-200",
  restricted: "bg-red-50 text-red-900 ring-red-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  cancelled: "bg-red-50 text-red-900 ring-red-200",
};

type Props = {
  labels: SchedulingOperationsLabels;
  initialTab?: Tab;
};

function formatRange(starts: string, ends: string) {
  try {
    const s = new Date(starts);
    const e = new Date(ends);
    return `${s.toLocaleString()} – ${e.toLocaleTimeString()}`;
  } catch {
    return starts;
  }
}

export function SchedulingOperationsPanel({ labels, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<SchedulingOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [view, setView] = useState<CalendarView>("week");
  const [busy, setBusy] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [recurringTitle, setRecurringTitle] = useState("");
  const [resourceId, setResourceId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/scheduling-operations");
    if (res.ok) setCenter(parseSchedulingOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/scheduling-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const overview = center.overview ?? {};
  const reports = center.reports ?? {};
  const calendarEvents = center.calendar_events ?? [];
  const events = center.events ?? [];
  const bookings = center.bookings ?? [];
  const appointments = center.appointments ?? [];
  const resources = center.resources ?? [];
  const availability = center.availability ?? [];
  const recurring = center.recurring ?? [];
  const calendarRoute = center.routes?.calendar ?? "/app/calendar";

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "calendar", label: labels.calendar },
    { id: "events", label: labels.events },
    { id: "bookings", label: labels.bookings },
    { id: "appointments", label: labels.appointments },
    { id: "resources", label: labels.resources },
    { id: "availability", label: labels.availability },
    { id: "reports", label: labels.reports },
  ];

  const viewButtons: { id: CalendarView; label: string }[] = [
    { id: "day", label: labels.viewDay },
    { id: "week", label: labels.viewWeek },
    { id: "month", label: labels.viewMonth },
    { id: "agenda", label: labels.viewAgenda },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        <p className="mt-2 text-xs text-aipify-text-muted">{center.principle ?? labels.principle}</p>
        {center.philosophy ? <p className="mt-1 text-xs text-aipify-text-muted">{center.philosophy}</p> : null}
        <p className="mt-1 text-xs text-aipify-text-muted">{labels.mobileReady}</p>
        <Link href={calendarRoute} className={`mt-3 inline-block text-sm ${AipifyShellClasses.link}`}>
          {labels.openCalendar}
        </Link>
      </header>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={
              tab === item.id
                ? `${AipifyShellClasses.primaryButton} text-sm`
                : `${AipifyShellClasses.secondaryButton} text-sm`
            }
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [labels.upcomingEvents, overview.upcoming_events],
              [labels.myUpcoming, overview.my_upcoming],
              [labels.activeBookings, overview.active_bookings],
              [labels.scheduleConflicts, overview.schedule_conflicts],
              [labels.resourcesAvailable, overview.resources_available],
              [labels.recurringSchedules, overview.recurring_schedules],
              [labels.capacityUtilization, overview.capacity_utilization_pct],
            ] as [string, string | number][]
          ).map(([label, value]) => (
            <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      ) : null}

      {(tab === "calendar") ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {viewButtons.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className={
                  view === v.id
                    ? `${AipifyShellClasses.primaryButton} text-sm`
                    : `${AipifyShellClasses.secondaryButton} text-sm`
                }
              >
                {v.label}
              </button>
            ))}
          </div>
          <ItemList
            emptyTitle={labels.noEvents}
            emptyMessage={labels.emptyHint}
            items={calendarEvents}
            render={(e: ScheduleEventItem) => <EventCard key={e.id} event={e} labels={labels} />}
          />
        </div>
      ) : null}

      {(tab === "events" || tab === "appointments") ? (
        <div className="space-y-4">
          {tab === "events" ? (
            <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
              <input
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder={labels.eventTitle}
                className={AipifyShellClasses.input}
              />
              <button
                type="button"
                disabled={busy || !eventTitle.trim()}
                onClick={() =>
                  void runAction("create_event", {
                    title: eventTitle.trim(),
                    event_type: "meeting",
                    status: "planned",
                  }).then(() => setEventTitle(""))
                }
                className={AipifyShellClasses.primaryButton}
              >
                {labels.createEvent}
              </button>
            </div>
          ) : null}
          <ItemList
            emptyTitle={tab === "appointments" ? labels.appointments : labels.noEvents}
            emptyMessage={labels.emptyHint}
            items={tab === "appointments" ? appointments : events}
            render={(e: ScheduleEventItem) => (
              <EventCard
                key={e.id}
                event={e}
                labels={labels}
                onCancel={() => void runAction("cancel_event", { event_id: e.id })}
                onComplete={() => void runAction("complete_event", { event_id: e.id })}
                busy={busy}
              />
            )}
          />
        </div>
      ) : null}

      {tab === "bookings" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 md:grid-cols-3`}>
            <input
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder={labels.eventTitle}
              className={AipifyShellClasses.input}
            />
            <select
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              className={AipifyShellClasses.input}
            >
              <option value="">{labels.resources}</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={busy || !eventTitle.trim() || !resourceId}
              onClick={() =>
                void runAction("book_resource", {
                  title: eventTitle.trim(),
                  resource_id: resourceId,
                  event_type: "booking",
                }).then(() => {
                  setEventTitle("");
                  setResourceId("");
                })
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.bookResource}
            </button>
          </div>
          <ItemList
            emptyTitle={labels.noBookings}
            emptyMessage={labels.emptyHint}
            items={bookings}
            render={(b: BookingItem) => (
              <div key={b.booking_id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <h3 className="font-semibold text-aipify-text">{b.event_title}</h3>
                <p className="text-aipify-text-secondary">
                  {b.resource_name} · {formatRange(b.starts_at, b.ends_at)}
                </p>
                {b.conflict_warning ? (
                  <p className="mt-1 text-xs text-amber-700">{labels.scheduleConflicts}</p>
                ) : null}
              </div>
            )}
          />
        </div>
      ) : null}

      {tab === "resources" ? (
        <ItemList
          emptyTitle={labels.noResources}
          emptyMessage={labels.emptyHint}
          items={resources}
          render={(r: ResourceItem) => (
            <div key={r.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h3 className="font-semibold text-aipify-text">{r.name}</h3>
              <p className="text-aipify-text-secondary">
                {r.resource_type.replace(/_/g, " ")}
                {r.location ? ` · ${r.location}` : ""}
              </p>
            </div>
          )}
        />
      ) : null}

      {tab === "availability" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void runAction("block_availability", {
                  block_type: "blocked",
                  starts_at: new Date().toISOString(),
                  ends_at: new Date(Date.now() + 3600000).toISOString(),
                  reason: "Blocked",
                })
              }
              className={AipifyShellClasses.secondaryButton}
            >
              {labels.blockAvailability}
            </button>
          </div>
          <ItemList
            emptyTitle={labels.availability}
            emptyMessage={labels.emptyHint}
            items={availability}
            render={(a) => (
              <div key={a.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-semibold text-aipify-text">{a.block_type.replace(/_/g, " ")}</p>
                <p className="text-aipify-text-secondary">{formatRange(a.starts_at, a.ends_at)}</p>
                {a.reason ? <p className="text-xs text-aipify-text-muted">{a.reason}</p> : null}
              </div>
            )}
          />
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ReportMetric label={labels.meetingVolume} value={reports.meeting_volume_30d} />
            <ReportMetric label={labels.scheduleConflicts} value={reports.schedule_conflicts} />
            <ReportMetric label={labels.capacityUtilization} value={reports.capacity_utilization_pct} />
          </div>
          {recurring.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-aipify-text">{labels.recurringSchedules}</h2>
              {recurring.map((r) => (
                <div key={r.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <p className="font-semibold text-aipify-text">{r.title}</p>
                  <p className="text-aipify-text-secondary">{r.frequency}</p>
                </div>
              ))}
            </section>
          ) : null}
          <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
            <p className="text-sm font-semibold text-aipify-text">{labels.externalSync}</p>
            <p className="mt-1 text-xs text-aipify-text-muted">
              Outlook · Microsoft 365 · Google Calendar · Apple Calendar · Exchange
            </p>
          </div>
          {center.audit_recent && center.audit_recent.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
              {center.audit_recent.map((a, i) => (
                <div key={i} className={`${AipifyShellClasses.surfaceCard} p-3 text-sm`}>
                  <p className="text-aipify-text">{a.summary}</p>
                </div>
              ))}
            </section>
          ) : null}
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input
              value={recurringTitle}
              onChange={(e) => setRecurringTitle(e.target.value)}
              placeholder={labels.recurringTitle}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !recurringTitle.trim()}
              onClick={() =>
                void runAction("create_recurring", {
                  title: recurringTitle.trim(),
                  frequency: "weekly",
                }).then(() => setRecurringTitle(""))
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createRecurring}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EventCard({
  event,
  labels,
  onCancel,
  onComplete,
  busy,
}: {
  event: ScheduleEventItem;
  labels: SchedulingOperationsLabels;
  onCancel?: () => void;
  onComplete?: () => void;
  busy?: boolean;
}) {
  const style = STATUS_STYLE[event.status] ?? STATUS_STYLE.planned;
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs text-aipify-text-muted">{event.event_number}</p>
      <h3 className="font-semibold text-aipify-text">{event.title}</h3>
      <p className="text-aipify-text-secondary">{formatRange(event.starts_at, event.ends_at)}</p>
      <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${style}`}>
        {labels.status}: {event.status.replace(/_/g, " ")}
      </span>
      {(onCancel || onComplete) && event.status !== "cancelled" && event.status !== "completed" ? (
        <div className="mt-3 flex gap-2">
          {onComplete ? (
            <button type="button" disabled={busy} onClick={onComplete} className={AipifyShellClasses.primaryButton}>
              {labels.completeEvent}
            </button>
          ) : null}
          {onCancel ? (
            <button type="button" disabled={busy} onClick={onCancel} className={AipifyShellClasses.secondaryButton}>
              {labels.cancelEvent}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ReportMetric({ label, value }: { label: string; value: unknown }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
      <p className="text-xs text-aipify-text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold text-aipify-text">{value != null ? String(value) : "—"}</p>
    </div>
  );
}

function ItemList<T>({
  items,
  render,
  emptyTitle,
  emptyMessage,
}: {
  items: T[];
  render: (item: T) => ReactNode;
  emptyTitle: string;
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return <PlatformEmptyState title={emptyTitle} message={emptyMessage} />;
  }
  return <div className="grid gap-3 md:grid-cols-2">{items.map(render)}</div>;
}
