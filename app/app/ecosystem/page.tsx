import { EcosystemDashboardPanel } from "@/components/app/ecosystem-intelligence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EcosystemPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.ecosystemIntelligence";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EcosystemDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          ecosystemScore: t(`${p}.ecosystemScore`),
          generateBriefing: t(`${p}.generateBriefing`),
          scoreComponents: t(`${p}.scoreComponents`),
          relationshipMaps: t(`${p}.relationshipMaps`),
          noRelationships: t(`${p}.noRelationships`),
          dependency: t(`${p}.dependency`),
          primaryOwner: t(`${p}.primaryOwner`),
          secondaryOwner: t(`${p}.secondaryOwner`),
          continuityOwner: t(`${p}.continuityOwner`),
          criticalDependencies: t(`${p}.criticalDependencies`),
          noDependencies: t(`${p}.noDependencies`),
          externalRisks: t(`${p}.externalRisks`),
          noRisks: t(`${p}.noRisks`),
          partnershipOpportunities: t(`${p}.partnershipOpportunities`),
          noOpportunities: t(`${p}.noOpportunities`),
          briefings: t(`${p}.briefings`),
          relationshipCategories: t(`${p}.relationshipCategories`),
          reviewFrequencies: t(`${p}.reviewFrequencies`),
          consentNote: t(`${p}.consentNote`),
        }}
      />
    </div>
  );
}
