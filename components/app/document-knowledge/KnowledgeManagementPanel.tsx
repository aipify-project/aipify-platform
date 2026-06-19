"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseGlobalSearchResult,
  parseKnowledgeManagementCenter,
  type KnowledgeManagementCenter,
  type KnowledgeManagementLabels,
} from "@/lib/document-knowledge";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

export function KnowledgeManagementPanel({ labels }: { labels: KnowledgeManagementLabels }) {
  const [center, setCenter] = useState<KnowledgeManagementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof parseGlobalSearchResult>>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/knowledge");
    if (res.ok) setCenter(parseKnowledgeManagementCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runSearch() {
    if (!searchQuery.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/app/knowledge/search?q=${encodeURIComponent(searchQuery.trim())}`);
    if (res.ok) setSearchResults(parseGlobalSearchResult(await res.json()));
    setBusy(false);
  }

  if (loading && !center) {
    return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.philosophy ? <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p> : null}
        {center.documents_route ? (
          <Link href={center.documents_route} className="mt-3 inline-block text-sm text-indigo-700 hover:underline">{labels.documentsLink}</Link>
        ) : null}
      </div>

      {center.overview ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <StatCard label={labels.published} value={center.overview.published_articles} />
          <StatCard label={labels.awaitingReview} value={center.overview.drafts_awaiting_review} highlight="indigo" />
          <StatCard label={labels.faqs} value={center.overview.faq_count} />
          <StatCard label={labels.knowledgeGaps} value={center.overview.knowledge_gaps} highlight="amber" />
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={labels.searchPlaceholder} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button type="button" disabled={busy || !searchQuery.trim()} onClick={() => void runSearch()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.search}</button>
      </div>

      {searchResults ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.search}: &ldquo;{searchResults.query}&rdquo;</h2>
          {(searchResults.knowledge_articles ?? []).map((a, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="font-semibold text-gray-900">{String(a.title ?? a.question ?? "")}</p>
              <p className="mt-1 text-sm text-gray-600 line-clamp-3">{String(a.summary ?? a.content ?? a.answer ?? "")}</p>
              {a.category_slug ? <p className="mt-2 text-xs text-gray-500">{String(a.category_slug)}</p> : null}
            </div>
          ))}
          {(searchResults.documents ?? []).map((d) => (
            <div key={d.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
              <p className="text-xs font-medium text-emerald-800">Document</p>
              <p className="font-semibold text-gray-900">{d.title}</p>
              <p className="mt-1 text-sm text-gray-600">{d.description}</p>
            </div>
          ))}
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">{labels.published}</h2>
        {(center.published_list ?? []).length === 0 ? (
          <EmptyState labels={labels} />
        ) : (
          center.published_list?.map((a, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="font-semibold text-gray-900">{String(a.title ?? "")}</p>
              {a.summary ? <p className="mt-1 text-sm text-gray-600">{String(a.summary)}</p> : null}
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                {a.category_slug ? <span>{String(a.category_slug)}</span> : null}
                {a.view_count != null ? <span>{labels.mostViewed}: {String(a.view_count)}</span> : null}
              </div>
            </div>
          ))
        )}
      </section>

      {(center.awaiting_review ?? []).length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.awaitingReview}</h2>
          {center.awaiting_review?.map((a, i) => (
            <div key={i} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
              <p className="font-semibold text-gray-900">{String(a.title ?? "")}</p>
              <p className="mt-1 text-xs text-gray-500">{String(a.status ?? "")}</p>
            </div>
          ))}
        </section>
      ) : null}

      {(center.categories ?? []).length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">{labels.categories}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.categories?.map((c) => (
              <div key={c.slug} className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="font-medium text-gray-900">{c.name}</h3>
                {c.description ? <p className="mt-1 text-sm text-gray-600">{c.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {(center.outdated_alerts ?? []).length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.outdated}</h2>
          {center.outdated_alerts?.map((a, i) => (
            <div key={i} className="rounded-lg border border-amber-200 bg-amber-50/40 p-3 text-sm">{String(a.title ?? "")}</div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: "amber" | "indigo" }) {
  const cls = highlight === "amber" ? "border-amber-100 bg-amber-50/40" : highlight === "indigo" ? "border-indigo-100 bg-indigo-50/40" : "border-gray-200 bg-white";
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function EmptyState({ labels }: { labels: KnowledgeManagementLabels }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <p className="font-medium text-gray-900">{labels.noArticles}</p>
      <p className="mt-1 text-sm text-gray-600">{labels.noArticlesHint}</p>
    </div>
  );
}
