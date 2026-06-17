"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  COMPLIANCE_PRIORITY_LEVELS,
  COMPLIANCE_STATUSES,
  POLICY_CATEGORIES,
  parseComplianceOverview,
  parseComplianceTimeline,
  type ComplianceLabels,
  type ComplianceOverview,
  type CompliancePackCard,
  type ComplianceTimelineEvent,
} from "@/lib/app-portal/business-pack-compliance";

type Props = { labels: ComplianceLabels };

const STATUS_STYLE: Record<string, string> = {
  aligned: "bg-emerald-100 text-emerald-900",
  healthy: "bg-teal-100 text-teal-900",
  requires_review: "bg-amber-100 text-amber-950",
  review_overdue: "bg-orange-100 text-orange-950",
  immediate_attention: "bg-red-100 text-red-900",
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export function BusinessPackCompliancePanel({ labels }: Props) {
  const [data, setData] = useState<ComplianceOverview | null>(null);
  const [timeline, setTimeline] = useState<ComplianceTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [complianceStatus, setComplianceStatus] = useState("");
  const [packKey, setPackKey] = useState("");
  const [policyCategory, setPolicyCategory] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [reviewKey, setReviewKey] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (complianceStatus) params.set("compliance_status", complianceStatus);
    if (packKey) params.set("pack_key", packKey);
    if (policyCategory) params.set("policy_category", policyCategory);
    if (reviewer) params.set("reviewer", reviewer);
    if (priorityLevel) params.set("priority_level", priorityLevel);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());

    const timelineParams = new URLSearchParams();
    if (periodFrom) timelineParams.set("period_from", periodFrom);

    const [dashRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/business-packs/compliance?${params}`),
      fetch(`/api/aipify/business-packs/compliance/timeline?${timelineParams}`),
    ]);

    if (dashRes.ok) {
      setData(parseComplianceOverview(await dashRes.json()));
    } else {
      const body = (await dashRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { events?: unknown };
      setTimeline(parseComplianceTimeline(body));
    }
    setLoading(false);
  }, [complianceStatus, packKey, policyCategory, reviewer, priorityLevel, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function completeReview(packKeyValue: string) {
    setBusy(true);
    setReviewMessage("");
    const res = await fetch("/api/aipify/business-packs/compliance/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pack_key: packKeyValue, governance_notes: reviewNotes }),
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

  const empty = !data?.has_compliance_data;
  const canReview = data?.can_review === true;
  const insights = data?.insights;
  const alignment = data?.policy_alignment;

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
          <Link href="/app/business-packs/governance" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</Link>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveSummary}</p>
            <p className="mt-2 text-sm text-slate-700">{data?.executive_summary}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={labels.dashboard.complianceHealthScore} value={`${data?.compliance_health_score ?? 0}%`} />
            <Stat label={labels.dashboard.packsUnderReview} value={String(data?.packs_under_review ?? 0)} />
            <Stat label={labels.dashboard.packsMissingReviews} value={String(data?.packs_missing_reviews ?? 0)} />
            <Stat label={labels.dashboard.upcomingReviews} value={String(data?.upcoming_compliance_reviews ?? 0)} />
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <Stat label={labels.dashboard.recentlyCompleted} value={String(data?.recently_completed_reviews ?? 0)} />
            <Stat label={labels.dashboard.openRecommendations} value={String(data?.open_compliance_recommendations ?? 0)} />
          </section>

          {alignment ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{labels.dashboard.policyAlignment}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Stat label={labels.policyAlignment.reviewed} value={String(alignment.policies_reviewed ?? 0)} />
                <Stat label={labels.policyAlignment.acknowledged} value={String(alignment.policies_acknowledged ?? 0)} />
                <Stat label={labels.policyAlignment.requiringReview} value={String(alignment.policies_requiring_review ?? 0)} />
                <Stat label={labels.policyAlignment.pendingApproval} value={String(alignment.policies_pending_approval ?? 0)} />
                <Stat label={labels.policyAlignment.requiringUpdates} value={String(alignment.policies_requiring_updates ?? 0)} />
              </div>
            </section>
          ) : null}
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={complianceStatus} onChange={(e) => setComplianceStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.complianceStatus}</option>
          {COMPLIANCE_STATUSES.map((s) => <option key={s} value={s}>{labels.complianceStatuses[s]}</option>)}
        </select>
        <input value={packKey} onChange={(e) => setPackKey(e.target.value)} placeholder={labels.filters.packKey} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={policyCategory} onChange={(e) => setPolicyCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.policyCategory}</option>
          {POLICY_CATEGORIES.map((c) => <option key={c} value={c}>{labels.policyCategories[c]}</option>)}
        </select>
        <input value={reviewer} onChange={(e) => setReviewer(e.target.value)} placeholder={labels.filters.reviewer} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={priorityLevel} onChange={(e) => setPriorityLevel(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priorityLevel}</option>
          {COMPLIANCE_PRIORITY_LEVELS.map((p) => <option key={p} value={p}>{labels.priorityLevels[p]}</option>)}
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
                busy={busy}
                onToggle={() => setExpandedKey(expandedKey === pack.pack_key ? null : pack.pack_key)}
                onOpenReview={() => setReviewKey(reviewKey === pack.pack_key ? null : pack.pack_key)}
                onReviewNotesChange={setReviewNotes}
                onReview={() => void completeReview(pack.pack_key)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!empty && insights ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.complianceInsights}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InsightList title={labels.insights.approachingDeadlines} items={insights.approaching_deadlines?.map((i) => i.name ?? i.pack_key ?? "") ?? []} />
            <InsightList title={labels.insights.missingAcknowledgements} items={insights.missing_acknowledgements?.map((i) => i.name ?? i.pack_key ?? "") ?? []} />
            <InsightList title={labels.insights.governanceGaps} items={insights.governance_gaps?.map((i) => i.name ?? i.pack_key ?? "") ?? []} />
            <InsightList title={labels.insights.strongPractices} items={insights.strong_practices?.map((i) => i.name ?? i.pack_key ?? "") ?? []} />
            <InsightList title={labels.insights.improvementOpportunities} items={insights.improvement_opportunities?.map((i) => i.name ?? i.pack_key ?? "") ?? []} />
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
          <div><dt className="font-medium">{labels.faq.legalAdvice}</dt><dd className="mt-1 text-slate-600">{labels.faq.legalAdviceAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.completeCompliance}</dt><dd className="mt-1 text-slate-600">{labels.faq.completeComplianceAnswer}</dd></div>
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
  busy,
  onToggle,
  onOpenReview,
  onReviewNotesChange,
  onReview,
}: {
  pack: CompliancePackCard;
  labels: ComplianceLabels;
  expanded: boolean;
  canReview: boolean;
  reviewOpen: boolean;
  reviewNotes: string;
  busy: boolean;
  onToggle: () => void;
  onOpenReview: () => void;
  onReviewNotesChange: (v: string) => void;
  onReview: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{pack.name}</h3>
          <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[pack.compliance_status] ?? STATUS_STYLE.requires_review}`}>
            {labels.complianceStatuses[pack.compliance_status as keyof typeof labels.complianceStatuses] ?? pack.compliance_status}
          </span>
        </div>
        <p className="text-xs text-slate-500">{labels.reviewFrequencies[pack.review_frequency as keyof typeof labels.reviewFrequencies] ?? pack.review_frequency}</p>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        <div><dt className="text-xs text-slate-500">{labels.card.assignedReviewer}</dt><dd>{pack.assigned_reviewer || "—"}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.nextReview}</dt><dd>{formatDate(pack.next_review_at)}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.lastReview}</dt><dd>{formatDate(pack.last_review_at)}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={onToggle} className="text-sm font-medium text-indigo-700 hover:underline">{labels.card.viewDetails}</button>
        {canReview ? (
          <button type="button" onClick={onOpenReview} className="text-sm font-medium text-indigo-700 hover:underline">{labels.card.completeReview}</button>
        ) : null}
      </div>
      {expanded && (pack.open_recommendations?.length ?? 0) > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500">{labels.card.openRecommendations}</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
            {pack.open_recommendations!.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ) : null}
      {reviewOpen ? (
        <div className="mt-4 space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-sm">
          <p className="font-medium">{labels.review.title}</p>
          <p className="text-slate-600">{labels.review.governanceNote}</p>
          <textarea value={reviewNotes} onChange={(e) => onReviewNotesChange(e.target.value)} placeholder={labels.review.notes} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          <button type="button" disabled={busy} onClick={onReview} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{labels.review.submit}</button>
        </div>
      ) : null}
    </article>
  );
}
