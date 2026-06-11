import { MarketplaceGovernanceDashboardPanel } from "@/components/app/marketplace-governance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MarketplaceGovernancePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.marketplaceGovernance";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <MarketplaceGovernanceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          governanceScore: t(`${p}.governanceScore`),
          generateBriefing: t(`${p}.generateBriefing`),
          automatedActionsEnabled: t(`${p}.automatedActionsEnabled`),
          automatedActionsDisabled: t(`${p}.automatedActionsDisabled`),
          refundRate: t(`${p}.refundRate`),
          customerSatisfaction: t(`${p}.customerSatisfaction`),
          incidentFrequency: t(`${p}.incidentFrequency`),
          fraudRisk: t(`${p}.fraudRisk`),
          governanceScores: t(`${p}.governanceScores`),
          qualityIncidents: t(`${p}.qualityIncidents`),
          noIncidents: t(`${p}.noIncidents`),
          resolveIncident: t(`${p}.resolveIncident`),
          fraudAlerts: t(`${p}.fraudAlerts`),
          noAlerts: t(`${p}.noAlerts`),
          acknowledgeAlert: t(`${p}.acknowledgeAlert`),
          supplierIntelligence: t(`${p}.supplierIntelligence`),
          recommendations: t(`${p}.recommendations`),
          rootCauseAnalysis: t(`${p}.rootCauseAnalysis`),
          policyEngine: t(`${p}.policyEngine`),
          prePublishControls: t(`${p}.prePublishControls`),
          postPublishMonitoring: t(`${p}.postPublishMonitoring`),
        }}
      />
    </div>
  );
}
