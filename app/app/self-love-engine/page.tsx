import { SelfLoveEngineDashboardPanel } from "@/components/app/self-love-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SelfLoveEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.selfLoveEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <SelfLoveEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          pendingRecommendations: t(`${p}.pendingRecommendations`),
          acknowledgedCount: t(`${p}.acknowledgedCount`),
          openQualityChecks: t(`${p}.openQualityChecks`),
          applicationAreas: t(`${p}.applicationAreas`),
          communicationExamples: t(`${p}.communicationExamples`),
          recommendations: t(`${p}.recommendations`),
          noRecommendations: t(`${p}.noRecommendations`),
          acknowledge: t(`${p}.acknowledge`),
          confidence: t(`${p}.confidence`),
          actionFailed: t(`${p}.actionFailed`),
          systemHealth: t(`${p}.systemHealth`),
          systemHealthNote: t(`${p}.systemHealthNote`),
          qualityGuardian: t(`${p}.qualityGuardian`),
          observabilitySection: t(`${p}.observability`),
          criticalChecks: t(`${p}.criticalChecks`),
          degradedComponents: t(`${p}.degradedComponents`),
          openIncidents: t(`${p}.openIncidents`),
          successCriteria: t(`${p}.successCriteria`),
          boundaries: t(`${p}.boundaries`),
          preferences: t(`${p}.preferences`),
          tone: t(`${p}.tone`),
          toneWarm: t(`${p}.toneWarm`),
          toneBalanced: t(`${p}.toneBalanced`),
          toneMinimal: t(`${p}.toneMinimal`),
          pauseSuggestions: t(`${p}.pauseSuggestions`),
          savePreferences: t(`${p}.savePreferences`),
          saving: t(`${p}.saving`),
          preferencesFailed: t(`${p}.preferencesFailed`),
          orgSettings: t(`${p}.orgSettings`),
          reminderFrequency: t(`${p}.reminderFrequency`),
          frequencyLow: t(`${p}.frequencyLow`),
          frequencyNormal: t(`${p}.frequencyNormal`),
          frequencyHigh: t(`${p}.frequencyHigh`),
          dashboardInsights: t(`${p}.dashboardInsights`),
          saveSettings: t(`${p}.saveSettings`),
          settingsFailed: t(`${p}.settingsFailed`),
          companion_identity: t(`${p}.companionIdentity`),
          quality_guardian: t(`${p}.qualityGuardianLink`),
          observability: t(`${p}.observabilityLink`),
          attention_guardian: t(`${p}.attentionGuardian`),
          proactive_companion: t(`${p}.proactiveCompanion`),
          knowledge_center: t(`${p}.knowledgeCenter`),
        }}
      />
    </div>
  );
}
