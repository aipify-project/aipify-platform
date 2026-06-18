import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const localesDir = path.join(root, "locales");

const SPLITS = [
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
];

const NAVIGATION_KEYS = new Set([
  "nav",
  "navGroups",
  "multiTenantArchitecture",
  "companionPresence",
  "voiceOfCustomer",
]);

const PORTAL_STRUCTURE_KEYS = new Set(["portalStructure"]);

function resolveSplit(key) {
  if (NAVIGATION_KEYS.has(key)) return "navigation";
  if (PORTAL_STRUCTURE_KEYS.has(key)) return "portalStructure";
  if (/^digitalEmployee/.test(key)) return "digitalEmployees";
  if (/^(digitalWorkforce|aipifyTalent|aipifyTranslateMultilingual|aipifyPerformanceGoal|aipifyOrganizationalHealthWorkforce|aipifyMentorship|aipifySuccession|aipifyEmployee|enterpriseOrganizationalMemory)/.test(key))
    return "workforce";
  if (/^(companion|companionBriefing|companionWorkforce|companionMarketplace|companionIdentity|companionOrchestration|companionAction|companionContext|companionMemory|companionRecommendation|companionProactive|companionPersonalization|companionDaily|companionWorkPrioritization|companionFollowUp|companionRelationship|companionExecutive|lifeEvents|presenceContinuity|trustAdoption|aipifyDesktopCompanion|proactiveCompanion|personalProductivity|workspaceProductivity)/.test(key))
    return "companion";
  if (/^(logistics|dropshipping|supplier|multiStore|warehouse|inventory|commercePerformance|globalCommerce)/i.test(key))
    return "warehouse";
  if (/^(growthPartner|partnerSuccess|partnerCertification|partnerAdvisor|growthPortal|growthEvolution)/.test(key))
    return "growthPartners";
  if (/^(marketplace|skillStore|skillsMarketplace|moduleMarketplace|appEcosystem|businessPackMarketplace|companionMarketplace|globalEcosystemMarketplace|commerceCompanion)/.test(key))
    return "marketplace";
  if (/^(industry|hospitality|realEstate|construction|manufacturing|education|healthcare|legal|professionalServices|enterpriseOrganization|IndustryPack|industryPack)/i.test(key))
    return "industryPacks";
  if (/^(actionCenter|aipifyGlobalCommand|aipifyUnifiedWorkspace|aipifyDigitalHeadquarters|orchestration|enterpriseAiAgent|aipifyActionCenter|commandCenter|enterpriseCommandCenter|realWorldAction|operationsCenter|incidentCommand|automationControl|globalCommand)/i.test(key))
    return "commandCenter";
  if (/^(settings|security|billing|paymentProviders|commercialPackages|subscriptionPlan|identityPermissions|secureAiAction|auditAccountability|governance|securityHub|securityTrust|securityCompliance|enterpriseDeployment|signInVerification|permissionAccess|approvalProfiles|financialGuardrails|trustTransparency|license|packageAccess|twoFactor|workingStyle|workstyle|personality)/i.test(key))
    return "settings";
  if (/^(home|executive|briefing|presence|recommendations|approvals|overview|businessPulse|insights|analytics|operationsDashboard|executiveInsights|executiveIntelligence|strategicIntelligence|enterpriseStrategicIntelligence|organizational|capabilityMaturity|executionExcellence|sinceLastLogin|principle|greetings|team|learning|installations|workflows|predictions|automation|quality|knowledge|organization|memoryEngine|skillStore|actionHub|valueEngine|outcomesEngine|agents|trustEngine|digitalTwin|simulationLab|strategyEngine|humanSuccess|customerLifecycle|platformIntegrity|ecosystemIntelligence|communityIntelligence|innovationLab|futureTechnologies|decisionIntelligence|valueRealization|changeManagement|documentOutput|goalsOkr|predictiveInsights|crossTenant|contextIntelligence|organizationWorkspace|selfSupport|adminAssistant|knowledgeCenter|supportAi|integrationEngine|apiPlatform|customerOnboarding|qualityGuardian|aipifyModeration|unonightPilot|notificationCommunication|deploymentEnvironment|observabilityPlatform|aipifyInstall|aipifyInternal|launchReadiness|customerSuccess|statusTransparency|enterpriseReadiness|learningTraining|aipifyUniversity|certificationAchievement|complianceRegulatory|continuousImprovement|workflowOrchestration|humanOversight|businessPacksFoundation|aiEthics|incidentResponse|serviceLevel|stakeholderCommunication|meetingCollaboration|unifiedTask|resourcePlanning|capacityWorkload|relationshipIntelligence|trustReputation|aiCostGovernance|impactEngine|legacyEngine|wisdomEngine|dedicationEngine|hopeEngine|selfLove|priorityFocus|purposeValues|inclusionHumanity|curiosityDiscovery|wonderEngine|gratitudeRecognition|presenceComfort|organizationalHealth|enterpriseReadiness|printOutput|universalActionAccess|firstDayExperience|approvalHumanOversight|databaseGovernance|deploymentGovernance|platformObservability|knowledgeEvolution|globalLearning|evolution|evolutionGovernance|industryBlueprints|developerPortal|platformInstall|aipifyAcademy|globalExpansion|aipifyConstitution|aipifyManifesto|billingCommercial|aipifyCorePlatform|multiTenantArchitecture|aipifyHosts)/.test(key))
    return "dashboard";
  return "core";
}

for (const locale of fs.readdirSync(localesDir)) {
  const sourcePath = path.join(localesDir, locale, "customerApp.json");
  if (!fs.existsSync(sourcePath)) continue;

  const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const buckets = Object.fromEntries(SPLITS.map((s) => [s, {}]));

  for (const [key, value] of Object.entries(source)) {
    buckets[resolveSplit(key)][key] = value;
  }

  const outDir = path.join(localesDir, locale, "customer-app");
  fs.mkdirSync(outDir, { recursive: true });

  for (const split of SPLITS) {
    const targetPath = path.join(outDir, `${split}.json`);
    fs.writeFileSync(targetPath, `${JSON.stringify(buckets[split], null, 2)}\n`);
    console.log(`${locale}/${split}: ${JSON.stringify(buckets[split]).length} bytes`);
  }
}
