import type { Metadata } from "next";
import PricingPackagesPageContent, { type PricingPackagesPageLabels } from "@/components/marketing/PricingPackagesPageContent";
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
  const { marketing } = await getMarketingContext();
  const labels = getSection<PricingPackagesPageLabels>(marketing, "pricingPage");

  return <PricingPackagesPageContent labels={labels} />;
}
