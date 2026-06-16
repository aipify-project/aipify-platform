"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CULTURE_DIMENSIONS,
  parseCultureOverview,
  type CheckInFrequency,
  type CultureDimension,
  type CultureOverviewResponse,
  type CultureTrendDirection,
  type TrustCultureLabels,
} from "@/lib/app-portal/trust-culture";

type Props = { labels: TrustCultureLabels };

const TRENDS: CultureTrendDirection[] = ["improving", "stable", "declining", "insufficient_data"];
const FREQUENCIES: CheckInFrequency[] = ["weekly", "monthly", "quarterly", "on_demand"];

export function TrustCulturePanel({ labels }: Props) {
  const [data, setData] = useState<CultureOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dimension, setDimension] = useState("");
  const [trend, setTrend] = useState("");
  const [department, setDepartment] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFrequency, setFormFrequency] = useState<CheckInFrequency>("on_demand");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (dimension) params.set("dimension", dimension);
    if (trend) params.set("trend", trend);
    if (department.trim()) params.set("department", department.trim());
    if (periodFrom) params.set("from", periodFrom);
    if (periodTo) params.set("to", periodTo);
    const res = await fetch(`/api/aipify/culture?${params}`);
    if (res.ok) {
      setData(parseCultureOverview(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [dimension, trend, department, periodFrom, periodTo, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function launchCheckIn() {
    if (!formTitle.trim()) return;
    const res = await fetch("/api/aipify/culture/check-ins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: formTitle, description: formDescription, frequency: formFrequency }),
    });
    if (res.ok) {
      setShowForm(false);
      setFormTitle("");
      setFormDescription("");
      void load();
    }
  }

  if (loading && !data && !error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error && !data?.found) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <p className="text-slate-600">{labels.accessDenied}</p>
      </div>
    );
  }

  const snap = data?.snapshot;
  const empty = !snap?.culture_score && (data?.dimensions?.every((d) => d.suppressed) ?? true) && (data?.check_ins?.length ?? 0) === 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
        <p className="mt-2 text-xs text-slate-500">{labels.privacyNote}</p>
      </div>

      {snap ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label={labels.snapshot.cultureScore} value={snap.culture_score != null ? String(snap.culture_score) : labels.snapshot.suppressed} />
          <Stat label={labels.snapshot.trustScore} value={snap.trust_score != null ? String(snap.trust_score) : labels.snapshot.suppressed} />
          <Stat label={labels.snapshot.participationRate} value={`${snap.participation_rate}%`} />
          <Stat label={labels.snapshot.trendDirection} value={labels.trends[snap.trend_direction]} />
          <Stat label={labels.snapshot.improvementMomentum} value={snap.improvement_momentum} />
          <Stat label={labels.snapshot.areasAttention} value={String(snap.areas_requiring_attention.length)} />
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <select value={dimension} onChange={(e) => setDimension(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.dimension}</option>
          {CULTURE_DIMENSIONS.map((d) => <option key={d} value={d}>{labels.dimensions[d]}</option>)}
        </select>
        <select value={trend} onChange={(e) => setTrend(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.trend}</option>
          {TRENDS.map((t) => <option key={t} value={t}>{labels.trends[t]}</option>)}
        </select>
        <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder={labels.filters.department} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={periodTo} onChange={(e) => setPeriodTo(e.target.value)} aria-label={labels.filters.periodTo} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        {data?.can_manage ? (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.emptyCta}</button>
        ) : null}
      </section>

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold">{labels.checkIn.launchTitle}</h2>
          <p className="text-xs text-slate-500">{labels.checkIn.voluntaryNote}</p>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={labels.checkIn.title} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder={labels.checkIn.description} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select value={formFrequency} onChange={(e) => setFormFrequency(e.target.value as CheckInFrequency)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {FREQUENCIES.map((f) => <option key={f} value={f}>{labels.frequencies[f]}</option>)}
          </select>
          <div className="flex gap-2">
            <button type="button" onClick={() => void launchCheckIn()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">{labels.checkIn.submit}</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">{labels.checkIn.cancel}</button>
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
        <section className="grid gap-3 sm:grid-cols-2">
          {data?.dimensions?.map((dim) => (
            <Link
              key={dim.dimension}
              href={`/app/organization/culture/${dim.dimension}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-200"
            >
              <p className="font-medium text-slate-900">{labels.dimensions[dim.dimension as CultureDimension]}</p>
              <p className="mt-1 text-sm text-slate-600">
                {dim.suppressed ? labels.snapshot.suppressed : `${dim.score}/5`}
                {" · "}{labels.trends[dim.trend_direction]}
              </p>
            </Link>
          ))}
        </section>
      )}

      {(data?.check_ins?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">{labels.dashboard.checkIns}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {data!.check_ins!.map((c) => (
              <li key={c.id}>{c.title} · {labels.frequencies[c.frequency]} · {c.status}</li>
            ))}
          </ul>
        </section>
      ) : null}

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
          <div><dt className="font-medium">{labels.faq.anonymous}</dt><dd className="mt-1 text-slate-600">{labels.faq.anonymousAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.goodCulture}</dt><dd className="mt-1 text-slate-600">{labels.faq.goodCultureAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
