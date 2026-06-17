export const APP_PORTAL_HOME_ROUTE = "/app";

export const APP_ORGANIZATION_ROLES = [
  "organization_owner",
  "organization_admin",
  "organization_manager",
  "organization_member",
] as const;

export type AppOrganizationRole = (typeof APP_ORGANIZATION_ROLES)[number];

export type AppPortalNavId =
  | "appDashboard"
  | "sinceLastLogin"
  | "appNotifications"
  | "teamMembers"
  | "responsibilities"
  | "externalRelationships"
  | "organizationalAssets"
  | "communications"
  | "trustCulture"
  | "rolesPermissions"
  | "activityOverview"
  | "installedBusinessPacks"
  | "availableBusinessPacks"
  | "businessPackSettings"
  | "businessPackSuccess"
  | "businessPackRecommendations"
  | "businessPackLifecycle"
  | "businessPackValue"
  | "businessPackCommandCenter"
  | "businessPackEcosystemIntelligence"
  | "businessPackAutomation"
  | "businessPackGovernance"
  | "businessPackCompliance"
  | "businessPackExecutivePortfolio"
  | "appTasks"
  | "workflows"
  | "insights"
  | "executiveInsights"
  | "followUps"
  | "decisionCenter"
  | "activityHistory"
  | "capabilityCenter"
  | "goalsObjectives"
  | "playbooks"
  | "risks"
  | "compliance"
  | "meetings"
  | "continuity"
  | "learningImprovement"
  | "capacityWorkload"
  | "successValue"
  | "strategyExecution"
  | "prioritizationEngine"
  | "commitmentTracking"
  | "intelligenceBriefings"
  | "momentum"
  | "resilience"
  | "executiveCompanion"
  | "enterpriseBenchmarking"
  | "predictiveIntelligence"
  | "scenarioPlanning"
  | "executiveForesight"
  | "strategicOpportunities"
  | "organizationalForecasting"
  | "abosCommandCenter"
  | "subscription"
  | "paymentHistory"
  | "invoices"
  | "upgradeOptions"
  | "knowledgeCenter"
  | "contactSupport"
  | "supportRequests"
  | "supportAssistant"
  | "successCenter"
  | "gettingStarted"
  | "customerAcademy"
  | "customerSuccess"
  | "customerHealth"
  | "supportHistory"
  | "profile"
  | "preferences"
  | "accountSecurity"
  | "accountNotifications"
  | "integrations"
  | "connectedIntegrations"
  | "connectIntegration"
  | "apiAccess";

export type AppPortalNavGroupId =
  | "home"
  | "organization"
  | "businessPacks"
  | "operations"
  | "billing"
  | "support"
  | "account"
  | "appPlatform"
  | "intelligence";

export type AppPortalNavItem = {
  id: AppPortalNavId;
  href: string;
  labelKey: string;
  featureKey?: string;
};

export type AppPortalNavGroup = {
  id: AppPortalNavGroupId;
  labelKey: string;
  items: AppPortalNavItem[];
  defaultExpanded?: boolean;
};

