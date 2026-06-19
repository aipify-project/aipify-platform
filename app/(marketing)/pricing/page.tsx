import type { Metadata } from "next";
import { MarketingCtaBand, MarketingDifferentiationStrip, MarketingTrustSignalStrip } from "@/components/marketing";
import PricingPackagesPageContent, { type PricingPackagesPageLabels } from "@/components/marketing/PricingPackagesPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, parseCtaBandLabels, parseStringList } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const pricing = getSection<{ meta?: { title?: string; description?: string } }>(marketing, "pricingPage");
  return {
    title: pricing.meta?.title,
    description: pricing.meta?.description,
  };
}

export default async function PricingPage() {
  const { marketing } = await getMarketingContext();
  const labels = getSection<PricingPackagesPageLabels>(marketing, "pricingPage");
  const ctaBand = parseCtaBandLabels(marketing);
  const trustSignals = parseStringList(marketing, "trustSignalStrip", "signals");

  return (
    <>
      <MarketingTrustSignalStrip signals={trustSignals} />
      <MarketingDifferentiationStrip themes={parseStringList(marketing, "differentiationStrip", "themes")} />
      <PricingPackagesPageContent labels={labels} />
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
