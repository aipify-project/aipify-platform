import type { OrganizationalLearningCenter } from "./types";

export function parseOrganizationalLearningCenter(raw: Record<string, unknown>): OrganizationalLearningCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  const lessons = Array.isArray(raw.lessons)
    ? (raw.lessons as Record<string, unknown>[])
    : Array.isArray(raw.lessons_learned)
      ? (raw.lessons_learned as Record<string, unknown>[])
      : [];

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as OrganizationalLearningCenter["organization"],
    overview: raw.overview as OrganizationalLearningCenter["overview"],
    lessons,
    improvements: Array.isArray(raw.improvements) ? (raw.improvements as Record<string, unknown>[]) : [],
    successes: Array.isArray(raw.successes) ? (raw.successes as Record<string, unknown>[]) : [],
    reviews: Array.isArray(raw.reviews)
      ? (raw.reviews as Record<string, unknown>[])
      : Array.isArray(raw.retrospectives)
        ? (raw.retrospectives as Record<string, unknown>[])
        : [],
    patterns: Array.isArray(raw.patterns)
      ? (raw.patterns as Record<string, unknown>[])
      : Array.isArray(raw.repeated_mistakes)
        ? (raw.repeated_mistakes as Record<string, unknown>[])
        : [],
    library: Array.isArray(raw.library)
      ? (raw.library as Record<string, unknown>[])
      : Array.isArray(raw.learning_library)
        ? (raw.learning_library as Record<string, unknown>[])
        : [],
    opportunities: Array.isArray(raw.opportunities)
      ? (raw.opportunities as Record<string, unknown>[])
      : Array.isArray(raw.improvement_opportunities)
        ? (raw.improvement_opportunities as Record<string, unknown>[])
        : [],
    department_scores: Array.isArray(raw.department_scores) ? (raw.department_scores as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(raw.business_packs) ? (raw.business_packs as Record<string, unknown>[]) : [],
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    recommendations: Array.isArray(raw.recommendations) ? (raw.recommendations as Record<string, unknown>[]) : [],
    companion: raw.companion as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as OrganizationalLearningCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
  };
}
