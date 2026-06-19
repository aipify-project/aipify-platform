import { AosCenterPanel } from "@/components/app/aos-center";
import { buildAosCenterLabels } from "@/lib/aos-center-engine/labels";
import type { Aos599Section } from "@/lib/aos-center-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function AosCenterSectionPage({ activeSection }: { activeSection: Aos599Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "aosCenter");
  const t = createTranslator(dict);
  return <AosCenterPanel labels={buildAosCenterLabels(t)} activeSection={activeSection} />;
}
