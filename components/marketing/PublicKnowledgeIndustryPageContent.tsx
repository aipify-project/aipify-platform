import Link from "next/link";
import { ArrowRight } from "lucide-react";
import KnowledgeNestedNav, { buildKnowledgeBreadcrumbs } from "@/components/marketing/knowledge/KnowledgeNestedNav";
import KnowledgeCTA from "@/components/marketing/knowledge/KnowledgeCTA";
import type { KnowledgePageRedesignLabels } from "@/components/marketing/knowledge/types";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";
import type {
  PublicKnowledgeHubLabels,
  PublicKnowledgeIndustry,
  PublicKnowledgeIndustryDetail,
} from "@/lib/marketing/knowledge/types";

type ArticleSummary = { slug: string; title: string; metaDescription: string };
type BusinessPackLink = { slug: string; name: string };

type PublicKnowledgeIndustryPageContentProps = {
  industry: PublicKnowledgeIndustry;
  detail: PublicKnowledgeIndustryDetail;
  labels: PublicKnowledgeHubLabels;
  nested: KnowledgePageRedesignLabels["nested"];
  cta: KnowledgePageRedesignLabels["cta"];
  relatedArticles: ArticleSummary[];
  recommendedPacks: BusinessPackLink[];
};

export default function PublicKnowledgeIndustryPageContent({
  industry,
  detail,
  labels,
  nested,
  cta,
  relatedArticles,
  recommendedPacks,
}: PublicKnowledgeIndustryPageContentProps) {
  return (
    <>
      <KnowledgeNestedNav
        nested={nested}
        breadcrumbs={buildKnowledgeBreadcrumbs(nested, [{ label: industry.name }])}
      />

      <div className="mx-auto max-w-[77.5rem] px-4 pb-12 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h1 className={PublicMarketingClasses.pageTitle}>{detail.headline}</h1>
          <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{detail.intro}</p>

          {detail.orgTypes.length > 0 ? (
            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-aipify-text-muted">
                {labels.industryOrgTypesTitle}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {detail.orgTypes.map((orgType) => (
                  <li
                    key={orgType}
                    className="rounded-full border border-aipify-border bg-aipify-surface-muted/60 px-3 py-1 text-sm text-aipify-text-secondary"
                  >
                    {orgType}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
              className="inline-flex items-center justify-center rounded-xl bg-aipify-companion px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-aipify-companion/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
            >
              {detail.primaryCta}
            </Link>
            <Link
              href="/knowledge/getting-started"
              className="inline-flex items-center justify-center rounded-xl border border-aipify-border bg-aipify-surface px-5 py-2.5 text-sm font-semibold text-aipify-text transition hover:border-aipify-companion/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
            >
              {detail.secondaryCta}
            </Link>
          </div>
        </header>

        {detail.challenges.length > 0 ? (
          <section className="mt-14" aria-labelledby="industry-challenges-title">
            <h2 id="industry-challenges-title" className="text-2xl font-bold tracking-tight text-aipify-text">
              {detail.challengesTitle || labels.industryChallengesTitle}
            </h2>
            <ul className="mt-6 space-y-3">
              {detail.challenges.map((challenge) => (
                <li
                  key={challenge}
                  className="flex gap-3 rounded-xl border border-aipify-border bg-aipify-surface p-4 text-sm leading-relaxed text-aipify-text-secondary"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                  {challenge}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {detail.howAipifyHelps.length > 0 ? (
          <section className="mt-14" aria-labelledby="industry-how-aipify-helps-title">
            <h2 id="industry-how-aipify-helps-title" className="text-2xl font-bold tracking-tight text-aipify-text">
              {detail.howAipifyHelpsTitle || labels.industryHowAipifyHelpsTitle}
            </h2>
            <div className="mt-6 space-y-8">
              {detail.howAipifyHelps.map((section) => (
                <div key={section.heading}>
                  <h3 className="text-lg font-semibold text-aipify-text">{section.heading}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">{section.body}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {detail.workflows.length > 0 ? (
          <section className="mt-14" aria-labelledby="industry-workflows-title">
            <h2 id="industry-workflows-title" className="text-2xl font-bold tracking-tight text-aipify-text">
              {detail.workflowsTitle || labels.industryWorkflowsTitle}
            </h2>
            <ol className="mt-6 space-y-4">
              {detail.workflows.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-aipify-border bg-aipify-surface-muted/40 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-semibold text-aipify-text">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{step.body}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {recommendedPacks.length > 0 ? (
          <section className="mt-14" aria-labelledby="industry-packs-title">
            <h2 id="industry-packs-title" className="text-2xl font-bold tracking-tight text-aipify-text">
              {labels.industryRecommendedPacksTitle}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {recommendedPacks.map((pack) => (
                <li key={pack.slug}>
                  <Link
                    href={`/business-packs/${pack.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-aipify-companion/20 bg-aipify-surface p-5 shadow-sm transition hover:border-aipify-companion/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
                  >
                    <h3 className="font-semibold text-aipify-text group-hover:text-aipify-companion">{pack.name}</h3>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-aipify-companion">
                      {labels.exploreBusinessPack}
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {detail.governanceBody ? (
          <section className="mt-14 rounded-2xl border border-aipify-border bg-aipify-surface-muted/50 p-6 sm:p-8" aria-labelledby="industry-governance-title">
            <h2 id="industry-governance-title" className="text-2xl font-bold tracking-tight text-aipify-text">
              {detail.governanceTitle || labels.industryGovernanceTitle}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">{detail.governanceBody}</p>
          </section>
        ) : null}

        {detail.outcomes.length > 0 ? (
          <section className="mt-14" aria-labelledby="industry-outcomes-title">
            <h2 id="industry-outcomes-title" className="text-2xl font-bold tracking-tight text-aipify-text">
              {detail.outcomesTitle || labels.industryOutcomesTitle}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {detail.outcomes.map((outcome) => (
                <li key={outcome.title} className="rounded-xl border border-aipify-border bg-aipify-surface p-5">
                  <h3 className="font-semibold text-aipify-text">{outcome.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{outcome.body}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {relatedArticles.length > 0 ? (
          <section className="mt-14" aria-labelledby="industry-related-articles-title">
            <h2 id="industry-related-articles-title" className="text-2xl font-bold tracking-tight text-aipify-text">
              {labels.industryRelatedArticlesTitle}
            </h2>
            <ul className="mt-6 divide-y divide-aipify-border rounded-2xl border border-aipify-border bg-aipify-surface shadow-sm">
              {relatedArticles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/knowledge/articles/${article.slug}`}
                    className="block px-5 py-4 transition hover:bg-aipify-surface-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-aipify-focus"
                  >
                    <h3 className="font-medium text-aipify-text">{article.title}</h3>
                    <p className="mt-1 text-sm text-aipify-text-secondary">{article.metaDescription}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <KnowledgeCTA cta={cta} />
    </>
  );
}
