"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseStrategyList,
  type StrategyCategory,
  type StrategyExecutionLabels,
  type StrategyListResponse,
  type StrategicImportance,
  type StrategyStatus,
} from "@/lib/app-portal/strategy-execution";

type Props = { labels: StrategyExecutionLabels };

const CATEGORIES: StrategyCategory[] = [
  "growth_strategy", "customer_strategy", "operational_excellence", "digital_transformation",
  "innovation_strategy", "employee_strategy", "financial_strategy", "risk_strategy",
  "sustainability_strategy", "custom_strategic_theme",
];
const STATUSES: StrategyStatus[] = ["planning", "active", "on_track", "needs_attention", "delayed", "completed", "archived"];
const IMPORTANCE: StrategicImportance[] = ["important", "high_priority", "critical_priority", "transformational"];

const STATUS_STYLE: Record<StrategyStatus, string> = {
  planning: "bg-slate-100 text-slate-700",
  active: "bg-indigo-100 text-indigo-900",
  on_track: "bg-emerald-100 text-emerald-900",
  needs_attention: "bg-amber-100 text-amber-950",
  delayed: "bg-rose-100 text-rose-900",
  completed: "bg-blue-100 text-blue-900",
  archived: "bg-slate-100 text-slate-500",
};

export function StrategyExecutionPanel({ labels }: Props) {
  const [data, setData] = useState<StrategyListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [importance, setImportance] = useState("");
  const [targetFrom, setTargetFrom] = useState("");
  const [targetTo, setTargetTo] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<StrategyCategory>("growth_strategy");
  const [formImportance, setFormImportance] = useState<StrategicImportance>("important");
  const [formSuccessDefinition, setFormSuccessDefinition] = useState("");
  const [formTargetDate, setFormTargetDate] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (importance) params.set("importance", importance);
    if (targetFrom) params.set("target_from", targetFrom);
    if (targetTo) params.set("target_to", targetTo);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/strategy?${params}`);
    if (res.ok) setData(parseStrategyList(await res.json()));
    setLoading(false);
  }, [category, status, importance, targetFrom, targetTo, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createItem() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/strategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle,
        description: formDescription,
        category: formCategory,
        strategic_importance: formImportance,
        success_definition: formSuccessDefinition,
        target_date: formTargetDate || undefined,
        notes: formNotes,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { initiative?: { id?: string } };
      if (body.initiative?.id) {
        window.location.href = `/app/operations/strategy/${body.initiative.id}`;
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
          <Stat label={labels.dashboard.progressOverview} value={dash.progress_overview} suffix="%" />
          <Stat label={labels.dashboard.requiringAttention} value={dash.requiring_attention.length} />
        </section>
      ) : null}

      {dash && dash.requiring_attention.length > 0 ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.requiringAttention}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.requiring_attention.map((i) => (
              <li key={i.id}>
                <Link href={`/app/operations/strategy/${i.id}`} className="text-indigo-700 hover:underline">{i.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dash && dash.upcoming_milestones.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.upcomingMilestones}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {dash.upcoming_milestones.map((m) => (
              <li key={m.id}>{m.title}{m.target_date ? ` — ${m.target_date}` : ""}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dash && dash.recently_completed.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recentlyCompleted}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.recently_completed.map((i) => (
              <li key={i.id}>
                <Link href={`/app/operations/strategy/${i.id}`} className="text-indigo-700 hover:underline">{i.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dash && dash.execution_trends.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.executionTrends}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
            {dash.execution_trends.map((i) => (
              <li key={i.id}>{i.title}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(data?.execution_insights?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.detail.executionInsights}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {data!.execution_insights!.map((ins) => (
              <li key={ins.id}>
                {labels.insights[ins.key as keyof typeof labels.insights] ?? ins.key}
                {typeof ins.count === "number" ? ` (${ins.count})` : ""}
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
        <select value={importance} onChange={(e) => setImportance(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.importance}</option>
          {IMPORTANCE.map((v) => <option key={v} value={v}>{labels.importanceLevels[v]}</option>)}
        </select>
        <input type="date" value={targetFrom} onChange={(e) => setTargetFrom(e.target.value)} aria-label={labels.filters.targetFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={targetTo} onChange={(e) => setTargetTo(e.target.value)} aria-label={labels.filters.targetTo} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        {data?.can_manage ? (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.emptyCta}</button>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.form.createTitle}</h2>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.form.title} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder={labels.form.description} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as StrategyCategory)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
          </select>
          <select value={formImportance} onChange={(e) => setFormImportance(e.target.value as StrategicImportance)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {IMPORTANCE.map((v) => <option key={v} value={v}>{labels.importanceLevels[v]}</option>)}
          </select>
          <textarea value={formSuccessDefinition} onChange={(e) => setFormSuccessDefinition(e.target.value)} placeholder={labels.form.successDefinition} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input type="date" value={formTargetDate} onChange={(e) => setFormTargetDate(e.target.value)} aria-label={labels.form.targetDate} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
                  <Link href={`/app/operations/strategy/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{item.title}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.categories[item.category]}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[item.status]}`}>{labels.statuses[item.status]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.owner}: {item.initiative_owner_name}</span>
                <span>{labels.card.importance}: {labels.importanceLevels[item.strategic_importance]}</span>
                <span>{labels.card.progress}: {item.progress_percent}%</span>
                {item.target_date ? <span>{labels.card.targetDate}: {item.target_date}</span> : null}
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
          <div><dt className="font-medium">{labels.faq.whyOwners}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyOwnersAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoExecute}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoExecuteAnswer}</dd></div>
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
