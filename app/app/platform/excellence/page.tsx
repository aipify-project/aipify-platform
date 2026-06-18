import { PlatformExcellenceDashboardPanel } from "@/components/app/platform-excellence-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformExcellencePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "platformExcellenceEngine");
  const t = createTranslator(dict);
  const p = "customerApp.platformExcellenceEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    qualityReviewsTitle: t(`${p}.qualityReviewsTitle`),
    consistencyTitle: t(`${p}.consistencyTitle`),
    qualityScoresTitle: t(`${p}.qualityScoresTitle`),
    standardsTitle: t(`${p}.standardsTitle`),
    schedulesTitle: t(`${p}.schedulesTitle`),
    intelligenceTitle: t(`${p}.intelligenceTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    analyticsTitle: t(`${p}.analyticsTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    metricQuality: t(`${p}.metricQuality`),
    metricConsistency: t(`${p}.metricConsistency`),
    metricUx: t(`${p}.metricUx`),
    metricPerformance: t(`${p}.metricPerformance`),
    metricAccessibility: t(`${p}.metricAccessibility`),
    metricGovernance: t(`${p}.metricGovernance`),
    metricHealth: t(`${p}.metricHealth`),
    metricIssues: t(`${p}.metricIssues`),
    scoreLabel: t(`${p}.scoreLabel`),
    noReviews: t(`${p}.noReviews`),
    noConsistency: t(`${p}.noConsistency`),
    noStandards: t(`${p}.noStandards`),
    noIntelligence: t(`${p}.noIntelligence`),
    noAdvisor: t(`${p}.noAdvisor`),
    noAudit: t(`${p}.noAudit`),
    recommendation: t(`${p}.recommendation`),
    openQualityGuardian: t(`${p}.openQualityGuardian`),
    openCustomerExperience: t(`${p}.openCustomerExperience`),
    openObservability: t(`${p}.openObservability`),
    completeReview: t(`${p}.completeReview`),
    generatePerformanceReview: t(`${p}.generatePerformanceReview`),
    generateAccessibilityReview: t(`${p}.generateAccessibilityReview`),
    recordConsistencyIssue: t(`${p}.recordConsistencyIssue`),
    updateQualityScore: t(`${p}.updateQualityScore`),
    updateStandard: t(`${p}.updateStandard`),
    scheduleReview: t(`${p}.scheduleReview`),
    refreshAnalytics: t(`${p}.refreshAnalytics`),
    executiveSummary: t(`${p}.executiveSummary`),
    qualityExecutiveLabel: t(`${p}.qualityExecutiveLabel`),
    consistencyExecutiveLabel: t(`${p}.consistencyExecutiveLabel`),
    performanceExecutiveLabel: t(`${p}.performanceExecutiveLabel`),
    accessibilityExecutiveLabel: t(`${p}.accessibilityExecutiveLabel`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <PlatformExcellenceDashboardPanel labels={labels} />
    </div>
  );
}
