import Link from "next/link";
import { ArrowRight } from "lucide-react";
import KnowledgeNestedNav, { buildKnowledgeBreadcrumbs } from "@/components/marketing/knowledge/KnowledgeNestedNav";
import CategoryResourcesSection from "@/components/marketing/knowledge/CategoryResourcesSection";
import { KnowledgeCategoryCard } from "@/components/marketing/knowledge/KnowledgeCategoryCard";
import KnowledgeIcon from "@/components/marketing/knowledge/KnowledgeIcon";
import PublicCTA from "@/components/marketing/public/PublicCTA";
import type { KnowledgePageRedesignLabels } from "@/components/marketing/knowledge/types";
import type { KnowledgeArticleSummary } from "@/components/marketing/knowledge/types";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { PublicKnowledgeCategoryDetail } from "@/lib/marketing/knowledge/types";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";

type KnowledgeCategoryDetailPageProps = {
  category: PublicKnowledgeCategoryDetail;
  nested: KnowledgePageRedesignLabels["nested"];
  articles: KnowledgeArticleSummary[];
};

function CategoryFeaturedResources({
  category,
  articles,
}: {
  category: PublicKnowledgeCategoryDetail;
  articles: KnowledgeArticleSummary[];
}) {
  const featured = category.featuredArticleSlugs
    .map((slug) => articles.find((article) => article.slug === slug))
    .filter((article): article is KnowledgeArticleSummary => article !== undefined);

  if (featured.length === 0) return null;

  const [primary, ...secondary] = featured;
  const { pageLabels } = category;

  return (
    <section aria-labelledby="category-featured-title" className={PublicMarketingClasses.section}>
      <div className={KNOWLEDGE_CONTAINER}>
        <h2 id="category-featured-title" className={PublicMarketingClasses.sectionHeading}>
          {pageLabels.featuredTitle}
        </h2>
        {pageLabels.featuredSubtitle ? (
          <p className={`mt-3 ${PublicMarketingClasses.sectionSubtitle}`}>{pageLabels.featuredSubtitle}</p>
        ) : null}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Link
            href={`/knowledge/articles/${primary.slug}`}
            className="group flex flex-col rounded-2xl border border-aipify-border bg-gradient-to-br from-violet-50/80 to-white p-8 shadow-sm transition hover:border-aipify-companion/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus lg:row-span-2"
          >
            <span className={PublicMarketingClasses.cardLabel}>{pageLabels.readArticle}</span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-aipify-text group-hover:text-aipify-companion">
              {primary.title}
            </h3>
            <p className="mt-4 flex-1 text-base leading-relaxed text-aipify-text-secondary">
              {primary.metaDescription}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-aipify-companion">
              {pageLabels.readArticle}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>

          <div className="flex flex-col gap-6">
            {secondary.map((article) => (
              <Link
                key={article.slug}
                href={`/knowledge/articles/${article.slug}`}
                className="group flex flex-col rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm transition hover:border-aipify-companion/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
              >
                <h3 className={`${PublicMarketingClasses.cardTitle} group-hover:text-aipify-companion`}>
                  {article.title}
                </h3>
                <p className={`${PublicMarketingClasses.cardBody} line-clamp-3`}>{article.metaDescription}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-aipify-companion">
                  {pageLabels.readArticle}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function KnowledgeCategoryDetailPage({
  category,
  nested,
  articles,
}: KnowledgeCategoryDetailPageProps) {
  const resourceCountLabel =
    category.resourceCount > 0
      ? category.pageLabels.resourceCount.replace("{count}", String(category.resourceCount))
      : null;

  return (
    <>
      <KnowledgeNestedNav
        nested={nested}
        breadcrumbs={buildKnowledgeBreadcrumbs(nested, [{ label: category.name }])}
      />

      <section className="border-b border-aipify-border bg-aipify-surface">
        <div className={`${KNOWLEDGE_CONTAINER} pb-12 pt-4 sm:pb-14`}>
          <div className="max-w-3xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-aipify-accent-soft">
              <KnowledgeIcon categoryId={category.id} className="h-6 w-6 text-aipify-companion" />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-aipify-companion">
              {category.name}
            </p>
            <h1 className={`mt-2 ${PublicMarketingClasses.pageTitle}`}>{category.headline}</h1>
            <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{category.introduction}</p>
            {resourceCountLabel ? (
              <p className="mt-4 text-sm font-medium text-aipify-text-muted">{resourceCountLabel}</p>
            ) : null}
          </div>
        </div>
      </section>

      {category.topics.length > 0 ? (
        <section aria-labelledby="category-topics-title" className={PublicMarketingClasses.section}>
          <div className={KNOWLEDGE_CONTAINER}>
            <h2 id="category-topics-title" className={PublicMarketingClasses.sectionHeading}>
              {category.pageLabels.topicsTitle}
            </h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.topics.map((topic) => (
                <li
                  key={topic.id}
                  className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm"
                >
                  <h3 className={PublicMarketingClasses.cardTitle}>{topic.title}</h3>
                  <p className={`${PublicMarketingClasses.cardBody} mt-2 text-sm`}>{topic.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <CategoryFeaturedResources category={category} articles={articles} />

      <CategoryResourcesSection labels={category.pageLabels} articles={articles} />

      {category.relatedCategories.length > 0 ? (
        <section aria-labelledby="category-related-title" className={PublicMarketingClasses.section}>
          <div className={KNOWLEDGE_CONTAINER}>
            <h2 id="category-related-title" className={PublicMarketingClasses.sectionHeading}>
              {category.pageLabels.relatedTitle}
            </h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.relatedCategories.map((related) => (
                <li key={related.id}>
                  <KnowledgeCategoryCard
                    category={related}
                    exploreLabel={category.pageLabels.viewCategory}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <div className="border-t border-aipify-border">
        <PublicCTA
          title={category.headline}
          subtitle={category.introduction}
          primaryLabel={category.cta.primary}
          primaryHref={category.cta.primaryHref}
          secondaryLabel={category.cta.secondary}
          secondaryHref={category.cta.secondaryHref}
          analyticsPrimary={`knowledge_category_${category.id}_primary`}
          analyticsSecondary={`knowledge_category_${category.id}_secondary`}
        />
        <div className={`${PublicMarketingClasses.container} pb-14 text-center sm:pb-16`}>
          <Link
            href="/knowledge"
            className="text-sm font-semibold text-aipify-accent hover:text-aipify-companion"
            {...marketingDataAttr("cta_click", `knowledge_category_${category.id}_back`)}
          >
            ← {nested.backToKnowledge}
          </Link>
        </div>
      </div>
    </>
  );
}
