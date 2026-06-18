import { AppStoreHomePanel } from "@/components/app/app-store";
import { buildAppStoreLabels } from "@/lib/app-store/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppStorePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["marketplace"]);
  const t = createTranslator(dict);
  const labels = buildAppStoreLabels(t);

  return <AppStoreHomePanel labels={labels} locale={locale} />;
}
