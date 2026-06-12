export const IMPLEMENTATION_BLUEPRINT_PHASE22_MISSION =
  "Safe environment to explore decisions before committing resources — what happens if we choose this path?";

export const IMPLEMENTATION_BLUEPRINT_PHASE22_PHILOSOPHY =
  "Experience is valuable; foresight is powerful — do not learn every lesson the hard way.";

export const IMPLEMENTATION_BLUEPRINT_PHASE22_ABOS_PRINCIPLE =
  "Preparation reduces uncertainty — perspective strengthens decisions.";

export const IMPLEMENTATION_BLUEPRINT_PHASE22_CORE_RULE =
  "Simulation predicts. Simulation never acts.";

export const IMPLEMENTATION_BLUEPRINT_PHASE22_SIMULATION_OBJECTIVE_KEYS = [
  "scenario_planning",
  "operational_simulations",
  "strategic_simulations",
  "resource_allocation",
  "decision_comparisons",
  "risk_awareness",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE22_SIMULATION_DOMAINS = [
  "support",
  "operational",
  "strategic",
  "knowledge",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE22_VISION_PHRASES = [
  "Trusted lab for exploring possibilities — ask difficult questions safely before committing resources.",
  "Empowered to test ideas without production risk — simulation predicts, simulation never acts.",
  "Preparation reduces uncertainty — perspective strengthens decisions.",
  "Experience is valuable; foresight is powerful — do not learn every lesson the hard way.",
  "Humans decide — Aipify helps think clearly with visible assumptions and acknowledged uncertainty.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE22_COMPANION_EXAMPLES = [
  "🦉 If support volume doubles, simulation suggests backlog growth — worth reviewing before hiring decisions.",
  "🌹 Option A builds on your existing automation coverage — lower risk and faster time-to-value.",
  "🔔 Adding a secondary approver reduces congestion without increasing compliance risk.",
  "🦉 Simulations cannot predict every outcome — but exploring assumptions now reduces fear of uncertainty.",
] as const;

export function getImplementationBlueprintPhase22Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE22_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE22_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE22_ABOS_PRINCIPLE,
    coreRule: IMPLEMENTATION_BLUEPRINT_PHASE22_CORE_RULE,
    simulationObjectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE22_SIMULATION_OBJECTIVE_KEYS,
    simulationDomains: IMPLEMENTATION_BLUEPRINT_PHASE22_SIMULATION_DOMAINS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE22_VISION_PHRASES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE22_COMPANION_EXAMPLES,
    engineRoute: "/app/simulations",
    enginePhase: "Phase 78",
    blueprintPhase: "Phase 22 — Simulation & Decision Lab",
    orgDecisionDistinction: "Organizational Decision Support A.54 — org-level decision workflows, distinct from simulation forecasting",
    assistantDecisionDistinction: "Decision Support Engine assistant — personal guidance at /app/assistant/decisions",
    resilienceDistinction: "Organizational Resilience A.48 — tabletop exercises, not operational forecasting",
    digitalTwinDistinction: "Digital Twin Phase 77 — read-only context for runs, no production mutations",
    selfLoveBoundary: "Self Love supports thoughtful pacing — principle only; Simulation Lab stores metadata, not wellbeing content.",
  };
}
