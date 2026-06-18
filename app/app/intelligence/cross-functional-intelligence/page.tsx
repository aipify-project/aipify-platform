import { CrossFunctionalIntelligencePanel } from "@/components/app/app-portal/CrossFunctionalIntelligencePanel";
import { buildCFILabels } from "@/lib/app-portal/cross-functional-intelligence";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CrossFunctionalIntelligencePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <CrossFunctionalIntelligencePanel labels={buildCFILabels(t)} />
    </div>
  );
}
