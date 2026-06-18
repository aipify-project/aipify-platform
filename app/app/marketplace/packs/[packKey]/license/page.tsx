import { BusinessPackLicenseCenterPanel } from "@/components/app/business-pack-license-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ packKey: string }> };

export default async function BusinessPackLicensePage({ params }: PageProps) {
  const { packKey } = await params;
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "businessPackLicense");
  const t = createTranslator(dict);
  const p = "customerApp.businessPackLicense";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    notFoundTitle: t(`${p}.notFoundTitle`),
    notFoundMessage: t(`${p}.notFoundMessage`),
    backToMarketplace: t(`${p}.backToMarketplace`),
    viewPack: t(`${p}.viewPack`),
    licenseCenter: t(`${p}.licenseCenter`),
    overview: t(`${p}.overview`),
    currentPlan: t(`${p}.currentPlan`),
    currentTier: t(`${p}.currentTier`),
    licenseStatus: t(`${p}.licenseStatus`),
    billingFrequency: t(`${p}.billingFrequency`),
    renewalDate: t(`${p}.renewalDate`),
    notScheduled: t(`${p}.notScheduled`),
    trialEnds: t(`${p}.trialEnds`),
    usageSection: t(`${p}.usageSection`),
    capacityUsed: t(`${p}.capacityUsed`),
    capacityRemaining: t(`${p}.capacityRemaining`),
    usageTrend: t(`${p}.usageTrend`),
    ofCapacity: t(`${p}.ofCapacity`),
    upgradeSection: t(`${p}.upgradeSection`),
    upgrade: t(`${p}.upgrade`),
    upgradeNow: t(`${p}.upgradeNow`),
    monthly: t(`${p}.monthly`),
    customCapacity: t(`${p}.customCapacity`),
    contactSales: t(`${p}.contactSales`),
    capacityUnit: t(`${p}.capacityUnit`),
    featureComparison: t(`${p}.featureComparison`),
    feature: t(`${p}.feature`),
    entry: t(`${p}.entry`),
    growth: t(`${p}.growth`),
    professional: t(`${p}.professional`),
    enterprise: t(`${p}.enterprise`),
    atCapacityTitle: t(`${p}.atCapacityTitle`),
    atCapacityMessage: t(`${p}.atCapacityMessage`),
    actionFailed: t(`${p}.actionFailed`),
    upgradeSuccess: t(`${p}.upgradeSuccess`),
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <BusinessPackLicenseCenterPanel packKey={packKey} labels={labels} />
    </div>
  );
}
