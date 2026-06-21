"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { KnowledgeArticleSummary } from "./types";

export type KnowledgeSort = "title-asc" | "title-desc";
export type KnowledgeTypeFilter = "all" | "hub" | "industry" | "article";

type KnowledgeHubContextValue = {
  query: string;
  setQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  typeFilter: KnowledgeTypeFilter;
  setTypeFilter: (type: KnowledgeTypeFilter) => void;
  sort: KnowledgeSort;
  setSort: (sort: KnowledgeSort) => void;
  filteredArticles: KnowledgeArticleSummary[];
};

const KnowledgeHubContext = createContext<KnowledgeHubContextValue | null>(null);

function filterArticles(
  articles: KnowledgeArticleSummary[],
  query: string,
  categoryFilter: string,
  typeFilter: KnowledgeTypeFilter,
  sort: KnowledgeSort,
): KnowledgeArticleSummary[] {
  const normalizedQuery = query.trim().toLowerCase();

  let result = articles.filter((article) => {
    if (categoryFilter !== "all" && article.categoryId !== categoryFilter) return false;

    if (typeFilter === "hub" && !article.hubId) return false;
    if (typeFilter === "industry" && !article.industryId) return false;
    if (typeFilter === "article" && (article.hubId || article.industryId)) return false;

    if (!normalizedQuery) return true;

    const haystack = `${article.title} ${article.metaDescription} ${article.categoryId}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  result = [...result].sort((a, b) => {
    const cmp = a.title.localeCompare(b.title);
    return sort === "title-asc" ? cmp : -cmp;
  });

  return result;
}

type KnowledgeHubProviderProps = {
  children: ReactNode;
  articleSummaries: KnowledgeArticleSummary[];
};

export function KnowledgeHubProvider({ children, articleSummaries }: KnowledgeHubProviderProps) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<KnowledgeTypeFilter>("all");
  const [sort, setSort] = useState<KnowledgeSort>("title-asc");

  const filteredArticles = useMemo(
    () => filterArticles(articleSummaries, query, categoryFilter, typeFilter, sort),
    [articleSummaries, query, categoryFilter, typeFilter, sort],
  );

  const value = useMemo(
    () => ({
      query,
      setQuery,
      categoryFilter,
      setCategoryFilter,
      typeFilter,
      setTypeFilter,
      sort,
      setSort,
      filteredArticles,
    }),
    [query, categoryFilter, typeFilter, sort, filteredArticles],
  );

  return <KnowledgeHubContext.Provider value={value}>{children}</KnowledgeHubContext.Provider>;
}

export function useKnowledgeHub() {
  const ctx = useContext(KnowledgeHubContext);
  if (!ctx) {
    throw new Error("useKnowledgeHub must be used within KnowledgeHubProvider");
  }
  return ctx;
}
