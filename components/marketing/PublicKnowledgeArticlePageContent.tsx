import Link from "next/link";
import MarketingInternalLinksSection from "./MarketingInternalLinksSection";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { PublicKnowledgeArticle } from "@/lib/marketing/knowledge/types";
import type { PublicKnowledgeHubLabels } from "@/lib/marketing/knowledge/types";

type PublicKnowledgeArticlePageContentProps = {
  article: PublicKnowledgeArticle;
  labels: PublicKnowledgeHubLabels;
  relatedArticleLinks: Array<{ slug: string; title: string }>;
  relatedBusinessPackLinks: Array<{ slug: string; name: string }>;
  categoryName: string;
};

export default function PublicKnowledgeArticlePageContent({
  article,
  labels,
  relatedArticleLinks,
  relatedBusinessPackLinks,
  categoryName,
}: PublicKnowledgeArticlePageContentProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="text-sm text-aipify-text-muted">
        <Link href="/knowledge" className="hover:text-aipify-companion">
          {labels.title}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/knowledge/${article.categoryId}`} className="hover:text-aipify-companion">
          {categoryName}
        </Link>
      </nav>

      <header className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">{article.title}</h1>
      </header>

      <section className="mt-8">
        <h2 className="sr-only">{labels.introductionLabel}</h2>
        <p className="text-base leading-relaxed text-aipify-text-secondary">{article.introduction}</p>
      </section>

      {article.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-xl font-semibold text-aipify-text">{section.heading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">{section.body}</p>
        </section>
      ))}

      {article.examples.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-aipify-text">{labels.examplesTitle}</h2>
          <div className="mt-4 space-y-4">
            {article.examples.map((example) => (
              <div key={example.title} className="rounded-xl border border-aipify-border bg-aipify-surface-muted/50 p-5">
                <h3 className="font-medium text-aipify-text">{example.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{example.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <MarketingInternalLinksSection
        title={labels.relatedArticles}
        articles={relatedArticleLinks}
        businessPacks={relatedBusinessPackLinks}
        features={article.relatedFeatures}
        integrations={article.relatedIntegrations}
      />

      <section className="mt-12 rounded-2xl border border-aipify-border bg-gradient-to-r from-violet-50 to-cyan-50 p-8">
        <h2 className="text-xl font-bold text-aipify-text">{labels.articleCtaTitle}</h2>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/book-demo"
            className={`${AipifyMarketingClasses.primaryCta} px-6 py-3 text-center text-sm`}
            {...marketingDataAttr("cta_click", "knowledge_article_demo")}
          >
            {labels.articleCtaPrimary}
          </Link>
          <Link
            href="/get-started"
            className={`${AipifyMarketingClasses.secondaryCta} px-6 py-3 text-center text-sm`}
            {...marketingDataAttr("cta_click", "knowledge_article_get_started")}
          >
            {labels.articleCtaSecondary}
          </Link>
        </div>
      </section>
    </article>
  );
}
