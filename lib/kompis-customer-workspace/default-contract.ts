import { KOMPIS_CUSTOMER_WORKSPACE_CONTRACT_VERSION } from "./parse";
import type { KompisCustomerWorkspaceContract, KompisWorkspaceToolPermission } from "./types";

/** Minimum authenticated runtime tools used by the Customer APP closeout surface. */
export const KOMPIS_WORKSPACE_MINIMUM_RUNTIME_TOOLS: KompisWorkspaceToolPermission[] = [
  {
    tool_key: "get_current_page_help",
    enabled: true,
    kind: "read",
    confirmation_level: "none",
    roles: [],
    access_tiers: [],
    modules: [],
    routes: [],
    risk_classification: "low",
  },
  {
    tool_key: "get_my_access_status",
    enabled: true,
    kind: "read",
    confirmation_level: "none",
    roles: [],
    access_tiers: [],
    modules: [],
    routes: [],
    risk_classification: "low",
  },
  {
    tool_key: "create_draft",
    enabled: true,
    kind: "draft",
    confirmation_level: "lightweight",
    roles: [],
    access_tiers: [],
    modules: [],
    routes: [],
    risk_classification: "moderate",
  },
  {
    tool_key: "update_preference",
    enabled: true,
    kind: "write",
    confirmation_level: "explicit",
    roles: [],
    access_tiers: [],
    modules: [],
    routes: [],
    risk_classification: "moderate",
  },
];

/** Fail-closed published contract template for reference tenants. */
export function buildDefaultKompisCustomerWorkspaceContract(
  tenantKey: string,
  opts?: Partial<
    Pick<
      KompisCustomerWorkspaceContract,
      | "enabled"
      | "public_enabled"
      | "authenticated_enabled"
      | "tool_permissions"
      | "knowledge_sources"
      | "risk_policies"
      | "support_handoff"
    >
  >
): KompisCustomerWorkspaceContract {
  return {
    contract_version: KOMPIS_CUSTOMER_WORKSPACE_CONTRACT_VERSION,
    tenant_key: tenantKey,
    enabled: opts?.enabled ?? false,
    public_enabled: opts?.public_enabled ?? false,
    authenticated_enabled: opts?.authenticated_enabled ?? false,
    allowed_surfaces: ["public_website", "authenticated_portal", "member_area"],
    allowed_routes: [
      "/app",
      "/app/*",
      "/app/kompis-workspace",
      "/portal",
      "/portal/*",
      "/member",
      "/member/*",
    ],
    denied_routes: ["/admin", "/admin/*", "/moderation", "/moderation/*", "/platform", "/platform/*"],
    allowed_roles: [
      "member",
      "customer_user",
      "customer_admin",
      "owner",
      "admin",
      "organization_owner",
      "organization_admin",
      "support",
      "staff",
    ],
    denied_roles: ["anonymous"],
    allowed_access_tiers: ["basic", "standard", "premium"],
    allowed_user_groups: [],
    knowledge_sources: opts?.knowledge_sources ?? [
      {
        source_key: "approved_faq",
        source_type: "approved_faq",
        authority_level: 80,
        enabled: true,
        audiences: ["authenticated"],
        roles: [],
        access_tiers: [],
        modules: [],
        routes: [],
        locales: [],
        risk_classification: "low",
      },
      {
        source_key: "system_rules",
        source_type: "system_rules",
        authority_level: 100,
        enabled: true,
        audiences: ["authenticated"],
        roles: [],
        access_tiers: [],
        modules: [],
        routes: [],
        locales: [],
        risk_classification: "moderate",
      },
    ],
    tool_permissions: opts?.tool_permissions ?? KOMPIS_WORKSPACE_MINIMUM_RUNTIME_TOOLS,
    action_confirmation_policies: {},
    context_fields: [
      "route",
      "module",
      "entity_type",
      "entity_id",
      "current_status",
      "access_tier",
    ],
    risk_policies: {
      commercial_guidance_enabled: opts?.risk_policies?.commercial_guidance_enabled ?? false,
      private_messages_enabled: false,
      high_risk_escalation_enabled: true,
      safety_floor: "aipify_default",
    },
    escalation_policies: {
      support_handoff_enabled: opts?.support_handoff?.enabled ?? false,
      abuse_escalation_enabled: true,
      privacy_escalation_enabled: true,
    },
    support_handoff: {
      enabled: opts?.support_handoff?.enabled ?? false,
      require_user_edit: true,
      attach_safe_context: true,
    },
    locale_policy: {
      fallback_locale: "en",
      rtl_support: true,
      use_global_locale_list: true,
    },
    conversation_handoff_policy: {
      allow_public_to_auth_link: true,
      require_server_rebind: true,
      drop_sensitive_assumptions: true,
    },
    retention_policy: {
      retain_days: 90,
      redact_on_logout: true,
    },
    analytics_policy: {
      enabled: false,
      store_content: false,
    },
    audit_policy: {
      log_permission_changes: true,
      log_tool_invocations: true,
      log_confirmations: true,
    },
    versioning: {
      status: "published",
      published_version: "1",
      updated_by: null,
      updated_at: null,
      changelog: "Reference fixture",
    },
  };
}
