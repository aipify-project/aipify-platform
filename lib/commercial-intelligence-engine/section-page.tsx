import { CommercialIntelligencePanel } from "@/components/app/commercial-intelligence";
import { buildCommercialIntelligenceLabels } from "@/lib/commercial-intelligence-engine/labels";
import type { Roci588CustomerSection } from "@/lib/commercial-intelligence-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function CommercialIntelligenceSectionPage({
  activeSection,
}: {
  activeSection: Roci588CustomerSection;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "commercialIntelligence");
  const t = createTranslator(dict);
  const labels = buildCommercialIntelligenceLabels(t);

  return <CommercialIntelligencePanel labels={labels} activeSection={activeSection} />;
}
