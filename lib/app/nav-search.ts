import { APP_NAV_GROUPS, type AppNavGroupId } from "./nav-groups";
import type { AppNavGroupConfig, AppNavLink } from "./build-nav";
import type { Translator } from "@/lib/i18n/translate";

import type { NavSearchEntry } from "@/lib/nav/search-entry";

export type AppNavSearchEntry = NavSearchEntry & {
  groupId: import("./nav-groups").AppNavGroupId | "modules";
};

const SEARCH_KEYWORDS: Record<string, string[]> = {
  commandBrief: ["command brief", "briefing", "companion briefing"],
  appDashboard: ["dashboard", "home", "app"],
  sinceLastLogin: ["since last login", "briefing", "updates"],
  appNotifications: ["notifications", "alerts"],
  teamMembers: ["team", "members", "invite"],
  rolesPermissions: ["roles", "permissions", "access"],
  operationsCenter: ["operations center", "operations", "ops"],
  risksCompliance: ["risk", "compliance", "governance"],
  managementInsights: ["management", "executive", "insights"],
  dataSources: ["data sources", "integrations", "connect"],
  connectedApps: ["connected apps", "integrations"],
  apiDeveloperSettings: ["api", "developer", "access"],
  organizationSettings: ["organization settings", "settings"],
  marketplace: ["marketplace", "business packs", "recommendations"],
  supportRequests: ["support cases", "support requests", "tickets"],
  knowledgeCenter: ["knowledge", "faq", "help"],
  subscription: ["subscription", "billing", "plan"],
  installedBusinessPacks: ["business packs", "modules", "installed"],
  integrations: ["integrations", "connect", "api", "oauth"],
  connectedIntegrations: ["connected", "integrations"],
  connectIntegration: ["connect", "setup", "integration"],
  apiAccess: ["api", "access", "credentials", "keys"],
  overview: ["dashboard", "home", "overview"],
  multiTenantArchitectureEngine: ["tenants", "tenant", "multi-tenant"],
  organizationWorkspaceEngine: ["workspaces", "workspace"],
  subscriptionPlanManagementEngine: ["subscription", "billing", "plan"],
  customerOnboardingEngine: ["onboarding", "setup"],
  contextIntelligenceEngine: ["context", "intelligence"],
  identityPermissionsEngine: ["identity", "permissions", "roles"],
  knowledgeCenterEngine: ["knowledge", "knowledge center", "faq"],
  adminAssistantEngine: ["assistant", "companion"],
  secureAiActionEngine: ["actions", "approvals", "trust"],
  operationsDashboardEngine: ["operations", "ops"],
  qualityGuardianEngine: ["quality"],
  selfSupportEngine: ["self-support", "support"],
  integrationEngine: ["integrations", "connect"],
  apiPlatformEngine: ["api", "platform", "developer"],
  auditAccountabilityEngine: ["audit", "logs"],
  securityHub: ["security", "settings"],
  governancePolicyEngine: ["permissions", "governance", "policy"],
  signInVerification: ["verification", "2fa", "two-factor", "authenticator", "sign-in"],
  adaptiveAutomation: ["automations", "automation"],
  executive: ["executive", "briefings", "briefing"],
  approvals: ["approvals"],
  actionCenter: ["action center", "actions"],
  skills: ["skills", "marketplace"],
  companionMarketplaceEngine: ["commerce", "marketplace", "growth partners"],
};

const SEARCH_DESCRIPTION_PREFIX = "navigation.navGroups.searchDescriptions.";

/** Nav item ids with dedicated search descriptions in i18n. */
const DESCRIBED_IDS = new Set<string>(
  APP_NAV_GROUPS.flatMap((group) => group.items.map((item) => item.id))
);

export function getGroupIdForNavItem(navId: string): AppNavGroupId | null {
  for (const group of APP_NAV_GROUPS) {
    if (group.items.some((item) => item.id === navId)) {
      return group.id;
    }
  }
  return null;
}

function descriptionForItem(t: Translator, itemId: string, fallbackLabel: string): string {
  const key = `${SEARCH_DESCRIPTION_PREFIX}${itemId}`;
  const translated = t(key);
  if (translated !== key) return translated;
  return fallbackLabel;
}

export function buildAppNavSearchIndex(
  groups: AppNavGroupConfig[],
  allItems: AppNavLink[],
  t: Translator
): AppNavSearchEntry[] {
  const seen = new Set<string>();
  const entries: AppNavSearchEntry[] = [];

  for (const group of groups) {
    for (const item of group.items) {
      seen.add(item.id);
      entries.push({
        ...item,
        groupId: group.id as AppNavGroupId,
        groupLabel: group.label,
        description: descriptionForItem(t, item.id, item.label),
      });
    }
  }

  const modulesLabel = t("navigation.navGroups.searchModulesCategory");

  for (const item of allItems) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    entries.push({
      ...item,
      groupId: "modules",
      groupLabel: modulesLabel,
      description: DESCRIBED_IDS.has(item.id)
        ? descriptionForItem(t, item.id, item.label)
        : item.label,
    });
  }

  return entries;
}

export function filterAppNavSearchEntries(
  entries: NavSearchEntry[],
  query: string
): NavSearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;

  return entries.filter((item) => {
    const keywords = SEARCH_KEYWORDS[item.id]?.join(" ") ?? "";
    const haystack = [
      item.label,
      item.id,
      item.groupLabel,
      item.description,
      item.href,
      keywords,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
