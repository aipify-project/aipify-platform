export const IMPLEMENTATION_BLUEPRINT_PHASE60_MISSION =
  "Help people navigate important decisions with clarity — structure, perspective, and context. Humans decide; Aipify supports.";

export const IMPLEMENTATION_BLUEPRINT_PHASE60_PHILOSOPHY =
  "Decision support means clarity before choosing — not certainty. Aipify structures options, surfaces trade-offs, and highlights risks so people can reflect intentionally before acting.";

export const IMPLEMENTATION_BLUEPRINT_PHASE60_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) objective is clarity before choosing — structure, perspective, and context; humans retain final authority.";

export const IMPLEMENTATION_BLUEPRINT_PHASE60_OBJECTIVE_KEYS = [
  "decision_preparation",
  "option_evaluation",
  "trade_off_awareness",
  "risk_identification",
  "scenario_consideration",
  "reflection_before_action",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE60_FRAMEWORK_QUESTIONS = [
  "What problem are we trying to solve?",
  "What options are available?",
  "What assumptions are we making?",
  "What risks should we consider?",
  "What would success look like?",
  "What if we do nothing?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE60_DECISION_TYPE_KEYS = [
  "operational",
  "strategic",
  "personal",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE60_OPTION_EXAMPLES = [
  "🦉 Option A protects focus time this week; Option B maintains responsiveness — both have trade-offs; you decide.",
  "🌹 One path advances your stated goal; the other addresses an urgent operational need — reflection may help.",
  "🔔 Delaying this decision reduces short-term pressure but may affect the renewal window.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE60_VISION_PHRASES = [
  "Clarity before choosing — structure, perspective, and context.",
  "Humans decide — Aipify advises with explainability on every recommendation.",
  "Good decisions can still produce difficult outcomes — self-compassion matters.",
  "Risk awareness strengthens preparation — not paralysis.",
  "Reflection before action — intentional choices over reactive urgency.",
] as const;

export function getImplementationBlueprintPhase60Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE60_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE60_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE60_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE60_OBJECTIVE_KEYS,
    frameworkQuestions: IMPLEMENTATION_BLUEPRINT_PHASE60_FRAMEWORK_QUESTIONS,
    decisionTypeKeys: IMPLEMENTATION_BLUEPRINT_PHASE60_DECISION_TYPE_KEYS,
    optionExamples: IMPLEMENTATION_BLUEPRINT_PHASE60_OPTION_EXAMPLES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE60_VISION_PHRASES,
    engineRoute: "/app/assistant/decisions",
    enginePhase: "Phase 38 Decision Support Engine",
    blueprintPhase: "Phase 60 — Decision Support Engine",
    orgDecisionDistinction:
      "Organizational Decision Support A.54 — org-wide structured decisions at /app/organizational-decision-support-engine",
    briefingDistinction:
      "Briefing System repo Phase 60 — Since Last Login briefings (20260614900000_briefing_system_phase60.sql)",
    qualityGuardianDistinction: "Quality Guardian Phases 58–59 — operational quality at /app/quality",
    simulationDistinction:
      "Simulation Decision Lab Blueprint Phase 22 — scenario forecasting at /app/simulations",
    selfLoveRoute: "/app/self-love-engine",
    trustActionRoute: "/app/approvals",
    goalsRoute: "/app/assistant/goals",
    attentionRoute: "/app/assistant/attention",
    contextRoute: "/app/assistant/context",
    executiveInsightsRoute: "/app/executive-insights-engine",
    selfLoveBoundary:
      "Self Love supports reflection and self-compassion — principle only; DSE stores decision metadata, not wellbeing content.",
  };
}
