import { MultiStoreOrchestrationDashboardPanel } from "@/components/app/multi-store-orchestration";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MultiStoreOrchestrationPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "multiStoreOrchestration");
  const t = createTranslator(dict);
  const p = "customerApp.multiStoreOrchestration";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <MultiStoreOrchestrationDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          portfolioOverview: t(`${p}.portfolioOverview`),
          storesConnected: t(`${p}.storesConnected`),
          revenue: t(`${p}.revenue`),
          generateReport: t(`${p}.generateReport`),
          avgMargin: t(`${p}.avgMargin`),
          storesNeedingAttention: t(`${p}.storesNeedingAttention`),
          opportunities: t(`${p}.opportunities`),
          governanceGaps: t(`${p}.governanceGaps`),
          notifications: t(`${p}.notifications`),
          storePerformance: t(`${p}.storePerformance`),
          crossStoreInsights: t(`${p}.crossStoreInsights`),
          productSyncGuidance: t(`${p}.productSyncGuidance`),
          requiresApproval: t(`${p}.requiresApproval`),
          opportunityCenter: t(`${p}.opportunityCenter`),
          governanceInsights: t(`${p}.governanceInsights`),
          regionalObservations: t(`${p}.regionalObservations`),
          strategicRecommendations: t(`${p}.strategicRecommendations`),
          executiveReports: t(`${p}.executiveReports`),
          platformInstall: t(`${p}.platformInstall`),
          commercePerformance: t(`${p}.commercePerformance`),
          commerceIntelligence: t(`${p}.commerceIntelligence`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionGuidance: t(`${p}.companionGuidance`),
          notGenericAi: t(`${p}.notGenericAi`),
          permissionPrinciples: t(`${p}.permissionPrinciples`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          productAutomation: t(`${p}.productAutomation`),
          dropshippingOperations: t(`${p}.dropshippingOperations`),
          workflowOrchestration: t(`${p}.workflowOrchestration`),
          approvals: t(`${p}.approvals`),
          autoSyncDisabled: t(`${p}.autoSyncDisabled`),
        }}
      />
    </div>
  );
}
