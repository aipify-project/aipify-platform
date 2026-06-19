import { StrategyCenterPanel } from "@/components/app/strategy-center";
import { buildStrategyCenterLabels } from "@/lib/strategy-center-engine/labels";
import type { Sibo589Section } from "@/lib/strategy-center-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function StrategyCenterSectionPage({ activeSection }: { activeSection: Sibo589Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "strategyCenter");
  const t = createTranslator(dict);
  return <StrategyCenterPanel labels={buildStrategyCenterLabels(t)} activeSection={activeSection} />;
}
