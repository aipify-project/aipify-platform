import type { Metadata } from "next";
import { MarketingCtaBand, MarketingDifferentiationStrip, MarketingPageHeader, PilotStorySection, SinceLastLoginSection } from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, parseCtaBandLabels, parsePilotHighlights, parseStringList } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ pilotTitle?: string; pilotDescription?: string }>(marketing, "meta");
  return { title: meta.pilotTitle, description: meta.pilotDescription };
}

export default async function PilotPage() {
  const { marketing } = await getMarketingContext();
  const pilot = getSection<Record<string, string>>(marketing, "pilot");
  const ctaBand = parseCtaBandLabels(marketing);

  return (
    <>
      <MarketingPageHeader title={pilot.title ?? ""} subtitle={pilot.subtitle} />
      <MarketingDifferentiationStrip themes={parseStringList(marketing, "differentiationStrip", "themes")} />
      <PilotStorySection
        title={pilot.title ?? ""}
        subtitle={pilot.subtitle ?? ""}
        description={pilot.description ?? ""}
        highlights={parsePilotHighlights(marketing)}
        cta={pilot.cta ?? ""}
        validationTitle={pilot.validationTitle}
      />
      <SinceLastLoginSection
        compact
        title={getSection<{ title?: string }>(marketing, "sinceLastLogin").title ?? ""}
        panelLabel={getSection<{ panelLabel?: string }>(marketing, "sinceLastLogin").panelLabel ?? ""}
        items={parseStringList(marketing, "sinceLastLogin", "items")}
      />
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
