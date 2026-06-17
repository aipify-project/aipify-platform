"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  OPPORTUNITY_CATEGORIES,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_TIME_HORIZONS,
  STRATEGIC_PRIORITIES,
  parseStrategicOpportunitiesOverview,
  type OpportunityCard,
  type StrategicOpportunitiesLabels,
  type StrategicOpportunitiesOverview,
} from "@/lib/app-portal/strategic-opportunities";

type Props = { labels: StrategicOpportunitiesLabels };

export function StrategicOpportunitiesPanel({ labels }: Props) {
  const [data, setData] = useState<StrategicOpportunitiesOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [strategicPriority, setStrategicPriority] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [executiveOwner, setExecutiveOwner] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  // create form
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("operational_efficiency");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (status) p.set("status", status);
    if (strategicPriority) p.set("strategic_priority", strategicPriority);
    if (timeHorizon) p.set("time_horizon", timeHorizon);
    if (executiveOwner.trim()) p.set("executive_owner", executiveOwner.trim());
    if (search.trim()) p.set("search", search.trim());

    const dashRes = await fetch(`/api/aipify/strategic-opportunities?${p}`);

    if (dashRes.ok) {
      setData(parseStrategicOpportunitiesOverview(await dashRes.json()));
    } else {
      const b = (await dashRes.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [category, status, strategicPriority, timeHorizon, executiveOwner, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createOpportunity() {
    if (!newTitle.trim()) return;
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/aipify/strategic-opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, description: newDesc, category: newCategory }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage(labels.create.success);
      setNewTitle(""); setNewDesc(""); setShowCreate(false);
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

  const empty = !data?.has_opportunity_data;
  const canCreate = data?.can_create === true;

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
          {canCreate ? (
            <button type="button" onClick={() => setShowCreate(true)}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">
              {labels.emptyCta}
            </button>
          ) : null}
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ScoreCard label={labels.dashboard.healthScore} value={data?.opportunity_health_score ?? 0} />
            <StatCard label={labels.dashboard.highPotential}    items={data?.high_potential_opportunities} />
            <StatCard label={labels.dashboard.requiresExploration} items={data?.opportunities_requiring_exploration} />
            <StatCard label={labels.dashboard.underReview}     items={data?.opportunities_under_review} />
            <StatCard label={labels.dashboard.inProgress}      items={data?.opportunities_in_progress} />
            <StatCard label={labels.dashboard.realized}        items={data?.opportunities_realized} />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveSummary}</p>
            <p className="mt-2 text-sm text-slate-700">{data?.executive_summary}</p>
          </section>

          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
            <h2 className="font-semibold text-slate-900">{labels.dashboard.reviewQuestions}</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
              {labels.reviewQuestions.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </section>
        </>
      )}

      {/* filters */}
      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {OPPORTUNITY_CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.status}</option>
          {OPPORTUNITY_STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <select value={strategicPriority} onChange={(e) => setStrategicPriority(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.strategicPriority}</option>
          {STRATEGIC_PRIORITIES.map((p) => <option key={p} value={p}>{labels.strategicPriorities[p]}</option>)}
        </select>
        <select value={timeHorizon} onChange={(e) => setTimeHorizon(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.timeHorizon}</option>
          {OPPORTUNITY_TIME_HORIZONS.map((h) => <option key={h} value={h}>{labels.timeHorizons[h]}</option>)}
        </select>
        <input value={executiveOwner} onChange={(e) => setExecutiveOwner(e.target.value)}
          placeholder={labels.filters.executiveOwner}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {/* opportunity cards */}
      {!empty && (data?.opportunities?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.opportunities}</h2>
            {canCreate ? (
              <button type="button" onClick={() => setShowCreate(!showCreate)}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">
                {labels.dashboard.addOpportunity}
              </button>
            ) : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.opportunities!.map((opp) => (
              <OpportunityCardView key={opp.id} opp={opp} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {/* create form */}
      {showCreate && canCreate ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.addOpportunity}</h2>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            placeholder={labels.create.titlePlaceholder}
            className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
            placeholder={labels.create.descriptionPlaceholder}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={3} />
          <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
            className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {OPPORTUNITY_CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
          </select>
          <button type="button" disabled={busy || !newTitle.trim()} onClick={() => void createOpportunity()}
            className="mt-3 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {labels.emptyCta}
          </button>
        </section>
      ) : null}


      {/* recommendations */}
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

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatAre}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatAreAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoImplement}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoImplementAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whoShouldUse}</dt><dd className="mt-1 text-slate-600">{labels.faq.whoShouldUseAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-indigo-700">{value}</p>
    </div>
  );
}

function StatCard({ label, items = [] }: { label: string; items?: { id: string; title: string }[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{items.length}</p>
    </div>
  );
}

function OpportunityCardView({ opp, labels }: { opp: OpportunityCard; labels: StrategicOpportunitiesLabels }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">{opp.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{opp.description}</p>
      <dl className="mt-3 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.card.category}: </dt><dd className="inline">{labels.categories[opp.category as keyof typeof labels.categories] ?? opp.category}</dd></div>
        <div><dt className="inline">{labels.card.status}: </dt><dd className="inline">{labels.statuses[opp.status as keyof typeof labels.statuses] ?? opp.status}</dd></div>
        <div><dt className="inline">{labels.card.estimatedImpact}: </dt><dd className="inline">{labels.estimatedImpacts[opp.estimated_impact as keyof typeof labels.estimatedImpacts] ?? opp.estimated_impact}</dd></div>
        <div><dt className="inline">{labels.card.owner}: </dt><dd className="inline">{opp.leadership_owner}</dd></div>
      </dl>
      <Link href={`/app/intelligence/strategic-opportunities/${opp.id}`}
        className="mt-4 inline-block text-sm font-medium text-indigo-700 hover:underline">
        {labels.dashboard.viewOpportunity}
      </Link>
    </article>
  );
}
