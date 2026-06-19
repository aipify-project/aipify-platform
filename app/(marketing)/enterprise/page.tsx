import type { Metadata } from "next";
import {
  CategoryPositioningIntro,
  EnterpriseConfidenceStrip,
  EnterpriseTrustSection,
  MarketingCtaBand,
  MarketingPageHeader,
  PlatformDifferentiationSection,
} from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getSection,
  parseCategoryPositioningIntro,
  parseConfidenceItems,
  parseCtaBandLabels,
  parseDifferentiationItems,
  parseTrustPoints,
} from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ enterpriseTitle?: string; enterpriseDescription?: string }>(marketing, "meta");
  return { title: meta.enterpriseTitle, description: meta.enterpriseDescription };
}

export default async function EnterprisePage() {
  const { marketing } = await getMarketingContext();
  const enterprisePage = getSection<Record<string, string>>(marketing, "enterprisePage");
  const enterpriseTrust = getSection<Record<string, string>>(marketing, "enterpriseTrust");
  const platformAuthority = getSection<Record<string, string>>(marketing, "platformAuthority");
  const ctaBand = parseCtaBandLabels(marketing);
  const categoryPositioning = parseCategoryPositioningIntro(marketing);

  return (
    <>
      <MarketingPageHeader title={enterprisePage.title ?? ""} subtitle={enterprisePage.subtitle} />
      <CategoryPositioningIntro {...categoryPositioning} compact />
      <EnterpriseConfidenceStrip
        title={platformAuthority.confidenceTitle ?? ""}
        subtitle={platformAuthority.confidenceSubtitle}
        items={parseConfidenceItems(marketing).map(({ name, description }) => ({
          title: name,
          description,
        }))}
      />
      <EnterpriseTrustSection
        title={enterpriseTrust.title ?? ""}
        subtitle={enterpriseTrust.subtitle ?? ""}
        points={parseTrustPoints(marketing)}
      />
      <PlatformDifferentiationSection
        title={platformAuthority.differentiationTitle ?? ""}
        items={parseDifferentiationItems(marketing)}
      />
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
