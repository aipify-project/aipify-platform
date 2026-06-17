"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  RECOMMENDATION_CATEGORY_KEYS,
  parseCompanionRecommendationsDashboard,
  type CompanionRecommendationEngineLabels,
  type CompanionRecommendationsDashboard,
  type RecommendationRecord,
} from "@/lib/aipify/companion-recommendation-engine";

type Props = { labels: CompanionRecommendationEngineLabels };

export function CompanionRecommendationEngineDashboardPanel({ labels }: Props) {
  const [data, setData] = useState<CompanionRecommendationsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [confidence, setConfidence] = useState("");
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
    if (department) p.set("department", department);
    if (status) p.set("status", status);
    if (search.trim()) p.set("search", search.trim());

    const res = await fetch(`/api/aipify/recommendations?${p}`);
    if (res.ok) {
      setData(parseCompanionRecommendationsDashboard(await res.json()));
    } else {
      const b = (await res.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [category, priority, confidence, department, status, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function accept(id: string) {
    setActing(id);
    await fetch(`/api/aipify/recommendations/${id}/accept`, { method: "POST" });
    setActing(null);
    void load();
  }

  async function dismiss(id: string) {
    setActing(id);
    await fetch(`/api/aipify/recommendations/${id}/dismiss`, { method: "POST" });
    setActing(null);
    void load();
  }

  async function feedback(id: string, feedback_type: string) {
    setActing(id);
    await fetch(`/api/aipify/recommendations/${id}/feedback`, {
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

  const empty = !data?.has_recommendations;
  const active = data?.recommendations?.filter((r) => r.status === "active") ?? [];

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
          <ScoreCard label={labels.dashboard.healthScore} value={data?.recommendation_health_score ?? 0} />
          <ScoreCard label={labels.dashboard.activeRecommendations} value={data?.active_recommendations_count ?? 0} />
          <ScoreCard label={labels.dashboard.highPriority} value={data?.high_priority_count ?? 0} />
          <ScoreCard label={labels.dashboard.accepted} value={data?.accepted_count ?? 0} />
          <ScoreCard label={labels.dashboard.dismissed} value={data?.dismissed_count ?? 0} />
          <ScoreCard label={labels.dashboard.accuracyScore} value={data?.accuracy_score ?? 0} suffix="%" />
        </section>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {RECOMMENDATION_CATEGORY_KEYS.map((k) => (
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
        <input value={department} onChange={(e) => setDepartment(e.target.value)}
          placeholder={labels.filters.department}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.all}</option>
          {(["active", "accepted", "dismissed", "saved", "completed", "archived"] as const).map((s) => (
            <option key={s} value={s}>{labels.statuses[s]}</option>
          ))}
        </select>
      </section>

      {active.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.activeRecommendations}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {active.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} labels={labels}
                acting={acting === rec.id}
                onAccept={() => void accept(rec.id)}
                onDismiss={() => void dismiss(rec.id)}
                onFeedback={(t) => void feedback(rec.id, t)} />
            ))}
          </div>
        </section>
      ) : null}

      {(data?.recommendations?.length ?? 0) > active.length ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.actions.review}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.recommendations!.filter((r) => r.status !== "active").map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} labels={labels}
                acting={acting === rec.id} readOnly
                onAccept={() => void accept(rec.id)}
                onDismiss={() => void dismiss(rec.id)}
                onFeedback={(t) => void feedback(rec.id, t)} />
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
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.decisions}</dt><dd className="mt-1 text-slate-600">{labels.faq.decisionsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.explanations}</dt><dd className="mt-1 text-slate-600">{labels.faq.explanationsAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ScoreCard({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-indigo-700">{value}{suffix}</p>
    </div>
  );
}

function RecommendationCard({
  rec, labels, acting, readOnly, onAccept, onDismiss, onFeedback,
}: {
  rec: RecommendationRecord;
  labels: CompanionRecommendationEngineLabels;
  acting: boolean;
  readOnly?: boolean;
  onAccept: () => void;
  onDismiss: () => void;
  onFeedback: (type: string) => void;
}) {
  const lowConfidence = rec.confidence === "low" || rec.confidence === "experimental";
  return (
    <article className={`rounded-xl border bg-white p-5 shadow-sm ${lowConfidence ? "border-amber-200" : "border-slate-200"}`}>
      <h3 className="font-semibold text-slate-900">{rec.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{rec.description}</p>
      <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 text-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">{labels.dashboard.whySeeing}</p>
        <p className="mt-1 text-slate-800">{rec.reason}</p>
      </div>
      {rec.suggested_action ? (
        <p className="mt-2 text-sm text-indigo-800"><span className="font-medium">{labels.card.suggestedAction}: </span>{rec.suggested_action}</p>
      ) : null}
      <dl className="mt-3 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.card.priority}: </dt>
          <dd className="inline">{labels.priorities[rec.priority as keyof typeof labels.priorities] ?? rec.priority}</dd></div>
        <div><dt className="inline">{labels.card.confidence}: </dt>
          <dd className="inline">{labels.confidenceLevels[rec.confidence as keyof typeof labels.confidenceLevels] ?? rec.confidence}</dd></div>
        <div><dt className="inline">{labels.card.source}: </dt>
          <dd className="inline">{labels.sources[rec.source_key] ?? rec.source_key}</dd></div>
        <div><dt className="inline">{labels.card.status}: </dt>
          <dd className="inline">{labels.statuses[rec.status as keyof typeof labels.statuses] ?? rec.status}</dd></div>
      </dl>
      {!readOnly && rec.status === "active" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={acting} onClick={onAccept}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
            {labels.actions.accept}
          </button>
          <button type="button" disabled={acting} onClick={onDismiss}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50">
            {labels.actions.dismiss}
          </button>
        </div>
      ) : null}
      <div className="mt-3 border-t border-slate-100 pt-3">
        <p className="text-xs font-medium text-slate-500">{labels.feedback.title}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["helpful", "not_helpful", "already_completed", "not_relevant"] as const).map((f) => (
            <button key={f} type="button" disabled={acting} onClick={() => onFeedback(f)}
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 disabled:opacity-50">
              {labels.feedback[f === "not_helpful" ? "notHelpful" : f === "already_completed" ? "alreadyCompleted" : f === "not_relevant" ? "notRelevant" : "helpful"]}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
