import Link from "next/link";
import KnowledgeNestedNav, { buildKnowledgeBreadcrumbs } from "@/components/marketing/knowledge/KnowledgeNestedNav";
import KnowledgeCTA from "@/components/marketing/knowledge/KnowledgeCTA";
import type { KnowledgePageRedesignLabels } from "@/components/marketing/knowledge/types";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { PublicKnowledgeIndustry } from "@/lib/marketing/knowledge/types";

type ArticleSummary = { slug: string; title: string; metaDescription: string };

type PublicKnowledgeIndustryPageContentProps = {
  industry: PublicKnowledgeIndustry;
  nested: KnowledgePageRedesignLabels["nested"];
  cta: KnowledgePageRedesignLabels["cta"];
  articles: ArticleSummary[];
};

export default function PublicKnowledgeIndustryPageContent({
  industry,
  nested,
  cta,
  articles,
}: PublicKnowledgeIndustryPageContentProps) {
  return (
    <>
      <KnowledgeNestedNav
        nested={nested}
        breadcrumbs={buildKnowledgeBreadcrumbs(nested, [{ label: industry.name }])}
      />

      <div className="mx-auto max-w-[77.5rem] px-4 pb-12 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h1 className={PublicMarketingClasses.pageTitle}>{industry.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{industry.description}</p>
        </header>

        <ul className="mt-10 divide-y divide-aipify-border rounded-2xl border border-aipify-border bg-aipify-surface shadow-sm">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/knowledge/articles/${article.slug}`}
                className="block px-5 py-4 transition hover:bg-aipify-surface-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-aipify-focus"
              >
                <h2 className="font-medium text-aipify-text">{article.title}</h2>
                <p className="mt-1 text-sm text-aipify-text-secondary">{article.metaDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <KnowledgeCTA cta={cta} />
    </>
  );
}