export const APP_PORTAL_NAV_GROUPS: AppPortalNavGroup[] = [
  {
    id: "home",
    labelKey: "customerApp.portalStructure.navGroups.home",
    defaultExpanded: true,
    items: [
      { id: "appDashboard", href: "/app", labelKey: "customerApp.portalStructure.nav.dashboard" },
      { id: "sinceLastLogin", href: "/app/since-last-login", labelKey: "customerApp.portalStructure.nav.sinceLastLogin" },
      { id: "appNotifications", href: "/app/notifications", labelKey: "customerApp.portalStructure.nav.notifications" },
    ],
  },
  {
    id: "organization",
    labelKey: "customerApp.portalStructure.navGroups.organization",
    items: [
      { id: "teamMembers", href: "/app/organization/team", labelKey: "customerApp.portalStructure.nav.teamMembers" },
      { id: "responsibilities", href: "/app/organization/responsibilities", labelKey: "customerApp.portalStructure.nav.responsibilities" },
      { id: "externalRelationships", href: "/app/organization/external-relationships", labelKey: "customerApp.portalStructure.nav.externalRelationships" },
      { id: "organizationalAssets", href: "/app/organization/assets", labelKey: "customerApp.portalStructure.nav.organizationalAssets" },
      { id: "communications", href: "/app/organization/communications", labelKey: "customerApp.portalStructure.nav.communications" },
      { id: "trustCulture", href: "/app/organization/culture", labelKey: "customerApp.portalStructure.nav.trustCulture" },
      { id: "rolesPermissions", href: "/app/organization/roles", labelKey: "customerApp.portalStructure.nav.rolesPermissions", featureKey: "team_management" },
      { id: "activityOverview", href: "/app/organization/activity", labelKey: "customerApp.portalStructure.nav.activityOverview" },
    ],
  },
  {
    id: "businessPacks",
    labelKey: "customerApp.portalStructure.navGroups.businessPacks",
    items: [
      { id: "installedBusinessPacks", href: "/app/business-packs/installed", labelKey: "customerApp.portalStructure.nav.installedBusinessPacks", featureKey: "business_packs" },
      { id: "businessPackSuccess", href: "/app/business-packs/success", labelKey: "customerApp.portalStructure.nav.businessPackSuccess", featureKey: "business_packs" },
      { id: "businessPackRecommendations", href: "/app/business-packs/recommendations", labelKey: "customerApp.portalStructure.nav.businessPackRecommendations", featureKey: "business_packs" },
      { id: "businessPackLifecycle", href: "/app/business-packs/lifecycle", labelKey: "customerApp.portalStructure.nav.businessPackLifecycle", featureKey: "business_packs" },
      { id: "businessPackValue", href: "/app/business-packs/value", labelKey: "customerApp.portalStructure.nav.businessPackValue", featureKey: "business_packs" },
      { id: "businessPackCommandCenter", href: "/app/business-packs/command-center", labelKey: "customerApp.portalStructure.nav.businessPackCommandCenter", featureKey: "business_packs" },
      { id: "businessPackEcosystemIntelligence", href: "/app/business-packs/ecosystem-intelligence", labelKey: "customerApp.portalStructure.nav.businessPackEcosystemIntelligence", featureKey: "business_packs" },
      { id: "businessPackAutomation", href: "/app/business-packs/automation", labelKey: "customerApp.portalStructure.nav.businessPackAutomation", featureKey: "business_packs" },
      { id: "businessPackGovernance", href: "/app/business-packs/governance", labelKey: "customerApp.portalStructure.nav.businessPackGovernance", featureKey: "business_packs" },
      { id: "businessPackCompliance", href: "/app/business-packs/compliance", labelKey: "customerApp.portalStructure.nav.businessPackCompliance", featureKey: "business_packs" },
      { id: "businessPackExecutivePortfolio", href: "/app/business-packs/executive-portfolio", labelKey: "customerApp.portalStructure.nav.businessPackExecutivePortfolio", featureKey: "business_packs" },
      { id: "availableBusinessPacks", href: "/app/business-packs/available", labelKey: "customerApp.portalStructure.nav.availableBusinessPacks", featureKey: "business_packs" },
      { id: "businessPackSettings", href: "/app/business-packs/settings", labelKey: "customerApp.portalStructure.nav.businessPackSettings", featureKey: "business_packs" },
    ],
  },
  {
    id: "operations",
    labelKey: "customerApp.portalStructure.navGroups.operations",
    items: [
      { id: "appTasks", href: "/app/operations/tasks", labelKey: "customerApp.portalStructure.nav.tasks" },
      { id: "workflows", href: "/app/operations/workflows", labelKey: "customerApp.portalStructure.nav.workflows", featureKey: "workflows" },
      { id: "executiveInsights", href: "/app/operations/executive-insights", labelKey: "customerApp.portalStructure.nav.executiveInsights" },
      { id: "followUps", href: "/app/operations/follow-ups", labelKey: "customerApp.portalStructure.nav.followUps" },
      { id: "decisionCenter", href: "/app/operations/decision-center", labelKey: "customerApp.portalStructure.nav.decisionCenter" },
      { id: "activityHistory", href: "/app/operations/activity-history", labelKey: "customerApp.portalStructure.nav.activityHistory" },
      { id: "capabilityCenter", href: "/app/operations/capability-center", labelKey: "customerApp.portalStructure.nav.capabilityCenter" },
      { id: "goalsObjectives", href: "/app/operations/goals", labelKey: "customerApp.portalStructure.nav.goalsObjectives" },
      { id: "playbooks", href: "/app/operations/playbooks", labelKey: "customerApp.portalStructure.nav.playbooks" },
      { id: "risks", href: "/app/operations/risks", labelKey: "customerApp.portalStructure.nav.risks" },
      { id: "compliance", href: "/app/operations/compliance", labelKey: "customerApp.portalStructure.nav.compliance" },
      { id: "meetings", href: "/app/operations/meetings", labelKey: "customerApp.portalStructure.nav.meetings" },
      { id: "continuity", href: "/app/operations/continuity", labelKey: "customerApp.portalStructure.nav.continuity" },
      { id: "learningImprovement", href: "/app/operations/learning", labelKey: "customerApp.portalStructure.nav.learningImprovement" },
      { id: "capacityWorkload", href: "/app/operations/capacity", labelKey: "customerApp.portalStructure.nav.capacityWorkload" },
      { id: "successValue", href: "/app/operations/success", labelKey: "customerApp.portalStructure.nav.successValue" },
      { id: "strategyExecution", href: "/app/operations/strategy", labelKey: "customerApp.portalStructure.nav.strategyExecution" },
      { id: "prioritizationEngine", href: "/app/operations/prioritization", labelKey: "customerApp.portalStructure.nav.prioritizationEngine" },
      { id: "commitmentTracking", href: "/app/operations/commitments", labelKey: "customerApp.portalStructure.nav.commitmentTracking" },
      { id: "intelligenceBriefings", href: "/app/operations/briefings", labelKey: "customerApp.portalStructure.nav.intelligenceBriefings" },
      { id: "momentum", href: "/app/operations/momentum", labelKey: "customerApp.portalStructure.nav.momentum" },
      { id: "resilience", href: "/app/operations/resilience", labelKey: "customerApp.portalStructure.nav.resilience" },
      { id: "insights", href: "/app/operations/insights", labelKey: "customerApp.portalStructure.nav.insights", featureKey: "advanced_insights" },
    ],
  },
  {
    id: "intelligence",
    labelKey: "customerApp.portalStructure.navGroups.intelligence",
    items: [
      { id: "abosCommandCenter", href: "/app/intelligence/command-center", labelKey: "customerApp.portalStructure.nav.abosCommandCenter" },
      { id: "executiveCompanion", href: "/app/intelligence/executive-companion", labelKey: "customerApp.portalStructure.nav.executiveCompanion" },
      { id: "enterpriseBenchmarking", href: "/app/intelligence/benchmarking", labelKey: "customerApp.portalStructure.nav.enterpriseBenchmarking" },
      { id: "predictiveIntelligence", href: "/app/intelligence/predictive", labelKey: "customerApp.portalStructure.nav.predictiveIntelligence" },
      { id: "scenarioPlanning", href: "/app/intelligence/scenario-planning", labelKey: "customerApp.portalStructure.nav.scenarioPlanning" },
      { id: "executiveForesight", href: "/app/intelligence/executive-foresight", labelKey: "customerApp.portalStructure.nav.executiveForesight" },
      { id: "strategicOpportunities", href: "/app/intelligence/strategic-opportunities", labelKey: "customerApp.portalStructure.nav.strategicOpportunities" },
      { id: "organizationalForecasting", href: "/app/intelligence/organizational-forecasting", labelKey: "customerApp.portalStructure.nav.organizationalForecasting" },
    ],
  },
  {
    id: "billing",
    labelKey: "customerApp.portalStructure.navGroups.billing",
    items: [
      { id: "subscription", href: "/app/billing/subscription", labelKey: "customerApp.portalStructure.nav.subscription", featureKey: "billing" },
      { id: "paymentHistory", href: "/app/billing/payment-history", labelKey: "customerApp.portalStructure.nav.paymentHistory", featureKey: "billing" },
      { id: "invoices", href: "/app/billing/invoices", labelKey: "customerApp.portalStructure.nav.invoices", featureKey: "billing" },
      { id: "upgradeOptions", href: "/app/billing/upgrade", labelKey: "customerApp.portalStructure.nav.upgradeOptions", featureKey: "billing" },
    ],
  },
  {
    id: "support",
    labelKey: "customerApp.portalStructure.navGroups.support",
    items: [
      { id: "knowledgeCenter", href: "/app/support/knowledge", labelKey: "customerApp.portalStructure.nav.knowledgeCenter" },
      { id: "contactSupport", href: "/app/support/contact", labelKey: "customerApp.portalStructure.nav.contactSupport" },
      { id: "supportRequests", href: "/app/support/requests", labelKey: "customerApp.portalStructure.nav.supportRequests" },
      { id: "supportAssistant", href: "/app/support/assistant", labelKey: "customerApp.portalStructure.nav.supportAssistant" },
      { id: "successCenter", href: "/app/support/success-center", labelKey: "customerApp.portalStructure.nav.successCenter" },
      { id: "gettingStarted", href: "/app/support/getting-started", labelKey: "customerApp.portalStructure.nav.gettingStarted" },
      { id: "customerAcademy", href: "/app/support/academy", labelKey: "customerApp.portalStructure.nav.customerAcademy" },
      { id: "customerSuccess", href: "/app/support/customer-success", labelKey: "customerApp.portalStructure.nav.customerSuccess" },
      { id: "customerHealth", href: "/app/support/customer-health", labelKey: "customerApp.portalStructure.nav.customerHealth" },
      { id: "supportHistory", href: "/app/support/history", labelKey: "customerApp.portalStructure.nav.supportHistory" },
    ],
  },
  {
    id: "account",
    labelKey: "customerApp.portalStructure.navGroups.account",
    items: [
      { id: "profile", href: "/app/account/profile", labelKey: "customerApp.portalStructure.nav.profile" },
      { id: "preferences", href: "/app/account/preferences", labelKey: "customerApp.portalStructure.nav.preferences" },
      { id: "accountSecurity", href: "/app/account/security", labelKey: "customerApp.portalStructure.nav.security" },
      { id: "accountNotifications", href: "/app/account/notifications", labelKey: "customerApp.portalStructure.nav.accountNotifications" },
    ],
  },
  {
    id: "appPlatform",
    labelKey: "customerApp.portalStructure.navGroups.appPlatform",
    items: [
      { id: "integrations", href: "/app/platform/integrations", labelKey: "customerApp.portalStructure.nav.integrations", featureKey: "integrations" },
      { id: "connectedIntegrations", href: "/app/platform/integrations/connected", labelKey: "customerApp.portalStructure.nav.connectedIntegrations", featureKey: "integrations" },
      { id: "connectIntegration", href: "/app/platform/integrations/connect", labelKey: "customerApp.portalStructure.nav.connectIntegration", featureKey: "integrations" },
      { id: "apiAccess", href: "/app/platform/api-access", labelKey: "customerApp.portalStructure.nav.apiAccess", featureKey: "integrations" },
    ],
  },
];

