import { FormsDataCollectionPanel } from "@/components/app/forms-data-collection";
import { buildFormsDataCollectionLabels } from "@/lib/forms-data-collection/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function FormsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildFormsDataCollectionLabels(t);

  return <FormsDataCollectionPanel labels={labels} />;
}
