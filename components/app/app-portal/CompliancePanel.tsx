"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseComplianceList,
  type PolicyCategory,
  type PolicyListResponse,
  type PolicyStatus,
  type ComplianceLabels,
} from "@/lib/app-portal/compliance";

type Props = { labels: ComplianceLabels };

const CATEGORIES: PolicyCategory[] = [
  "information_security", "privacy_data_protection", "employee_policies", "acceptable_use",
  "incident_response", "vendor_management", "financial_controls", "business_continuity",
  "operational_procedures", "custom",
];
const STATUSES: PolicyStatus[] = ["draft", "active", "under_review", "retired"];

const STATUS_STYLE: Record<PolicyStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  active: "bg-emerald-100 text-emerald-900",
  under_review: "bg-amber-100 text-amber-950",
  retired: "bg-slate-100 text-slate-500",
};

export function CompliancePanel({ labels }: Props) {
  const [data, setData] = useState<PolicyListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [audience, setAudience] = useState("");
  const [recentlyUpdated, setRecentlyUpdated] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<PolicyCategory>("custom");
  const [formNotes, setFormNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (audience) params.set("audience", audience);
    if (recentlyUpdated) params.set("recently_updated", recentlyUpdated);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/compliance?${params}`);
    if (res.ok) setData(parseComplianceList(await res.json()));
    setLoading(false);
  }, [category, status, audience, recentlyUpdated, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createItem() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/compliance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: formTitle, description: formDescription, category: formCategory, notes: formNotes }),
    });
    if (res.ok) {
      const body = (await res.json()) as { policy?: { id?: string } };
      if (body.policy?.id) {
        window.location.href = `/app/operations/compliance/${body.policy.id}`;
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
          <Stat label={labels.dashboard.outstandingAck} value={dash.outstanding_acknowledgements} />
          <Stat label={labels.dashboard.withoutOwner} value={dash.without_owner} />
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
            <p className="text-xs text-slate-500">{labels.dashboard.readiness}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{dash.readiness.score}%</p>
            <p className="text-sm text-slate-600">{labels.dashboard.readinessLabels[dash.readiness.label]}</p>
          </div>
        </section>
      ) : null}

      {dash && dash.recently_updated.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recent}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.recently_updated.map((p) => (
              <li key={p.id}>
                <Link href={`/app/operations/compliance/${p.id}`} className="text-indigo-700 hover:underline">{p.title}</Link>
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
        <select value={audience} onChange={(e) => setAudience(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.audience}</option>
          {Object.entries(labels.audiences).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
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
          <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as PolicyCategory)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
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
                  <Link href={`/app/operations/compliance/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{item.title}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.categories[item.category]} · {labels.audiences[item.audience]}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[item.status]}`}>{labels.statuses[item.status]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.owner}: {item.owner_name}</span>
                <span>{labels.card.version}: v{item.version_number}</span>
                {item.review_date ? <span>{labels.card.reviewDate}: {item.review_date}</span> : null}
                {item.acknowledgement ? <span>{labels.card.acknowledgement}: {item.acknowledgement.completion_rate}%</span> : null}
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
          <div><dt className="font-medium">{labels.faq.legalAdvice}</dt><dd className="mt-1 text-slate-600">{labels.faq.legalAdviceAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.acknowledgements}</dt><dd className="mt-1 text-slate-600">{labels.faq.acknowledgementsAnswer}</dd></div>
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
