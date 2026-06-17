"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CONFIDENCE_LEVELS,
  IMPACT_LEVELS,
  ORGANIZATIONAL_AREAS,
  PREDICTION_CATEGORIES,
  REVIEW_STATUSES,
  TIME_HORIZONS,
  parsePredictiveOverview,
  parsePredictiveTimeline,
  type PredictionCard,
  type PredictiveIntelligenceLabels,
  type PredictiveOverview,
  type PredictiveTimelineEvent,
} from "@/lib/app-portal/predictive-intelligence";

type Props = { labels: PredictiveIntelligenceLabels };

export function PredictiveIntelligencePanel({ labels }: Props) {
  const [data, setData] = useState<PredictiveOverview | null>(null);
  const [timeline, setTimeline] = useState<PredictiveTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [organizationalArea, setOrganizationalArea] = useState("");
  const [potentialImpact, setPotentialImpact] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [generateMessage, setGenerateMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (confidenceLevel) params.set("confidence_level", confidenceLevel);
    if (timeHorizon) params.set("time_horizon", timeHorizon);
    if (organizationalArea) params.set("organizational_area", organizationalArea);
    if (potentialImpact) params.set("potential_impact", potentialImpact);
    if (reviewStatus) params.set("review_status", reviewStatus);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());

    const timelineParams = new URLSearchParams();
    if (periodFrom) timelineParams.set("period_from", periodFrom);

    const [dashRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/predictive-intelligence?${params}`),
      fetch(`/api/aipify/predictive-intelligence/timeline?${timelineParams}`),
    ]);

    if (dashRes.ok) {
      setData(parsePredictiveOverview(await dashRes.json()));
    } else {
      const body = (await dashRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { events?: unknown };
      setTimeline(parsePredictiveTimeline(body));
    }
    setLoading(false);
  }, [category, confidenceLevel, timeHorizon, organizationalArea, potentialImpact, reviewStatus, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function generateInsights() {
    setBusy(true);
    setGenerateMessage("");
    const res = await fetch("/api/aipify/predictive-intelligence/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate" }),
    });
    setBusy(false);
    if (res.ok) {
      setGenerateMessage(labels.generate.success);
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

  if (error && !data?.found) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <p className="text-slate-600">{labels.accessDenied}</p>
      </div>
    );
  }

  const empty = !data?.has_predictive_data;
  const canGenerate = data?.can_generate === true;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
        {data?.predictive_confidence_note ? (
          <p className="mt-3 text-sm text-slate-600">{labels.probabilityNote}</p>
        ) : null}
      </div>

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          {canGenerate ? (
            <button type="button" disabled={busy} onClick={() => void generateInsights()} className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{labels.emptyCta}</button>
          ) : null}
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.forecastSummary}</p>
            <p className="mt-2 text-sm text-slate-700">{data?.forecast_summary}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveSummary}</p>
            <p className="mt-2 text-sm text-slate-700">{data?.executive_summary}</p>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <InsightBlock title={labels.dashboard.emergingOpportunities} items={data?.emerging_opportunities ?? []} />
            <InsightBlock title={labels.dashboard.emergingRisks} items={data?.emerging_risks ?? []} />
            <InsightBlock title={labels.dashboard.areasRequiringAttention} items={data?.areas_requiring_attention ?? []} />
          </section>
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {PREDICTION_CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
        </select>
        <select value={confidenceLevel} onChange={(e) => setConfidenceLevel(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.confidenceLevel}</option>
          {CONFIDENCE_LEVELS.map((c) => <option key={c} value={c}>{labels.confidenceLevels[c]}</option>)}
        </select>
        <select value={timeHorizon} onChange={(e) => setTimeHorizon(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.timeHorizon}</option>
          {TIME_HORIZONS.map((h) => <option key={h} value={h}>{labels.timeHorizons[h]}</option>)}
        </select>
        <select value={organizationalArea} onChange={(e) => setOrganizationalArea(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.organizationalArea}</option>
          {ORGANIZATIONAL_AREAS.map((a) => <option key={a} value={a}>{a.replace(/_/g, " ")}</option>)}
        </select>
        <select value={potentialImpact} onChange={(e) => setPotentialImpact(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.potentialImpact}</option>
          {IMPACT_LEVELS.map((i) => <option key={i} value={i}>{labels.impactLevels[i]}</option>)}
        </select>
        <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.reviewStatus}</option>
          {REVIEW_STATUSES.map((s) => <option key={s} value={s}>{labels.reviewStatuses[s]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.timePeriod} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.predictions?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.predictions}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.predictions!.map((pred) => (
              <PredictionCardView key={pred.id} pred={pred} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {!empty && (data?.early_warnings?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.earlyWarnings}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {data!.early_warnings!.map((w) => (
              <li key={w.id}><span className="font-medium">{w.title}</span> — {w.description}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && timeline.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.timeline}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {timeline.map((e) => (
              <li key={e.id}>{labels.timelineEvents[e.event_type as keyof typeof labels.timelineEvents] ?? e.description}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.recommendations}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {data!.recommendations!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {canGenerate && !empty ? (
        <button type="button" disabled={busy} onClick={() => void generateInsights()} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{labels.emptyCta}</button>
      ) : null}

      {generateMessage ? <p className="text-sm text-emerald-700">{generateMessage}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.predictFuture}</dt><dd className="mt-1 text-slate-600">{labels.faq.predictFutureAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyReview}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyReviewAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function InsightBlock({ title, items }: { title: string; items: { id: string; title: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-600">
        {items.map((item) => <li key={item.id}>{item.title}</li>)}
      </ul>
    </div>
  );
}

function PredictionCardView({ pred, labels }: { pred: PredictionCard; labels: PredictiveIntelligenceLabels }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">{pred.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{pred.summary}</p>
      <dl className="mt-3 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.card.category}: </dt><dd className="inline">{labels.categories[pred.category as keyof typeof labels.categories] ?? pred.category}</dd></div>
        <div><dt className="inline">{labels.card.confidence}: </dt><dd className="inline">{labels.confidenceLevels[pred.confidence_level as keyof typeof labels.confidenceLevels] ?? pred.confidence_level}</dd></div>
        <div><dt className="inline">{labels.card.timeHorizon}: </dt><dd className="inline">{labels.timeHorizons[pred.time_horizon as keyof typeof labels.timeHorizons] ?? pred.time_horizon}</dd></div>
        <div><dt className="inline">{labels.card.impact}: </dt><dd className="inline">{labels.impactLevels[pred.potential_impact as keyof typeof labels.impactLevels] ?? pred.potential_impact}</dd></div>
      </dl>
      <Link href={`/app/intelligence/predictive/${pred.id}`} className="mt-4 inline-block text-sm font-medium text-indigo-700 hover:underline">
        {labels.dashboard.viewPrediction}
      </Link>
    </article>
  );
}
