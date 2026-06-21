"use client";

import type { PublicKnowledgeCategory } from "@/lib/marketing/knowledge/types";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { useKnowledgeHub } from "./KnowledgeHubContext";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";
import { ArticleListing } from "./KnowledgeArticleCard";
import type { KnowledgePageRedesignLabels } from "./types";

type KnowledgeArticleListingSectionProps = {
  labels: KnowledgePageRedesignLabels["articleListing"];
  featuredSlugs: string[];
  categories: PublicKnowledgeCategory[];
};

export default function KnowledgeArticleListingSection({
  labels,
  featuredSlugs,
  categories,
}: KnowledgeArticleListingSectionProps) {
  const { filteredArticles, query, categoryFilter, typeFilter } = useKnowledgeHub();
  const isFiltered = query.trim().length > 0 || categoryFilter !== "all" || typeFilter !== "all";

  return (
    <section aria-labelledby="article-listing-title" className={PublicMarketingClasses.section}>
      <div className={KNOWLEDGE_CONTAINER}>
        <h2 id="article-listing-title" className="sr-only">
          {labels.all}
        </h2>
        <ArticleListing
          labels={labels}
          articles={filteredArticles}
          featuredSlugs={featuredSlugs}
          categories={categories}
          showGroups={!isFiltered}
        />
      </div>
    </section>
  );
}
