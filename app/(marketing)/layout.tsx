import type { Metadata } from "next";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import MarketingNavbar from "@/components/marketing/MarketingNavbar";
import WebsiteCompanionAssistant from "@/components/marketing/WebsiteCompanionAssistant";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import {
  buildMarketingSearchFromDictionary,
  parseWebsiteCompanionLabels,
  parseWebsiteSearchLabels,
} from "@/lib/marketing/governance/labels";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";
import MarketingAnalyticsShell from "@/components/marketing/MarketingAnalyticsShell";

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { marketing, common } = await getMarketingContext();
  const nav = getSection<Record<string, string>>(marketing, "nav");
  const searchLabels = parseWebsiteSearchLabels(marketing);
  const companion = parseWebsiteCompanionLabels(marketing);
  const searchIndex = buildMarketingSearchFromDictionary(marketing);

  return (
    <div className={`min-h-full ${AipifyMarketingClasses.canvas}`}>
      <MarketingAnalyticsShell />
      <MarketingNavbar
        appName={common.appName}
        labels={nav as Parameters<typeof MarketingNavbar>[0]["labels"]}
        search={{
          placeholder: searchLabels.placeholder,
          noResults: searchLabels.noResults,
          index: searchIndex,
        }}
      />
      <main className="flex-1">{children}</main>
      <MarketingFooter appName={common.appName} marketing={marketing} />
      <WebsiteCompanionAssistant {...companion} />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ homeTitle?: string; homeDescription?: string }>(marketing, "meta");

  return {
    title: meta.homeTitle ?? "Aipify",
    description: meta.homeDescription,
    openGraph: {
      title: meta.homeTitle,
      description: meta.homeDescription,
      siteName: "Aipify",
      type: "website",
    },
  };
}
