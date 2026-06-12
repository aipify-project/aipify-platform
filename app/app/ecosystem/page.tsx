import { EcosystemDashboardPanel } from "@/components/app/ecosystem-intelligence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EcosystemPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.ecosystemIntelligence";
  const b = `${p}.blueprint.phase88`;

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
          phase88Title: t(`${b}.phase88Title`),
          blueprintObjectives: t(`${b}.blueprintObjectives`),
          blueprintRelationshipCategories: t(`${b}.blueprintRelationshipCategories`),
          relationshipInsights: t(`${b}.relationshipInsights`),
          partnershipHealth: t(`${b}.partnershipHealth`),
          customerRelationshipIntelligence: t(`${b}.customerRelationshipIntelligence`),
          communityConnection: t(`${b}.communityConnection`),
          companionGuidance: t(`${b}.companionGuidance`),
          leadershipInsights: t(`${b}.leadershipInsights`),
          selfLoveConnection: t(`${b}.selfLoveConnection`),
          trustConnection: t(`${b}.trustConnection`),
          limitationPrinciples: t(`${b}.limitationPrinciples`),
          engagementSummary: t(`${b}.engagementSummary`),
          activeRelationships: t(`${b}.activeRelationships`),
          openRisksCount: t(`${b}.openRisksCount`),
          openOpportunities: t(`${b}.openOpportunities`),
          successCriteria: t(`${b}.successCriteria`),
          criterionMet: t(`${b}.criterionMet`),
          criterionPending: t(`${b}.criterionPending`),
          visionPhrases: t(`${b}.visionPhrases`),
          forbidden: t(`${b}.forbidden`),
          required: t(`${b}.required`),
        }}
      />
    </div>
  );
}
