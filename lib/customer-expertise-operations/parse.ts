import type { ExpertiseCenter } from "./types";

export function parseExpertiseCenter(raw: Record<string, unknown>): ExpertiseCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as ExpertiseCenter["organization"],
    overview: raw.overview as ExpertiseCenter["overview"],
    expert_directory: Array.isArray(raw.expert_directory) ? (raw.expert_directory as Record<string, unknown>[]) : [],
    knowledge_owners: Array.isArray(raw.knowledge_owners) ? (raw.knowledge_owners as Record<string, unknown>[]) : [],
    critical_knowledge_map: Array.isArray(raw.critical_knowledge_map)
      ? (raw.critical_knowledge_map as Record<string, unknown>[])
      : [],
    mentorship: Array.isArray(raw.mentorship) ? (raw.mentorship as Record<string, unknown>[]) : [],
    projects: Array.isArray(raw.projects) ? (raw.projects as Record<string, unknown>[]) : [],
    recommendations: Array.isArray(raw.recommendations) ? (raw.recommendations as Record<string, unknown>[]) : [],
    succession_risks: Array.isArray(raw.succession_risks) ? (raw.succession_risks as Record<string, unknown>[]) : [],
    departments: Array.isArray(raw.departments) ? (raw.departments as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(raw.business_packs) ? (raw.business_packs as Record<string, unknown>[]) : [],
    skills: Array.isArray(raw.skills) ? (raw.skills as string[]) : [],
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    companion: raw.companion as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as ExpertiseCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
  };
}
