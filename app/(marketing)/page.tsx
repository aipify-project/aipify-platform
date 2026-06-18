import {
  AnimatedProductDemo,
  CompanionOrbDemo,
  EnterpriseTrustSection,
  HeroSection,
  HowAipifyWorksSection,
  HumanOversightSection,
  MarketingCtaBand,
  ModuleShowcase,
  OutputEngineShowcase,
  PilotStorySection,
} from "@/components/marketing";
import type { OrbState } from "@/components/marketing/CompanionOrbDemo";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getSection,
  parseDemoSteps,
  parseModules,
  parseOrbStates,
  parseOutputs,
  parseOversightLadder,
  parsePilotHighlights,
  parseTrustPoints,
  parseWorkSteps,
} from "@/lib/marketing/parse-marketing";

export default async function MarketingHomePage() {
  const { marketing } = await getMarketingContext();

  const hero = getSection<Record<string, string>>(marketing, "hero");
  const animatedDemo = getSection<Record<string, string>>(marketing, "animatedDemo");
  const companionOrb = getSection<Record<string, string>>(marketing, "companionOrb");
  const enterpriseTrust = getSection<Record<string, string>>(marketing, "enterpriseTrust");
  const howItWorks = getSection<Record<string, string>>(marketing, "howItWorks");
  const modulesSection = getSection<Record<string, string>>(marketing, "modules");
  const pilot = getSection<Record<string, string>>(marketing, "pilot");
  const outputs = getSection<Record<string, string>>(marketing, "outputs");
  const humanOversight = getSection<Record<string, string>>(marketing, "humanOversight");
  const ctaBand = getSection<Record<string, string>>(marketing, "ctaBand");

  return (
    <>
      <HeroSection labels={hero as Parameters<typeof HeroSection>[0]["labels"]} />

      <AnimatedProductDemo
        title={animatedDemo.title ?? ""}
        subtitle={animatedDemo.subtitle ?? ""}
        steps={parseDemoSteps(marketing)}
        mobileSummary={animatedDemo.mobileSummary ?? ""}
      />

      <CompanionOrbDemo
        title={companionOrb.title ?? ""}
        subtitle={companionOrb.subtitle ?? ""}
        clickHint={companionOrb.clickHint ?? ""}
        states={parseOrbStates(marketing) as Record<OrbState, { label: string; description: string }>}
      />

      <EnterpriseTrustSection
        title={enterpriseTrust.title ?? ""}
        subtitle={enterpriseTrust.subtitle ?? ""}
        points={parseTrustPoints(marketing)}
      />

      <HowAipifyWorksSection
        title={howItWorks.title ?? ""}
        subtitle={howItWorks.subtitle ?? ""}
        steps={parseWorkSteps(marketing)}
      />

      <ModuleShowcase
        title={modulesSection.title ?? ""}
        subtitle={modulesSection.subtitle ?? ""}
        modules={parseModules(marketing)}
      />

      <PilotStorySection
        title={pilot.title ?? ""}
        subtitle={pilot.subtitle ?? ""}
        description={pilot.description ?? ""}
        highlights={parsePilotHighlights(marketing)}
        cta={pilot.cta ?? ""}
      />

      <OutputEngineShowcase
        title={outputs.title ?? ""}
        subtitle={outputs.subtitle ?? ""}
        items={parseOutputs(marketing)}
      />

      <HumanOversightSection
        title={humanOversight.title ?? ""}
        subtitle={humanOversight.subtitle ?? ""}
        ladder={parseOversightLadder(marketing)}
      />

      <MarketingCtaBand
        title={ctaBand.title ?? ""}
        subtitle={ctaBand.subtitle ?? ""}
        button={ctaBand.button ?? ""}
      />
    </>
  );
}
