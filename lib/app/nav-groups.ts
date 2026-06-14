import type { AppNavId } from "./nav-config";

export type AppNavGroupId =
  | "home"
  | "organization"
  | "intelligence"
  | "operations"
  | "platform"
  | "governance";

export type AppNavGroupItem = {
  id: AppNavId | "securityHub" | "signInVerification";
  labelKey: string;
  href?: string;
};

export type AppNavGroup = {
  id: AppNavGroupId;
  labelKey: string;
  items: AppNavGroupItem[];
  defaultExpanded?: boolean;
};

/** Phase 364 — grouped Business Panel navigation for scale. */
export const APP_NAV_GROUPS: AppNavGroup[] = [
  {
    id: "home",
    labelKey: "customerApp.navGroups.home",
    defaultExpanded: true,
    items: [{ id: "overview", labelKey: "customerApp.navGroups.items.dashboard" }],
  },
  {
    id: "organization",
    labelKey: "customerApp.navGroups.organization",
    items: [
      { id: "multiTenantArchitectureEngine", labelKey: "customerApp.navGroups.items.tenants" },
      { id: "organizationWorkspaceEngine", labelKey: "customerApp.navGroups.items.workspaces" },
      {
        id: "subscriptionPlanManagementEngine",
        labelKey: "customerApp.navGroups.items.subscription",
      },
      { id: "customerOnboardingEngine", labelKey: "customerApp.navGroups.items.onboarding" },
    ],
  },
  {
    id: "intelligence",
    labelKey: "customerApp.navGroups.intelligence",
    items: [
      { id: "contextIntelligenceEngine", labelKey: "customerApp.navGroups.items.contextIntelligence" },
      { id: "identityPermissionsEngine", labelKey: "customerApp.navGroups.items.identity" },
      { id: "knowledgeCenterEngine", labelKey: "customerApp.navGroups.items.knowledge" },
      { id: "adminAssistantEngine", labelKey: "customerApp.navGroups.items.assistant" },
    ],
  },
  {
    id: "operations",
    labelKey: "customerApp.navGroups.operations",
    items: [
      { id: "secureAiActionEngine", labelKey: "customerApp.navGroups.items.actions" },
      { id: "operationsDashboardEngine", labelKey: "customerApp.navGroups.items.operations" },
      { id: "qualityGuardianEngine", labelKey: "customerApp.navGroups.items.quality" },
      { id: "selfSupportEngine", labelKey: "customerApp.navGroups.items.selfSupport" },
    ],
  },
  {
    id: "platform",
    labelKey: "customerApp.navGroups.platform",
    items: [
      { id: "integrationEngine", labelKey: "customerApp.navGroups.items.integrations" },
      { id: "apiPlatformEngine", labelKey: "customerApp.navGroups.items.apiPlatform" },
    ],
  },
  {
    id: "governance",
    labelKey: "customerApp.navGroups.governance",
    items: [
      { id: "auditAccountabilityEngine", labelKey: "customerApp.navGroups.items.audit" },
      {
        id: "securityHub",
        labelKey: "customerApp.navGroups.items.security",
        href: "/app/settings/security",
      },
      { id: "governancePolicyEngine", labelKey: "customerApp.navGroups.items.permissions" },
      {
        id: "signInVerification",
        labelKey: "customerApp.navGroups.items.verification",
        href: "/app/settings/two-factor",
      },
    ],
  },
];

export const APP_NAV_GROUP_STORAGE_KEY = "aipify.app.navGroups.expanded.v1";
export const APP_NAV_OPEN_GROUP_STORAGE_KEY = "aipify.app.navGroups.open.v1";
export const APP_NAV_LAST_ITEM_STORAGE_KEY = "aipify.app.nav.lastItem.v1";
export const APP_NAV_INITIALIZED_STORAGE_KEY = "aipify.app.nav.initialized.v1";
export const APP_NAV_COMPACT_STORAGE_KEY = "aipify.app.nav.compact.v1";
