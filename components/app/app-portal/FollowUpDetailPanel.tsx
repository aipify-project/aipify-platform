"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseFollowUpDetail,
  type FollowUpDetail,
  type FollowUpStatus,
  type FollowUpsLabels,
} from "@/lib/app-portal/follow-ups";

type Props = { followUpId: string; labels: FollowUpsLabels };

const STATUSES: FollowUpStatus[] = ["open", "in_progress", "waiting", "completed", "cancelled", "escalated"];

export function FollowUpDetailPanel({ followUpId, labels }: Props) {
  const [detail, setDetail] = useState<FollowUpDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<FollowUpStatus>("open");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/follow-ups/${followUpId}`);
    if (res.ok) {
      const parsed = parseFollowUpDetail(await res.json());
      setDetail(parsed);
      if (parsed.follow_up) {
        setStatus(parsed.follow_up.status);
        setNotes(parsed.follow_up.notes ?? "");
      }
    }
    setLoading(false);
  }, [followUpId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    await fetch(`/api/aipify/follow-ups/${followUpId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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

  if (!detail?.found || !detail.follow_up) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/follow-ups" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const fu = detail.follow_up;

  return (
    <div className="space-y-6">
      <Link href="/app/operations/follow-ups" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{fu.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{labels.categories[fu.category]} · {labels.priorities[fu.priority]}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">{labels.card.status}</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as FollowUpStatus)} className="mt-1 block w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">{labels.detail.notes}</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <button type="button" onClick={() => void save()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.detail.save}</button>
        {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
      </section>

      {(detail.recommended_actions?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.detail.recommendedActions}</h2>
          <ul className="mt-2 list-inside list-disc text-sm text-slate-700">{detail.recommended_actions!.map((a) => <li key={a}>{a}</li>)}</ul>
        </section>
      ) : null}

      {(detail.assigned_users?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">{labels.detail.assignedUsers}</h2>
          <ul className="mt-2 text-sm">{detail.assigned_users!.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">{labels.detail.timeline}</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {(detail.timeline ?? []).map((e) => (
            <li key={e.id} className="border-l-2 border-indigo-200 pl-4">
              <p className="font-medium">{e.description}</p>
              <p className="text-xs text-slate-500">{e.performed_by} · {new Date(e.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">{labels.detail.auditHistory}</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {(detail.audit_history ?? []).map((e) => (
            <li key={`audit-${e.id}`}>{e.event_type}: {e.description}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
