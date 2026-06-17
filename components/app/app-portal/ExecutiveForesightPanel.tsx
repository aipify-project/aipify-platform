"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FORESIGHT_CATEGORIES,
  FORESIGHT_TIME_HORIZONS,
  ORGANIZATIONAL_AREAS,
  REVIEW_STATUSES,
  STRATEGIC_PRIORITIES,
  parseExecutiveForesightOverview,
  parseExecutiveForesightTimeline,
  type ExecutiveForesightLabels,
  type ExecutiveForesightOverview,
  type ForesightObservation,
  type ForesightTimelineEvent,
} from "@/lib/app-portal/executive-foresight";

type Props = { labels: ExecutiveForesightLabels };

export function ExecutiveForesightPanel({ labels }: Props) {
  const [data, setData] = useState<ExecutiveForesightOverview | null>(null);
  const [timeline, setTimeline] = useState<ForesightTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [strategicPriority, setStrategicPriority] = useState("");
  const [organizationalArea, setOrganizationalArea] = useState("");
  const [executiveOwner, setExecutiveOwner] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (timeHorizon) params.set("time_horizon", timeHorizon);
    if (strategicPriority) params.set("strategic_priority", strategicPriority);
    if (organizationalArea) params.set("organizational_area", organizationalArea);
    if (executiveOwner.trim()) params.set("executive_owner", executiveOwner.trim());
    if (reviewStatus) params.set("review_status", reviewStatus);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());

    const timelineParams = new URLSearchParams();
    if (periodFrom) timelineParams.set("period_from", periodFrom);

    const [dashRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/executive-foresight?${params}`),
      fetch(`/api/aipify/executive-foresight/timeline?${timelineParams}`),
    ]);

    if (dashRes.ok) {
      setData(parseExecutiveForesightOverview(await dashRes.json()));
    } else {
      const body = (await dashRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { events?: unknown };
      setTimeline(parseExecutiveForesightTimeline(body));
    }
    setLoading(false);
  }, [category, timeHorizon, strategicPriority, organizationalArea, executiveOwner, reviewStatus, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function beginStrategicReview() {
    setBusy(true);
    setActionMessage("");
    const res = await fetch("/api/aipify/executive-foresight/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "begin_review" }),
    });
    setBusy(false);
    if (res.ok) {
      setActionMessage(labels.beginReview.success);
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

  const empty = !data?.has_foresight_data;
  const canReview = data?.can_review === true;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
        {data?.foresight_advisory_note ? (
          <p className="mt-3 text-sm text-slate-600">{labels.advisoryNote}</p>
        ) : null}
      </div>

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          {canReview ? (
            <button type="button" disabled={busy} onClick={() => void beginStrategicReview()} className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{labels.emptyCta}</button>
          ) : null}
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveOutlookScore}</p>
            <p className="mt-2 text-3xl font-semibold text-indigo-700">{data?.executive_outlook_score ?? "—"}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveSummary}</p>
            <p className="mt-2 text-sm text-slate-700">{data?.executive_summary}</p>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <InsightBlock title={labels.dashboard.emergingOpportunities} items={data?.emerging_opportunities ?? []} />
            <InsightBlock title={labels.dashboard.emergingRisks} items={data?.emerging_risks ?? []} />
            <InsightBlock title={labels.dashboard.strategicTopicsRequiringAttention} items={data?.strategic_topics_requiring_attention ?? []} />
            <InsightBlock title={labels.dashboard.longTermFocusAreas} items={data?.long_term_focus_areas ?? []} />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <InsightBlock title={labels.dashboard.areasGainingMomentum} items={data?.areas_gaining_momentum ?? []} />
            <InsightBlock title={labels.dashboard.areasLosingMomentum} items={data?.areas_losing_momentum ?? []} />
          </section>

          {(data?.recommended_conversations?.length ?? 0) > 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{labels.dashboard.recommendedConversations}</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {data!.recommended_conversations!.map((c) => (
                  <li key={c.id}>{c.topic}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {(data?.executive_questions?.length ?? 0) > 0 ? (
            <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
              <h2 className="font-semibold">{labels.dashboard.executiveQuestions}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-800">
                {data!.executive_questions!.map((q) => (
                  <li key={q.key}>{q.question}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}

      <section>
        <p className="mb-3 text-sm font-medium text-slate-700">{labels.dashboard.longTermPlanning}</p>
        <div className="flex flex-wrap gap-2">
          {FORESIGHT_TIME_HORIZONS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setTimeHorizon(timeHorizon === h ? "" : h)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${timeHorizon === h ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}
            >
              {labels.timeHorizons[h]}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {FORESIGHT_CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
        </select>
        <select value={strategicPriority} onChange={(e) => setStrategicPriority(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.strategicPriority}</option>
          {STRATEGIC_PRIORITIES.map((p) => <option key={p} value={p}>{labels.strategicPriorities[p]}</option>)}
        </select>
        <select value={organizationalArea} onChange={(e) => setOrganizationalArea(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.organizationalArea}</option>
          {ORGANIZATIONAL_AREAS.map((a) => <option key={a} value={a}>{a.replace(/_/g, " ")}</option>)}
        </select>
        <input value={executiveOwner} onChange={(e) => setExecutiveOwner(e.target.value)} placeholder={labels.filters.executiveOwner} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.reviewStatus}</option>
          {REVIEW_STATUSES.map((s) => <option key={s} value={s}>{labels.reviewStatuses[s]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.timePeriod} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.observations?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.observations}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.observations!.map((obs) => (
              <ObservationCardView key={obs.id} obs={obs} labels={labels} />
            ))}
          </div>
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

      {canReview && !empty ? (
        <button type="button" disabled={busy} onClick={() => void beginStrategicReview()} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{labels.emptyCta}</button>
      ) : null}

      {actionMessage ? <p className="text-sm text-emerald-700">{actionMessage}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.predictFuture}</dt><dd className="mt-1 text-slate-600">{labels.faq.predictFutureAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whoShouldUse}</dt><dd className="mt-1 text-slate-600">{labels.faq.whoShouldUseAnswer}</dd></div>
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

function ObservationCardView({ obs, labels }: { obs: ForesightObservation; labels: ExecutiveForesightLabels }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">{obs.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{obs.summary}</p>
      <dl className="mt-3 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.card.category}: </dt><dd className="inline">{labels.categories[obs.category as keyof typeof labels.categories] ?? obs.category}</dd></div>
        <div><dt className="inline">{labels.card.strategicPriority}: </dt><dd className="inline">{labels.strategicPriorities[obs.strategic_priority as keyof typeof labels.strategicPriorities] ?? obs.strategic_priority}</dd></div>
        <div><dt className="inline">{labels.card.timeHorizon}: </dt><dd className="inline">{labels.timeHorizons[obs.time_horizon as keyof typeof labels.timeHorizons] ?? obs.time_horizon}</dd></div>
        <div><dt className="inline">{labels.card.momentum}: </dt><dd className="inline">{labels.momentumDirections[obs.momentum_direction as keyof typeof labels.momentumDirections] ?? obs.momentum_direction}</dd></div>
      </dl>
      <Link href={`/app/intelligence/executive-foresight/${obs.id}`} className="mt-4 inline-block text-sm font-medium text-indigo-700 hover:underline">
        {labels.dashboard.viewObservation}
      </Link>
    </article>
  );
}
