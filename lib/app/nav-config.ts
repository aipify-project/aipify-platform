import { resolveAppHref } from "./route-aliases";

export type AppNavId =
  | "overview"
  | "aipifyCorePlatformEngine"
  | "multiTenantArchitectureEngine"
  | "identityPermissionsEngine"
  | "secureAiActionEngine"
  | "auditAccountabilityEngine"
  | "knowledgeCenterEngine"
  | "adminAssistantEngine"
  | "supportAiEngine"
  | "integrationEngine"
  | "operationsDashboardEngine"
  | "customerOnboardingEngine"
  | "subscriptionPlanManagementEngine"
  | "selfSupportEngine"
  | "qualityGuardianEngine"
  | "governancePolicyEngine"
  | "unonightPilotOperationsEngine"
  | "analyticsInsightsEngine"
  | "notificationCommunicationEngine"
  | "deploymentEnvironmentManagementEngine"
  | "observabilityPlatformHealthEngine"
  | "aipifyInstallEngine"
  | "moduleMarketplaceFoundationEngine"
  | "aipifyInternalOperationsEngine"
  | "launchReadinessEngine"
  | "customerSuccessEngine"
  | "briefing"
  | "executive"
  | "presence"
  | "assistant"
  | "recommendations"
  | "learning"
  | "skills"
  | "marketplace"
  | "industryBlueprints"
  | "globalLearning"
  | "evolution"
  | "valueEngine"
  | "outcomesEngine"
  | "agents"
  | "appEcosystem"
  | "trustEngine"
  | "digitalTwin"
  | "simulationLab"
  | "operationsCenter"
  | "continuityEngine"
  | "strategyEngine"
  | "humanSuccessEngine"
  | "customerLifecycleEngine"
  | "platformIntegrityEngine"
  | "ecosystemIntelligenceEngine"
  | "communityIntelligenceEngine"
  | "marketplaceGovernanceEngine"
  | "partnerCertificationEngine"
  | "commercialModelEngine"
  | "academyEngine"
  | "globalExpansionEngine"
  | "innovationLabEngine"
  | "futureTechEngine"
  | "constitutionEngine"
  | "manifestoEngine"
  | "platformInstallEngine"
  | "commerceIntelligenceEngine"
  | "productAutomationEngine"
  | "dropshippingOperationsEngine"
  | "commercePerformanceEngine"
  | "multiStoreOrchestrationEngine"
  | "personalityEngine"
  | "workstyleEngine"
  | "approvals"
  | "actionCenter"
  | "businessPulse"
  | "strategicGoals"
  | "frictionIntelligence"
  | "organizationalMemory"
  | "organizationalIntelligence"
  | "predictiveIntelligence"
  | "adaptiveAutomation"
  | "governance"
  | "enterprise"
  | "quality"
  | "knowledgeCenter"
  | "installations"
  | "domains"
  | "team"
  | "license"
  | "security"
  | "orchestration"
  | "settings";

export type AppNavItem = {
  id: AppNavId;
  href: string;
  labelKey: string;
};

