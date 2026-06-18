export type PlatformNavId =
  | "operationsOverview"
  | "buildHealthCenter"
  | "platformHealth"
  | "deployments"
  | "operationsAuditLogs"
  | "organizations"
  | "customerSuccess"
  | "payments"
  | "marketplace"
  | "growthPartners"
  | "knowledgeCenter"
  | "translationManagement"
  | "documentation"
  | "businessPacks"
  | "moduleRegistry"
  | "appStoreRevenue"
  | "productManagement"
  | "installationOversight"
  | "activityLogs"
  | "governanceRecords"
  | "securityReviews"
  | "executive"
  | "executiveOperationsCenter"
  | "announcementCenter"
  | "feedbackCenter"
  | "productRoadmapCenter"
  | "productReleaseCenter"
  | "platformKnowledgeEvolutionCenter"
  | "platformComplianceGovernanceCenter"
  | "platformPlaybookCenter"
  | "platformHealthOperationsCenter"
  | "platformAcademyStudio"
  | "overview"
  | "customers"
  | "customerLifecycle"
  | "customerSuccessOperations"
  | "subscriptions"
  | "billing"
  | "invoices"
  | "paymentOperations"
  | "paymentHealth"
  | "paymentAnalytics"
  | "subscriptionOperations"
  | "revenueOperations"
  | "paymentProviders"
  | "installations"
  | "installEngine"
  | "updates"
  | "trust"
  | "impact"
  | "presencePilot"
  | "pilotOperations"
  | "pilotInstall"
  | "metrics"
  | "analyticsCustomerJourneys"
  | "stats"
  | "support"
  | "automations"
  | "intelligence"
  | "actions"
  | "skills"
  | "companionMarketplace"
  | "skillGovernancePipeline"
  | "system";

export type ActionNavId =
  | "pending"
  | "approved"
  | "executed"
  | "failed"
  | "templates"
  | "policies"
  | "logs";

export type ActionNavItem = {
  id: ActionNavId;
  href: string;
  labelKey: string;
};

export const ACTION_NAV: ActionNavItem[] = [
  { id: "pending", href: "/platform/actions", labelKey: "platform.actions.nav.pending" },
  { id: "approved", href: "/platform/actions/approved", labelKey: "platform.actions.nav.approved" },
  { id: "executed", href: "/platform/actions/executed", labelKey: "platform.actions.nav.executed" },
  { id: "failed", href: "/platform/actions/failed", labelKey: "platform.actions.nav.failed" },
  { id: "templates", href: "/platform/actions/templates", labelKey: "platform.actions.nav.templates" },
  { id: "policies", href: "/platform/actions/policies", labelKey: "platform.actions.nav.policies" },
  { id: "logs", href: "/platform/actions/logs", labelKey: "platform.actions.nav.logs" },
];

export type IntelligenceNavId =
  | "brain"
  | "decisionCenter"
  | "learningQueue"
  | "globalPatterns"
  | "selfHealing"
  | "settings"
  | "auditLog";

export type IntelligenceNavItem = {
  id: IntelligenceNavId;
  href: string;
  labelKey: string;
};

export const INTELLIGENCE_NAV: IntelligenceNavItem[] = [
  { id: "brain", href: "/platform/intelligence", labelKey: "platform.intelligence.nav.brain" },
  {
    id: "decisionCenter",
    href: "/platform/intelligence/decision-center",
    labelKey: "platform.intelligence.nav.decisionCenter",
  },
  {
    id: "learningQueue",
    href: "/platform/intelligence/learning-queue",
    labelKey: "platform.intelligence.nav.learningQueue",
  },
  {
    id: "globalPatterns",
    href: "/platform/intelligence/global-patterns",
    labelKey: "platform.intelligence.nav.globalPatterns",
  },
  {
    id: "selfHealing",
    href: "/platform/intelligence/self-healing",
    labelKey: "platform.intelligence.nav.selfHealing",
  },
  {
    id: "settings",
    href: "/platform/intelligence/settings",
    labelKey: "platform.intelligence.nav.settings",
  },
  {
    id: "auditLog",
    href: "/platform/intelligence/audit-log",
    labelKey: "platform.intelligence.nav.auditLog",
  },
];

export type AnalyticsNavId = "customerJourneys";

