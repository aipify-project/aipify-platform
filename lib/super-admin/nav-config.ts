import type { SuperAdminSection } from "./types";

export const SUPER_ADMIN_HOME_ROUTE = "/super";

export const SUPER_ADMIN_SECTIONS: SuperAdminSection[] = [
  {
    id: "groupOrganization",
    titleKey: "superAdmin.sections.groupOrganization.title",
    purposeKey: "superAdmin.sections.groupOrganization.purpose",
    modules: [
      {
        id: "groupOverview",
        labelKey: "superAdmin.modules.groupOverview",
        descriptionKey: "superAdmin.modules.groupOverviewDescription",
        href: "/super/group-overview",
      },
    ],
  },
  {
    id: "platformOperations",
    titleKey: "superAdmin.sections.platformOperations.title",
    purposeKey: "superAdmin.sections.platformOperations.purpose",
    modules: [
      { id: "platformHealth", labelKey: "superAdmin.modules.platformHealth", descriptionKey: "superAdmin.modules.platformHealthDescription", href: "/platform/system" },
      { id: "serviceStatus", labelKey: "superAdmin.modules.serviceStatus", descriptionKey: "superAdmin.modules.serviceStatusDescription", href: "/platform/system" },
      { id: "incidentCenter", labelKey: "superAdmin.modules.incidentCenter", descriptionKey: "superAdmin.modules.incidentCenterDescription", href: "/platform/support" },
      { id: "featureFlags", labelKey: "superAdmin.modules.featureFlags", descriptionKey: "superAdmin.modules.featureFlagsDescription", href: "/platform/updates" },
      { id: "releaseManagement", labelKey: "superAdmin.modules.releaseManagement", descriptionKey: "superAdmin.modules.releaseManagementDescription", href: "/platform/updates" },
      { id: "maintenanceScheduling", labelKey: "superAdmin.modules.maintenanceScheduling", descriptionKey: "superAdmin.modules.maintenanceSchedulingDescription", href: "/platform/updates" },
    ],
  },
  {
    id: "tenantManagement",
    titleKey: "superAdmin.sections.tenantManagement.title",
    purposeKey: "superAdmin.sections.tenantManagement.purpose",
    modules: [
      { id: "organizations", labelKey: "superAdmin.modules.organizations", descriptionKey: "superAdmin.modules.organizationsDescription", href: "/platform/customers" },
      { id: "workspaceLifecycle", labelKey: "superAdmin.modules.workspaceLifecycle", descriptionKey: "superAdmin.modules.workspaceLifecycleDescription", href: "/platform/customers" },
      { id: "provisioning", labelKey: "superAdmin.modules.provisioning", descriptionKey: "superAdmin.modules.provisioningDescription", href: "/platform/installations" },
      { id: "trialConversions", labelKey: "superAdmin.modules.trialConversions", descriptionKey: "superAdmin.modules.trialConversionsDescription", href: "/platform/subscriptions" },
      { id: "suspensions", labelKey: "superAdmin.modules.suspensions", descriptionKey: "superAdmin.modules.suspensionsDescription", href: "/platform/customers" },
      { id: "recoveryActions", labelKey: "superAdmin.modules.recoveryActions", descriptionKey: "superAdmin.modules.recoveryActionsDescription", href: "/platform/customers" },
    ],
  },
  {
    id: "commercialOperations",
    titleKey: "superAdmin.sections.commercialOperations.title",
    purposeKey: "superAdmin.sections.commercialOperations.purpose",
    modules: [
      { id: "billingOverview", labelKey: "superAdmin.modules.billingOverview", descriptionKey: "superAdmin.modules.billingOverviewDescription", href: "/platform/billing" },
      { id: "paymentProviders", labelKey: "superAdmin.modules.paymentProviders", descriptionKey: "superAdmin.modules.paymentProvidersDescription", href: "/platform/payment-providers" },
      { id: "subscriptionMonitoring", labelKey: "superAdmin.modules.subscriptionMonitoring", descriptionKey: "superAdmin.modules.subscriptionMonitoringDescription", href: "/platform/subscriptions" },
      { id: "revenueAnalytics", labelKey: "superAdmin.modules.revenueAnalytics", descriptionKey: "superAdmin.modules.revenueAnalyticsDescription", href: "/platform/metrics" },
      { id: "enterpriseContracts", labelKey: "superAdmin.modules.enterpriseContracts", descriptionKey: "superAdmin.modules.enterpriseContractsDescription", href: "/platform/billing" },
      { id: "trialPerformance", labelKey: "superAdmin.modules.trialPerformance", descriptionKey: "superAdmin.modules.trialPerformanceDescription", href: "/platform/metrics" },
      { id: "upgradeTracking", labelKey: "superAdmin.modules.upgradeTracking", descriptionKey: "superAdmin.modules.upgradeTrackingDescription", href: "/platform/subscriptions" },
    ],
  },
  {
    id: "growthPartners",
    titleKey: "superAdmin.sections.growthPartners.title",
    purposeKey: "superAdmin.sections.growthPartners.purpose",
    modules: [
      { id: "applications", labelKey: "superAdmin.modules.applications", descriptionKey: "superAdmin.modules.applicationsDescription", href: "/platform/pilot-operations" },
      { id: "certifications", labelKey: "superAdmin.modules.certifications", descriptionKey: "superAdmin.modules.certificationsDescription", href: "/platform/skills" },
      { id: "partnerPerformance", labelKey: "superAdmin.modules.partnerPerformance", descriptionKey: "superAdmin.modules.partnerPerformanceDescription", href: "/platform/metrics" },
      { id: "commissions", labelKey: "superAdmin.modules.commissions", descriptionKey: "superAdmin.modules.commissionsDescription", href: "/platform/billing" },
      { id: "payoutReviews", labelKey: "superAdmin.modules.payoutReviews", descriptionKey: "superAdmin.modules.payoutReviewsDescription", href: "/platform/invoices" },
      { id: "partnerSupport", labelKey: "superAdmin.modules.partnerSupport", descriptionKey: "superAdmin.modules.partnerSupportDescription", href: "/platform/support" },
      {
        id: "academyStudio",
        labelKey: "superAdmin.modules.academyStudio",
        descriptionKey: "superAdmin.modules.academyStudioDescription",
        href: "/super/academy-studio",
      },
      {
        id: "marketingManagement",
        labelKey: "superAdmin.modules.marketingManagement",
        descriptionKey: "superAdmin.modules.marketingManagementDescription",
        href: "/super/growth-partner-marketing",
      },
    ],
  },
  {
    id: "marketplaceGovernance",
    titleKey: "superAdmin.sections.marketplaceGovernance.title",
    purposeKey: "superAdmin.sections.marketplaceGovernance.purpose",
    modules: [
      { id: "submissionQueue", labelKey: "superAdmin.modules.submissionQueue", descriptionKey: "superAdmin.modules.submissionQueueDescription", href: "/platform/skills" },
      { id: "approvalCenter", labelKey: "superAdmin.modules.approvalCenter", descriptionKey: "superAdmin.modules.approvalCenterDescription", href: "/platform/actions" },
      { id: "moderationActions", labelKey: "superAdmin.modules.moderationActions", descriptionKey: "superAdmin.modules.moderationActionsDescription", href: "/platform/intelligence/learning-queue" },
      { id: "qualityReviews", labelKey: "superAdmin.modules.qualityReviews", descriptionKey: "superAdmin.modules.qualityReviewsDescription", href: "/platform/skills" },
      { id: "marketplacePolicies", labelKey: "superAdmin.modules.marketplacePolicies", descriptionKey: "superAdmin.modules.marketplacePoliciesDescription", href: "/platform/trust" },
    ],
  },
  {
    id: "globalGovernance",
    titleKey: "superAdmin.sections.globalGovernance.title",
    purposeKey: "superAdmin.sections.globalGovernance.purpose",
    modules: [
      { id: "globalAuditLogs", labelKey: "superAdmin.modules.globalAuditLogs", descriptionKey: "superAdmin.modules.globalAuditLogsDescription", href: "/platform/trust/audit" },
      { id: "abuseDetection", labelKey: "superAdmin.modules.abuseDetection", descriptionKey: "superAdmin.modules.abuseDetectionDescription", href: "/platform/trust" },
      { id: "complianceCenter", labelKey: "superAdmin.modules.complianceCenter", descriptionKey: "superAdmin.modules.complianceCenterDescription", href: "/platform/trust" },
      { id: "emergencyControls", labelKey: "superAdmin.modules.emergencyControls", descriptionKey: "superAdmin.modules.emergencyControlsDescription", href: "/platform/actions" },
      { id: "platformRiskReview", labelKey: "superAdmin.modules.platformRiskReview", descriptionKey: "superAdmin.modules.platformRiskReviewDescription", href: "/platform/trust/actions" },
    ],
  },
  {
    id: "customerSuccess",
    titleKey: "superAdmin.sections.customerSuccess.title",
    purposeKey: "superAdmin.sections.customerSuccess.purpose",
    modules: [
      {
        id: "customerHealth",
        labelKey: "superAdmin.modules.customerHealth",
        descriptionKey: "superAdmin.modules.customerHealthDescription",
        href: "/super/customer-health",
      },
    ],
  },
  {
    id: "globalKnowledge",
    titleKey: "superAdmin.sections.globalKnowledge.title",
    purposeKey: "superAdmin.sections.globalKnowledge.purpose",
    modules: [
      { id: "globalKnowledgeBase", labelKey: "superAdmin.modules.globalKnowledgeBase", descriptionKey: "superAdmin.modules.globalKnowledgeBaseDescription", href: "/platform/intelligence" },
      { id: "learningNetwork", labelKey: "superAdmin.modules.learningNetwork", descriptionKey: "superAdmin.modules.learningNetworkDescription", href: "/platform/intelligence/learning-queue" },
      { id: "platformInsights", labelKey: "superAdmin.modules.platformInsights", descriptionKey: "superAdmin.modules.platformInsightsDescription", href: "/platform/metrics" },
      { id: "globalInsights", labelKey: "superAdmin.modules.globalInsights", descriptionKey: "superAdmin.modules.globalInsightsDescription", href: "/super/global-insights" },
      { id: "knowledgeExpansion", labelKey: "superAdmin.modules.knowledgeExpansion", descriptionKey: "superAdmin.modules.knowledgeExpansionDescription", href: "/platform/intelligence/global-patterns" },
      { id: "contentGovernance", labelKey: "superAdmin.modules.contentGovernance", descriptionKey: "superAdmin.modules.contentGovernanceDescription", href: "/platform/trust/knowledge" },
    ],
  },
  {
    id: "internalSupport",
    titleKey: "superAdmin.sections.internalSupport.title",
    purposeKey: "superAdmin.sections.internalSupport.purpose",
    modules: [
      { id: "escalationQueue", labelKey: "superAdmin.modules.escalationQueue", descriptionKey: "superAdmin.modules.escalationQueueDescription", href: "/platform/support" },
      { id: "enterpriseCases", labelKey: "superAdmin.modules.enterpriseCases", descriptionKey: "superAdmin.modules.enterpriseCasesDescription", href: "/platform/support" },
      { id: "internalNotes", labelKey: "superAdmin.modules.internalNotes", descriptionKey: "superAdmin.modules.internalNotesDescription", href: "/platform/support" },
      { id: "supportIntelligence", labelKey: "superAdmin.modules.supportIntelligence", descriptionKey: "superAdmin.modules.supportIntelligenceDescription", href: "/platform/intelligence" },
      { id: "serviceReviews", labelKey: "superAdmin.modules.serviceReviews", descriptionKey: "superAdmin.modules.serviceReviewsDescription", href: "/platform/impact" },
    ],
  },
];