export const APP_PORTAL_NAV: AppPortalNavItem[] = APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items);

export function getAppPortalActiveNavId(pathname: string): AppPortalNavId {
  if (pathname === "/app") return "appDashboard";
  if (pathname.startsWith("/app/platform/integrations/connect")) return "connectIntegration";
  if (pathname.startsWith("/app/platform/integrations/connected")) return "connectedIntegrations";
  if (pathname.startsWith("/app/platform/integrations")) return "integrations";
  if (pathname.startsWith("/app/platform/api-access")) return "apiAccess";
  if (pathname.startsWith("/app/intelligence/predictive")) return "predictiveIntelligence";
  if (pathname.startsWith("/app/intelligence/scenario-planning")) return "scenarioPlanning";
  if (pathname.startsWith("/dashboard/intelligence/scenario-planning")) return "scenarioPlanning";
  if (pathname.startsWith("/app/intelligence/executive-foresight")) return "executiveForesight";
  if (pathname.startsWith("/dashboard/intelligence/executive-foresight")) return "executiveForesight";
  if (pathname.startsWith("/app/intelligence/strategic-opportunities")) return "strategicOpportunities";
  if (pathname.startsWith("/dashboard/intelligence/strategic-opportunities")) return "strategicOpportunities";
  if (pathname.startsWith("/app/intelligence/organizational-forecasting")) return "organizationalForecasting";
  if (pathname.startsWith("/dashboard/intelligence/organizational-forecasting")) return "organizationalForecasting";
  if (pathname.startsWith("/app/intelligence/benchmarking")) return "enterpriseBenchmarking";
  if (pathname.startsWith("/app/intelligence/command-center")) return "abosCommandCenter";
  if (pathname.startsWith("/app/intelligence/executive-companion")) return "executiveCompanion";
  if (pathname.startsWith("/app/operations/executive-insights")) return "executiveInsights";
  if (pathname.startsWith("/app/operations/follow-ups")) return "followUps";
  if (pathname.startsWith("/app/operations/decision-center")) return "decisionCenter";
  if (pathname.startsWith("/app/operations/activity-history")) return "activityHistory";
  if (pathname.startsWith("/app/operations/capability-center")) return "capabilityCenter";
  if (pathname.startsWith("/app/organization/responsibilities")) return "responsibilities";
  if (pathname.startsWith("/app/organization/external-relationships")) return "externalRelationships";
  if (pathname.startsWith("/app/organization/assets")) return "organizationalAssets";
  if (pathname.startsWith("/app/organization/communications")) return "communications";
  if (pathname.startsWith("/app/organization/communications")) return "communications";
  if (pathname.startsWith("/app/organization/culture")) return "trustCulture";
  if (pathname.startsWith("/app/operations/goals")) return "goalsObjectives";
  if (pathname.startsWith("/app/operations/playbooks")) return "playbooks";
  if (pathname.startsWith("/app/operations/risks")) return "risks";
  if (pathname.startsWith("/app/operations/compliance")) return "compliance";
  if (pathname.startsWith("/app/operations/meetings")) return "meetings";
  if (pathname.startsWith("/app/operations/continuity")) return "continuity";
  if (pathname.startsWith("/app/operations/learning")) return "learningImprovement";
  if (pathname.startsWith("/app/operations/capacity")) return "capacityWorkload";
  if (pathname.startsWith("/app/operations/success")) return "successValue";
  if (pathname.startsWith("/app/operations/strategy")) return "strategyExecution";
  if (pathname.startsWith("/app/operations/prioritization")) return "prioritizationEngine";
  if (pathname.startsWith("/app/operations/commitments")) return "commitmentTracking";
  if (pathname.startsWith("/app/operations/briefings")) return "intelligenceBriefings";
  if (pathname.startsWith("/app/operations/momentum")) return "momentum";
  if (pathname.startsWith("/app/operations/resilience")) return "resilience";
  if (pathname.startsWith("/app/support/requests")) return "supportRequests";
  if (pathname.startsWith("/app/support/assistant")) return "supportAssistant";
  if (pathname.startsWith("/app/support/success-center")) return "successCenter";
  if (pathname.startsWith("/app/support/getting-started")) return "gettingStarted";
  if (pathname.startsWith("/app/support/academy")) return "customerAcademy";
  if (pathname.startsWith("/app/support/customer-success")) return "customerSuccess";
  if (pathname.startsWith("/app/support/customer-health")) return "customerHealth";
  for (const group of APP_PORTAL_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href !== "/app" && pathname.startsWith(item.href)) {
        return item.id;
      }
    }
  }
  return "appDashboard";
}

