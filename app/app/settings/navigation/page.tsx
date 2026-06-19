import { NavigationPreferencesPanel } from "@/components/app/dynamic-navigation";
import { buildDynamicNavigationLabels } from "@/lib/dynamic-navigation/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function NavigationPreferencesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildDynamicNavigationLabels(t);

  return <NavigationPreferencesPanel labels={labels} />;
}
