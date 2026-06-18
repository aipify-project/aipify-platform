import { GrowthPartnerOperationsCenterPanel } from "@/components/app/growth-partner-operations-center";
import { buildGrowthPartnerOperationsCenterLabels } from "@/lib/growth-partner-operations-center/labels";
import type { GrowthPartnerOpsSection } from "@/lib/growth-partner-operations-center";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function GrowthPartnerOpsSectionPage({
  activeSection,
}: {
  activeSection: GrowthPartnerOpsSection;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "growthPartnerOperationsCenter");
  const t = createTranslator(dict);
  const labels = buildGrowthPartnerOperationsCenterLabels(t);

  return <GrowthPartnerOperationsCenterPanel labels={labels} activeSection={activeSection} />;
}
