"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseExternalRelationshipDetail,
  type ExternalRelationshipDetail,
  type ExternalRelationshipsLabels,
} from "@/lib/app-portal/external-relationships";

type Props = { relationshipId: string; labels: ExternalRelationshipsLabels };

export function ExternalRelationshipDetailPanel({ relationshipId, labels }: Props) {
  const [detail, setDetail] = useState<ExternalRelationshipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [renewalNote, setRenewalNote] = useState("");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/external-relationships/${relationshipId}`);
    if (res.ok) {
      const parsed = parseExternalRelationshipDetail(await res.json());
      setDetail(parsed);
      if (parsed.relationship?.notes) setNotes(parsed.relationship.notes);
    }
    setLoading(false);
  }, [relationshipId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function save(notesOnly = false) {
    await fetch(`/api/aipify/external-relationships/${relationshipId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notesOnly ? { notes } : { notes, renewal_note: renewalNote || undefined }),
    });
    setSaved(true);
    setRenewalNote("");
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

  if (!detail?.found || !detail.relationship) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/organization/external-relationships" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const r = detail.relationship;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/organization/external-relationships" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{r.organization_name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.types[r.relationship_type]} · {labels.statuses[r.status]} · {labels.criticality[r.criticality_level]}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{r.service_description_full ?? r.service_description ?? "—"}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.contacts}</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.form.primaryContact}</dt><dd>{r.primary_contact || "—"}</dd></div>
          <div><dt className="text-slate-500">{labels.form.secondaryContact}</dt><dd>{r.secondary_contact || "—"}</dd></div>
          <div><dt className="text-slate-500">{labels.form.email}</dt><dd>{r.email || "—"}</dd></div>
          <div><dt className="text-slate-500">{labels.form.phone}</dt><dd>{r.phone || "—"}</dd></div>
          <div><dt className="text-slate-500">{labels.form.country}</dt><dd>{r.country || "—"}</dd></div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.ownership}</h2>
        <p className="mt-2 text-sm">{labels.card.owner}: <span className="font-medium">{r.owner_name}</span></p>
        {(detail.stakeholders?.length ?? 0) > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {detail.stakeholders!.map((s) => <li key={s.user_id} className="rounded-full bg-slate-100 px-3 py-1">{s.name}</li>)}
          </ul>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.contracts}</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {r.contract_start_date ? <div><dt className="text-slate-500">{labels.form.contractStart}</dt><dd>{r.contract_start_date}</dd></div> : null}
          {r.contract_end_date ? <div><dt className="text-slate-500">{labels.form.contractEnd}</dt><dd>{r.contract_end_date}</dd></div> : null}
          {r.renewal_reminder_date ? <div><dt className="text-slate-500">{labels.form.renewalReminder}</dt><dd>{r.renewal_reminder_date}</dd></div> : null}
        </dl>
        {r.renewal_upcoming ? <p className="mt-3 text-sm text-amber-800">{labels.statuses.pending_renewal}</p> : null}
        {r.renewal_expired ? <p className="mt-3 text-sm text-rose-800">{labels.statuses.ended}</p> : null}
      </section>

      {(detail.renewal_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.renewalHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.renewal_history!.map((h) => (
              <li key={h.id}>{h.description} — <span className="text-slate-500">{h.performed_by}</span></li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.related_risks?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedRisks}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_risks!.map((rk) => (
              <li key={rk.id}><Link href={`/app/operations/risks/${rk.id}`} className="text-indigo-700 hover:underline">{rk.title}</Link></li>
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
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <input value={renewalNote} onChange={(e) => setRenewalNote(e.target.value)} placeholder={labels.detail.renewalNote} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder={labels.form.notes} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void save(false)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
            {renewalNote.trim() ? (
              <button type="button" onClick={() => void save(false)} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">{labels.detail.recordRenewal}</button>
            ) : null}
          </div>
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
          <ul className="mt-2 list-inside list-disc text-sm">
            {detail.recommendations!.map((rec) => <li key={rec.id}>{labels.recommendations[rec.key as keyof typeof labels.recommendations] ?? rec.key}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
