import { ModulesAdminPanel } from "@/components/app/settings/ModulesAdminPanel";
import { buildModulesAdminPanelLabels } from "@/lib/commercial-packages/modules-panel-labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ModulesSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);

  return <ModulesAdminPanel labels={buildModulesAdminPanelLabels(t)} />;
}
