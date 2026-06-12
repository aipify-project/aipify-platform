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
        }}
      />
    </div>
  );
}
