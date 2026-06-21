import Link from "next/link";
import type { PublicKnowledgeArticle } from "@/lib/marketing/knowledge/types";

type AppKnowledgeArticlePanelProps = {
  article: PublicKnowledgeArticle;
  labels: {
    back: string;
    introductionLabel: string;
    keyTakeawaysTitle: string;
    examplesTitle: string;
    faqTitle: string;
    readingTimeLabel: string;
    publishedLabel: string;
  };
  faqs?: Array<{ q: string; a: string }>;
  backHref?: string;
};

export function AppKnowledgeArticlePanel({
  article,
  labels,
  faqs = [],
  backHref = "/app/account/preferences",
}: AppKnowledgeArticlePanelProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <header className="space-y-3">
        <Link href={backHref} className="text-sm font-medium text-violet-700 hover:text-violet-900">
          ← {labels.back}
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{article.title}</h1>
          {(article.readingTime || article.publishedDate) && (
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
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
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="sr-only">{labels.introductionLabel}</h2>
        <p className="text-base leading-relaxed text-gray-700">{article.introduction}</p>
      </section>

      {article.keyTakeaways.length > 0 ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/60 p-6">
          <h2 className="text-lg font-semibold text-gray-900">{labels.keyTakeawaysTitle}</h2>
          <ul className="mt-4 space-y-2">
            {article.keyTakeaways.map((takeaway) => (
              <li key={takeaway} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" aria-hidden="true" />
                {takeaway}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {article.sections.map((section) => (
        <section key={section.heading} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{section.heading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">{section.body}</p>
        </section>
      ))}

      {article.examples.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{labels.examplesTitle}</h2>
          {article.examples.map((example) => (
            <div key={example.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-medium text-gray-900">{example.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{example.body}</p>
            </div>
          ))}
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section aria-labelledby="app-kc-article-faq">
          <h2 id="app-kc-article-faq" className="text-lg font-semibold text-gray-900">
            {labels.faqTitle}
          </h2>
          <dl className="mt-4 space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <dt className="font-medium text-gray-900">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-700">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
