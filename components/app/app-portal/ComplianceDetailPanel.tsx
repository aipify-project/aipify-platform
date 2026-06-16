"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseComplianceDetail,
  type ComplianceLabels,
  type PolicyDetail,
} from "@/lib/app-portal/compliance";

type Props = { policyId: string; labels: ComplianceLabels };

export function ComplianceDetailPanel({ policyId, labels }: Props) {
  const [detail, setDetail] = useState<PolicyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [changeSummary, setChangeSummary] = useState("");
  const [saved, setSaved] = useState(false);
  const [ackDone, setAckDone] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/compliance/${policyId}`);
    if (res.ok) {
      const parsed = parseComplianceDetail(await res.json());
      setDetail(parsed);
      if (parsed.policy?.notes) setNotes(parsed.policy.notes);
    }
    setLoading(false);
  }, [policyId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function save() {
    await fetch(`/api/aipify/compliance/${policyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes, review_date: new Date().toISOString().slice(0, 10), change_summary: changeSummary || "Review completed" }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  async function acknowledge() {
    await fetch(`/api/aipify/compliance/${policyId}/acknowledge`, { method: "POST" });
    setAckDone(true);
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

  if (!detail?.found || !detail.policy) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/compliance" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const p = detail.policy;
  const ack = p.acknowledgement;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/compliance" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{p.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.categories[p.category]} · {labels.statuses[p.status]} · {labels.card.version} v{p.version_number}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <p className="mt-2 text-sm text-slate-700">{p.description_full ?? p.description}</p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.owner}</dt><dd className="font-medium">{p.owner_name}</dd></div>
          <div><dt className="text-slate-500">{labels.form.audience}</dt><dd>{labels.audiences[p.audience]}</dd></div>
          {p.effective_date ? <div><dt className="text-slate-500">{labels.card.effectiveDate}</dt><dd>{p.effective_date}</dd></div> : null}
          {p.review_date ? <div><dt className="text-slate-500">{labels.card.reviewDate}</dt><dd>{p.review_date}</dd></div> : null}
          {p.review_frequency ? <div><dt className="text-slate-500">{labels.form.reviewFrequency}</dt><dd>{labels.frequencies[p.review_frequency!]}</dd></div> : null}
        </dl>
      </section>

      {ack ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.acknowledgements}</h2>
          <p className="mt-2 text-sm text-slate-700">
            {labels.detail.completionRate}: {ack.completion_rate}% · {labels.detail.outstanding}: {ack.outstanding_count}
          </p>
          {!detail.user_acknowledged && p.status === "active" ? (
            <button type="button" onClick={() => void acknowledge()} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.acknowledge}</button>
          ) : detail.user_acknowledged || ackDone ? (
            <p className="mt-4 text-sm text-emerald-700">{labels.detail.acknowledged}</p>
          ) : null}
          {(detail.acknowledgements?.length ?? 0) > 0 ? (
            <ul className="mt-4 space-y-1 text-sm text-slate-600">
              {detail.acknowledgements!.slice(0, 10).map((a) => (
                <li key={a.user_id}>{a.user_name} — {new Date(a.acknowledged_at).toLocaleDateString()}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {(detail.version_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.versionHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.version_history!.map((v) => (
              <li key={v.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2">
                <span className="font-medium">v{v.version_number} — {v.change_summary}</span>
                <span className="text-slate-500">{v.updated_by} · {new Date(v.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.contributors?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.contributors}</h2>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {detail.contributors!.map((c) => <li key={c.user_id} className="rounded-full bg-slate-100 px-3 py-1">{c.name}</li>)}
          </ul>
        </section>
      ) : null}

      {detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <input value={changeSummary} onChange={(e) => setChangeSummary(e.target.value)} placeholder={labels.detail.changeSummary} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
          <ul className="mt-2 list-inside list-disc text-sm">
            {detail.recommendations!.map((rec) => <li key={rec.id}>{labels.recommendations[rec.key as keyof typeof labels.recommendations] ?? rec.key}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
