import { EnterpriseInnovationRdFutureDashboardPanel } from "@/components/app/enterprise-innovation-rd-future-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function InnovationCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "enterpriseInnovationRdFutureEngine");
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseInnovationRdFutureEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    ideasTitle: t(`${p}.ideasTitle`),
    researchTitle: t(`${p}.researchTitle`),
    experimentsTitle: t(`${p}.experimentsTitle`),
    technologyRadarTitle: t(`${p}.technologyRadarTitle`),
    opportunitiesTitle: t(`${p}.opportunitiesTitle`),
    competitiveTitle: t(`${p}.competitiveTitle`),
    intelligenceTitle: t(`${p}.intelligenceTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    governanceTitle: t(`${p}.governanceTitle`),
    analyticsTitle: t(`${p}.analyticsTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    metricIdeas: t(`${p}.metricIdeas`),
    metricExperiments: t(`${p}.metricExperiments`),
    metricResearch: t(`${p}.metricResearch`),
    metricTechnology: t(`${p}.metricTechnology`),
    metricOpportunities: t(`${p}.metricOpportunities`),
    metricHealth: t(`${p}.metricHealth`),
    metricVelocity: t(`${p}.metricVelocity`),
    metricValidation: t(`${p}.metricValidation`),
    scoreLabel: t(`${p}.scoreLabel`),
    noIdeas: t(`${p}.noIdeas`),
    noResearch: t(`${p}.noResearch`),
    noExperiments: t(`${p}.noExperiments`),
    noTechnology: t(`${p}.noTechnology`),
    noOpportunities: t(`${p}.noOpportunities`),
    noIntelligence: t(`${p}.noIntelligence`),
    noAdvisor: t(`${p}.noAdvisor`),
    noAudit: t(`${p}.noAudit`),
    recommendation: t(`${p}.recommendation`),
    openInnovationLab: t(`${p}.openInnovationLab`),
    submitIdea: t(`${p}.submitIdea`),
    approveIdea: t(`${p}.approveIdea`),
    createResearch: t(`${p}.createResearch`),
    startExperiment: t(`${p}.startExperiment`),
    completeExperiment: t(`${p}.completeExperiment`),
    reviewTechnology: t(`${p}.reviewTechnology`),
    addOpportunity: t(`${p}.addOpportunity`),
    approveInitiative: t(`${p}.approveInitiative`),
    refreshAnalytics: t(`${p}.refreshAnalytics`),
    governanceOwnership: t(`${p}.governanceOwnership`),
    governanceExperimentApproval: t(`${p}.governanceExperimentApproval`),
    governanceMeasurable: t(`${p}.governanceMeasurable`),
    governanceAlignment: t(`${p}.governanceAlignment`),
    governanceAudit: t(`${p}.governanceAudit`),
    executiveSummary: t(`${p}.executiveSummary`),
    pipelineLabel: t(`${p}.pipelineLabel`),
    opportunitiesExecutiveLabel: t(`${p}.opportunitiesExecutiveLabel`),
    researchExecutiveLabel: t(`${p}.researchExecutiveLabel`),
    roiExecutiveLabel: t(`${p}.roiExecutiveLabel`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EnterpriseInnovationRdFutureDashboardPanel labels={labels} />
    </div>
  );
}
