"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCapacityList,
  type CapacityCategory,
  type CapacityListResponse,
  type CapacityStatus,
  type CapacityWorkloadLabels,
  type TrendDirection,
  type WorkloadLevel,
} from "@/lib/app-portal/capacity-workload";

type Props = { labels: CapacityWorkloadLabels };

const CATEGORIES: CapacityCategory[] = [
  "individual_capacity", "team_capacity", "department_capacity", "operational_capacity",
  "leadership_capacity", "support_capacity", "project_capacity", "seasonal_capacity",
  "growth_capacity", "custom_category",
];
const STATUSES: CapacityStatus[] = ["healthy", "approaching_limit", "overloaded", "underutilized", "requires_review"];
const WORKLOAD: WorkloadLevel[] = ["very_low", "balanced", "elevated", "high", "critical"];
const TRENDS: TrendDirection[] = ["increasing", "stable", "decreasing"];

const INSIGHT_KEYS = [
  "persistent_overload",
  "sudden_increase",
  "above_limits",
  "unused_capacity",
  "operational_strain",
] as const;

const STATUS_STYLE: Record<CapacityStatus, string> = {
  healthy: "bg-emerald-100 text-emerald-900",
  approaching_limit: "bg-amber-100 text-amber-950",
  overloaded: "bg-rose-100 text-rose-900",
  underutilized: "bg-blue-100 text-blue-900",
  requires_review: "bg-slate-100 text-slate-700",
};

export function CapacityWorkloadPanel({ labels }: Props) {
  const [data, setData] = useState<CapacityListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [team, setTeam] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [workload, setWorkload] = useState("");
  const [trend, setTrend] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formTeam, setFormTeam] = useState("");
  const [formCategory, setFormCategory] = useState<CapacityCategory>("team_capacity");
  const [formUtilization, setFormUtilization] = useState("65");
  const [formRecommended, setFormRecommended] = useState("75");
  const [formTrend, setFormTrend] = useState<TrendDirection>("stable");
  const [formNotes, setFormNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (team.trim()) params.set("team", team.trim());
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (workload) params.set("workload_level", workload);
    if (trend) params.set("trend_direction", trend);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/capacity?${params}`);
    if (res.ok) {
      setData(parseCapacityList(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [team, category, status, workload, trend, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function createItem() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/capacity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle,
        team_name: formTeam,
        category: formCategory,
        current_utilization: Number(formUtilization) || 0,
        recommended_utilization: Number(formRecommended) || 75,
        trend_direction: formTrend,
        notes: formNotes,
      }),
    });
    if (res.ok) {
      const body = (await res.json()) as { record?: { id?: string } };
      if (body.record?.id) {
        window.location.href = `/app/operations/capacity/${body.record.id}`;
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

  if (error && !data?.found) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-8 text-center">
        <h1 className="text-xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="text-sm text-slate-600">{error}</p>
      </div>
    );
  }

  const dash = data?.dashboard;
  const empty = (data?.items.length ?? 0) === 0 && !category && !status && !search && !team;

  const insightLabel = (key: string) => {
    const map: Record<string, string> = {
      persistent_overload: labels.insights.persistentOverload,
      sudden_increase: labels.insights.suddenIncrease,
      above_limits: labels.insights.aboveLimits,
      unused_capacity: labels.insights.unusedCapacity,
      operational_strain: labels.insights.operationalStrain,
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
          <Stat label={labels.dashboard.overview} value={`${dash.overview_utilization}%`} />
          <Stat label={labels.dashboard.approachingLimits} value={dash.teams_approaching_limits} />
          <Stat label={labels.dashboard.balancedTeams} value={dash.balanced_teams} />
          <Stat label={labels.dashboard.recommendedReviews} value={dash.recommended_reviews} />
        </section>
      ) : null}

      {dash && dash.recent_changes.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.recentChanges}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {dash.recent_changes.map((r) => (
              <li key={r.id}>
                <Link href={`/app/operations/capacity/${r.id}`} className="text-indigo-700 hover:underline">{r.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(data?.workload_insights?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.insights.title}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {INSIGHT_KEYS.map((key) => {
              const insight = data!.workload_insights!.find((p) => p.key === key);
              return (
                <li key={key} className={insight?.active ? "text-indigo-800" : "text-slate-400"}>
                  {insightLabel(key)}{insight?.active ? "" : ` — ${labels.insights.inactive}`}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={team} onChange={(e) => setTeam(e.target.value)} placeholder={labels.filters.team} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.status}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <select value={workload} onChange={(e) => setWorkload(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.workload}</option>
          {WORKLOAD.map((w) => <option key={w} value={w}>{labels.workload[w]}</option>)}
        </select>
        <select value={trend} onChange={(e) => setTrend(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.trend}</option>
          {TRENDS.map((t) => <option key={t} value={t}>{labels.trends[t]}</option>)}
        </select>
        {data?.can_manage ? (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.emptyCta}</button>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.form.createTitle}</h2>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.form.title} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input value={formTeam} onChange={(e) => setFormTeam(e.target.value)} placeholder={labels.form.team} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as CapacityCategory)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c} value={c}>{labels.categories[c]}</option>)}
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="number" min={0} max={100} value={formUtilization} onChange={(e) => setFormUtilization(e.target.value)} placeholder={labels.form.currentUtilization} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input type="number" min={0} max={100} value={formRecommended} onChange={(e) => setFormRecommended(e.target.value)} placeholder={labels.form.recommendedUtilization} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <select value={formTrend} onChange={(e) => setFormTrend(e.target.value as TrendDirection)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {TRENDS.map((t) => <option key={t} value={t}>{labels.trends[t]}</option>)}
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
                  <Link href={`/app/operations/capacity/${item.id}`} className="font-medium text-slate-900 hover:text-indigo-700">{item.title}</Link>
                  <p className="mt-1 text-xs text-slate-500">{labels.categories[item.category]} · {item.team_name || labels.card.team}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[item.status]}`}>{labels.statuses[item.status]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>{labels.card.utilization}: {item.current_utilization}%</span>
                <span>{labels.card.recommended}: {item.recommended_utilization}%</span>
                <span>{labels.card.trend}: {labels.trends[item.trend_direction]}</span>
                <span>{labels.card.workload}: {labels.workload[item.workload_level]}</span>
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
          <div><dt className="font-medium">{labels.faq.monitoring}</dt><dd className="mt-1 text-slate-600">{labels.faq.monitoringAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoRebalance}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoRebalanceAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
