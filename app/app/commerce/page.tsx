import { CommerceRetailOperationsPackDashboardPanel } from "@/components/app/commerce-retail-operations-pack";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CommercePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "commerceRetailOperationsPack");
  const t = createTranslator(dict);
  const p = "customerApp.commerceRetailOperationsPack";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    operationsTitle: t(`${p}.operationsTitle`),
    storesTitle: t(`${p}.storesTitle`),
    productsTitle: t(`${p}.productsTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    platformsTitle: t(`${p}.platformsTitle`),
    legacyModulesTitle: t(`${p}.legacyModulesTitle`),
    metricStores: t(`${p}.metricStores`),
    metricProducts: t(`${p}.metricProducts`),
    metricOrders: t(`${p}.metricOrders`),
    metricRevenue: t(`${p}.metricRevenue`),
    metricProfit: t(`${p}.metricProfit`),
    metricCustomers: t(`${p}.metricCustomers`),
    metricConversion: t(`${p}.metricConversion`),
    metricHealth: t(`${p}.metricHealth`),
    noStores: t(`${p}.noStores`),
    noProducts: t(`${p}.noProducts`),
    noAdvisor: t(`${p}.noAdvisor`),
    recommendation: t(`${p}.recommendation`),
    storeNamePlaceholder: t(`${p}.storeNamePlaceholder`),
    platformCustom: t(`${p}.platformCustom`),
    platformShopify: t(`${p}.platformShopify`),
    platformWooCommerce: t(`${p}.platformWooCommerce`),
    platformMagento: t(`${p}.platformMagento`),
    platformBigCommerce: t(`${p}.platformBigCommerce`),
    addStore: t(`${p}.addStore`),
    creating: t(`${p}.creating`),
    createFailed: t(`${p}.createFailed`),
    openIntelligence: t(`${p}.openIntelligence`),
    openAutomation: t(`${p}.openAutomation`),
    openDropshipping: t(`${p}.openDropshipping`),
    openPerformance: t(`${p}.openPerformance`),
    openMultiStore: t(`${p}.openMultiStore`),
    openCompanion: t(`${p}.openCompanion`),
    openGlobalExpansion: t(`${p}.openGlobalExpansion`),
    openExecutive: t(`${p}.openExecutive`),
    commerceCrossLink: t(`${p}.commerceCrossLink`),
    commerceIntelligenceLink: t(`${p}.commerceIntelligenceLink`),
    industryPacksLink: t(`${p}.industryPacksLink`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CommerceRetailOperationsPackDashboardPanel labels={labels} />
    </div>
  );
}
