import { PlatformCommercialIntelligencePanel } from "@/components/platform/commercial-intelligence";
import { buildPlatformCommercialIntelligenceLabels } from "@/lib/commercial-intelligence-engine/labels";
import type { Roci588PlatformSection } from "@/lib/commercial-intelligence-engine/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function PlatformCommercialIntelligenceSectionPage({
  section,
}: {
  section: Roci588PlatformSection;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformCommercialIntelligenceLabels(t);

  return (
    <PlatformCommercialIntelligencePanel
      labels={labels}
      section={section}
      backHref="/platform/revenue"
    />
  );
}
