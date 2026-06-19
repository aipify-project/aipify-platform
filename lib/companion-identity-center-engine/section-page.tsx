import { CompanionIdentityCenterPanel } from "@/components/app/companion-identity-center";
import { buildCompanionIdentityCenterLabels } from "@/lib/companion-identity-center-engine/labels";
import type { Cipa595Section } from "@/lib/companion-identity-center-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function CompanionIdentityCenterSectionPage({ activeSection }: { activeSection: Cipa595Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "companionIdentityCenter");
  const t = createTranslator(dict);
  return (
    <CompanionIdentityCenterPanel labels={buildCompanionIdentityCenterLabels(t)} activeSection={activeSection} />
  );
}
