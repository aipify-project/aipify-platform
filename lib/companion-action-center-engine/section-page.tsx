import { CompanionActionCenterPanel } from "@/components/app/companion-action-center";
import { buildCompanionActionCenterLabels } from "@/lib/companion-action-center-engine/labels";
import type { Care593Section } from "@/lib/companion-action-center-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function CompanionActionCenterSectionPage({ activeSection }: { activeSection: Care593Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "companionActionCenter");
  const t = createTranslator(dict);
  return (
    <CompanionActionCenterPanel labels={buildCompanionActionCenterLabels(t)} activeSection={activeSection} />
  );
}
