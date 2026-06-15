export type PlatformNavId =
  | "executive"
  | "executiveOperationsCenter"
  | "announcementCenter"
  | "feedbackCenter"
  | "productRoadmapCenter"
  | "productReleaseCenter"
  | "platformKnowledgeEvolutionCenter"
  | "platformComplianceGovernanceCenter"
  | "platformPlaybookCenter"
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

export type OperationsNavId = "playbooks";

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
    id: "platformAcademyStudio",
    href: "/platform/academy",
    labelKey: "platform.nav.platformAcademyStudio",
  },
  { id: "overview", href: "/platform", labelKey: "platform.nav.overview" },
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
  "customers",
  "invoices",
  "billing",
];

export function getPlatformActiveNavId(pathname: string): PlatformNavId {
  if (pathname.startsWith("/platform/operations/playbooks")) return "platformPlaybookCenter";
  if (pathname.startsWith("/platform/academy")) return "platformAcademyStudio";
  if (pathname.startsWith("/platform/operations")) return "platformPlaybookCenter";
  if (pathname.startsWith("/platform/governance/compliance-center")) return "platformComplianceGovernanceCenter";
  if (pathname.startsWith("/platform/governance")) return "platformComplianceGovernanceCenter";
  if (pathname.startsWith("/platform/knowledge/evolution-center")) return "platformKnowledgeEvolutionCenter";
  if (pathname.startsWith("/platform/knowledge")) return "platformKnowledgeEvolutionCenter";
  if (pathname.startsWith("/platform/product/release-center")) return "productReleaseCenter";
  if (pathname.startsWith("/platform/product/roadmap-center")) return "productRoadmapCenter";
  if (pathname.startsWith("/platform/product/feedback-center")) return "feedbackCenter";
  if (pathname.startsWith("/platform/communications/announcement-center")) return "announcementCenter";
  if (pathname.startsWith("/platform/executive/operations-center")) return "executiveOperationsCenter";
  if (pathname.startsWith("/platform/executive")) return "executive";
  if (pathname.startsWith("/platform/customers/success-operations")) return "customerSuccessOperations";
  if (pathname.startsWith("/platform/customers/lifecycle-center")) return "customerLifecycle";
  if (pathname.startsWith("/platform/customers")) return "customers";
  if (pathname.startsWith("/platform/subscriptions")) return "subscriptions";
  if (pathname.startsWith("/platform/billing/payment-operations")) return "paymentOperations";
  if (pathname.startsWith("/platform/billing/payment-health")) return "paymentHealth";
  if (pathname.startsWith("/platform/billing/payment-analytics")) return "paymentAnalytics";
  if (pathname.startsWith("/platform/billing/subscription-operations")) return "subscriptionOperations";
  if (pathname.startsWith("/platform/billing/revenue-operations")) return "revenueOperations";
  if (pathname.startsWith("/platform/billing/enterprise-invoices")) return "invoices";
  if (pathname.startsWith("/platform/billing")) return "billing";
  if (pathname.startsWith("/platform/invoices")) return "invoices";
  if (pathname.startsWith("/platform/payment-providers")) return "paymentProviders";
  if (pathname.startsWith("/platform/install-engine")) return "installEngine";
  if (pathname.startsWith("/platform/updates")) return "updates";
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

export function getOperationsActiveNavId(_pathname: string): OperationsNavId {
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
