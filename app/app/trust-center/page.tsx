import { EnterpriseTrustConfidenceDashboardPanel } from "@/components/app/enterprise-trust-reputation-confidence-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TrustCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "enterpriseTrustReputationConfidenceEngine");
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseTrustReputationConfidenceEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    reliabilityTitle: t(`${p}.reliabilityTitle`),
    transparencyTitle: t(`${p}.transparencyTitle`),
    trustSignalsTitle: t(`${p}.trustSignalsTitle`),
    serviceQualityTitle: t(`${p}.serviceQualityTitle`),
    reputationTitle: t(`${p}.reputationTitle`),
    incidentsTitle: t(`${p}.incidentsTitle`),
    milestonesTitle: t(`${p}.milestonesTitle`),
    intelligenceTitle: t(`${p}.intelligenceTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    governanceTitle: t(`${p}.governanceTitle`),
    analyticsTitle: t(`${p}.analyticsTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    metricTrust: t(`${p}.metricTrust`),
    metricReliability: t(`${p}.metricReliability`),
    metricAvailability: t(`${p}.metricAvailability`),
    metricConfidence: t(`${p}.metricConfidence`),
    metricServiceQuality: t(`${p}.metricServiceQuality`),
    metricTransparency: t(`${p}.metricTransparency`),
    metricHealth: t(`${p}.metricHealth`),
    metricMilestones: t(`${p}.metricMilestones`),
    scoreLabel: t(`${p}.scoreLabel`),
    lessonsLabel: t(`${p}.lessonsLabel`),
    noReliability: t(`${p}.noReliability`),
    noTransparency: t(`${p}.noTransparency`),
    noReputation: t(`${p}.noReputation`),
    noIncidents: t(`${p}.noIncidents`),
    noIntelligence: t(`${p}.noIntelligence`),
    noAdvisor: t(`${p}.noAdvisor`),
    noAudit: t(`${p}.noAudit`),
    recommendation: t(`${p}.recommendation`),
    openTrustEngine: t(`${p}.openTrustEngine`),
    openLicense: t(`${p}.openLicense`),
    openSecurity: t(`${p}.openSecurity`),
    openExcellence: t(`${p}.openExcellence`),
    completeReliabilityReview: t(`${p}.completeReliabilityReview`),
    publishTransparency: t(`${p}.publishTransparency`),
    recordIncident: t(`${p}.recordIncident`),
    resolveIncident: t(`${p}.resolveIncident`),
    achieveMilestone: t(`${p}.achieveMilestone`),
    updateTrustScore: t(`${p}.updateTrustScore`),
    refreshAnalytics: t(`${p}.refreshAnalytics`),
    governanceTransparency: t(`${p}.governanceTransparency`),
    governanceIncident: t(`${p}.governanceIncident`),
    governanceHumanOversight: t(`${p}.governanceHumanOversight`),
    governanceAudit: t(`${p}.governanceAudit`),
    executiveSummary: t(`${p}.executiveSummary`),
    trustExecutiveLabel: t(`${p}.trustExecutiveLabel`),
    reliabilityExecutiveLabel: t(`${p}.reliabilityExecutiveLabel`),
    confidenceExecutiveLabel: t(`${p}.confidenceExecutiveLabel`),
    qualityExecutiveLabel: t(`${p}.qualityExecutiveLabel`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EnterpriseTrustConfidenceDashboardPanel labels={labels} />
    </div>
  );
}
