import { CompanionBriefingPageIntro } from "@/components/app/briefing";
import { CommercePerformanceDashboardPanel } from "@/components/app/commerce-performance";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CommercePerformancePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "commercePerformance");
  const t = createTranslator(dict);
  const p = "customerApp.commercePerformance";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <CompanionBriefingPageIntro
        title={t(`${p}.title`)}
        subtitle={t(`${p}.subtitle`)}
        context="commerce_performance"
        labels={buildCompanionBriefingLabels(t)}
      />
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
          commercial: t(`${p}.commercial`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionGuidance: t(`${p}.companionGuidance`),
          notGenericAi: t(`${p}.notGenericAi`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
