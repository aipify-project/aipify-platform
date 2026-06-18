import { HumanOversightEngineDashboardPanel } from "@/components/app/human-oversight-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function HumanOversightEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "humanOversightEngine");
  const t = createTranslator(dict);
  const p = "customerApp.humanOversightEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <HumanOversightEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          principles: t(`${p}.principles`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          rejectedRecommendations: t(`${p}.rejectedRecommendations`),
          highRiskPending: t(`${p}.highRiskPending`),
          overrideCount: t(`${p}.overrideCount`),
          accountabilityMetrics: t(`${p}.accountabilityMetrics`),
          approvalRate: t(`${p}.approvalRate`),
          overrideRate: t(`${p}.overrideRate`),
          avgConfidence: t(`${p}.avgConfidence`),
          criticalBlocked: t(`${p}.criticalBlocked`),
          overrideTrends: t(`${p}.overrideTrends`),
          riskDistribution: t(`${p}.riskDistribution`),
          secureAiActions: t(`${p}.secureAiActions`),
          governance: t(`${p}.governance`),
          approvals: t(`${p}.approvals`),
          approve: t(`${p}.approve`),
          reject: t(`${p}.reject`),
          confidence: t(`${p}.confidence`),
          criticalNote: t(`${p}.criticalNote`),
        }}
      />
    </div>
  );
}
