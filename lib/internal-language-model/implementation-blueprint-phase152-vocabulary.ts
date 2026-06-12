export const IMPLEMENTATION_BLUEPRINT_PHASE152_MISSION =
  "Prepare organizations for continuity through knowledge stewardship — preserving critical wisdom, supporting leadership transitions, and strengthening institutional memory without rigid bureaucracy or fear of change.";

export const IMPLEMENTATION_BLUEPRINT_PHASE152_PHILOSOPHY =
  "Thoughtful preparation — not fear of change. Growth Partner not Affiliate. People First. Stewardship through responsibility. Legacy Companion supports preparedness; humans retain executive judgment.";

export const IMPLEMENTATION_BLUEPRINT_PHASE152_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — Organizational Legacy & Succession Intelligence extends institutional memory with succession scaffolds and critical knowledge registries — metadata only; companions inform and prepare, never choose successors.";

export const IMPLEMENTATION_BLUEPRINT_PHASE152_VISION =
  "Organizations should transition leadership with clarity and generosity — preserving what matters, preparing who comes next, and honoring contributions that endure across generations.";

export const IMPLEMENTATION_BLUEPRINT_PHASE152_OBJECTIVE_KEYS = [
  "succession_preparedness",
  "knowledge_preservation",
  "leadership_transition",
  "executive_legacy",
  "continuity_readiness",
  "institutional_memory",
  "organizational_storytelling",
  "stewardship_programs",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE152_LEGACY_CENTER = [
  "succession_planning_scaffolds",
  "knowledge_preservation",
  "leadership_transition_frameworks",
  "executive_legacy_reviews",
  "critical_role_mapping",
  "continuity_dashboards",
  "stewardship_programs",
  "institutional_memory_libraries",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE152_COMPANION_LIMITATIONS = [
  "no_determine_succession",
  "no_replace_executive_judgment",
  "no_suppress_pathways",
  "no_reveal_confidential_succession",
  "no_override_governance",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE152_CONTINUITY_DIMENSIONS = [
  "leadership_continuity",
  "knowledge_continuity",
  "operational_continuity",
  "governance_continuity",
  "gp_continuity",
  "customer_relationship_continuity",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE152_VISION_PHRASES = [
  "Prepare for continuity through knowledge stewardship",
  "Thoughtful preparation — not fear of change",
  "Honor contributions that endure",
  "Humans decide; Aipify informs and prepares",
  "Growth Partner not Affiliate — stewardship through responsibility",
] as const;

export function getImplementationBlueprintPhase152Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE152_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE152_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE152_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE152_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE152_OBJECTIVE_KEYS,
    legacyCenterKeys: IMPLEMENTATION_BLUEPRINT_PHASE152_LEGACY_CENTER,
    companionLimitations: IMPLEMENTATION_BLUEPRINT_PHASE152_COMPANION_LIMITATIONS,
    continuityDimensions: IMPLEMENTATION_BLUEPRINT_PHASE152_CONTINUITY_DIMENSIONS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE152_VISION_PHRASES,
    engineRoute: "/app/organizational-memory-engine",
    enginePhase: "A.34",
    blueprintPhase: "Phase 152 — Organizational Legacy & Succession Intelligence Engine",
    era: "Legacy & Future Stewardship Era (151–160)",
    futureLeadersRoute: "/app/future-leaders-engine",
    legacyEngineRoute: "/app/legacy-engine",
    phase126Distinction:
      "Enterprise Intelligence Phase 126 established memory archives and succession scaffolding — Phase 152 layers Legacy & Future Stewardship depth; all _omlebp126_* fields preserved.",
    noSuccessorRanking:
      "Legacy Companion does NOT choose successors, rank individuals, or reveal confidential succession information in default UI.",
  };
}
