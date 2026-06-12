import { AiCostGovernanceEngineDashboardPanel } from "@/components/app/ai-cost-governance-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AiCostGovernanceEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aiCostGovernanceEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AiCostGovernanceEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          secureAiActions: t(`${p}.secureAiActions`),
          analyticsInsights: t(`${p}.analyticsInsights`),
          documentOutput: t(`${p}.documentOutput`),
          totalCostMtd: t(`${p}.totalCostMtd`),
          budgetPct: t(`${p}.budgetPct`),
          blockedRequests: t(`${p}.blockedRequests`),
          unacknowledgedAlerts: t(`${p}.unacknowledgedAlerts`),
          createBudget: t(`${p}.createBudget`),
          budgetNamePlaceholder: t(`${p}.budgetNamePlaceholder`),
          softLimit: t(`${p}.softLimit`),
          hardLimit: t(`${p}.hardLimit`),
          createBudgetButton: t(`${p}.createBudgetButton`),
          creating: t(`${p}.creating`),
          createFailed: t(`${p}.createFailed`),
          budgets: t(`${p}.budgets`),
          approveOverage: t(`${p}.approveOverage`),
          overageRationalePlaceholder: t(`${p}.overageRationalePlaceholder`),
          overageDefaultRationale: t(`${p}.overageDefaultRationale`),
          alerts: t(`${p}.alerts`),
          acknowledgeAlert: t(`${p}.acknowledgeAlert`),
          optimizationRecommendations: t(`${p}.optimizationRecommendations`),
          estimatedSavings: t(`${p}.estimatedSavings`),
          byModule: t(`${p}.byModule`),
          byTaskTier: t(`${p}.byTaskTier`),
          tierCostEfficient: t(`${p}.tierCostEfficient`),
          tierStandard: t(`${p}.tierStandard`),
          tierHighAccuracy: t(`${p}.tierHighAccuracy`),
          blockedRequestsList: t(`${p}.blockedRequestsList`),
          recentUsage: t(`${p}.recentUsage`),
          noUsage: t(`${p}.noUsage`),
          principles: t(`${p}.principles`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          available: t(`${p}.available`),
          notAvailable: t(`${p}.notAvailable`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          generateRecommendations: t(`${p}.generateRecommendations`),
          generating: t(`${p}.generating`),
          generateFailed: t(`${p}.generateFailed`),
          actionFailed: t(`${p}.actionFailed`),
        }} />
    </div>
  );
}
