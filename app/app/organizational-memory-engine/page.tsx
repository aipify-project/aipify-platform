import { OrganizationalMemoryEngineDashboardPanel } from "@/components/app/organizational-memory-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalMemoryEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalMemoryEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OrganizationalMemoryEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          legacyMemory: t(`${p}.legacyMemory`),
          learningEngine: t(`${p}.learningEngine`),
          personalMemory: t(`${p}.personalMemory`),
          activeRecords: t(`${p}.activeRecords`),
          archivedRecords: t(`${p}.archivedRecords`),
          activeDecisions: t(`${p}.activeDecisions`),
          pendingReviews: t(`${p}.pendingReviews`),
          recentLearnings: t(`${p}.recentLearnings`),
          recurringThemes: t(`${p}.recurringThemes`),
          frequentlyReferenced: t(`${p}.frequentlyReferenced`),
          archivedDecisions: t(`${p}.archivedDecisions`),
          recommendedReviews: t(`${p}.recommendedReviews`),
          memoryLevels: t(`${p}.memoryLevels`),
          memoryCategories: t(`${p}.memoryCategories`),
          memoryCapabilities: t(`${p}.memoryCapabilities`),
          successCriteria: t(`${p}.successCriteria`),
          trustConnection: t(`${p}.trustConnection`),
          integrationLinks: t(`${p}.integrationLinks`),
          references: t(`${p}.references`),
          noItems: t(`${p}.noItems`),
          principles: t(`${p}.principles`),
          continuityTitle: t(`${p}.continuityTitle`),
          continuityObjectives: t(`${p}.continuityObjectives`),
          continuityMemoryCategories: t(`${p}.continuityMemoryCategories`),
          organizationalContinuity: t(`${p}.organizationalContinuity`),
          individualContinuity: t(`${p}.individualContinuity`),
          memoryManagement: t(`${p}.memoryManagement`),
          continuitySelfLove: t(`${p}.continuitySelfLove`),
          continuityTrustPrivacy: t(`${p}.continuityTrustPrivacy`),
          continuityCompanionPrinciples: t(`${p}.continuityCompanionPrinciples`),
          continuitySummary: t(`${p}.continuitySummary`),
          continuitySuccessCriteria: t(`${p}.continuitySuccessCriteria`),
          continuityIntegrationLinks: t(`${p}.continuityIntegrationLinks`),
          legacyEngine: t(`${p}.legacyEngine`),
          memoryLegacyTitle: t(`${p}.memoryLegacyBlueprint.title`),
          memoryLegacyObjectives: t(`${p}.memoryLegacyBlueprint.objectives`),
          memoryLegacyCategories: t(`${p}.memoryLegacyBlueprint.categories`),
          memoryLegacyQuestions: t(`${p}.memoryLegacyBlueprint.questions`),
          memoryLegacyPreservation: t(`${p}.memoryLegacyBlueprint.preservation`),
          memoryLegacyCompanionGuidance: t(`${p}.memoryLegacyBlueprint.companionGuidance`),
          memoryLegacyConnections: t(`${p}.memoryLegacyBlueprint.connections`),
          memoryLegacySelfLove: t(`${p}.memoryLegacyBlueprint.selfLove`),
          memoryLegacyTrust: t(`${p}.memoryLegacyBlueprint.trust`),
          memoryLegacyPrivacy: t(`${p}.memoryLegacyBlueprint.privacy`),
          memoryLegacyEngagement: t(`${p}.memoryLegacyBlueprint.engagement`),
          memoryLegacySuccessCriteria: t(`${p}.memoryLegacyBlueprint.successCriteria`),
          memoryLegacyIntegrationLinks: t(`${p}.memoryLegacyBlueprint.integrationLinks`),
          phase126Title: t(`${p}.phase126.title`),
          phase126Objectives: t(`${p}.phase126.objectives`),
          phase126MemoryCenter: t(`${p}.phase126.memoryCenter`),
          phase126MemoryArchive: t(`${p}.phase126.memoryArchive`),
          phase126LegacyCaptures: t(`${p}.phase126.legacyCaptures`),
          phase126Succession: t(`${p}.phase126.succession`),
          phase126Storytelling: t(`${p}.phase126.storytelling`),
          phase126KnowledgeProtection: t(`${p}.phase126.knowledgeProtection`),
          phase126MemoryDiscovery: t(`${p}.phase126.memoryDiscovery`),
          phase126LegacyCompanion: t(`${p}.phase126.legacyCompanion`),
          phase126CompanionAdaptation: t(`${p}.phase126.companionAdaptation`),
          phase126CompanionLimitations: t(`${p}.phase126.companionLimitations`),
          phase126SelfLove: t(`${p}.phase126.selfLove`),
          phase126HeritageLibrary: t(`${p}.phase126.heritageLibrary`),
          phase126LimitationPrinciples: t(`${p}.phase126.limitationPrinciples`),
          phase126Engagement: t(`${p}.phase126.engagement`),
          phase126SuccessCriteria: t(`${p}.phase126.successCriteria`),
          phase126IntegrationLinks: t(`${p}.phase126.integrationLinks`),
        }}
      />
    </div>
  );
}
