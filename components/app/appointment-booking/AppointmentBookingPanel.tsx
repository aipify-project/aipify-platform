"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseAppointmentBookingCenter,
  type AppointmentBookingCenter,
  type AppointmentBookingSection,
} from "@/lib/appointment-booking-engine";
import type { AppointmentBookingLabels } from "@/lib/appointment-booking-engine/labels";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemCard({
  title,
  summary,
  badge,
  iconKey,
  textLabel,
}: {
  title: string;
  summary?: string;
  badge?: string;
  iconKey?: string;
  textLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {badge ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {iconKey && textLabel ? (
        <p className="mt-2 text-xs text-zinc-500">
          {iconKey} · {textLabel}
        </p>
      ) : null}
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
    </div>
  );
}

function pickRows(center: AppointmentBookingCenter, section: AppointmentBookingSection) {
  switch (section) {
    case "calendar":
      return [
        ...(center.calendar_connections ?? []),
        ...(center.slot_holds ?? []),
      ];
    case "appointments":
      return center.appointments ?? [];
    case "customers":
      return center.customers ?? [];
    case "services":
      return center.services ?? [];
    case "employees":
      return center.employees ?? [];
    case "locations":
      return center.locations ?? [];
    case "resources":
      return center.resources ?? [];
    case "availability":
      return [
        ...(center.availability_rules ?? []),
        ...(center.capacity_rules ?? []),
      ];
    case "waiting_list":
      return center.waiting_list ?? [];
    case "payments":
      return center.payments ?? [];
    case "vacation_coverage":
      return center.vacation_integration ?? [];
    case "policies":
      return center.policies ?? [];
    case "reports":
      return [...(center.reports ?? []), ...(center.analytics ?? [])];
    default:
      return center.section_detail ?? [];
  }
}

function rowTitle(item: Record<string, unknown>): string {
  return String(
    item.appointment_title ??
      item.service_title ??
      item.customer_label ??
      item.employee_label ??
      item.location_title ??
      item.resource_title ??
      item.rule_title ??
      item.hold_key ??
      item.wait_key ??
      item.payment_title ??
      item.policy_title ??
      item.integration_title ??
      item.provider_title ??
      item.report_title ??
      item.metric_title ??
      item.item_title ??
      "Item"
  );
}

export function AppointmentBookingPanel({
  labels,
  activeSection,
}: {
  labels: AppointmentBookingLabels;
  activeSection: AppointmentBookingSection;
}) {
  const [center, setCenter] = useState<AppointmentBookingCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/appointments/center?section=${activeSection}`);
    if (res.ok) setCenter(parseAppointmentBookingCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const stats = center.stats ?? {};
  const rows = pickRows(center, activeSection);
  const sectionTitle = labels.sections[activeSection] ?? labels.title;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{sectionTitle}</h2>
          {center.privacy_note ? (
            <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.vacation_message || labels.vacationMessage ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm text-violet-950">
          {center.vacation_message ?? labels.vacationMessage}
        </p>
      ) : null}

      {center.principle ? (
        <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-indigo-950">
          {center.principle}
        </p>
      ) : null}

      {activeSection === "overview" && (
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label={labels.stats.appointments} value={stats.appointments ?? 0} />
            <StatCard label={labels.stats.waitingList} value={stats.waiting_list ?? 0} />
            <StatCard label={labels.stats.services} value={stats.services ?? 0} />
            <StatCard label={labels.stats.calendarRevenue} value={stats.calendar_revenue ?? 0} />
            <StatCard label={labels.stats.activeHolds} value={stats.active_holds ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <ItemCard
              key={i}
              title={String(rec.item_title ?? rec.customer_label ?? "Recommendation")}
              summary={String(rec.recommendation ?? rec.summary ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "overview" && (center.booking_statuses?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.bookingStatuses}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(center.booking_statuses ?? []).map((status, i) => (
              <ItemCard
                key={i}
                title={String(status.status_title ?? status.status_key ?? "")}
                iconKey={String(status.icon_key ?? "")}
                textLabel={String(status.text_label ?? "")}
                summary={String(status.summary ?? "")}
              />
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-3">
        {rows.length === 0 ? (
          <p className="text-sm text-zinc-500">{labels.noRecords}</p>
        ) : (
          rows.map((item, i) => (
            <ItemCard
              key={i}
              title={rowTitle(item)}
              summary={String(item.summary ?? "")}
              badge={String(
                item.status_key ?? item.channel_key ?? item.payment_status ?? item.hold_status ?? ""
              )}
              iconKey={String(item.icon_key ?? "")}
              textLabel={String(item.text_label ?? "")}
            />
          ))
        )}
      </section>

      {activeSection === "overview" && (center.audit_recent?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.auditRecent}</h3>
          {(center.audit_recent ?? []).slice(0, 5).map((entry, i) => (
            <ItemCard
              key={i}
              title={String(entry.event_type ?? "event")}
              summary={String(entry.summary ?? "")}
            />
          ))}
        </section>
      )}
    </div>
  );
}
