"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  BRIEFING_PERIODS,
  PRIORITY_LEVELS,
  REVIEW_STATUSES,
  parseICCBriefing,
  parseICCOverview,
  parseICCTimeline,
  type BriefingPeriod,
  type ExecutiveBriefing,
  type ICCTimelineEvent,
  type IntelligenceCommandCenterLabels,
  type IntelligenceCommandCenterOverview,
  type IntelligencePriority,
  type IntelligenceSource,
} from "@/lib/app-portal/intelligence-command-center";

type Props = { labels: IntelligenceCommandCenterLabels };

const PRIORITY_COLOR: Record<string, string> = {
  critical: "border-l-4 border-red-500 bg-red-50/40",
  high:     "border-l-4 border-amber-500 bg-amber-50/40",
  medium:   "border-l-4 border-indigo-300 bg-white",
  low:      "border-l-4 border-slate-200 bg-white",
};

export function IntelligenceCommandCenterPanel({ labels }: Props) {
  const [data, setData] = useState<IntelligenceCommandCenterOverview | null>(null);
  const [timeline, setTimeline] = useState<ICCTimelineEvent[]>([]);
  const [briefing, setBriefing] = useState<ExecutiveBriefing | null>(null);
  const [briefingPeriod, setBriefingPeriod] = useState<BriefingPeriod>("this_week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterReviewStatus, setFilterReviewStatus] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (filterPriority) p.set("priority", filterPriority);
    if (filterReviewStatus) p.set("review_status", filterReviewStatus);
    if (search.trim()) p.set("search", search.trim());

    const [dashRes, tlRes, briefRes] = await Promise.all([
      fetch(`/api/aipify/intelligence-command-center?${p}`),
      fetch("/api/aipify/intelligence-command-center/timeline"),
      fetch(`/api/aipify/intelligence-command-center/briefing?period=${briefingPeriod}`),
    ]);

    if (dashRes.ok) {
      setData(parseICCOverview(await dashRes.json()));
    } else {
      const b = (await dashRes.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    if (tlRes.ok) setTimeline(parseICCTimeline(await tlRes.json()));
    if (briefRes.ok) {
      const b = await briefRes.json() as { briefing?: unknown };
      setBriefing(parseICCBriefing(b));
    }
    setLoading(false);
  }, [filterPriority, filterReviewStatus, search, briefingPeriod, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function refreshIntelligence() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/aipify/intelligence-command-center/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "refresh" }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.refresh.success);
      void load();
    }
  }

  async function markReviewed(priorityId: string) {
    const res = await fetch("/api/aipify/intelligence-command-center/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_reviewed", priority_id: priorityId }),
    });
    if (res.ok) void load();
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

  const empty = !data?.has_intelligence_data;
  const canReview = data?.can_review === true;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      </div>

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <Link href="/app/intelligence/benchmarking"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">
            {labels.emptyCta}
          </Link>
        </section>
      ) : (
        <>
          {/* SECTION 1: Score cockpit */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreCell label={labels.dashboard.intelligenceScore}       value={data?.enterprise_intelligence_score}   featured />
            <ScoreCell label={labels.dashboard.readinessScore}          value={data?.organizational_readiness_score} />
            <ScoreCell label={labels.dashboard.collaborationScore}      value={data?.collaboration_health_score} />
            <ScoreCell label={labels.dashboard.opportunityScore}        value={data?.strategic_opportunity_score} />
            <ScoreCell label={labels.dashboard.executiveHealthScore}    value={data?.executive_health_score} />
            <ScoreCell label={labels.dashboard.forecastScore}           value={data?.forecast_confidence_score} />
            <ScoreCell label={labels.dashboard.futurePreparednessScore} value={data?.future_preparedness_score} />
          </section>

          {/* Executive summary */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveSummary}</p>
            <p className="mt-2 text-sm text-slate-800">{data?.executive_summary}</p>
            {(data?.key_observations?.length ?? 0) > 0 ? (
              <>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.keyObservations}</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {data!.key_observations!.map((o, i) => <li key={i}>· {o}</li>)}
                </ul>
              </>
            ) : null}
          </section>

          {/* SECTION 2: Briefing mode */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-900">{labels.dashboard.briefingMode}</h2>
              <div className="flex flex-wrap gap-2">
                {BRIEFING_PERIODS.map((period) => (
                  <button key={period} type="button"
                    onClick={() => setBriefingPeriod(period)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${briefingPeriod === period ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 text-slate-600"}`}>
                    {labels.briefing[period === "this_week" ? "thisWeek" : period === "this_month" ? "thisMonth" : period === "this_quarter" ? "thisQuarter" : "today"]}
                  </button>
                ))}
              </div>
            </div>
            {briefing ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-slate-800">{briefing.summary}</p>
                {briefing.key_observations.length > 0 ? (
                  <div>
                    <p className="text-xs font-medium text-slate-500">{labels.briefing.keyObservations}</p>
                    <ul className="mt-1 space-y-1 text-sm text-slate-700">
                      {briefing.key_observations.map((o, i) => <li key={i}>· {o}</li>)}
                    </ul>
                  </div>
                ) : null}
                {briefing.suggested_actions.length > 0 ? (
                  <div>
                    <p className="text-xs font-medium text-slate-500">{labels.briefing.suggestedActions}</p>
                    <ul className="mt-1 space-y-1 text-sm text-slate-700">
                      {briefing.suggested_actions.map((a, i) => <li key={i}>→ {a}</li>)}
                    </ul>
                  </div>
                ) : null}
                {briefing.review_items.length > 0 ? (
                  <div>
                    <p className="text-xs font-medium text-slate-500">{labels.briefing.reviewItems}</p>
                    <ul className="mt-1 space-y-1 text-sm text-slate-700">
                      {briefing.review_items.map((r, i) => <li key={i}>☐ {r}</li>)}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* SECTION 3: Future Outlook */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">{labels.dashboard.futureOutlook}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {Object.entries(data?.outlook ?? {}).map(([key, text]) => (
                <div key={key} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500">{labels.outlook[key as keyof typeof labels.outlook] ?? key}</p>
                  <p className="mt-1 text-xs text-slate-700">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: Intelligence sources */}
          {(data?.intelligence_sources?.length ?? 0) > 0 ? (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">{labels.dashboard.intelligenceSources}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {data!.intelligence_sources!.map((s) => (
                  <SourceCard key={s.key} source={s} labels={labels} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}

      {/* Filters + Priorities */}
      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {PRIORITY_LEVELS.map((p) => <option key={p} value={p}>{labels.priorityLevels[p]}</option>)}
        </select>
        <select value={filterReviewStatus} onChange={(e) => setFilterReviewStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.reviewStatus}</option>
          {REVIEW_STATUSES.map((s) => <option key={s} value={s}>{labels.reviewStatuses[s]}</option>)}
        </select>
      </section>

      {!empty && (data?.priorities?.length ?? 0) > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.topPriorities}</h2>
          <div className="space-y-3">
            {data!.priorities!.map((pr) => (
              <PriorityCard key={pr.id} priority={pr} labels={labels}
                canReview={canReview} onReview={markReviewed} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Timeline */}
      {!empty && timeline.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.timeline}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {timeline.map((e) => (
              <li key={e.id} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                  {labels.sourceModules[e.source_module as keyof typeof labels.sourceModules] ?? e.source_module}
                </span>
                <span>{labels.timelineEvents[e.event_type as keyof typeof labels.timelineEvents] ?? e.description}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {canReview ? (
        <button type="button" disabled={busy} onClick={() => void refreshIntelligence()}
          className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-medium text-indigo-800 disabled:opacity-60">
          {labels.dashboard.refreshIntelligence}
        </button>
      ) : null}

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.replacesModules}</dt><dd className="mt-1 text-slate-600">{labels.faq.replacesModulesAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whoShouldUse}</dt><dd className="mt-1 text-slate-600">{labels.faq.whoShouldUseAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ScoreCell({ label, value, featured }: { label: string; value?: number; featured?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${featured ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white"}`}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${featured ? "text-indigo-700" : "text-slate-800"}`}>{value ?? "—"}</p>
    </div>
  );
}

function SourceCard({ source, labels }: { source: IntelligenceSource; labels: IntelligenceCommandCenterLabels }) {
  const score = typeof source.score === "number" ? source.score : parseInt(String(source.score), 10) || 0;
  const pct = Math.min(100, score);
  return (
    <Link href={source.route} className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <p className="text-xs font-medium text-slate-900">{source.label}</p>
      <p className="mt-1 text-xl font-semibold text-indigo-700">{score}</p>
      <div className="mt-2 h-1 w-full rounded-full bg-slate-100">
        <div className="h-1 rounded-full bg-indigo-400" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-right text-xs text-indigo-600">{labels.dashboard.viewModule} →</p>
    </Link>
  );
}

function PriorityCard({
  priority, labels, canReview, onReview,
}: {
  priority: IntelligencePriority;
  labels: IntelligenceCommandCenterLabels;
  canReview: boolean;
  onReview: (id: string) => void;
}) {
  return (
    <article className={`rounded-2xl border p-5 shadow-sm ${PRIORITY_COLOR[priority.priority_level] ?? "border-slate-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-semibold text-slate-900">{priority.title}</p>
          <dl className="mt-2 grid gap-1 text-xs text-slate-500">
            <div>
              <dt className="inline">{labels.priority.sourceModule}: </dt>
              <dd className="inline">{labels.sourceModules[priority.source_module as keyof typeof labels.sourceModules] ?? priority.source_module}</dd>
            </div>
            <div>
              <dt className="inline">{labels.priority.priorityLevel}: </dt>
              <dd className="inline font-medium">{labels.priorityLevels[priority.priority_level as keyof typeof labels.priorityLevels] ?? priority.priority_level}</dd>
            </div>
          </dl>
          <p className="mt-2 text-sm text-slate-700">{priority.recommended_action}</p>
        </div>
        {canReview && priority.review_status === "pending" ? (
          <button type="button" onClick={() => onReview(priority.id)}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-indigo-300">
            {labels.dashboard.markReviewed}
          </button>
        ) : null}
      </div>
    </article>
  );
}
