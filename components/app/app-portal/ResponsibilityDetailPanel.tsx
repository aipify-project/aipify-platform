"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseResponsibilityDetail,
  type ResponsibilityDetail,
  type ResponsibilitiesLabels,
} from "@/lib/app-portal/responsibilities";

type Props = { responsibilityId: string; labels: ResponsibilitiesLabels };

export function ResponsibilityDetailPanel({ responsibilityId, labels }: Props) {
  const [detail, setDetail] = useState<ResponsibilityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/responsibilities/${responsibilityId}`);
    if (res.ok) {
      const parsed = parseResponsibilityDetail(await res.json());
      setDetail(parsed);
      if (parsed.responsibility?.notes) setNotes(parsed.responsibility.notes);
    }
    setLoading(false);
  }, [responsibilityId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function save() {
    await fetch(`/api/aipify/responsibilities/${responsibilityId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes, last_reviewed_date: new Date().toISOString().slice(0, 10) }),
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

  if (!detail?.found || !detail.responsibility) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/organization/responsibilities" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const r = detail.responsibility;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/organization/responsibilities" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{r.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{labels.areas[r.area]} · {labels.statuses[r.status]}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{r.description_full ?? r.description}</p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.primaryOwner}</dt><dd className="font-medium">{r.primary_owner_id ? (
            <Link href={`/app/organization/responsibilities/owners/${r.primary_owner_id}`} className="text-indigo-700 hover:underline">{r.primary_owner_name}</Link>
          ) : r.primary_owner_name}</dd></div>
          <div><dt className="text-slate-500">{labels.card.backupOwner}</dt><dd className="font-medium">{r.backup_owner_name}</dd></div>
          {r.last_reviewed_date ? <div><dt className="text-slate-500">{labels.card.lastReviewed}</dt><dd>{r.last_reviewed_date}</dd></div> : null}
          {r.review_frequency ? <div><dt className="text-slate-500">{labels.form.reviewFrequency}</dt><dd>{labels.frequencies[r.review_frequency!]}</dd></div> : null}
        </dl>
      </section>

      {detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder={labels.form.notes} />
          <button type="button" onClick={() => void save()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
          {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
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
          <ul className="mt-2 list-inside list-disc text-sm">{detail.recommendations!.map((rec) => <li key={rec.id}>{labels.recommendations[rec.key as keyof typeof labels.recommendations] ?? rec.key}</li>)}</ul>
        </section>
      ) : null}
    </div>
  );
}
