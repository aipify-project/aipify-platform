export type StrategyCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  strategic_health_score?: number;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  objectives?: Record<string, unknown>[];
  initiatives?: Record<string, unknown>[];
  opportunities?: Record<string, unknown>[];
  risks?: Record<string, unknown>[];
  board?: Record<string, unknown>[];
  briefings?: Record<string, unknown>[];
  forecasts?: Record<string, unknown>[];
  kpis?: Record<string, unknown>[];
  planning_cycles?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  decision_support?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
};

export function parseStrategyCenter(raw: unknown): StrategyCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    strategic_health_score: typeof row.strategic_health_score === "number" ? row.strategic_health_score : undefined,
    stats: typeof row.stats === "object" && row.stats ? (row.stats as Record<string, number | string>) : {},
    companion_recommendations: Array.isArray(row.companion_recommendations) ? (row.companion_recommendations as Record<string, unknown>[]) : [],
    objectives: Array.isArray(row.objectives) ? (row.objectives as Record<string, unknown>[]) : [],
    initiatives: Array.isArray(row.initiatives) ? (row.initiatives as Record<string, unknown>[]) : [],
    opportunities: Array.isArray(row.opportunities) ? (row.opportunities as Record<string, unknown>[]) : [],
    risks: Array.isArray(row.risks) ? (row.risks as Record<string, unknown>[]) : [],
    board: Array.isArray(row.board) ? (row.board as Record<string, unknown>[]) : [],
    briefings: Array.isArray(row.briefings) ? (row.briefings as Record<string, unknown>[]) : [],
    forecasts: Array.isArray(row.forecasts) ? (row.forecasts as Record<string, unknown>[]) : [],
    kpis: Array.isArray(row.kpis) ? (row.kpis as Record<string, unknown>[]) : [],
    planning_cycles: Array.isArray(row.planning_cycles) ? (row.planning_cycles as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    decision_support: typeof row.decision_support === "object" && row.decision_support ? (row.decision_support as Record<string, string>) : {},
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, unknown>) : {},
  };
}
