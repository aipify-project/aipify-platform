import { EvolutionCenterPanel } from "@/components/app/evolution-center";
import { buildEvolutionCenterLabels } from "@/lib/evolution-center-engine/labels";
import type { Ce600Section } from "@/lib/evolution-center-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function EvolutionCenterSectionPage({ activeSection }: { activeSection: Ce600Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "evolutionCenter");
  const t = createTranslator(dict);
  return <EvolutionCenterPanel labels={buildEvolutionCenterLabels(t)} activeSection={activeSection} />;
}
