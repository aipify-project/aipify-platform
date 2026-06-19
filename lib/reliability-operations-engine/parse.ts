export type ReliabilityCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  overall_health_score?: number;
  activity_since_login?: Record<string, unknown>;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  services?: Record<string, unknown>[];
  health_signals?: Record<string, unknown>[];
  incidents?: Record<string, unknown>[];
  self_healing?: Record<string, unknown>[];
  recovery_actions?: Record<string, unknown>[];
  dependencies?: Record<string, unknown>[];
  failure_correlations?: Record<string, unknown>[];
  slo_error_budgets?: Record<string, unknown>[];
  maintenance_windows?: Record<string, unknown>[];
  status_communications?: Record<string, unknown>[];
  proactive_communications?: Record<string, unknown>[];
  status_model?: Record<string, unknown>[];
  connected_apps?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  workflows?: Record<string, unknown>[];
  domains?: Record<string, unknown>[];
  notifications?: Record<string, unknown>[];
  maintenance?: Record<string, unknown>[];
  support?: Record<string, unknown>[];
  billing_reliability?: Record<string, unknown>[];
  business_pack_reliability?: Record<string, unknown>[];
  knowledge_base?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  rows?: Record<string, unknown>[];
};

export function parseReliabilityCenter(raw: unknown): ReliabilityCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  const arr = (key: string) =>
    Array.isArray(row[key]) ? (row[key] as Record<string, unknown>[]) : [];
  const obj = (key: string) =>
    typeof row[key] === "object" && row[key] ? (row[key] as Record<string, number | string>) : {};

  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    overall_health_score: typeof row.overall_health_score === "number" ? row.overall_health_score : undefined,
    activity_since_login:
      typeof row.activity_since_login === "object" && row.activity_since_login
        ? (row.activity_since_login as Record<string, unknown>)
        : undefined,
    executive_dashboard: obj("executive_dashboard"),
    stats: obj("stats"),
    companion_recommendations: arr("companion_recommendations"),
    services: arr("services"),
    health_signals: arr("health_signals"),
    incidents: arr("incidents"),
    self_healing: arr("self_healing"),
    recovery_actions: arr("recovery_actions"),
    dependencies: arr("dependencies"),
    failure_correlations: arr("failure_correlations"),
    slo_error_budgets: arr("slo_error_budgets"),
    maintenance_windows: arr("maintenance_windows"),
    status_communications: arr("status_communications"),
    proactive_communications: arr("proactive_communications"),
    status_model: arr("status_model"),
    connected_apps: arr("connected_apps"),
    business_packs: arr("business_packs"),
    workflows: arr("workflows"),
    domains: arr("domains"),
    notifications: arr("notifications"),
    maintenance: arr("maintenance"),
    support: arr("support"),
    billing_reliability: arr("billing_reliability"),
    business_pack_reliability: arr("business_pack_reliability"),
    knowledge_base: arr("knowledge_base"),
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: arr("audit_recent"),
    rows: arr("rows"),
  };
}
