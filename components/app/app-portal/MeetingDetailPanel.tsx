"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseMeetingDetail,
  type MeetingDetail,
  type MeetingsLabels,
} from "@/lib/app-portal/meetings";

type Props = { meetingId: string; labels: MeetingsLabels };

export function MeetingDetailPanel({ meetingId, labels }: Props) {
  const [detail, setDetail] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [objectives, setObjectives] = useState("");
  const [saved, setSaved] = useState(false);
  const [actionTitle, setActionTitle] = useState("");
  const [actionDue, setActionDue] = useState("");
  const [decisionTitle, setDecisionTitle] = useState("");
  const [decisionRationale, setDecisionRationale] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/meetings/${meetingId}`);
    if (res.ok) {
      const parsed = parseMeetingDetail(await res.json());
      setDetail(parsed);
      if (parsed.meeting?.notes) setNotes(parsed.meeting.notes);
      if (parsed.meeting?.objectives) setObjectives(parsed.meeting.objectives);
    }
    setLoading(false);
  }, [meetingId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function save() {
    await fetch(`/api/aipify/meetings/${meetingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes, objectives, status: "completed" }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  async function addAction() {
    if (!actionTitle.trim()) return;
    await fetch(`/api/aipify/meetings/${meetingId}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: actionTitle, due_date: actionDue || undefined }),
    });
    setActionTitle("");
    setActionDue("");
    void load();
  }

  async function addDecision() {
    if (!decisionTitle.trim()) return;
    await fetch(`/api/aipify/meetings/${meetingId}/decisions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: decisionTitle, rationale: decisionRationale }),
    });
    setDecisionTitle("");
    setDecisionRationale("");
    void load();
  }

  if (loading) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (!detail?.found || !detail.meeting) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/meetings" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const m = detail.meeting;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/meetings" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{m.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.types[m.meeting_type]} · {labels.statuses[m.status]} · {new Date(m.meeting_at).toLocaleString()}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{m.description_full ?? m.description ?? "—"}</p>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.organizer}</dt><dd>{m.organizer_name}</dd></div>
          <div><dt className="text-slate-500">{labels.card.duration}</dt><dd>{m.duration_minutes}m</dd></div>
        </dl>
      </section>

      {(detail.participants?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.participants}</h2>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {detail.participants!.map((p) => <li key={p.user_id} className="rounded-full bg-slate-100 px-3 py-1">{p.name}</li>)}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.objectives}</h2>
        {detail.can_manage ? (
          <textarea value={objectives} onChange={(e) => setObjectives(e.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        ) : (
          <p className="mt-2 text-sm text-slate-700">{m.objectives_full ?? m.objectives ?? "—"}</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.notes}</h2>
        {detail.can_manage ? (
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        ) : (
          <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{m.notes_full ?? m.notes ?? "—"}</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.decisions}</h2>
        {(detail.decisions?.length ?? 0) > 0 ? (
          <ul className="mt-3 space-y-3 text-sm">
            {detail.decisions!.map((d) => (
              <li key={d.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="font-medium">{d.title}</p>
                {d.rationale ? <p className="mt-1 text-slate-600">{d.rationale}</p> : null}
                <p className="mt-1 text-xs text-slate-500">{d.owner_name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">—</p>
        )}
        {detail.can_manage ? (
          <div className="mt-4 space-y-2">
            <input value={decisionTitle} onChange={(e) => setDecisionTitle(e.target.value)} placeholder={labels.detail.decisionTitle} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={decisionRationale} onChange={(e) => setDecisionRationale(e.target.value)} placeholder={labels.detail.decisionRationale} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <button type="button" onClick={() => void addDecision()} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">{labels.detail.addDecision}</button>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.actionItems}</h2>
        {(detail.action_items?.length ?? 0) > 0 ? (
          <ul className="mt-3 space-y-2 text-sm">
            {detail.action_items!.map((a) => (
              <li key={a.id} className={`rounded-lg border p-3 ${a.overdue ? "border-rose-200 bg-rose-50" : "border-slate-100 bg-slate-50"}`}>
                <p className="font-medium">{a.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {a.owner_name} · {labels.actionStatuses[a.status]} · {labels.priorities[a.priority]}
                  {a.due_date ? ` · ${a.due_date}` : ""}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">—</p>
        )}
        {detail.can_manage ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <input value={actionTitle} onChange={(e) => setActionTitle(e.target.value)} placeholder={labels.detail.actionTitle} className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input type="date" value={actionDue} onChange={(e) => setActionDue(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" aria-label={labels.detail.actionDue} />
            <button type="button" onClick={() => void addAction()} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">{labels.detail.addAction}</button>
          </div>
        ) : null}
      </section>

      {(detail.related_goals?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedGoals}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_goals!.map((g) => (
              <li key={g.id}><Link href={`/app/operations/goals/${g.id}`} className="text-indigo-700 hover:underline">{g.title}</Link></li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.related_follow_ups?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedFollowUps}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_follow_ups!.map((f) => (
              <li key={f.id}><Link href={`/app/operations/follow-ups/${f.id}`} className="text-indigo-700 hover:underline">{f.title}</Link></li>
            ))}
          </ul>
        </section>
      ) : null}

      {detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <button type="button" onClick={() => void save()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
          {saved ? <p className="mt-2 text-sm text-emerald-700">{labels.detail.saved}</p> : null}
        </section>
      ) : null}

      {(detail.audit_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.audit}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {detail.audit_history!.map((a) => (
              <li key={a.id}>{a.description} — <span className="text-slate-500">{a.performed_by}</span></li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.detail.recommendations}</h2>
          <ul className="mt-2 list-inside list-disc text-sm">
            {detail.recommendations!.map((rec) => <li key={rec.id}>{labels.recommendations[rec.key as keyof typeof labels.recommendations] ?? rec.key}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
