"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  OPPORTUNITY_STATUSES,
  parseOpportunityDetail,
  type OpportunityDetail,
  type StrategicOpportunitiesLabels,
} from "@/lib/app-portal/strategic-opportunities";

type Props = { opportunityId: string; labels: StrategicOpportunitiesLabels };

export function StrategicOpportunitiesDetailPanel({ opportunityId, labels }: Props) {
  const [data, setData] = useState<OpportunityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/aipify/strategic-opportunities/${opportunityId}`);
    if (res.ok) {
      setData(parseOpportunityDetail(await res.json()));
    } else {
      const b = (await res.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [opportunityId, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function submitReview() {
    setBusy(true);
    setMessage("");
    const res = await fetch(`/api/aipify/strategic-opportunities/${opportunityId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review_notes: reviewNotes, status: newStatus || undefined }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.detail.reviewSuccess);
      setReviewNotes(""); setNewStatus("");
      void load();
    }
  }

  if (loading && !data) return <p className="text-sm text-slate-600">{labels.loading}</p>;

  if (error || !data?.found) {
    return (
      <div className="space-y-4">
        <Link href="/app/intelligence/strategic-opportunities"
          className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>
        <p className="text-slate-600">{error || labels.accessDenied}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/intelligence/strategic-opportunities"
        className="text-sm font-medium text-indigo-700 hover:underline">{labels.detail.back}</Link>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{data.title}</h1>
        <p className="mt-2 text-slate-600">{data.description}</p>
        {data.advisory_note ? <p className="mt-3 text-sm text-slate-500">{labels.detail.advisoryNote}</p> : null}
      </div>

      {/* Scorecard */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.detail.scorecard}</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="font-medium text-slate-600">{labels.card.estimatedImpact}</dt><dd>{labels.estimatedImpacts[data.estimated_impact as keyof typeof labels.estimatedImpacts] ?? data.estimated_impact}</dd></div>
          <div><dt className="font-medium text-slate-600">{labels.card.estimatedComplexity}</dt><dd>{labels.estimatedComplexities[data.estimated_complexity as keyof typeof labels.estimatedComplexities] ?? data.estimated_complexity}</dd></div>
          <div><dt className="font-medium text-slate-600">{labels.card.orgReadiness}</dt><dd>{labels.orgReadiness[data.organizational_readiness as keyof typeof labels.orgReadiness] ?? data.organizational_readiness}</dd></div>
          <div><dt className="font-medium text-slate-600">{labels.card.reviewPriority}</dt><dd>{labels.reviewPriorities[data.recommended_review_priority as keyof typeof labels.reviewPriorities] ?? data.recommended_review_priority}</dd></div>
          <div><dt className="font-medium text-slate-600">{labels.card.owner}</dt><dd>{data.leadership_owner}</dd></div>
          <div><dt className="font-medium text-slate-600">{labels.card.potentialValue}</dt><dd>{data.potential_value}</dd></div>
          <div><dt className="font-medium text-slate-600">{labels.card.estimatedEffort}</dt><dd>{data.estimated_effort}</dd></div>
        </dl>
      </section>

      {(data.suggested_next_steps?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.nextSteps}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {data.suggested_next_steps!.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
      ) : null}

      {(data.related_departments?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedDepartments}</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {data.related_departments!.map((d) => (
              <li key={d} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs">{d}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(data.reviews?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.reviewHistory}</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            {data.reviews!.map((r) => (
              <li key={r.id} className="border-b border-slate-100 pb-2 last:border-0">
                {r.review_notes}
                {r.new_status ? <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{labels.statuses[r.new_status as keyof typeof labels.statuses] ?? r.new_status}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.can_review ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">{labels.detail.newStatus}</option>
            {OPPORTUNITY_STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
          </select>
          <textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)}
            placeholder={labels.detail.reviewNotes}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={3} />
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
