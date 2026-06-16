"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseDecisionList,
  type DecisionCategory,
  type DecisionCenterLabels,
  type DecisionImpactLevel,
  type DecisionItem,
  type DecisionListResponse,
  type DecisionStatus,
  type DecisionSuggestion,
} from "@/lib/app-portal/decision-center";

type Props = { labels: DecisionCenterLabels };

const CATEGORIES: DecisionCategory[] = [
  "strategic", "financial", "operational", "customer_experience", "human_resources",
  "security", "technology", "compliance", "marketing", "growth",
];
const STATUSES: DecisionStatus[] = [
  "proposed", "under_review", "approved", "rejected", "implemented", "evaluated",
];
const IMPACTS: DecisionImpactLevel[] = ["low", "moderate", "high", "critical"];

const IMPACT_STYLE: Record<DecisionImpactLevel, string> = {
  low: "bg-slate-100 text-slate-700",
  moderate: "bg-sky-100 text-sky-800",
  high: "bg-amber-100 text-amber-900",
  critical: "bg-rose-100 text-rose-900",
};

export function DecisionCenterPanel({ labels }: Props) {
  const [data, setData] = useState<DecisionListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [impact, setImpact] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [outcomeRating, setOutcomeRating] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<DecisionCategory>("operational");
  const [formImpact, setFormImpact] = useState<DecisionImpactLevel>("moderate");
  const [formExpected, setFormExpected] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (impact) params.set("impact_level", impact);
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    if (outcomeRating) params.set("outcome_rating", outcomeRating);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/decision-center?${params}`);
    if (res.ok) setData(parseDecisionList(await res.json()));
    setLoading(false);
  }, [category, status, impact, dateFrom, dateTo, outcomeRating, search]);

  useEffect(() => {
    void load();
  }, [load]);

  async function createDecision(from?: DecisionSuggestion) {
    const title = from?.title ?? formTitle;
    if (!title.trim()) return;
    await fetch("/api/aipify/decision-center", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: formDescription,
        category: from?.category ?? formCategory,
        impact_level: from?.impact_level ?? formImpact,
        expected_outcome: formExpected,
        status: "proposed",
      }),
    });
    setShowForm(false);
    setFormTitle("");
    setFormDescription("");
    setFormExpected("");
    void load();
  }

  if (loading && !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  const canManage = data?.can_manage === true;
  const items = data?.items ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        {data?.principle ? (
          <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{data.principle}</p>
        ) : null}
        {!canManage ? (
          <p className="mt-3 text-sm text-slate-500">{labels.readOnly}</p>
        ) : null}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-900">{labels.filters.title}</h2>
          {canManage ? (
            <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">{labels.recordDecision}</button>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.filters.searchPlaceholder}
            className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1">
            <option value="">{labels.filters.all} — {labels.filters.category}</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1">
            <option value="">{labels.filters.all} — {labels.filters.status}</option>
            {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
          </select>
          <select value={impact} onChange={(e) => setImpact(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1">
            <option value="">{labels.filters.all} — {labels.filters.impact}</option>
            {IMPACTS.map((i) => <option key={i} value={i}>{labels.impactLevels[i]}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1" aria-label={labels.filters.dateFrom} />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1" aria-label={labels.filters.dateTo} />
          <select value={outcomeRating} onChange={(e) => setOutcomeRating(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1">
            <option value="">{labels.filters.all} — {labels.filters.outcomeRating}</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={String(n)}>{n}</option>)}
          </select>
        </div>
      </section>

      {showForm && canManage ? (
        <section className="space-y-3 rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5">
          <h3 className="font-semibold">{labels.form.title}</h3>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.form.titlePlaceholder} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder={labels.form.description} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="flex flex-wrap gap-3">
            <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as DecisionCategory)} className="rounded-lg border border-slate-200 px-2 py-1 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
            </select>
            <select value={formImpact} onChange={(e) => setFormImpact(e.target.value as DecisionImpactLevel)} className="rounded-lg border border-slate-200 px-2 py-1 text-sm">
              {IMPACTS.map((i) => <option key={i} value={i}>{labels.impactLevels[i]}</option>)}
            </select>
          </div>
          <textarea value={formExpected} onChange={(e) => setFormExpected(e.target.value)} placeholder={labels.form.expectedOutcome} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button type="button" onClick={() => void createDecision()} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white">{labels.form.submit}</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-600">{labels.form.cancel}</button>
          </div>
        </section>
      ) : null}

      {(data?.suggestions?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/30 p-5">
          <h2 className="font-semibold text-violet-950">{labels.sections.suggestions}</h2>
          <p className="mt-1 text-xs text-violet-800">{labels.suggestions.requiresReview}</p>
          <ul className="mt-4 space-y-3">
            {data!.suggestions.map((s) => (
              <li key={s.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl bg-white/80 p-4 text-sm">
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="mt-1 text-slate-600">{labels.categories[s.category]} · {labels.impactLevels[s.impact_level]}</p>
                </div>
                {canManage ? (
                  <button type="button" onClick={() => void createDecision(s)} className="rounded-lg border border-violet-300 px-3 py-1 text-xs font-medium text-violet-800 hover:bg-violet-100">{labels.suggestions.accept}</button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {items.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          {canManage ? (
            <button type="button" onClick={() => setShowForm(true)} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.recordDecision}</button>
          ) : null}
        </section>
      ) : (
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-900">{labels.sections.items}</h2>
          {items.map((item) => (
            <DecisionCard key={item.id} item={item} labels={labels} />
          ))}
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyDocument}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyDocumentAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoDecide}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoDecideAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function DecisionCard({ item, labels }: { item: DecisionItem; labels: DecisionCenterLabels }) {
  return (
    <Link href={`/app/operations/decision-center/${item.id}`} className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{labels.categories[item.category]}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${IMPACT_STYLE[item.impact_level]}`}>{labels.impactLevels[item.impact_level]}</span>
      </div>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div><dt className="text-slate-500">{labels.card.owner}</dt><dd className="font-medium">{item.decision_owner}</dd></div>
        <div><dt className="text-slate-500">{labels.card.date}</dt><dd>{item.decision_date ? new Date(item.decision_date).toLocaleDateString() : "—"}</dd></div>
        <div><dt className="text-slate-500">{labels.card.status}</dt><dd>{labels.statuses[item.status]}</dd></div>
        {item.expected_outcome ? (
          <div className="sm:col-span-2"><dt className="text-slate-500">{labels.card.expectedOutcome}</dt><dd className="line-clamp-2">{item.expected_outcome}</dd></div>
        ) : null}
      </dl>
    </Link>
  );
}
