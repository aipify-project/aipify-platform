export type EvolutionCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  foundation_milestone?: Record<string, boolean>;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  platform_phases?: Record<string, unknown>[];
  companion_evolution?: Record<string, unknown>[];
  innovation_pipeline?: Record<string, unknown>[];
  future_opportunities?: Record<string, unknown>[];
  self_assessment?: Record<string, unknown>[];
  capability_roadmap?: Record<string, unknown>[];
  pack_evolution?: Record<string, unknown>[];
  readiness_reviews?: Record<string, unknown>[];
  stewardship?: Record<string, unknown>[];
  enterprise_program?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
};

export function parseEvolutionCenter(raw: unknown): EvolutionCenter {
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
    foundation_milestone:
      typeof row.foundation_milestone === "object" && row.foundation_milestone
        ? (row.foundation_milestone as Record<string, boolean>)
        : undefined,
    executive_dashboard: obj("executive_dashboard"),
    stats: obj("stats"),
    companion_recommendations: arr("companion_recommendations"),
    platform_phases: arr("platform_phases"),
    companion_evolution: arr("companion_evolution"),
    innovation_pipeline: arr("innovation_pipeline"),
    future_opportunities: arr("future_opportunities"),
    self_assessment: arr("self_assessment"),
    capability_roadmap: arr("capability_roadmap"),
    pack_evolution: arr("pack_evolution"),
    readiness_reviews: arr("readiness_reviews"),
    stewardship: arr("stewardship"),
    enterprise_program: arr("enterprise_program"),
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: arr("audit_recent"),
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
  };
}
