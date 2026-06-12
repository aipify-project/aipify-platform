"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { formatDate } from "@/lib/i18n/format-date";
import type {
  EngagementSuccessCriterion,
  SalesExpertBooking,
  SalesExpertEngineDashboard,
  SalesExpertFollowUp,
} from "@/lib/aipify/sales-expert-operating-system";

type Props = {
  dashboard: SalesExpertEngineDashboard;
  followUps: SalesExpertFollowUp[];
  bookings: SalesExpertBooking[];
  labels: Record<string, string>;
  locale: string;
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
    >
      {copied ? "✓" : label}
    </button>
  );
}

function SuccessCriteriaList({
  criteria,
  labels,
}: {
  criteria?: EngagementSuccessCriterion[];
  labels: Record<string, string>;
}) {
  if (!criteria || criteria.length === 0) return null;
  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold">{labels.engagementSuccessCriteria}</h3>
      <ul className="mt-3 space-y-2">
        {criteria.map((c) => (
          <li key={c.key ?? c.label} className="flex items-start gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
            <span className={c.met ? "text-emerald-600" : "text-gray-400"}>{c.met ? "✓" : "○"}</span>
            <div>
              <span className="font-medium">{c.label}</span>
              {c.note ? <p className="mt-0.5 text-xs text-gray-600">{c.note}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export function EngagementBookingTab({ dashboard, followUps, bookings, labels, locale }: Props) {
  const summary = dashboard.engagement_summary;
  const bookingUrl = summary?.booking_page_url ?? dashboard.settings?.booking_link ?? "";

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.engagementTitle}</h2>
        {dashboard.engagement_mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">
            {labels.engagementMission}: {dashboard.engagement_mission}
          </p>
        ) : null}
        {dashboard.engagement_philosophy ? (
          <p className="mt-2 text-sm text-teal-900">
            {labels.engagementPhilosophy}: {dashboard.engagement_philosophy}
          </p>
        ) : null}
        {dashboard.engagement_abos_principle ? (
          <p className="mt-2 text-xs text-teal-800">
            {labels.engagementAbosPrinciple}: {dashboard.engagement_abos_principle}
          </p>
        ) : null}
        {dashboard.engagement_distinction_note ? (
          <p className="mt-2 text-xs text-teal-700">
            {labels.engagementDistinctionNote}: {dashboard.engagement_distinction_note}
          </p>
        ) : null}
      </section>

      {bookingUrl ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.engagementBookingUrl}</h3>
          <p className="mt-1 text-xs text-gray-500">{labels.engagementBookingUrlHint}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <code className="flex-1 overflow-x-auto rounded border border-gray-100 bg-gray-50 p-3 text-xs text-gray-800">
              {bookingUrl}
            </code>
            <CopyButton text={bookingUrl} label={labels.engagementCopyUrl} />
          </div>
          {summary?.booking_slug ? (
            <p className="mt-2 text-xs text-gray-500">
              {labels.engagementBookingSlug}: {summary.booking_slug}
            </p>
          ) : null}
        </section>
      ) : null}

      {summary ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label={labels.upcomingFollowUps} value={String(summary.upcoming_follow_ups ?? 0)} />
            <MetricCard label={labels.engagementScheduledBookings} value={String(summary.scheduled_bookings ?? 0)} />
            <MetricCard label={labels.engagementBookingsThisWeek} value={String(summary.upcoming_bookings_7d ?? 0)} />
            <MetricCard
              label={labels.engagementCompletedBookings30d}
              value={String(summary.completed_bookings_30d ?? 0)}
            />
          </div>
          {summary.privacy_note ? <p className="mt-2 text-xs text-gray-500">{summary.privacy_note}</p> : null}
        </section>
      ) : null}

      {followUps.length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold">{labels.automatedFollowUps}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {followUps.map((f) => (
              <li key={f.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-amber-100 bg-white/60 px-3 py-2">
                <span>
                  {f.template_key} · {f.cadence_days} {labels.days}
                </span>
                <span className="text-xs text-gray-600">
                  {f.scheduled_for ? formatDate(f.scheduled_for, locale) : "—"} · {f.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {bookings.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.engagementUpcomingBookings}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {bookings.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-100 px-3 py-2">
                <span className="font-medium">{b.booking_type}</span>
                <span className="text-xs text-gray-600">
                  {b.scheduled_at ? formatDate(b.scheduled_at, locale) : "—"} · {b.duration_minutes} min · {b.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.booking_center?.session_types && dashboard.booking_center.session_types.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.engagementBookingCenter}</h3>
          {dashboard.booking_center.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.booking_center.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.booking_center.session_types.map((s) => (
              <li key={s.key} className="rounded border border-teal-100 bg-teal-50/40 p-3">
                <span className="font-medium">{s.label}</span>
                {s.duration_minutes ? (
                  <span className="text-gray-600"> · {s.duration_minutes} min</span>
                ) : null}
                {s.note ? <p className="mt-1 text-xs text-gray-600">{s.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.calendar_integrations?.providers &&
      dashboard.calendar_integrations.providers.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.engagementCalendarIntegrations}</h3>
          {dashboard.calendar_integrations.honest_note ? (
            <p className="mt-1 text-xs text-amber-800">{dashboard.calendar_integrations.honest_note}</p>
          ) : null}
          <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{labels.metadataScaffold}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.calendar_integrations.providers.map((p) => (
              <li key={p.key} className="flex flex-wrap items-center justify-between gap-2">
                <span>{p.label}</span>
                <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">{p.oauth_status}</span>
              </li>
            ))}
          </ul>
          {dashboard.calendar_integrations.context_engine_route ? (
            <Link
              href={dashboard.calendar_integrations.context_engine_route}
              className="mt-3 inline-block text-sm text-teal-700 underline"
            >
              {labels.engagementOpenCalendars}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.follow_up_engagement?.companion_nudges &&
      dashboard.follow_up_engagement.companion_nudges.length > 0 ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4">
          <h3 className="text-sm font-semibold">{labels.engagementFollowUpNudges}</h3>
          {dashboard.follow_up_engagement.principle ? (
            <p className="mt-1 text-xs text-gray-600">{dashboard.follow_up_engagement.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.follow_up_engagement.companion_nudges.map((n) => (
              <li key={n.key}>
                {n.emoji} {n.example}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.meeting_preparation?.prep_sections &&
      dashboard.meeting_preparation.prep_sections.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.engagementMeetingPrep}</h3>
          <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{labels.metadataScaffold}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.meeting_preparation.prep_sections.map((s) => (
              <li key={s.key}>
                <span className="font-medium">{s.label}</span>
                {s.source ? <span className="text-gray-600"> — {s.source}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.engagement_self_love_connection ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm">
          <h3 className="font-semibold">{labels.selfLove}</h3>
          {dashboard.engagement_self_love_connection.principle ? (
            <p className="mt-2 text-gray-700">{dashboard.engagement_self_love_connection.principle}</p>
          ) : null}
          {(dashboard.engagement_self_love_connection.examples ?? []).map((ex) => (
            <p key={ex.example} className="mt-1 text-gray-600">
              {ex.emoji} {ex.example}
            </p>
          ))}
          {dashboard.engagement_self_love_connection.route ? (
            <Link href={dashboard.engagement_self_love_connection.route} className="mt-3 inline-block text-teal-700 underline">
              {labels.selfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.engagement_trust_connection ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.engagementTrust}</h3>
          {dashboard.engagement_trust_connection.principle ? (
            <p className="mt-2 text-gray-600">{dashboard.engagement_trust_connection.principle}</p>
          ) : null}
          {(dashboard.engagement_trust_connection.experts_should_understand ?? []).length > 0 ? (
            <ul className="mt-3 list-inside list-disc text-gray-600">
              {dashboard.engagement_trust_connection.experts_should_understand!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {(dashboard.engagement_integration_links ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.engagement_integration_links!.map((link) =>
              link.route ? (
                <Link key={link.key ?? link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                  {link.label ?? link.key}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      <SuccessCriteriaList criteria={dashboard.engagement_success_criteria} labels={labels} />

      {(dashboard.engagement_vision_phrases ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-3 list-inside list-disc text-sm text-gray-700">
            {dashboard.engagement_vision_phrases!.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
