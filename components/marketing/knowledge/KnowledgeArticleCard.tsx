import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicKnowledgeCategory } from "@/lib/marketing/knowledge/types";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import KnowledgeIcon from "./KnowledgeIcon";
import type { KnowledgeArticleSummary } from "./types";

type KnowledgeArticleCardProps = {
  article: KnowledgeArticleSummary;
  categoryName?: string;
  readLabel: string;
};

export default function KnowledgeArticleCard({ article, categoryName, readLabel }: KnowledgeArticleCardProps) {
  return (
    <Link
      href={`/knowledge/articles/${article.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm transition hover:border-aipify-companion/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-aipify-accent-soft">
          <KnowledgeIcon categoryId={article.categoryId} className="h-4 w-4 text-aipify-companion" />
        </div>
        <div className="min-w-0 flex-1">
          {categoryName ? (
            <span className={PublicMarketingClasses.cardLabel}>{categoryName}</span>
          ) : null}
          <h3 className={`${PublicMarketingClasses.cardTitle} ${categoryName ? "mt-1" : ""} group-hover:text-aipify-companion`}>
            {article.title}
          </h3>
        </div>
      </div>
      <p className={`${PublicMarketingClasses.cardBody} mt-3 flex-1 text-sm line-clamp-3`}>{article.metaDescription}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-aipify-companion">
        {readLabel}
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

type ArticleListingProps = {
  labels: {
    featured: string;
    gettingStarted: string;
    latest: string;
    all: string;
    readArticle: string;
    empty: string;
  };
  articles: KnowledgeArticleSummary[];
  featuredSlugs: string[];
  categories: PublicKnowledgeCategory[];
  showGroups?: boolean;
};

function categoryNameFor(categories: PublicKnowledgeCategory[], categoryId: string): string | undefined {
  return categories.find((category) => category.id === categoryId)?.name;
}

function ArticleGroup({
  title,
  articles,
  categories,
  readLabel,
}: {
  title: string;
  articles: KnowledgeArticleSummary[];
  categories: PublicKnowledgeCategory[];
  readLabel: string;
}) {
  if (articles.length === 0) return null;

  return (
    <div className="mt-10 first:mt-0">
      <h3 className="text-lg font-semibold text-aipify-text">{title}</h3>
      <ul className="mt-5 grid gap-5 sm:grid-cols-2">
        {articles.map((article) => (
          <li key={article.slug}>
            <KnowledgeArticleCard
              article={article}
              categoryName={categoryNameFor(categories, article.categoryId)}
              readLabel={readLabel}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ArticleListing({
  labels,
  articles,
  featuredSlugs,
  categories,
  showGroups = true,
}: ArticleListingProps) {
  if (articles.length === 0) {
    return <p className="text-center text-aipify-text-secondary">{labels.empty}</p>;
  }

  if (!showGroups) {
    return (
      <ul className="grid gap-5 sm:grid-cols-2">
        {articles.map((article) => (
          <li key={article.slug}>
            <KnowledgeArticleCard
              article={article}
              categoryName={categoryNameFor(categories, article.categoryId)}
              readLabel={labels.readArticle}
            />
          </li>
        ))}
      </ul>
    );
  }

  const featuredSet = new Set(featuredSlugs);
  const featured = articles.filter((article) => featuredSet.has(article.slug));
  const gettingStarted = articles.filter(
    (article) => article.categoryId === "getting-started" && !featuredSet.has(article.slug),
  );
  const latest = articles.filter(
    (article) =>
      !featuredSet.has(article.slug) &&
      article.categoryId !== "getting-started",
  );
  const hasActiveFilter = featured.length + gettingStarted.length + latest.length < articles.length;

  if (hasActiveFilter || featured.length === 0) {
    return (
      <ArticleGroup title={labels.all} articles={articles} categories={categories} readLabel={labels.readArticle} />
    );
  }

  return (
    <>
      <ArticleGroup title={labels.featured} articles={featured} categories={categories} readLabel={labels.readArticle} />
      <ArticleGroup
        title={labels.gettingStarted}
        articles={gettingStarted}
        categories={categories}
        readLabel={labels.readArticle}
      />
      <ArticleGroup title={labels.latest} articles={latest} categories={categories} readLabel={labels.readArticle} />
    </>
  );
}
