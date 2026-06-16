"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseFollowUpList,
  type FollowUpCategory,
  type FollowUpItem,
  type FollowUpListResponse,
  type FollowUpPriority,
  type FollowUpStatus,
  type FollowUpsLabels,
  type FollowUpSuggestion,
} from "@/lib/app-portal/follow-ups";

type Props = { labels: FollowUpsLabels };

const CATEGORIES: FollowUpCategory[] = [
  "customer_follow_up", "internal_follow_up", "pending_decision",
  "waiting_external", "strategic_reminder", "overdue_commitment",
];
const STATUSES: FollowUpStatus[] = ["open", "in_progress", "waiting", "completed", "cancelled", "escalated"];
const PRIORITIES: FollowUpPriority[] = ["low", "medium", "high", "critical"];

const PRIO_STYLE: Record<FollowUpPriority, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-sky-100 text-sky-800",
  high: "bg-amber-100 text-amber-900",
  critical: "bg-rose-100 text-rose-900",
};

export function FollowUpsCenterPanel({ labels }: Props) {
  const [data, setData] = useState<FollowUpListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<FollowUpCategory>("internal_follow_up");
  const [formPriority, setFormPriority] = useState<FollowUpPriority>("medium");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (overdueOnly) params.set("overdue_only", "true");
    const res = await fetch(`/api/aipify/follow-ups?${params}`);
    if (res.ok) setData(parseFollowUpList(await res.json()));
    setLoading(false);
  }, [category, status, priority, overdueOnly]);

  useEffect(() => {
    void load();
  }, [load]);

  async function createFollowUp(from?: FollowUpSuggestion) {
    const title = from?.title ?? formTitle;
    if (!title.trim()) return;
    await fetch("/api/aipify/follow-ups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category: from?.category ?? formCategory,
        priority: from?.priority ?? formPriority,
        related_module: from?.related_module,
        suggested_next_action: from?.suggested_next_action,
        is_suggestion: Boolean(from),
      }),
    });
    setShowForm(false);
    setFormTitle("");
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

  const activeItems = (data?.items ?? []).filter((i) => i.status !== "completed" && i.status !== "cancelled");

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        {data?.principle ? (
          <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{data.principle}</p>
        ) : null}
      </div>

      {(data?.smart_reminders?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
          <h2 className="font-semibold text-amber-950">{labels.sections.reminders}</h2>
          <ul className="mt-3 space-y-2 text-sm">{data!.smart_reminders.map((r) => <li key={r.message} className="text-amber-900">{r.message}</li>)}</ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.sections.categories}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const count = data?.categories.find((x) => x.key === c)?.count ?? 0;
            return (
              <button key={c} type="button" onClick={() => setCategory(category === c ? "" : c)} className={`rounded-full px-3 py-1 text-xs font-medium ${category === c ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                {labels.categories[c]} ({count})
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-900">{labels.filters.title}</h2>
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">{labels.createFollowUp}</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1">
            <option value="">{labels.filters.all} — {labels.filters.status}</option>
            {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1">
            <option value="">{labels.filters.all} — {labels.filters.priority}</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
          </select>
          <label className="flex items-center gap-2"><input type="checkbox" checked={overdueOnly} onChange={(e) => setOverdueOnly(e.target.checked)} />{labels.filters.overdueOnly}</label>
        </div>
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5 space-y-3">
          <h3 className="font-semibold">{labels.form.title}</h3>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.form.titlePlaceholder} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="flex flex-wrap gap-3">
            <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as FollowUpCategory)} className="rounded-lg border border-slate-200 px-2 py-1 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
            </select>
            <select value={formPriority} onChange={(e) => setFormPriority(e.target.value as FollowUpPriority)} className="rounded-lg border border-slate-200 px-2 py-1 text-sm">
              {PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => void createFollowUp()} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white">{labels.form.submit}</button>
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
                <div><p className="font-medium">{s.title}</p><p className="mt-1 text-slate-600">{s.suggested_next_action}</p></div>
                <button type="button" onClick={() => void createFollowUp(s)} className="rounded-lg border border-violet-300 px-3 py-1 text-xs font-medium text-violet-800 hover:bg-violet-100">{labels.suggestions.accept}</button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {activeItems.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <button type="button" onClick={() => setShowForm(true)} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.createFollowUp}</button>
        </section>
      ) : (
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-900">{labels.sections.items}</h2>
          {activeItems.map((item) => (
            <FollowUpCard key={item.id} item={item} labels={labels} />
          ))}
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoComplete}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoCompleteAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.assignment}</dt><dd className="mt-1 text-slate-600">{labels.faq.assignmentAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function FollowUpCard({ item, labels }: { item: FollowUpItem; labels: FollowUpsLabels }) {
  return (
    <Link href={`/app/operations/follow-ups/${item.id}`} className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-medium text-slate-900">{item.title}</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIO_STYLE[item.priority]}`}>{labels.priorities[item.priority]}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">{labels.categories[item.category]}</p>
      <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
        <div><dt className="text-slate-500">{labels.card.owner}</dt><dd>{item.assigned_owner}</dd></div>
        <div><dt className="text-slate-500">{labels.card.status}</dt><dd>{labels.statuses[item.status]}</dd></div>
        {item.due_at ? <div><dt className="text-slate-500">{labels.card.due}</dt><dd className={item.is_overdue ? "font-medium text-rose-700" : ""}>{new Date(item.due_at).toLocaleDateString()}{item.is_overdue ? ` · ${labels.card.overdue}` : ""}</dd></div> : null}
        {item.suggested_next_action ? <div className="sm:col-span-2"><dt className="text-slate-500">{labels.card.nextAction}</dt><dd>{item.suggested_next_action}</dd></div> : null}
      </dl>
    </Link>
  );
}
