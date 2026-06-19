import { BusinessContinuityPanel } from "@/components/app/business-continuity";
import { buildBusinessContinuityLabels } from "@/lib/business-continuity-engine/labels";
import type { Bc607Section } from "@/lib/business-continuity-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function BusinessContinuitySectionPage({
  activeSection,
  rpcSection,
}: {
  activeSection: Bc607Section;
  rpcSection?: string;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "businessContinuity");
  const t = createTranslator(dict);
  return (
    <BusinessContinuityPanel
      labels={buildBusinessContinuityLabels(t)}
      activeSection={activeSection}
      rpcSection={rpcSection}
    />
  );
}
