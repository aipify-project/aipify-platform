import type { Metadata } from "next";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import MarketingNavbar from "@/components/marketing/MarketingNavbar";
import WebsiteCompanionAssistant from "@/components/marketing/WebsiteCompanionAssistant";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import MarketingAnalyticsShell from "@/components/marketing/MarketingAnalyticsShell";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";
import { parseWebsiteCompanionLabels } from "@/lib/marketing/governance/labels";

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { marketing, common, locale } = await getMarketingContext();
  const nav = getSection<Record<string, string>>(marketing, "nav");
  const companion = parseWebsiteCompanionLabels(marketing);

  return (
    <div className={`min-h-full ${AipifyMarketingClasses.canvas}`}>
      <MarketingAnalyticsShell />
      <MarketingNavbar
        appName={common.appName}
        labels={nav as Parameters<typeof MarketingNavbar>[0]["labels"]}
      />
      <main className="flex-1">{children}</main>
      <MarketingFooter appName={common.appName} marketing={marketing} locale={locale} />
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
