import { HumanPotentialAugmentedWorkEngineDashboardPanel } from "@/components/app/human-potential-augmented-work-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function HumanPotentialAugmentedWorkEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "humanPotentialAugmentedWorkEngine");
  const t = createTranslator(dict);
  const p = "customerApp.humanPotentialAugmentedWorkEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <HumanPotentialAugmentedWorkEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          engagementScore: t(`${p}.engagementScore`),
          noRankingMode: t(`${p}.noRankingMode`),
          userOwnedReflections: t(`${p}.userOwnedReflections`),
          learningPending: t(`${p}.learningPending`),
          reflectionsActive: t(`${p}.reflectionsActive`),
          recognitionMoments: t(`${p}.recognitionMoments`),
          growthProfiles: t(`${p}.growthProfiles`),
          philosophy: t(`${p}.philosophy`),
          distinctionNote: t(`${p}.distinctionNote`),
          humanPotentialCenter: t(`${p}.humanPotentialCenter`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          learningRecommendations: t(`${p}.learningRecommendations`),
          reflectionEntries: t(`${p}.reflectionEntries`),
          recognitionMomentsSection: t(`${p}.recognitionMomentsSection`),
          augmentedWork: t(`${p}.augmentedWork`),
          strengthsIntelligence: t(`${p}.strengthsIntelligence`),
          meaningfulWork: t(`${p}.meaningfulWork`),
          careerDevelopment: t(`${p}.careerDevelopment`),
          reflectionPractice: t(`${p}.reflectionPractice`),
          augmentationPrinciples: t(`${p}.augmentationPrinciples`),
          growthCompanion: t(`${p}.growthCompanion`),
          selfLoveLink: t(`${p}.selfLoveLink`),
          companionLimitations: t(`${p}.companionLimitations`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          securityRequirements: t(`${p}.securityRequirements`),
          crossLinks: t(`${p}.crossLinks`),
          privacyNote: t(`${p}.privacyNote`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
