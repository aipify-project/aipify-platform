import type { EmployeeAnswer, EmployeeKnowledgeCenter } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asStringArray(value: unknown): string[] {
  return asArray<unknown>(value).filter((v): v is string => typeof v === "string");
}

export function parseEmployeeKnowledgeCenter(data: unknown): EmployeeKnowledgeCenter {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    user_role: typeof d.user_role === "string" ? d.user_role : undefined,
    settings: d.settings as EmployeeKnowledgeCenter["settings"],
    health: d.health as EmployeeKnowledgeCenter["health"],
    business_dna_health: d.business_dna_health as Record<string, unknown>,
    knowledge_items: asArray(d.knowledge_items),
    pending_approval: asArray(d.pending_approval),
    most_viewed: asArray(d.most_viewed),
    knowledge_gaps: asArray(d.knowledge_gaps),
    permissions: asArray(d.permissions),
    sources: asArray(d.sources),
    onboarding: d.onboarding as Record<string, unknown>,
    recent_updates: asArray(d.recent_updates),
    audit_log: asArray(d.audit_log),
    categories: asArray(d.categories) as EmployeeKnowledgeCenter["categories"],
    ethical_principles: asStringArray(d.ethical_principles),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    integrations: d.integrations as Record<string, string>,
  };
}

export function parseEmployeeAnswer(data: unknown): EmployeeAnswer {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: typeof d.enabled === "boolean" ? d.enabled : undefined,
    question: typeof d.question === "string" ? d.question : undefined,
    answer: typeof d.answer === "string" ? d.answer : undefined,
    title: typeof d.title === "string" ? d.title : undefined,
    category: typeof d.category === "string" ? d.category : undefined,
    confidence_score: typeof d.confidence_score === "number" ? d.confidence_score : undefined,
    confidence_level: d.confidence_level as EmployeeAnswer["confidence_level"],
    steps: asArray(d.steps),
    source_reference:
      typeof d.source_reference === "string" || d.source_reference === null
        ? (d.source_reference as string | null)
        : undefined,
    related: asArray(d.related),
    escalate_recommended:
      typeof d.escalate_recommended === "boolean" ? d.escalate_recommended : undefined,
    ethical_note: typeof d.ethical_note === "string" ? d.ethical_note : undefined,
    supporting_documentation: asStringArray(d.supporting_documentation),
  };
}
