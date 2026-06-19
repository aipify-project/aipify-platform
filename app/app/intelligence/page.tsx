import { StrategicIntelligencePanel } from "@/components/app/strategic-intelligence-operations";
import { buildStrategicIntelligenceLabels } from "@/lib/strategic-intelligence-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function StrategicIntelligencePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildStrategicIntelligenceLabels(t);
  return <StrategicIntelligencePanel labels={labels} />;
}
