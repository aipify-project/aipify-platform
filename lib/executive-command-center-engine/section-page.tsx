import { ExecutiveCommandCenterPanel } from "@/components/app/executive-command-center";
import { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import type { Ecc590Section } from "@/lib/executive-command-center-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function ExecutiveCommandCenterSectionPage({ activeSection }: { activeSection: Ecc590Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "executiveCommandCenter");
  const t = createTranslator(dict);
  return <ExecutiveCommandCenterPanel labels={buildExecutiveCommandCenterLabels(t)} activeSection={activeSection} />;
}
