import type { ResourceCapacityCenter } from "./types";

export function parseResourceCapacityCenter(raw: Record<string, unknown>): ResourceCapacityCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as ResourceCapacityCenter["organization"],
    overview: raw.overview as ResourceCapacityCenter["overview"],
    registry: Array.isArray(raw.registry) ? (raw.registry as Record<string, unknown>[]) : [],
    capacity: Array.isArray(raw.capacity) ? (raw.capacity as Record<string, unknown>[]) : [],
    teams: Array.isArray(raw.teams) ? (raw.teams as Record<string, unknown>[]) : [],
    workloads: Array.isArray(raw.workloads) ? (raw.workloads as Record<string, unknown>[]) : [],
    allocations: Array.isArray(raw.allocations) ? (raw.allocations as Record<string, unknown>[]) : [],
    forecasts: Array.isArray(raw.forecasts) ? (raw.forecasts as Record<string, unknown>[]) : [],
    availability: Array.isArray(raw.availability) ? (raw.availability as Record<string, unknown>[]) : [],
    overloads: Array.isArray(raw.overloads) ? (raw.overloads as Record<string, unknown>[]) : [],
    underutilization: Array.isArray(raw.underutilization) ? (raw.underutilization as Record<string, unknown>[]) : [],
    skill_matches: Array.isArray(raw.skill_matches) ? (raw.skill_matches as Record<string, unknown>[]) : [],
    projects: Array.isArray(raw.projects) ? (raw.projects as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(raw.business_packs) ? (raw.business_packs as Record<string, unknown>[]) : [],
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    recommendations: Array.isArray(raw.recommendations) ? (raw.recommendations as Record<string, unknown>[]) : [],
    companion: raw.companion as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as ResourceCapacityCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
  };
}