/** Canonical Customer App 1.0 navigation (Phase 28). */
export const APP_NAV: AppNavItem[] = [
  { id: "overview", href: "/app", labelKey: "customerApp.nav.overview" },
  { id: "aipifyCorePlatformEngine", href: "/app/aipify-core", labelKey: "customerApp.nav.aipifyCorePlatformEngine" },
  { id: "multiTenantArchitectureEngine", href: "/app/multi-tenant", labelKey: "customerApp.nav.multiTenantArchitectureEngine" },
  { id: "identityPermissionsEngine", href: "/app/identity-access", labelKey: "customerApp.nav.identityPermissionsEngine" },
  { id: "secureAiActionEngine", href: "/app/secure-ai-actions", labelKey: "customerApp.nav.secureAiActionEngine" },
  { id: "auditAccountabilityEngine", href: "/app/audit-accountability", labelKey: "customerApp.nav.auditAccountabilityEngine" },
  { id: "knowledgeCenterEngine", href: "/app/knowledge-center-engine", labelKey: "customerApp.nav.knowledgeCenterEngine" },
  { id: "adminAssistantEngine", href: "/app/admin-assistant-engine", labelKey: "customerApp.nav.adminAssistantEngine" },
  { id: "supportAiEngine", href: "/app/support-ai-engine", labelKey: "customerApp.nav.supportAiEngine" },
  { id: "integrationEngine", href: "/app/integration-engine", labelKey: "customerApp.nav.integrationEngine" },
  { id: "operationsDashboardEngine", href: "/app/operations-dashboard-engine", labelKey: "customerApp.nav.operationsDashboardEngine" },
  { id: "customerOnboardingEngine", href: "/app/customer-onboarding-engine", labelKey: "customerApp.nav.customerOnboardingEngine" },
  {
    id: "subscriptionPlanManagementEngine",
    href: "/app/subscription-plan-management-engine",
    labelKey: "customerApp.nav.subscriptionPlanManagementEngine",
  },
  { id: "selfSupportEngine", href: "/app/self-support-engine", labelKey: "customerApp.nav.selfSupportEngine" },
  { id: "qualityGuardianEngine", href: "/app/quality-guardian-engine", labelKey: "customerApp.nav.qualityGuardianEngine" },
  { id: "governancePolicyEngine", href: "/app/governance-policy-engine", labelKey: "customerApp.nav.governancePolicyEngine" },
  {
    id: "unonightPilotOperationsEngine",
    href: "/app/unonight-pilot-operations-engine",
    labelKey: "customerApp.nav.unonightPilotOperationsEngine",
  },
  { id: "analyticsInsightsEngine", href: "/app/analytics-insights-engine", labelKey: "customerApp.nav.analyticsInsightsEngine" },
  {
    id: "notificationCommunicationEngine",
    href: "/app/notification-communication-engine",
    labelKey: "customerApp.nav.notificationCommunicationEngine",
  },
  {
    id: "deploymentEnvironmentManagementEngine",
    href: "/app/deployment-environment-management-engine",
    labelKey: "customerApp.nav.deploymentEnvironmentManagementEngine",
  },
  {
    id: "observabilityPlatformHealthEngine",
    href: "/app/observability-platform-health-engine",
    labelKey: "customerApp.nav.observabilityPlatformHealthEngine",
  },
  {
    id: "aipifyInstallEngine",
    href: "/app/aipify-install-engine",
    labelKey: "customerApp.nav.aipifyInstallEngine",
  },
  {
    id: "moduleMarketplaceFoundationEngine",
    href: "/app/module-marketplace-foundation-engine",
    labelKey: "customerApp.nav.moduleMarketplaceFoundationEngine",
  },
  {
    id: "aipifyInternalOperationsEngine",
    href: "/app/aipify-internal-operations-engine",
    labelKey: "customerApp.nav.aipifyInternalOperationsEngine",
  },
  {
    id: "launchReadinessEngine",
    href: "/app/launch-readiness-engine",
    labelKey: "customerApp.nav.launchReadinessEngine",
  },
  {
    id: "customerSuccessEngine",
    href: "/app/customer-success-engine",
    labelKey: "customerApp.nav.customerSuccessEngine",
  },
  { id: "briefing", href: "/app/briefing", labelKey: "customerApp.nav.briefing" },
  { id: "executive", href: "/app/executive", labelKey: "customerApp.nav.executive" },
  { id: "presence", href: "/app/presence", labelKey: "customerApp.nav.presence" },
  { id: "assistant", href: "/app/assistant", labelKey: "customerApp.nav.assistant" },
  {
    id: "recommendations",
    href: "/app/recommendations",
    labelKey: "customerApp.nav.recommendations",
  },
  { id: "learning", href: "/app/learning", labelKey: "customerApp.nav.learning" },
  { id: "skills", href: "/app/skills", labelKey: "customerApp.nav.skills" },
  { id: "marketplace", href: "/app/marketplace", labelKey: "customerApp.nav.marketplace" },
  { id: "industryBlueprints", href: "/app/industry-blueprints", labelKey: "customerApp.nav.industryBlueprints" },
  { id: "globalLearning", href: "/app/global-learning", labelKey: "customerApp.nav.globalLearning" },
  { id: "evolution", href: "/app/evolution", labelKey: "customerApp.nav.evolution" },
  { id: "valueEngine", href: "/app/value", labelKey: "customerApp.nav.valueEngine" },
  { id: "outcomesEngine", href: "/app/outcomes", labelKey: "customerApp.nav.outcomesEngine" },
  { id: "agents", href: "/app/agents", labelKey: "customerApp.nav.agents" },
  { id: "appEcosystem", href: "/app/apps", labelKey: "customerApp.nav.appEcosystem" },
  { id: "trustEngine", href: "/app/trust", labelKey: "customerApp.nav.trustEngine" },
  { id: "digitalTwin", href: "/app/digital-twin", labelKey: "customerApp.nav.digitalTwin" },
  { id: "simulationLab", href: "/app/simulations", labelKey: "customerApp.nav.simulationLab" },
  { id: "operationsCenter", href: "/app/operations", labelKey: "customerApp.nav.operationsCenter" },
  { id: "continuityEngine", href: "/app/continuity", labelKey: "customerApp.nav.continuityEngine" },
  { id: "strategyEngine", href: "/app/strategy", labelKey: "customerApp.nav.strategyEngine" },
  { id: "humanSuccessEngine", href: "/app/human-success", labelKey: "customerApp.nav.humanSuccessEngine" },
  { id: "customerLifecycleEngine", href: "/app/customer-lifecycle", labelKey: "customerApp.nav.customerLifecycleEngine" },
  { id: "platformIntegrityEngine", href: "/app/integrity", labelKey: "customerApp.nav.platformIntegrityEngine" },
  { id: "ecosystemIntelligenceEngine", href: "/app/ecosystem", labelKey: "customerApp.nav.ecosystemIntelligenceEngine" },
  { id: "communityIntelligenceEngine", href: "/app/community", labelKey: "customerApp.nav.communityIntelligenceEngine" },
  { id: "marketplaceGovernanceEngine", href: "/app/marketplace-governance", labelKey: "customerApp.nav.marketplaceGovernanceEngine" },
  { id: "partnerCertificationEngine", href: "/app/partners", labelKey: "customerApp.nav.partnerCertificationEngine" },
  { id: "commercialModelEngine", href: "/app/commercial", labelKey: "customerApp.nav.commercialModelEngine" },
  { id: "academyEngine", href: "/app/academy", labelKey: "customerApp.nav.academyEngine" },
  { id: "globalExpansionEngine", href: "/app/global-expansion", labelKey: "customerApp.nav.globalExpansionEngine" },
  { id: "innovationLabEngine", href: "/app/innovation-lab", labelKey: "customerApp.nav.innovationLabEngine" },
  { id: "futureTechEngine", href: "/app/future-tech", labelKey: "customerApp.nav.futureTechEngine" },
  { id: "constitutionEngine", href: "/app/constitution", labelKey: "customerApp.nav.constitutionEngine" },
  { id: "manifestoEngine", href: "/app/manifesto", labelKey: "customerApp.nav.manifestoEngine" },
  { id: "platformInstallEngine", href: "/app/platform-install", labelKey: "customerApp.nav.platformInstallEngine" },
  { id: "commerceIntelligenceEngine", href: "/app/commerce-intelligence", labelKey: "customerApp.nav.commerceIntelligenceEngine" },
  { id: "productAutomationEngine", href: "/app/product-automation", labelKey: "customerApp.nav.productAutomationEngine" },
  { id: "dropshippingOperationsEngine", href: "/app/dropshipping-operations", labelKey: "customerApp.nav.dropshippingOperationsEngine" },
  { id: "commercePerformanceEngine", href: "/app/commerce-performance", labelKey: "customerApp.nav.commercePerformanceEngine" },
  { id: "multiStoreOrchestrationEngine", href: "/app/multi-store", labelKey: "customerApp.nav.multiStoreOrchestrationEngine" },
  { id: "personalityEngine", href: "/app/personality", labelKey: "customerApp.nav.personalityEngine" },
  { id: "approvals", href: "/app/approvals", labelKey: "customerApp.nav.approvals" },
  { id: "actionCenter", href: "/app/action-center", labelKey: "customerApp.nav.actionCenter" },
  { id: "businessPulse", href: "/app/business-pulse", labelKey: "customerApp.nav.businessPulse" },
  { id: "strategicGoals", href: "/app/goals", labelKey: "customerApp.nav.strategicGoals" },
  { id: "frictionIntelligence", href: "/app/friction", labelKey: "customerApp.nav.frictionIntelligence" },
  { id: "organizationalMemory", href: "/app/memory", labelKey: "customerApp.nav.organizationalMemory" },
  { id: "organizationalIntelligence", href: "/app/insights", labelKey: "customerApp.nav.organizationalIntelligence" },
  { id: "predictiveIntelligence", href: "/app/predictions", labelKey: "customerApp.nav.predictiveIntelligence" },
  { id: "adaptiveAutomation", href: "/app/automations", labelKey: "customerApp.nav.adaptiveAutomation" },
  { id: "governance", href: "/app/governance", labelKey: "customerApp.nav.governance" },
  { id: "enterprise", href: "/app/enterprise", labelKey: "customerApp.nav.enterprise" },
  { id: "quality", href: "/app/quality", labelKey: "customerApp.nav.quality" },
  { id: "knowledgeCenter", href: "/app/knowledge-center", labelKey: "customerApp.nav.knowledgeCenter" },
  { id: "installations", href: "/app/installations", labelKey: "customerApp.nav.installations" },
  { id: "domains", href: "/app/domains", labelKey: "customerApp.nav.domains" },
  { id: "team", href: "/app/team", labelKey: "customerApp.nav.team" },
  { id: "license", href: "/app/license", labelKey: "customerApp.nav.license" },
  { id: "security", href: "/app/security", labelKey: "customerApp.nav.security" },
  { id: "orchestration", href: "/app/orchestration", labelKey: "customerApp.nav.orchestration" },
  { id: "settings", href: "/app/settings", labelKey: "customerApp.nav.settings" },
];

