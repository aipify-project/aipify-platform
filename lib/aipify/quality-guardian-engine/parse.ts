import type { QualityGuardianEngineCard, QualityGuardianEngineDashboard } from "./types";

function parseArray<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) ? (value as T[]) : undefined;
}

function parseObject(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value ? (value as Record<string, unknown>) : undefined;
}

export function parseQualityGuardianEngineCard(data: unknown): QualityGuardianEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    open_checks: Number(d.open_checks ?? 0),
    critical_checks: Number(d.critical_checks ?? 0),
    pending_recommendations: Number(d.pending_recommendations ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    implementation_blueprint: parseObject(d.implementation_blueprint) as QualityGuardianEngineCard["implementation_blueprint"],
    quality_guardian_engine_note:
      typeof d.quality_guardian_engine_note === "string" ? d.quality_guardian_engine_note : undefined,
  };
}

export function parseQualityGuardianEngineDashboard(
  data: unknown
): QualityGuardianEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    implementation_blueprint: parseObject(d.implementation_blueprint) as QualityGuardianEngineDashboard["implementation_blueprint"],
    mission: typeof d.mission === "string" ? d.mission : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    quality_guardian_engine_note:
      typeof d.quality_guardian_engine_note === "string" ? d.quality_guardian_engine_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    quality_objectives: parseArray(d.quality_objectives),
    governance_objectives: parseArray(d.governance_objectives),
    qg_capabilities: parseArray(d.qg_capabilities),
    companion_quality_principles: parseArray(d.companion_quality_principles),
    self_love_connection: parseObject(d.self_love_connection) as QualityGuardianEngineDashboard["self_love_connection"],
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    trust_connection: parseObject(d.trust_connection) as QualityGuardianEngineDashboard["trust_connection"],
    governance_summary: parseObject(d.governance_summary) as QualityGuardianEngineDashboard["governance_summary"],
    dogfooding: parseObject(d.dogfooding) as QualityGuardianEngineDashboard["dogfooding"],
    success_criteria: parseArray(d.success_criteria),
    vision_phrases: parseArray(d.vision_phrases),
    integration_links: parseArray(d.integration_links),
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    settings: parseObject(d.settings),
    last_scan: parseObject(d.last_scan),
    trends: parseObject(d.trends) as QualityGuardianEngineDashboard["trends"],
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
