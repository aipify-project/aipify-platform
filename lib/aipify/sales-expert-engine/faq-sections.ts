/** Sales Expert FAQ section structure — keys map to customerApp.salesExpertEngine.* i18n. */
export type SalesExpertFaqItem = { qKey: string; aKey: string };

export type SalesExpertFaqSection = {
  id: string;
  labelKey: string;
  items: SalesExpertFaqItem[];
};

export const SALES_EXPERT_FAQ_SECTIONS: SalesExpertFaqSection[] = [
  {
    id: "general",
    labelKey: "faqSections.general",
    items: [
      { qKey: "faq.whatIsSalesExpert.q", aKey: "faq.whatIsSalesExpert.a" },
      { qKey: "faq.employedByAipify.q", aKey: "faq.employedByAipify.a" },
      { qKey: "faq.ownCompany.q", aKey: "faq.ownCompany.a" },
    ],
  },
  {
    id: "commissions",
    labelKey: "faqSections.commissions",
    items: [
      { qKey: "faq.howCommissionsWork.q", aKey: "faq.howCommissionsWork.a" },
      { qKey: "faq.recurringWhileSubscribed.q", aKey: "faq.recurringWhileSubscribed.a" },
      { qKey: "faq.customerCancels.q", aKey: "faq.customerCancels.a" },
      { qKey: "faq.howCommissionsPaid.q", aKey: "faq.howCommissionsPaid.a" },
      { qKey: "faq.whenCommissionsPaid.q", aKey: "faq.whenCommissionsPaid.a" },
    ],
  },
  {
    id: "implementation",
    labelKey: "faqSections.implementation",
    items: [
      { qKey: "faq.chargeForSetup.q", aKey: "faq.chargeForSetup.a" },
      { qKey: "faq.aipifySetsPrices.q", aKey: "faq.aipifySetsPrices.a" },
      { qKey: "faq.pricingGuidance.q", aKey: "faq.pricingGuidance.a" },
    ],
  },
  {
    id: "customers",
    labelKey: "faqSections.customers",
    items: [
      { qKey: "faq.customerRelationship.q", aKey: "faq.customerRelationship.a" },
      { qKey: "faq.moveCustomers.q", aKey: "faq.moveCustomers.a" },
      { qKey: "faq.chooseAnotherExpert.q", aKey: "faq.chooseAnotherExpert.a" },
    ],
  },
  {
    id: "portal",
    labelKey: "faqSections.portal",
    items: [
      { qKey: "faq.whatIsPortal.q", aKey: "faq.whatIsPortal.a" },
      { qKey: "faq.seeAllCustomers.q", aKey: "faq.seeAllCustomers.a" },
    ],
  },
  {
    id: "email",
    labelKey: "faqSections.email",
    items: [
      { qKey: "faq.emailTemplates.q", aKey: "faq.emailTemplates.a" },
      { qKey: "faq.customizeTemplates.q", aKey: "faq.customizeTemplates.a" },
      { qKey: "faq.autoInsertInfo.q", aKey: "faq.autoInsertInfo.a" },
      { qKey: "faq.bulkEmail.q", aKey: "faq.bulkEmail.a" },
    ],
  },
  {
    id: "followUps",
    labelKey: "faqSections.followUps",
    items: [
      { qKey: "faq.rememberFollowUps.q", aKey: "faq.rememberFollowUps.a" },
      { qKey: "faq.automaticFollowUps.q", aKey: "faq.automaticFollowUps.a" },
    ],
  },
  {
    id: "certifications",
    labelKey: "faqSections.certifications",
    items: [
      { qKey: "faq.needCertification.q", aKey: "faq.needCertification.a" },
      { qKey: "faq.becomeSpecialized.q", aKey: "faq.becomeSpecialized.a" },
    ],
  },
  {
    id: "internationalization",
    labelKey: "faqSections.internationalization",
    items: [{ qKey: "faq.portalLanguages.q", aKey: "faq.portalLanguages.a" }],
  },
  {
    id: "expectations",
    labelKey: "faqSections.expectations",
    items: [
      { qKey: "faq.whatAipifyExpects.q", aKey: "faq.whatAipifyExpects.a" },
      { qKey: "faq.unacceptableBehavior.q", aKey: "faq.unacceptableBehavior.a" },
    ],
  },
  {
    id: "selfLove",
    labelKey: "faqSections.selfLove",
    items: [{ qKey: "faq.whySelfLove.q", aKey: "faq.whySelfLove.a" }],
  },
  {
    id: "vision",
    labelKey: "faqSections.vision",
    items: [{ qKey: "faq.buildRealBusiness.q", aKey: "faq.buildRealBusiness.a" }],
  },
];

import { buildSalesExpertPortalNoticeLabels } from "./portal-notice-sections";

