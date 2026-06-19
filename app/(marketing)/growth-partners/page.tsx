import type { Metadata } from "next";
import GrowthPartnersPageContent, { type GrowthPartnersPageLabels } from "@/components/marketing/GrowthPartnersPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getSection,
  parsePartnerAuthorityBadges,
  parsePartnerAuthorityStats,
} from "@/lib/marketing/parse-marketing";
import { buildHumanVerificationLabels } from "@/lib/system-notice/labels";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const gp = getSection<{ meta?: { title?: string; description?: string } }>(marketing, "growthPartners");
  return {
    title: gp.meta?.title,
    description: gp.meta?.description,
  };
}

export default async function GrowthPartnersPage() {
  const { marketing, t } = await getMarketingContext();
  const labels = getSection<GrowthPartnersPageLabels>(marketing, "growthPartners");
  const platformAuthority = getSection<Record<string, string>>(marketing, "platformAuthority");

  return (
    <GrowthPartnersPageContent
      labels={labels}
      verificationLabels={buildHumanVerificationLabels(t)}
      partnerAuthority={{
        title: platformAuthority.partnerAuthorityTitle ?? "",
        subtitle: platformAuthority.partnerAuthoritySubtitle ?? "",
        badges: parsePartnerAuthorityBadges(marketing),
        stats: parsePartnerAuthorityStats(marketing),
        ecosystemNote: platformAuthority.partnerEcosystemNote ?? "",
      }}
    />
  );
}
