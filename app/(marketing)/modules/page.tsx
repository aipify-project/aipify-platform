import type { Metadata } from "next";
import {
  CategoryPositioningIntro,
  EnterpriseConfidenceStrip,
  HumanCenteredAiSection,
  MarketingCtaBand,
  MarketingDifferentiationStrip,
  MarketingPageHeader,
  ModuleShowcase,
  PlatformArchitectureSection,
  PlatformEnginesGrid,
} from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getSection,
  parseArchitectureLayers,
  parseCategoryPositioningIntro,
  parseConfidenceItems,
  parseCtaBandLabels,
  parseModules,
  parsePlatformEngines,
  parseStringList,
} from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ modulesTitle?: string; modulesDescription?: string }>(marketing, "meta");
  return { title: meta.modulesTitle, description: meta.modulesDescription };
}

export default async function ModulesPage() {
  const { marketing } = await getMarketingContext();
  const modulesSection = getSection<Record<string, string>>(marketing, "modules");
  const platformAuthority = getSection<Record<string, string>>(marketing, "platformAuthority");
  const ctaBand = parseCtaBandLabels(marketing);
  const categoryPositioning = parseCategoryPositioningIntro(marketing);

  return (
    <>
      <MarketingPageHeader title={modulesSection.title ?? ""} subtitle={modulesSection.subtitle} />
      <CategoryPositioningIntro {...categoryPositioning} compact />
      <MarketingDifferentiationStrip themes={parseStringList(marketing, "differentiationStrip", "themes")} />
      <PlatformArchitectureSection
        title={platformAuthority.architectureTitle ?? ""}
        subtitle={platformAuthority.architectureSubtitle ?? ""}
        layers={parseArchitectureLayers(marketing)}
      />
      <ModuleShowcase
        title={modulesSection.title ?? ""}
        subtitle={modulesSection.subtitle ?? ""}
        modules={parseModules(marketing)}
      />
      <PlatformEnginesGrid
        title={platformAuthority.enginesTitle ?? ""}
        subtitle={platformAuthority.enginesSubtitle ?? ""}
        engines={parsePlatformEngines(marketing)}
      />
      <EnterpriseConfidenceStrip
        title={platformAuthority.confidenceTitle ?? ""}
        subtitle={platformAuthority.confidenceSubtitle}
        items={parseConfidenceItems(marketing).map(({ name, description }) => ({
          title: name,
          description,
        }))}
      />
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
