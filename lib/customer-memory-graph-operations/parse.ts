import type { MemoryGraphCenter } from "./types";

export function parseMemoryGraphCenter(raw: Record<string, unknown>): MemoryGraphCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as MemoryGraphCenter["organization"],
    overview: raw.overview as MemoryGraphCenter["overview"],
    entities: Array.isArray(raw.entities) ? (raw.entities as Record<string, unknown>[]) : [],
    relationships: Array.isArray(raw.relationships) ? (raw.relationships as Record<string, unknown>[]) : [],
    connections: Array.isArray(raw.connections) ? (raw.connections as Record<string, unknown>[]) : [],
    knowledge: Array.isArray(raw.knowledge)
      ? (raw.knowledge as Record<string, unknown>[])
      : Array.isArray(raw.knowledge_map)
        ? (raw.knowledge_map as Record<string, unknown>[])
        : [],
    decisions: Array.isArray(raw.decisions)
      ? (raw.decisions as Record<string, unknown>[])
      : Array.isArray(raw.decision_links)
        ? (raw.decision_links as Record<string, unknown>[])
        : [],
    projects: Array.isArray(raw.projects)
      ? (raw.projects as Record<string, unknown>[])
      : Array.isArray(raw.project_intelligence)
        ? (raw.project_intelligence as Record<string, unknown>[])
        : [],
    customer_intelligence: Array.isArray(raw.customer_intelligence)
      ? (raw.customer_intelligence as Record<string, unknown>[])
      : [],
    dependencies: Array.isArray(raw.dependencies) ? (raw.dependencies as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(raw.business_packs) ? (raw.business_packs as Record<string, unknown>[]) : [],
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    recommendations: Array.isArray(raw.recommendations) ? (raw.recommendations as Record<string, unknown>[]) : [],
    companion: raw.companion as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as MemoryGraphCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
  };
}
