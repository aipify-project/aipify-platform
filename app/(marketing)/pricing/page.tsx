import type { Metadata } from "next";
import PricingPackagesPageContent, { type PricingPackagesPageLabels } from "@/components/marketing/PricingPackagesPageContent";
import { parseBusinessPackDetailPackContent, parseBusinessPackDetailSharedLabels } from "@/lib/marketing/business-packs/parse-detail-page";
import { parseBusinessPackPricingCatalogItem } from "@/lib/marketing/business-packs/pricing-catalog";
import { formatMarketingPlanLabel, type MarketingPlanLabelMap } from "@/lib/marketing/business-packs/plan-labels";
import { MARKETING_BUSINESS_PACK_REGISTRY } from "@/lib/marketing/business-packs/registry";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const pricing = getSection<{ meta?: { title?: string; description?: string } }>(marketing, "pricingPage");
  return {
    title: pricing.meta?.title ?? "Aipify Pricing & Business Packs | Plans for Modern Organizations",
    description:
      pricing.meta?.description ??
      "Compare Aipify plans, Business Packs, governance capabilities and enterprise options for your organization.",
    alternates: { canonical: "/pricing" },
    openGraph: {
      title: pricing.meta?.title,
      description: pricing.meta?.description,
      url: "https://aipify.ai/pricing",
    },
  };
}

export default async function PricingPage() {
  const { marketing, locale } = await getMarketingContext();
  const labels = getSection<PricingPackagesPageLabels>(marketing, "pricingPage");
  const detailLabels = parseBusinessPackDetailSharedLabels(marketing);

  const businessPackCards = MARKETING_BUSINESS_PACK_REGISTRY.map((entry) => {
    const content = parseBusinessPackDetailPackContent(marketing, entry.slug);
    const catalog = parseBusinessPackPricingCatalogItem(marketing, entry.slug);
    return {
      slug: entry.slug,
      name: content?.name ?? entry.slug,
      audience: catalog.audience,
      value: catalog.value,
      commercialTypeLabel: detailLabels.commercialTypes[entry.commercialType],
      minPlanLabel: formatMarketingPlanLabel(entry.minPlan, detailLabels.planNames as MarketingPlanLabelMap),
      detailHref: entry.detailHref,
    };
  });

  return <PricingPackagesPageContent labels={labels} locale={locale} businessPackCards={businessPackCards} />;
}
