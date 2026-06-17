"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  BENCHMARK_DIMENSION_KEYS,
  BENCHMARK_PRIORITY_LEVELS,
  MATURITY_LEVELS,
  parseBenchmarkOverview,
  parseBenchmarkTimeline,
  type BenchmarkDimensionCard,
  type BenchmarkTimelineEvent,
  type EnterpriseBenchmarkingLabels,
  type BenchmarkOverview,
} from "@/lib/app-portal/enterprise-benchmarking";

const ORGANIZATIONAL_AREAS = [
  "executive",
  "operations",
  "governance",
  "learning",
  "customer",
  "business_packs",
  "strategy",
  "risk",
  "automation",
  "intelligence",
] as const;

type Props = { labels: EnterpriseBenchmarkingLabels };

export function EnterpriseBenchmarkingPanel({ labels }: Props) {
  const [data, setData] = useState<BenchmarkOverview | null>(null);
  const [timeline, setTimeline] = useState<BenchmarkTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dimensionKey, setDimensionKey] = useState("");
  const [maturityLevel, setMaturityLevel] = useState("");
  const [organizationalArea, setOrganizationalArea] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [assessOpen, setAssessOpen] = useState(false);
  const [assessNotes, setAssessNotes] = useState("");
  const [assessLevel, setAssessLevel] = useState("3");
  const [assessMessage, setAssessMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (dimensionKey) params.set("dimension_key", dimensionKey);
    if (maturityLevel) params.set("maturity_level", maturityLevel);
    if (organizationalArea) params.set("organizational_area", organizationalArea);
    if (priorityLevel) params.set("priority_level", priorityLevel);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());

    const timelineParams = new URLSearchParams();
    if (periodFrom) timelineParams.set("period_from", periodFrom);

    const [dashRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/benchmarking?${params}`),
      fetch(`/api/aipify/benchmarking/timeline?${timelineParams}`),
    ]);

    if (dashRes.ok) {
      setData(parseBenchmarkOverview(await dashRes.json()));
    } else {
      const body = (await dashRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { events?: unknown };
      setTimeline(parseBenchmarkTimeline(body));
    }
    setLoading(false);
  }, [dimensionKey, maturityLevel, organizationalArea, priorityLevel, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function startAssessment() {
    setBusy(true);
    setAssessMessage("");
    const res = await fetch("/api/aipify/benchmarking/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assessment_notes: assessNotes, maturity_level: Number(assessLevel) }),
    });
    setBusy(false);
    if (res.ok) {
      setAssessOpen(false);
      setAssessNotes("");
      setAssessMessage(labels.assessment.success);
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
      <div className="mx-auto max-w-6xl space-y-4">
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <p className="text-slate-600">{labels.accessDenied}</p>
      </div>
    );
  }

  const empty = !data?.has_maturity_data;
  const canAssess = data?.can_assess === true;
  const insights = data?.insights;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
        {data?.anonymized_benchmark_note ? (
          <p className="mt-3 text-sm text-slate-600">{labels.anonymizedNote}</p>
        ) : null}
      </div>

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          {canAssess ? (
            <button type="button" onClick={() => setAssessOpen(true)} className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</button>
          ) : null}
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.executiveSummary}</p>
            <p className="mt-2 text-sm text-slate-700">{data?.executive_summary}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label={labels.dashboard.overallMaturity} value={`${data?.overall_maturity_score ?? 0}%`} />
            <Stat label={labels.dashboard.operationalMaturity} value={`${data?.operational_maturity_score ?? 0}%`} />
            <Stat label={labels.dashboard.governanceMaturity} value={`${data?.governance_maturity_score ?? 0}%`} />
            <Stat label={labels.dashboard.learningMaturity} value={`${data?.learning_maturity_score ?? 0}%`} />
            <Stat label={labels.dashboard.executiveIntelligence} value={`${data?.executive_intelligence_score ?? 0}%`} />
            <Stat label={labels.dashboard.businessPackMaturity} value={`${data?.business_pack_maturity_score ?? 0}%`} />
          </section>

          {(data?.recommended_focus_areas?.length ?? 0) > 0 ? (
            <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
              <h2 className="font-semibold">{labels.dashboard.recommendedFocus}</h2>
              <ul className="mt-3 space-y-1 text-sm text-slate-800">
                {data!.recommended_focus_areas!.map((f) => (
                  <li key={f.dimension_key}>{labels.dimensions[f.dimension_key as keyof typeof labels.dimensions] ?? f.name}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={dimensionKey} onChange={(e) => setDimensionKey(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.dimension}</option>
          {BENCHMARK_DIMENSION_KEYS.map((k) => <option key={k} value={k}>{labels.dimensions[k]}</option>)}
        </select>
        <select value={maturityLevel} onChange={(e) => setMaturityLevel(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.maturityLevel}</option>
          {MATURITY_LEVELS.map((l) => <option key={l} value={String(l)}>{labels.maturityLevels[String(l)]}</option>)}
        </select>
        <select value={organizationalArea} onChange={(e) => setOrganizationalArea(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.organizationalArea}</option>
          {ORGANIZATIONAL_AREAS.map((a) => <option key={a} value={a}>{a.replace(/_/g, " ")}</option>)}
        </select>
        <select value={priorityLevel} onChange={(e) => setPriorityLevel(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priorityLevel}</option>
          {BENCHMARK_PRIORITY_LEVELS.map((p) => <option key={p} value={p}>{labels.priorityLevels[p]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.timePeriod} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.dimensions?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.maturityDimensions}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.dimensions!.map((dim) => (
              <DimensionCard key={dim.dimension_key} dim={dim} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {!empty && insights ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.benchmarkInsights}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InsightList title={labels.insights.strongest} items={insights.strongest_dimensions?.map((i) => i.name ?? i.dimension_key ?? "") ?? []} />
            <InsightList title={labels.insights.lowest} items={insights.lowest_dimensions?.map((i) => i.name ?? i.dimension_key ?? "") ?? []} />
            <InsightList title={labels.insights.improvingRapidly} items={insights.improving_rapidly?.map((i) => i.name ?? i.dimension_key ?? "") ?? []} />
            <InsightList title={labels.insights.limitedProgress} items={insights.limited_progress?.map((i) => i.name ?? i.dimension_key ?? "") ?? []} />
            <InsightList title={labels.insights.crossFunctional} items={insights.cross_functional_patterns ?? []} />
          </div>
        </section>
      ) : null}

      {!empty && timeline.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.timeline}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {timeline.map((e) => (
              <li key={e.id}>{labels.timelineEvents[e.event_type as keyof typeof labels.timelineEvents] ?? e.description}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.recommendedActions}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {data!.recommendations!.map((r) => (
              <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {canAssess ? (
        <div className="flex gap-3">
          <button type="button" onClick={() => setAssessOpen(!assessOpen)} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</button>
        </div>
      ) : null}

      {assessOpen ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 text-sm">
          <p className="font-medium">{labels.assessment.title}</p>
          <p className="mt-2 text-slate-600">{labels.assessment.governanceNote}</p>
          <select value={assessLevel} onChange={(e) => setAssessLevel(e.target.value)} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2">
            {MATURITY_LEVELS.map((l) => <option key={l} value={String(l)}>{labels.maturityLevels[String(l)]}</option>)}
          </select>
          <textarea value={assessNotes} onChange={(e) => setAssessNotes(e.target.value)} placeholder={labels.assessment.notes} rows={3} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2" />
          <button type="button" disabled={busy} onClick={() => void startAssessment()} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{labels.assessment.submit}</button>
        </section>
      ) : null}

      {assessMessage ? <p className="text-sm text-emerald-700">{assessMessage}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.anonymous}</dt><dd className="mt-1 text-slate-600">{labels.faq.anonymousAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.determinesSuccess}</dt><dd className="mt-1 text-slate-600">{labels.faq.determinesSuccessAnswer}</dd></div>
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

function InsightList({ title, items }: { title: string; items: string[] }) {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return null;
  return (
    <div>
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-600">{filtered.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function DimensionCard({ dim, labels }: { dim: BenchmarkDimensionCard; labels: EnterpriseBenchmarkingLabels }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{labels.dimensions[dim.dimension_key as keyof typeof labels.dimensions] ?? dim.name}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {labels.maturityLevels[dim.maturity_level_label as keyof typeof labels.maturityLevels] ?? dim.maturity_level_label} · {dim.maturity_score}%
          </p>
        </div>
      </div>
      <Link href={`/app/intelligence/benchmarking/${dim.dimension_key}`} className="mt-4 inline-block text-sm font-medium text-indigo-700 hover:underline">
        {labels.dashboard.viewDimension}
      </Link>
    </article>
  );
}
