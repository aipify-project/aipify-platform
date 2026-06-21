import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BusinessPackBreadcrumbJsonLd from "@/components/marketing/business-packs/BusinessPackBreadcrumbJsonLd";
import BusinessPackDetailPageContent from "@/components/marketing/business-packs/BusinessPackDetailPageContent";
import {
  parseBusinessPackDetailPackContent,
  parseBusinessPackDetailSharedLabels,
} from "@/lib/marketing/business-packs/parse-detail-page";
import {
  getMarketingBusinessPackRegistryEntry,
  MARKETING_BUSINESS_PACK_SLUGS,
  getMarketingBusinessPackDetailHref,
  type MarketingBusinessPackSlug,
} from "@/lib/marketing/business-packs/registry";
import { parseBusinessPackPricingCatalogItem } from "@/lib/marketing/business-packs/pricing-catalog";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return MARKETING_BUSINESS_PACK_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getMarketingBusinessPackRegistryEntry(slug);
  if (!entry) return {};

  const { marketing } = await getMarketingContext();
  const content = parseBusinessPackDetailPackContent(marketing, entry.slug);
  if (!content) return {};

  const canonical = getMarketingBusinessPackDetailHref(entry.slug);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: `https://aipify.ai${canonical}`,
    },
  };
}

export default async function BusinessPackLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getMarketingBusinessPackRegistryEntry(slug);
  if (!entry) notFound();

  const { marketing } = await getMarketingContext();
  const content = parseBusinessPackDetailPackContent(marketing, entry.slug as MarketingBusinessPackSlug);
  if (!content) notFound();

  const labels = parseBusinessPackDetailSharedLabels(marketing);
  const catalog = parseBusinessPackPricingCatalogItem(marketing, entry.slug);

  const relatedPacks = entry.relatedSlugs.flatMap((relatedSlug) => {
    const relatedContent = parseBusinessPackDetailPackContent(marketing, relatedSlug);
    if (!relatedContent) return [];
    return [
      {
        slug: relatedSlug,
        name: relatedContent.name,
        href: getMarketingBusinessPackDetailHref(relatedSlug),
      },
    ];
  });

  const breadcrumbItems = [
    { label: labels.breadcrumbs.home, href: "/" },
    { label: labels.breadcrumbs.businessPacks, href: "/pricing#business-packs" },
    { label: content.name },
  ];

  return (
    <>
      <BusinessPackBreadcrumbJsonLd
        items={breadcrumbItems}
        pageUrl={getMarketingBusinessPackDetailHref(entry.slug)}
      />
      <BusinessPackDetailPageContent
        entry={entry}
        content={content}
        labels={labels}
        catalog={catalog}
        relatedPacks={relatedPacks}
      />
    </>
  );
}
