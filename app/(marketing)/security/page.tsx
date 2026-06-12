import type { Metadata } from "next";
import {
  EnterpriseTrustSection,
  HumanOversightSection,
  MarketingCtaBand,
  MarketingPageHeader,
} from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, parseOversightLadder, parseTrustPoints } from "@/lib/marketing/parse-marketing";

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
  const ctaBand = getSection<Record<string, string>>(marketing, "ctaBand");

  return (
    <>
      <MarketingPageHeader title={securityPage.title ?? ""} subtitle={securityPage.subtitle} />
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
      <MarketingCtaBand title={ctaBand.title ?? ""} subtitle={ctaBand.subtitle ?? ""} button={ctaBand.button ?? ""} />
    </>
  );
}
