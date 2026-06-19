export type Csar587OperationsCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  health_score?: number;
  health_status?: string;
  health_status_label?: string;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  onboarding?: Record<string, unknown>[];
  health?: Record<string, unknown>;
  adoption?: Record<string, unknown>[];
  value_realization?: Record<string, unknown>[];
  risks?: Record<string, unknown>[];
  opportunities?: Record<string, unknown>[];
  renewals?: Record<string, unknown>[];
  playbooks?: Record<string, unknown>[];
  journey?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  advocacy?: Record<string, unknown>[];
  audit_recent?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  overview?: Record<string, unknown>;
  health_rows?: Record<string, unknown>[];
  rows?: Record<string, unknown>[];
};

export function parseCsar587OperationsCenter(raw: unknown): Csar587OperationsCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    health_score: typeof row.health_score === "number" ? row.health_score : undefined,
    health_status: typeof row.health_status === "string" ? row.health_status : undefined,
    health_status_label: typeof row.health_status_label === "string" ? row.health_status_label : undefined,
    stats: typeof row.stats === "object" && row.stats ? (row.stats as Record<string, number | string>) : {},
    companion_recommendations: Array.isArray(row.companion_recommendations)
      ? (row.companion_recommendations as Record<string, unknown>[])
      : [],
    onboarding: Array.isArray(row.onboarding) ? (row.onboarding as Record<string, unknown>[]) : [],
    health: typeof row.health === "object" && row.health ? (row.health as Record<string, unknown>) : {},
    adoption: Array.isArray(row.adoption) ? (row.adoption as Record<string, unknown>[]) : [],
    value_realization: Array.isArray(row.value_realization) ? (row.value_realization as Record<string, unknown>[]) : [],
    risks: Array.isArray(row.risks) ? (row.risks as Record<string, unknown>[]) : [],
    opportunities: Array.isArray(row.opportunities) ? (row.opportunities as Record<string, unknown>[]) : [],
    renewals: Array.isArray(row.renewals) ? (row.renewals as Record<string, unknown>[]) : [],
    playbooks: Array.isArray(row.playbooks) ? (row.playbooks as Record<string, unknown>[]) : [],
    journey: Array.isArray(row.journey) ? (row.journey as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    advocacy: Array.isArray(row.advocacy) ? (row.advocacy as Record<string, unknown>[]) : [],
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, unknown>) : {},
    overview: typeof row.overview === "object" && row.overview ? (row.overview as Record<string, unknown>) : {},
    health_rows: Array.isArray(row.health) ? (row.health as Record<string, unknown>[]) : Array.isArray(row.health_rows) ? row.health_rows : [],
    rows: Array.isArray(row.rows) ? (row.rows as Record<string, unknown>[]) : [],
  };
}
