import { MarketplaceSelfServiceActivationDashboardPanel } from "@/components/app/marketplace-self-service-activation";
import { AipifyHostsUpgradeSignalsBanner } from "@/components/app/aipify-hosts-upgrade-signals";
import { buildHostsUpgradeSignalsBannerLabels } from "@/lib/aipify/aipify-hosts-upgrade-signals";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MarketplaceSelfServiceActivationPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp", "hosts"]);
  const t = createTranslator(dict);
  const p = "customerApp.marketplaceSelfService";
  const bannerLabels = buildHostsUpgradeSignalsBannerLabels(t);
  const c = "customerApp.common";

  const sectionKeys = ["installed", "recommended", "discover", "trials", "billing"] as const;
  const statusKeys = ["installed", "available", "upgrade_required", "trial_available"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    activationFlow: t(`${p}.activationFlow`),
    trialAvailable: t(`${p}.trialAvailable`),
    openWorkspace: t(`${p}.openWorkspace`),
    upgradeToActivate: t(`${p}.upgradeToActivate`),
    startTrial: t(`${p}.startTrial`),
    activate: t(`${p}.activate`),
    oneClickUpgrade: t(`${p}.oneClickUpgrade`),
    viewAddon: t(`${p}.viewAddon`),
    actionFailed: t(`${p}.actionFailed`),
    activationSuccess: t(`${p}.activationSuccess`),
    trialSuccess: t(`${p}.trialSuccess`),
    addonSuccess: t(`${p}.addonSuccess`),
    billingOverview: t(`${p}.billingOverview`),
    currentPlan: t(`${p}.currentPlan`),
    subscriptionStatus: t(`${p}.subscriptionStatus`),
    manageBilling: t(`${p}.manageBilling`),
    viewPlans: t(`${p}.viewPlans`),
    addonModules: t(`${p}.addonModules`),
    emptyRecommendedTitle: t(`${p}.emptyRecommendedTitle`),
    emptyRecommendedMessage: t(`${p}.emptyRecommendedMessage`),
    emptyDiscoverTitle: t(`${p}.emptyDiscoverTitle`),
    emptyDiscoverMessage: t(`${p}.emptyDiscoverMessage`),
    backToMarketplace: t(`${p}.backToMarketplace`),
  };

  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of statusKeys) labels[`status_${key}`] = t(`${p}.statuses.${key}`);
  labels.empty_installed_title = t(`${p}.emptyInstalledTitle`);
  labels.empty_installed_message = t(`${p}.emptyInstalledMessage`);
  labels.empty_trials_title = t(`${p}.emptyTrialsTitle`);
  labels.empty_trials_message = t(`${p}.emptyTrialsMessage`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.pageTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsUpgradeSignalsBanner labels={bannerLabels} surface="marketplace" compact />
      <MarketplaceSelfServiceActivationDashboardPanel labels={labels} />
    </div>
  );
}
