"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseExecutiveForesightDetail,
  type ExecutiveForesightLabels,
  type ExecutiveForesightDetail,
} from "@/lib/app-portal/executive-foresight";

type Props = { observationId: string; labels: ExecutiveForesightLabels };

export function ExecutiveForesightDetailPanel({ observationId, labels }: Props) {
  const [data, setData] = useState<ExecutiveForesightDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [noteText, setNoteText] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/aipify/executive-foresight/${observationId}`);
    if (res.ok) {
      setData(parseExecutiveForesightDetail(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [observationId, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function submitReview() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/aipify/executive-foresight/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete_review", observation_id: observationId, review_notes: reviewNotes }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.detail.reviewSuccess);
      void load();
    }
  }

  async function addNote() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/aipify/executive-foresight/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_note", observation_id: observationId, note_text: noteText }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.detail.noteSuccess);
      setNoteText("");
      void load();
    }
  }

  if (loading && !data) {
    return <p className="text-sm text-slate-600">{labels.loading}</p>;
  }

  if (error || !data?.found) {
    return (
      <div className="space-y-4">
        <Link href="/app/intelligence/executive-foresight" className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>
        <p className="text-slate-600">{error || labels.accessDenied}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/intelligence/executive-foresight" className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{data.title}</h1>
        <p className="mt-2 text-slate-600">{data.summary}</p>
        {data.advisory_note ? <p className="mt-3 text-sm text-slate-500">{labels.detail.advisoryNote}</p> : null}
      </div>

      <dl className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
        <div><dt className="inline font-medium">{labels.card.category}: </dt><dd className="inline">{labels.categories[data.category as keyof typeof labels.categories] ?? data.category}</dd></div>
        <div><dt className="inline font-medium">{labels.card.insightType}: </dt><dd className="inline">{labels.insightTypes[data.insight_type as keyof typeof labels.insightTypes] ?? data.insight_type}</dd></div>
        <div><dt className="inline font-medium">{labels.card.executiveOwner}: </dt><dd className="inline">{data.executive_owner}</dd></div>
        <div><dt className="inline font-medium">{labels.card.reviewStatus}: </dt><dd className="inline">{labels.reviewStatuses[data.review_status as keyof typeof labels.reviewStatuses] ?? data.review_status}</dd></div>
      </dl>

      {(data.reviews?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.reviews}</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            {data.reviews!.map((r) => (
              <li key={r.id} className="border-b border-slate-100 pb-2 last:border-0">{r.review_notes}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(data.notes?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.notes}</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            {data.notes!.map((n) => (
              <li key={n.id} className="border-b border-slate-100 pb-2 last:border-0">{n.note_text}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.can_review ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder={labels.detail.reviewNotes}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            rows={3}
          />
          <button type="button" disabled={busy} onClick={() => void submitReview()} className="mt-3 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {labels.detail.submitReview}
          </button>
        </section>
      ) : null}

      {data.can_note ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={labels.detail.noteText}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            rows={3}
          />
          <button type="button" disabled={busy} onClick={() => void addNote()} className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-medium text-indigo-800 disabled:opacity-60">
            {labels.detail.addNote}
          </button>
        </section>
      ) : null}

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </div>
  );
}
