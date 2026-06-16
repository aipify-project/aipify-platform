"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseLearningList,
  type LearningImpactLevel,
  type LearningCategory,
  type LearningImprovementLabels,
  type LearningListResponse,
  type LearningStatus,
} from "@/lib/app-portal/learning-improvement";

type Props = { labels: LearningImprovementLabels };

const CATEGORIES: LearningCategory[] = [
  "operational_improvement", "customer_experience", "security_improvement", "incident_learning",
  "leadership_learning", "process_improvement", "team_collaboration", "technology_learning",
  "vendor_learning", "custom_learning",
];
const STATUSES: LearningStatus[] = ["identified", "under_review", "approved", "in_progress", "implemented", "archived"];
const IMPACT: LearningImpactLevel[] = ["minor_improvement", "moderate_improvement", "significant_improvement", "transformational_improvement"];

const STATUS_STYLE: Record<LearningStatus, string> = {
  identified: "bg-slate-100 text-slate-700",
  under_review: "bg-amber-100 text-amber-950",
  approved: "bg-blue-100 text-blue-900",
  in_progress: "bg-indigo-100 text-indigo-900",
  implemented: "bg-emerald-100 text-emerald-900",
  archived: "bg-slate-100 text-slate-500",
};

const PATTERN_KEYS = [
  "repeated_bottlenecks",
  "common_support_issues",
  "delayed_activities",
  "approval_challenges",
  "onboarding_obstacles",
] as const;

export function LearningImprovementPanel({ labels }: Props) {
  const [data, setData] = useState<LearningListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [impact, setImpact] = useState("");
  const [identifiedFrom, setIdentifiedFrom] = useState("");
  const [identifiedTo, setIdentifiedTo] = useState("");
  const [recentlyImplemented, setRecentlyImplemented] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<LearningCategory>("operational_improvement");
  const [formImpact, setFormImpact] = useState<LearningImpactLevel>("moderate_improvement");
  const [formNotes, setFormNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (impact) params.set("impact_level", impact);
    if (identifiedFrom) params.set("identified_from", identifiedFrom);
    if (identifiedTo) params.set("identified_to", identifiedTo);
    if (recentlyImplemented) params.set("recently_implemented", recentlyImplemented);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/learning?${params}`);
    if (res.ok) setData(parseLearningList(await res.json()));
    setLoading(false);
  }, [category, status, impact, identifiedFrom, identifiedTo, recentlyImplemented, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createItem() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/learning", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle,
        description: formDescription,
        category: formCategory,
        impact_level: formImpact,
        notes: formNotes,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { record?: { id?: string } };
      if (body.record?.id) {
        window.location.href = `/app/operations/learning/${body.record.id}`;
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
  const empty = (data?.items.length ?? 0) === 0 && !category && !status && !search;

  const patternLabel = (key: string) => {
    const map: Record<string, string> = {
      repeated_bottlenecks: labels.patterns.repeatedBottlenecks,
      common_support_issues: labels.patterns.commonSupportIssues,
      delayed_activities: labels.patterns.delayedActivities,
      approval_challenges: labels.patterns.approvalChallenges,
      onboarding_obstacles: labels.patterns.onboardingObstacles,
    };
    return map[key] ?? key;
  };

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
          <Stat label={labels.dashboard.implemented} value={dash.implemented} />
          <Stat label={labels.dashboard.awaitingReview} value={dash.awaiting_review} />
          <Stat label={labels.dashboard.highImpact} value={dash.high_impact} />
        </section>
      ) : null}

      {dash && dash.recently_identified.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recentlyIdentified}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.recently_identified.map((r) => (
              <li key={r.id}>
                <Link href={`/app/operations/learning/${r.id}`} className="text-indigo-700 hover:underline">{r.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dash && dash.recurring_themes.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recurringThemes}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.recurring_themes.map((t) => (
              <li key={t.theme_key} className="rounded-full bg-slate-100 px-3 py-1">
                {labels.categories[t.theme_key as LearningCategory] ?? t.label} ({t.count})
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(data?.pattern_insights?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.patterns.title}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {PATTERN_KEYS.map((key) => {
              const insight = data!.pattern_insights!.find((p) => p.key === key);
              return (
                <li key={key} className={insight?.active ? "text-indigo-800" : "text-slate-400"}>
                  {patternLabel(key)}{insight?.active ? "" : ` — ${labels.patterns.inactive}`}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dash && dash.recently_archived.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recentlyArchived}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
            {dash.recently_archived.map((r) => (
              <li key={r.id}>{r.title}</li>
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
        <select value={impact} onChange={(e) => setImpact(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.impact}</option>
          {IMPACT.map((i) => <option key={i} value={i}>{labels.impact[i]}</option>)}
        </select>
        <input type="date" value={identifiedFrom} onChange={(e) => setIdentifiedFrom(e.target.value)} aria-label={labels.filters.identifiedFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={identifiedTo} onChange={(e) => setIdentifiedTo(e.target.value)} aria-label={labels.filters.identifiedTo} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={recentlyImplemented} onChange={(e) => setRecentlyImplemented(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.recentlyImplemented}</option>
          <option value="true">{labels.filters.yes}</option>
          <option value="false">{labels.filters.no}</option>
        </select>
        {data?.can_contribute ? (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.emptyCta}</button>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.form.createTitle}</h2>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.form.title} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder={labels.form.description} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as LearningCategory)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
          </select>
          <select value={formImpact} onChange={(e) => setFormImpact(e.target.value as LearningImpactLevel)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {IMPACT.map((i) => <option key={i} value={i}>{labels.impact[i]}</option>)}
          </select>
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
          {data?.can_contribute ? (
            <button type="button" onClick={() => setShowForm(true)} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</button>
          ) : null}
        </section>
      ) : (
        <ul className="space-y-3">
          {data?.items.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/app/operations/learning/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{item.title}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.categories[item.category]}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[item.status]}`}>{labels.statuses[item.status]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.submittedBy}: {item.submitted_by_name}</span>
                <span>{labels.card.owner}: {item.owner_name}</span>
                <span>{labels.card.impact}: {labels.impact[item.impact_level]}</span>
                {item.date_identified ? <span>{labels.card.dateIdentified}: {item.date_identified}</span> : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {(data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <p className="text-sm font-medium text-slate-900">{labels.detail.recommendations}</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
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
          <div><dt className="font-medium">{labels.faq.document}</dt><dd className="mt-1 text-slate-600">{labels.faq.documentAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoImplement}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoImplementAnswer}</dd></div>
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
