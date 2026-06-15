import { AipifyHostsMarketplaceDashboardPanel } from "@/components/app/aipify-hosts-marketplace";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsMarketplacePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsMarketplace";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsMarketplaceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          errorTitle: t(`${p}.errorTitle`),
          errorMessage: t(`${p}.errorMessage`),
          retry: t(`${p}.retry`),
          backToHosts: t(`${p}.backToHosts`),
          foundationNote: t(`${p}.foundationNote`),
          openRequests: t(`${p}.openRequests`),
          upcomingServices: t(`${p}.upcomingServices`),
          verifiedProviders: t(`${p}.verifiedProviders`),
          avgRating: t(`${p}.avgRating`),
          searchProviders: t(`${p}.searchProviders`),
          searchPlaceholder: t(`${p}.searchPlaceholder`),
          allCategories: t(`${p}.allCategories`),
          search: t(`${p}.search`),
          openRequestsTitle: t(`${p}.openRequestsTitle`),
          upcomingServicesTitle: t(`${p}.upcomingServicesTitle`),
          emptyOpenTitle: t(`${p}.emptyOpenTitle`),
          emptyOpenMessage: t(`${p}.emptyOpenMessage`),
          emptyUpcomingTitle: t(`${p}.emptyUpcomingTitle`),
          emptyUpcomingMessage: t(`${p}.emptyUpcomingMessage`),
          savedFavorites: t(`${p}.savedFavorites`),
          providersDirectory: t(`${p}.providersDirectory`),
          emptyProvidersTitle: t(`${p}.emptyProvidersTitle`),
          emptyProvidersMessage: t(`${p}.emptyProvidersMessage`),
          clearFilters: t(`${p}.clearFilters`),
          compareProviders: t(`${p}.compareProviders`),
          company: t(`${p}.company`),
          rating: t(`${p}.rating`),
          coverageArea: t(`${p}.coverageArea`),
          availability: t(`${p}.availability`),
          providerPerformance: t(`${p}.providerPerformance`),
          completedJobs: t(`${p}.completedJobs`),
          onTimeCompletion: t(`${p}.onTimeCompletion`),
          outstandingApprovals: t(`${p}.outstandingApprovals`),
          modules: t(`${p}.modules`),
          included: t(`${p}.included`),
          futureOpportunities: t(`${p}.futureOpportunities`),
          verified: t(`${p}.verified`),
          saveFavorite: t(`${p}.saveFavorite`),
          removeFavorite: t(`${p}.removeFavorite`),
          requestService: t(`${p}.requestService`),
          requestServiceTitle: t(`${p}.requestServiceTitle`),
          requestServiceFor: t(`${p}.requestServiceFor`),
          requestSummaryPlaceholder: t(`${p}.requestSummaryPlaceholder`),
          submitRequest: t(`${p}.submitRequest`),
          cancel: t(`${p}.cancel`),
          status_requested: t(`${p}.status.requested`),
          status_accepted: t(`${p}.status.accepted`),
          status_scheduled: t(`${p}.status.scheduled`),
          status_in_progress: t(`${p}.status.inProgress`),
          status_completed: t(`${p}.status.completed`),
          status_cancelled: t(`${p}.status.cancelled`),
        }}
      />
    </div>
  );
}