export type AnalyticsNavItem = {
  id: AnalyticsNavId;
  href: string;
  labelKey: string;
};

export const ANALYTICS_NAV: AnalyticsNavItem[] = [
  {
    id: "customerJourneys",
    href: "/platform/analytics/customer-journeys",
    labelKey: "platform.analytics.nav.customerJourneys",
  },
];

export type ProductNavId = "feedbackCenter" | "roadmapCenter" | "releaseCenter";

export type ProductNavItem = {
  id: ProductNavId;
  href: string;
  labelKey: string;
};

export type OperationsNavId = "playbooks" | "platformHealth";

export type OperationsNavItem = {
  id: OperationsNavId;
  href: string;
  labelKey: string;
};

export const OPERATIONS_NAV: OperationsNavItem[] = [
  {
    id: "playbooks",
    href: "/platform/operations/playbooks",
    labelKey: "platform.operations.nav.playbooks",
  },
  {
    id: "platformHealth",
    href: "/platform/operations/platform-health",
    labelKey: "platform.operations.nav.platformHealth",
  },
];

export type GovernanceNavId = "complianceCenter";

export type GovernanceNavItem = {
  id: GovernanceNavId;
  href: string;
  labelKey: string;
};

export const GOVERNANCE_NAV: GovernanceNavItem[] = [
  {
    id: "complianceCenter",
    href: "/platform/governance/compliance-center",
    labelKey: "platform.governance.nav.complianceCenter",
  },
];

export type KnowledgeNavId = "evolutionCenter";

export type KnowledgeNavItem = {
  id: KnowledgeNavId;
  href: string;
  labelKey: string;
};

export const KNOWLEDGE_NAV: KnowledgeNavItem[] = [
  {
    id: "evolutionCenter",
    href: "/platform/knowledge/evolution-center",
    labelKey: "platform.knowledge.nav.evolutionCenter",
  },
];

export const PRODUCT_NAV: ProductNavItem[] = [
  {
    id: "feedbackCenter",
    href: "/platform/product/feedback-center",
    labelKey: "platform.product.nav.feedbackCenter",
  },
  {
    id: "roadmapCenter",
    href: "/platform/product/roadmap-center",
    labelKey: "platform.product.nav.roadmapCenter",
  },
  {
    id: "releaseCenter",
    href: "/platform/product/release-center",
    labelKey: "platform.product.nav.releaseCenter",
  },
];

export type PlatformNavItem = {
  id: PlatformNavId;
  href: string;
  labelKey: string;
};

