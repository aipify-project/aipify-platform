import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";
import type { KnowledgeArticleSummary, KnowledgePageRedesignLabels } from "./types";

type FeaturedKnowledgeProps = {
  labels: KnowledgePageRedesignLabels["featured"];
  articleSummaries: KnowledgeArticleSummary[];
};

export default function FeaturedKnowledge({ labels, articleSummaries }: FeaturedKnowledgeProps) {
  const featured = labels.featuredSlugs
    .map((slug) => articleSummaries.find((article) => article.slug === slug))
    .filter((article): article is KnowledgeArticleSummary => article !== undefined);

  if (featured.length === 0) return null;

  const [primary, ...secondary] = featured;

  return (
    <section aria-labelledby="featured-knowledge-title" className={PublicMarketingClasses.section}>
      <div className={KNOWLEDGE_CONTAINER}>
        <h2 id="featured-knowledge-title" className={PublicMarketingClasses.sectionHeading}>
          {labels.title}
        </h2>
        {labels.subtitle ? <p className={`mt-3 ${PublicMarketingClasses.sectionSubtitle}`}>{labels.subtitle}</p> : null}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Link
            href={`/knowledge/articles/${primary.slug}`}
            className="group flex flex-col rounded-2xl border border-aipify-border bg-gradient-to-br from-violet-50/80 to-white p-8 shadow-sm transition hover:border-aipify-companion/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus lg:row-span-2"
          >
            <span className={PublicMarketingClasses.cardLabel}>{labels.readArticle}</span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-aipify-text group-hover:text-aipify-companion">
              {primary.title}
            </h3>
            <p className="mt-4 flex-1 text-base leading-relaxed text-aipify-text-secondary">{primary.metaDescription}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-aipify-companion">
              {labels.readArticle}
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
                <h3 className={`${PublicMarketingClasses.cardTitle} group-hover:text-aipify-companion`}>{article.title}</h3>
                <p className={`${PublicMarketingClasses.cardBody} line-clamp-3`}>{article.metaDescription}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-aipify-companion">
                  {labels.readArticle}
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
