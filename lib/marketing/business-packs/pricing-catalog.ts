import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";
import type { MarketingBusinessPackSlug } from "./registry";

export type BusinessPackPricingCatalogStrings = {
  audience: string;
  value: string;
};

export function parseBusinessPackPricingCatalogItem(
  marketing: MarketingDictionary,
  slug: MarketingBusinessPackSlug,
): BusinessPackPricingCatalogStrings {
  const catalog = getSection<{ catalog?: Record<string, { audience?: string; value?: string }> }>(
    marketing,
    "pricingPage.businessPacks",
  );
  const fromPricing = catalog.catalog?.[slug];

  const detailRoot = getSection<{ packs?: Record<string, { audience?: string; value?: string }> }>(
    marketing,
    "businessPackDetailPages",
  );
  const fromDetail = detailRoot.packs?.[slug];

  return {
    audience: fromPricing?.audience ?? fromDetail?.audience ?? "",
    value: fromPricing?.value ?? fromDetail?.value ?? "",
  };
}

export function parseAllBusinessPackPricingCatalogItems(
  marketing: MarketingDictionary,
): Record<MarketingBusinessPackSlug, BusinessPackPricingCatalogStrings> {
  const slugs: MarketingBusinessPackSlug[] = ["hosts", "support", "commerce", "services", "projects", "finance"];
  return Object.fromEntries(
    slugs.map((slug) => [slug, parseBusinessPackPricingCatalogItem(marketing, slug)]),
  ) as Record<MarketingBusinessPackSlug, BusinessPackPricingCatalogStrings>;
}
