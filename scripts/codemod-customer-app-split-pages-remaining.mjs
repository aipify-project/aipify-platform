import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const NAVIGATION_KEYS = new Set([
  "nav",
  "navGroups",
  "portalStructure",
  "multiTenantArchitecture",
  "twoFactor",
  "companionPresence",
  "voiceOfCustomer",
]);

function resolveSplit(key) {
  if (NAVIGATION_KEYS.has(key)) return "navigation";
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
  if (/^(actionCenter|aipifyGlobalCommand|aipifyUnifiedWorkspace|aipifyDigitalHeadquarters|orchestration|enterpriseAiAgent|aipifyActionCenter|commandCenter|operationsCenter|incidentCommand|automationControl|globalCommand)/i.test(key))
    return "commandCenter";
  if (/^(settings|security|billing|paymentProviders|commercialPackages|subscriptionPlan|identityPermissions|secureAiAction|auditAccountability|governance|securityHub|securityTrust|securityCompliance|enterpriseDeployment|signInVerification|permissionAccess|approvalProfiles|financialGuardrails|trustTransparency|license|packageAccess|twoFactor|workingStyle|workstyle|personality)/i.test(key))
    return "settings";
  if (/^(home|executive|briefing|presence|recommendations|approvals|overview|businessPulse|insights|analytics|operationsDashboard|executiveInsights|executiveIntelligence|strategicIntelligence|organizational|capabilityMaturity|executionExcellence|sinceLastLogin|principle|greetings|team|learning|installations|workflows|predictions|automation|quality|knowledge|organization|memoryEngine|skillStore|actionHub|valueEngine|outcomesEngine|agents|trustEngine|digitalTwin|simulationLab|strategyEngine|humanSuccess|customerLifecycle|platformIntegrity|ecosystemIntelligence|communityIntelligence|innovationLab|futureTechnologies|decisionIntelligence|valueRealization|changeManagement|documentOutput|goalsOkr|predictiveInsights|crossTenant|contextIntelligence|organizationWorkspace|selfSupport|adminAssistant|knowledgeCenter|supportAi|integrationEngine|apiPlatform|customerOnboarding|qualityGuardian|aipifyModeration|unonightPilot|notificationCommunication|deploymentEnvironment|observabilityPlatform|aipifyInstall|aipifyInternal|launchReadiness|customerSuccess|statusTransparency|enterpriseReadiness|learningTraining|aipifyUniversity|certificationAchievement|complianceRegulatory|continuousImprovement|workflowOrchestration|humanOversight|businessPacksFoundation|aiEthics|incidentResponse|serviceLevel|stakeholderCommunication|meetingCollaboration|unifiedTask|resourcePlanning|capacityWorkload|relationshipIntelligence|trustReputation|aiCostGovernance|impactEngine|legacyEngine|wisdomEngine|dedicationEngine|hopeEngine|selfLove|priorityFocus|purposeValues|inclusionHumanity|curiosityDiscovery|wonderEngine|gratitudeRecognition|presenceComfort|organizationalHealth|enterpriseReadiness|printOutput|universalActionAccess|firstDayExperience|approvalHumanOversight|databaseGovernance|deploymentGovernance|platformObservability|knowledgeEvolution|globalLearning|evolution|evolutionGovernance|industryBlueprints|developerPortal|platformInstall|aipifyAcademy|globalExpansion|aipifyConstitution|aipifyManifesto|billingCommercial|aipifyCorePlatform|multiTenantArchitecture|aipifyHosts)/.test(key))
    return "dashboard";
  return "core";
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name === "page.tsx") files.push(full);
  }
  return files;
}

function extractSplits(content) {
  const splits = new Set();
  const re = /customerApp\.([A-Za-z0-9_]+)/g;
  let match;
  while ((match = re.exec(content))) {
    splits.add(resolveSplit(match[1]));
  }
  if (splits.size === 0) splits.add("dashboard");
  return [...splits];
}

let updated = 0;

for (const file of walk(path.join(root, "app/app"))) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("customerApp")) continue;
  if (content.includes("getCustomerAppDictionaryForModule") || content.includes("getCustomerAppDictionaryForSplits")) {
    continue;
  }
  if (!content.includes('getDictionary') || !content.includes("customerApp")) continue;

  const splits = extractSplits(content);
  const splitsLiteral = `[${splits.map((s) => `"${s}"`).join(", ")}]`;

  if (!content.includes('from "@/lib/i18n/get-dictionary"')) continue;

  content = content.replace(
    /import \{ getDictionary(?:, ([^}]+))? \} from "@\/lib\/i18n\/get-dictionary";/,
    (full, rest) => {
      const extras = rest ? rest.split(",").map((s) => s.trim()).filter(Boolean) : [];
      const imports = new Set(["getCustomerAppDictionaryForSplits", ...extras.filter((i) => i !== "getDictionary")]);
      if (extras.length > 0 && content.match(/getDictionary\([^)]+\)/)) {
        imports.add("getDictionary");
      }
      return `import { ${[...imports].join(", ")} } from "@/lib/i18n/get-dictionary";`;
    }
  );

  content = content.replace(
    /const dict = await getDictionary\(([^,]+),\s*\[[^\]]*customerApp[^\]]*\]\);/g,
    (match, localeExpr) => {
      const extraNamespaces = match.match(/\[([^\]]+)\]/)[1]
        .split(",")
        .map((s) => s.trim().replace(/['"]/g, ""))
        .filter((ns) => ns !== "customerApp");

      if (extraNamespaces.length === 0) {
        return `const dict = await getCustomerAppDictionaryForSplits(${localeExpr}, ${splitsLiteral});`;
      }

      return `const dict = {
    ...(await getCustomerAppDictionaryForSplits(${localeExpr}, ${splitsLiteral})),
    ...(await getDictionary(${localeExpr}, [${extraNamespaces.map((n) => `"${n}"`).join(", ")}])),
  };`;
    }
  );

  fs.writeFileSync(file, content);
  updated += 1;
}

console.log(`Updated ${updated} additional pages`);
