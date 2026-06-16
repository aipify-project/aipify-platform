"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseResponsibilityList,
  type ResponsibilityArea,
  type ResponsibilityListResponse,
  type ResponsibilityStatus,
  type ResponsibilitiesLabels,
} from "@/lib/app-portal/responsibilities";

type Props = { labels: ResponsibilitiesLabels };

const AREAS: ResponsibilityArea[] = [
  "goals", "follow_ups", "decisions", "approvals", "support_requests",
  "integrations", "business_packs", "billing", "security", "operations",
];
const STATUSES: ResponsibilityStatus[] = ["active", "needs_review", "unassigned", "inactive"];

const STATUS_STYLE: Record<ResponsibilityStatus, string> = {
  active: "bg-emerald-100 text-emerald-900",
  needs_review: "bg-amber-100 text-amber-950",
  unassigned: "bg-rose-100 text-rose-900",
  inactive: "bg-slate-100 text-slate-600",
};

export function ResponsibilitiesPanel({ labels }: Props) {
  const [data, setData] = useState<ResponsibilityListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("");
  const [hasBackup, setHasBackup] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formArea, setFormArea] = useState<ResponsibilityArea>("operations");
  const [formNotes, setFormNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (area) params.set("area", area);
    if (status) params.set("status", status);
    if (hasBackup) params.set("has_backup", hasBackup);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/responsibilities?${params}`);
    if (res.ok) setData(parseResponsibilityList(await res.json()));
    setLoading(false);
  }, [area, status, hasBackup, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createItem() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/responsibilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: formTitle, description: formDescription, area: formArea, notes: formNotes }),
    });
    if (res.ok) {
      const body = (await res.json()) as { responsibility?: { id?: string } };
      if (body.responsibility?.id) {
        window.location.href = `/app/organization/responsibilities/${body.responsibility.id}`;
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
  const empty = (data?.items.length ?? 0) === 0 && !area && !status && !search;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      </div>

      {dash ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={labels.dashboard.assigned} value={dash.assigned} />
          <Stat label={labels.dashboard.unassigned} value={dash.unassigned} />
          <Stat label={labels.dashboard.needsReview} value={dash.needs_review} />
          <Stat label={labels.dashboard.noBackup} value={dash.critical_no_backup} />
        </section>
      ) : null}

      {dash && dash.overloaded_owners.length > 0 ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-sm">
          <p className="font-medium text-amber-950">{labels.dashboard.overloaded}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {dash.overloaded_owners.map((o) => (
              <li key={o.user_id}>
                <Link href={`/app/organization/responsibilities/owners/${o.user_id}`} className="text-indigo-700 hover:underline">
                  {o.name} ({o.count})
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={area} onChange={(e) => setArea(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.area}</option>
          {AREAS.map((a) => <option key={a} value={a}>{labels.areas[a]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.status}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <select value={hasBackup} onChange={(e) => setHasBackup(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.hasBackup}</option>
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
          <select value={formArea} onChange={(e) => setFormArea(e.target.value as ResponsibilityArea)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {AREAS.map((a) => <option key={a} value={a}>{labels.areas[a]}</option>)}
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
                  <Link href={`/app/organization/responsibilities/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{item.title}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.areas[item.area]}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[item.status]}`}>{labels.statuses[item.status]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.primaryOwner}: {item.primary_owner_id ? (
                  <Link href={`/app/organization/responsibilities/owners/${item.primary_owner_id}`} className="text-indigo-700 hover:underline">{item.primary_owner_name}</Link>
                ) : item.primary_owner_name}</span>
                <span>{labels.card.backupOwner}: {item.backup_owner_name}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {(data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
          <div><dt className="font-medium">{labels.faq.backup}</dt><dd className="mt-1 text-slate-600">{labels.faq.backupAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoAssign}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoAssignAnswer}</dd></div>
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
