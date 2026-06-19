import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  CategoryPositioningIntro,
  CompanionNotChatbotSection,
  EnterpriseConfidenceStrip,
  HumanDifferenceSection,
  MarketingCtaBand,
  MarketingDifferentiationStrip,
  MarketingPageHeader,
  ModuleShowcase,
  OrganizationalMemorySection,
  PlatformArchitectureSection,
  PlatformEnginesGrid,
  PlatformMapSection,
  PlatformDifferentiationSection,
  PlatformPreviewStrip,
  WhatCompanionDoesSection,
} from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getSection,
  parseArchitectureLayers,
  parseCategoryPositioningIntro,
  parseConfidenceItems,
  parseCtaBandLabels,
  parseHumanDifferenceContent,
  parseDemoSteps,
  parseDifferentiationItems,
  parseModules,
  parsePlatformEngines,
  parsePlatformMapNodes,
  parsePlatformPreview,
  parseCompanionCapabilities,
  parseStringList,
} from "@/lib/marketing/parse-marketing";

const AnimatedProductDemo = dynamic(
  () => import("@/components/marketing/AnimatedProductDemo"),
  { loading: () => <div className="h-48 animate-pulse rounded-2xl bg-aipify-surface-muted" /> }
);

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ productTitle?: string; productDescription?: string }>(marketing, "meta");
  return { title: meta.productTitle, description: meta.productDescription };
}

export default async function ProductPage() {
  const { marketing } = await getMarketingContext();
  const productPage = getSection<Record<string, string>>(marketing, "productPage");
  const platformAuthority = getSection<Record<string, string>>(marketing, "platformAuthority");
  const modulesSection = getSection<Record<string, string>>(marketing, "modules");
  const animatedDemo = getSection<Record<string, string>>(marketing, "animatedDemo");
  const ctaBand = parseCtaBandLabels(marketing);
  const categoryPositioning = parseCategoryPositioningIntro(marketing);
  const humanDifference = parseHumanDifferenceContent(marketing);

  return (
    <>
      <MarketingPageHeader title={productPage.title ?? ""} subtitle={productPage.subtitle} />
      <CategoryPositioningIntro {...categoryPositioning} compact />
      <HumanDifferenceSection {...humanDifference} compact />
      <MarketingDifferentiationStrip themes={parseStringList(marketing, "differentiationStrip", "themes")} />
      <CompanionNotChatbotSection
        title={getSection<{ title?: string }>(marketing, "companionNotChatbot").title ?? ""}
        statements={parseStringList(marketing, "companionNotChatbot", "statements")}
      />
      <OrganizationalMemorySection
        title={getSection<{ title?: string }>(marketing, "organizationalMemory").title ?? ""}
        problems={parseStringList(marketing, "organizationalMemory", "problems")}
        closing={getSection<{ closing?: string }>(marketing, "organizationalMemory").closing ?? ""}
      />
      <WhatCompanionDoesSection
        title={getSection<{ title?: string }>(marketing, "whatCompanionDoes").title ?? ""}
        capabilities={parseCompanionCapabilities(marketing)}
      />
      <div className="border-b border-aipify-border bg-aipify-surface-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <PlatformPreviewStrip items={parsePlatformPreview(marketing)} />
        </div>
      </div>

      <PlatformMapSection
        title={platformAuthority.mapTitle ?? ""}
        subtitle={platformAuthority.mapSubtitle ?? ""}
        centerLabel={platformAuthority.mapCenter ?? "Aipify Platform"}
        nodes={parsePlatformMapNodes(marketing)}
      />

      <PlatformArchitectureSection
        title={platformAuthority.architectureTitle ?? ""}
        subtitle={platformAuthority.architectureSubtitle ?? ""}
        layers={parseArchitectureLayers(marketing)}
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

      <ModuleShowcase
        title={modulesSection.title ?? ""}
        subtitle={modulesSection.subtitle ?? ""}
        modules={parseModules(marketing)}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatedProductDemo
          title={animatedDemo.title ?? ""}
          subtitle={animatedDemo.subtitle ?? ""}
          steps={parseDemoSteps(marketing)}
          mobileSummary={animatedDemo.mobileSummary ?? ""}
        />
      </div>

      <PlatformDifferentiationSection
        title={platformAuthority.differentiationTitle ?? ""}
        items={parseDifferentiationItems(marketing)}
      />

      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
