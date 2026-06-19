import type { DigitalTwinSimulationCenter } from "./types";

export function parseDigitalTwinSimulationCenter(raw: Record<string, unknown>): DigitalTwinSimulationCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  const experiments = Array.isArray(raw.experiments)
    ? (raw.experiments as Record<string, unknown>[])
    : Array.isArray(raw.what_if_experiments)
      ? (raw.what_if_experiments as Record<string, unknown>[])
      : [];

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as DigitalTwinSimulationCenter["organization"],
    overview: raw.overview as DigitalTwinSimulationCenter["overview"],
    models: Array.isArray(raw.models) ? (raw.models as Record<string, unknown>[]) : [],
    scenarios: Array.isArray(raw.scenarios) ? (raw.scenarios as Record<string, unknown>[]) : [],
    forecasts: Array.isArray(raw.forecasts) ? (raw.forecasts as Record<string, unknown>[]) : [],
    impacts: Array.isArray(raw.impacts) ? (raw.impacts as Record<string, unknown>[]) : [],
    experiments,
    capacity: Array.isArray(raw.capacity)
      ? (raw.capacity as Record<string, unknown>[])
      : Array.isArray(raw.capacity_modeling)
        ? (raw.capacity_modeling as Record<string, unknown>[])
        : [],
    allocations: Array.isArray(raw.allocations)
      ? (raw.allocations as Record<string, unknown>[])
      : Array.isArray(raw.resource_allocations)
        ? (raw.resource_allocations as Record<string, unknown>[])
        : [],
    decision_previews: Array.isArray(raw.decision_previews) ? (raw.decision_previews as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(raw.business_packs) ? (raw.business_packs as Record<string, unknown>[]) : [],
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    recommendations: Array.isArray(raw.recommendations) ? (raw.recommendations as Record<string, unknown>[]) : [],
    companion: raw.companion as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as DigitalTwinSimulationCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
  };
}
