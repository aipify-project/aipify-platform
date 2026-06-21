import MarketingInternalLinksSection from "./MarketingInternalLinksSection";
import KnowledgeNestedNav, { buildKnowledgeBreadcrumbs } from "@/components/marketing/knowledge/KnowledgeNestedNav";
import KnowledgeCTA from "@/components/marketing/knowledge/KnowledgeCTA";
import type { KnowledgePageRedesignLabels } from "@/components/marketing/knowledge/types";
import type { PublicKnowledgeArticle, PublicKnowledgeHubLabels } from "@/lib/marketing/knowledge/types";

type PublicKnowledgeArticlePageContentProps = {
  article: PublicKnowledgeArticle;
  labels: PublicKnowledgeHubLabels;
  nested: KnowledgePageRedesignLabels["nested"];
  cta: KnowledgePageRedesignLabels["cta"];
  relatedArticleLinks: Array<{ slug: string; title: string }>;
  relatedBusinessPackLinks: Array<{ slug: string; name: string }>;
  categoryName: string;
};

export default function PublicKnowledgeArticlePageContent({
  article,
  labels,
  nested,
  cta,
  relatedArticleLinks,
  relatedBusinessPackLinks,
  categoryName,
}: PublicKnowledgeArticlePageContentProps) {
  return (
    <>
      <KnowledgeNestedNav
        nested={nested}
        breadcrumbs={buildKnowledgeBreadcrumbs(nested, [
          { label: categoryName, href: `/knowledge/${article.categoryId}` },
          { label: article.title },
        ])}
      />

      <article className="mx-auto max-w-3xl px-4 pb-12 sm:px-6 lg:px-8">
        <header>
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
      </article>

      <KnowledgeCTA cta={cta} />
    </>
  );
}
