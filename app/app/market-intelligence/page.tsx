import { MarketObservatoryPanel } from "@/components/app/market-intelligence-operations";
import { buildMarketObservatoryLabels } from "@/lib/market-intelligence-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MarketIntelligencePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "marketIntelligenceOperations");
  return (
    <MarketObservatoryPanel backHref="/app" labels={buildMarketObservatoryLabels(createTranslator(dict))} />
  );
}
