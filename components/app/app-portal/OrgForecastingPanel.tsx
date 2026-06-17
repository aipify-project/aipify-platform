"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CONFIDENCE_LEVELS,
  FORECAST_CATEGORIES,
  FORECAST_TIME_HORIZONS,
  REVIEW_STATUSES,
  parseOrgForecastingOverview,
  type CapacityAssessment,
  type ForecastCard,
  type OrgForecastingLabels,
  type OrgForecastingOverview,
  type TrendItem,
} from "@/lib/app-portal/organizational-forecasting";

type Props = { labels: OrgForecastingLabels };

export function OrgForecastingPanel({ labels }: Props) {
  const [data, setData] = useState<OrgForecastingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [executiveOwner, setExecutiveOwner] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (timeHorizon) p.set("time_horizon", timeHorizon);
    if (confidenceLevel) p.set("confidence_level", confidenceLevel);
    if (reviewStatus) p.set("review_status", reviewStatus);
    if (executiveOwner.trim()) p.set("executive_owner", executiveOwner.trim());
    if (search.trim()) p.set("search", search.trim());

    const res = await fetch(`/api/aipify/organizational-forecasting?${p}`);
    if (res.ok) {
      setData(parseOrgForecastingOverview(await res.json()));
    } else {
      const b = (await res.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [category, timeHorizon, confidenceLevel, reviewStatus, executiveOwner, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function beginReview() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/aipify/organizational-forecasting/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "begin_review" }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.beginReview.success);
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

  const empty = !data?.has_forecast_data;
  const canReview = data?.can_review === true;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
        {data?.advisory_note ? <p className="mt-3 text-sm text-slate-600">{labels.advisoryNote}</p> : null}
      </div>

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          {canReview ? (
            <button type="button" disabled={busy} onClick={() => void beginReview()}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
              {labels.emptyCta}
            </button>
          ) : null}
        </section>
      ) : (
        <>
          {/* Score + summary */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.forecastScore}</p>
              <p className="mt-1 text-3xl font-semibold text-indigo-700">{data?.organizational_forecast_score ?? "—"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveSummary}</p>
              <p className="mt-2 text-sm text-slate-700">{data?.executive_summary}</p>
            </div>
          </section>

          {/* Spotlight forecasts */}
          <section className="grid gap-4 lg:grid-cols-3">
            {data?.growth_forecast ? <SpotlightCard title={labels.dashboard.growthForecast} card={data.growth_forecast} labels={labels} /> : null}
            {data?.capacity_forecast ? <SpotlightCard title={labels.dashboard.capacityForecast} card={data.capacity_forecast} labels={labels} /> : null}
            {data?.support_forecast ? <SpotlightCard title={labels.dashboard.supportForecast} card={data.support_forecast} labels={labels} /> : null}
          </section>

          {/* Trend analysis */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TrendBlock label={labels.dashboard.improvingTrends} items={data?.improving_trends ?? []} color="emerald" />
            <TrendBlock label={labels.dashboard.stableTrends}    items={data?.stable_trends    ?? []} color="slate"   />
            <TrendBlock label={labels.dashboard.decliningTrends} items={data?.declining_trends ?? []} color="red"     />
            <TrendBlock label={labels.dashboard.emergingTrends}  items={data?.emerging_trends  ?? []} color="amber"   />
          </section>

          {/* Capacity view */}
          {(data?.capacity_assessments?.length ?? 0) > 0 ? (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.capacityView}</h2>
              <div className="grid gap-4 lg:grid-cols-3">
                {data!.capacity_assessments!.map((c) => (
                  <CapacityCard key={c.id} cap={c} labels={labels} />
                ))}
              </div>
            </section>
          ) : null}

          {/* Review questions */}
          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
            <h2 className="font-semibold text-slate-900">{labels.dashboard.reviewQuestions}</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
              {labels.reviewQuestions.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </section>
        </>
      )}

      {/* Time horizon selector */}
      <section>
        <div className="flex flex-wrap gap-2">
          {FORECAST_TIME_HORIZONS.map((h) => (
            <button key={h} type="button"
              onClick={() => setTimeHorizon(timeHorizon === h ? "" : h)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${timeHorizon === h ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}>
              {labels.timeHorizons[h]}
            </button>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {FORECAST_CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
        </select>
        <select value={confidenceLevel} onChange={(e) => setConfidenceLevel(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.confidenceLevel}</option>
          {CONFIDENCE_LEVELS.map((c) => <option key={c} value={c}>{labels.confidenceLevels[c]}</option>)}
        </select>
        <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.reviewStatus}</option>
          {REVIEW_STATUSES.map((s) => <option key={s} value={s}>{labels.reviewStatuses[s]}</option>)}
        </select>
        <input value={executiveOwner} onChange={(e) => setExecutiveOwner(e.target.value)}
          placeholder={labels.filters.executiveOwner}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {/* All forecast cards */}
      {!empty && (data?.forecasts?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.forecasts}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.forecasts!.map((fc) => <ForecastCardView key={fc.id} fc={fc} labels={labels} />)}
          </div>
        </section>
      ) : null}

      {canReview && !empty ? (
        <button type="button" disabled={busy} onClick={() => void beginReview()}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {labels.emptyCta}
        </button>
      ) : null}

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

      {/* FAQ */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.guaranteed}</dt><dd className="mt-1 text-slate-600">{labels.faq.guaranteedAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whoShouldUse}</dt><dd className="mt-1 text-slate-600">{labels.faq.whoShouldUseAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function SpotlightCard({ title, card, labels }: { title: string; card: ForecastCard; labels: OrgForecastingLabels }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-sm font-medium text-slate-900">{card.title}</p>
      <p className="mt-1 text-sm text-slate-600">{card.projected_state_expected}</p>
      <p className="mt-2 text-xs text-slate-500">{labels.forecastCard.recommendedAction}: {card.recommended_action}</p>
    </div>
  );
}

function TrendBlock({ label, items, color }: { label: string; items: TrendItem[]; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "border-emerald-100 bg-emerald-50/40",
    slate:   "border-slate-200 bg-white",
    red:     "border-red-100 bg-red-50/40",
    amber:   "border-amber-100 bg-amber-50/40",
  };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color] ?? "border-slate-200 bg-white"}`}>
      <p className="text-xs font-medium text-slate-700">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{items.length}</p>
    </div>
  );
}

function CapacityCard({ cap, labels }: { cap: CapacityAssessment; labels: OrgForecastingLabels }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${cap.requires_attention ? "border-amber-200 bg-amber-50/30" : "border-slate-200 bg-white"}`}>
      <h3 className="font-semibold text-slate-900">{cap.area}</h3>
      <p className="mt-2 text-xs text-slate-500">{labels.capacityCard.currentCapacity}</p>
      <p className="text-sm text-slate-700">{cap.current_capacity}</p>
      <p className="mt-2 text-xs text-slate-500">{labels.capacityCard.estimatedFuture}</p>
      <p className="text-sm text-slate-700">{cap.estimated_future_capacity}</p>
      {cap.potential_bottlenecks.length > 0 ? (
        <>
          <p className="mt-2 text-xs font-medium text-slate-500">{labels.capacityCard.bottlenecks}</p>
          <ul className="mt-1 space-y-0.5 text-xs text-slate-600">
            {cap.potential_bottlenecks.map((b) => <li key={b}>· {b}</li>)}
          </ul>
        </>
      ) : null}
    </div>
  );
}

