import type { Metadata } from "next";
import { MarketingCtaBand, MarketingPageHeader, ModuleShowcase } from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, parseModules } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ modulesTitle?: string; modulesDescription?: string }>(marketing, "meta");
  return { title: meta.modulesTitle, description: meta.modulesDescription };
}

export default async function ModulesPage() {
  const { marketing } = await getMarketingContext();
  const modulesSection = getSection<Record<string, string>>(marketing, "modules");
  const ctaBand = getSection<Record<string, string>>(marketing, "ctaBand");

  return (
    <>
      <MarketingPageHeader title={modulesSection.title ?? ""} subtitle={modulesSection.subtitle} />
      <ModuleShowcase
        title={modulesSection.title ?? ""}
        subtitle={modulesSection.subtitle ?? ""}
        modules={parseModules(marketing)}
      />
      <MarketingCtaBand title={ctaBand.title ?? ""} subtitle={ctaBand.subtitle ?? ""} button={ctaBand.button ?? ""} />
    </>
  );
}
