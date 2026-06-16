"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSupportRequestList,
  type SupportRequestCategory,
  type SupportRequestItem,
  type SupportRequestListResponse,
  type SupportRequestPriority,
  type SupportRequestStatus,
  type SupportRequestsLabels,
} from "@/lib/app-portal/support-requests";

type Props = { labels: SupportRequestsLabels };

const CATEGORIES: SupportRequestCategory[] = [
  "technical", "billing", "integrations", "business_packs", "account", "security", "general",
];
const PRIORITIES: SupportRequestPriority[] = ["low", "medium", "high", "urgent"];
const STATUSES: SupportRequestStatus[] = [
  "open", "in_review", "waiting_for_customer", "waiting_for_aipify", "resolved", "closed",
];

const PRIO_STYLE: Record<SupportRequestPriority, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-sky-100 text-sky-800",
  high: "bg-amber-100 text-amber-900",
  urgent: "bg-rose-100 text-rose-900",
};

export function SupportRequestsCenterPanel({ labels }: Props) {
  const [data, setData] = useState<SupportRequestListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<SupportRequestCategory>("general");
  const [formPriority, setFormPriority] = useState<SupportRequestPriority>("medium");
  const [formModule, setFormModule] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/support-requests?${params}`);
    if (res.ok) setData(parseSupportRequestList(await res.json()));
    setLoading(false);
  }, [category, status, priority, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on filter change
    void load();
  }, [load]);

  async function createRequest() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/support-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle,
        description: formDescription,
        category: formCategory,
        priority: formPriority,
        related_module: formModule || undefined,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { request?: { id?: string } };
      setShowForm(false);
      setFormTitle("");
      setFormDescription("");
      setFormModule("");
      if (body.request?.id) {
        window.location.href = `/app/support/requests/${body.request.id}`;
        return;
      }
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
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-900">{labels.filters.title}</h2>
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">{labels.createRequest}</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.searchPlaceholder} className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-1.5" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1">
            <option value="">{labels.filters.all} — {labels.filters.category}</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1">
            <option value="">{labels.filters.all} — {labels.filters.status}</option>
            {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1">
            <option value="">{labels.filters.all} — {labels.filters.priority}</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
          </select>
        </div>
      </section>

      {showForm ? (
        <section className="space-y-3 rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5">
          <h3 className="font-semibold">{labels.form.title}</h3>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.form.titlePlaceholder} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder={labels.form.description} rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="flex flex-wrap gap-3">
            <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as SupportRequestCategory)} className="rounded-lg border border-slate-200 px-2 py-1 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
            </select>
            <select value={formPriority} onChange={(e) => setFormPriority(e.target.value as SupportRequestPriority)} className="rounded-lg border border-slate-200 px-2 py-1 text-sm">
              {PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
            </select>
            <input value={formModule} onChange={(e) => setFormModule(e.target.value)} placeholder={labels.form.module} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => void createRequest()} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white">{labels.form.submit}</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-600">{labels.form.cancel}</button>
          </div>
        </section>
      ) : null}

      {items.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <button type="button" onClick={() => setShowForm(true)} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.createRequest}</button>
        </section>
      ) : (
        <section className="space-y-3">
          {items.map((item) => (
            <RequestCard key={item.id} item={item} labels={labels} />
          ))}
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.howContact}</dt><dd className="mt-1 text-slate-600">{labels.faq.howContactAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.canTrack}</dt><dd className="mt-1 text-slate-600">{labels.faq.canTrackAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whoCanSee}</dt><dd className="mt-1 text-slate-600">{labels.faq.whoCanSeeAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function RequestCard({ item, labels }: { item: SupportRequestItem; labels: SupportRequestsLabels }) {
  return (
    <Link href={`/app/support/requests/${item.id}`} className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.description}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIO_STYLE[item.priority]}`}>{labels.priorities[item.priority]}</span>
      </div>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div><dt className="text-slate-500">{labels.card.status}</dt><dd className="font-medium">{labels.statuses[item.status]}</dd></div>
        <div><dt className="text-slate-500">{labels.card.category}</dt><dd>{labels.categories[item.category]}</dd></div>
        <div><dt className="text-slate-500">{labels.card.createdBy}</dt><dd>{item.created_by}</dd></div>
        <div><dt className="text-slate-500">{labels.card.updated}</dt><dd>{new Date(item.updated_at).toLocaleDateString()}</dd></div>
      </dl>
    </Link>
  );
}
