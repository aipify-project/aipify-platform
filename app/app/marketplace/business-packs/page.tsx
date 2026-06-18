import { BusinessPackMarketplaceHomePanel } from "@/components/app/business-pack-marketplace-engine";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackMarketplacePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);
  const p = "customerApp.businessPackMarketplace";
  const c = "customerApp.common";

  const sectionKeys = [
    "recommended_for_you", "installed", "popular", "recently_added", "continue_setup", "upgrade_opportunities",
  ] as const;
  const statusKeys = ["installed", "available", "upgrade_required", "trial_available", "active", "beta", "coming_soon"] as const;
  const categoryKeys = [
    "hospitality", "commerce", "support", "executive", "operations",
    "human_resources", "marketing", "intelligence", "productivity", "governance",
  ] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    engineTitle: t(`${p}.engineTitle`),
    version: t(`${p}.version`),
    trialAvailable: t(`${p}.trialAvailable`),
    trialDaysLeft: t(`${p}.trialDaysLeft`),
    viewDetails: t(`${p}.viewDetails`),
    openWorkspace: t(`${p}.openWorkspace`),
    upgrade: t(`${p}.upgrade`),
    startTrial: t(`${p}.startTrial`),
    install: t(`${p}.install`),
    actionFailed: t(`${p}.actionFailed`),
    actionSuccess: t(`${p}.actionSuccess`),
    emptyRecommendedTitle: t(`${p}.emptyRecommendedTitle`),
    emptyRecommendedMessage: t(`${p}.emptyRecommendedMessage`),
    emptyInstalledTitle: t(`${p}.emptyInstalledTitle`),
    emptyInstalledMessage: t(`${p}.emptyInstalledMessage`),
  };

  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of statusKeys) labels[`status_${key}`] = t(`${p}.statuses.${key}`);
  for (const key of categoryKeys) labels[`category_${key}`] = t(`${p}.categories.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.pageTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </header>
      <BusinessPackMarketplaceHomePanel labels={labels} locale={locale} />
    </div>
  );
}
