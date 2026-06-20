import Link from "next/link";
import MarketingInternalLinksSection from "./MarketingInternalLinksSection";
import MarketingKnowledgeFaqSection from "./MarketingKnowledgeFaqSection";
import { MarketingCtaBand, MarketingPageHeader } from "@/components/marketing";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { PublicBusinessPackPage, PublicKnowledgeHubLabels } from "@/lib/marketing/knowledge/types";
import type { MarketingCtaBandLabels } from "./MarketingCtaBand";

type BusinessPackLandingPageContentProps = {
  pack: PublicBusinessPackPage;
  labels: PublicKnowledgeHubLabels;
  relatedArticleLinks: Array<{ slug: string; title: string }>;
  ctaBand: MarketingCtaBandLabels;
};

export default function BusinessPackLandingPageContent({
  pack,
  labels,
  relatedArticleLinks,
  ctaBand,
}: BusinessPackLandingPageContentProps) {
  return (
    <>
      <MarketingPageHeader
        title={pack.headline}
        subtitle={pack.introduction}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Business Packs", href: "/pricing#business-packs" },
          { label: pack.name },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <h2 className="text-xl font-semibold text-aipify-text">{labels.relatedUseCases}</h2>
          <ul className="mt-4 space-y-3">
            {pack.useCases.map((useCase) => (
              <li key={useCase} className="flex gap-3 text-sm text-aipify-text-secondary">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                {useCase}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-aipify-text">{labels.relatedFeatures}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {pack.capabilities.map((capability) => (
              <li key={capability} className="rounded-xl border border-aipify-border bg-aipify-surface-muted/40 px-4 py-3 text-sm text-aipify-text-secondary">
                {capability}
              </li>
            ))}
          </ul>
        </section>

        <MarketingInternalLinksSection
          title={labels.relatedArticles}
          articles={relatedArticleLinks}
          integrations={pack.relatedIntegrations}
        />

        <MarketingKnowledgeFaqSection title={labels.faqTitle} faqs={pack.faqs} />

        <section className="mt-12 rounded-2xl border border-aipify-border bg-gradient-to-r from-violet-50 to-cyan-50 p-8">
          <h2 className="text-xl font-bold text-aipify-text">{labels.businessPackCta}</h2>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book-demo"
              className={`${AipifyMarketingClasses.primaryCta} px-6 py-3 text-center text-sm`}
              {...marketingDataAttr("cta_click", `business_pack_${pack.slug}_demo`)}
            >
              {labels.articleCtaPrimary}
            </Link>
            <Link
              href="/get-started"
              className={`${AipifyMarketingClasses.secondaryCta} px-6 py-3 text-center text-sm`}
              {...marketingDataAttr("cta_click", `business_pack_${pack.slug}_get_started`)}
            >
              {labels.articleCtaSecondary}
            </Link>
          </div>
        </section>
      </div>
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