export const PLATFORM_ADMIN_NAV: PlatformNavItem[] = [
  { id: "operationsOverview", href: "/platform/operations/overview", labelKey: "platform.nav.operationsOverview" },
  { id: "buildHealthCenter", href: "/platform/operations/build-health", labelKey: "platform.nav.buildHealthCenter" },
  { id: "platformHealth", href: "/platform/operations/platform-health", labelKey: "platform.nav.platformHealth" },
  { id: "deployments", href: "/platform/operations/deployments", labelKey: "platform.nav.deployments" },
  { id: "operationsAuditLogs", href: "/platform/operations/audit-logs", labelKey: "platform.nav.operationsAuditLogs" },
  { id: "organizations", href: "/platform/customers", labelKey: "platform.nav.organizations" },
  { id: "customerSuccess", href: "/platform/customers/success-operations", labelKey: "platform.nav.customerSuccess" },
  { id: "payments", href: "/platform/billing/payment-operations", labelKey: "platform.nav.payments" },
  { id: "marketplace", href: "/platform/skills", labelKey: "platform.nav.marketplace" },
  { id: "growthPartners", href: "/platform/pilot-operations", labelKey: "platform.nav.growthPartners" },
  { id: "knowledgeCenter", href: "/platform/knowledge/evolution-center", labelKey: "platform.nav.knowledgeCenter" },
  { id: "translationManagement", href: "/platform/knowledge/translation-management", labelKey: "platform.nav.translationManagement" },
  { id: "documentation", href: "/platform/knowledge/documentation", labelKey: "platform.nav.documentation" },
  { id: "businessPacks", href: "/platform/product/business-packs", labelKey: "platform.nav.businessPacks" },
  { id: "moduleRegistry", href: "/platform/modules/registry", labelKey: "platform.nav.moduleRegistry" },
  { id: "appStoreRevenue", href: "/platform/store/revenue", labelKey: "platform.nav.appStoreRevenue" },
  { id: "productManagement", href: "/platform/product/management", labelKey: "platform.nav.productManagement" },
  { id: "installationOversight", href: "/platform/installations", labelKey: "platform.nav.installationOversight" },
  { id: "activityLogs", href: "/platform/governance/activity-logs", labelKey: "platform.nav.activityLogs" },
  { id: "governanceRecords", href: "/platform/governance/compliance-center", labelKey: "platform.nav.governanceRecords" },
  { id: "securityReviews", href: "/platform/trust/security", labelKey: "platform.nav.securityReviews" },
  { id: "overview", href: "/platform", labelKey: "platform.nav.overview" },
  { id: "executive", href: "/platform/executive", labelKey: "platform.nav.executive" },
  {
    id: "executiveOperationsCenter",
    href: "/platform/executive/operations-center",
    labelKey: "platform.nav.executiveOperationsCenter",
  },
  {
    id: "announcementCenter",
    href: "/platform/communications/announcement-center",
    labelKey: "platform.nav.announcementCenter",
  },
  {
    id: "feedbackCenter",
    href: "/platform/product/feedback-center",
    labelKey: "platform.nav.feedbackCenter",
  },
  {
    id: "productRoadmapCenter",
    href: "/platform/product/roadmap-center",
    labelKey: "platform.nav.productRoadmapCenter",
  },
  {
    id: "productReleaseCenter",
    href: "/platform/product/release-center",
    labelKey: "platform.nav.productReleaseCenter",
  },
  {
    id: "platformKnowledgeEvolutionCenter",
    href: "/platform/knowledge/evolution-center",
    labelKey: "platform.nav.platformKnowledgeEvolutionCenter",
  },
  {
    id: "platformComplianceGovernanceCenter",
    href: "/platform/governance/compliance-center",
    labelKey: "platform.nav.platformComplianceGovernanceCenter",
  },
  {
    id: "platformPlaybookCenter",
    href: "/platform/operations/playbooks",
    labelKey: "platform.nav.platformPlaybookCenter",
  },
  {
    id: "platformHealthOperationsCenter",
    href: "/platform/operations/platform-health",
    labelKey: "platform.nav.platformHealthOperationsCenter",
  },
  {
    id: "platformAcademyStudio",
    href: "/platform/academy",
    labelKey: "platform.nav.platformAcademyStudio",
  },
  {
    id: "customers",
    href: "/platform/customers",
    labelKey: "platform.nav.customers",
  },
  {
    id: "customerLifecycle",
    href: "/platform/customers/lifecycle-center",
    labelKey: "platform.nav.customerLifecycle",
  },
  {
    id: "customerSuccessOperations",
    href: "/platform/customers/success-operations",
    labelKey: "platform.nav.customerSuccessOperations",
  },
  {
    id: "subscriptions",
    href: "/platform/subscriptions",
    labelKey: "platform.nav.subscriptions",
  },
  {
    id: "billing",
    href: "/platform/billing",
    labelKey: "platform.nav.billing",
  },
  {
    id: "paymentOperations",
    href: "/platform/billing/payment-operations",
    labelKey: "platform.nav.paymentOperations",
  },
  {
    id: "paymentHealth",
    href: "/platform/billing/payment-health",
    labelKey: "platform.nav.paymentHealth",
  },
  {
    id: "paymentAnalytics",
    href: "/platform/billing/payment-analytics",
    labelKey: "platform.nav.paymentAnalytics",
  },
  {
    id: "subscriptionOperations",
    href: "/platform/billing/subscription-operations",
    labelKey: "platform.nav.subscriptionOperations",
  },
  {
    id: "revenueOperations",
    href: "/platform/billing/revenue-operations",
    labelKey: "platform.nav.revenueOperations",
  },
  {
    id: "invoices",
    href: "/platform/billing/enterprise-invoices",
    labelKey: "platform.nav.enterpriseInvoices",
  },
  {
    id: "paymentProviders",
    href: "/platform/payment-providers",
    labelKey: "platform.nav.paymentProviders",
  },
  {
    id: "installations",
    href: "/platform/installations",
    labelKey: "platform.nav.installations",
  },
  {
    id: "installEngine",
    href: "/platform/install-engine",
    labelKey: "platform.nav.installEngine",
  },
  {
    id: "updates",
    href: "/platform/updates",
    labelKey: "platform.nav.updates",
  },
  {
    id: "trust",
    href: "/platform/trust",
    labelKey: "platform.nav.trust",
  },
  {
    id: "impact",
    href: "/platform/impact",
    labelKey: "platform.nav.impact",
  },
  {
    id: "presencePilot",
    href: "/platform/presence-pilot",
    labelKey: "platform.nav.presencePilot",
  },
  {
    id: "pilotOperations",
    href: "/platform/pilot-operations",
    labelKey: "platform.nav.pilotOperations",
  },
  {
    id: "pilotInstall",
    href: "/platform/install/unonight",
    labelKey: "platform.nav.pilotInstall",
  },
  {
    id: "metrics",
    href: "/platform/metrics",
    labelKey: "platform.nav.metrics",
  },
  {
    id: "analyticsCustomerJourneys",
    href: "/platform/analytics/customer-journeys",
    labelKey: "platform.nav.analyticsCustomerJourneys",
  },
  {
    id: "support",
    href: "/platform/support",
    labelKey: "platform.nav.support",
  },
  {
    id: "automations",
    href: "/platform/automations",
    labelKey: "platform.nav.automations",
  },
  {
    id: "intelligence",
    href: "/platform/intelligence",
    labelKey: "platform.nav.intelligence",
  },
  {
    id: "actions",
    href: "/platform/actions",
    labelKey: "platform.nav.actions",
  },
  {
    id: "skills",
    href: "/platform/skills",
    labelKey: "platform.nav.skillsMarketplace",
  },
  {
    id: "companionMarketplace",
    href: "/platform/companion-marketplace",
    labelKey: "platform.nav.companionMarketplace",
  },
  {
    id: "skillGovernancePipeline",
    href: "/platform/skills/governance",
    labelKey: "platform.nav.skillGovernancePipeline",
  },
  {
    id: "system",
    href: "/platform/system",
    labelKey: "platform.nav.system",
  },
];

