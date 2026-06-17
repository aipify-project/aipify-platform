export function healthLabel(labels: Record<string, string>, key: string): string {
  return labels[`health_${key}`] ?? key.replace(/_/g, " ");
}

export function advisorTypeLabel(labels: Record<string, string>, key: string): string {
  return labels[`advisorType_${key}`] ?? key.replace(/_/g, " ");
}

export function messageSourceLabel(labels: Record<string, string>, key: string): string {
  return labels[`messageSource_${key}`] ?? key.replace(/_/g, " ");
}

export function messageTypeLabel(labels: Record<string, string>, key: string): string {
  return labels[`messageType_${key}`] ?? key.replace(/_/g, " ");
}

export function reviewTypeLabel(labels: Record<string, string>, key: string): string {
  return labels[`reviewType_${key}`] ?? key.replace(/_/g, " ");
}

export function reviewStatusLabel(labels: Record<string, string>, key: string): string {
  return labels[`reviewStatus_${key}`] ?? key.replace(/_/g, " ");
}

export function goalTypeLabel(labels: Record<string, string>, key: string): string {
  return labels[`goalType_${key}`] ?? key.replace(/_/g, " ");
}

export function goalStatusLabel(labels: Record<string, string>, key: string): string {
  return labels[`goalStatus_${key}`] ?? key.replace(/_/g, " ");
}

export function availabilityLabel(labels: Record<string, string>, key: string): string {
  return labels[`availability_${key}`] ?? key.replace(/_/g, " ");
}

export function buildPartnerAdvisorLabels(t: (key: string) => string): Record<string, string> {
  const p = "partnerAdvisor";
  const keys = [
    "title",
    "subtitle",
    "loading",
    "errorTitle",
    "errorMessage",
    "retry",
    "accessDenied",
    "partnerInfoTitle",
    "advisorCardTitle",
    "assignedAdvisor",
    "advisorAvailability",
    "partnerHealthScore",
    "partnerReadinessScore",
    "recommendedActions",
    "upcomingReviews",
    "advisorMessages",
    "messageCenterTitle",
    "reviewCenterTitle",
    "successPlanTitle",
    "goalsTitle",
    "journeyTitle",
    "companionAdvisorTitle",
    "advisorInsightsTitle",
    "languagesSpoken",
    "contactOptions",
    "partnersSupported",
    "avgPartnerGrowth",
    "partnerRetention",
    "scheduleIntroduction",
    "introductionScheduled",
    "sendMessage",
    "messageSubject",
    "messageBody",
    "messageSent",
    "requestReview",
    "reviewRequested",
    "actionFailed",
    "emptyTitle",
    "emptyMessage",
    "searchPlaceholder",
    "filterAdvisor",
    "filterHealth",
    "filterPerformance",
    "filterCountry",
    "filterTier",
    "filterGoalStatus",
    "filterAll",
    "filterMessageSource",
    "joinedDate",
    "certifications",
    "currentStage",
    "nextMilestone",
    "estimatedTime",
    "expectedOutcome",
    "advisorNotes",
    "actionItems",
    "progress",
    "dueDate",
    "emailContact",
    "calendarContact",
    "chatContact",
    "faqTitle",
    "faqWhatIs",
    "faqWhatIsAnswer",
    "faqRealPerson",
    "faqRealPersonAnswer",
    "faqHealthScore",
    "faqHealthScoreAnswer",
    "health_excellent",
    "health_healthy",
    "health_needs_attention",
    "health_at_risk",
    "advisorType_onboarding_advisor",
    "advisorType_sales_advisor",
    "advisorType_growth_advisor",
    "advisorType_enterprise_advisor",
    "advisorType_strategic_advisor",
    "availability_available",
    "availability_limited",
    "availability_unavailable",
    "availability_scheduled",
    "messageSource_advisor",
    "messageSource_companion",
    "messageSource_system",
    "messageSource_milestone",
    "messageType_welcome",
    "messageType_encouragement",
    "messageType_recommendation",
    "messageType_warning",
    "messageType_milestone",
    "messageType_training",
    "messageType_performance",
    "messageType_strategic",
    "reviewType_30_day",
    "reviewType_60_day",
    "reviewType_90_day",
    "reviewType_quarterly",
    "reviewType_annual",
    "reviewStatus_scheduled",
    "reviewStatus_in_progress",
    "reviewStatus_completed",
    "reviewStatus_cancelled",
    "reviewStatus_overdue",
    "goalType_sales",
    "goalType_certification",
    "goalType_opportunity",
    "goalType_revenue",
    "goalType_growth",
    "goalStatus_active",
    "goalStatus_completed",
    "goalStatus_paused",
    "goalStatus_at_risk",
    "goalStatus_cancelled",
  ];
  return Object.fromEntries(keys.map((key) => [key, t(`${p}.${key}`)]));
}
