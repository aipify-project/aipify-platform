import { IndustryPackEcosystemEngineDashboardPanel } from "@/components/app/industry-pack-ecosystem-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IndustryPacksPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.industryPackEcosystemEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    architectureTitle: t(`${p}.architectureTitle`),
    installedTitle: t(`${p}.installedTitle`),
    availableTitle: t(`${p}.availableTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    governanceTitle: t(`${p}.governanceTitle`),
    marketplaceTitle: t(`${p}.marketplaceTitle`),
    marketplaceNote: t(`${p}.marketplaceNote`),
    openMarketplace: t(`${p}.openMarketplace`),
    metricInstalled: t(`${p}.metricInstalled`),
    metricAvailable: t(`${p}.metricAvailable`),
    metricMarketplace: t(`${p}.metricMarketplace`),
    metricHealth: t(`${p}.metricHealth`),
    noInstalled: t(`${p}.noInstalled`),
    health: t(`${p}.health`),
    recommendation: t(`${p}.recommendation`),
    installPack: t(`${p}.installPack`),
    installing: t(`${p}.installing`),
    installFailed: t(`${p}.installFailed`),
    upgradePack: t(`${p}.upgradePack`),
    upgrading: t(`${p}.upgrading`),
    upgradeFailed: t(`${p}.upgradeFailed`),
    businessPacksCrossLink: t(`${p}.businessPacksCrossLink`),
    businessPacksLink: t(`${p}.businessPacksLink`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <IndustryPackEcosystemEngineDashboardPanel labels={labels} />
    </div>
  );
}
