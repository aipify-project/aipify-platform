"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  PORTFOLIO_MATURITY_LEVELS,
  PORTFOLIO_PRIORITY_LEVELS,
  PORTFOLIO_REVIEW_OUTCOMES,
  PORTFOLIO_REVIEW_TYPES,
  PORTFOLIO_STATUSES,
  parseExecutivePortfolioOverview,
  parseExecutivePortfolioTimeline,
  type ExecutivePortfolioLabels,
  type ExecutivePortfolioOverview,
  type ExecutivePortfolioPackCard,
  type PortfolioTimelineEvent,
} from "@/lib/app-portal/business-pack-executive-portfolio";

type Props = { labels: ExecutivePortfolioLabels };

const STATUS_STYLE: Record<string, string> = {
  high_performing: "bg-emerald-100 text-emerald-900",
  healthy: "bg-teal-100 text-teal-900",
  stable: "bg-slate-100 text-slate-700",
  requires_optimization: "bg-amber-100 text-amber-950",
  executive_attention_required: "bg-red-100 text-red-900",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function BusinessPackExecutivePortfolioPanel({ labels }: Props) {
  const [data, setData] = useState<ExecutivePortfolioOverview | null>(null);
  const [timeline, setTimeline] = useState<PortfolioTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [portfolioStatus, setPortfolioStatus] = useState("");
  const [packKey, setPackKey] = useState("");
  const [maturityLevel, setMaturityLevel] = useState("");
  const [executiveSponsor, setExecutiveSponsor] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [reviewKey, setReviewKey] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewType, setReviewType] = useState("quarterly_executive");
  const [reviewOutcome, setReviewOutcome] = useState("continue_investment");
  const [reviewMessage, setReviewMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (portfolioStatus) params.set("portfolio_status", portfolioStatus);
    if (packKey) params.set("pack_key", packKey);
    if (maturityLevel) params.set("maturity_level", maturityLevel);
    if (executiveSponsor) params.set("executive_sponsor", executiveSponsor);
    if (priorityLevel) params.set("priority_level", priorityLevel);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());

    const timelineParams = new URLSearchParams();
    if (periodFrom) timelineParams.set("period_from", periodFrom);

    const [dashRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/business-packs/executive-portfolio?${params}`),
      fetch(`/api/aipify/business-packs/executive-portfolio/timeline?${timelineParams}`),
    ]);

    if (dashRes.ok) {
      setData(parseExecutivePortfolioOverview(await dashRes.json()));
    } else {
      const body = (await dashRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { events?: unknown };
      setTimeline(parseExecutivePortfolioTimeline(body));
    }
    setLoading(false);
  }, [portfolioStatus, packKey, maturityLevel, executiveSponsor, priorityLevel, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function completeReview(packKeyValue: string) {
    setBusy(true);
    setReviewMessage("");
    const res = await fetch("/api/aipify/business-packs/executive-portfolio/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pack_key: packKeyValue,
        review_type: reviewType,
        review_outcome: reviewOutcome,
        governance_notes: reviewNotes,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setReviewKey(null);
      setReviewNotes("");
      setReviewMessage(labels.review.success);
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

  const empty = !data?.has_portfolio_data;
  const canReview = data?.can_review === true;
  const insights = data?.insights;
  const overview = data?.portfolio_overview;

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
          <Link href="/app/business-packs/installed" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</Link>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveSummary}</p>
            <p className="mt-2 text-sm text-slate-700">{data?.executive_summary}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={labels.dashboard.portfolioHealthScore} value={`${data?.portfolio_health_score ?? 0}%`} />
            <Stat label={labels.dashboard.totalInstalled} value={String(data?.total_installed ?? 0)} />
            <Stat label={labels.dashboard.totalActive} value={String(data?.total_active ?? 0)} />
            <Stat label={labels.dashboard.totalValueRealized} value={formatCurrency(data?.total_value_realized ?? 0)} />
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <Stat label={labels.dashboard.packsRequiringAttention} value={String(data?.packs_requiring_attention ?? 0)} />
            <Stat label={labels.dashboard.portfolioGrowthTrend} value={labels.growthTrends[data?.portfolio_growth_trend as keyof typeof labels.growthTrends] ?? data?.portfolio_growth_trend ?? "—"} />
            <Stat label={labels.dashboard.maturityLevel} value={labels.maturityLevels[data?.portfolio_maturity_level as keyof typeof labels.maturityLevels] ?? data?.portfolio_maturity_level ?? "—"} />
          </section>

          {overview ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{labels.dashboard.portfolioOverview}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label={labels.overview.installedPacks} value={String(overview.installed_packs ?? 0)} />
                <Stat label={labels.overview.adoptionOverview} value={`${overview.adoption_overview ?? 0}%`} />
                <Stat label={labels.overview.governanceOverview} value={`${overview.governance_overview ?? 0}%`} />
                <Stat label={labels.overview.valueOverview} value={formatCurrency(overview.value_overview ?? 0)} />
              </div>
            </section>
          ) : null}
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={portfolioStatus} onChange={(e) => setPortfolioStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.portfolioStatus}</option>
          {PORTFOLIO_STATUSES.map((s) => <option key={s} value={s}>{labels.portfolioStatuses[s]}</option>)}
        </select>
        <input value={packKey} onChange={(e) => setPackKey(e.target.value)} placeholder={labels.filters.packKey} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={maturityLevel} onChange={(e) => setMaturityLevel(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.maturityLevel}</option>
          {PORTFOLIO_MATURITY_LEVELS.map((m) => <option key={m} value={m}>{labels.maturityLevels[m]}</option>)}
        </select>
        <input value={executiveSponsor} onChange={(e) => setExecutiveSponsor(e.target.value)} placeholder={labels.filters.executiveSponsor} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={priorityLevel} onChange={(e) => setPriorityLevel(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priorityLevel}</option>
          {PORTFOLIO_PRIORITY_LEVELS.map((p) => <option key={p} value={p}>{labels.priorityLevels[p]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.reviewPeriod} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.packs?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.healthOverview}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.packs!.map((pack) => (
              <PackCardView
                key={pack.pack_key}
                pack={pack}
                labels={labels}
                expanded={expandedKey === pack.pack_key}
                canReview={canReview}
                reviewOpen={reviewKey === pack.pack_key}
                reviewNotes={reviewNotes}
                reviewType={reviewType}
                reviewOutcome={reviewOutcome}
                busy={busy}
                onToggle={() => setExpandedKey(expandedKey === pack.pack_key ? null : pack.pack_key)}
                onOpenReview={() => setReviewKey(reviewKey === pack.pack_key ? null : pack.pack_key)}
                onReviewNotesChange={setReviewNotes}
                onReviewTypeChange={setReviewType}
                onReviewOutcomeChange={setReviewOutcome}
                onReview={() => void completeReview(pack.pack_key)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!empty && insights ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.portfolioInsights}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InsightList title={labels.insights.highestPerforming} items={insights.highest_performing?.map((i) => i.name ?? i.pack_key ?? "") ?? []} />
            <InsightList title={labels.insights.underutilized} items={insights.underutilized?.map((i) => i.name ?? i.pack_key ?? "") ?? []} />
            <InsightList title={labels.insights.strongestRoi} items={insights.strongest_roi?.map((i) => i.name ?? i.pack_key ?? "") ?? []} />
            <InsightList title={labels.insights.governanceAttention} items={insights.governance_attention?.map((i) => i.name ?? i.pack_key ?? "") ?? []} />
            <InsightList title={labels.insights.optimizationOpportunities} items={insights.optimization_opportunities?.map((i) => i.name ?? i.pack_key ?? "") ?? []} />
            <InsightList title={labels.insights.maturityObservations} items={insights.maturity_observations ?? []} />
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
          <h2 className="font-semibold">{labels.dashboard.recommendedActions}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {data!.recommendations!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {reviewMessage ? <p className="text-sm text-emerald-700">{reviewMessage}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.investmentDecisions}</dt><dd className="mt-1 text-slate-600">{labels.faq.investmentDecisionsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyOversight}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyOversightAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return null;
  return (
    <div>
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-600">{filtered.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function PackCardView({
  pack,
  labels,
  expanded,
  canReview,
  reviewOpen,
  reviewNotes,
  reviewType,
  reviewOutcome,
  busy,
  onToggle,
  onOpenReview,
  onReviewNotesChange,
  onReviewTypeChange,
  onReviewOutcomeChange,
  onReview,
}: {
  pack: ExecutivePortfolioPackCard;
  labels: ExecutivePortfolioLabels;
  expanded: boolean;
  canReview: boolean;
  reviewOpen: boolean;
  reviewNotes: string;
  reviewType: string;
  reviewOutcome: string;
  busy: boolean;
  onToggle: () => void;
  onOpenReview: () => void;
  onReviewNotesChange: (v: string) => void;
  onReviewTypeChange: (v: string) => void;
  onReviewOutcomeChange: (v: string) => void;
  onReview: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{pack.name}</h3>
          <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[pack.portfolio_status] ?? STATUS_STYLE.stable}`}>
            {labels.portfolioStatuses[pack.portfolio_status as keyof typeof labels.portfolioStatuses] ?? pack.portfolio_status}
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-900">{formatCurrency(pack.estimated_value)}</p>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        <div><dt className="text-xs text-slate-500">{labels.card.adoptionScore}</dt><dd>{pack.adoption_score}%</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.valueScore}</dt><dd>{pack.value_score}%</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.governanceScore}</dt><dd>{pack.governance_score}%</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.executiveSponsor}</dt><dd>{pack.executive_sponsor || "—"}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={onToggle} className="text-sm font-medium text-indigo-700 hover:underline">{labels.card.viewDetails}</button>
        {canReview ? (
          <button type="button" onClick={onOpenReview} className="text-sm font-medium text-indigo-700 hover:underline">{labels.card.completeReview}</button>
        ) : null}
      </div>
      {expanded ? (
        <p className="mt-4 text-sm text-slate-600"><span className="font-medium">{labels.card.recommendedAction}:</span> {pack.recommended_action}</p>
      ) : null}
      {reviewOpen ? (
        <div className="mt-4 space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-sm">
          <p className="font-medium">{labels.review.title}</p>
          <p className="text-slate-600">{labels.review.governanceNote}</p>
          <select value={reviewType} onChange={(e) => onReviewTypeChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2">
            {PORTFOLIO_REVIEW_TYPES.map((t) => <option key={t} value={t}>{labels.reviewTypes[t]}</option>)}
          </select>
          <select value={reviewOutcome} onChange={(e) => onReviewOutcomeChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2">
            {PORTFOLIO_REVIEW_OUTCOMES.map((o) => <option key={o} value={o}>{labels.reviewOutcomes[o]}</option>)}
          </select>
          <textarea value={reviewNotes} onChange={(e) => onReviewNotesChange(e.target.value)} placeholder={labels.review.notes} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          <button type="button" disabled={busy} onClick={onReview} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{labels.review.submit}</button>
        </div>
      ) : null}
    </article>
  );
}
