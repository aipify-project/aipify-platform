import { CompanionMemoryCenterPanel } from "@/components/app/companion-memory-center";
import { buildCompanionMemoryCenterLabels } from "@/lib/companion-memory-center-engine/labels";
import type { Cmri594Section } from "@/lib/companion-memory-center-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function CompanionMemoryCenterSectionPage({ activeSection }: { activeSection: Cmri594Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "companionMemoryCenter");
  const t = createTranslator(dict);
  return (
    <CompanionMemoryCenterPanel labels={buildCompanionMemoryCenterLabels(t)} activeSection={activeSection} />
  );
}
