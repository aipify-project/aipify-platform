import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
  faqs?: Array<{ q: string; a: string }>;
};

export default function PublicKnowledgeArticlePageContent({
  article,
  labels,
  nested,
  cta,
  relatedArticleLinks,
  relatedBusinessPackLinks,
  categoryName,
  faqs = [],
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
          <Link
            href={`/knowledge/${article.categoryId}`}
            className="text-sm font-medium text-aipify-companion transition hover:text-aipify-companion/80"
          >
            {categoryName}
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">{article.title}</h1>
          {(article.readingTime || article.publishedDate) && (
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-aipify-text-muted">
              {article.readingTime ? (
                <div className="flex gap-1.5">
                  <dt>{labels.readingTimeLabel}:</dt>
                  <dd>{article.readingTime}</dd>
                </div>
              ) : null}
              {article.publishedDate ? (
                <div className="flex gap-1.5">
                  <dt>{labels.publishedLabel}:</dt>
                  <dd>
                    <time dateTime={article.publishedDate}>{article.publishedDate}</time>
                  </dd>
                </div>
              ) : null}
            </dl>
          )}
        </header>

        <section className="mt-8">
          <h2 className="sr-only">{labels.introductionLabel}</h2>
          <p className="text-base leading-relaxed text-aipify-text-secondary">{article.introduction}</p>
        </section>

        {article.keyTakeaways.length > 0 ? (
          <section
            className="mt-10 rounded-2xl border border-aipify-companion/20 bg-violet-50/50 p-6"
            aria-labelledby="article-key-takeaways"
          >
            <h2 id="article-key-takeaways" className="text-lg font-semibold text-aipify-text">
              {labels.keyTakeawaysTitle}
            </h2>
            <ul className="mt-4 space-y-2">
              {article.keyTakeaways.map((takeaway) => (
                <li key={takeaway} className="flex gap-2 text-sm leading-relaxed text-aipify-text-secondary">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                  {takeaway}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

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

        {faqs.length > 0 ? (
          <section className="mt-12" aria-labelledby="article-faq">
            <h2 id="article-faq" className="text-xl font-semibold text-aipify-text">
              {labels.faqTitle}
            </h2>
            <dl className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-aipify-border bg-aipify-surface p-5">
                  <dt className="font-medium text-aipify-text">{faq.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <div className="mt-12 border-t border-aipify-border pt-8">
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-aipify-companion transition hover:text-aipify-companion/80"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {labels.backToKnowledge}
          </Link>
        </div>
      </article>

      <KnowledgeCTA cta={cta} />
    </>
  );
}
