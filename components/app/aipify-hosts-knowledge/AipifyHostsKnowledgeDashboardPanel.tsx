"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsKnowledgeArticle,
  parseAipifyHostsKnowledgeDashboard,
  parseAipifyHostsKnowledgeSearch,
  type AipifyHostsKnowledgeArticleDetail,
  type HostsKnowledgeArticleSummary,
  type HostsKnowledgeDashboard,
  type HostsKnowledgeSection,
} from "@/lib/aipify/aipify-hosts-knowledge";

type Props = {
  labels: Record<string, string>;
};

function ArticleList({
  items,
  onSelect,
  emptyTitle,
  emptyMessage,
}: {
  items: HostsKnowledgeArticleSummary[];
  onSelect: (article: HostsKnowledgeArticleSummary) => void;
  emptyTitle?: string;
  emptyMessage?: string;
}) {
  if (items.length === 0 && emptyTitle) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-6 text-center">
        <p className="text-sm font-medium text-gray-800">{emptyTitle}</p>
        {emptyMessage ? <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p> : null}
      </div>
    );
  }
  return (
    <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
      {items.map((item) => (
        <li key={item.slug}>
          <button
            type="button"
            onClick={() => onSelect(item)}
            className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-slate-50"
          >
            <span className="font-medium text-gray-900">{item.title}</span>
            {item.excerpt ? <span className="line-clamp-2 text-sm text-gray-500">{item.excerpt}</span> : null}
          </button>
        </li>
      ))}
    </ul>
  );
}

function SectionBlock({
  section,
  onSelect,
}: {
  section: HostsKnowledgeSection;
  onSelect: (article: HostsKnowledgeArticleSummary, sectionKey: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">{section.label}</h3>
      <ul className="mt-3 space-y-2">
        {section.articles.slice(0, 5).map((article) => (
          <li key={article.slug}>
            <button
              type="button"
              onClick={() => onSelect(article, section.key)}
              className="text-sm font-medium text-indigo-700 hover:text-indigo-900"
            >
              {article.title}
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function AipifyHostsKnowledgeDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsKnowledgeDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HostsKnowledgeArticleSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeArticle, setActiveArticle] = useState<AipifyHostsKnowledgeArticleDetail | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [helpfulBusy, setHelpfulBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch("/api/aipify/aipify-hosts/knowledge/dashboard");
    if (res.ok) {
      setDashboard(parseAipifyHostsKnowledgeDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openArticle = async (article: HostsKnowledgeArticleSummary, sectionKey?: string) => {
    setArticleLoading(true);
    await fetch("/api/aipify/aipify-hosts/knowledge/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "view",
        slug: article.slug,
        title: article.title,
        section_key: sectionKey,
      }),
    });
    const res = await fetch(`/api/aipify/aipify-hosts/knowledge/article?slug=${encodeURIComponent(article.slug)}`);
    setActiveArticle(parseAipifyHostsKnowledgeArticle(await res.json()));
    setArticleLoading(false);
  };

  const runSearch = async () => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const res = await fetch(`/api/aipify/aipify-hosts/knowledge/search?q=${encodeURIComponent(query.trim())}`);
    if (res.ok) {
      setSearchResults(parseAipifyHostsKnowledgeSearch(await res.json()).results);
    }
    setSearching(false);
  };

  const markHelpful = async () => {
    if (!activeArticle?.article) return;
    setHelpfulBusy(true);
    await fetch("/api/aipify/aipify-hosts/knowledge/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: activeArticle.article.slug, helpful: true }),
    });
    setActiveArticle({ ...activeArticle, user_marked_helpful: true });
    setHelpfulBusy(false);
  };

  if (loading && !dashboard) {
    return <AipifyLoader label={labels.loading} centered fullPage />;
  }

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
        <p className="text-sm font-medium text-slate-900">{dashboard.positioning}</p>
        <Link
          href="/app/aipify-hosts"
          className="mt-4 inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          {labels.backToHosts}
        </Link>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.globalSearch}</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void runSearch()}
            placeholder={labels.searchPlaceholder}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={searching}
            onClick={() => void runSearch()}
            className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 disabled:opacity-60"
          >
            {searching ? labels.searching : labels.search}
          </button>
        </div>
        {searchResults.length > 0 && (
          <div className="mt-4">
            <ArticleList items={searchResults} onSelect={(a) => void openArticle(a)} />
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.suggestedArticles}</h2>
          <ArticleList
            items={dashboard.suggested_articles}
            onSelect={(a) => void openArticle(a)}
            emptyTitle={labels.emptySuggestedTitle}
            emptyMessage={labels.emptySuggestedMessage}
          />
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.recentArticles}</h2>
          <ArticleList
            items={dashboard.recent_articles}
            onSelect={(a) => void openArticle(a)}
            emptyTitle={labels.emptyRecentTitle}
            emptyMessage={labels.emptyRecentMessage}
          />
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.popularArticles}</h2>
          <ArticleList items={dashboard.popular_articles} onSelect={(a) => void openArticle(a)} />
        </div>
      </section>

      {activeArticle?.found && activeArticle.article ? (
        <section className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
          {articleLoading ? (
            <AipifyLoader label={labels.loadingArticle} centered />
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="text-sm font-medium text-indigo-700 hover:text-indigo-900"
              >
                {labels.backToBrowse}
              </button>
              <h2 className="mt-3 text-xl font-semibold text-gray-900">{activeArticle.article.title}</h2>
              {activeArticle.article.category_name ? (
                <p className="mt-1 text-sm text-gray-500">{activeArticle.article.category_name}</p>
              ) : null}
              <div className="prose prose-sm mt-4 max-w-none text-gray-700">{activeArticle.article.body}</div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={helpfulBusy || activeArticle.user_marked_helpful}
                  onClick={() => void markHelpful()}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  {activeArticle.user_marked_helpful ? labels.markedHelpful : labels.markHelpful}
                </button>
              </div>
              {(activeArticle.related_articles?.length ?? 0) > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900">{labels.relatedArticles}</h3>
                  <ul className="mt-2 space-y-1">
                    {activeArticle.related_articles?.map((rel) => (
                      <li key={rel.slug}>
                        <button
                          type="button"
                          onClick={() => void openArticle(rel)}
                          className="text-sm text-indigo-700 hover:text-indigo-900"
                        >
                          {rel.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </section>
      ) : null}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.browseSections}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {dashboard.sections.map((section) => (
            <SectionBlock key={section.key} section={section} onSelect={(a, k) => void openArticle(a, k)} />
          ))}
        </div>
      </section>
    </div>
  );
}
