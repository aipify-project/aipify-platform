"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCommitmentList,
  type CommitmentListResponse,
  type CommitmentPriority,
  type CommitmentStatus,
  type CommitmentTrackingLabels,
  type CommitmentType,
} from "@/lib/app-portal/commitment-tracking";

type Props = { labels: CommitmentTrackingLabels };

const TYPES: CommitmentType[] = [
  "customer_commitment", "employee_commitment", "executive_commitment", "team_commitment",
  "vendor_commitment", "regulatory_commitment", "strategic_commitment", "operational_commitment",
  "partnership_commitment", "custom_commitment",
];
const STATUSES: CommitmentStatus[] = ["proposed", "accepted", "in_progress", "at_risk", "fulfilled", "cancelled", "archived"];
const PRIORITIES: CommitmentPriority[] = ["low", "medium", "high", "critical"];

const STATUS_STYLE: Record<CommitmentStatus, string> = {
  proposed: "bg-slate-100 text-slate-700",
  accepted: "bg-indigo-100 text-indigo-900",
  in_progress: "bg-blue-100 text-blue-900",
  at_risk: "bg-amber-100 text-amber-950",
  fulfilled: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-slate-200 text-slate-500",
  archived: "bg-slate-100 text-slate-500",
};

export function CommitmentTrackingPanel({ labels }: Props) {
  const [data, setData] = useState<CommitmentListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [commitmentType, setCommitmentType] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [recipient, setRecipient] = useState("");
  const [dueFrom, setDueFrom] = useState("");
  const [dueTo, setDueTo] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<CommitmentType>("operational_commitment");
  const [formRecipient, setFormRecipient] = useState("");
  const [formPriority, setFormPriority] = useState<CommitmentPriority>("medium");
  const [formDueDate, setFormDueDate] = useState("");
  const [formCriteria, setFormCriteria] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (commitmentType) params.set("commitment_type", commitmentType);
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (recipient.trim()) params.set("recipient", recipient.trim());
    if (dueFrom) params.set("due_from", dueFrom);
    if (dueTo) params.set("due_to", dueTo);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/commitments?${params}`);
    if (res.ok) setData(parseCommitmentList(await res.json()));
    setLoading(false);
  }, [commitmentType, status, priority, recipient, dueFrom, dueTo, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createItem() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/commitments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle,
        description: formDescription,
        commitment_type: formType,
        recipient: formRecipient,
        priority: formPriority,
        due_date: formDueDate || undefined,
        fulfillment_criteria: formCriteria,
        notes: formNotes,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { commitment?: { id?: string } };
      if (body.commitment?.id) {
        window.location.href = `/app/operations/commitments/${body.commitment.id}`;
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
  const empty = (data?.items.length ?? 0) === 0 && !commitmentType && !status && !search;

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
          <Stat label={labels.dashboard.overdue} value={dash.overdue} />
          <Stat label={labels.dashboard.atRisk} value={dash.at_risk.length} />
        </section>
      ) : null}

      {dash && dash.at_risk.length > 0 ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.atRisk}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.at_risk.map((i) => (
              <li key={i.id}>
                <Link href={`/app/operations/commitments/${i.id}`} className="text-indigo-700 hover:underline">{i.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dash && dash.recently_fulfilled.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recentlyFulfilled}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.recently_fulfilled.map((i) => (
              <li key={i.id}>
                <Link href={`/app/operations/commitments/${i.id}`} className="text-indigo-700 hover:underline">{i.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dash && dash.high_priority.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.highPriority}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.high_priority.map((i) => (
              <li key={i.id}>
                <Link href={`/app/operations/commitments/${i.id}`} className="text-indigo-700 hover:underline">{i.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={commitmentType} onChange={(e) => setCommitmentType(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.type}</option>
          {TYPES.map((t) => <option key={t} value={t}>{labels.types[t]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.status}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
        </select>
        <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder={labels.filters.recipient} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={dueFrom} onChange={(e) => setDueFrom(e.target.value)} aria-label={labels.filters.dueFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={dueTo} onChange={(e) => setDueTo(e.target.value)} aria-label={labels.filters.dueTo} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        {data?.can_manage ? (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.emptyCta}</button>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.form.createTitle}</h2>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.form.title} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder={labels.form.description} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={formType} onChange={(e) => setFormType(e.target.value as CommitmentType)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {TYPES.map((t) => <option key={t} value={t}>{labels.types[t]}</option>)}
          </select>
          <input value={formRecipient} onChange={(e) => setFormRecipient(e.target.value)} placeholder={labels.form.recipient} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={formPriority} onChange={(e) => setFormPriority(e.target.value as CommitmentPriority)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
          </select>
          <input type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} aria-label={labels.form.dueDate} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formCriteria} onChange={(e) => setFormCriteria(e.target.value)} placeholder={labels.form.fulfillmentCriteria} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
                  <Link href={`/app/operations/commitments/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{item.title}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.types[item.commitment_type]}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[item.status]}`}>{labels.statuses[item.status]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.owner}: {item.owner_name}</span>
                {item.recipient ? <span>{labels.card.recipient}: {item.recipient}</span> : null}
                <span>{labels.card.priority}: {labels.priorities[item.priority]}</span>
                <span>{labels.card.progress}: {item.progress_percent}%</span>
                {item.due_date ? <span>{labels.card.dueDate}: {item.due_date}</span> : null}
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
          <div><dt className="font-medium">{labels.faq.whyTrack}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyTrackAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoFulfill}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoFulfillAnswer}</dd></div>
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
