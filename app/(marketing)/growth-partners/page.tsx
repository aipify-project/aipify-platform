import type { Metadata } from "next";
import GrowthPartnersPageContent from "@/components/marketing/GrowthPartnersPageContent";
import type { GrowthPartnersPageLabels } from "@/components/marketing/growth-partners/types";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";
import { buildHumanVerificationLabels } from "@/lib/system-notice/labels";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const redesign = getSection<{ meta?: { title?: string; description?: string } }>(
    marketing,
    "growthPartnersPageRedesign",
  );
  const legacy = getSection<{ meta?: { title?: string; description?: string } }>(marketing, "growthPartners");
  const meta = redesign.meta ?? legacy.meta;
  return {
    title: meta?.title,
    description: meta?.description,
  };
}

export default async function GrowthPartnersPage() {
  const { marketing, t } = await getMarketingContext();
  const labels = getSection<GrowthPartnersPageLabels>(marketing, "growthPartnersPageRedesign");

  return (
    <GrowthPartnersPageContent
      labels={labels}
      verificationLabels={buildHumanVerificationLabels(t)}
    />
  );
}
