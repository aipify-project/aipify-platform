import {
  DEFAULT_SUPPORT_MODE_PRIORITY,
  isInstallationAudience,
  isInstallationFieldType,
  isInstallationResponsibleParty,
  isInstallationSecurityClass,
  isInstallationStepType,
  isInstallationSupportMode,
  type InstallationSupportMode,
} from "./enums";
import type {
  InstallationAssistanceAction,
  InstallationContract,
  InstallationContractParseIssue,
  InstallationContractParseResult,
  InstallationCustomerField,
  InstallationInviteContract,
  InstallationLocalizedText,
  InstallationStep,
} from "./types";

export const INSTALLATION_CONTRACT_VERSION = "1" as const;

const record = (v: unknown): Record<string, unknown> | null =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
const str = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.trim() : null;
const bool = (v: unknown, fallback = false): boolean =>
  typeof v === "boolean" ? v : fallback;
const num = (v: unknown, fallback = 0): number =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

function issue(path: string, code: string, message: string): InstallationContractParseIssue {
  return { path, code, message };
}

function parseLocalized(
  value: unknown,
  path: string,
  issues: InstallationContractParseIssue[]
): InstallationLocalizedText | null {
  const row = record(value);
  if (!row) {
    issues.push(issue(path, "invalid_localized", "Localized text must be an object"));
    return null;
  }
  if (row.kind === "locale_key") {
    const key = str(row.key);
    if (!key) {
      issues.push(issue(`${path}.key`, "missing_locale_key", "locale_key requires key"));
      return null;
    }
    return { kind: "locale_key", key };
  }
  if (row.kind === "locale_map") {
    const values = record(row.values);
    if (!values || Object.keys(values).length === 0) {
      issues.push(issue(`${path}.values`, "empty_locale_map", "locale_map requires values"));
      return null;
    }
    const mapped: Record<string, string> = {};
    for (const [locale, text] of Object.entries(values)) {
      if (typeof text !== "string" || !text.trim()) {
        issues.push(issue(`${path}.values.${locale}`, "invalid_locale_value", "Locale value must be non-empty string"));
        continue;
      }
      mapped[locale] = text.trim();
    }
    if (!mapped.en && !Object.keys(mapped).length) {
      issues.push(issue(path, "missing_english_fallback", "locale_map requires at least one value"));
      return null;
    }
    return {
      kind: "locale_map",
      values: mapped,
      fallbackLocale: str(row.fallbackLocale) ?? "en",
    };
  }
  issues.push(issue(path, "unsupported_localized_kind", "kind must be locale_key or locale_map"));
  return null;
}

function parseField(
  value: unknown,
  path: string,
  issues: InstallationContractParseIssue[]
): InstallationCustomerField | null {
  const row = record(value);
  if (!row) {
    issues.push(issue(path, "invalid_field", "Field must be an object"));
    return null;
  }
  const field_key = str(row.field_key);
  if (!field_key) {
    issues.push(issue(`${path}.field_key`, "missing_field_key", "field_key required"));
    return null;
  }
  if (!isInstallationFieldType(row.field_type)) {
    issues.push(issue(`${path}.field_type`, "unsupported_field_type", String(row.field_type)));
    return null;
  }
  const label = parseLocalized(row.label, `${path}.label`, issues);
  if (!label) return null;
  if (!isInstallationSecurityClass(row.security_classification)) {
    issues.push(issue(`${path}.security_classification`, "invalid_security", String(row.security_classification)));
    return null;
  }
  const help = row.help == null ? undefined : parseLocalized(row.help, `${path}.help`, issues) ?? undefined;
  return {
    field_key,
    field_type: row.field_type,
    label,
    help,
    required: bool(row.required),
    masked: bool(row.masked),
    secret: bool(row.secret) || row.field_type === "secret_reference",
    options: Array.isArray(row.options)
      ? row.options
          .map((opt, idx) => {
            const o = record(opt);
            if (!o) return null;
            const valueStr = str(o.value);
            const optLabel = parseLocalized(o.label, `${path}.options[${idx}].label`, issues);
            if (!valueStr || !optLabel) return null;
            return { value: valueStr, label: optLabel };
          })
          .filter((x): x is NonNullable<typeof x> => !!x)
      : undefined,
    validation: record(row.validation)
      ? {
          pattern: str(record(row.validation)!.pattern) ?? undefined,
          min: num(record(row.validation)!.min, NaN),
          max: num(record(row.validation)!.max, NaN),
          allowlist_hosts: Array.isArray(record(row.validation)!.allowlist_hosts)
            ? (record(row.validation)!.allowlist_hosts as unknown[])
                .filter((h): h is string => typeof h === "string")
                .map((h) => h.trim())
            : undefined,
        }
      : undefined,
    security_classification: row.security_classification,
  };
}

