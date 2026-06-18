/** Split customerApp into route-scoped locale files to reduce webpack build memory. */
export const CUSTOMER_APP_SPLIT_NAMES = [
  "navigation",
  "portalStructure",
  "companion",
  "workforce",
  "warehouse",
  "growthPartners",
  "marketplace",
  "industryPacks",
  "digitalEmployees",
  "commandCenter",
  "settings",
  "dashboard",
  "core",
] as const;

export type CustomerAppSplitName = (typeof CUSTOMER_APP_SPLIT_NAMES)[number];

const NAVIGATION_KEYS = new Set([
  "nav",
  "navGroups",
  "multiTenantArchitecture",
  "companionPresence",
  "voiceOfCustomer",
]);

const PORTAL_STRUCTURE_KEYS = new Set(["portalStructure"]);

const COMPANION_PATTERN =
  /^(companion|companionBriefing|companionWorkforce|companionMarketplace|companionIdentity|companionOrchestration|companionAction|companionContext|companionMemory|companionMemoryCenter|companionRecommendation|companionProactive|companionPersonalization|companionDaily|companionWorkPrioritization|companionFollowUp|companionRelationship|companionExecutive|lifeEvents|presenceContinuity|trustAdoption|aipifyDesktopCompanion|proactiveCompanion|personalProductivity|workspaceProductivity)/;

const WORKFORCE_PATTERN =
  /^(digitalWorkforce|aipifyTalent|aipifyTranslateMultilingual|aipifyPerformanceGoal|aipifyOrganizationalHealthWorkforce|aipifyMentorship|aipifySuccession|aipifyEmployee|enterpriseOrganizationalMemory)/;

const DIGITAL_EMPLOYEES_PATTERN = /^digitalEmployee/;

const WAREHOUSE_PATTERN =
  /^(logistics|dropshipping|supplier|multiStore|warehouse|inventory|commercePerformance|globalCommerce)/i;

const GROWTH_PARTNERS_PATTERN =
  /^(growthPartner|partnerSuccess|partnerCertification|partnerAdvisor|growthPortal|growthEvolution)/;

const MARKETPLACE_PATTERN =
  /^(marketplace|skillStore|skillsMarketplace|moduleMarketplace|appEcosystem|businessPackMarketplace|companionMarketplace|globalEcosystemMarketplace|commerceCompanion)/;

const INDUSTRY_PACKS_PATTERN =
  /^(industry|hospitality|realEstate|construction|manufacturing|education|healthcare|legal|professionalServices|enterpriseOrganization|IndustryPack|industryPack)/i;

const COMMAND_CENTER_PATTERN =
  /^(actionCenter|aipifyGlobalCommand|aipifyUnifiedWorkspace|aipifyDigitalHeadquarters|orchestration|enterpriseAiAgent|aipifyActionCenter|commandCenter|enterpriseCommandCenter|realWorldAction|operationsCenter|incidentCommand|automationControl|globalCommand)/i;

const SETTINGS_PATTERN =
  /^(settings|security|billing|paymentProviders|commercialPackages|subscriptionPlan|identityPermissions|secureAiAction|auditAccountability|governance|securityHub|securityTrust|securityCompliance|enterpriseDeployment|signInVerification|permissionAccess|approvalProfiles|financialGuardrails|trustTransparency|license|packageAccess|twoFactor|workingStyle|workstyle|personality)/i;

