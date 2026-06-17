"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  GOVERNANCE_STATUSES,
  GOVERNANCE_REVIEW_FREQUENCIES,
  parseGovernanceOverview,
  parseGovernanceTimeline,
  type GovernanceLabels,
  type GovernanceOverview,
  type GovernancePackCard,
  type GovernanceTimelineEvent,
} from "@/lib/app-portal/business-pack-governance";

type Props = { labels: GovernanceLabels };

const GOVERNANCE_STYLE: Record<string, string> = {
  well_governed: "bg-emerald-100 text-emerald-900",
  healthy: "bg-teal-100 text-teal-900",
  stable: "bg-slate-100 text-slate-700",
  requires_review: "bg-amber-100 text-amber-950",
  governance_gap_identified: "bg-red-100 text-red-900",
};

const HEALTH_STYLE: Record<string, string> = {
  thriving: "bg-emerald-100 text-emerald-900",
  healthy: "bg-teal-100 text-teal-900",
  stable: "bg-slate-100 text-slate-700",
  requires_attention: "bg-amber-100 text-amber-950",
  critical_governance_gap: "bg-red-100 text-red-900",
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export function BusinessPackGovernancePanel({ labels }: Props) {
  const [data, setData] = useState<GovernanceOverview | null>(null);
  const [timeline, setTimeline] = useState<GovernanceTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [governanceStatus, setGovernanceStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [primaryOwner, setPrimaryOwner] = useState("");
  const [backupOwner, setBackupOwner] = useState("");
  const [reviewFrequency, setReviewFrequency] = useState("");
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
    if (governanceStatus) params.set("governance_status", governanceStatus);
    if (department) params.set("department", department);
    if (primaryOwner) params.set("primary_owner", primaryOwner);
    if (backupOwner) params.set("backup_owner", backupOwner);
    if (reviewFrequency) params.set("review_frequency", reviewFrequency);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());

    const timelineParams = new URLSearchParams();
    if (periodFrom) timelineParams.set("period_from", periodFrom);

    const [dashRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/business-packs/governance?${params}`),
      fetch(`/api/aipify/business-packs/governance/timeline?${timelineParams}`),
    ]);

    if (dashRes.ok) {
      setData(parseGovernanceOverview(await dashRes.json()));
    } else {
      const body = (await dashRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { events?: unknown };
      setTimeline(parseGovernanceTimeline(body));
    }
    setLoading(false);
  }, [governanceStatus, department, primaryOwner, backupOwner, reviewFrequency, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function completeReview(packKey: string) {
    setBusy(true);
    setReviewMessage("");
    const res = await fetch("/api/aipify/business-packs/governance/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pack_key: packKey, governance_notes: reviewNotes }),
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

  const empty = !data?.has_governance_data;
  const canReview = data?.can_review === true;
  const insights = data?.insights;

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
            <Stat label={labels.dashboard.totalPacks} value={String(data?.total_packs ?? 0)} />
            <Stat label={labels.dashboard.packsWithOwners} value={String(data?.packs_with_owners ?? 0)} />
            <Stat label={labels.dashboard.packsMissingOwners} value={String(data?.packs_missing_owners ?? 0)} />
            <Stat label={labels.dashboard.governanceHealthScore} value={`${data?.governance_health_score ?? 0}%`} />
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <Stat label={labels.dashboard.upcomingReviews} value={String(data?.upcoming_reviews ?? 0)} />
            <Stat label={labels.dashboard.ownershipChanges} value={String(data?.ownership_changes ?? 0)} />
          </section>
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={governanceStatus} onChange={(e) => setGovernanceStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.governanceStatus}</option>
          {GOVERNANCE_STATUSES.map((s) => <option key={s} value={s}>{labels.governanceStatuses[s]}</option>)}
        </select>
        <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder={labels.filters.department} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={primaryOwner} onChange={(e) => setPrimaryOwner(e.target.value)} placeholder={labels.filters.primaryOwner} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={backupOwner} onChange={(e) => setBackupOwner(e.target.value)} placeholder={labels.filters.backupOwner} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={reviewFrequency} onChange={(e) => setReviewFrequency(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.reviewFrequency}</option>
          {GOVERNANCE_REVIEW_FREQUENCIES.map((f) => <option key={f} value={f}>{labels.reviewFrequencies[f]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
          <h2 className="font-semibold">{labels.dashboard.governanceInsights}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InsightList title={labels.insights.packsWithoutOwnership} items={insights.packs_without_ownership?.map((i) => i.name ?? i.pack_key ?? "") ?? []} />
            <InsightList title={labels.insights.packsOverdueReview} items={insights.packs_overdue_review?.map((i) => i.name ?? i.pack_key ?? "") ?? []} />
            <InsightList title={labels.insights.ownershipConcentration} items={insights.ownership_concentration?.map((i) => `${i.primary_owner ?? ""} (${i.count ?? 0})`) ?? []} />
            <InsightList title={labels.insights.strongestDepartments} items={insights.strongest_departments?.map((i) => `${i.department ?? ""} (${i.count ?? 0})`) ?? []} />
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
          <div><dt className="font-medium">{labels.faq.whyOwners}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyOwnersAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoAssign}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoAssignAnswer}</dd></div>
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
  pack: GovernancePackCard;
  labels: GovernanceLabels;
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
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${GOVERNANCE_STYLE[pack.governance_status] ?? GOVERNANCE_STYLE.stable}`}>
              {labels.governanceStatuses[pack.governance_status as keyof typeof labels.governanceStatuses] ?? pack.governance_status}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${HEALTH_STYLE[pack.health_status] ?? HEALTH_STYLE.stable}`}>
              {labels.healthStatuses[pack.health_status as keyof typeof labels.healthStatuses] ?? pack.health_status}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-500">{labels.reviewFrequencies[pack.review_frequency as keyof typeof labels.reviewFrequencies] ?? pack.review_frequency}</p>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        <div><dt className="text-xs text-slate-500">{labels.card.primaryOwner}</dt><dd>{pack.primary_owner || "—"}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.backupOwner}</dt><dd>{pack.backup_owner || "—"}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.department}</dt><dd>{pack.department || "—"}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.nextReview}</dt><dd>{formatDate(pack.next_review_at)}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={onToggle} className="text-sm font-medium text-indigo-700 hover:underline">{labels.card.viewDetails}</button>
        {canReview ? (
          <button type="button" onClick={onOpenReview} className="text-sm font-medium text-indigo-700 hover:underline">{labels.card.completeReview}</button>
        ) : null}
      </div>
      {expanded && (pack.related_risks?.length ?? 0) > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500">{labels.card.relatedRisks}</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
            {pack.related_risks!.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ) : null}
      {expanded && (pack.recommended_actions?.length ?? 0) > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500">{labels.card.recommendedActions}</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
            {pack.recommended_actions!.map((item) => <li key={item}>{item}</li>)}
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
