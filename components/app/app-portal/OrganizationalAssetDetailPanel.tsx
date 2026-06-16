"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalAssetDetail,
  type OrganizationalAssetDetail,
  type OrganizationalAssetsLabels,
} from "@/lib/app-portal/organizational-assets";

type Props = { assetId: string; labels: OrganizationalAssetsLabels };

export function OrganizationalAssetDetailPanel({ assetId, labels }: Props) {
  const [detail, setDetail] = useState<OrganizationalAssetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [renewalNote, setRenewalNote] = useState("");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/assets/${assetId}`);
    if (res.ok) {
      const parsed = parseOrganizationalAssetDetail(await res.json());
      setDetail(parsed);
      if (parsed.asset?.internal_notes) setNotes(parsed.asset.internal_notes);
    }
    setLoading(false);
  }, [assetId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function save() {
    await fetch(`/api/aipify/assets/${assetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ internal_notes: notes, renewal_note: renewalNote || undefined }),
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

  if (!detail?.found || !detail.asset) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/organization/assets" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const a = detail.asset;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/organization/assets" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{a.asset_name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.types[a.asset_type]} · {labels.statuses[a.status]} · {labels.criticality[a.criticality_level]}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{a.description_full ?? a.description ?? "—"}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.ownership}</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.owner}</dt><dd>{a.owner_name}</dd></div>
          <div><dt className="text-slate-500">{labels.card.backupOwner}</dt><dd>{a.backup_owner_name}</dd></div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.vendorInfo}</h2>
        <p className="mt-2 text-sm">{a.vendor || "—"}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.renewals}</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {a.purchase_date ? <div><dt className="text-slate-500">{labels.form.purchaseDate}</dt><dd>{a.purchase_date}</dd></div> : null}
          {a.renewal_date ? <div><dt className="text-slate-500">{labels.form.renewalDate}</dt><dd>{a.renewal_date}</dd></div> : null}
          {a.renewal_reminder_date ? <div><dt className="text-slate-500">{labels.form.renewalReminder}</dt><dd>{a.renewal_reminder_date}</dd></div> : null}
        </dl>
        {a.renewal_upcoming ? <p className="mt-3 text-sm text-amber-800">{labels.statuses.pending_renewal}</p> : null}
        {a.renewal_expired ? <p className="mt-3 text-sm text-rose-800">{labels.statuses.pending_renewal}</p> : null}
      </section>

      {(a.related_modules?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedModules}</h2>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {a.related_modules!.map((m) => <li key={m} className="rounded-full bg-slate-100 px-3 py-1">{m}</li>)}
          </ul>
        </section>
      ) : null}

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

      {(detail.related_external_relationships?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedRelationships}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_external_relationships!.map((r) => (
              <li key={r.id}><Link href={`/app/organization/external-relationships/${r.id}`} className="text-indigo-700 hover:underline">{r.name}</Link></li>
            ))}
          </ul>
        </section>
      ) : null}

      {detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <p className="text-xs text-slate-500">{labels.form.referenceNote}</p>
          <input value={renewalNote} onChange={(e) => setRenewalNote(e.target.value)} placeholder={labels.detail.renewalNote} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder={labels.form.notes} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void save()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
            {renewalNote.trim() ? (
              <button type="button" onClick={() => void save()} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">{labels.detail.recordRenewal}</button>
            ) : null}
          </div>
          {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
        </section>
      ) : null}

      {(detail.audit_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.audit}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {detail.audit_history!.map((ev) => (
              <li key={ev.id}>{ev.description} — <span className="text-slate-500">{ev.performed_by}</span></li>
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
