"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { packLandingRoute } from "@/lib/aipify/business-pack-identity-engine";
import {
  CATEGORY_STYLE,
  parseBusinessPackKnowledgeCenter,
  type BusinessPackKnowledgeCenter,
  type KnowledgeArticle,
  type PackLocale,
} from "@/lib/aipify/business-pack-knowledge-engine";

type Props = {
  packKey: string;
  labels: Record<string, string>;
  initialContext?: string | null;
};

function ArticleCard({
  article,
  labels,
  expanded,
  onToggle,
  onHelpful,
  onNotHelpful,
  busy,
}: {
  article: KnowledgeArticle;
  labels: Record<string, string>;
  expanded: boolean;
  onToggle: () => void;
  onHelpful: () => void;
  onNotHelpful: () => void;
  busy: boolean;
}) {
  const categoryStyle = CATEGORY_STYLE[article.category] ?? CATEGORY_STYLE.advanced_topics;
  const categoryLabel = labels[`category_${article.category}`] ?? article.category.replace(/_/g, " ");

  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-wrap items-start justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${categoryStyle}`}>
              {categoryLabel}
            </span>
            <span className="text-xs text-gray-400">
              {labels.version} {article.version}
            </span>
          </div>
          <h3 className="mt-2 font-semibold text-gray-900">{article.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{article.summary}</p>
        </div>
        <span className="text-sm font-medium text-indigo-700">
          {expanded ? labels.hideArticle : labels.readArticle}
        </span>
      </button>
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{article.body}</p>
          <p className="mt-3 text-xs text-gray-500">
            {labels.published} {new Date(article.published_at).toLocaleDateString()} · {labels.updated}{" "}
            {new Date(article.updated_at).toLocaleDateString()}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium text-gray-600">{labels.wasHelpful}</span>
            <button
              type="button"
              disabled={busy}
              onClick={onHelpful}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-800 hover:bg-emerald-100 disabled:opacity-60"
            >
              {labels.helpful}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onNotHelpful}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {labels.notHelpful}
            </button>
            {article.helpfulness_percent != null && (
              <span className="text-xs text-gray-500">
                {article.helpfulness_percent}% {labels.helpfulRating}
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export function BusinessPackKnowledgeCenterPanel({ packKey, labels, initialContext }: Props) {
  const [center, setCenter] = useState<BusinessPackKnowledgeCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [locale, setLocale] = useState<PackLocale>("en");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ packKey, locale });
      if (search.trim()) params.set("search", search.trim());
      if (category) params.set("category", category);
      if (initialContext) params.set("context", initialContext);
      const res = await fetch(`/api/aipify/business-pack-knowledge-engine/center?${params}`);
      if (res.ok) setCenter(parseBusinessPackKnowledgeCenter(await res.json()));
    } catch {
      setCenter(null);
    }
    setLoading(false);
  }, [packKey, locale, search, category, initialContext]);

  useEffect(() => { void load(); }, [load]);

  const runAction = async (actionType: string, payload: Record<string, unknown>) => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/aipify/business-pack-knowledge-engine/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: actionType, pack_key: packKey, payload }),
    });
    const body = (await res.json()) as { message?: string; error?: string };
    if (!res.ok) setMessage(body.error ?? labels.actionFailed);
    else setMessage(body.message ?? labels.feedbackThanks);
    setBusy(false);
    await load();
  };

  const recordView = async (articleId: string) => {
    await fetch("/api/aipify/business-pack-knowledge-engine/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_type: "record_article_view",
        pack_key: packKey,
        payload: { article_id: articleId },
      }),
    });
  };

  const openArticle = (article: KnowledgeArticle) => {
    const next = expandedId === article.id ? null : article.id;
    setExpandedId(next);
    if (next) void recordView(article.id);
  };

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader label={labels.loading} />
      </div>
    );
  }

  if (!center?.found || !center.definition) {
    return (
      <PlatformEmptyState
        title={labels.notFoundTitle}
        message={labels.notFoundMessage}
        primaryAction={{ label: labels.backToMarketplace, href: "/app/marketplace/activation" }}
      />
    );
  }

  const structure = center.structure ?? center.definition.knowledge_structure ?? [];
  const articles = center.articles ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <p className="text-sm font-medium text-indigo-700">{labels.knowledgeCenter}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">{center.definition.pack_name}</h1>
          {center.principle && <p className="mt-2 text-sm text-gray-600">{center.principle}</p>}
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={packLandingRoute(packKey)} className="font-medium text-indigo-700 hover:text-indigo-900">
            {labels.viewPack}
          </Link>
          <Link href="/app/marketplace/activation" className="font-medium text-gray-600 hover:text-gray-900">
            {labels.backToMarketplace}
          </Link>
        </div>
      </header>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{message}</div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="min-w-[200px] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as PackLocale)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            aria-label={labels.language}
          >
            {(center.definition.supported_locales ?? ["en", "no", "sv", "da"]).map((loc) => (
              <option key={loc} value={loc}>{loc.toUpperCase()}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.search}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
              category === null ? "bg-indigo-100 text-indigo-800 ring-indigo-200" : "bg-gray-50 text-gray-600 ring-gray-200"
            }`}
          >
            {labels.allCategories}
          </button>
          {structure.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setCategory(item.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                category === item.key
                  ? "bg-indigo-100 text-indigo-800 ring-indigo-200"
                  : "bg-gray-50 text-gray-600 ring-gray-200"
              }`}
            >
              {labels[`category_${item.key}`] ?? item.label}
            </button>
          ))}
        </div>
      </section>

      {center.analytics && (
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            [labels.totalArticles, center.analytics.total_articles],
            [labels.totalViews, center.analytics.total_views],
            [labels.openGaps, center.analytics.open_gaps],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
              <p className="mt-1 text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </section>
      )}

      {(center.contextual_articles ?? []).length > 0 && (
        <section className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="text-sm font-semibold text-indigo-900">{labels.contextualTitle}</h2>
          <ul className="mt-3 space-y-2">
            {center.contextual_articles!.map((article) => (
              <li key={article.id}>
                <button
                  type="button"
                  onClick={() => {
                    const full = articles.find((a) => a.id === article.id);
                    if (full) void openArticle(full);
                  }}
                  className="text-sm font-medium text-indigo-800 hover:text-indigo-950"
                >
                  {article.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {labels.articles} ({articles.length})
        </h2>
        {articles.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.noResults}</p>
        ) : (
          articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              labels={labels}
              expanded={expandedId === article.id}
              onToggle={() => openArticle(article)}
              onHelpful={() => void runAction("rate_article", { article_id: article.id, helpful: true })}
              onNotHelpful={() => void runAction("rate_article", { article_id: article.id, helpful: false })}
              busy={busy}
            />
          ))
        )}
      </section>

      {center.governance_note && (
        <p className="text-center text-xs text-gray-500">{center.governance_note}</p>
      )}
    </div>
  );
}
