import type { FinancialGuardrailsCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseProfile(raw: unknown): FinancialGuardrailsCenter["active_profiles"][0] {
  const row = asRecord(raw);
  return {
    profile_key: String(row.profile_key ?? ""),
    profile_name: String(row.profile_name ?? ""),
    spending_category: String(row.spending_category ?? ""),
    limit_type: String(row.limit_type ?? "per_transaction"),
    approval_threshold: String(row.approval_threshold ?? "level_2"),
    status: String(row.status ?? "active"),
    limits: row.limits ? asRecord(row.limits) : null,
    allowed_providers: Array.isArray(row.allowed_providers)
      ? row.allowed_providers.map(String)
      : null,
    restrictions: row.restrictions ? asRecord(row.restrictions) : null,
  };
}

function parseExpenditure(raw: unknown): FinancialGuardrailsCenter["expenditures"][0] {
  const row = asRecord(raw);
  return {
    expenditure_key: String(row.expenditure_key ?? ""),
    profile_key: String(row.profile_key ?? ""),
    category: String(row.category ?? ""),
    amount: Number(row.amount ?? 0),
    currency: String(row.currency ?? "NOK"),
    status: String(row.status ?? "requested"),
    approval_threshold: row.approval_threshold ? String(row.approval_threshold) : null,
    created_at: String(row.created_at ?? ""),
  };
}

export function parseFinancialGuardrailsCenter(raw: unknown): FinancialGuardrailsCenter {
  const row = asRecord(raw);
  const settingsRaw = asRecord(row.settings);

  return {
    settings:
      Object.keys(settingsRaw).length > 0
        ? {
            guardrails_enabled: Boolean(settingsRaw.guardrails_enabled ?? true),
            default_approval_threshold: String(settingsRaw.default_approval_threshold ?? "level_2"),
          }
        : null,
    active_profiles: Array.isArray(row.active_profiles)
      ? row.active_profiles.map(parseProfile)
      : Array.isArray(row.profiles)
        ? row.profiles.filter((p) => asRecord(p).status === "active").map(parseProfile)
        : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((rec) => {
          const r = asRecord(rec);
          return {
            recommendation_key: String(r.recommendation_key ?? ""),
            message: String(r.message ?? ""),
            spending_category: r.spending_category ? String(r.spending_category) : null,
            status: String(r.status ?? "pending"),
          };
        })
      : [],
    expenditures: Array.isArray(row.expenditures)
      ? row.expenditures.map(parseExpenditure)
      : [],
    alerts: Array.isArray(row.alerts)
      ? row.alerts.map((a) => {
          const item = asRecord(a);
          return {
            alert_key: String(item.alert_key ?? ""),
            alert_type: String(item.alert_type ?? ""),
            message: String(item.message ?? ""),
            severity: String(item.severity ?? "info"),
            status: String(item.status ?? "active"),
            created_at: String(item.created_at ?? ""),
          };
        })
      : [],
    spending_trends: row.spending_trends ? asRecord(row.spending_trends) : null,
    budget_utilization: row.budget_utilization ? asRecord(row.budget_utilization) : null,
    high_value_transactions: Array.isArray(row.high_value_transactions)
      ? row.high_value_transactions.map(parseExpenditure)
      : [],
    policy_exceptions: row.policy_exceptions ? asRecord(row.policy_exceptions) : null,
    effectiveness_indicators: row.effectiveness_indicators
      ? asRecord(row.effectiveness_indicators)
      : null,
    blueprint: row.blueprint ? asRecord(row.blueprint) : null,
    links: row.links
      ? Object.fromEntries(
          Object.entries(asRecord(row.links)).map(([key, value]) => [key, String(value)]),
        )
      : null,
    can_manage: Boolean(row.can_manage),
    can_record: Boolean(row.can_record),
    can_delete: Boolean(row.can_delete),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
