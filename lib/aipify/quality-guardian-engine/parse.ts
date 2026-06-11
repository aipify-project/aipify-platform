import type { QualityGuardianEngineCard, QualityGuardianEngineDashboard } from "./types";

export function parseQualityGuardianEngineCard(data: unknown): QualityGuardianEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    open_checks: Number(d.open_checks ?? 0),
    critical_checks: Number(d.critical_checks ?? 0),
    pending_recommendations: Number(d.pending_recommendations ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseQualityGuardianEngineDashboard(
  data: unknown
): QualityGuardianEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as Record<string, unknown>)
        : undefined,
    last_scan:
      typeof d.last_scan === "object" && d.last_scan
        ? (d.last_scan as Record<string, unknown>)
        : undefined,
    trends:
      typeof d.trends === "object" && d.trends
        ? (d.trends as QualityGuardianEngineDashboard["trends"])
        : undefined,
    high_risk_areas: Array.isArray(d.high_risk_areas)
      ? (d.high_risk_areas as QualityGuardianEngineDashboard["high_risk_areas"])
      : [],
    active_checks: Array.isArray(d.active_checks)
      ? (d.active_checks as QualityGuardianEngineDashboard["active_checks"])
      : [],
    recommendations: Array.isArray(d.recommendations)
      ? (d.recommendations as QualityGuardianEngineDashboard["recommendations"])
      : [],
    recently_resolved: Array.isArray(d.recently_resolved)
      ? (d.recently_resolved as QualityGuardianEngineDashboard["recently_resolved"])
      : [],
  };
}
