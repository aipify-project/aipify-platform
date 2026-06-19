import type { Translator } from "@/lib/i18n/translate";

export function buildCompanionMemoryCenterLabels(t: Translator) {
  const p = "customerApp.companionMemoryCenter";
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
    memoryClassification: t(`${p}.memoryClassification`),
    importantDates: t(`${p}.importantDates`),
    followUpMemory: t(`${p}.followUpMemory`),
    contextMemory: t(`${p}.contextMemory`),
    memoryReview: t(`${p}.memoryReview`),
    organizationalIntegration: t(`${p}.organizationalIntegration`),
    businessPackIntegration: t(`${p}.businessPackIntegration`),
    executiveDashboard: t(`${p}.executiveDashboard`),
    relationshipAdvisor: t(`${p}.relationshipAdvisor`),
    mobileAccess: t(`${p}.mobileAccess`),
    sections: {
      overview: t(`${p}.sections.overview`),
      personalMemory: t(`${p}.sections.personalMemory`),
      organizationMemory: t(`${p}.sections.organizationMemory`),
      preferences: t(`${p}.sections.preferences`),
      relationships: t(`${p}.sections.relationships`),
      permissions: t(`${p}.sections.permissions`),
      reviews: t(`${p}.sections.reviews`),
      reports: t(`${p}.sections.reports`),
    },
    stats: {
      memories: t(`${p}.stats.memories`),
      preferences: t(`${p}.stats.preferences`),
      relationships: t(`${p}.stats.relationships`),
      importantDates: t(`${p}.stats.importantDates`),
      followUps: t(`${p}.stats.followUps`),
      contextItems: t(`${p}.stats.contextItems`),
    },
    executive: {
      upcomingMilestones: t(`${p}.executive.upcomingMilestones`),
      openFollowUps: t(`${p}.executive.openFollowUps`),
      relationshipCount: t(`${p}.executive.relationshipCount`),
      avgRelationshipHealth: t(`${p}.executive.avgRelationshipHealth`),
      pendingReviews: t(`${p}.executive.pendingReviews`),
      commitments: t(`${p}.executive.commitments`),
    },
  };
}
