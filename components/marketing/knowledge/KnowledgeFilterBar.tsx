"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { PublicKnowledgeCategory } from "@/lib/marketing/knowledge/types";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { useKnowledgeHub, type KnowledgeSort, type KnowledgeTypeFilter } from "./KnowledgeHubContext";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";
import type { KnowledgePageRedesignLabels } from "./types";

type KnowledgeFilterBarProps = {
  labels: KnowledgePageRedesignLabels["filterBar"];
  categories: PublicKnowledgeCategory[];
};

export default function KnowledgeFilterBar({ labels, categories }: KnowledgeFilterBarProps) {
  const { categoryFilter, setCategoryFilter, typeFilter, setTypeFilter, sort, setSort, filteredArticles } =
    useKnowledgeHub();
  const [mobileOpen, setMobileOpen] = useState(false);

  const resultsLabel = labels.resultsCount.replace("{count}", String(filteredArticles.length));

  const filterControls = (
    <>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-aipify-text">{labels.categoryLabel}</span>
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className={`${PublicMarketingClasses.input} py-2.5 text-sm`}
        >
          <option value="all">{labels.allCategories}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-aipify-text">{labels.typeLabel}</span>
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as KnowledgeTypeFilter)}
          className={`${PublicMarketingClasses.input} py-2.5 text-sm`}
        >
          <option value="all">{labels.allTypes}</option>
          <option value="hub">{labels.types.hub}</option>
          <option value="industry">{labels.types.industry}</option>
          <option value="article">{labels.types.article}</option>
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
    <section aria-labelledby="knowledge-filter-title" className="border-y border-aipify-border bg-aipify-surface-muted/40">
      <div className={`${KNOWLEDGE_CONTAINER} py-6`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="knowledge-filter-title" className="text-lg font-semibold text-aipify-text">
              {resultsLabel}
            </h2>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2.5 text-sm font-medium text-aipify-text lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="knowledge-filter-drawer"
          >
            {mobileOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />}
            {mobileOpen ? labels.closeFilters : labels.openFilters}
          </button>

          <div className="hidden items-end gap-4 lg:flex">{filterControls}</div>
        </div>

        {mobileOpen ? (
          <div id="knowledge-filter-drawer" className="mt-4 grid gap-4 border-t border-aipify-border pt-4 lg:hidden">
            {filterControls}
          </div>
        ) : null}
      </div>
    </section>
  );
}