export const PLATFORM_MOBILE_NAV_IDS: PlatformNavId[] = [
  "overview",
  "organizations",
  "support",
  "payments",
];

export function getPlatformActiveNavId(pathname: string): PlatformNavId {
  if (pathname === "/platform") return "overview";
  if (pathname.startsWith("/platform/operations/build-health")) return "buildHealthCenter";
  if (pathname.startsWith("/platform/operations/route-registry")) return "buildHealthCenter";
  if (pathname.startsWith("/platform/operations/overview")) return "operationsOverview";
  if (pathname.startsWith("/platform/operations/platform-health")) return "platformHealth";
  if (pathname.startsWith("/platform/operations/deployments")) return "deployments";
  if (pathname.startsWith("/platform/operations/audit-logs")) return "operationsAuditLogs";
  if (pathname.startsWith("/platform/operations/playbooks")) return "operationsOverview";
  if (pathname.startsWith("/platform/operations")) return "operationsOverview";
  if (pathname.startsWith("/platform/customers/success-operations")) return "customerSuccess";
  if (pathname.startsWith("/platform/customers")) return "organizations";
  if (pathname.startsWith("/platform/billing/payment-operations")) return "payments";
  if (pathname.startsWith("/platform/billing")) return "payments";
  if (pathname.startsWith("/platform/subscriptions")) return "subscriptions";
  if (pathname.startsWith("/platform/companion-marketplace")) return "marketplace";
  if (pathname.startsWith("/platform/skills")) return "marketplace";
  if (pathname.startsWith("/platform/pilot-operations")) return "growthPartners";
  if (pathname.startsWith("/platform/knowledge/translation-management")) return "translationManagement";
  if (pathname.startsWith("/platform/knowledge/documentation")) return "documentation";
  if (pathname.startsWith("/platform/knowledge/evolution-center")) return "knowledgeCenter";
  if (pathname.startsWith("/platform/knowledge")) return "knowledgeCenter";
  if (pathname.startsWith("/platform/product/business-packs")) return "businessPacks";
  if (pathname.startsWith("/platform/modules/registry")) return "moduleRegistry";
  if (pathname.startsWith("/platform/store/revenue")) return "appStoreRevenue";
  if (pathname.startsWith("/platform/product/management")) return "productManagement";
  if (pathname.startsWith("/platform/product")) return "productManagement";
  if (pathname.startsWith("/platform/installations")) return "installationOversight";
  if (pathname.startsWith("/platform/governance/activity-logs")) return "activityLogs";
  if (pathname.startsWith("/platform/governance/compliance-center")) return "governanceRecords";
  if (pathname.startsWith("/platform/governance")) return "governanceRecords";
  if (pathname.startsWith("/platform/trust/security")) return "securityReviews";
  if (pathname.startsWith("/platform/support")) return "support";
  if (pathname.startsWith("/platform/updates")) return "deployments";
  if (pathname.startsWith("/platform/trust")) return "trust";
  if (pathname.startsWith("/platform/impact")) return "impact";
  if (pathname.startsWith("/platform/presence-pilot")) return "presencePilot";
  if (pathname.startsWith("/platform/pilot-operations")) return "pilotOperations";
  if (pathname.startsWith("/platform/install/unonight")) return "pilotInstall";
  if (pathname.startsWith("/platform/installations")) return "installations";
  if (pathname.startsWith("/platform/analytics/customer-journeys")) return "analyticsCustomerJourneys";
  if (pathname.startsWith("/platform/analytics")) return "analyticsCustomerJourneys";
  if (pathname.startsWith("/platform/metrics")) return "metrics";
  if (pathname.startsWith("/platform/stats")) return "metrics";
  if (pathname.startsWith("/platform/support")) return "support";
  if (pathname.startsWith("/platform/automations")) return "automations";
  if (pathname.startsWith("/platform/intelligence")) return "intelligence";
  if (pathname.startsWith("/platform/actions")) return "actions";
  if (pathname.startsWith("/platform/skills/governance")) return "skillGovernancePipeline";
  if (pathname.startsWith("/platform/skills")) return "skills";
  if (pathname.startsWith("/platform/companion-marketplace")) return "companionMarketplace";
  if (pathname.startsWith("/platform/system")) return "system";
  return "overview";
}

