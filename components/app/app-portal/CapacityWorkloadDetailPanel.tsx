"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCapacityDetail,
  type CapacityDetail,
  type CapacityStatus,
  type CapacityWorkloadLabels,
  type TrendDirection,
} from "@/lib/app-portal/capacity-workload";

type Props = { recordId: string; labels: CapacityWorkloadLabels };

const STATUSES: CapacityStatus[] = ["healthy", "approaching_limit", "overloaded", "underutilized", "requires_review"];
const TRENDS: TrendDirection[] = ["increasing", "stable", "decreasing"];

export function CapacityWorkloadDetailPanel({ recordId, labels }: Props) {
  const [detail, setDetail] = useState<CapacityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<CapacityStatus>("healthy");
  const [utilization, setUtilization] = useState("");
  const [trend, setTrend] = useState<TrendDirection>("stable");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/capacity/${recordId}`);
    if (res.ok) {
      const parsed = parseCapacityDetail(await res.json());
      setDetail(parsed);
      if (parsed.record) {
        setNotes(parsed.record.notes ?? "");
        setStatus(parsed.record.status);
        setUtilization(String(parsed.record.current_utilization));
        setTrend(parsed.record.trend_direction);
      }
    }
    setLoading(false);
  }, [recordId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  async function saveRecord() {
    await fetch(`/api/aipify/capacity/${recordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes,
        status,
        current_utilization: Number(utilization) || undefined,
        trend_direction: trend,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    void load();
  }

  if (loading) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (!detail?.found || !detail.record) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/operations/capacity" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  const r = detail.record;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/operations/capacity" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{r.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {labels.categories[r.category]} · {labels.statuses[r.status]} · {labels.workload[r.workload_level]}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">{labels.detail.overview}</h2>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{labels.card.team}</dt><dd className="font-medium">{r.team_name || "—"}</dd></div>
          <div><dt className="text-slate-500">{labels.card.owner}</dt><dd className="font-medium">{r.owner_name}</dd></div>
          <div><dt className="text-slate-500">{labels.card.utilization}</dt><dd>{r.current_utilization}%</dd></div>
          <div><dt className="text-slate-500">{labels.card.recommended}</dt><dd>{r.recommended_utilization}%</dd></div>
          <div><dt className="text-slate-500">{labels.card.trend}</dt><dd>{labels.trends[r.trend_direction]}</dd></div>
          {r.last_updated_date ? <div><dt className="text-slate-500">{labels.card.lastUpdated}</dt><dd>{r.last_updated_date}</dd></div> : null}
        </dl>
        {r.notes_full || r.notes ? <p className="mt-4 text-sm text-slate-700">{r.notes_full ?? r.notes}</p> : null}
      </section>

      {(detail.trend_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.trendAnalysis}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {detail.trend_history!.map((t) => (
              <li key={t.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2">
                <span>{t.utilization}% · {labels.workload[t.workload_level]} · {labels.trends[t.trend_direction]}</span>
                <span className="text-slate-500">{new Date(t.recorded_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(r.team_breakdown?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.teamBreakdown}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {r.team_breakdown!.map((t, i) => (
              <li key={i} className="flex justify-between gap-2">
                <span className="font-medium">{t.name}</span>
                <span className="text-slate-600">{t.utilization}%{t.workload_level ? ` · ${labels.workload[t.workload_level]}` : ""}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.related_follow_ups?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.relatedFollowUps}</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {detail.related_follow_ups!.map((f) => (
              <li key={f.id}><Link href={`/app/operations/follow-ups/${f.id}`} className="text-indigo-700 hover:underline">{f.title}</Link></li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.detail.followUpRecommendations}</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {detail.recommendations!.map((rec) => (
              <li key={rec.id}>{labels.recommendations[rec.key as keyof typeof labels.recommendations] ?? rec.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {detail.can_manage ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="font-semibold">{labels.detail.relatedActivities}</h2>
          <input type="number" min={0} max={100} value={utilization} onChange={(e) => setUtilization(e.target.value)} placeholder={labels.form.currentUtilization} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={trend} onChange={(e) => setTrend(e.target.value as TrendDirection)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {TRENDS.map((t) => <option key={t} value={t}>{labels.trends[t]}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as CapacityStatus)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
          </select>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={labels.form.notes} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <button type="button" onClick={() => void saveRecord()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.detail.save}</button>
          {saved ? <p className="text-sm text-emerald-700">{labels.detail.saved}</p> : null}
        </section>
      ) : null}

      {(detail.activity_timeline?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.timeline}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.activity_timeline!.map((a) => (
              <li key={a.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2">
                <span>{a.description}</span>
                <span className="text-slate-500">{a.performed_by} · {new Date(a.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(detail.audit_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.detail.audit}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {detail.audit_history!.map((a) => (
              <li key={`audit-${a.id}`} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2">
                <span>{a.description}</span>
                <span className="text-slate-500">{new Date(a.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
