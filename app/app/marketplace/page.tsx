import { MarketplaceDashboardPanel } from "@/components/app/marketplace";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MarketplacePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.marketplace";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <MarketplaceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          catalog: t(`${p}.catalog`),
          installed: t(`${p}.installed`),
          skillStore: t(`${p}.skillStore`),
          recommended: t(`${p}.recommended`),
          featured: t(`${p}.featured`),
          free: t(`${p}.free`),
          principle: t(`${p}.principle`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          skillCategories: t(`${p}.skillCategories`),
          extensionsMarketplace: t(`${p}.extensionsMarketplace`),
          installFlow: t(`${p}.installFlow`),
          companionAdaptation: t(`${p}.companionAdaptation`),
          qaPrinciples: t(`${p}.qaPrinciples`),
          developerEcosystem: t(`${p}.developerEcosystem`),
          integrationLinks: t(`${p}.integrationLinks`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          catalogItems: t(`${p}.catalogItems`),
          installedCount: t(`${p}.installed`),
          updatesAvailable: t(`${p}.updatesAvailable`),
          marketplaceGovernance: t(`${p}.marketplaceGovernance`),
          openMarketplaceGovernance: t(`${p}.openMarketplaceGovernance`),
        }}
      />
    </div>
  );
}
