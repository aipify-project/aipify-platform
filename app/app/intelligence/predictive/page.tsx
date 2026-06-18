import { PredictiveIntelligencePanel } from "@/components/app/app-portal/PredictiveIntelligencePanel";
import { buildPredictiveIntelligenceLabels } from "@/lib/app-portal/predictive-intelligence";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PredictiveIntelligencePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <PredictiveIntelligencePanel labels={buildPredictiveIntelligenceLabels(t)} />
    </div>
  );
}
