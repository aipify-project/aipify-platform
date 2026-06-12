import type { Metadata } from "next";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import MarketingNavbar from "@/components/marketing/MarketingNavbar";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { marketing, common } = await getMarketingContext();
  const nav = getSection<Record<string, string>>(marketing, "nav");
  const footer = getSection<Record<string, string>>(marketing, "footer");

  return (
    <div className="min-h-full bg-[#0a0e14] text-slate-200">
      <MarketingNavbar appName={common.appName} labels={nav as Parameters<typeof MarketingNavbar>[0]["labels"]} />
      <main className="flex-1">{children}</main>
      <MarketingFooter
        appName={common.appName}
        labels={footer as Parameters<typeof MarketingFooter>[0]["labels"]}
      />
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
