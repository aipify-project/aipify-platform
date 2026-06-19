export type AosCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  maturity_checkpoint?: Record<string, boolean>;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  org_dimensions?: Record<string, unknown>[];
  entities?: Record<string, unknown>[];
  cross_module_chains?: Record<string, unknown>[];
  awareness_states?: Record<string, unknown>[];
  executive_questions?: Record<string, unknown>[];
  business_pack_links?: Record<string, unknown>[];
  twin_connections?: Record<string, unknown>[];
  global_context?: Record<string, unknown>[];
  search_domains?: Record<string, unknown>[];
  report_types?: Record<string, unknown>[];
  organizational_health?: Record<string, unknown>[];
  intelligence_bus?: Record<string, unknown>[];
  orchestration?: Record<string, unknown>[];
  api_capabilities?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
};

export function parseAosCenter(raw: unknown): AosCenter {
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
    maturity_checkpoint:
      typeof row.maturity_checkpoint === "object" && row.maturity_checkpoint
        ? (row.maturity_checkpoint as Record<string, boolean>)
        : undefined,
    executive_dashboard: obj("executive_dashboard"),
    stats: obj("stats"),
    companion_recommendations: arr("companion_recommendations"),
    org_dimensions: arr("org_dimensions"),
    entities: arr("entities"),
    cross_module_chains: arr("cross_module_chains"),
    awareness_states: arr("awareness_states"),
    executive_questions: arr("executive_questions"),
    business_pack_links: arr("business_pack_links"),
    twin_connections: arr("twin_connections"),
    global_context: arr("global_context"),
    search_domains: arr("search_domains"),
    report_types: arr("report_types"),
    organizational_health: arr("organizational_health"),
    intelligence_bus: arr("intelligence_bus"),
    orchestration: arr("orchestration"),
    api_capabilities: arr("api_capabilities"),
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: arr("audit_recent"),
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
  };
}

export function healthBandEmoji(band: string | undefined): string {
  switch (band) {
    case "excellent":
      return "🟢";
    case "healthy":
      return "🟢";
    case "attention":
      return "⚠️";
    case "risk":
      return "🚨";
    default:
      return "";
  }
}