function parseStep(
  value: unknown,
  path: string,
  issues: InstallationContractParseIssue[]
): InstallationStep | null {
  const row = record(value);
  if (!row) {
    issues.push(issue(path, "invalid_step", "Step must be an object"));
    return null;
  }
  const step_key = str(row.step_key);
  if (!step_key) {
    issues.push(issue(`${path}.step_key`, "missing_step_key", "step_key required"));
    return null;
  }
  if (!isInstallationStepType(row.step_type)) {
    issues.push(issue(`${path}.step_type`, "unsupported_step_type", String(row.step_type)));
    return null;
  }
  if (!isInstallationResponsibleParty(row.responsible_party)) {
    issues.push(issue(`${path}.responsible_party`, "invalid_responsible_party", String(row.responsible_party)));
    return null;
  }
  if (!isInstallationSecurityClass(row.security_classification)) {
    issues.push(issue(`${path}.security_classification`, "invalid_security", String(row.security_classification)));
    return null;
  }
  const title = parseLocalized(row.title, `${path}.title`, issues);
  const description = parseLocalized(row.description, `${path}.description`, issues);
  if (!title || !description) return null;

  const audience = Array.isArray(row.audience)
    ? row.audience.filter(isInstallationAudience)
    : [];
  if (!audience.length) {
    issues.push(issue(`${path}.audience`, "missing_audience", "At least one audience required"));
    return null;
  }
  const support_modes = Array.isArray(row.support_modes)
    ? row.support_modes.filter(isInstallationSupportMode)
    : [];
  if (!support_modes.length) {
    issues.push(issue(`${path}.support_modes`, "missing_support_modes", "At least one support mode required"));
    return null;
  }

  const customer_fields = Array.isArray(row.customer_fields)
    ? row.customer_fields
        .map((f, i) => parseField(f, `${path}.customer_fields[${i}]`, issues))
        .filter((f): f is InstallationCustomerField => !!f)
    : [];

  return {
    step_key,
    step_type: row.step_type,
    order: num(row.order),
    title,
    description,
    audience,
    responsible_party: row.responsible_party,
    support_modes,
    required: bool(row.required, true),
    prerequisites: Array.isArray(row.prerequisites)
      ? row.prerequisites.filter((p): p is string => typeof p === "string")
      : [],
    blocking: bool(row.blocking),
    customer_fields,
    actions: Array.isArray(row.actions)
      ? row.actions.filter((a): a is string => typeof a === "string")
      : [],
    completion_rule: str(row.completion_rule) ?? "manual_confirm",
    failure_policy: str(row.failure_policy) ?? "retry_or_escalate",
    retry_policy: str(row.retry_policy) ?? "allow_retry",
    help_resources: Array.isArray(row.help_resources)
      ? row.help_resources
          .map((h, i) => {
            const hr = record(h);
            if (!hr) return null;
            const label = parseLocalized(hr.label, `${path}.help_resources[${i}].label`, issues);
            if (!label) return null;
            return {
              kind: str(hr.kind) ?? "link",
              label,
              href: str(hr.href) ?? undefined,
            };
          })
          .filter((x): x is NonNullable<typeof x> => !!x)
      : [],
    estimated_time_minutes: num(row.estimated_time_minutes, 5),
    security_classification: row.security_classification,
    visibility_rule: str(row.visibility_rule) ?? undefined,
    skip_rule: str(row.skip_rule) ?? undefined,
    resume_rule: str(row.resume_rule) ?? undefined,
    audit_event_type: str(row.audit_event_type) ?? undefined,
    internal_title: row.internal_title
      ? parseLocalized(row.internal_title, `${path}.internal_title`, issues) ?? undefined
      : undefined,
    internal_description: row.internal_description
      ? parseLocalized(row.internal_description, `${path}.internal_description`, issues) ?? undefined
      : undefined,
  };
}

