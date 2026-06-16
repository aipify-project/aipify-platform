"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseRiskList,
  type Likelihood,
  type ImpactLevel,
  type OverallRiskLevel,
  type RiskCategory,
  type RiskListResponse,
  type RiskStatus,
  type RisksLabels,
} from "@/lib/app-portal/risks";

type Props = { labels: RisksLabels };

const CATEGORIES: RiskCategory[] = [
  "operational", "financial", "security", "compliance", "customer",
  "vendor", "strategic", "technology", "reputational", "workforce",
];
const STATUSES: RiskStatus[] = [
  "identified", "under_review", "mitigation_in_progress", "monitoring",
  "accepted", "resolved", "archived",
];
const LEVELS: OverallRiskLevel[] = ["low", "medium", "high", "critical"];
const LIKELIHOODS: Likelihood[] = ["very_low", "low", "moderate", "high", "very_high"];
const IMPACTS: ImpactLevel[] = ["negligible", "minor", "moderate", "major", "critical"];

const LEVEL_STYLE: Record<OverallRiskLevel, string> = {
  low: "bg-emerald-100 text-emerald-900",
  medium: "bg-amber-100 text-amber-950",
  high: "bg-orange-100 text-orange-950",
  critical: "bg-rose-100 text-rose-900",
};

export function RisksPanel({ labels }: Props) {
  const [data, setData] = useState<RiskListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [overallLevel, setOverallLevel] = useState("");
  const [recentlyUpdated, setRecentlyUpdated] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<RiskCategory>("operational");
  const [formLikelihood, setFormLikelihood] = useState<Likelihood>("moderate");
  const [formImpact, setFormImpact] = useState<ImpactLevel>("moderate");
  const [formMitigation, setFormMitigation] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (overallLevel) params.set("overall_level", overallLevel);
    if (recentlyUpdated) params.set("recently_updated", recentlyUpdated);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/risks?${params}`);
    if (res.ok) setData(parseRiskList(await res.json()));
    setLoading(false);
  }, [category, status, overallLevel, recentlyUpdated, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createItem() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/risks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle,
        description: formDescription,
        category: formCategory,
        likelihood: formLikelihood,
        impact: formImpact,
        mitigation_strategy: formMitigation,
        notes: formNotes,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { risk?: { id?: string } };
      if (body.risk?.id) {
        window.location.href = `/app/operations/risks/${body.risk.id}`;
        return;
      }
      setShowForm(false);
      void load();
    }
  }

  if (loading && !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  const dash = data?.dashboard;
  const empty = (data?.items.length ?? 0) === 0 && !category && !status && !search && !overallLevel;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      </div>

      {dash ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label={labels.dashboard.active} value={dash.active} />
          <Stat label={labels.dashboard.highRisk} value={dash.high_risk} />
          <Stat label={labels.dashboard.needsReview} value={dash.needs_review} />
          <Stat label={labels.dashboard.withoutOwner} value={dash.without_owner} />
          <Stat label={labels.dashboard.approachingReview} value={dash.approaching_review} />
        </section>
      ) : null}

      {dash && dash.recently_resolved.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recentlyResolved}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.recently_resolved.map((r) => (
              <li key={r.id}>
                <Link href={`/app/operations/risks/${r.id}`} className="text-indigo-700 hover:underline">{r.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.status}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <select value={overallLevel} onChange={(e) => setOverallLevel(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.overallLevel}</option>
          {LEVELS.map((l) => <option key={l} value={l}>{labels.overallLevels[l]}</option>)}
        </select>
        <select value={recentlyUpdated} onChange={(e) => setRecentlyUpdated(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.recentlyUpdated}</option>
          <option value="true">{labels.filters.yes}</option>
          <option value="false">{labels.filters.no}</option>
        </select>
        {data?.can_manage ? (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.emptyCta}</button>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.form.createTitle}</h2>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.form.title} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder={labels.form.description} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as RiskCategory)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <select value={formLikelihood} onChange={(e) => setFormLikelihood(e.target.value as Likelihood)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {LIKELIHOODS.map((l) => <option key={l} value={l}>{labels.likelihoods[l]}</option>)}
            </select>
            <select value={formImpact} onChange={(e) => setFormImpact(e.target.value as ImpactLevel)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {IMPACTS.map((i) => <option key={i} value={i}>{labels.impacts[i]}</option>)}
            </select>
          </div>
          <textarea value={formMitigation} onChange={(e) => setFormMitigation(e.target.value)} placeholder={labels.form.mitigationStrategy} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder={labels.form.notes} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button type="button" onClick={() => void createItem()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.form.submit}</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">{labels.form.cancel}</button>
          </div>
        </section>
      ) : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          {data?.can_manage ? (
            <button type="button" onClick={() => setShowForm(true)} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</button>
          ) : null}
        </section>
      ) : (
        <ul className="space-y-3">
          {data?.items.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/app/operations/risks/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{item.title}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.categories[item.category]} · {labels.statuses[item.status]}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_STYLE[item.overall_level]}`}>{labels.overallLevels[item.overall_level]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.owner}: {item.owner_name}</span>
                <span>{labels.card.likelihood}: {labels.likelihoods[item.likelihood]}</span>
                <span>{labels.card.impact}: {labels.impacts[item.impact]}</span>
                {item.next_review_date ? <span>{labels.card.nextReview}: {item.next_review_date}</span> : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {(data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <ul className="space-y-2 text-sm text-slate-700">
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
          <div><dt className="font-medium">{labels.faq.howCalculated}</dt><dd className="mt-1 text-slate-600">{labels.faq.howCalculatedAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.eliminate}</dt><dd className="mt-1 text-slate-600">{labels.faq.eliminateAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
