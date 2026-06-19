export type KnowledgeFabricCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  sources?: Record<string, unknown>[];
  knowledge?: Record<string, unknown>[];
  conflicts?: Record<string, unknown>[];
  trust_scores?: Record<string, unknown>[];
  reviews?: Record<string, unknown>[];
  wisdom_library?: Record<string, unknown>[];
  reliability_metrics?: Record<string, unknown>[];
  lineage?: Record<string, unknown>[];
  decay_signals?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
};

export function parseKnowledgeFabricCenter(raw: unknown): KnowledgeFabricCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    executive_dashboard:
      typeof row.executive_dashboard === "object" && row.executive_dashboard
        ? (row.executive_dashboard as Record<string, number | string>)
        : {},
    stats: typeof row.stats === "object" && row.stats ? (row.stats as Record<string, number | string>) : {},
    companion_recommendations: Array.isArray(row.companion_recommendations)
      ? (row.companion_recommendations as Record<string, unknown>[])
      : [],
    sources: Array.isArray(row.sources) ? (row.sources as Record<string, unknown>[]) : [],
    knowledge: Array.isArray(row.knowledge) ? (row.knowledge as Record<string, unknown>[]) : [],
    conflicts: Array.isArray(row.conflicts) ? (row.conflicts as Record<string, unknown>[]) : [],
    trust_scores: Array.isArray(row.trust_scores) ? (row.trust_scores as Record<string, unknown>[]) : [],
    reviews: Array.isArray(row.reviews) ? (row.reviews as Record<string, unknown>[]) : [],
    wisdom_library: Array.isArray(row.wisdom_library) ? (row.wisdom_library as Record<string, unknown>[]) : [],
    reliability_metrics: Array.isArray(row.reliability_metrics)
      ? (row.reliability_metrics as Record<string, unknown>[])
      : [],
    lineage: Array.isArray(row.lineage) ? (row.lineage as Record<string, unknown>[]) : [],
    decay_signals: Array.isArray(row.decay_signals) ? (row.decay_signals as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
  };
}

export function trustLevelLabel(level: string): string {
  switch (level) {
    case "trusted":
      return "Trusted";
    case "verified":
      return "Verified";
    case "review_needed":
      return "Review Needed";
    case "potentially_outdated":
      return "Potentially Outdated";
    default:
      return level.replace(/_/g, " ");
  }
}