export const APP_MOBILE_NAV_IDS: AppNavId[] = [
  "overview",
  "executive",
  "presence",
  "approvals",
  "settings",
];

export function getAppActiveNavId(pathname: string): AppNavId {
  if (pathname === "/app" || pathname === "/dashboard") return "overview";
  if (pathname.startsWith("/app/aipify-core")) return "aipifyCorePlatformEngine";
  if (pathname.startsWith("/app/multi-tenant")) return "multiTenantArchitectureEngine";
  if (pathname.startsWith("/app/identity-access")) return "identityPermissionsEngine";
  if (pathname.startsWith("/app/secure-ai-actions")) return "secureAiActionEngine";
  if (pathname.startsWith("/app/audit-accountability")) return "auditAccountabilityEngine";
  if (pathname.startsWith("/app/knowledge-center-engine")) return "knowledgeCenterEngine";
  if (pathname.startsWith("/app/admin-assistant-engine")) return "adminAssistantEngine";
  if (pathname.startsWith("/app/support-ai-engine")) return "supportAiEngine";
  if (pathname.startsWith("/app/integration-engine")) return "integrationEngine";
  if (pathname.startsWith("/app/operations-dashboard-engine")) return "operationsDashboardEngine";
  if (pathname.startsWith("/app/customer-onboarding-engine")) return "customerOnboardingEngine";
  if (pathname.startsWith("/app/subscription-plan-management-engine")) {
    return "subscriptionPlanManagementEngine";
  }
  if (pathname.startsWith("/app/self-support-engine")) return "selfSupportEngine";
  if (pathname.startsWith("/app/quality-guardian-engine")) return "qualityGuardianEngine";
  if (pathname.startsWith("/app/governance-policy-engine")) return "governancePolicyEngine";
  if (pathname.startsWith("/app/unonight-pilot-operations-engine")) return "unonightPilotOperationsEngine";
  if (pathname.startsWith("/app/analytics-insights-engine")) return "analyticsInsightsEngine";
  if (pathname.startsWith("/app/notification-communication-engine")) {
    return "notificationCommunicationEngine";
  }
  if (pathname.startsWith("/app/deployment-environment-management-engine")) {
    return "deploymentEnvironmentManagementEngine";
  }
  if (pathname.startsWith("/app/observability-platform-health-engine")) {
    return "observabilityPlatformHealthEngine";
  }
  if (pathname.startsWith("/app/aipify-install-engine")) return "aipifyInstallEngine";
  if (pathname.startsWith("/app/module-marketplace-foundation-engine")) {
    return "moduleMarketplaceFoundationEngine";
  }
  if (pathname.startsWith("/app/aipify-internal-operations-engine")) {
    return "aipifyInternalOperationsEngine";
  }
  if (pathname.startsWith("/app/launch-readiness-engine")) return "launchReadinessEngine";
  if (pathname.startsWith("/app/customer-success-engine")) return "customerSuccessEngine";
  if (pathname.startsWith("/app/executive")) return "executive";
  if (
    pathname.startsWith("/app/presence") ||
    pathname.startsWith("/app/command-center") ||
    pathname.startsWith("/app/desktop")
  ) {
    return "presence";
  }
  if (pathname.startsWith("/app/assistant")) return "assistant";
  if (pathname.startsWith("/app/recommendations")) return "recommendations";
  if (pathname.startsWith("/app/learning")) return "learning";
  if (pathname.startsWith("/app/skills")) return "skills";
  if (pathname.startsWith("/app/marketplace")) return "marketplace";
  if (pathname.startsWith("/app/industry-blueprints")) return "industryBlueprints";
  if (pathname.startsWith("/app/global-learning")) return "globalLearning";
  if (pathname.startsWith("/app/evolution")) return "evolution";
  if (pathname.startsWith("/app/value")) return "valueEngine";
  if (pathname.startsWith("/app/outcomes")) return "outcomesEngine";
  if (pathname.startsWith("/app/agents")) return "agents";
  if (pathname.startsWith("/app/apps")) return "appEcosystem";
  if (pathname.startsWith("/app/trust")) return "trustEngine";
  if (pathname.startsWith("/app/digital-twin")) return "digitalTwin";
  if (pathname.startsWith("/app/simulations")) return "simulationLab";
  if (pathname.startsWith("/app/operations")) return "operationsCenter";
  if (pathname.startsWith("/app/continuity")) return "continuityEngine";
  if (pathname.startsWith("/app/strategy")) return "strategyEngine";
  if (pathname.startsWith("/app/human-success")) return "humanSuccessEngine";
  if (pathname.startsWith("/app/customer-lifecycle")) return "customerLifecycleEngine";
  if (pathname.startsWith("/app/integrity")) return "platformIntegrityEngine";
  if (pathname.startsWith("/app/ecosystem")) return "ecosystemIntelligenceEngine";
  if (pathname.startsWith("/app/community")) return "communityIntelligenceEngine";
  if (pathname.startsWith("/app/marketplace-governance")) return "marketplaceGovernanceEngine";
  if (pathname.startsWith("/app/partners")) return "partnerCertificationEngine";
  if (pathname.startsWith("/app/commercial")) return "commercialModelEngine";
  if (pathname.startsWith("/app/academy")) return "academyEngine";
  if (pathname.startsWith("/app/global-expansion")) return "globalExpansionEngine";
  if (pathname.startsWith("/app/innovation-lab")) return "innovationLabEngine";
  if (pathname.startsWith("/app/future-tech")) return "futureTechEngine";
  if (pathname.startsWith("/app/constitution")) return "constitutionEngine";
  if (pathname.startsWith("/app/manifesto")) return "manifestoEngine";
  if (pathname.startsWith("/app/platform-install")) return "platformInstallEngine";
  if (pathname.startsWith("/app/commerce-intelligence")) return "commerceIntelligenceEngine";
  if (pathname.startsWith("/app/product-automation")) return "productAutomationEngine";
  if (pathname.startsWith("/app/dropshipping-operations")) return "dropshippingOperationsEngine";
  if (pathname.startsWith("/app/commerce-performance")) return "commercePerformanceEngine";
  if (pathname.startsWith("/app/multi-store")) return "multiStoreOrchestrationEngine";
  if (pathname.startsWith("/app/personality")) return "personalityEngine";
  if (pathname.startsWith("/app/approvals")) return "approvals";
  if (pathname.startsWith("/app/action-center") || pathname.startsWith("/app/actions")) {
    return "actionCenter";
  }
  if (pathname.startsWith("/app/business-pulse") || pathname.startsWith("/dashboard/business-pulse")) {
    return "businessPulse";
  }
  if (pathname.startsWith("/app/goals") || pathname.startsWith("/dashboard/goals")) {
    return "strategicGoals";
  }
  if (pathname.startsWith("/app/friction") || pathname.startsWith("/dashboard/friction")) {
    return "frictionIntelligence";
  }
  if (
    pathname.startsWith("/app/memory") ||
    pathname.startsWith("/dashboard/memory")
  ) {
    return "organizationalMemory";
  }
  if (pathname.startsWith("/app/insights") || pathname.startsWith("/app/organization") || pathname.startsWith("/app/workflows")) {
    return "organizationalIntelligence";
  }
  if (pathname.startsWith("/app/predictions")) {
    return "predictiveIntelligence";
  }
  if (
    pathname.startsWith("/app/automations") ||
    pathname.startsWith("/app/automation-library") ||
    pathname.startsWith("/app/automation-executions")
  ) {
    return "adaptiveAutomation";
  }
  if (pathname.startsWith("/app/governance")) {
    return "governance";
  }
  if (pathname.startsWith("/app/enterprise")) {
    return "enterprise";
  }
  if (pathname.startsWith("/app/quality")) {
    return "quality";
  }
  if (pathname.startsWith("/app/knowledge-center")) {
    return "knowledgeCenter";
  }
  if (
    pathname.startsWith("/app/install") ||
    pathname.startsWith("/app/installations") ||
    pathname.startsWith("/dashboard/installs")
  ) {
    return "installations";
  }
  if (pathname.startsWith("/app/domains")) return "domains";
  if (pathname.startsWith("/app/team") || pathname.startsWith("/dashboard/team")) {
    return "team";
  }
  if (pathname.startsWith("/app/license") || pathname.startsWith("/dashboard/license")) {
    return "license";
  }
  if (pathname.startsWith("/app/security") || pathname.startsWith("/app/settings/security")) {
    return "security";
  }
  if (pathname.startsWith("/app/compliance")) {
    return "security";
  }
  if (pathname.startsWith("/app/orchestration")) {
    return "orchestration";
  }
  if (pathname.startsWith("/app/settings/personalization")) return "workstyleEngine";
  if (pathname.startsWith("/app/settings")) return "settings";
  if (pathname.startsWith("/app/welcome")) return "overview";
  return "overview";
}

/** Nav items with hrefs resolved to active routes during /dashboard → /app migration. */
export function getAppNavItemsForShell(): AppNavItem[] {
  return APP_NAV.map((item) => ({
    ...item,
    href: resolveAppHref(item.href),
  }));
}
