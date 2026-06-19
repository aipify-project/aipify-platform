export type FeedbackCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  feedback?: Record<string, unknown>[];
  suggestions?: Record<string, unknown>[];
  ratings?: Record<string, unknown>[];
  experience_signals?: Record<string, unknown>[];
  improvements?: Record<string, unknown>[];
  quality_metrics?: Record<string, unknown>[];
  feedback_loops?: Record<string, unknown>[];
  feature_requests?: Record<string, unknown>[];
  knowledge_gaps?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  mobile_access?: Record<string, unknown>;
};

export function parseFeedbackCenter(raw: unknown): FeedbackCenter {
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
    feedback: Array.isArray(row.feedback) ? (row.feedback as Record<string, unknown>[]) : [],
    suggestions: Array.isArray(row.suggestions) ? (row.suggestions as Record<string, unknown>[]) : [],
    ratings: Array.isArray(row.ratings) ? (row.ratings as Record<string, unknown>[]) : [],
    experience_signals: Array.isArray(row.experience_signals)
      ? (row.experience_signals as Record<string, unknown>[])
      : [],
    improvements: Array.isArray(row.improvements) ? (row.improvements as Record<string, unknown>[]) : [],
    quality_metrics: Array.isArray(row.quality_metrics) ? (row.quality_metrics as Record<string, unknown>[]) : [],
    feedback_loops: Array.isArray(row.feedback_loops) ? (row.feedback_loops as Record<string, unknown>[]) : [],
    feature_requests: Array.isArray(row.feature_requests) ? (row.feature_requests as Record<string, unknown>[]) : [],
    knowledge_gaps: Array.isArray(row.knowledge_gaps) ? (row.knowledge_gaps as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    mobile_access:
      typeof row.mobile_access === "object" && row.mobile_access
        ? (row.mobile_access as Record<string, unknown>)
        : {},
  };
}

export function ratingLevelLabel(level: string): string {
  switch (level) {
    case "excellent":
      return "Excellent";
    case "positive":
      return "Positive";
    case "mixed":
      return "Mixed";
    case "improvement_required":
      return "Improvement Required";
    default:
      return level.replace(/_/g, " ");
  }
}
