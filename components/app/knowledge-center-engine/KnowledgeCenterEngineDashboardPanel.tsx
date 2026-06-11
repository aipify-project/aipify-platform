"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseKnowledgeCenterEngineDashboard,
  type KnowledgeCenterEngineDashboard,
} from "@/lib/aipify/knowledge-center-engine";

type KnowledgeCenterEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "published":
      return "bg-emerald-100 text-emerald-800";
    case "review":
      return "bg-amber-100 text-amber-800";
    case "draft":
      return "bg-slate-100 text-slate-700";
    case "archived":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function ArticleList({
  items,
  emptyLabel,
  showStatus = false,
}: {
  items: KnowledgeCenterEngineDashboard["published_list"];
  emptyLabel: string;
  showStatus?: boolean;
}) {
  if (items.length === 0) return <p className="text-xs text-gray-500">{emptyLabel}</p>;
  return (
    <ul className="space-y-2">
      {items.map((a) => (
        <li key={a.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-gray-900">{a.title}</span>
            {showStatus && a.status ? (
              <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(a.status)}`}>
                {a.status}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {a.category_slug?.replace(/_/g, " ")}
            {a.view_count != null ? ` · ${a.view_count} views` : ""}
            {a.version != null ? ` · v${a.version}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function KnowledgeCenterEngineDashboardPanel({ labels }: KnowledgeCenterEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<KnowledgeCenterEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Record<string, unknown>[]>([]);
  const [searching, setSearching] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/knowledge-center-engine/dashboard");
    if (res.ok) setDashboard(parseKnowledgeCenterEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    const res = await fetch(`/api/knowledge/search?query=${encodeURIComponent(searchQuery)}&status=published`);
    if (res.ok) {
      const data = (await res.json()) as { results?: Record<string, unknown>[] };
      setSearchResults(data.results ?? []);
    }
    setSearching(false);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/aipify-core" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.aipifyCore}
        </Link>
        <Link href="/app/audit-accountability" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.auditAccountability}
        </Link>
        <Link href="/app/secure-ai-actions" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.secureAiActions}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.knowledgeEngine}</h2>
        <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.publishedArticles}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.published_articles ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.awaitingReview}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.drafts_awaiting_review ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.faqCount}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.faq_count ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.categories}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.categories.length}</p>
        </div>
      </section>

      <form onSubmit={(e) => void handleSearch(e)} className="flex flex-wrap gap-2">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="min-w-[200px] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={searching}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {labels.search}
        </button>
      </form>

      {searchResults.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.searchResults}</h2>
          <ul className="mt-3 space-y-2">
            {searchResults.map((r, i) => (
              <li key={String(r.id ?? i)} className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
                <span className="font-medium">{String(r.title ?? "")}</span>
                <p className="mt-1 text-xs text-gray-500">{String(r.summary ?? "").slice(0, 120)}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.categories.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.categoryList}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.categories.map((c) => (
              <span key={c.slug} className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-800">
                {c.name}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.publishedList}</h2>
          <div className="mt-3">
            <ArticleList items={dashboard.published_list} emptyLabel={labels.noArticles} />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.awaitingReviewList}</h2>
          <div className="mt-3">
            <ArticleList items={dashboard.awaiting_review} emptyLabel={labels.noArticles} showStatus />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.mostViewed}</h2>
          <div className="mt-3">
            <ArticleList items={dashboard.most_viewed} emptyLabel={labels.noArticles} />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.needsUpdate}</h2>
          <div className="mt-3">
            <ArticleList items={dashboard.needs_update} emptyLabel={labels.noAlerts} />
          </div>
        </div>
      </section>

      {dashboard.outdated_alerts.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-rose-800">{labels.outdatedAlerts}</h2>
          <div className="mt-3">
            <ArticleList items={dashboard.outdated_alerts} emptyLabel={labels.noAlerts} />
          </div>
        </section>
      ) : null}

      {dashboard.recent_faqs.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentFaqs}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_faqs.map((f) => (
              <li key={f.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{f.question}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(f.status)}`}>
                  {f.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
          <h2 className="text-sm font-semibold text-indigo-900">{labels.principles}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-indigo-800">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
