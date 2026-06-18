import { ModuleAccessPanel } from "@/components/app/settings/ModuleAccessPanel";
import { buildModuleRegistryLabels } from "@/lib/module-registry/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ModuleAccessSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildModuleRegistryLabels(t);

  return <ModuleAccessPanel labels={labels} />;
}
