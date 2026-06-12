export const IMPLEMENTATION_BLUEPRINT_PHASE71_MISSION =
  "Unified knowledge fabric spanning the enterprise — continuity, decision-making, and operational effectiveness.";

export const IMPLEMENTATION_BLUEPRINT_PHASE71_PHILOSOPHY =
  "Hidden knowledge loses value. The right people need the right information at the right time — wisdom when it is actionable, not overload.";

export const IMPLEMENTATION_BLUEPRINT_PHASE71_ABOS_PRINCIPLE =
  "Knowledge surviving beyond roles becomes strategic advantage. Aipify informs and prepares; humans decide what to share and publish.";

export const IMPLEMENTATION_BLUEPRINT_PHASE71_OBJECTIVE_KEYS = [
  "knowledge_unification",
  "contextual_retrieval",
  "cross_system_understanding",
  "knowledge_governance",
  "organizational_continuity",
  "actionable_intelligence",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE71_DISCOVERY_SIGNALS = [
  "🦉 Relevant resources — contextual retrieval of published articles and FAQs",
  "🌹 Similar documented situations — related content from category metadata",
  "🔔 Articles needing review — stale content and draft queue surfaced for humans",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE71_GAP_TYPES = [
  "🦉 Recurring questions need documentation — support gap metadata only",
  "🌹 Undocumented practices — workflow changes without playbook updates",
  "🔔 Knowledge concentration risks — critical topics with few authors",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE71_VISION_PHRASES = [
  "We know more than we realized, and we can now access that knowledge when it matters most.",
  "Knowledge flows freely, responsibly, and meaningfully across the enterprise.",
  "The right people receive the right information at the right time.",
  "Hidden knowledge loses value — shared knowledge becomes strategic advantage.",
  "Understanding, not overload — wisdom when it is actionable.",
] as const;

export function getImplementationBlueprintPhase71Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE71_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE71_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE71_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE71_OBJECTIVE_KEYS,
    discoverySignals: IMPLEMENTATION_BLUEPRINT_PHASE71_DISCOVERY_SIGNALS,
    gapTypes: IMPLEMENTATION_BLUEPRINT_PHASE71_GAP_TYPES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE71_VISION_PHRASES,
    engineRoute: "/app/knowledge-center-engine",
    enginePhase: "Phase A.5",
    blueprintPhase: "Phase 71 — Enterprise Knowledge Fabric Engine",
    crossTenantIntelligenceRoute: "/app/cross-tenant-intelligence-engine",
    crossTenantIntelligenceDistinction:
      "Cross-Tenant Intelligence A.71 — platform-scoped; repo phase number collision with Blueprint Phase 71",
    kcSelfKnowledgeRoute: "/app/knowledge-center",
    kcSelfKnowledgeDistinction: "KC Phase 55 — Aipify product self-knowledge, not tenant organizational fabric",
    organizationalMemoryRoute: "/app/organizational-memory-engine",
    organizationalMemoryDistinction:
      "Organizational Memory A.34 — Blueprint Phase 55 memory continuity cross-link",
    employeeKnowledgeRoute: "/app/settings/employee-knowledge",
    employeeKnowledgeDistinction: "Employee Knowledge EKE Phase 41 — role-based internal guidance",
    businessDnaRoute: "/app/settings/business-dna",
    businessDnaDistinction: "Business DNA — support templates and tone, distinct from KC articles",
    wisdomEngineRoute: "/app/wisdom-engine",
    wisdomEngineDistinction: "Wisdom Engine A.93 — interventions distinct from fabric retrieval",
    selfLoveRoute: "/app/self-love-engine",
    journeyPhrase: "Knowledge shared generously benefits everyone.",
    selfLoveBoundary:
      "Self Love supports sustainable documentation pace — not perfectionism or guilt-based motivation.",
    metadataNote: "Fabric signals are metadata only — no raw support chat, email, or customer content.",
  };
}