export function buildSalesExpertPortalLabels(
  t: (key: string) => string,
  prefix: string,
): Record<string, string> {
  const dashboardKeys = [
    "loading", "engineTitle", "noMassEmail", "actionFailed",
    "tabDashboard", "tabCustomers", "tabOpportunities", "tabIntelligence", "tabCommissions", "tabOperations", "tabTraining",
    "tabResources", "tabMarketing", "tabCommunity", "tabLegacy", "tabEmail", "tabServices", "tabCoach", "tabDemoExperience", "tabCertificationEnablement", "tabPerformance", "tabRenewalExpansion", "tabPrinciples", "tabFaq",
    "pendingCommissions", "paidCommissions", "lifetimeValue", "activeOpportunities",
    "upcomingFollowUps", "activeCustomers", "forecastedCommissions",
    "addCustomer", "customerNamePlaceholder", "addCustomerButton", "creating", "noCustomers",
    "onboardingProgress", "noOpportunities", "estimatedValue", "recommendedAction",
    "commercialIntegration", "noCommissions", "trainingCenter", "foundationsTraining",
    "certificationPathways", "resourceLibrary", "metadataScaffold", "sendOneToOne",
    "selectCustomer", "sendEmail", "sending", "emailTemplates", "automatedFollowUps",
    "days", "emailHistory", "implementationServices", "subscriptionPrinciples", "officialTiers",
    "performanceMission", "performanceObjectives", "performanceDashboardFields",
    "milestoneRecognition", "milestoneProgressLabel", "milestoneMet", "milestoneNotMet",
    "bellMoments", "bellMomentTrigger", "recognitionRoses", "recognitionRosesBoundary",
    "gratitudeRecognitionLink", "leaderboards", "leaderboardEncouragedCategories", "leaderboardAvoid",
    "selfLoveConnection", "trustConnection", "metadataOnly", "visionPhrases",
    "blueprintSuccessCriteria", "milestonesAchieved", "activeSubscriptions", "newCustomers30d",
    "retentionRate", "selfLove", "integrationLinks",
    "coachTitle", "coachMission", "coachPhilosophy", "coachAbosPrinciple", "coachDistinctionNote",
    "coachCompanionRoles", "coachSummary", "coachNewCustomers", "coachRenewals", "coachConversionRate",
    "coachScheduledDemos", "coachSuggestedActions", "coachDailyBriefing", "coachActivityRecommendations",
    "coachFieldSales", "coachDemonstration", "coachDemoChecklist", "coachDiscoveryQuestions",
    "coachObjectionLibrary", "coachCommunication", "coachPerformanceInsights", "coachStrengths",
    "coachOpportunities", "coachBellMoments", "coachTrainingIntegration", "coachRoleplay",
    "coachSimulationLab", "coachTrust", "coachSuccessCriteria",
    "engagementTitle", "engagementMission", "engagementPhilosophy", "engagementAbosPrinciple", "engagementDistinctionNote",
    "engagementBookingUrl", "engagementBookingUrlHint", "engagementCopyUrl", "engagementBookingSlug",
    "engagementSummary", "engagementScheduledBookings", "engagementBookingsThisWeek", "engagementCompletedBookings30d",
    "engagementUpcomingBookings", "engagementBookingCenter", "engagementCalendarIntegrations", "engagementOpenCalendars",
    "engagementFollowUpNudges", "engagementMeetingPrep", "engagementTrust", "engagementSuccessCriteria",
    "certTitle", "certMission", "certPhilosophy", "certAbosPrinciple", "certDistinctionNote",
    "certSummary", "certCurrentTier", "certAttemptsRemaining", "certNextModule",
    "certTrainingPathway", "certTrainingModules", "certSimulationEngine", "certSimulationScenarios",
    "certTelephoneCoaching", "certTelephoneSteps", "certAssessmentPrinciples", "certAssessmentDimensions",
    "certRequirements", "certTierMinimum", "certReassessment", "certDisplay", "certDisplaySurfaces",
    "certEmailEnablement", "certNoMassEmail", "certPricingGuidance", "certPricingNonBinding",
    "certInstallationJourney", "certFieldEnablement", "certPerformanceCulture", "certPerformancePillars",
    "certTrust", "certSuccessCriteria", "certSimulationLab",
    "demoTitle", "demoMission", "demoPhilosophy", "demoAbosPrinciple", "demoDistinctionNote",
    "demoObjectives", "demoEnvironments", "demoFlowStructure", "demoDiscoveryLibrary",
    "demoIndustryDemonstrations", "demoDataExamples", "demoCustomExperiences", "demoGuidance",
    "demoCompanionExperience", "demoLinksScaffold", "demoLinkExpiry", "demoLinksActive",
    "demoTrust", "demoSuccessCriteria",
    "marketingTitle", "marketingMission", "marketingAbosPrinciple", "marketingDistinctionNote", "marketingNoMassEmail",
    "marketingPerformanceTracking", "marketingLinkClicks", "marketingLeads", "marketingSignups", "marketingSubscriptions",
    "marketingBestBanner", "marketingBestChannel", "marketingEstimatedCommission",
    "marketingPersonalLinks", "marketingTrackingSlug", "marketingLocale", "marketingBanners", "marketingBannerNote",
    "marketingPromotionalPacks", "marketingSocialMedia", "marketingForumPost", "marketingEmailSnippet",
    "marketingChannelGuidance", "marketingPlatformGuidance", "marketingForumGuidelines", "marketingEncourage", "marketingDiscourage",
    "marketingVideoIdeas", "marketingCoachConnection", "marketingTrust", "marketingSuccessCriteria", "marketingCopy",
    "renewalTitle", "renewalMission", "renewalPhilosophy", "renewalAbosPrinciple", "renewalDistinctionNote",
    "renewalDashboardSummary", "renewalUpcomingCount", "renewalRecentlyRenewedCount", "renewalAnniversariesCount",
    "renewalAtRiskCount", "renewalReadinessPct", "renewalRetentionSignal", "renewalCommercialLink",
    "renewalUpcomingList", "renewalDaysUntilFollowUp", "renewalCompanionExamples", "renewalObjectives",
    "renewalHealthInsights", "renewalSuccessReview", "renewalExpansionOpportunities", "renewalOpenRoute",
    "renewalPlaybooks", "renewalCelebrations", "renewalChurnPrevention", "renewalCustomerSuccessLink",
    "renewalSalesExpertInsights", "renewalSuccessCriteria",
    "communityTitle", "communityMission", "communityAbosPrinciple", "communityDistinctionNote", "communitySummary",
    "communityStoriesCount", "communityActiveMentorships", "communityContributors", "communityRegionalGroup",
    "communityMentorshipVoluntary", "communityMentorshipDisabled", "communityObjectives", "communityMentorshipProgram",
    "communityMentorshipStatus", "communityNoMentorshipLinks", "communityHub", "communitySuccessStories",
    "communityStoriesEducate", "communityRecognition", "communityCoachConnection", "communityRegionalGroups",
    "communityTrust", "communitySuccessCriteria",
    "intelligenceTitle", "intelligenceMission", "intelligenceAbosPrinciple", "intelligenceDistinctionNote",
    "intelligenceSummary", "intelligenceObjectives", "intelligenceOpportunityInsights", "intelligencePipeline",
    "intelligenceEarlyStage", "intelligenceDemoCandidates", "intelligenceFollowUpPriorities", "intelligenceRenewalRelated",
    "intelligenceExpansion", "intelligenceStale", "intelligenceOpportunityScoring", "intelligenceScore",
    "intelligenceEngagement", "intelligenceFollowUp", "intelligenceStaleOpportunities", "intelligenceDemoNudges",
    "intelligenceIndustryInsights", "intelligencePatterns", "intelligenceObjections", "intelligenceSuccessCriteria",
    "legacyTitle", "legacyMission", "legacyAbosPrinciple", "legacyDistinctionNote", "legacyDashboard",
    "legacyTenureYears", "legacyOrgsSupported", "legacyCustomersRetained", "legacyDemosDelivered",
    "legacyTrainingSessions", "legacyCommunityContributions", "legacyMentorshipRelationships", "legacyMilestonesAchieved",
    "legacySuccessTimeline", "legacyTimelineNote", "legacyTimelineAchieved", "legacyTimelinePending", "legacyTimelineDate",
    "legacyImpactInsights", "legacyImpactMetadataOnly", "legacyMentorshipLegacy", "legacyMentoredCount",
    "legacyCommunityStories", "legacyActiveMentorships", "legacyRecognition", "legacyRecognitionOptional",
    "legacySelfLoveReflection", "legacyTrust", "legacySuccessCriteria",
  ] as const;

  const labels = buildSalesExpertFaqLabels(t, prefix);
  Object.assign(labels, buildSalesExpertPortalNoticeLabels(t, prefix));
  for (const key of dashboardKeys) {
    labels[key] = t(`${prefix}.${key}`);
  }
  return labels;
}

export function buildSalesExpertFaqLabels(
  t: (key: string) => string,
  prefix: string,
): Record<string, string> {
  const staticKeys = [
    "openKnowledgeCenter",
    "partnerEcosystem",
    "selfLove",
    "faqIntroTitle",
    "faqIntroBody",
    "faqVisionClosing",
  ] as const;

  const labels: Record<string, string> = {};
  for (const key of staticKeys) {
    labels[key] = t(`${prefix}.${key}`);
  }
  for (const section of SALES_EXPERT_FAQ_SECTIONS) {
    labels[section.labelKey] = t(`${prefix}.${section.labelKey}`);
    for (const item of section.items) {
      labels[item.qKey] = t(`${prefix}.${item.qKey}`);
      labels[item.aKey] = t(`${prefix}.${item.aKey}`);
    }
  }
  return labels;
}
