import { IntegrationCenterPanel } from "@/components/app/integration-center";
import { buildIntegrationCenterLabels } from "@/lib/integration-center-engine/labels";
import type { Oih592Section } from "@/lib/integration-center-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function IntegrationCenterSectionPage({ activeSection }: { activeSection: Oih592Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "integrationCenter");
  const t = createTranslator(dict);
  return <IntegrationCenterPanel labels={buildIntegrationCenterLabels(t)} activeSection={activeSection} />;
}
