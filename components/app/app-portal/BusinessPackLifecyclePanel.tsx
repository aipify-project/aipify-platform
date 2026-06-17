"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  PACK_LIFECYCLE_STAGES,
  PACK_REVIEW_STATUSES,
  parsePackLifecycleOverview,
  type PackLifecycleCard,
  type PackLifecycleLabels,
  type PackLifecycleOverview,
} from "@/lib/app-portal/business-pack-lifecycle";

type Props = { labels: PackLifecycleLabels };

const STAGE_STYLE: Record<string, string> = {
  planned: "bg-slate-100 text-slate-700",
  evaluating: "bg-violet-100 text-violet-900",
  implementing: "bg-blue-100 text-blue-900",
  active: "bg-teal-100 text-teal-900",
  optimizing: "bg-indigo-100 text-indigo-900",
  mature: "bg-emerald-100 text-emerald-900",
  under_review: "bg-amber-100 text-amber-950",
  retiring: "bg-orange-100 text-orange-950",
  retired: "bg-slate-200 text-slate-800",
};

export function BusinessPackLifecyclePanel({ labels }: Props) {
  const [data, setData] = useState<PackLifecycleOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lifecycleStage, setLifecycleStage] = useState("");
  const [reviewOwner, setReviewOwner] = useState("");
  const [department, setDepartment] = useState("");
  const [adoptionStatus, setAdoptionStatus] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [expandedPack, setExpandedPack] = useState<string | null>(null);
  const [reviewPack, setReviewPack] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewOwnerInput, setReviewOwnerInput] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (lifecycleStage) params.set("lifecycle_stage", lifecycleStage);
    if (reviewOwner) params.set("review_owner", reviewOwner);
    if (department) params.set("department", department);
    if (adoptionStatus) params.set("adoption_status", adoptionStatus);
    if (reviewStatus) params.set("review_status", reviewStatus);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/business-packs/lifecycle?${params}`);
    if (res.ok) {
      setData(parsePackLifecycleOverview(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [lifecycleStage, reviewOwner, department, adoptionStatus, reviewStatus, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function submitReview(packKey: string) {
    setBusy(true);
    const res = await fetch("/api/aipify/business-packs/lifecycle/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pack_key: packKey,
        review_type: "on_demand",
        review_owner: reviewOwnerInput,
        notes: reviewNotes,
        answers: {
          actively_used: true,
          objectives_achieved: true,
          additional_users: false,
          training_recommended: false,
          retirement_appropriate: false,
          upgrades_recommended: false,
        },
      }),
    });
    setBusy(false);
    if (res.ok) {
      setReviewPack(null);
      setReviewNotes("");
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

  const empty = !data?.has_lifecycle_data;
  const canManage = data?.can_manage === true;
  const distribution = data?.lifecycle_distribution ?? {};

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
          <Link href="/app/business-packs/available" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</Link>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <Stat label={labels.dashboard.totalInstalled} value={String(data?.total_installed ?? 0)} />
            <Stat label={labels.dashboard.packsRequiringReview} value={String(data?.packs_requiring_review ?? 0)} />
            <Stat label={labels.dashboard.upcomingReviews} value={String(data?.upcoming_reviews?.length ?? 0)} />
          </section>

          {Object.keys(distribution).length > 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{labels.dashboard.lifecycleDistribution}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(distribution).map(([stage, count]) => (
                  <span key={stage} className={`rounded-full px-3 py-1 text-xs font-medium ${STAGE_STYLE[stage] ?? STAGE_STYLE.active}`}>
                    {labels.stages[stage as keyof typeof labels.stages] ?? stage}: {count}
                  </span>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={lifecycleStage} onChange={(e) => setLifecycleStage(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.lifecycleStage}</option>
          {PACK_LIFECYCLE_STAGES.map((s) => <option key={s} value={s}>{labels.stages[s]}</option>)}
        </select>
        <input value={reviewOwner} onChange={(e) => setReviewOwner(e.target.value)} placeholder={labels.filters.reviewOwner} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder={labels.filters.department} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={adoptionStatus} onChange={(e) => setAdoptionStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.adoptionStatus}</option>
          <option value="low">{labels.filters.lowAdoption}</option>
          <option value="healthy">{labels.filters.healthyAdoption}</option>
          <option value="high">{labels.filters.highAdoption}</option>
        </select>
        <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.reviewStatus}</option>
          {PACK_REVIEW_STATUSES.map((s) => <option key={s} value={s}>{labels.reviewStatuses[s]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.packs?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.installedPacks}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.packs!.map((pack) => (
              <LifecycleCard
                key={pack.pack_key}
                pack={pack}
                labels={labels}
                expanded={expandedPack === pack.pack_key}
                canManage={canManage}
                reviewOpen={reviewPack === pack.pack_key}
                reviewNotes={reviewNotes}
                reviewOwnerInput={reviewOwnerInput}
                busy={busy}
                onToggle={() => setExpandedPack(expandedPack === pack.pack_key ? null : pack.pack_key)}
                onOpenReview={() => setReviewPack(reviewPack === pack.pack_key ? null : pack.pack_key)}
                onReviewNotesChange={setReviewNotes}
                onReviewOwnerChange={setReviewOwnerInput}
                onSubmitReview={() => void submitReview(pack.pack_key)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!empty && (data?.upcoming_reviews?.length ?? 0) > 0 ? (
        <HighlightList title={labels.dashboard.upcomingReviews} items={data!.upcoming_reviews!.map((p) => `${p.name} — ${p.next_review_at ?? ""}`)} />
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoRetire}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoRetireAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyReviews}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyReviewsAnswer}</dd></div>
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

function HighlightList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-3 space-y-1 text-sm text-slate-700">{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}

function LifecycleCard({
  pack,
  labels,
  expanded,
  canManage,
  reviewOpen,
  reviewNotes,
  reviewOwnerInput,
  busy,
  onToggle,
  onOpenReview,
  onReviewNotesChange,
  onReviewOwnerChange,
  onSubmitReview,
}: {
  pack: PackLifecycleCard;
  labels: PackLifecycleLabels;
  expanded: boolean;
  canManage: boolean;
  reviewOpen: boolean;
  reviewNotes: string;
  reviewOwnerInput: string;
  busy: boolean;
  onToggle: () => void;
  onOpenReview: () => void;
  onReviewNotesChange: (v: string) => void;
  onReviewOwnerChange: (v: string) => void;
  onSubmitReview: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{pack.name}</h3>
          <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STAGE_STYLE[pack.lifecycle_stage] ?? STAGE_STYLE.active}`}>
            {labels.stages[pack.lifecycle_stage as keyof typeof labels.stages] ?? pack.lifecycle_stage}
          </span>
        </div>
        <p className="text-sm text-slate-500">{labels.card.adoptionScore}: {pack.adoption_score}/100</p>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        <div><dt className="text-xs text-slate-500">{labels.card.installedDate}</dt><dd>{pack.installed_at ? new Date(pack.installed_at).toLocaleDateString() : "—"}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.lastActivity}</dt><dd>{pack.last_activity_at ? new Date(pack.last_activity_at).toLocaleDateString() : "—"}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.usersAssigned}</dt><dd>{pack.users_assigned}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.reviewOwner}</dt><dd>{pack.review_owner || "—"}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={onToggle} className="text-sm font-medium text-indigo-700 hover:underline">{labels.card.viewDetails}</button>
        {canManage ? (
          <button type="button" onClick={onOpenReview} className="text-sm font-medium text-indigo-700 hover:underline">{labels.dashboard.reviewCenter}</button>
        ) : null}
      </div>
      {expanded ? (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
          {(pack.timeline?.length ?? 0) > 0 ? (
            <div>
              <p className="font-medium">{labels.dashboard.lifecycleTimeline}</p>
              <ul className="mt-2 space-y-1">
                {pack.timeline!.map((e) => (
                  <li key={e.id}>{labels.timelineEvents[e.event_type as keyof typeof labels.timelineEvents] ?? e.description}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {(pack.upcoming_milestones?.length ?? 0) > 0 ? (
            <div>
              <p className="font-medium">{labels.card.upcomingMilestones}</p>
              <ul className="mt-2 space-y-1">{pack.upcoming_milestones!.map((m) => <li key={m.key}>{m.key}</li>)}</ul>
            </div>
          ) : null}
        </div>
      ) : null}
      {reviewOpen ? (
        <div className="mt-4 space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-sm">
          <p className="font-medium">{labels.review.title}</p>
          <ul className="list-disc pl-5 text-slate-600 space-y-1">
            <li>{labels.review.activelyUsed}</li>
            <li>{labels.review.objectivesAchieved}</li>
            <li>{labels.review.additionalUsers}</li>
            <li>{labels.review.trainingRecommended}</li>
            <li>{labels.review.retirementAppropriate}</li>
            <li>{labels.review.upgradesRecommended}</li>
          </ul>
          <input value={reviewOwnerInput} onChange={(e) => onReviewOwnerChange(e.target.value)} placeholder={labels.review.owner} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          <textarea value={reviewNotes} onChange={(e) => onReviewNotesChange(e.target.value)} placeholder={labels.review.notes} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2" />
          <button type="button" disabled={busy} onClick={onSubmitReview} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{labels.review.submitReview}</button>
        </div>
      ) : null}
    </article>
  );
}
