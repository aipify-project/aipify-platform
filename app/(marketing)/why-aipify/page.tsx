import type { Metadata } from "next";
import WhyAipifyPageContent, { type WhyAipifyPageLabels } from "@/components/marketing/WhyAipifyPageContent";
import { PublicCTA, PublicPageHero } from "@/components/marketing/public";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const why = getSection<{ meta?: { title?: string; description?: string } }>(marketing, "whyAipifyPage");
  return {
    title: why.meta?.title,
    description: why.meta?.description,
  };
}

export default async function WhyAipifyPage() {
  const { marketing } = await getMarketingContext();
  const labels = getSection<WhyAipifyPageLabels>(marketing, "whyAipifyPage");

  return (
    <>
      <PublicPageHero
        eyebrow="Why Aipify"
        title={labels.hero.headline}
        subtitle={labels.hero.subheadline}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Platform", href: "/product" },
          { label: "Why Aipify", href: "/why-aipify" },
        ]}
        primaryCta={{ label: labels.hero.cta, href: "/product", analyticsId: "why_aipify_explore" }}
        secondaryCta={{
          label: "Book a Demo",
          href: MARKETING_PRIMARY_CTA_HREFS.bookDemo,
          analyticsId: "why_aipify_book_demo",
        }}
      />
      <p className="mx-auto max-w-[90rem] px-4 pb-4 text-base text-aipify-text-secondary sm:px-6 lg:px-8">
        {labels.hero.supporting}
      </p>
      <WhyAipifyPageContent labels={labels} />
      <PublicCTA
        title={labels.finalCta.headline}
        subtitle={labels.finalPrinciple}
        primaryLabel={labels.finalCta.explore}
        primaryHref="/product"
        secondaryLabel={labels.finalCta.businessPacks}
        secondaryHref="/pricing#business-packs"
        analyticsPrimary="why_aipify_final_explore"
        analyticsSecondary="why_aipify_final_packs"
      />
    </>
  );
}
