import { GlobalCommerceExpansionDashboardPanel } from "@/components/app/global-commerce-expansion";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalCommerceExpansionPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "globalCommerceExpansion");
  const t = createTranslator(dict);
  const p = "customerApp.globalCommerceExpansion";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GlobalCommerceExpansionDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          expansionReadiness: t(`${p}.expansionReadiness`),
          activeMarkets: t(`${p}.activeMarkets`),
          preparingMarkets: t(`${p}.preparingMarkets`),
          generateBriefing: t(`${p}.generateBriefing`),
          emergingOpportunities: t(`${p}.emergingOpportunities`),
          localizationGuidance: t(`${p}.localizationGuidance`),
          regulatoryNotes: t(`${p}.regulatoryNotes`),
          recommendationsPending: t(`${p}.recommendationsPending`),
          marketProfiles: t(`${p}.marketProfiles`),
          readinessAssessments: t(`${p}.readinessAssessments`),
          culturalInsights: t(`${p}.culturalInsights`),
          currencyVisibility: t(`${p}.currencyVisibility`),
          regionalInsights: t(`${p}.regionalInsights`),
          recommendationsCenter: t(`${p}.recommendationsCenter`),
          recentBriefings: t(`${p}.recentBriefings`),
          globalExpansion: t(`${p}.globalExpansion`),
          multiStore: t(`${p}.multiStore`),
          productAutomation: t(`${p}.productAutomation`),
          commerceIntelligence: t(`${p}.commerceIntelligence`),
          commercePerformance: t(`${p}.commercePerformance`),
          growthPartners: t(`${p}.growthPartners`),
          approvals: t(`${p}.approvals`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionGuidance: t(`${p}.companionGuidance`),
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
