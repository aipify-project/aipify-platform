"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CONTEXT_SOURCE_KEYS,
  parseCompanionContextDashboard,
  parseCompanionContextRecommendations,
  parseCompanionContextTimeline,
  type CompanionContextDashboard,
  type CompanionContextEngineLabels,
  type ContextRecommendation,
  type ContextSource,
} from "@/lib/aipify/companion-context-engine";

type Props = { labels: CompanionContextEngineLabels };

export function CompanionContextEngineDashboardPanel({ labels }: Props) {
  const [data, setData] = useState<CompanionContextDashboard | null>(null);
  const [timeline, setTimeline] = useState<ReturnType<typeof parseCompanionContextTimeline>["timeline"]>([]);
  const [recommendations, setRecommendations] = useState<ContextRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [source, setSource] = useState("");
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (source) p.set("source", source);
    if (department) p.set("department", department);
    if (priority) p.set("priority", priority);
    if (search.trim()) p.set("search", search.trim());

    const [dashRes, timeRes, recRes] = await Promise.all([
      fetch(`/api/aipify/context?${p}`),
      fetch("/api/aipify/context/timeline"),
      fetch(`/api/aipify/context/recommendations?${p}`),
    ]);

    if (dashRes.ok) {
      setData(parseCompanionContextDashboard(await dashRes.json()));
    } else {
      const b = (await dashRes.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    if (timeRes.ok) setTimeline(parseCompanionContextTimeline(await timeRes.json()).timeline);
    if (recRes.ok) setRecommendations(parseCompanionContextRecommendations(await recRes.json()).recommendations);
    setLoading(false);
  }, [source, department, priority, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  if (loading && !data && !error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error && !data?.found) {
    return <p className="text-sm text-slate-600">{labels.accessDenied}</p>;
  }

  const empty = !data?.has_context_data;
  const view = data?.companion_view;

  return (
    <div className="space-y-8">
      <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      {data?.privacy_note ? <p className="text-sm text-slate-600">{labels.privacyNote}</p> : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <Link href="/app/integration-engine"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">
            {labels.emptyCta}
          </Link>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreCard label={labels.dashboard.contextHealthScore} value={data?.context_health_score ?? 0} />
            <ScoreCard label={labels.dashboard.companionReadinessScore} value={data?.companion_readiness_score ?? 0} />
            <ScoreCard label={labels.dashboard.availableSignals} value={data?.available_signals ?? 0} />
            <ScoreCard label={labels.dashboard.contextCoverage} value={data?.context_coverage_pct ?? 0} suffix="%" />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">{labels.dashboard.companionView}</h2>
            <dl className="mt-3 space-y-2 text-sm text-slate-700">
              <div><dt className="font-medium">{labels.dashboard.currentFocus}</dt><dd>{view?.current_focus}</dd></div>
              <div><dt className="font-medium">{labels.dashboard.recentActivity}</dt><dd>{view?.recent_activity}</dd></div>
              <div><dt className="font-medium">{labels.dashboard.upcomingEvents}</dt><dd>{view?.upcoming_events}</dd></div>
              <div><dt className="font-medium">{labels.dashboard.contextConfidence}</dt>
                <dd>{labels.confidenceLevels[view?.context_confidence as keyof typeof labels.confidenceLevels] ?? view?.context_confidence}</dd></div>
            </dl>
          </section>
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={source} onChange={(e) => setSource(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.source}</option>
          {CONTEXT_SOURCE_KEYS.map((k) => (
            <option key={k} value={k}>{labels.sources[k] ?? k}</option>
          ))}
        </select>
        <input value={department} onChange={(e) => setDepartment(e.target.value)}
          placeholder={labels.filters.department}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.all}</option>
          {(["low", "moderate", "high", "critical"] as const).map((p) => (
            <option key={p} value={p}>{labels.priorities[p]}</option>
          ))}
        </select>
      </section>

      {!empty && (data?.active_sources?.length ?? 0) > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.activeSources}</h2>
          <div className="grid gap-3 lg:grid-cols-2">
            {data!.active_sources!.map((s) => (
              <SourceCard key={s.id || s.source_key} source={s} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      <ContextSection title={labels.dashboard.userContext} records={data?.user_context} />
      {data?.can_org ? (
        <ContextSection title={labels.dashboard.organizationContext} records={data?.organization_context} />
      ) : null}
      <ContextSection title={labels.dashboard.workContext} records={data?.work_context} />

      {(view?.pending_actions?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.pendingActions}</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {view!.pending_actions!.map((a, i) => (
              <li key={i}><span className="font-medium">{a.title}</span>{a.summary ? ` — ${a.summary}` : ""}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {recommendations.length > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.recommendations}</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {recommendations.map((r) => (
              <li key={r.id} className="rounded-lg border border-indigo-100 bg-white p-3">
                <p className="font-medium text-slate-900">{r.title}</p>
                <p className="mt-1 text-slate-600">{r.summary}</p>
                <p className="mt-1 text-indigo-800">{r.recommendation}</p>
                {r.effort ? <p className="mt-1 text-xs text-slate-500">{labels.recommendation.effort}: {r.effort}</p> : null}
                {r.value_hint ? <p className="text-xs text-slate-500">{labels.recommendation.value}: {r.value_hint}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {timeline.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.timeline}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {timeline.slice(0, 12).map((e) => (
              <li key={e.id}>{e.description} · {new Date(e.created_at).toLocaleDateString()}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {data?.usage_example ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.usageExamples}</h2>
          <p className="mt-2 text-sm italic text-slate-700">{data.usage_example}</p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoAccess}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoAccessAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyImportant}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyImportantAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ScoreCard({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-indigo-700">{value}{suffix}</p>
    </div>
  );
}

function SourceCard({ source, labels }: { source: ContextSource; labels: CompanionContextEngineLabels }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
      <h3 className="font-semibold text-slate-900">{labels.sources[source.source_key] ?? source.title}</h3>
      <dl className="mt-2 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.source.status}: </dt>
          <dd className="inline">{labels.statuses[source.status as keyof typeof labels.statuses] ?? source.status}</dd></div>
        <div><dt className="inline">{labels.source.signals}: </dt><dd className="inline">{source.signal_count}</dd></div>
        <div><dt className="inline">{labels.source.coverage}: </dt><dd className="inline">{source.coverage_pct}%</dd></div>
      </dl>
    </article>
  );
}

function ContextSection({
  title,
  records = [],
}: {
  title: string;
  records?: { id: string; title: string; summary: string; confidence: string }[];
}) {
  if (!records.length) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {records.map((r) => (
          <li key={r.id} className="rounded-lg border border-slate-100 p-3">
            <p className="font-medium text-slate-900">{r.title}</p>
            <p className="mt-1 text-slate-600">{r.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