const DASHBOARD_PATTERN =
  /^(home|executive|briefing|presence|recommendations|approvals|overview|businessPulse|insights|analytics|operationsDashboard|executiveInsights|executiveIntelligence|strategicIntelligence|enterpriseStrategicIntelligence|organizational|capabilityMaturity|executionExcellence|sinceLastLogin|principle|greetings|team|learning|installations|workflows|predictions|automation|quality|knowledge|knowledgeEvolutionEngine|organizationalRelationshipIntelligence|decisionIntelligenceCenter|organizationalHealthIntelligenceCenter|businessDigitalTwinCenter|businessImprovementCenter|organizationalMaturityCenter|businessOsCommandCenter|businessOsOrchestrationCenter|realWorldActionsExecutionCenter|businessOsEcosystemMarketplaceCenter|globalBusinessNetworkCenter|autonomousOrganizationCenter|executiveDigitalBoardCenter|enterpriseGovernanceTrustCenter|corporateBrainCenter|organizationalConsciousnessCenter|industryIntelligenceCenter|economicIntelligenceCenter|marketIntelligenceCenter|globalExpansionIntelligenceCenter|organization|memoryEngine|skillStore|actionHub|valueEngine|outcomesEngine|agents|trustEngine|digitalTwin|simulationLab|strategyEngine|humanSuccess|customerLifecycle|platformIntegrity|ecosystemIntelligence|communityIntelligence|innovationLab|futureTechnologies|decisionIntelligence|valueRealization|changeManagement|documentOutput|goalsOkr|predictiveInsights|crossTenant|contextIntelligence|organizationWorkspace|selfSupport|adminAssistant|knowledgeCenter|supportAi|integrationEngine|apiPlatform|customerOnboarding|implementationOnboardingCenter|customerSuccessAdoptionCenter|qualityGuardian|aipifyModeration|unonightPilot|notificationCommunication|deploymentEnvironment|observabilityPlatform|aipifyInstall|aipifyInternal|launchReadiness|customerSuccess|statusTransparency|enterpriseReadiness|learningTraining|aipifyUniversity|certificationAchievement|complianceRegulatory|continuousImprovement|workflowOrchestration|humanOversight|businessPacksFoundation|aiEthics|incidentResponse|serviceLevel|stakeholderCommunication|meetingCollaboration|unifiedTask|resourcePlanning|capacityWorkload|relationshipIntelligence|trustReputation|aiCostGovernance|impactEngine|legacyEngine|wisdomEngine|dedicationEngine|hopeEngine|selfLove|priorityFocus|purposeValues|inclusionHumanity|curiosityDiscovery|wonderEngine|gratitudeRecognition|presenceComfort|organizationalHealth|enterpriseReadiness|printOutput|universalActionAccess|firstDayExperience|approvalHumanOversight|databaseGovernance|deploymentGovernance|platformObservability|knowledgeEvolution|globalLearning|evolution|evolutionGovernance|industryBlueprints|developerPortal|platformInstall|aipifyAcademy|globalExpansion|globalDeployment|customerExperienceAdoptionDelight|platformExcellence|enterpriseTrustReputationConfidence|enterpriseInnovationRdFuture|enterpriseEcosystemPartnerNetwork|enterpriseValueRealizationRoi|autonomousEnterpriseOperations|aipifyConstitution|aipifyManifesto|billingCommercial|aipifyCorePlatform|multiTenantArchitecture|aipifyHosts|commerceRetailOperationsPack)/;

export function resolveCustomerAppSplit(key: string): CustomerAppSplitName {
  if (NAVIGATION_KEYS.has(key)) return "navigation";
  if (PORTAL_STRUCTURE_KEYS.has(key)) return "portalStructure";
  if (DIGITAL_EMPLOYEES_PATTERN.test(key)) return "digitalEmployees";
  if (WORKFORCE_PATTERN.test(key)) return "workforce";
  if (COMPANION_PATTERN.test(key)) return "companion";
  if (WAREHOUSE_PATTERN.test(key)) return "warehouse";
  if (GROWTH_PARTNERS_PATTERN.test(key)) return "growthPartners";
  if (MARKETPLACE_PATTERN.test(key)) return "marketplace";
  if (INDUSTRY_PACKS_PATTERN.test(key)) return "industryPacks";
  if (COMMAND_CENTER_PATTERN.test(key)) return "commandCenter";
  if (SETTINGS_PATTERN.test(key)) return "settings";
  if (DASHBOARD_PATTERN.test(key)) return "dashboard";
  return "core";
}

const moduleSplitCache = new Map<string, CustomerAppSplitName>();

/** Resolve split file for a customerApp module key (e.g. digitalWorkforceValueEngine). */
export function resolveCustomerAppSplitForModule(moduleKey: string): CustomerAppSplitName {
  const cached = moduleSplitCache.get(moduleKey);
  if (cached) return cached;
  const split = resolveCustomerAppSplit(moduleKey);
  moduleSplitCache.set(moduleKey, split);
  return split;
}

export function customerAppSplitPath(split: CustomerAppSplitName): string {
  return `customer-app/${split}.json`;
}
