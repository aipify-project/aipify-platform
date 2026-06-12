export const IMPLEMENTATION_BLUEPRINT_PHASE126_MISSION =
  "Preserve organizational wisdom — decisions, experiences, principles, and stories — so continuity strengthens identity and future actions become wiser.";

export const IMPLEMENTATION_BLUEPRINT_PHASE126_PHILOSOPHY =
  "Organizations forget — memory is an asset, not an accident. Wisdom before speed. People First. Humans are custodians of legacy.";

export const IMPLEMENTATION_BLUEPRINT_PHASE126_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) preserves what shaped the organization. Knowledge tells us what we know; memory reminds us who we have become.";

export const IMPLEMENTATION_BLUEPRINT_PHASE126_VISION =
  "Organizations should not have to relearn the same lessons — experience deserves preservation, reflection creates wisdom.";

export const IMPLEMENTATION_BLUEPRINT_PHASE126_OBJECTIVE_KEYS = [
  "preserve_wisdom",
  "protect_knowledge",
  "continuity",
  "onboarding",
  "succession",
  "transformation_stories",
  "reduce_repeated_mistakes",
  "organizational_identity",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE126_MEMORY_CENTER = [
  "memory_archives",
  "legacy_records",
  "knowledge_preservation",
  "transformation_histories",
  "leadership_continuity",
  "decision_histories",
  "milestone_tracking",
  "succession_support",
  "institutional_storytelling",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE126_COMPANION_LIMITATIONS = [
  "no_altering_records",
  "no_suppress_perspectives",
  "no_fictional_narratives",
  "no_distort_memory",
  "no_replace_interpretation",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE126_MEMORY_DISCOVERY = [
  "🦉 Have we solved something like this before?",
  "🌹 What actually happened — not only what was planned?",
  "❤️ Who contributed wisdom worth honoring?",
  "🔔 What lessons emerged that future teams should know?",
  "🦉 What assumptions turned out to be inaccurate?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE126_SUCCESS_METRICS = [
  "wisdom_preservation",
  "knowledge_continuity",
  "succession_readiness",
  "onboarding_acceleration",
  "reduced_repeated_mistakes",
  "institutional_identity",
  "heritage_engagement",
  "governed_retention_health",
] as const;

export function getImplementationBlueprintPhase126Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE126_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE126_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE126_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE126_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE126_OBJECTIVE_KEYS,
    memoryCenterKeys: IMPLEMENTATION_BLUEPRINT_PHASE126_MEMORY_CENTER,
    companionLimitations: IMPLEMENTATION_BLUEPRINT_PHASE126_COMPANION_LIMITATIONS,
    memoryDiscoveryQuestions: IMPLEMENTATION_BLUEPRINT_PHASE126_MEMORY_DISCOVERY,
    successMetrics: IMPLEMENTATION_BLUEPRINT_PHASE126_SUCCESS_METRICS,
    engineRoute: "/app/organizational-memory-engine",
    enginePhase: "A.34",
    blueprintPhase: "Phase 126 — Organizational Memory & Legacy Engine",
    era: "Enterprise Intelligence Era (121–130)",
    legacyEngineRoute: "/app/legacy-engine",
    phase94Distinction:
      "Blueprint Phase 94 established unified memory + legacy framing — Phase 126 layers on top; all _omlebp94_* fields preserved.",
    phase55Distinction:
      "Blueprint Phase 55 Memory Continuity on same route — all _mcebp_* fields preserved.",
  };
}
