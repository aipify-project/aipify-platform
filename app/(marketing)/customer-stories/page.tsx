import type { Metadata } from "next";
import { MarketingCtaBand, MarketingTrustSignalStrip } from "@/components/marketing";
import CustomerStoriesPageContent, { type CustomerStoriesPageLabels } from "@/components/marketing/CustomerStoriesPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, parseCtaBandLabels, parseStringList } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const stories = getSection<{ meta?: { title?: string; description?: string } }>(marketing, "customerStoriesPage");
  return {
    title: stories.meta?.title,
    description: stories.meta?.description,
  };
}

export default async function CustomerStoriesPage() {
  const { marketing } = await getMarketingContext();
  const labels = getSection<CustomerStoriesPageLabels>(marketing, "customerStoriesPage");
  const ctaBand = parseCtaBandLabels(marketing);
  const trustSignals = parseStringList(marketing, "trustSignalStrip", "signals");

  return (
    <>
      <MarketingTrustSignalStrip signals={trustSignals} />
      <CustomerStoriesPageContent labels={labels} />
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
