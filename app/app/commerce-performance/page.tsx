import { CommercePerformanceDashboardPanel } from "@/components/app/commerce-performance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CommercePerformancePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.commercePerformance";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CommercePerformanceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          performanceOverview: t(`${p}.performanceOverview`),
          revenue: t(`${p}.revenue`),
          netMargin: t(`${p}.netMargin`),
          generateReport: t(`${p}.generateReport`),
          estimatedProfit: t(`${p}.estimatedProfit`),
          productsTracked: t(`${p}.productsTracked`),
          openRisks: t(`${p}.openRisks`),
          opportunities: t(`${p}.opportunities`),
          profitIntelligence: t(`${p}.profitIntelligence`),
          productContribution: t(`${p}.productContribution`),
          customerValue: t(`${p}.customerValue`),
          revenueTrends: t(`${p}.revenueTrends`),
          opportunityCenter: t(`${p}.opportunityCenter`),
          riskIndicators: t(`${p}.riskIndicators`),
          strategicRecommendations: t(`${p}.strategicRecommendations`),
          executiveReports: t(`${p}.executiveReports`),
          commerceIntelligence: t(`${p}.commerceIntelligence`),
          productAutomation: t(`${p}.productAutomation`),
          dropshippingOperations: t(`${p}.dropshippingOperations`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
        }}
      />
    </div>
  );
}
