import Link from "next/link";
import { MarketingCtaBand, MarketingDifferentiationStrip, MarketingPageHeader, MarketingTrustSignalStrip } from "@/components/marketing";
import type { PublicKnowledgeCategory, PublicKnowledgeHubLabels, PublicKnowledgeIndustry } from "@/lib/marketing/knowledge/types";
import { PUBLIC_KNOWLEDGE_HUBS } from "@/lib/marketing/knowledge/types";
import type { MarketingCtaBandLabels } from "./MarketingCtaBand";

type ArticleSummary = {
  slug: string;
  title: string;
  metaDescription: string;
  categoryId: string;
};

type BusinessPackSummary = {
  slug: string;
  name: string;
  metaDescription: string;
};

type PublicKnowledgeHubPageContentProps = {
  labels: PublicKnowledgeHubLabels;
  categories: PublicKnowledgeCategory[];
  industries: PublicKnowledgeIndustry[];
  businessPacks: BusinessPackSummary[];
  articleSummaries: ArticleSummary[];
  searchIntents: string[];
  ctaBand: MarketingCtaBandLabels;
  trustSignals: string[];
  differentiationThemes: string[];
};

export default function PublicKnowledgeHubPageContent({
  labels,
  categories,
  industries,
  businessPacks,
  articleSummaries,
  searchIntents,
  ctaBand,
  trustSignals,
  differentiationThemes,
}: PublicKnowledgeHubPageContentProps) {
  return (
    <>
      <MarketingPageHeader
        title={labels.title}
        subtitle={labels.subtitle}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Knowledge Center" },
        ]}
      />
      <MarketingTrustSignalStrip signals={trustSignals} />
      <MarketingDifferentiationStrip themes={differentiationThemes} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-aipify-text-secondary">{labels.authorityNote}</p>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-aipify-text">{labels.browseHubs}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PUBLIC_KNOWLEDGE_HUBS.map((hubId) => (
              <Link
                key={hubId}
                href={`/knowledge/${hubId}`}
                className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 transition hover:border-aipify-companion/40 hover:shadow-md"
              >
                <h3 className="font-semibold text-aipify-text capitalize">{hubId.replace(/-/g, " ")}</h3>
                <p className="mt-2 text-sm text-aipify-text-secondary">
                  {categories.find((c) => c.id === hubId)?.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-aipify-text">{labels.browseCategories}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/knowledge/${category.id}`}
                className="rounded-2xl border border-aipify-border bg-aipify-surface-muted/40 p-5 transition hover:border-aipify-companion/40"
              >
                <h3 className="font-semibold text-aipify-text">{category.name}</h3>
                <p className="mt-2 text-sm text-aipify-text-secondary">{category.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-aipify-text">{labels.browseIndustries}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <Link
                key={industry.id}
                href={`/knowledge/industry/${industry.id}`}
                className="rounded-2xl border border-aipify-border bg-aipify-surface p-5 transition hover:border-aipify-companion/40"
              >
                <h3 className="font-semibold text-aipify-text">{industry.name}</h3>
                <p className="mt-2 text-sm text-aipify-text-secondary">{industry.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="business-packs" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-aipify-text">{labels.browseBusinessPacks}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {businessPacks.map((pack) => (
              <Link
                key={pack.slug}
                href={`/business-packs/${pack.slug}`}
                className="rounded-2xl border border-aipify-border bg-aipify-surface p-5 transition hover:border-aipify-companion/40"
              >
                <h3 className="font-semibold text-aipify-text">{pack.name}</h3>
                <p className="mt-2 text-sm text-aipify-text-secondary">{pack.metaDescription}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-aipify-text">{labels.searchIntentsTitle}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {searchIntents.map((intent) => (
              <li key={intent} className="rounded-full border border-aipify-border bg-aipify-surface-muted px-4 py-2 text-sm text-aipify-text-secondary">
                {intent}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-aipify-text">{labels.viewAllArticles}</h2>
          <ul className="mt-6 divide-y divide-aipify-border rounded-2xl border border-aipify-border bg-aipify-surface">
            {articleSummaries.map((article) => (
              <li key={article.slug}>
                <Link href={`/knowledge/articles/${article.slug}`} className="block px-5 py-4 transition hover:bg-aipify-surface-muted/50">
                  <h3 className="font-medium text-aipify-text">{article.title}</h3>
                  <p className="mt-1 text-sm text-aipify-text-secondary">{article.metaDescription}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {labels.localesNote ? (
          <p className="mt-10 text-center text-xs text-aipify-text-muted">{labels.localesNote}</p>
        ) : null}
      </div>

      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