function parseAssistance(
  value: unknown,
  path: string,
  issues: InstallationContractParseIssue[]
): InstallationAssistanceAction | null {
  const row = record(value);
  if (!row) return null;
  const action_key = str(row.action_key);
  const label = parseLocalized(row.label, `${path}.label`, issues);
  if (!action_key || !label) return null;
  return {
    action_key,
    label,
    description: row.description
      ? parseLocalized(row.description, `${path}.description`, issues) ?? undefined
      : undefined,
    requires_quote: bool(row.requires_quote),
    requires_order: bool(row.requires_order),
    requires_partner: bool(row.requires_partner),
    requires_scheduling: bool(row.requires_scheduling),
    requires_approval: bool(row.requires_approval),
    support_mode: isInstallationSupportMode(row.support_mode) ? row.support_mode : undefined,
    handoff:
      row.handoff === "coming_later" || row.handoff === "support" || row.handoff === "invite_placeholder"
        ? row.handoff
        : undefined,
  };
}

function detectCycles(deps: Array<{ from: string; to: string }>, stepKeys: Set<string>): string | null {
  const graph = new Map<string, string[]>();
  for (const key of stepKeys) graph.set(key, []);
  for (const d of deps) {
    if (!stepKeys.has(d.from) || !stepKeys.has(d.to)) continue;
    graph.get(d.from)!.push(d.to);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const walk = (node: string): boolean => {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;
    visiting.add(node);
    for (const next of graph.get(node) ?? []) {
      if (walk(next)) return true;
    }
    visiting.delete(node);
    visited.add(node);
    return false;
  };
  for (const key of stepKeys) {
    if (walk(key)) return key;
  }
  return null;
}

/** Strictly parses Core installation_contract JSON. */
export function parseInstallationContract(
  raw: unknown,
  opts: { expectedProviderKey?: string; allowDraft?: boolean } = {}
): InstallationContractParseResult {
  const issues: InstallationContractParseIssue[] = [];
  const warnings: InstallationContractParseIssue[] = [];

  if (raw == null) {
    return { ok: false, issues: [issue("", "missing_contract", "installation_contract is missing")] };
  }
  const row = record(raw);
  if (!row) {
    return { ok: false, issues: [issue("", "malformed_contract", "installation_contract must be an object")] };
  }

  const contract_version = str(row.contract_version);
  if (contract_version !== INSTALLATION_CONTRACT_VERSION) {
    return {
      ok: false,
      issues: [issue("contract_version", "unsupported_version", `Expected ${INSTALLATION_CONTRACT_VERSION}`)],
    };
  }

  const provider_key = str(row.provider_key);
  if (!provider_key) {
    return { ok: false, issues: [issue("provider_key", "missing_provider_key", "provider_key required")] };
  }
  if (opts.expectedProviderKey && provider_key !== opts.expectedProviderKey) {
    return {
      ok: false,
      issues: [issue("provider_key", "provider_mismatch", "provider_key does not match expected")],
    };
  }

  const support_modes = Array.isArray(row.support_modes)
    ? row.support_modes.filter(isInstallationSupportMode)
    : [];
  if (!support_modes.length) {
    issues.push(issue("support_modes", "missing_support_modes", "At least one support mode required"));
  }

  let default_support_mode: InstallationSupportMode | null = isInstallationSupportMode(row.default_support_mode)
    ? row.default_support_mode
    : null;
  if (!default_support_mode || !support_modes.includes(default_support_mode)) {
    default_support_mode =
      DEFAULT_SUPPORT_MODE_PRIORITY.find((m) => support_modes.includes(m)) ?? support_modes[0] ?? null;
    if (default_support_mode) {
      warnings.push(
        issue("default_support_mode", "default_repaired", "Default support mode selected from priority")
      );
    }
  }
  if (!default_support_mode) {
    issues.push(issue("default_support_mode", "missing_default_support_mode", "default_support_mode required"));
  }

  if (!Array.isArray(row.steps) || !row.steps.length) {
    issues.push(issue("steps", "missing_steps", "At least one step required"));
  }

  const steps = Array.isArray(row.steps)
    ? row.steps
        .map((s, i) => parseStep(s, `steps[${i}]`, issues))
        .filter((s): s is InstallationStep => !!s)
        .sort((a, b) => a.order - b.order)
    : [];

  const stepKeys = new Set(steps.map((s) => s.step_key));
  if (stepKeys.size !== steps.length) {
    issues.push(issue("steps", "duplicate_step_key", "step_key values must be unique"));
  }

  const orders = steps.map((s) => s.order);
  if (new Set(orders).size !== orders.length) {
    issues.push(issue("steps", "invalid_step_order", "step order values must be unique"));
  }

  for (const step of steps) {
    for (const pre of step.prerequisites) {
      if (!stepKeys.has(pre)) {
        issues.push(issue(`steps.${step.step_key}`, "unknown_prerequisite", `Unknown prerequisite ${pre}`));
      }
    }
  }

  const dependencies = Array.isArray(row.dependencies)
    ? row.dependencies
        .map((d) => {
          const dep = record(d);
          if (!dep) return null;
          const from = str(dep.from);
          const to = str(dep.to);
          if (!from || !to) return null;
          return { from, to };
        })
        .filter((d): d is { from: string; to: string } => !!d)
    : [];

  const cycle = detectCycles(dependencies, stepKeys);
  if (cycle) {
    issues.push(issue("dependencies", "dependency_cycle", `Cycle involving ${cycle}`));
  }

  const versioning = record(row.versioning) ?? {};
  const status = versioning.status;
  if (status !== "draft" && status !== "published" && status !== "deprecated") {
    issues.push(issue("versioning.status", "invalid_version_status", String(status)));
  }
  if (status !== "published" && !opts.allowDraft) {
    issues.push(issue("versioning.status", "not_published", "APP may only use published contracts"));
  }

  const inviteRow = record(row.invite) ?? {};
  const invite: InstallationInviteContract = {
    supported_roles: Array.isArray(inviteRow.supported_roles)
      ? inviteRow.supported_roles.filter(
          (r): r is "customer_it" | "external_provider" | "partner" =>
            r === "customer_it" || r === "external_provider" || r === "partner"
        )
      : [],
    token_ttl_hours: num(inviteRow.token_ttl_hours, 72),
    revoke_supported: bool(inviteRow.revoke_supported, true),
    scoped_to_installation: true,
    backend_status:
      inviteRow.backend_status === "available" ? "available" : "typed_placeholder",
  };

  const assistance_actions = Array.isArray(row.assistance_actions)
    ? row.assistance_actions
        .map((a, i) => parseAssistance(a, `assistance_actions[${i}]`, issues))
        .filter((a): a is InstallationAssistanceAction => !!a)
    : [];

  const documentation = record(row.documentation) ?? {};
  const customer_help = parseLocalized(documentation.customer_help, "documentation.customer_help", issues);
  if (!customer_help) {
    issues.push(issue("documentation.customer_help", "missing_help", "customer_help required"));
  }

  if (!isInstallationResponsibleParty(row.responsible_party_default)) {
    issues.push(issue("responsible_party_default", "invalid_responsible_party", String(row.responsible_party_default)));
  }
  if (!isInstallationSecurityClass(row.security_classification)) {
    issues.push(issue("security_classification", "invalid_security", String(row.security_classification)));
  }

  if (
    issues.length ||
    !default_support_mode ||
    !customer_help ||
    !isInstallationResponsibleParty(row.responsible_party_default) ||
    !isInstallationSecurityClass(row.security_classification)
  ) {
    return { ok: false, issues };
  }

  const responsible_party_default = row.responsible_party_default;
  const security_classification = row.security_classification;

  const contract: InstallationContract = {
    contract_version,
    provider_key,
    installation_mode: str(row.installation_mode) ?? "provider_connection",
    support_modes,
    default_support_mode,
    audience_variants: Array.isArray(row.audience_variants)
      ? row.audience_variants.filter(isInstallationAudience)
      : ["customer_owner", "customer_admin", "aipify_operator"],
    steps,
    dependencies,
    required_customer_inputs: Array.isArray(row.required_customer_inputs)
      ? row.required_customer_inputs.filter((x): x is string => typeof x === "string")
      : [],
    responsible_party_default,
    security_classification,
    validation: {
      require_verified_before_activation: true,
      block_on_unresolved_prerequisites: true,
    },
    completion_rules: Array.isArray(row.completion_rules)
      ? row.completion_rules.filter((x): x is string => typeof x === "string")
      : ["all_required_steps_complete", "verified", "explicit_activation"],
    failure_policy: str(row.failure_policy) ?? "retry_or_escalate",
    resume_policy: {
      allow_pause: true,
      pin_contract_version: true,
      stale_contract_strategy: "migrate_or_restart",
    },
    test_policy: {
      use_existing_provider_test: true,
      allow_retry: bool(record(row.test_policy)?.allow_retry, true),
      poll_interval_ms: num(record(row.test_policy)?.poll_interval_ms, 2000),
    },
    verification_policy: {
      use_existing_provider_verify: true,
    },
    activation_requirements: {
      verified: true,
      approvals_complete: bool(record(row.activation_requirements)?.approvals_complete, true),
      scopes_confirmed: bool(record(row.activation_requirements)?.scopes_confirmed, true),
      no_unresolved_blockers: true,
      explicit_user_action: true,
      no_auto_activation: true,
    },
    documentation: {
      customer_help,
      internal_runbook: documentation.internal_runbook
        ? parseLocalized(documentation.internal_runbook, "documentation.internal_runbook", issues) ?? undefined
        : undefined,
    },
    estimated_time_minutes: num(row.estimated_time_minutes, 15),
    escalation: {
      path: str(record(row.escalation)?.path) ?? "support",
      contact_action: str(record(row.escalation)?.contact_action) ?? "contact_support",
    },
    assistance_actions,
    invite,
    versioning: {
      status: status as "draft" | "published" | "deprecated",
      created_at: str(versioning.created_at) ?? undefined,
      updated_at: str(versioning.updated_at) ?? undefined,
      published_at: versioning.published_at == null ? null : str(versioning.published_at),
      deprecated_at: versioning.deprecated_at == null ? null : str(versioning.deprecated_at),
      updated_by: versioning.updated_by == null ? null : str(versioning.updated_by),
      changelog: str(versioning.changelog) ?? undefined,
      compatibility_range: str(versioning.compatibility_range) ?? undefined,
    },
    rtl_support: bool(row.rtl_support),
    locale_fallback: str(row.locale_fallback) ?? "en",
  };

  return { ok: true, contract, warnings };
}
