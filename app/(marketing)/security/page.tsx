import type { Metadata } from "next";
import {
  EnterpriseConfidenceStrip,
  EnterpriseTrustSection,
  HumanOversightSection,
  MarketingCtaBand,
  MarketingPageHeader,
  PlatformDifferentiationSection,
} from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getSection,
  parseConfidenceItems,
  parseCtaBandLabels,
  parseDifferentiationItems,
  parseOversightLadder,
  parseTrustPoints,
} from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ securityTitle?: string; securityDescription?: string }>(marketing, "meta");
  return { title: meta.securityTitle, description: meta.securityDescription };
}

export default async function SecurityPage() {
  const { marketing } = await getMarketingContext();
  const securityPage = getSection<Record<string, string>>(marketing, "securityPage");
  const enterpriseTrust = getSection<Record<string, string>>(marketing, "enterpriseTrust");
  const humanOversight = getSection<Record<string, string>>(marketing, "humanOversight");
  const platformAuthority = getSection<Record<string, string>>(marketing, "platformAuthority");
  const ctaBand = parseCtaBandLabels(marketing);

  return (
    <>
      <MarketingPageHeader title={securityPage.title ?? ""} subtitle={securityPage.subtitle} />
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
      <HumanOversightSection
        title={humanOversight.title ?? ""}
        subtitle={humanOversight.subtitle ?? ""}
        ladder={parseOversightLadder(marketing)}
      />
      <PlatformDifferentiationSection
        title={platformAuthority.differentiationTitle ?? ""}
        items={parseDifferentiationItems(marketing)}
      />
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
