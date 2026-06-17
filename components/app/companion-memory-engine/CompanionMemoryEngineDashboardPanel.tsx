"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  MEMORY_SOURCE_KEYS,
  parseCompanionMemoryDashboard,
  parseCompanionMemoryReview,
  type CompanionMemoryDashboard,
  type CompanionMemoryEngineLabels,
  type MemoryReviewItem,
} from "@/lib/aipify/companion-memory-engine";

type Props = { labels: CompanionMemoryEngineLabels };

export function CompanionMemoryEngineDashboardPanel({ labels }: Props) {
  const [data, setData] = useState<CompanionMemoryDashboard | null>(null);
  const [reviewItems, setReviewItems] = useState<MemoryReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [memoryType, setMemoryType] = useState("");
  const [source, setSource] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [confidence, setConfidence] = useState("");
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (memoryType) p.set("memory_type", memoryType);
    if (source) p.set("source", source);
    if (department) p.set("department", department);
    if (status) p.set("status", status);
    if (confidence) p.set("confidence", confidence);
    if (search.trim()) p.set("search", search.trim());

    const [dashRes, reviewRes] = await Promise.all([
      fetch(`/api/aipify/memory?${p}`),
      fetch(`/api/aipify/memory/review?${p}`),
    ]);

    if (dashRes.ok) {
      setData(parseCompanionMemoryDashboard(await dashRes.json()));
    } else {
      const b = (await dashRes.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    if (reviewRes.ok) {
      setReviewItems(parseCompanionMemoryReview(await reviewRes.json()).review_items);
    }
    setLoading(false);
  }, [memoryType, source, department, status, confidence, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function reviewAction(id: string, approval_status: string) {
    setActing(id);
    await fetch(`/api/aipify/memory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approval_status }),
    });
    setActing(null);
    void load();
  }

  async function deleteMemory(id: string) {
    setActing(id);
    await fetch(`/api/aipify/memory/${id}`, { method: "DELETE" });
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

  const empty = !data?.has_memories;
  const approved = data?.memories?.filter((m) => m.approval_status === "approved") ?? [];

  return (
    <div className="space-y-8">
      <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      {data?.privacy_note ? <p className="text-sm text-slate-600">{labels.privacyNote}</p> : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <Link href="/app/companion/memory#review"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">
            {labels.emptyCta}
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard label={labels.dashboard.memoryHealthScore} value={data?.memory_health_score ?? 0} />
          <ScoreCard label={labels.dashboard.activeMemories} value={data?.active_memories_count ?? 0} />
          <ScoreCard label={labels.dashboard.approvedMemories} value={data?.approved_memories_count ?? 0} />
          <ScoreCard label={labels.dashboard.userApproved} value={approved.length} />
        </section>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={memoryType} onChange={(e) => setMemoryType(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.memoryType}</option>
          <option value="temporary">{labels.memoryTypes.temporary}</option>
          <option value="long_term">{labels.memoryTypes.long_term}</option>
        </select>
        <select value={source} onChange={(e) => setSource(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.source}</option>
          {MEMORY_SOURCE_KEYS.map((k) => (
            <option key={k} value={k}>{labels.sources[k] ?? k}</option>
          ))}
        </select>
        <input value={department} onChange={(e) => setDepartment(e.target.value)}
          placeholder={labels.filters.department}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.status}</option>
          {(["suggested", "approved", "rejected", "archived"] as const).map((s) => (
            <option key={s} value={s}>{labels.statuses[s]}</option>
          ))}
        </select>
        <select value={confidence} onChange={(e) => setConfidence(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.confidence}</option>
          {(["high", "medium", "low", "unverified"] as const).map((c) => (
            <option key={c} value={c}>{labels.confidenceLevels[c]}</option>
          ))}
        </select>
      </section>

      {!empty && (data?.recently_learned?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.recentlyLearned}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data!.recently_learned!.map((m) => (
              <li key={m.id} className="rounded-lg border border-slate-100 p-3">
                <p className="font-medium text-slate-900">{m.title}</p>
                <p className="mt-1 text-slate-600">{m.summary}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {labels.review.confidence}: {labels.confidenceLevels[m.confidence as keyof typeof labels.confidenceLevels] ?? m.confidence}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.memory_sources?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.memorySources}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {data!.memory_sources!.map((s) => (
              <article key={s.id} className="rounded-lg border border-slate-100 p-3 text-sm">
                <p className="font-medium">{labels.sources[s.source_key] ?? s.title}</p>
                <p className="text-xs text-slate-500">{s.memory_count} memories</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section id="review" className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
        <h2 className="font-semibold text-slate-900">{labels.dashboard.reviewCenter}</h2>
        {reviewItems.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
        ) : (
          <ul className="mt-3 space-y-3 text-sm">
            {reviewItems.map((item) => (
              <li key={item.id} className="rounded-lg border border-amber-100 bg-white p-4">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-slate-600">{item.summary}</p>
                <dl className="mt-2 grid gap-1 text-xs text-slate-500">
                  <div><dt className="inline">{labels.review.source}: </dt><dd className="inline">{labels.sources[item.source_key] ?? item.source_key}</dd></div>
                  <div><dt className="inline">{labels.review.reason}: </dt><dd className="inline">{item.reason}</dd></div>
                  <div><dt className="inline">{labels.review.confidence}: </dt>
                    <dd className="inline">{labels.confidenceLevels[item.confidence as keyof typeof labels.confidenceLevels] ?? item.confidence}</dd></div>
                  <div><dt className="inline">{labels.review.approvalStatus}: </dt>
                    <dd className="inline">{labels.statuses[item.approval_status as keyof typeof labels.statuses] ?? item.approval_status}</dd></div>
                </dl>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.approval_status === "suggested" ? (
                    <>
                      <button type="button" disabled={acting === item.id}
                        onClick={() => void reviewAction(item.id, "approved")}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                        {labels.review.approve}
                      </button>
                      <button type="button" disabled={acting === item.id}
                        onClick={() => void reviewAction(item.id, "rejected")}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50">
                        {labels.review.reject}
                      </button>
                    </>
                  ) : null}
                  <button type="button" disabled={acting === item.id}
                    onClick={() => void reviewAction(item.id, "archived")}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50">
                    {labels.review.archive}
                  </button>
                  <button type="button" disabled={acting === item.id}
                    onClick={() => void deleteMemory(item.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 disabled:opacity-50">
                    {labels.review.delete}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {!empty && (data?.memories?.length ?? 0) > 0 ? (
        <>
          <MemorySection title={labels.dashboard.userMemory}
            records={data!.memories!.filter((m) => m.memory_scope === "personal")} labels={labels} />
          {data?.can_organization ? (
            <MemorySection title={labels.dashboard.organizationalMemory}
              records={data!.memories!.filter((m) => ["organization", "department", "global"].includes(m.memory_scope))}
              labels={labels} />
          ) : null}
          <MemorySection title={labels.dashboard.longTermMemory}
            records={data!.memories!.filter((m) => m.memory_type === "long_term")} labels={labels} />
          <MemorySection title={labels.dashboard.temporaryMemory}
            records={data!.memories!.filter((m) => m.memory_type === "temporary")} labels={labels} />
        </>
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
            {data!.usage_examples!.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.control}</dt><dd className="mt-1 text-slate-600">{labels.faq.controlAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.delete}</dt><dd className="mt-1 text-slate-600">{labels.faq.deleteAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-indigo-700">{value}</p>
    </div>
  );
}

function MemorySection({
  title,
  records,
  labels,
}: {
  title: string;
  records: { id: string; title: string; summary: string; confidence: string; category: string }[];
  labels: CompanionMemoryEngineLabels;
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
            <p className="mt-1 text-xs text-slate-500">
              {labels.categories[r.category] ?? r.category} · {labels.confidenceLevels[r.confidence as keyof typeof labels.confidenceLevels] ?? r.confidence}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
