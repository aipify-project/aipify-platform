"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  INSIGHT_CATEGORY_KEYS,
  parseProactiveInsightsDashboard,
  type CompanionProactiveInsightsEngineLabels,
  type ProactiveInsightRecord,
  type ProactiveInsightsDashboard,
} from "@/lib/aipify/companion-proactive-insights-engine";

type Props = { labels: CompanionProactiveInsightsEngineLabels };

export function CompanionProactiveInsightsEngineDashboardPanel({ labels }: Props) {
  const [data, setData] = useState<ProactiveInsightsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [confidence, setConfidence] = useState("");
  const [impact, setImpact] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (priority) p.set("priority", priority);
    if (confidence) p.set("confidence", confidence);
    if (impact) p.set("impact", impact);
    if (department) p.set("department", department);
    if (status) p.set("status", status);
    if (search.trim()) p.set("search", search.trim());

    const res = await fetch(`/api/aipify/proactive-insights?${p}`);
    if (res.ok) {
      setData(parseProactiveInsightsDashboard(await res.json()));
    } else {
      const b = (await res.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [category, priority, confidence, impact, department, status, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function review(id: string, action: string) {
    setActing(id);
    await fetch(`/api/aipify/proactive-insights/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setActing(null);
    void load();
  }

  async function feedback(id: string, feedback_type: string) {
    setActing(id);
    await fetch(`/api/aipify/proactive-insights/${id}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback_type }),
    });
    setActing(null);
    void load();
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
    return <p className="text-sm text-slate-600">{labels.accessDenied}</p>;
  }

  const empty = !data?.has_insights;
  const newInsights = data?.insights?.filter((i) => i.status === "new") ?? [];

  return (
    <div className="space-y-8">
      <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      {data?.privacy_note ? <p className="text-sm text-slate-600">{labels.privacyNote}</p> : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <Link href="/app/companion/context"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">
            {labels.emptyCta}
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <ScoreCard label={labels.dashboard.healthScore} value={data?.insight_health_score ?? 0} />
          <ScoreCard label={labels.dashboard.activeInsights} value={data?.active_insights_count ?? 0} />
          <ScoreCard label={labels.dashboard.highPriority} value={data?.high_priority_count ?? 0} />
          <ScoreCard label={labels.dashboard.newInsights} value={data?.new_insights_count ?? 0} />
          <ScoreCard label={labels.dashboard.reviewed} value={data?.reviewed_count ?? 0} />
          <ScoreCard label={labels.dashboard.impactScore} value={data?.impact_score ?? 0} />
        </section>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {INSIGHT_CATEGORY_KEYS.map((k) => (
            <option key={k} value={k}>{labels.categories[k] ?? k}</option>
          ))}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {(["critical", "high", "medium", "low", "informational"] as const).map((p) => (
            <option key={p} value={p}>{labels.priorities[p]}</option>
          ))}
        </select>
        <select value={confidence} onChange={(e) => setConfidence(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.confidence}</option>
          {(["very_high", "high", "medium", "low", "experimental"] as const).map((c) => (
            <option key={c} value={c}>{labels.confidenceLevels[c]}</option>
          ))}
        </select>
        <select value={impact} onChange={(e) => setImpact(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.impact}</option>
          {(["major", "moderate", "minor", "informational"] as const).map((i) => (
            <option key={i} value={i}>{labels.impactLevels[i]}</option>
          ))}
        </select>
        <input value={department} onChange={(e) => setDepartment(e.target.value)}
          placeholder={labels.filters.department}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.all}</option>
          {(["new", "reviewed", "dismissed", "escalated", "archived"] as const).map((s) => (
            <option key={s} value={s}>{labels.statuses[s]}</option>
          ))}
        </select>
      </section>

      {newInsights.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.newInsights}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {newInsights.map((ins) => (
              <InsightCard key={ins.id} insight={ins} labels={labels}
                acting={acting === ins.id}
                onReview={(a) => void review(ins.id, a)}
                onFeedback={(f) => void feedback(ins.id, f)} />
            ))}
          </div>
        </section>
      ) : null}

      {(data?.insights?.length ?? 0) > newInsights.length ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.activeInsights}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.insights!.filter((i) => i.status !== "new").map((ins) => (
              <InsightCard key={ins.id} insight={ins} labels={labels}
                acting={acting === ins.id}
                onReview={(a) => void review(ins.id, a)}
                onFeedback={(f) => void feedback(ins.id, f)} />
            ))}
          </div>
        </section>
      ) : null}

      {(data?.timeline?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.timeline}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data!.timeline!.map((e) => (
              <li key={e.id}>{e.description} · {new Date(e.created_at).toLocaleDateString()}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(data?.usage_examples?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.usageExamples}</h2>
          <ul className="mt-2 space-y-2 text-sm italic text-slate-700">
            {data!.usage_examples!.map((ex, i) => <li key={i}>{ex}</li>)}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatAre}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatAreAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoAction}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoActionAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.howGenerated}</dt><dd className="mt-1 text-slate-600">{labels.faq.howGeneratedAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-indigo-700">{value}</p>
    </div>
  );
}

