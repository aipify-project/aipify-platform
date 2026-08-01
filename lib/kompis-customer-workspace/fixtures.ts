import { buildDefaultKompisCustomerWorkspaceContract } from "./default-contract";
import type { KompisCustomerWorkspaceContract } from "./types";

const readTools = [
  {
    tool_key: "search_knowledge",
    enabled: true,
    kind: "read" as const,
    confirmation_level: "none" as const,
    roles: [],
    access_tiers: [],
    modules: [],
    routes: [],
    risk_classification: "low" as const,
  },
  {
    tool_key: "get_current_page_help",
    enabled: true,
    kind: "read" as const,
    confirmation_level: "none" as const,
    roles: [],
    access_tiers: [],
    modules: [],
    routes: [],
    risk_classification: "low" as const,
  },
];

const accountRead = {
  tool_key: "get_my_account_summary",
  enabled: true,
  kind: "read" as const,
  confirmation_level: "none" as const,
  roles: [],
  access_tiers: [],
  modules: ["account"],
  routes: [],
  risk_classification: "low" as const,
};

const draftTools = [
  {
    tool_key: "create_draft",
    enabled: true,
    kind: "draft" as const,
    confirmation_level: "lightweight" as const,
    roles: [],
    access_tiers: [],
    modules: ["catalog"],
    routes: [],
    risk_classification: "moderate" as const,
  },
  {
    tool_key: "suggest_improvements",
    enabled: true,
    kind: "draft" as const,
    confirmation_level: "none" as const,
    roles: [],
    access_tiers: [],
    modules: [],
    routes: [],
    risk_classification: "low" as const,
  },
];

const writeTool = {
  tool_key: "publish_item",
  enabled: true,
  kind: "write" as const,
  confirmation_level: "strong" as const,
  roles: ["customer_admin", "member"],
  access_tiers: [],
  modules: ["catalog"],
  routes: [],
  risk_classification: "high" as const,
};

const supportTool = {
  tool_key: "create_support_draft",
  enabled: true,
  kind: "draft" as const,
  confirmation_level: "explicit" as const,
  roles: [],
  access_tiers: [],
  modules: ["support"],
  routes: [],
  risk_classification: "moderate" as const,
};

/** Reference fixtures only — not live Production tenants. */
export const fixturePublicOnly: KompisCustomerWorkspaceContract =
  buildDefaultKompisCustomerWorkspaceContract("reference_customer_alpha", {
    enabled: true,
    public_enabled: true,
    authenticated_enabled: false,
    tool_permissions: [],
  });

export const fixtureKnowledgeOnly: KompisCustomerWorkspaceContract =
  buildDefaultKompisCustomerWorkspaceContract("reference_customer_beta", {
    enabled: true,
    public_enabled: true,
    authenticated_enabled: true,
    tool_permissions: readTools,
  });

export const fixtureReadOnlyAccount: KompisCustomerWorkspaceContract =
  buildDefaultKompisCustomerWorkspaceContract("reference_member_portal", {
    enabled: true,
    public_enabled: true,
    authenticated_enabled: true,
    tool_permissions: [...readTools, accountRead],
  });

export const fixtureDraftWithConfirmation: KompisCustomerWorkspaceContract =
  buildDefaultKompisCustomerWorkspaceContract("reference_product_catalog", {
    enabled: true,
    public_enabled: true,
    authenticated_enabled: true,
    tool_permissions: [...readTools, ...draftTools, writeTool],
  });

export const fixtureSupportHandoff: KompisCustomerWorkspaceContract =
  buildDefaultKompisCustomerWorkspaceContract("reference_listing_module", {
    enabled: true,
    public_enabled: true,
    authenticated_enabled: true,
    tool_permissions: [...readTools, supportTool],
    support_handoff: { enabled: true, require_user_edit: true, attach_safe_context: true },
  });

export const fixtureCommercialGuidance: KompisCustomerWorkspaceContract = {
  ...buildDefaultKompisCustomerWorkspaceContract("reference_customer_alpha", {
    enabled: true,
    public_enabled: true,
    authenticated_enabled: true,
    tool_permissions: [...readTools, ...draftTools],
    risk_policies: {
      commercial_guidance_enabled: true,
      private_messages_enabled: false,
      high_risk_escalation_enabled: true,
      safety_floor: "aipify_default",
    },
  }),
  tenant_key: "reference_customer_commercial",
};

export const fixtureHighRiskRestricted: KompisCustomerWorkspaceContract =
  buildDefaultKompisCustomerWorkspaceContract("reference_customer_restricted", {
    enabled: true,
    public_enabled: true,
    authenticated_enabled: true,
    tool_permissions: readTools.map((t) => ({ ...t, confirmation_level: "none" as const })),
    risk_policies: {
      commercial_guidance_enabled: false,
      private_messages_enabled: false,
      high_risk_escalation_enabled: true,
      safety_floor: "aipify_default",
    },
  });

export const KOMPIS_CUSTOMER_WORKSPACE_FIXTURES = [
  fixturePublicOnly,
  fixtureKnowledgeOnly,
  fixtureReadOnlyAccount,
  fixtureDraftWithConfirmation,
  fixtureSupportHandoff,
  fixtureCommercialGuidance,
  fixtureHighRiskRestricted,
] as const;
