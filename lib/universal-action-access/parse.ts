import type {
  UaafActionAccessCenter,
  UaafActionAuditEntry,
  UaafActionValidation,
  UaafIntegrationAccess,
  UaafSettings,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseUaafSettings(raw: unknown): UaafSettings {
  const row = asRecord(raw);
  return {
    enabled: Boolean(row.enabled ?? true),
    emergency_stop_honored: Boolean(row.emergency_stop_honored ?? true),
    business_hours_only: Boolean(row.business_hours_only ?? false),
    geographic_limit: row.geographic_limit ? String(row.geographic_limit) : null,
    default_approval_level:
      (row.default_approval_level as UaafSettings["default_approval_level"]) ?? "user_confirmation",
  };
}

export function parseUaafIntegration(raw: unknown): UaafIntegrationAccess {
  const row = asRecord(raw);
  return {
    id: String(row.id ?? ""),
    integration_key: String(row.integration_key ?? ""),
    integration_label: String(row.integration_label ?? ""),
    action_category: (row.action_category as UaafIntegrationAccess["action_category"]) ?? "business",
    access_scope: String(row.access_scope ?? ""),
    execute_scope: String(row.execute_scope ?? ""),
    approval_level: (row.approval_level as UaafIntegrationAccess["approval_level"]) ?? "user_confirmation",
    logging_required: Boolean(row.logging_required ?? true),
    reversal_available: Boolean(row.reversal_available ?? false),
    status: String(row.status ?? "active"),
  };
}

export function parseUaafActionAccessCenter(raw: unknown): UaafActionAccessCenter {
  const row = asRecord(raw);
  return {
    settings: parseUaafSettings(row.settings),
    integrations: Array.isArray(row.integrations) ? row.integrations.map(parseUaafIntegration) : [],
    recent_audit: Array.isArray(row.recent_audit)
      ? row.recent_audit.map((entry) => {
          const e = asRecord(entry);
          return {
            id: String(e.id ?? ""),
            integration_key: e.integration_key ? String(e.integration_key) : null,
            action_category: e.action_category ? String(e.action_category) : null,
            action_key: e.action_key ? String(e.action_key) : null,
            action_label: e.action_label ? String(e.action_label) : null,
            approval_status: e.approval_status ? String(e.approval_status) : null,
            outcome: e.outcome ? String(e.outcome) : null,
            reversal_status: e.reversal_status ? String(e.reversal_status) : null,
            summary: e.summary ? String(e.summary) : null,
            created_at: String(e.created_at ?? ""),
          } satisfies UaafActionAuditEntry;
        })
      : [],
    core_principle: String(row.core_principle ?? ""),
    metrics: asRecord(row.metrics) as UaafActionAccessCenter["metrics"],
  };
}

export function parseUaafActionValidation(raw: unknown): UaafActionValidation {
  const row = asRecord(raw);
  return {
    allowed: Boolean(row.allowed),
    approval_level_required:
      (row.approval_level_required as UaafActionValidation["approval_level_required"]) ??
      "user_confirmation",
    reason: String(row.reason ?? ""),
    offer_prompt_en: row.offer_prompt_en ? String(row.offer_prompt_en) : null,
    offer_prompt_no: row.offer_prompt_no ? String(row.offer_prompt_no) : null,
  };
}
