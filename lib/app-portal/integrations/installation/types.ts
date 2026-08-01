import type {
  InstallationAudience,
  InstallationFieldType,
  InstallationResponsibleParty,
  InstallationSecurityClass,
  InstallationStepType,
  InstallationSupportMode,
  InstallationWizardState,
} from "./enums";

/** Locale map for provider-specific copy. Keys are dynamic locale codes from Core. */
export type InstallationLocaleMap = Record<string, string>;

export type InstallationLocalizedText =
  | { kind: "locale_key"; key: string }
  | { kind: "locale_map"; values: InstallationLocaleMap; fallbackLocale?: string };

export type InstallationCustomerField = {
  field_key: string;
  field_type: InstallationFieldType;
  label: InstallationLocalizedText;
  help?: InstallationLocalizedText;
  required: boolean;
  masked?: boolean;
  secret?: boolean;
  options?: Array<{ value: string; label: InstallationLocalizedText }>;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    allowlist_hosts?: string[];
  };
  security_classification: InstallationSecurityClass;
};

export type InstallationStep = {
  step_key: string;
  step_type: InstallationStepType;
  order: number;
  title: InstallationLocalizedText;
  description: InstallationLocalizedText;
  audience: InstallationAudience[];
  responsible_party: InstallationResponsibleParty;
  support_modes: InstallationSupportMode[];
  required: boolean;
  prerequisites: string[];
  blocking: boolean;
  customer_fields: InstallationCustomerField[];
  actions: string[];
  completion_rule: string;
  failure_policy: string;
  retry_policy: string;
  help_resources: Array<{ kind: string; label: InstallationLocalizedText; href?: string }>;
  estimated_time_minutes: number;
  security_classification: InstallationSecurityClass;
  visibility_rule?: string;
  skip_rule?: string;
  resume_rule?: string;
  state_mapping?: Partial<Record<string, InstallationWizardState>>;
  audit_event_type?: string;
  /** Internal-only copy — never shown to customer audiences. */
  internal_title?: InstallationLocalizedText;
  internal_description?: InstallationLocalizedText;
};

export type InstallationAssistanceAction = {
  action_key: string;
  label: InstallationLocalizedText;
  description?: InstallationLocalizedText;
  requires_quote?: boolean;
  requires_order?: boolean;
  requires_partner?: boolean;
  requires_scheduling?: boolean;
  requires_approval?: boolean;
  support_mode?: InstallationSupportMode;
  handoff?: "coming_later" | "support" | "invite_placeholder" | "request" | "invite";
};

export type InstallationInviteContract = {
  supported_roles: Array<"customer_it" | "external_provider" | "partner">;
  token_ttl_hours: number;
  revoke_supported: boolean;
  scoped_to_installation: true;
  /** Full invite backend may be a scoped gap — never fake complete. */
  backend_status: "available" | "typed_placeholder";
};

export type InstallationContract = {
  contract_version: string;
  provider_key: string;
  installation_mode: string;
  support_modes: InstallationSupportMode[];
  default_support_mode: InstallationSupportMode;
  audience_variants: InstallationAudience[];
  steps: InstallationStep[];
  dependencies: Array<{ from: string; to: string }>;
  required_customer_inputs: string[];
  responsible_party_default: InstallationResponsibleParty;
  security_classification: InstallationSecurityClass;
  validation: {
    require_verified_before_activation: true;
    block_on_unresolved_prerequisites: true;
  };
  completion_rules: string[];
  failure_policy: string;
  resume_policy: {
    allow_pause: true;
    pin_contract_version: true;
    stale_contract_strategy: "migrate_or_restart";
  };
  test_policy: {
    use_existing_provider_test: true;
    allow_retry: boolean;
    poll_interval_ms: number;
  };
  verification_policy: {
    use_existing_provider_verify: true;
  };
  activation_requirements: {
    verified: true;
    approvals_complete: boolean;
    scopes_confirmed: boolean;
    no_unresolved_blockers: true;
    explicit_user_action: true;
    no_auto_activation: true;
  };
  documentation: {
    customer_help: InstallationLocalizedText;
    internal_runbook?: InstallationLocalizedText;
  };
  estimated_time_minutes: number;
  escalation: {
    path: string;
    contact_action: string;
  };
  assistance_actions: InstallationAssistanceAction[];
  invite: InstallationInviteContract;
  versioning: {
    status: "draft" | "published" | "deprecated";
    created_at?: string;
    updated_at?: string;
    published_at?: string | null;
    deprecated_at?: string | null;
    updated_by?: string | null;
    changelog?: string;
    compatibility_range?: string;
  };
  rtl_support?: boolean;
  locale_fallback: string;
};

export type InstallationSessionSnapshot = {
  session_id: string;
  provider_key: string;
  contract_version: string;
  support_mode: InstallationSupportMode | null;
  state: InstallationWizardState;
  current_step_key: string | null;
  completed_step_keys: string[];
  field_values: Record<string, unknown>;
  paused: boolean;
  last_test_status: string | null;
  last_error_code: string | null;
  updated_at: string;
};

export type InstallationContractParseIssue = {
  path: string;
  code: string;
  message: string;
};

export type InstallationContractParseResult =
  | { ok: true; contract: InstallationContract; warnings: InstallationContractParseIssue[] }
  | { ok: false; issues: InstallationContractParseIssue[] };
