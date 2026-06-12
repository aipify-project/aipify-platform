import type { Metadata } from "next";
import { MarketingCtaBand, MarketingPageHeader, PilotStorySection } from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, parsePilotHighlights } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ pilotTitle?: string; pilotDescription?: string }>(marketing, "meta");
  return { title: meta.pilotTitle, description: meta.pilotDescription };
}

export default async function PilotPage() {
  const { marketing } = await getMarketingContext();
  const pilot = getSection<Record<string, string>>(marketing, "pilot");
  const ctaBand = getSection<Record<string, string>>(marketing, "ctaBand");

  return (
    <>
      <MarketingPageHeader title={pilot.title ?? ""} subtitle={pilot.subtitle} />
      <PilotStorySection
        title={pilot.title ?? ""}
        subtitle={pilot.subtitle ?? ""}
        description={pilot.description ?? ""}
        highlights={parsePilotHighlights(marketing)}
        cta={pilot.cta ?? ""}
      />
      <MarketingCtaBand title={ctaBand.title ?? ""} subtitle={ctaBand.subtitle ?? ""} button={ctaBand.button ?? ""} />
    </>
  );
}
