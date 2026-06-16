"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePrioritizationList,
  type PrioritizationCategory,
  type PrioritizationEngineLabels,
  type PrioritizationListResponse,
  type PriorityStatus,
} from "@/lib/app-portal/prioritization-engine";

type Props = { labels: PrioritizationEngineLabels };

const CATEGORIES: PrioritizationCategory[] = [
  "strategic_initiative", "operational_improvement", "customer_initiative", "technology_initiative",
  "risk_mitigation", "compliance_requirement", "revenue_opportunity", "workforce_initiative",
  "innovation_opportunity", "custom_category",
];
const STATUSES: PriorityStatus[] = ["under_evaluation", "recommended", "high_priority", "medium_priority", "low_priority", "deferred", "completed"];

const STATUS_STYLE: Record<PriorityStatus, string> = {
  under_evaluation: "bg-slate-100 text-slate-700",
  recommended: "bg-indigo-100 text-indigo-900",
  high_priority: "bg-rose-100 text-rose-900",
  medium_priority: "bg-amber-100 text-amber-950",
  low_priority: "bg-slate-100 text-slate-600",
  deferred: "bg-slate-200 text-slate-500",
  completed: "bg-emerald-100 text-emerald-900",
};

export function PrioritizationEnginePanel({ labels }: Props) {
  const [data, setData] = useState<PrioritizationListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [priorityStatus, setPriorityStatus] = useState("");
  const [alignmentMin, setAlignmentMin] = useState("");
  const [dueFrom, setDueFrom] = useState("");
  const [dueTo, setDueTo] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<PrioritizationCategory>("strategic_initiative");
  const [formDueDate, setFormDueDate] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (priorityStatus) params.set("priority_status", priorityStatus);
    if (alignmentMin) params.set("alignment_min", alignmentMin);
    if (dueFrom) params.set("due_from", dueFrom);
    if (dueTo) params.set("due_to", dueTo);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/prioritization?${params}`);
    if (res.ok) setData(parsePrioritizationList(await res.json()));
    setLoading(false);
  }, [category, priorityStatus, alignmentMin, dueFrom, dueTo, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createItem() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/prioritization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle,
        description: formDescription,
        category: formCategory,
        due_date: formDueDate || undefined,
        notes: formNotes,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { item?: { id?: string } };
      if (body.item?.id) {
        window.location.href = `/app/operations/prioritization/${body.item.id}`;
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
  const matrix = data?.matrix;
  const empty = (data?.items.length ?? 0) === 0 && !category && !priorityStatus && !search;

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
          <Stat label={labels.dashboard.highestPriority} value={dash.highest_priority.length} />
          <Stat label={labels.dashboard.deferred} value={dash.deferred.length} />
          <Stat label={labels.dashboard.capacityConflicts} value={dash.capacity_conflicts} />
          <Stat label={labels.dashboard.strategicAlignment} value={dash.strategic_alignment_overview} suffix="/5" />
        </section>
      ) : null}

      {dash && dash.highest_priority.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.highestPriority}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.highest_priority.map((i) => (
              <li key={i.id}>
                <Link href={`/app/operations/prioritization/${i.id}`} className="text-indigo-700 hover:underline">{i.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {matrix ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.matrix.title}</h2>
          <p className="mt-1 text-xs text-slate-500">{labels.matrix.impact} vs {labels.matrix.effort}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <MatrixQuadrant title={labels.matrix.quickWins} items={matrix.quick_wins} className="border-emerald-200 bg-emerald-50/50" />
            <MatrixQuadrant title={labels.matrix.majorProjects} items={matrix.major_projects} className="border-indigo-200 bg-indigo-50/50" />
            <MatrixQuadrant title={labels.matrix.fillIns} items={matrix.fill_ins} className="border-slate-200 bg-slate-50" />
            <MatrixQuadrant title={labels.matrix.reconsider} items={matrix.reconsider} className="border-amber-200 bg-amber-50/50" />
          </div>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
        </select>
        <select value={priorityStatus} onChange={(e) => setPriorityStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priorityStatus}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{labels.priorityStatuses[s]}</option>)}
        </select>
        <select value={alignmentMin} onChange={(e) => setAlignmentMin(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.alignmentMin}</option>
          {[3, 4, 5].map((n) => <option key={n} value={String(n)}>{n}+</option>)}
        </select>
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
          <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as PrioritizationCategory)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
          </select>
          <input type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} aria-label={labels.form.dueDate} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
                  <Link href={`/app/operations/prioritization/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{item.title}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.categories[item.category]}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[item.priority_status]}`}>{labels.priorityStatuses[item.priority_status]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.alignment}: {item.strategic_alignment_score}/5</span>
                <span>{labels.card.impact}: {item.impact_score}/5</span>
                {item.composite_score != null ? <span>{labels.card.composite}: {item.composite_score}</span> : null}
                {item.matrix_quadrant ? <span>{labels.card.quadrant}: {labels.quadrants[item.matrix_quadrant]}</span> : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {(data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recommendedActions}</p>
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
          <div><dt className="font-medium">{labels.faq.canChange}</dt><dd className="mt-1 text-slate-600">{labels.faq.canChangeAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoDecide}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoDecideAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function Stat({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}{suffix}</p>
    </div>
  );
}

function MatrixQuadrant({
  title,
  items,
  className,
}: {
  title: string;
  items: Array<{ id: string; title: string }>;
  className: string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${className}`}>
      <p className="text-sm font-medium text-slate-900">{title}</p>
      {items.length === 0 ? (
        <p className="mt-2 text-xs text-slate-500">—</p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm">
          {items.slice(0, 4).map((i) => (
            <li key={i.id}>
              <Link href={`/app/operations/prioritization/${i.id}`} className="text-indigo-700 hover:underline">{i.title}</Link>
            </li>
          ))}
          {items.length > 4 ? <li className="text-xs text-slate-500">+{items.length - 4} more</li> : null}
        </ul>
      )}
    </div>
  );
}
