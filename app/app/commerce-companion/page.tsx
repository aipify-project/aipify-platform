import { CommerceCompanionDashboardPanel } from "@/components/app/commerce-companion";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CommerceCompanionPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.commerceCompanion";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CommerceCompanionDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          companionScore: t(`${p}.companionScore`),
          pressureFreeMode: t(`${p}.pressureFreeMode`),
          generateBriefing: t(`${p}.generateBriefing`),
          operationalAlerts: t(`${p}.operationalAlerts`),
          growthOpportunities: t(`${p}.growthOpportunities`),
          profitabilityCoaching: t(`${p}.profitabilityCoaching`),
          integrationModules: t(`${p}.integrationModules`),
          morningBriefing: t(`${p}.morningBriefing`),
          revenueNote: t(`${p}.revenueNote`),
          profitNote: t(`${p}.profitNote`),
          holisticVisibility: t(`${p}.holisticVisibility`),
          revenuePerformance: t(`${p}.revenuePerformance`),
          profitPerformance: t(`${p}.profitPerformance`),
          topProducts: t(`${p}.topProducts`),
          supplierHealth: t(`${p}.supplierHealth`),
          journeyIndicators: t(`${p}.journeyIndicators`),
          expansionReadiness: t(`${p}.expansionReadiness`),
          morningGuidance: t(`${p}.morningGuidance`),
          operationalAlertsSection: t(`${p}.operationalAlertsSection`),
          opportunityGuidance: t(`${p}.opportunityGuidance`),
          profitabilityCoachingSection: t(`${p}.profitabilityCoachingSection`),
          companionPersonality: t(`${p}.companionPersonality`),
          integrationLinks: t(`${p}.integrationLinks`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
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
