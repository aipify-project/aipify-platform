import {
  isKompisConfirmationLevel,
  isKompisContractStatus,
  isKompisKnowledgeSourceType,
  isKompisRiskClass,
  isKompisToolKind,
  isKompisWorkspaceSurface,
} from "./enums";
import type {
  KompisContractParseIssue,
  KompisContractParseResult,
  KompisCustomerWorkspaceContract,
  KompisWorkspaceKnowledgeSource,
  KompisWorkspaceToolPermission,
} from "./types";

export const KOMPIS_CUSTOMER_WORKSPACE_CONTRACT_VERSION = "1" as const;

const record = (v: unknown): Record<string, unknown> | null =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
const str = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.trim() : null;
const bool = (v: unknown, fallback = false): boolean =>
  typeof v === "boolean" ? v : fallback;
const strings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && !!x.trim()).map((x) => x.trim()) : [];

function issue(path: string, code: string, message: string): KompisContractParseIssue {
  return { path, code, message };
}

function parseKnowledge(
  value: unknown,
  path: string,
  issues: KompisContractParseIssue[]
): KompisWorkspaceKnowledgeSource | null {
  const row = record(value);
  if (!row) return null;
  const source_key = str(row.source_key);
  if (!source_key) {
    issues.push(issue(`${path}.source_key`, "missing_source_key", "source_key required"));
    return null;
  }
  if (!isKompisKnowledgeSourceType(row.source_type)) {
    issues.push(issue(`${path}.source_type`, "invalid_source_type", String(row.source_type)));
    return null;
  }
  if (!isKompisRiskClass(row.risk_classification)) {
    issues.push(issue(`${path}.risk_classification`, "invalid_risk", String(row.risk_classification)));
    return null;
  }
  return {
    source_key,
    source_type: row.source_type,
    authority_level: typeof row.authority_level === "number" ? row.authority_level : 0,
    enabled: bool(row.enabled),
    audiences: strings(row.audiences),
    roles: strings(row.roles),
    access_tiers: strings(row.access_tiers),
    modules: strings(row.modules),
    routes: strings(row.routes),
    locales: strings(row.locales),
    risk_classification: row.risk_classification,
  };
}

function parseToolPermission(
  value: unknown,
  path: string,
  issues: KompisContractParseIssue[]
): KompisWorkspaceToolPermission | null {
  const row = record(value);
  if (!row) return null;
  const tool_key = str(row.tool_key);
  if (!tool_key) {
    issues.push(issue(`${path}.tool_key`, "missing_tool_key", "tool_key required"));
    return null;
  }
  if (!isKompisToolKind(row.kind)) {
    issues.push(issue(`${path}.kind`, "invalid_kind", String(row.kind)));
    return null;
  }
  if (!isKompisConfirmationLevel(row.confirmation_level)) {
    issues.push(issue(`${path}.confirmation_level`, "invalid_confirmation", String(row.confirmation_level)));
    return null;
  }
  if (!isKompisRiskClass(row.risk_classification)) {
    issues.push(issue(`${path}.risk_classification`, "invalid_risk", String(row.risk_classification)));
    return null;
  }
  return {
    tool_key,
    enabled: bool(row.enabled),
    kind: row.kind,
    confirmation_level: row.confirmation_level,
    roles: strings(row.roles),
    access_tiers: strings(row.access_tiers),
    modules: strings(row.modules),
    routes: strings(row.routes),
    risk_classification: row.risk_classification,
  };
}

