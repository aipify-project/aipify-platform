import { BusinessPackMarketplaceEngineDashboardPanel } from "@/components/app/business-pack-marketplace-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackMarketplaceEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "businessPackMarketplaceEngine");
  const t = createTranslator(dict);
  const p = "customerApp.businessPackMarketplaceEngine";

  const labels: Record<string, string> = {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    engineTitle: t(`${p}.engineTitle`),
    publishedListings: t(`${p}.publishedListings`),
    totalViews: t(`${p}.totalViews`),
    trialActivations: t(`${p}.trialActivations`),
    installations: t(`${p}.installations`),
    upgradeConversions: t(`${p}.upgradeConversions`),
    analyticsEvents: t(`${p}.analyticsEvents`),
    inProgressInstalls: t(`${p}.inProgressInstalls`),
    governance: t(`${p}.governance`),
    catalogTitle: t(`${p}.catalogTitle`),
    viewListing: t(`${p}.viewListing`),
    views: t(`${p}.views`),
    forbiddenTitle: t(`${p}.forbiddenTitle`),
    openMarketplace: t(`${p}.openMarketplace`),
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </header>
      <BusinessPackMarketplaceEngineDashboardPanel labels={labels} />
    </div>
  );
}
