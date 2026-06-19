import { CompensationPanel } from "@/components/app/compensation";
import { buildCompensationLabels } from "@/lib/compensation-engine/labels";
import type { Cmp614Section } from "@/lib/compensation-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function CompensationSectionPage({ activeSection }: { activeSection: Cmp614Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "compensation");
  const t = createTranslator(dict);
  return <CompensationPanel labels={buildCompensationLabels(t)} activeSection={activeSection} />;
}
