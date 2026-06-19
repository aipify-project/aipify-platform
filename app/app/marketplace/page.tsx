import { MarketplaceOperationsPanel } from "@/components/app/marketplace-operations";
import { buildMarketplaceOperationsLabels } from "@/lib/marketplace-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MarketplacePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildMarketplaceOperationsLabels(t);
  return <MarketplaceOperationsPanel labels={labels} />;
}
