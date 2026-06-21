"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import KnowledgeArticleCard from "./KnowledgeArticleCard";
import type { KnowledgeArticleSummary } from "./types";
import type { PublicKnowledgeCategoryPageLabels } from "@/lib/marketing/knowledge/types";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";

type KnowledgeTypeFilter = "all" | "hub" | "industry" | "article";
type KnowledgeSort = "title-asc" | "title-desc";

type CategoryResourcesSectionProps = {
  labels: PublicKnowledgeCategoryPageLabels;
  articles: KnowledgeArticleSummary[];
};

function filterCategoryArticles(
  articles: KnowledgeArticleSummary[],
  query: string,
  typeFilter: KnowledgeTypeFilter,
  sort: KnowledgeSort
): KnowledgeArticleSummary[] {
  const normalizedQuery = query.trim().toLowerCase();

  let result = articles.filter((article) => {
    if (typeFilter === "hub" && !article.hubId) return false;
    if (typeFilter === "industry" && !article.industryId) return false;
    if (typeFilter === "article" && (article.hubId || article.industryId)) return false;

    if (!normalizedQuery) return true;
    const haystack = `${article.title} ${article.metaDescription}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  result = [...result].sort((a, b) => {
    const cmp = a.title.localeCompare(b.title);
    return sort === "title-asc" ? cmp : -cmp;
  });

  return result;
}

export default function CategoryResourcesSection({ labels, articles }: CategoryResourcesSectionProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<KnowledgeTypeFilter>("all");
  const [sort, setSort] = useState<KnowledgeSort>("title-asc");
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredArticles = useMemo(
    () => filterCategoryArticles(articles, query, typeFilter, sort),
    [articles, query, typeFilter, sort]
  );

  const resultsLabel = labels.resultsCount.replace("{count}", String(filteredArticles.length));

  const filterControls = (
    <>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-aipify-text">{labels.typeLabel}</span>
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as KnowledgeTypeFilter)}
          className={`${PublicMarketingClasses.input} py-2.5 text-sm`}
        >
          <option value="all">{labels.allTypes}</option>
          <option value="hub">{labels.resourceTypes.hub}</option>
          <option value="industry">{labels.resourceTypes.industry}</option>
          <option value="article">{labels.resourceTypes.article}</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-aipify-text">{labels.sortLabel}</span>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as KnowledgeSort)}
          className={`${PublicMarketingClasses.input} py-2.5 text-sm`}
        >
          <option value="title-asc">{labels.sortTitleAsc}</option>
          <option value="title-desc">{labels.sortTitleDesc}</option>
        </select>
      </label>
    </>
  );

  return (
    <section aria-labelledby="category-resources-title" className={PublicMarketingClasses.section}>
      <div className={KNOWLEDGE_CONTAINER}>
        <h2 id="category-resources-title" className={PublicMarketingClasses.sectionHeading}>
          {labels.allResourcesTitle}
        </h2>

        <div className="mt-8 space-y-6">
          <div className="relative max-w-2xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-aipify-text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.searchPlaceholder}
              aria-label={labels.searchAriaLabel}
              className={`${PublicMarketingClasses.input} w-full py-3 pl-12 pr-4 text-base`}
            />
          </div>

          <div className="rounded-2xl border border-aipify-border bg-aipify-surface-muted/40 px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-medium text-aipify-text">{resultsLabel}</p>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2.5 text-sm font-medium text-aipify-text lg:hidden"
                onClick={() => setMobileOpen((open) => !open)}
                aria-expanded={mobileOpen}
                aria-controls="category-filter-drawer"
              >
                {mobileOpen ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                )}
                {mobileOpen ? labels.closeFilters : labels.openFilters}
              </button>
              <div className="hidden items-end gap-4 lg:flex">{filterControls}</div>
            </div>
            {mobileOpen ? (
              <div id="category-filter-drawer" className="mt-4 grid gap-4 border-t border-aipify-border pt-4 lg:hidden">
                {filterControls}
              </div>
            ) : null}
          </div>

          {filteredArticles.length === 0 ? (
            <p className="text-center text-aipify-text-secondary">{labels.emptyArticles}</p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2">
              {filteredArticles.map((article) => (
                <li key={article.slug}>
                  <KnowledgeArticleCard article={article} readLabel={labels.readArticle} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
