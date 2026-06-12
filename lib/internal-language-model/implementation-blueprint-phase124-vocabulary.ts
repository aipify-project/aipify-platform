export const IMPLEMENTATION_BLUEPRINT_PHASE124_MISSION =
  "Help organizations understand complex living systems — visibility, simulation, and institutional understanding that strengthen decision quality and resilience without prediction or surveillance.";

export const IMPLEMENTATION_BLUEPRINT_PHASE124_PHILOSOPHY =
  "Complex living systems deserve visibility and simulation — understanding NOT prediction. The Twin is a mirror, not a replacement. Wisdom before speed. People First.";

export const IMPLEMENTATION_BLUEPRINT_PHASE124_ABOS_PRINCIPLE =
  "Organizational Digital Twin reflects how work flows through people, processes, companions, and governance. Aipify informs and prepares; humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE124_OBJECTIVE_KEYS = [
  "system_relationships",
  "visualize_dynamics",
  "explore_consequences",
  "decision_quality",
  "resilience_planning",
  "reduce_unintended_outcomes",
  "organizational_learning",
  "institutional_understanding",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE124_COMPANION_LIMITATIONS = [
  "No predictive certainty",
  "No context-free recommendations",
  "No replacing judgment",
  "No ignoring human considerations",
  "No concealed uncertainty",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE124_VISION_PHRASES = [
  "The Twin is a mirror — not a replacement.",
  "Visibility and simulation — understanding not prediction.",
  "Wisdom before speed. People First.",
  "Models responsibilities — not people.",
  "Explore complexity with curiosity and discipline.",
] as const;

export function getImplementationBlueprintPhase124Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE124_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE124_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE124_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE124_OBJECTIVE_KEYS,
    companionLimitations: IMPLEMENTATION_BLUEPRINT_PHASE124_COMPANION_LIMITATIONS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE124_VISION_PHRASES,
    engineRoute: "/app/digital-twin",
    enginePhase: "Phase 77 Digital Twin & Organizational Model Engine",
    blueprintPhase: "Phase 124 — Organizational Digital Twin Engine",
    era: "Enterprise Intelligence Era (121–130)",
    simulationsRoute: "/app/simulations",
    simulationsDistinction: "Simulation Lab Phase 78 — Twin provides read-only context; reflection not certainty",
    executiveIntelligenceRoute: "/app/executive-intelligence",
    executiveIntelligenceDistinction: "Executive Intelligence Phase 121 — leadership context cross-link",
    strategicForesightRoute: "/app/strategic-foresight-engine",
    strategicForesightDistinction: "Strategic Foresight Phase 122 — foresight not prediction",
    boardGovernanceRoute: "/app/governance-policy-engine",
    boardGovernanceDistinction: "Board Governance Phase 123 — governance connections cross-link",
    orgMemoryRoute: "/app/organizational-memory-engine",
    orgMemoryDistinction: "Organizational Memory A.34 — Twin memory cross-link",
    ecosystemRoute: "/app/ecosystem",
    ecosystemDistinction: "Ecosystem Intelligence Phase 88 — external relationships cross-link",
    ecosystemOrchestrationRoute: "/app/ecosystem-orchestration",
    ecosystemOrchestrationDistinction: "Ecosystem Orchestration Phase 120 — collective evolution cross-link",
    selfLoveRoute: "/app/self-love-engine",
    journeyPhrase: "No organization thrives when a few individuals carry everything alone.",
    phase77Distinction:
      "Phase 124 layers on Phase 77 + Blueprint 77 — same route /app/digital-twin, not duplicate product",
    twinModelsResponsibilities:
      "The Twin models responsibilities — NOT people. No surveillance, no individual scoring.",
    helperPrefix: "_odtbp124_*",
    phase77HelperPrefix: "_odtbp_*",
    engineHelperPrefix: "_dtw_*",
  };
}
