import { CompanionPersonalizationEngineDashboardPanel } from "@/components/app/companion-personalization-engine";
import type { CompanionPersonalizationEngineLabels } from "@/lib/aipify/companion-personalization-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Translator } from "@/lib/i18n/translate";

function buildLabels(t: Translator): CompanionPersonalizationEngineLabels {
  const p = "customerApp.companionPersonalizationEngine";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyBody: t(`${p}.emptyBody`),
    emptyCta: t(`${p}.emptyCta`),
    accessDenied: t(`${p}.accessDenied`),
    filters: {
      search: t(`${p}.filters.search`),
      category: t(`${p}.filters.category`),
      source: t(`${p}.filters.source`),
      confidence: t(`${p}.filters.confidence`),
      status: t(`${p}.filters.status`),
      all: t(`${p}.filters.all`),
    },
    dashboard: {
      personalizationScore: t(`${p}.dashboard.personalizationScore`),
      activePreferences: t(`${p}.dashboard.activePreferences`),
      communicationProfile: t(`${p}.dashboard.communicationProfile`),
      briefingStyle: t(`${p}.dashboard.briefingStyle`),
      notificationStyle: t(`${p}.dashboard.notificationStyle`),
      adaptationLevel: t(`${p}.dashboard.adaptationLevel`),
      reviewCenter: t(`${p}.dashboard.reviewCenter`),
      insights: t(`${p}.dashboard.insights`),
      timeline: t(`${p}.dashboard.timeline`),
      usageExamples: t(`${p}.dashboard.usageExamples`),
      reset: t(`${p}.dashboard.reset`),
      save: t(`${p}.dashboard.save`),
    },
    review: {
      preference: t(`${p}.review.preference`),
      source: t(`${p}.review.source`),
      confidence: t(`${p}.review.confidence`),
      lastUpdated: t(`${p}.review.lastUpdated`),
      status: t(`${p}.review.status`),
      approve: t(`${p}.review.approve`),
      reject: t(`${p}.review.reject`),
      edit: t(`${p}.review.edit`),
      reset: t(`${p}.review.reset`),
    },
    profile: {
      communicationStyles: t(`${p}.profile.communicationStyles`),
      briefingStyle: t(`${p}.profile.briefingStyle`),
      notificationStyle: t(`${p}.profile.notificationStyle`),
      companionPersonality: t(`${p}.profile.companionPersonality`),
      adaptationLevel: t(`${p}.profile.adaptationLevel`),
      preferredLanguage: t(`${p}.profile.preferredLanguage`),
      learningPreference: t(`${p}.profile.learningPreference`),
      notifyChannels: t(`${p}.profile.notifyChannels`),
    },
    communicationStyles: {
      executive: t(`${p}.communicationStyles.executive`),
      professional: t(`${p}.communicationStyles.professional`),
      detailed: t(`${p}.communicationStyles.detailed`),
      concise: t(`${p}.communicationStyles.concise`),
      friendly: t(`${p}.communicationStyles.friendly`),
      analytical: t(`${p}.communicationStyles.analytical`),
      balanced: t(`${p}.communicationStyles.balanced`),
    },
    briefingStyles: {
      ultra_short: t(`${p}.briefingStyles.ultraShort`),
      summary: t(`${p}.briefingStyles.summary`),
      standard: t(`${p}.briefingStyles.standard`),
      detailed: t(`${p}.briefingStyles.detailed`),
      executive_report: t(`${p}.briefingStyles.executiveReport`),
    },
    notificationStyles: {
      minimal: t(`${p}.notificationStyles.minimal`),
      balanced: t(`${p}.notificationStyles.balanced`),
      active: t(`${p}.notificationStyles.active`),
      high_awareness: t(`${p}.notificationStyles.highAwareness`),
    },
    personalities: {
      professional: t(`${p}.personalities.professional`),
      supportive: t(`${p}.personalities.supportive`),
      executive: t(`${p}.personalities.executive`),
      analytical: t(`${p}.personalities.analytical`),
      coach: t(`${p}.personalities.coach`),
      balanced: t(`${p}.personalities.balanced`),
    },
    adaptationLevels: {
      low: t(`${p}.adaptationLevels.low`),
      moderate: t(`${p}.adaptationLevels.moderate`),
      high: t(`${p}.adaptationLevels.high`),
    },
    learningPreferences: {
      guided: t(`${p}.learningPreferences.guided`),
      self_service: t(`${p}.learningPreferences.selfService`),
      interactive: t(`${p}.learningPreferences.interactive`),
      documentation_first: t(`${p}.learningPreferences.documentationFirst`),
      video_first: t(`${p}.learningPreferences.videoFirst`),
    },
    categories: {
      communication_style: t(`${p}.categories.communicationStyle`),
      briefing_preferences: t(`${p}.categories.briefingPreferences`),
      notification_preferences: t(`${p}.categories.notificationPreferences`),
      reporting_preferences: t(`${p}.categories.reportingPreferences`),
      companion_personality: t(`${p}.categories.companionPersonality`),
      workflow_preferences: t(`${p}.categories.workflowPreferences`),
      language_preferences: t(`${p}.categories.languagePreferences`),
      meeting_preferences: t(`${p}.categories.meetingPreferences`),
      learning_preferences: t(`${p}.categories.learningPreferences`),
      productivity_preferences: t(`${p}.categories.productivityPreferences`),
    },
    statuses: {
      suggested: t(`${p}.statuses.suggested`),
      approved: t(`${p}.statuses.approved`),
      rejected: t(`${p}.statuses.rejected`),
      active: t(`${p}.statuses.active`),
    },
    confidenceLevels: {
      high: t(`${p}.confidenceLevels.high`),
      medium: t(`${p}.confidenceLevels.medium`),
      low: t(`${p}.confidenceLevels.low`),
      unverified: t(`${p}.confidenceLevels.unverified`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      control: t(`${p}.faq.control`),
      controlAnswer: t(`${p}.faq.controlAnswer`),
      security: t(`${p}.faq.security`),
      securityAnswer: t(`${p}.faq.securityAnswer`),
    },
  };
}

export default async function CompanionPersonalizationEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionPersonalizationEngine");
  const t = createTranslator(dict);
  const labels = buildLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CompanionPersonalizationEngineDashboardPanel labels={labels} />
    </div>
  );
}
