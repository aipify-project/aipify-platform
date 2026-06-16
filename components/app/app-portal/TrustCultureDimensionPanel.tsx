"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCultureDimensionDetail,
  type CultureDimension,
  type CultureDimensionDetail,
  type TrustCultureLabels,
} from "@/lib/app-portal/trust-culture";

type Props = { dimension: string; labels: TrustCultureLabels };

export function TrustCultureDimensionPanel({ dimension, labels }: Props) {
  const [detail, setDetail] = useState<CultureDimensionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/culture/${dimension}`);
    if (res.ok) setDetail(parseCultureDimensionDetail(await res.json()));
    setLoading(false);
  }, [dimension]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (!detail?.found || !detail.dimension) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/organization/culture" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const dim = detail.dimension;
  const dimKey = dimension as CultureDimension;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/organization/culture" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{labels.dimensions[dimKey] ?? dimension}</h1>
        <p className="mt-1 text-sm text-slate-500">{labels.trends[dim.trend_direction]}</p>
        <p className="mt-2 text-xs text-slate-500">{detail.privacy_note ?? labels.privacyNote}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-3xl font-semibold text-slate-900">
          {dim.suppressed ? labels.snapshot.suppressed : `${dim.score}/5`}
        </p>
        {!dim.suppressed ? (
          <p className="mt-1 text-sm text-slate-600">{dim.response_count} anonymous responses (aggregate)</p>
        ) : (
          <p className="mt-1 text-sm text-amber-700">{dim.anonymity_note ?? labels.snapshot.suppressed}</p>
        )}
      </section>

      {(detail.historical_trends?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.historicalTrends}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.historical_trends!.map((h, i) => (
              <li key={i} className="flex justify-between border-b border-slate-100 pb-2">
                <span>{new Date(h.period).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
                <span>{h.score}/5 ({h.response_count} responses)</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.participation_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.participationHistory}</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {detail.participation_history!.map((p) => (
              <li key={p.check_in_id}>{p.title} · {p.response_count} responses</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.strengths?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.strengths}</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {detail.strengths!.map((s) => <li key={s.id}>{s.text}</li>)}
          </ul>
        </section>
      ) : null}

      {(detail.improvement_opportunities?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.improvementOpportunities}</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {detail.improvement_opportunities!.map((s) => <li key={s.id}>{s.text}</li>)}
          </ul>
        </section>
      ) : null}

      {(detail.recommended_actions?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <p className="text-sm font-medium text-slate-900">{labels.detail.recommendedActions}</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {detail.recommended_actions!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.review_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.reviewHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.review_history!.map((a) => (
              <li key={a.id} className="flex justify-between gap-2 border-b border-slate-100 pb-2">
                <span>{a.description}</span>
                <span className="text-xs text-slate-500">{new Date(a.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
