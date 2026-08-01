import type {
  KompisConfirmationLevel,
  KompisContractStatus,
  KompisKnowledgeSourceType,
  KompisRiskClass,
  KompisSessionKind,
  KompisToolKind,
  KompisWorkspaceSurface,
} from "./enums";

export type KompisWorkspaceKnowledgeSource = {
  source_key: string;
  source_type: KompisKnowledgeSourceType;
  authority_level: number;
  enabled: boolean;
  audiences: string[];
  roles: string[];
  access_tiers: string[];
  modules: string[];
  routes: string[];
  locales: string[];
  risk_classification: KompisRiskClass;
};

export type KompisWorkspaceToolPermission = {
  tool_key: string;
  enabled: boolean;
  kind: KompisToolKind;
  confirmation_level: KompisConfirmationLevel;
  roles: string[];
  access_tiers: string[];
  modules: string[];
  routes: string[];
  risk_classification: KompisRiskClass;
};

export type KompisCustomerWorkspaceContract = {
  contract_version: string;
  tenant_key: string;
  enabled: boolean;
  public_enabled: boolean;
  authenticated_enabled: boolean;
  allowed_surfaces: KompisWorkspaceSurface[];
  allowed_routes: string[];
  denied_routes: string[];
  allowed_roles: string[];
  denied_roles: string[];
  allowed_access_tiers: string[];
  allowed_user_groups: string[];
  knowledge_sources: KompisWorkspaceKnowledgeSource[];
  tool_permissions: KompisWorkspaceToolPermission[];
  action_confirmation_policies: Record<string, KompisConfirmationLevel>;
  context_fields: string[];
  risk_policies: {
    commercial_guidance_enabled: boolean;
    private_messages_enabled: false;
    high_risk_escalation_enabled: boolean;
    safety_floor: "aipify_default";
  };
  escalation_policies: {
    support_handoff_enabled: boolean;
    abuse_escalation_enabled: boolean;
    privacy_escalation_enabled: boolean;
  };
  support_handoff: {
    enabled: boolean;
    require_user_edit: true;
    attach_safe_context: true;
  };
  locale_policy: {
    fallback_locale: string;
    rtl_support: boolean;
    use_global_locale_list: true;
  };
  conversation_handoff_policy: {
    allow_public_to_auth_link: boolean;
    require_server_rebind: true;
    drop_sensitive_assumptions: true;
  };
  retention_policy: {
    retain_days: number;
    redact_on_logout: true;
  };
  analytics_policy: {
    enabled: boolean;
    store_content: false;
  };
  audit_policy: {
    log_permission_changes: true;
    log_tool_invocations: true;
    log_confirmations: true;
  };
  versioning: {
    status: KompisContractStatus;
    published_version: string | null;
    updated_by: string | null;
    updated_at: string | null;
    changelog?: string;
  };
};

export type KompisWorkspaceContext = {
  tenant_id: string;
  surface: KompisWorkspaceSurface;
  route: string;
  module: string;
  entity_type: string | null;
  entity_id: string | null;
  user_role: string;
  access_tier: string;
  locale: string;
  allowed_context_fields: string[];
  allowed_tools: string[];
  current_status: string | null;
  safe_summary: string;
  context_version: string;
};

export type KompisWorkspacePermissions = {
  enabled: boolean;
  allowed_knowledge_sources: string[];
  allowed_context_fields: string[];
  allowed_tools: string[];
  confirmation_levels: Record<string, KompisConfirmationLevel>;
  denied_reasons: string[];
  escalation_options: string[];
  effective_locale_policy: KompisCustomerWorkspaceContract["locale_policy"];
  commercial_guidance_enabled: boolean;
  support_handoff_enabled: boolean;
};

export type KompisWorkspaceSession = {
  session_id: string;
  tenant_id: string;
  user_id: string | null;
  kind: KompisSessionKind;
  linked_public_session_id: string | null;
  locale: string;
  contract_version: string;
  surface: KompisWorkspaceSurface;
  created_at: string;
  updated_at: string;
};

export type KompisWorkspaceToolDefinition = {
  tool_key: string;
  version: string;
  kind: KompisToolKind;
  risk_classification: KompisRiskClass;
  default_confirmation: KompisConfirmationLevel;
  module: string;
  entity_types: string[];
  description_key: string;
  enabled: boolean;
  deprecated: boolean;
  timeout_ms: number;
  rate_limit_per_minute: number;
};

export type KompisConfirmationCard = {
  confirmation_id: string;
  tool_key: string;
  level: KompisConfirmationLevel;
  summary: string;
  consequences: string[];
  is_public: boolean;
  is_financial: boolean;
  is_irreversible: boolean;
  expires_at: string;
};

export type KompisContractParseIssue = {
  path: string;
  code: string;
  message: string;
};

export type KompisContractParseResult =
  | { ok: true; contract: KompisCustomerWorkspaceContract; warnings: KompisContractParseIssue[] }
  | { ok: false; issues: KompisContractParseIssue[] };