function InsightCard({
  insight, labels, acting, onReview, onFeedback,
}: {
  insight: ProactiveInsightRecord;
  labels: CompanionProactiveInsightsEngineLabels;
  acting: boolean;
  onReview: (action: string) => void;
  onFeedback: (type: string) => void;
}) {
  const lowConfidence = insight.confidence === "low" || insight.confidence === "experimental";
  return (
    <article className={`rounded-xl border bg-white p-5 shadow-sm ${lowConfidence ? "border-amber-200" : "border-slate-200"}`}>
      <h3 className="font-semibold text-slate-900">{insight.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{insight.observation}</p>
      <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 text-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">{labels.dashboard.whyMatters}</p>
        <p className="mt-1 text-slate-800">{insight.why_it_matters}</p>
      </div>
      {insight.why_generated ? (
        <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.whyGenerated}</p>
          <p className="mt-1 text-slate-700">{insight.why_generated}</p>
        </div>
      ) : null}
      {insight.data_sources ? (
        <p className="mt-2 text-xs text-slate-500"><span className="font-medium">{labels.dashboard.dataSources}: </span>{insight.data_sources}</p>
      ) : null}
      {insight.pattern_type ? (
        <p className="mt-1 text-xs text-slate-500"><span className="font-medium">{labels.dashboard.patternDetection}: </span>{labels.patterns[insight.pattern_type] ?? insight.pattern_type}</p>
      ) : null}
      {insight.suggested_review ? (
        <p className="mt-2 text-sm text-indigo-800"><span className="font-medium">{labels.card.suggestedReview}: </span>{insight.suggested_review}</p>
      ) : null}
      <dl className="mt-3 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.card.priority}: </dt>
          <dd className="inline">{labels.priorities[insight.priority as keyof typeof labels.priorities] ?? insight.priority}</dd></div>
        <div><dt className="inline">{labels.card.confidence}: </dt>
          <dd className="inline">{labels.confidenceLevels[insight.confidence as keyof typeof labels.confidenceLevels] ?? insight.confidence}</dd></div>
        <div><dt className="inline">{labels.card.impact}: </dt>
          <dd className="inline">{labels.impactLevels[insight.impact_level as keyof typeof labels.impactLevels] ?? insight.impact_level}</dd></div>
        <div><dt className="inline">{labels.card.status}: </dt>
          <dd className="inline">{labels.statuses[insight.status as keyof typeof labels.statuses] ?? insight.status}</dd></div>
      </dl>
      {insight.status === "new" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={acting} onClick={() => onReview("review")}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
            {labels.actions.review}
          </button>
          <button type="button" disabled={acting} onClick={() => onReview("dismiss")}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50">
            {labels.actions.dismiss}
          </button>
          <button type="button" disabled={acting} onClick={() => onReview("archive")}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50">
            {labels.actions.archive}
          </button>
        </div>
      ) : null}
      <div className="mt-3 border-t border-slate-100 pt-3">
        <p className="text-xs font-medium text-slate-500">{labels.feedback.title}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["helpful", "not_helpful", "interesting", "already_known", "not_relevant"] as const).map((f) => (
            <button key={f} type="button" disabled={acting} onClick={() => onFeedback(f)}
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 disabled:opacity-50">
              {labels.feedback[f === "not_helpful" ? "notHelpful" : f === "already_known" ? "alreadyKnown" : f === "not_relevant" ? "notRelevant" : f === "interesting" ? "interesting" : "helpful"]}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
