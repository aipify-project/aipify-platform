import type { Metadata } from "next";
import { EnterpriseTrustSection, MarketingCtaBand, MarketingPageHeader } from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, parseTrustPoints } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ enterpriseTitle?: string; enterpriseDescription?: string }>(marketing, "meta");
  return { title: meta.enterpriseTitle, description: meta.enterpriseDescription };
}

export default async function EnterprisePage() {
  const { marketing } = await getMarketingContext();
  const enterprisePage = getSection<Record<string, string>>(marketing, "enterprisePage");
  const enterpriseTrust = getSection<Record<string, string>>(marketing, "enterpriseTrust");
  const ctaBand = getSection<Record<string, string>>(marketing, "ctaBand");

  return (
    <>
      <MarketingPageHeader title={enterprisePage.title ?? ""} subtitle={enterprisePage.subtitle} />
      <EnterpriseTrustSection
        title={enterpriseTrust.title ?? ""}
        subtitle={enterpriseTrust.subtitle ?? ""}
        points={parseTrustPoints(marketing)}
      />
      <MarketingCtaBand title={ctaBand.title ?? ""} subtitle={ctaBand.subtitle ?? ""} button={ctaBand.button ?? ""} />
    </>
  );
}
