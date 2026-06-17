"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseForecastDetail,
  type ForecastDetail,
  type OrgForecastingLabels,
} from "@/lib/app-portal/organizational-forecasting";

type Props = { forecastId: string; labels: OrgForecastingLabels };

export function OrgForecastingDetailPanel({ forecastId, labels }: Props) {
  const [data, setData] = useState<ForecastDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/aipify/organizational-forecasting/${forecastId}`);
    if (res.ok) {
      setData(parseForecastDetail(await res.json()));
    } else {
      const b = (await res.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [forecastId, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function submitReview() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/aipify/organizational-forecasting/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete_review", forecast_id: forecastId, review_notes: reviewNotes }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.detail.reviewSuccess);
      setReviewNotes("");
      void load();
    }
  }

  if (loading && !data) return <p className="text-sm text-slate-600">{labels.loading}</p>;

  if (error || !data?.found) {
    return (
      <div className="space-y-4">
        <Link href="/app/intelligence/organizational-forecasting"
          className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>
        <p className="text-slate-600">{error || labels.accessDenied}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/intelligence/organizational-forecasting"
        className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{data.title}</h1>
        <p className="mt-2 text-slate-600">{data.description}</p>
        {data.advisory_note ? <p className="mt-3 text-sm text-slate-500">{labels.detail.advisoryNote}</p> : null}
      </div>

      {/* Current state */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.forecastCard.currentState}</h2>
        <p className="mt-2 text-sm text-slate-700">{data.current_state}</p>
      </section>

      {/* Three models */}
      <section className="space-y-3">
        <h2 className="font-semibold text-slate-900">{labels.detail.models}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <ModelCard label={labels.forecastCard.conservative} text={data.projected_state_conservative} color="slate" />
          <ModelCard label={labels.forecastCard.expected}     text={data.projected_state_expected}     color="indigo" />
          <ModelCard label={labels.forecastCard.optimistic}   text={data.projected_state_optimistic}   color="emerald" />
        </div>
      </section>

      {/* Recommended action */}
      {data.recommended_action ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.forecastCard.recommendedAction}</p>
          <p className="mt-2 text-sm text-slate-800">{data.recommended_action}</p>
        </section>
      ) : null}

      {/* Review history */}
      {(data.reviews?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.reviewHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data.reviews!.map((r) => (
              <li key={r.id} className="border-b border-slate-100 pb-2 last:border-0">{r.review_notes}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Review form */}
      {data.can_review ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)}
            placeholder={labels.detail.reviewNotes}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={3} />
          <button type="button" disabled={busy} onClick={() => void submitReview()}
            className="mt-3 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {labels.detail.submitReview}
          </button>
        </section>
      ) : null}

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </div>
  );
}

function ModelCard({ label, text, color }: { label: string; text: string; color: "slate" | "indigo" | "emerald" }) {
  const cls = {
    slate:   "border-slate-200 bg-slate-50",
    indigo:  "border-indigo-200 bg-indigo-50",
    emerald: "border-emerald-200 bg-emerald-50",
  }[color];
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</p>
      <p className="mt-2 text-sm text-slate-800">{text}</p>
    </div>
  );
}
