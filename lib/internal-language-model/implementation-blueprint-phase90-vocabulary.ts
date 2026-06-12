export const IMPLEMENTATION_BLUEPRINT_PHASE90_MISSION =
  "Sustainable habits of learning, experimentation, and evolution through reflection and adaptation.";

export const IMPLEMENTATION_BLUEPRINT_PHASE90_PHILOSOPHY =
  "Progress not perfection — curious, humble, intentional evolution.";

export const IMPLEMENTATION_BLUEPRINT_PHASE90_ABOS_PRINCIPLE =
  "Meaningful evolution through learning together — improvement serves people and outcomes, not change for its own sake.";

export const IMPLEMENTATION_BLUEPRINT_PHASE90_VISION =
  "We are becoming better because we are willing to learn together.";

export const IMPLEMENTATION_BLUEPRINT_PHASE90_LEARNING_CYCLE =
  "Observe → Reflect → Experiment → Learn → Adapt → Repeat";

export const IMPLEMENTATION_BLUEPRINT_PHASE90_OBJECTIVE_KEYS = [
  "learning_habits",
  "improvement_discovery",
  "safe_experimentation",
  "organizational_evolution",
  "outcome_validation",
  "cross_engine_integration",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE90_IMPROVEMENT_QUESTIONS = [
  "🦉 Which patterns deserve preservation and reinforcement — what is the organization learning to keep?",
  "🌹 Where might small experiments reduce friction or strengthen outcomes — with curiosity, not criticism?",
  "❤️ What compassion and honesty help the team learn from imperfect improvement cycles?",
  "🔔 Which improvement efforts deserve acknowledgment — effort and learning, not only successful outcomes?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE90_COMPANION_GUIDANCE = [
  "🦉 Aipify noticed recurring support topics this month — would a gentle review of improvement opportunities help, without pressure to change everything at once?",
  "🌹 A small onboarding experiment could reduce early friction — Aipify can prepare a pilot outline for your review when you are ready.",
  "🔔 Your team completed an improvement review cycle — the learning matters even when the outcome is still in progress.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE90_EVOLUTION_MODES = ["maintain", "improve", "transform"] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE90_VISION_PHRASES = [
  "We are becoming better because we are willing to learn together.",
  "Progress not perfection — curious, humble, intentional evolution.",
  "Meaningful evolution not constant disruption.",
  "Observe → Reflect → Experiment → Learn → Adapt → Repeat.",
  "Curiosity not criticism — Aipify invites improvement, never pressures endless change.",
] as const;

export function getImplementationBlueprintPhase90Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE90_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE90_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE90_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE90_VISION,
    learningCycle: IMPLEMENTATION_BLUEPRINT_PHASE90_LEARNING_CYCLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE90_OBJECTIVE_KEYS,
    improvementQuestions: IMPLEMENTATION_BLUEPRINT_PHASE90_IMPROVEMENT_QUESTIONS,
    companionGuidance: IMPLEMENTATION_BLUEPRINT_PHASE90_COMPANION_GUIDANCE,
    evolutionModes: IMPLEMENTATION_BLUEPRINT_PHASE90_EVOLUTION_MODES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE90_VISION_PHRASES,
    engineRoute: "/app/continuous-improvement-engine",
    enginePhase: "A.33 + A.49",
    blueprintPhase: "Phase 90 — Continuous Improvement & Organizational Evolution Engine",
    marketplaceGovernanceDistinction:
      "Marketplace Governance & Quality repo Phase 90 at /app/marketplace-governance — repo phase number collision",
    presenceComfortDistinction:
      "Presence & Comfort Protocol Phase A.90 at /app/presence-comfort-protocol",
    growthEvolutionRoute: "/app/growth-evolution-engine",
    evolutionGovernanceRoute: "/app/evolution",
    innovationLabRoute: "/app/innovation-lab",
    organizationalMemoryRoute: "/app/organizational-memory-engine",
    learningEngineRoute: "/app/learning",
    executiveInsightsRoute: "/app/executive-insights-engine",
    communityRoute: "/app/community",
    capabilityMaturityRoute: "/app/capability-maturity-engine",
    organizationalHealthRoute: "/app/organizational-health-engine",
    selfLoveRoute: "/app/self-love-engine",
    limitationNote: "Meaningful evolution not constant disruption — avoid endless change and excessive optimization pressure.",
    trustNote: "No silent auto-implementation — humans approve all improvement initiatives and review cycles.",
  };
}