export function getOperationsActiveNavId(pathname: string): OperationsNavId {
  if (pathname.startsWith("/platform/operations/platform-health")) return "platformHealth";
  return "playbooks";
}

export function getGovernanceActiveNavId(_pathname: string): GovernanceNavId {
  return "complianceCenter";
}

export function getKnowledgeActiveNavId(pathname: string): KnowledgeNavId {
  return "evolutionCenter";
}

export function getProductActiveNavId(pathname: string): ProductNavId {
  if (pathname.startsWith("/platform/product/release-center")) return "releaseCenter";
  if (pathname.startsWith("/platform/product/roadmap-center")) return "roadmapCenter";
  return "feedbackCenter";
}

export function getAnalyticsActiveNavId(pathname: string): AnalyticsNavId {
  if (pathname.startsWith("/platform/analytics/customer-journeys")) return "customerJourneys";
  return "customerJourneys";
}

export function getActionActiveNavId(pathname: string): ActionNavId {
  if (pathname.startsWith("/platform/actions/approved")) return "approved";
  if (pathname.startsWith("/platform/actions/executed")) return "executed";
  if (pathname.startsWith("/platform/actions/failed")) return "failed";
  if (pathname.startsWith("/platform/actions/templates")) return "templates";
  if (pathname.startsWith("/platform/actions/policies")) return "policies";
  if (pathname.startsWith("/platform/actions/logs")) return "logs";
  return "pending";
}

export function getIntelligenceActiveNavId(pathname: string): IntelligenceNavId {
  if (pathname.startsWith("/platform/intelligence/decision-center")) return "decisionCenter";
  if (pathname.startsWith("/platform/intelligence/learning-queue")) return "learningQueue";
  if (pathname.startsWith("/platform/intelligence/global-patterns")) return "globalPatterns";
  if (pathname.startsWith("/platform/intelligence/self-healing")) return "selfHealing";
  if (pathname.startsWith("/platform/intelligence/settings")) return "settings";
  if (pathname.startsWith("/platform/intelligence/audit-log")) return "auditLog";
  return "brain";
}
