export const IMPLEMENTATION_BLUEPRINT_PHASE137_MISSION =
  "Bring human and companion perspectives together in collective council deliberation — expanding awareness, surfacing disagreement respectfully, and documenting transparent rationale while humans retain full decision authority.";

export const IMPLEMENTATION_BLUEPRINT_PHASE137_PHILOSOPHY =
  "People First. Wisdom before speed. Collective wisdom not consensus at all costs. Companions expand awareness — they do not vote. Transparency builds trust. Growth Partner terminology — never Affiliate.";

export const IMPLEMENTATION_BLUEPRINT_PHASE137_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — Collective Decision Council orchestrates workspaces, perspectives, companion advisory, stakeholder mapping, and council memory. Decision Intelligence and ODSE remain authoritative for their domains.";

export const IMPLEMENTATION_BLUEPRINT_PHASE137_VISION =
  "Organizations make wiser collective decisions — respectful disagreement, companion-expanded awareness, transparent rationale, and institutional memory that honors human judgment.";

export const IMPLEMENTATION_BLUEPRINT_PHASE137_OBJECTIVE_KEYS = [
  "collective_perspectives",
  "respectful_disagreement",
  "stakeholder_awareness",
  "companion_advisory",
  "decision_transparency",
  "council_memory",
  "governance_integration",
  "human_accountability",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE137_COUNCIL_CENTER = [
  "decision_workspaces",
  "perspective_collection",
  "companion_contributions",
  "executive_reviews",
  "governance_integration",
  "stakeholder_mapping",
  "reflection_sessions",
  "decision_histories",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE137_COMPANION_LIMITATIONS = [
  "no_voting",
  "no_governance_override",
  "no_false_certainty",
  "no_suppressing_dissent",
  "no_replacing_accountability",
] as const;

export function getImplementationBlueprintPhase137Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE137_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE137_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE137_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE137_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE137_OBJECTIVE_KEYS,
    councilCenterCapabilities: IMPLEMENTATION_BLUEPRINT_PHASE137_COUNCIL_CENTER,
    companionLimitations: IMPLEMENTATION_BLUEPRINT_PHASE137_COMPANION_LIMITATIONS,
    engineRoute: "/app/collective-decision-council-engine",
    enginePhase: "Repo Phase 137 — Collective Decision & Human-Companion Council Engine",
    blueprintPhase: "Phase 137 — Collective Decision & Human-Companion Council",
    autonomousOrganizationEra: "Autonomous Organization Era (131–140)",
    decisionIntelligenceDistinction:
      "Decision Intelligence Phase 125 at /app/decision-intelligence-engine — cross-link only, never duplicate _dein_*",
    odseDistinction:
      "Organizational Decision Support A.54 at /app/organizational-decision-support-engine — cross-link only, never duplicate _odse_*",
    companionsDoNotVote: "Companions advise — they do not vote",
    metadataOnly: "Metadata only — no raw sensitive decision content or PII",
    growthPartnerNotAffiliate: "Growth Partner terminology — never Affiliate",
  };
}
