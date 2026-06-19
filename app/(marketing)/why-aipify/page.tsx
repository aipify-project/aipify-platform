import type { Metadata } from "next";
import { CategoryPositioningIntro, MarketingCtaBand } from "@/components/marketing";
import WhyAipifyPageContent, { type WhyAipifyPageLabels } from "@/components/marketing/WhyAipifyPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, parseCategoryPositioningIntro, parseCtaBandLabels } from "@/lib/marketing/parse-marketing";

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
  const ctaBand = parseCtaBandLabels(marketing);
  const categoryPositioning = parseCategoryPositioningIntro(marketing);

  return (
    <>
      <CategoryPositioningIntro {...categoryPositioning} compact />
      <WhyAipifyPageContent labels={labels} />
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