/** Strict parse of tenant-bound kompis_customer_workspace_contract. Fail-closed. */
export function parseKompisCustomerWorkspaceContract(
  raw: unknown,
  opts: { expectedTenantKey?: string; allowDraft?: boolean } = {}
): KompisContractParseResult {
  const issues: KompisContractParseIssue[] = [];
  const warnings: KompisContractParseIssue[] = [];

  if (raw == null) {
    return { ok: false, issues: [issue("", "missing_contract", "workspace contract missing")] };
  }
  const row = record(raw);
  if (!row) {
    return { ok: false, issues: [issue("", "malformed_contract", "workspace contract must be an object")] };
  }

  const contract_version = str(row.contract_version);
  if (contract_version !== KOMPIS_CUSTOMER_WORKSPACE_CONTRACT_VERSION) {
    return {
      ok: false,
      issues: [issue("contract_version", "unsupported_version", `Expected ${KOMPIS_CUSTOMER_WORKSPACE_CONTRACT_VERSION}`)],
    };
  }

  const tenant_key = str(row.tenant_key);
  if (!tenant_key) {
    return { ok: false, issues: [issue("tenant_key", "missing_tenant_key", "tenant_key required")] };
  }
  if (opts.expectedTenantKey && tenant_key !== opts.expectedTenantKey) {
    return {
      ok: false,
      issues: [issue("tenant_key", "tenant_mismatch", "tenant_key does not match expected")],
    };
  }

  const versioning = record(row.versioning) ?? {};
  if (!isKompisContractStatus(versioning.status)) {
    issues.push(issue("versioning.status", "invalid_status", String(versioning.status)));
  } else if (versioning.status !== "published" && !opts.allowDraft) {
    issues.push(issue("versioning.status", "not_published", "APP may only use published contracts"));
  }

  const allowed_surfaces = strings(row.allowed_surfaces).filter(isKompisWorkspaceSurface);
  const knowledge_sources = Array.isArray(row.knowledge_sources)
    ? row.knowledge_sources
        .map((s, i) => parseKnowledge(s, `knowledge_sources[${i}]`, issues))
        .filter((s): s is KompisWorkspaceKnowledgeSource => !!s)
    : [];
  const tool_permissions = Array.isArray(row.tool_permissions)
    ? row.tool_permissions
        .map((t, i) => parseToolPermission(t, `tool_permissions[${i}]`, issues))
        .filter((t): t is KompisWorkspaceToolPermission => !!t)
    : [];

  const confirmationPolicies = record(row.action_confirmation_policies) ?? {};
  const action_confirmation_policies: Record<string, KompisCustomerWorkspaceContract["action_confirmation_policies"][string]> = {};
  for (const [key, value] of Object.entries(confirmationPolicies)) {
    if (!isKompisConfirmationLevel(value)) {
      issues.push(issue(`action_confirmation_policies.${key}`, "invalid_confirmation", String(value)));
      continue;
    }
    action_confirmation_policies[key] = value;
  }

  const risk = record(row.risk_policies) ?? {};
  const escalation = record(row.escalation_policies) ?? {};
  const support = record(row.support_handoff) ?? {};
  const locale = record(row.locale_policy) ?? {};
  const handoff = record(row.conversation_handoff_policy) ?? {};
  const retention = record(row.retention_policy) ?? {};
  const analytics = record(row.analytics_policy) ?? {};

  // Private messages must never default on.
  if (risk.private_messages_enabled === true) {
    issues.push(issue("risk_policies.private_messages_enabled", "private_messages_forbidden", "Private messages must remain disabled by default"));
  }

  if (issues.length || !isKompisContractStatus(versioning.status)) {
    return { ok: false, issues };
  }

  const contract: KompisCustomerWorkspaceContract = {
    contract_version,
    tenant_key,
    enabled: bool(row.enabled),
    public_enabled: bool(row.public_enabled),
    authenticated_enabled: bool(row.authenticated_enabled),
    allowed_surfaces,
    allowed_routes: strings(row.allowed_routes),
    denied_routes: strings(row.denied_routes),
    allowed_roles: strings(row.allowed_roles),
    denied_roles: strings(row.denied_roles),
    allowed_access_tiers: strings(row.allowed_access_tiers),
    allowed_user_groups: strings(row.allowed_user_groups),
    knowledge_sources,
    tool_permissions,
    action_confirmation_policies,
    context_fields: strings(row.context_fields),
    risk_policies: {
      commercial_guidance_enabled: bool(risk.commercial_guidance_enabled),
      private_messages_enabled: false,
      high_risk_escalation_enabled: bool(risk.high_risk_escalation_enabled, true),
      safety_floor: "aipify_default",
    },
    escalation_policies: {
      support_handoff_enabled: bool(escalation.support_handoff_enabled),
      abuse_escalation_enabled: bool(escalation.abuse_escalation_enabled, true),
      privacy_escalation_enabled: bool(escalation.privacy_escalation_enabled, true),
    },
    support_handoff: {
      enabled: bool(support.enabled),
      require_user_edit: true,
      attach_safe_context: true,
    },
    locale_policy: {
      fallback_locale: str(locale.fallback_locale) ?? "en",
      rtl_support: bool(locale.rtl_support),
      use_global_locale_list: true,
    },
    conversation_handoff_policy: {
      allow_public_to_auth_link: bool(handoff.allow_public_to_auth_link),
      require_server_rebind: true,
      drop_sensitive_assumptions: true,
    },
    retention_policy: {
      retain_days: typeof retention.retain_days === "number" ? retention.retain_days : 90,
      redact_on_logout: true,
    },
    analytics_policy: {
      enabled: bool(analytics.enabled),
      store_content: false,
    },
    audit_policy: {
      log_permission_changes: true,
      log_tool_invocations: true,
      log_confirmations: true,
    },
    versioning: {
      status: versioning.status,
      published_version: versioning.published_version == null ? null : str(versioning.published_version),
      updated_by: versioning.updated_by == null ? null : str(versioning.updated_by),
      updated_at: versioning.updated_at == null ? null : str(versioning.updated_at),
      changelog: str(versioning.changelog) ?? undefined,
    },
  };

  if (!contract.enabled) {
    warnings.push(issue("enabled", "disabled", "Workspace assistant is disabled for tenant"));
  }

  return { ok: true, contract, warnings };
}
