import { CustomerExperienceAdoptionDelightDashboardPanel } from "@/components/app/customer-experience-adoption-delight-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CustomerExperiencePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "customerExperienceAdoptionDelightEngine");
  const t = createTranslator(dict);
  const p = "customerApp.customerExperienceAdoptionDelightEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    onboardingTitle: t(`${p}.onboardingTitle`),
    onboardingSubtitle: t(`${p}.onboardingSubtitle`),
    adoptionTitle: t(`${p}.adoptionTitle`),
    companionTitle: t(`${p}.companionTitle`),
    companionSubtitle: t(`${p}.companionSubtitle`),
    journeysTitle: t(`${p}.journeysTitle`),
    delightTitle: t(`${p}.delightTitle`),
    retentionTitle: t(`${p}.retentionTitle`),
    intelligenceTitle: t(`${p}.intelligenceTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    trustTitle: t(`${p}.trustTitle`),
    analyticsTitle: t(`${p}.analyticsTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    metricOnboarding: t(`${p}.metricOnboarding`),
    metricAdoption: t(`${p}.metricAdoption`),
    metricCompanion: t(`${p}.metricCompanion`),
    metricRetention: t(`${p}.metricRetention`),
    metricExperience: t(`${p}.metricExperience`),
    metricSuccess: t(`${p}.metricSuccess`),
    metricHealth: t(`${p}.metricHealth`),
    metricRisks: t(`${p}.metricRisks`),
    firstImpressionsTitle: t(`${p}.firstImpressionsTitle`),
    gettingStartedTitle: t(`${p}.gettingStartedTitle`),
    progressLabel: t(`${p}.progressLabel`),
    adoptionLabel: t(`${p}.adoptionLabel`),
    noOnboarding: t(`${p}.noOnboarding`),
    noAdoption: t(`${p}.noAdoption`),
    noCompanion: t(`${p}.noCompanion`),
    noJourneys: t(`${p}.noJourneys`),
    noDelight: t(`${p}.noDelight`),
    noRetention: t(`${p}.noRetention`),
    noIntelligence: t(`${p}.noIntelligence`),
    noAdvisor: t(`${p}.noAdvisor`),
    noAudit: t(`${p}.noAudit`),
    recommendation: t(`${p}.recommendation`),
    openOnboarding: t(`${p}.openOnboarding`),
    openCustomerSuccess: t(`${p}.openCustomerSuccess`),
    openInstall: t(`${p}.openInstall`),
    openAssistant: t(`${p}.openAssistant`),
    startOnboarding: t(`${p}.startOnboarding`),
    completeStep: t(`${p}.completeStep`),
    updateJourney: t(`${p}.updateJourney`),
    recordMilestone: t(`${p}.recordMilestone`),
    awardAchievement: t(`${p}.awardAchievement`),
    refreshAnalytics: t(`${p}.refreshAnalytics`),
    generateRecommendation: t(`${p}.generateRecommendation`),
    trustTransparency: t(`${p}.trustTransparency`),
    trustPredictability: t(`${p}.trustPredictability`),
    trustConsistency: t(`${p}.trustConsistency`),
    trustHumanOversight: t(`${p}.trustHumanOversight`),
    executiveSummary: t(`${p}.executiveSummary`),
    adoptionExecutiveLabel: t(`${p}.adoptionExecutiveLabel`),
    satisfactionLabel: t(`${p}.satisfactionLabel`),
    retentionExecutiveLabel: t(`${p}.retentionExecutiveLabel`),
    companionExecutiveLabel: t(`${p}.companionExecutiveLabel`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CustomerExperienceAdoptionDelightDashboardPanel labels={labels} />
    </div>
  );
}
