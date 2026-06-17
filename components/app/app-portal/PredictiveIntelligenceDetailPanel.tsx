"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  OUTCOME_RESULTS,
  parsePredictiveDetail,
  type PredictiveDetail,
  type PredictiveIntelligenceLabels,
} from "@/lib/app-portal/predictive-intelligence";

type Props = { labels: PredictiveIntelligenceLabels; predictionId: string };

export function PredictiveIntelligenceDetailPanel({ labels, predictionId }: Props) {
  const [data, setData] = useState<PredictiveDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [outcome, setOutcome] = useState("insufficient_evidence");
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/aipify/predictive-intelligence/${predictionId}`);
    if (res.ok) {
      setData(parsePredictiveDetail(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [predictionId, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function submitReview() {
    setBusy(true);
    setReviewMessage("");
    const res = await fetch("/api/aipify/predictive-intelligence/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prediction_id: predictionId, outcome, review_notes: reviewNotes }),
    });
    setBusy(false);
    if (res.ok) {
      setReviewNotes("");
      setReviewMessage(labels.detail.reviewSuccess);
      void load();
    }
  }

  if (loading && !data && !error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error || !data?.found) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/app/intelligence/predictive" className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>
        <p className="text-slate-600">{error || labels.accessDenied}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link href="/app/intelligence/predictive" className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{data.title}</h1>
        <p className="mt-2 text-slate-600">{data.summary}</p>
        <p className="mt-3 text-sm text-slate-500">{labels.detail.probabilityNote}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-sm">
        <dl className="grid gap-2">
          <div><dt className="font-medium text-slate-900">{labels.card.category}</dt><dd className="text-slate-600">{labels.categories[data.category as keyof typeof labels.categories] ?? data.category}</dd></div>
          <div><dt className="font-medium text-slate-900">{labels.card.confidence}</dt><dd className="text-slate-600">{labels.confidenceLevels[data.confidence_level as keyof typeof labels.confidenceLevels] ?? data.confidence_level}</dd></div>
          <div><dt className="font-medium text-slate-900">{labels.card.timeHorizon}</dt><dd className="text-slate-600">{labels.timeHorizons[data.time_horizon as keyof typeof labels.timeHorizons] ?? data.time_horizon}</dd></div>
          <div><dt className="font-medium text-slate-900">{labels.card.impact}</dt><dd className="text-slate-600">{labels.impactLevels[data.potential_impact as keyof typeof labels.impactLevels] ?? data.potential_impact}</dd></div>
          {(data.related_areas?.length ?? 0) > 0 ? (
            <div><dt className="font-medium text-slate-900">{labels.card.relatedAreas}</dt><dd className="text-slate-600">{data.related_areas!.join(", ")}</dd></div>
          ) : null}
        </dl>
      </section>

      {(data.recommended_actions?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.card.recommendedActions}</h2>
          <ul className="mt-3 space-y-1 text-sm text-slate-800">
            {data.recommended_actions!.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </section>
      ) : null}

      {(data.outcome_reviews?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.priorReviews}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data.outcome_reviews!.map((r) => (
              <li key={r.id}>{labels.outcomes[r.outcome as keyof typeof labels.outcomes] ?? r.outcome}{r.review_notes ? ` — ${r.review_notes}` : ""}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.can_review ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 text-sm">
          <p className="font-medium">{labels.detail.outcomeReview}</p>
          <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2">
            {OUTCOME_RESULTS.map((o) => <option key={o} value={o}>{labels.outcomes[o]}</option>)}
          </select>
          <textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} placeholder={labels.detail.reviewNotes} rows={3} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
          <button type="button" disabled={busy} onClick={() => void submitReview()} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{labels.detail.submitReview}</button>
        </section>
      ) : null}

      {reviewMessage ? <p className="text-sm text-emerald-700">{reviewMessage}</p> : null}
    </div>
  );
}
