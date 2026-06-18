import { CrossTenantIntelligenceEngineDashboardPanel } from "@/components/app/cross-tenant-intelligence-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CrossTenantIntelligenceEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "crossTenantIntelligenceEngine");
  const t = createTranslator(dict);
  const p = "customerApp.crossTenantIntelligenceEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CrossTenantIntelligenceEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          participationSettings: t(`${p}.participationSettings`),
          participationStatus: t(`${p}.participationStatus`),
          participationDisabled: t(`${p}.participationDisabled`),
          participationInternalOnly: t(`${p}.participationInternalOnly`),
          participationContributor: t(`${p}.participationContributor`),
          anonymizationLevel: t(`${p}.anonymizationLevel`),
          anonymizationStandard: t(`${p}.anonymizationStandard`),
          anonymizationEnhanced: t(`${p}.anonymizationEnhanced`),
          saveParticipation: t(`${p}.saveParticipation`),
          savingParticipation: t(`${p}.savingParticipation`),
          participationFailed: t(`${p}.participationFailed`),
          visibleInsights: t(`${p}.visibleInsights`),
          pendingRecommendations: t(`${p}.pendingRecommendations`),
          approvedRecommendations: t(`${p}.approvedRecommendations`),
          globalActiveInsights: t(`${p}.globalActiveInsights`),
          industryTrends: t(`${p}.industryTrends`),
          opportunities: t(`${p}.opportunities`),
          improvementAreas: t(`${p}.improvementAreas`),
          noIndustryTrends: t(`${p}.noIndustryTrends`),
          noOpportunities: t(`${p}.noOpportunities`),
          noImprovementAreas: t(`${p}.noImprovementAreas`),
          pendingRecommendationsSection: t(`${p}.pendingRecommendationsSection`),
          noPendingRecommendations: t(`${p}.noPendingRecommendations`),
          approveRecommendation: t(`${p}.approveRecommendation`),
          approveFailed: t(`${p}.approveFailed`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          confidence: t(`${p}.confidence`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          generateInsights: t(`${p}.generateInsights`),
          generating: t(`${p}.generating`),
          generateFailed: t(`${p}.generateFailed`),
        }} />
    </div>
  );
}
