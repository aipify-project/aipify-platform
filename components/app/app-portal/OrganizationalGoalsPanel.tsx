"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGoalList,
  type GoalListResponse,
  type GoalPriority,
  type GoalStatus,
  type GoalType,
  type OrganizationalGoalsLabels,
} from "@/lib/app-portal/organizational-goals";

type Props = { labels: OrganizationalGoalsLabels };

const GOAL_TYPES: GoalType[] = [
  "strategic", "operational", "customer_experience", "employee_experience",
  "revenue", "security", "growth", "innovation", "compliance",
];
const STATUSES: GoalStatus[] = ["draft", "active", "at_risk", "on_track", "achieved", "cancelled"];
const PRIORITIES: GoalPriority[] = ["low", "medium", "high", "critical"];

const STATUS_STYLE: Record<GoalStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  active: "bg-sky-100 text-sky-800",
  at_risk: "bg-rose-100 text-rose-900",
  on_track: "bg-emerald-100 text-emerald-900",
  achieved: "bg-violet-100 text-violet-900",
  cancelled: "bg-slate-100 text-slate-500",
};

export function OrganizationalGoalsPanel({ labels }: Props) {
  const [data, setData] = useState<GoalListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [goalType, setGoalType] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<GoalType>("operational");
  const [formPriority, setFormPriority] = useState<GoalPriority>("medium");
  const [formCriteria, setFormCriteria] = useState("");
  const [formTarget, setFormTarget] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (goalType) params.set("goal_type", goalType);
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/goals?${params}`);
    if (res.ok) setData(parseGoalList(await res.json()));
    setLoading(false);
  }, [goalType, status, priority, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on filter change
    void load();
  }, [load]);

  async function createGoal() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle,
        description: formDescription,
        goal_type: formType,
        priority: formPriority,
        status: "active",
        target_date: formTarget || undefined,
        success_criteria: formCriteria,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { goal?: { id?: string } };
      if (body.goal?.id) {
        window.location.href = `/app/operations/goals/${body.goal.id}`;
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
  const empty = (data?.items.length ?? 0) === 0 && !goalType && !status && !priority && !search;

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
          <StatCard label={labels.dashboard.active} value={dash.active_goals} />
          <StatCard label={labels.dashboard.achievedQuarter} value={dash.achieved_this_quarter} />
          <StatCard label={labels.dashboard.attention} value={dash.requiring_attention} />
          <StatCard label={labels.dashboard.upcoming} value={dash.upcoming_target_dates.length} />
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <select value={goalType} onChange={(e) => setGoalType(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.goalType}</option>
          {GOAL_TYPES.map((t) => <option key={t} value={t}>{labels.goalTypes[t]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.status}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
        </select>
        {data?.can_manage ? (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            {labels.emptyCta}
          </button>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.form.createTitle}</h2>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.form.title} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder={labels.form.description} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="grid gap-3 sm:grid-cols-2">
            <select value={formType} onChange={(e) => setFormType(e.target.value as GoalType)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {GOAL_TYPES.map((t) => <option key={t} value={t}>{labels.goalTypes[t]}</option>)}
            </select>
            <select value={formPriority} onChange={(e) => setFormPriority(e.target.value as GoalPriority)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
            </select>
          </div>
          <input type="date" value={formTarget} onChange={(e) => setFormTarget(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" aria-label={labels.form.targetDate} />
          <textarea value={formCriteria} onChange={(e) => setFormCriteria(e.target.value)} placeholder={labels.form.successCriteria} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button type="button" onClick={() => void createGoal()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.form.submit}</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">{labels.form.cancel}</button>
          </div>
        </section>
      ) : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          {data?.can_manage ? (
            <button type="button" onClick={() => setShowForm(true)} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">{labels.emptyCta}</button>
          ) : null}
        </section>
      ) : (
        <ul className="space-y-3">
          {data?.items.map((g) => (
            <li key={g.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/app/operations/goals/${g.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{g.title}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.goalTypes[g.goal_type]} · {labels.priorities[g.priority]}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[g.status]}`}>{labels.statuses[g.status]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.progress}: {g.progress_percent}%</span>
                <span>{labels.card.owner}: {g.owner_name}</span>
                {g.target_date ? <span>{labels.card.targetDate}: {g.target_date}</span> : null}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-indigo-600" style={{ width: `${g.progress_percent}%` }} />
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
          <div><dt className="font-medium">{labels.faq.updated}</dt><dd className="mt-1 text-slate-600">{labels.faq.updatedAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoComplete}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoCompleteAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
