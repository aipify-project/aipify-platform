import { UniversalSearchPanel } from "@/components/app/universal-search-operations";
import { buildUniversalSearchLabels } from "@/lib/universal-search-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function UniversalSearchPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildUniversalSearchLabels(t);
  return <UniversalSearchPanel labels={labels} initialTab="search" />;
}
