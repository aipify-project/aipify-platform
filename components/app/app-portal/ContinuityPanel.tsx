"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseContinuityList,
  type ContinuityCategory,
  type ContinuityCriticality,
  type ContinuityListResponse,
  type ContinuityStatus,
  type ContinuityLabels,
} from "@/lib/app-portal/continuity";
import type { ReviewFrequency } from "@/lib/app-portal/responsibilities/types";

type Props = { labels: ContinuityLabels };

const CATEGORIES: ContinuityCategory[] = [
  "business_continuity", "incident_response", "technology_recovery", "workforce_continuity",
  "vendor_continuity", "communications_continuity", "executive_continuity", "operational_recovery",
  "facility_preparedness", "custom_continuity_area",
];
const STATUSES: ContinuityStatus[] = ["draft", "active", "under_review", "testing", "archived"];
const CRITICALITY: ContinuityCriticality[] = ["low", "moderate", "high", "mission_critical"];
const FREQUENCIES: ReviewFrequency[] = ["monthly", "quarterly", "semi_annual", "annual"];

const STATUS_STYLE: Record<ContinuityStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  active: "bg-emerald-100 text-emerald-900",
  under_review: "bg-amber-100 text-amber-950",
  testing: "bg-blue-100 text-blue-900",
  archived: "bg-slate-100 text-slate-500",
};

const CRIT_STYLE: Record<ContinuityCriticality, string> = {
  low: "bg-slate-100 text-slate-700",
  moderate: "bg-blue-100 text-blue-900",
  high: "bg-amber-100 text-amber-950",
  mission_critical: "bg-rose-100 text-rose-900",
};

export function ContinuityPanel({ labels }: Props) {
  const [data, setData] = useState<ContinuityListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [criticality, setCriticality] = useState("");
  const [reviewBefore, setReviewBefore] = useState("");
  const [exerciseBefore, setExerciseBefore] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<ContinuityCategory>("business_continuity");
  const [formCriticality, setFormCriticality] = useState<ContinuityCriticality>("moderate");
  const [formFrequency, setFormFrequency] = useState<ReviewFrequency>("quarterly");
  const [formRecovery, setFormRecovery] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (criticality) params.set("criticality", criticality);
    if (reviewBefore) params.set("review_before", reviewBefore);
    if (exerciseBefore) params.set("exercise_before", exerciseBefore);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/continuity?${params}`);
    if (res.ok) setData(parseContinuityList(await res.json()));
    setLoading(false);
  }, [category, status, criticality, reviewBefore, exerciseBefore, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createItem() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/continuity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle,
        description: formDescription,
        category: formCategory,
        criticality_level: formCriticality,
        review_frequency: formFrequency,
        recovery_objectives: formRecovery,
        notes: formNotes,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { plan?: { id?: string } };
      if (body.plan?.id) {
        window.location.href = `/app/operations/continuity/${body.plan.id}`;
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
  const empty = (data?.items.length ?? 0) === 0 && !category && !status && !criticality && !search;

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
          <Stat label={labels.dashboard.needsReview} value={dash.needs_review} />
          <Stat label={labels.dashboard.missionCritical} value={dash.mission_critical} />
          <Stat label={labels.dashboard.withoutOwner} value={dash.without_owner} />
          <Stat label={labels.dashboard.upcomingExercises} value={dash.upcoming_exercises} />
        </section>
      ) : null}

      {dash && dash.recently_updated.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recent}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.recently_updated.map((p) => (
              <li key={p.id}>
                <Link href={`/app/operations/continuity/${p.id}`} className="text-indigo-700 hover:underline">{p.title}</Link>
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
        <select value={criticality} onChange={(e) => setCriticality(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.criticality}</option>
          {CRITICALITY.map((c) => <option key={c} value={c}>{labels.criticality[c]}</option>)}
        </select>
        <input type="date" value={reviewBefore} onChange={(e) => setReviewBefore(e.target.value)} aria-label={labels.filters.reviewBefore} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={exerciseBefore} onChange={(e) => setExerciseBefore(e.target.value)} aria-label={labels.filters.exerciseBefore} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        {data?.can_manage ? (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.emptyCta}</button>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.form.createTitle}</h2>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.form.title} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder={labels.form.description} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as ContinuityCategory)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
          </select>
          <select value={formCriticality} onChange={(e) => setFormCriticality(e.target.value as ContinuityCriticality)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {CRITICALITY.map((c) => <option key={c} value={c}>{labels.criticality[c]}</option>)}
          </select>
          <select value={formFrequency} onChange={(e) => setFormFrequency(e.target.value as ReviewFrequency)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {FREQUENCIES.map((f) => <option key={f} value={f}>{labels.frequencies[f]}</option>)}
          </select>
          <textarea value={formRecovery} onChange={(e) => setFormRecovery(e.target.value)} placeholder={labels.form.recoveryObjectives} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
                  <Link href={`/app/operations/continuity/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{item.title}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.categories[item.category]}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[item.status]}`}>{labels.statuses[item.status]}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CRIT_STYLE[item.criticality_level]}`}>{labels.criticality[item.criticality_level]}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.owner}: {item.owner_name}</span>
                {item.backup_owner_name && item.backup_owner_name !== "Unassigned" ? <span>{labels.card.backupOwner}: {item.backup_owner_name}</span> : null}
                {item.next_review_date ? <span>{labels.card.nextReview}: {item.next_review_date}</span> : null}
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
          <div><dt className="font-medium">{labels.faq.exercises}</dt><dd className="mt-1 text-slate-600">{labels.faq.exercisesAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoManage}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoManageAnswer}</dd></div>
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
