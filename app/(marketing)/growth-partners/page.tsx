import type { Metadata } from "next";
import GrowthPartnersPageContent, { type GrowthPartnersPageLabels } from "@/components/marketing/GrowthPartnersPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const gp = getSection<{ meta?: { title?: string; description?: string } }>(marketing, "growthPartners");
  return {
    title: gp.meta?.title,
    description: gp.meta?.description,
  };
}

export default async function GrowthPartnersPage() {
  const { marketing } = await getMarketingContext();
  const labels = getSection<GrowthPartnersPageLabels>(marketing, "growthPartners");

  return <GrowthPartnersPageContent labels={labels} />;
}
