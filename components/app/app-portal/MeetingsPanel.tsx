"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseMeetingList,
  type MeetingListResponse,
  type MeetingStatus,
  type MeetingType,
  type MeetingsLabels,
} from "@/lib/app-portal/meetings";

type Props = { labels: MeetingsLabels };

const TYPES: MeetingType[] = [
  "executive_meeting", "team_meeting", "project_meeting", "customer_meeting", "vendor_meeting",
  "retrospective", "planning_session", "incident_review", "compliance_review", "custom_meeting",
];
const STATUSES: MeetingStatus[] = ["scheduled", "in_progress", "completed", "cancelled"];

export function MeetingsPanel({ labels }: Props) {
  const [data, setData] = useState<MeetingListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [meetingType, setMeetingType] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [outstandingActions, setOutstandingActions] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<MeetingType>("team_meeting");
  const [formObjectives, setFormObjectives] = useState("");
  const [formMeetingAt, setFormMeetingAt] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (meetingType) params.set("meeting_type", meetingType);
    if (status) params.set("status", status);
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    if (outstandingActions === "yes") params.set("outstanding_actions", "true");
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/meetings?${params}`);
    if (res.ok) setData(parseMeetingList(await res.json()));
    setLoading(false);
  }, [meetingType, status, dateFrom, dateTo, outstandingActions, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createItem() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle,
        meeting_type: formType,
        objectives: formObjectives,
        meeting_at: formMeetingAt || undefined,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { meeting?: { id?: string } };
      if (body.meeting?.id) {
        window.location.href = `/app/operations/meetings/${body.meeting.id}`;
        return;
      }
      setShowForm(false);
      void load();
    }
  }

  if (loading && !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  const dash = data?.dashboard;
  const empty = (data?.items.length ?? 0) === 0 && !meetingType && !status && !search;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      </div>

      {dash ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label={labels.dashboard.upcoming} value={dash.upcoming} />
          <Stat label={labels.dashboard.needsOutcomes} value={dash.needs_outcomes} />
          <Stat label={labels.dashboard.outstandingActions} value={dash.outstanding_actions} />
          <Stat label={labels.dashboard.withoutNotes} value={dash.without_notes} />
          <Stat label={labels.dashboard.overdueActions} value={dash.overdue_actions} />
        </section>
      ) : null}

      {dash && dash.recently_completed.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recentlyCompleted}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.recently_completed.map((m) => (
              <li key={m.id}>
                <Link href={`/app/operations/meetings/${m.id}`} className="text-indigo-700 hover:underline">{m.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={meetingType} onChange={(e) => setMeetingType(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.type}</option>
          {TYPES.map((t) => <option key={t} value={t}>{labels.types[t]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.status}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" aria-label={labels.filters.dateFrom} />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" aria-label={labels.filters.dateTo} />
        <select value={outstandingActions} onChange={(e) => setOutstandingActions(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.outstandingActions}</option>
          <option value="yes">{labels.filters.yes}</option>
        </select>
        {data?.can_manage ? (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.emptyCta}</button>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.form.createTitle}</h2>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.form.title} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={formType} onChange={(e) => setFormType(e.target.value as MeetingType)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {TYPES.map((t) => <option key={t} value={t}>{labels.types[t]}</option>)}
          </select>
          <input type="datetime-local" value={formMeetingAt} onChange={(e) => setFormMeetingAt(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" aria-label={labels.form.meetingAt} />
          <textarea value={formObjectives} onChange={(e) => setFormObjectives(e.target.value)} placeholder={labels.form.objectives} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button type="button" onClick={() => void createItem()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.form.submit}</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">{labels.form.cancel}</button>
          </div>
        </section>
      ) : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          {data?.can_manage ? (
            <button type="button" onClick={() => setShowForm(true)} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</button>
          ) : null}
        </section>
      ) : (
        <ul className="space-y-3">
          {data?.items.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/app/operations/meetings/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{item.title}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.types[item.meeting_type]} · {labels.statuses[item.status]}</p>
                </div>
                {item.needs_outcomes ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-950">{labels.dashboard.needsOutcomes}</span>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.organizer}: {item.organizer_name}</span>
                {item.meeting_at ? <span>{labels.card.meetingAt}: {new Date(item.meeting_at).toLocaleString()}</span> : null}
                <span>{labels.card.duration}: {item.duration_minutes}m</span>
                {(item.open_actions ?? 0) > 0 ? <span>{labels.card.openActions}: {item.open_actions}</span> : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {(data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <ul className="space-y-2 text-sm text-slate-700">
            {data!.recommendations!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.outcomes}</dt><dd className="mt-1 text-slate-600">{labels.faq.outcomesAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoComplete}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoCompleteAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
