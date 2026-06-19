import type { MaturityEvolutionCenter } from "./types";

export function parseMaturityEvolutionCenter(raw: Record<string, unknown>): MaturityEvolutionCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as MaturityEvolutionCenter["organization"],
    overview: raw.overview as MaturityEvolutionCenter["overview"],
    capabilities: Array.isArray(raw.capabilities) ? (raw.capabilities as Record<string, unknown>[]) : [],
    assessments: Array.isArray(raw.assessments) ? (raw.assessments as Record<string, unknown>[]) : [],
    readiness: Array.isArray(raw.readiness) ? (raw.readiness as Record<string, unknown>[]) : [],
    roadmaps: Array.isArray(raw.roadmaps) ? (raw.roadmaps as Record<string, unknown>[]) : [],
    benchmarks: Array.isArray(raw.benchmarks) ? (raw.benchmarks as Record<string, unknown>[]) : [],
    gaps: Array.isArray(raw.gaps)
      ? (raw.gaps as Record<string, unknown>[])
      : Array.isArray(raw.capability_gaps)
        ? (raw.capability_gaps as Record<string, unknown>[])
        : [],
    evolution: Array.isArray(raw.evolution)
      ? (raw.evolution as Record<string, unknown>[])
      : Array.isArray(raw.evolution_tracking)
        ? (raw.evolution_tracking as Record<string, unknown>[])
        : [],
    business_packs: Array.isArray(raw.business_packs) ? (raw.business_packs as Record<string, unknown>[]) : [],
    evolution_score: raw.evolution_score as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    maturity_model: raw.maturity_model as Record<string, unknown>,
    recommendations: Array.isArray(raw.recommendations) ? (raw.recommendations as Record<string, unknown>[]) : [],
    companion: raw.companion as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as MaturityEvolutionCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
  };
}
