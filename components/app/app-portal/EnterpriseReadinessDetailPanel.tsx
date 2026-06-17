"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseReadinessDetail,
  type EnterpriseReadinessLabels,
  type ReadinessDetail,
} from "@/lib/app-portal/enterprise-readiness";

type Props = { assessmentId: string; labels: EnterpriseReadinessLabels };

export function EnterpriseReadinessDetailPanel({ assessmentId, labels }: Props) {
  const [data, setData] = useState<ReadinessDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [newScore, setNewScore] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/aipify/enterprise-readiness/${assessmentId}`);
    if (res.ok) {
      setData(parseReadinessDetail(await res.json()));
    } else {
      const b = (await res.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [assessmentId, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function submitReview() {
    setBusy(true);
    setMessage("");
    const scoreVal = newScore ? parseInt(newScore, 10) : undefined;
    const res = await fetch("/api/aipify/enterprise-readiness/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "complete_review",
        assessment_id: assessmentId,
        review_notes: reviewNotes || undefined,
        new_score: scoreVal,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.detail.reviewSuccess);
      setReviewNotes(""); setNewScore("");
      void load();
    }
  }

  if (loading && !data) return <p className="text-sm text-slate-600">{labels.loading}</p>;

  if (error || !data?.found) {
    return (
      <div className="space-y-4">
        <Link href="/app/intelligence/enterprise-readiness"
          className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>
        <p className="text-slate-600">{error || labels.accessDenied}</p>
      </div>
    );
  }

  const pct = Math.round((data.current_score / 100) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/intelligence/enterprise-readiness"
        className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{data.title}</h1>
        <p className="mt-2 text-slate-600">{data.description}</p>
        {data.advisory_note ? <p className="mt-3 text-sm text-slate-500">{labels.detail.advisoryNote}</p> : null}
      </div>

      {/* Score bar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.detail.scorecard}</h2>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span>{labels.scorecard.currentScore}: <strong>{data.current_score}</strong></span>
            <span>{labels.scorecard.targetScore}: {data.target_score}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="font-medium text-slate-600">{labels.scorecard.trend}</dt><dd>{labels.trends[data.trend as keyof typeof labels.trends] ?? data.trend}</dd></div>
          <div><dt className="font-medium text-slate-600">{labels.scorecard.priority}</dt><dd>{labels.priorities[data.priority as keyof typeof labels.priorities] ?? data.priority}</dd></div>
          <div><dt className="font-medium text-slate-600">{labels.scorecard.owner}</dt><dd>{data.leadership_owner}</dd></div>
          <div><dt className="font-medium text-slate-600">{labels.scorecard.department}</dt><dd>{data.department}</dd></div>
        </dl>
      </section>

      {/* Recommended action */}
      {data.recommended_action ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.scorecard.recommendedAction}</p>
          <p className="mt-2 text-sm text-slate-800">{data.recommended_action}</p>
        </section>
      ) : null}

      {/* Review history */}
      {(data.reviews?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.reviewHistory}</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            {data.reviews!.map((r) => (
              <li key={r.id} className="border-b border-slate-100 pb-2 last:border-0">
                {r.review_notes}
                {r.new_score != null ? <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">Score: {r.new_score}</span> : null}
              </li>
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
          <input type="number" min={0} max={100} value={newScore} onChange={(e) => setNewScore(e.target.value)}
            placeholder={labels.detail.newScore}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
