import type { DecisionMemoryCenter } from "./types";

export function parseDecisionMemoryCenter(raw: Record<string, unknown>): DecisionMemoryCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  const decisions = Array.isArray(raw.decisions)
    ? (raw.decisions as Record<string, unknown>[])
    : Array.isArray(raw.decision_registry)
      ? (raw.decision_registry as Record<string, unknown>[])
      : [];

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as DecisionMemoryCenter["organization"],
    overview: raw.overview as DecisionMemoryCenter["overview"],
    decisions,
    decision_registry: decisions,
    approvals: Array.isArray(raw.approvals) ? (raw.approvals as Record<string, unknown>[]) : [],
    outcomes: Array.isArray(raw.outcomes) ? (raw.outcomes as Record<string, unknown>[]) : [],
    lessons: Array.isArray(raw.lessons) ? (raw.lessons as Record<string, unknown>[]) : [],
    reviews: Array.isArray(raw.reviews) ? (raw.reviews as Record<string, unknown>[]) : [],
    patterns: Array.isArray(raw.patterns) ? (raw.patterns as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(raw.business_packs) ? (raw.business_packs as Record<string, unknown>[]) : [],
    decision_health: raw.decision_health as Record<string, unknown>,
    knowledge_base: raw.knowledge_base as Record<string, unknown>,
    executive_briefings: raw.executive_briefings as Record<string, unknown>,
    companion: raw.companion as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as DecisionMemoryCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
  };
}
