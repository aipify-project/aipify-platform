import { MarketingBrandOperationsPanel } from "@/components/app/marketing-brand-operations";
import { buildMarketingBrandOperationsLabels } from "@/lib/marketing-brand-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MarketingPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildMarketingBrandOperationsLabels(t);

  return <MarketingBrandOperationsPanel labels={labels} />;
}
