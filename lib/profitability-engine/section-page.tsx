import { ProfitabilityPanel } from "@/components/app/profitability";
import { buildProfitabilityLabels } from "@/lib/profitability-engine/labels";
import type { Prof615Section } from "@/lib/profitability-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function ProfitabilitySectionPage({ activeSection }: { activeSection: Prof615Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "profitability");
  const t = createTranslator(dict);
  return <ProfitabilityPanel labels={buildProfitabilityLabels(t)} activeSection={activeSection} />;
}
