export const IMPLEMENTATION_BLUEPRINT_PHASE78_MISSION =
  "Evaluate significant decisions through collaborative exploration, structured simulations, and thoughtful reflection.";

export const IMPLEMENTATION_BLUEPRINT_PHASE78_PHILOSOPHY =
  "Strongest decisions emerge through exploration, dialogue, and multiple perspectives — objective is wiser decision-making, NOT certainty.";

export const IMPLEMENTATION_BLUEPRINT_PHASE78_ABOS_PRINCIPLE =
  "Simulation improves understanding before action — wisdom emerges through exploration.";

export const IMPLEMENTATION_BLUEPRINT_PHASE78_CORE_RULE =
  "Simulation predicts. Simulation never acts.";

export const IMPLEMENTATION_BLUEPRINT_PHASE78_OBJECTIVE_KEYS = [
  "strategic_experimentation",
  "decision_preparation",
  "cross_functional_exploration",
  "scenario_comparison",
  "consequence_awareness",
  "leadership_learning",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE78_DECISION_LAB_ENVIRONMENTS = [
  "international_expansion",
  "new_product_line",
  "department_restructure",
  "strategic_investment",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE78_SIMULATION_INPUT_KEYS = [
  "strategic_priorities",
  "org_structures",
  "resource_assumptions",
  "market_conditions",
  "operational_constraints",
  "organizational_knowledge",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE78_SCENARIO_KEYS = [
  "scenario_a",
  "scenario_b",
  "scenario_c",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE78_COMPANION_GUIDANCE = [
  "🦉 The assumptions behind this decision deserve examination — shall I summarize what influences the simulation?",
  "🌹 Exploring this scenario may strengthen resilience — worth discussing with leadership before committing.",
  "🔔 Unintended consequences in this scenario deserve discussion — would a cross-functional review help?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE78_REFLECTION_PROMPTS = [
  "What worked in this exploration?",
  "Which assumptions proved most valuable?",
  "What concerns emerged that deserve follow-up?",
  "What opportunities became visible through comparison?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE78_VISION_PHRASES = [
  "We explored this thoroughly before moving forward.",
  "Thoughtful, disciplined, human-centered decision-making.",
  "Wisdom emerges through exploration — simulation never acts.",
  "Thoughtful leaders explore before committing.",
  "Simulation improves understanding before action.",
] as const;

export function getImplementationBlueprintPhase78Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE78_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE78_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE78_ABOS_PRINCIPLE,
    coreRule: IMPLEMENTATION_BLUEPRINT_PHASE78_CORE_RULE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE78_OBJECTIVE_KEYS,
    decisionLabEnvironments: IMPLEMENTATION_BLUEPRINT_PHASE78_DECISION_LAB_ENVIRONMENTS,
    simulationInputKeys: IMPLEMENTATION_BLUEPRINT_PHASE78_SIMULATION_INPUT_KEYS,
    scenarioKeys: IMPLEMENTATION_BLUEPRINT_PHASE78_SCENARIO_KEYS,
    companionGuidance: IMPLEMENTATION_BLUEPRINT_PHASE78_COMPANION_GUIDANCE,
    reflectionPrompts: IMPLEMENTATION_BLUEPRINT_PHASE78_REFLECTION_PROMPTS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE78_VISION_PHRASES,
    engineRoute: "/app/simulations",
    enginePhase: "Phase 78",
    blueprintPhase: "Phase 78 — Simulation & Decision Lab Engine",
    phase22Layer: "Blueprint Phase 22 — _sdlbp_* decision comparison framework",
    phase76Layer: "Blueprint Phase 76 — _ssbp_* scenario simulation and multiple futures",
    dseDistinction: "Decision Support Engine Blueprint Phase 60 — reflection scaffolding at /app/assistant/decisions",
    orgDecisionDistinction: "Organizational Decision Support A.54 — org-level decision workflows",
    innovationLabDistinction: "Innovation Lab Phase 96 — controlled experiments at /app/innovation-lab",
    resilienceDistinction: "Organizational Resilience A.50 — crisis scenario planning cross-link",
    digitalTwinDistinction: "Digital Twin Blueprint Phase 77 — read-only context at /app/digital-twin-engine",
    executiveOpsDistinction: "Executive Operations Blueprint Phase 75 — situational awareness cross-link",
    selfLoveJourneyPhrase: "Thoughtful leaders explore before committing.",
    limitationPrinciple: "Exploration not certainty — no guarantees, no simple scores, simulation never acts.",
  };
}
