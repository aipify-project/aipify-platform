import { MarketObservatoryPanel } from "@/components/app/market-intelligence-operations";
import { buildMarketObservatoryLabels } from "@/lib/market-intelligence-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MarketObservatoryMarketsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "marketIntelligenceOperations");
  const labels = buildMarketObservatoryLabels(createTranslator(dict));
  return (
    <MarketObservatoryPanel
      backHref="/app/market-intelligence"
      initialTab="markets"
      visibleTabs={["overview", "markets", "industries", "trends", "threats", "executive"]}
      titleOverride={labels.marketsPage.title}
      subtitleOverride={labels.marketsPage.subtitle}
      labels={labels}
    />
  );
}
