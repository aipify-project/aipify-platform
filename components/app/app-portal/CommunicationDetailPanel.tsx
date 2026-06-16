"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCommunicationDetail,
  type CommunicationDetail,
  type CommunicationsLabels,
} from "@/lib/app-portal/communications";

type Props = { communicationId: string; labels: CommunicationsLabels };

export function CommunicationDetailPanel({ communicationId, labels }: Props) {
  const [detail, setDetail] = useState<CommunicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/communications/${communicationId}`);
    if (res.ok) {
      const parsed = parseCommunicationDetail(await res.json());
      setDetail(parsed);
      if (parsed.communication?.full_message) setMessage(parsed.communication.full_message);
      if (parsed.communication?.summary) setSummary(parsed.communication.summary);
    }
    setLoading(false);
  }, [communicationId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function save(publish = false) {
    await fetch(`/api/aipify/communications/${communicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary,
        full_message: message,
        status: publish ? "published" : undefined,
        publish_date: publish ? new Date().toISOString() : undefined,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  async function acknowledge() {
    await fetch(`/api/aipify/communications/${communicationId}/acknowledge`, { method: "POST" });
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

  if (!detail?.found || !detail.communication) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/organization/communications" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const c = detail.communication;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/organization/communications" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{c.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.types[c.communication_type]} · {labels.statuses[c.status]} · {labels.priorities[c.priority]}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{c.summary_full ?? c.summary ?? "—"}</p>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.author}</dt><dd>{c.author_name}</dd></div>
          {c.publish_date ? <div><dt className="text-slate-500">{labels.card.publishDate}</dt><dd>{new Date(c.publish_date).toLocaleString()}</dd></div> : null}
          {c.expiration_date ? <div><dt className="text-slate-500">{labels.form.expirationDate}</dt><dd>{new Date(c.expiration_date).toLocaleString()}</dd></div> : null}
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.message}</h2>
        {detail.can_manage ? (
          <>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder={labels.form.summary} />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{c.full_message ?? "—"}</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.audience}</h2>
        <p className="mt-2 text-sm">{labels.audiences[c.audience_type]}</p>
      </section>

      {detail.delivery_status ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.delivery}</h2>
          <p className="mt-2 text-sm">{labels.detail.acknowledgements}: {detail.delivery_status.acknowledged_count}</p>
          {detail.delivery_status.outstanding_note ? <p className="mt-1 text-xs text-slate-500">{labels.detail.outstanding}</p> : null}
        </section>
      ) : null}

      {detail.user_acknowledgement ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {detail.user_acknowledgement.acknowledged ? (
            <p className="text-sm text-emerald-700">{labels.detail.acknowledged}</p>
          ) : detail.user_acknowledgement.pending && c.status === "published" ? (
            <div className="space-y-2">
              <p className="text-sm text-amber-800">{labels.detail.pendingAck}</p>
              <button type="button" onClick={() => void acknowledge()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.acknowledge}</button>
            </div>
          ) : null}
        </section>
      ) : null}

      {(detail.acknowledgements?.length ?? 0) > 0 && detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.acknowledgements}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.acknowledgements!.map((a) => (
              <li key={a.user_id}>{a.user_name} — {new Date(a.acknowledged_at).toLocaleString()}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.related_policies?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedPolicies}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_policies!.map((p) => (
              <li key={p.id}><Link href={`/app/operations/compliance/${p.id}`} className="text-indigo-700 hover:underline">{p.title}</Link></li>
            ))}
          </ul>
        </section>
      ) : null}

      {detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-wrap gap-2">
          <button type="button" onClick={() => void save(false)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
          {c.status !== "published" ? (
            <button type="button" onClick={() => void save(true)} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">{labels.form.publish}</button>
          ) : null}
          {saved ? <p className="text-sm text-emerald-700 self-center">{labels.detail.saved}</p> : null}
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