export const APP_PORTAL_FAQ_ARTICLES = [
  { slug: "what-is-aipify", titleKey: "customerApp.portalStructure.faq.whatIsAipify" },
  { slug: "invite-team-members", titleKey: "customerApp.portalStructure.faq.inviteTeamMembers" },
  { slug: "change-subscriptions", titleKey: "customerApp.portalStructure.faq.changeSubscriptions" },
  { slug: "upgrade-plan", titleKey: "customerApp.portalStructure.faq.upgradePlan" },
  { slug: "what-are-business-packs", titleKey: "customerApp.portalStructure.faq.whatAreBusinessPacks" },
  { slug: "view-invoices", titleKey: "customerApp.portalStructure.faq.viewInvoices" },
  { slug: "contact-support", titleKey: "customerApp.portalStructure.faq.contactSupport" },
  { slug: "role-management", titleKey: "customerApp.portalStructure.faq.roleManagement" },
  { slug: "since-last-login", titleKey: "customerApp.portalStructure.faq.sinceLastLogin" },
  { slug: "feature-access", titleKey: "customerApp.portalStructure.faq.featureAccess" },
  { slug: "upgrade-permissions", titleKey: "customerApp.portalStructure.faq.upgradePermissions" },
  { slug: "notification-preferences", titleKey: "customerApp.portalStructure.faq.notificationPreferences" },
] as const;