function ForecastCardView({ fc, labels }: { fc: ForecastCard; labels: OrgForecastingLabels }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">{fc.title}</h3>
      <dl className="mt-3 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.forecastCard.currentState}: </dt><dd className="inline text-slate-700">{fc.current_state}</dd></div>
        <div><dt className="inline">{labels.forecastCard.expected}: </dt><dd className="inline text-slate-700">{fc.projected_state_expected}</dd></div>
        <div><dt className="inline">{labels.forecastCard.confidence}: </dt><dd className="inline">{labels.confidenceLevels[fc.confidence_level as keyof typeof labels.confidenceLevels] ?? fc.confidence_level}</dd></div>
        <div><dt className="inline">{labels.forecastCard.trend}: </dt><dd className="inline">{labels.trendDirections[fc.trend_direction as keyof typeof labels.trendDirections] ?? fc.trend_direction}</dd></div>
        <div><dt className="inline">{labels.forecastCard.owner}: </dt><dd className="inline">{fc.leadership_owner}</dd></div>
      </dl>
      <Link href={`/app/intelligence/organizational-forecasting/${fc.id}`}
        className="mt-4 inline-block text-sm font-medium text-indigo-700 hover:underline">
        {labels.dashboard.viewForecast}
      </Link>
    </article>
  );
}
