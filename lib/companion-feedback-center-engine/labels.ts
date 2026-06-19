import type { Translator } from "@/lib/i18n/translate";

export function buildCompanionFeedbackCenterLabels(t: Translator) {
  const p = "customerApp.companionFeedbackCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    noRecords: t(`${p}.noRecords`),
    feedbackCollection: t(`${p}.feedbackCollection`),
    experienceSignals: t(`${p}.experienceSignals`),
    userSatisfaction: t(`${p}.userSatisfaction`),
    improvementRecommendations: t(`${p}.improvementRecommendations`),
    companionQuality: t(`${p}.companionQuality`),
    feedbackLoops: t(`${p}.feedbackLoops`),
    featureRequests: t(`${p}.featureRequests`),
    knowledgeImprovement: t(`${p}.knowledgeImprovement`),
    businessPackIntegration: t(`${p}.businessPackIntegration`),
    experienceEvolutionDashboard: t(`${p}.experienceEvolutionDashboard`),
    experienceAdvisor: t(`${p}.experienceAdvisor`),
    executiveDashboard: t(`${p}.executiveDashboard`),
    mobileAccess: t(`${p}.mobileAccess`),
    sections: {
      overview: t(`${p}.sections.overview`),
      feedback: t(`${p}.sections.feedback`),
      suggestions: t(`${p}.sections.suggestions`),
      ratings: t(`${p}.sections.ratings`),
      insights: t(`${p}.sections.insights`),
      improvements: t(`${p}.sections.improvements`),
      reports: t(`${p}.sections.reports`),
    },
    stats: {
      feedback: t(`${p}.stats.feedback`),
      suggestions: t(`${p}.stats.suggestions`),
      ratings: t(`${p}.stats.ratings`),
      experienceSignals: t(`${p}.stats.experienceSignals`),
      improvements: t(`${p}.stats.improvements`),
      qualityMetrics: t(`${p}.stats.qualityMetrics`),
    },
    executive: {
      companionSatisfaction: t(`${p}.executive.companionSatisfaction`),
      companionQuality: t(`${p}.executive.companionQuality`),
      openFeedback: t(`${p}.executive.openFeedback`),
      improvementOpportunities: t(`${p}.executive.improvementOpportunities`),
      featureRequests: t(`${p}.executive.featureRequests`),
      knowledgeGaps: t(`${p}.executive.knowledgeGaps`),
    },
  };
}
