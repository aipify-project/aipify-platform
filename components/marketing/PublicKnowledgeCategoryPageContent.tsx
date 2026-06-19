import Link from "next/link";
import { MarketingCtaBand, MarketingPageHeader } from "@/components/marketing";
import type { PublicKnowledgeCategory, PublicKnowledgeHubLabels } from "@/lib/marketing/knowledge/types";
import type { MarketingCtaBandLabels } from "./MarketingCtaBand";

type ArticleSummary = { slug: string; title: string; metaDescription: string };

type PublicKnowledgeCategoryPageContentProps = {
  category: PublicKnowledgeCategory;
  labels: PublicKnowledgeHubLabels;
  articles: ArticleSummary[];
  ctaBand: MarketingCtaBandLabels;
};

export default function PublicKnowledgeCategoryPageContent({
  category,
  labels,
  articles,
  ctaBand,
}: PublicKnowledgeCategoryPageContentProps) {
  return (
    <>
      <MarketingPageHeader title={category.name} subtitle={category.description} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <nav className="text-sm text-aipify-text-muted">
          <Link href="/knowledge" className="hover:text-aipify-companion">
            {labels.title}
          </Link>
        </nav>
        <ul className="mt-8 divide-y divide-aipify-border rounded-2xl border border-aipify-border bg-aipify-surface">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link href={`/knowledge/articles/${article.slug}`} className="block px-5 py-4 transition hover:bg-aipify-surface-muted/50">
                <h2 className="font-medium text-aipify-text">{article.title}</h2>
                <p className="mt-1 text-sm text-aipify-text-secondary">{article.metaDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
