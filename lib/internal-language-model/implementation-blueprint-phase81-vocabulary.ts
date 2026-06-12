export const IMPLEMENTATION_BLUEPRINT_PHASE81_MISSION =
  "Strengthen resilience by increasing risk awareness while supporting balanced confident decision-making.";

export const IMPLEMENTATION_BLUEPRINT_PHASE81_PHILOSOPHY =
  "Absence of risk does not guarantee success — avoiding every risk avoids meaningful opportunities. Wisdom means understanding which risks deserve attention and responsible preparation.";

export const IMPLEMENTATION_BLUEPRINT_PHASE81_ABOS_PRINCIPLE =
  "Extraordinary organizations navigate uncertainty thoughtfully — not defined by absence of risk. Aipify informs and prepares; humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE81_OBJECTIVE_KEYS = [
  "risk_awareness",
  "preparedness_planning",
  "balanced_decision_making",
  "cross_functional_visibility",
  "leadership_confidence",
  "organizational_resilience",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE81_RISK_CATEGORY_KEYS = [
  "operational",
  "strategic",
  "people",
  "technology",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE81_RISK_QUESTIONS = [
  "Which critical assumptions underpin this plan — and what would change if they shifted?",
  "What early warning signals might indicate conditions are changing?",
  "If conditions change, what preparedness would reduce disruption?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE81_COMPANION_EXAMPLES = [
  "🦉 Some dependencies may deserve attention — would a preparedness summary help leadership review?",
  "🌹 Existing strengths may mitigate several concerns — would highlighting resilience indicators help balanced planning?",
  "🔔 Contingency planning often strengthens resilience — shall I outline preparedness considerations for review?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE81_LIMITATIONS = [
  "No fear-based communication",
  "No catastrophic interpretations",
  "No uncertainty as inevitability",
  "Preparedness not alarm",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE81_VISION_PHRASES = [
  "We cannot eliminate uncertainty, but we are increasingly prepared to navigate it together.",
  "Uncertainty with wisdom, courage, and preparedness.",
  "Preparedness often reduces fear more effectively than avoidance.",
  "Awareness not anxiety — humans decide; Aipify informs and prepares.",
  "Balanced opportunity pursuit with responsible risk attention.",
] as const;

export function getImplementationBlueprintPhase81Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE81_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE81_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE81_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE81_OBJECTIVE_KEYS,
    riskCategoryKeys: IMPLEMENTATION_BLUEPRINT_PHASE81_RISK_CATEGORY_KEYS,
    riskQuestions: IMPLEMENTATION_BLUEPRINT_PHASE81_RISK_QUESTIONS,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE81_COMPANION_EXAMPLES,
    limitations: IMPLEMENTATION_BLUEPRINT_PHASE81_LIMITATIONS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE81_VISION_PHRASES,
    engineRoute: "/app/organizational-resilience-engine",
    enginePhase: "Phase A.50 / ABOS Resilience Engine",
    blueprintPhase: "Phase 81 — Risk Navigation Engine",
    strategyRoute: "/app/strategy",
    strategyDistinction: "Legacy Strategic Intelligence & Opportunity repo Phase 81 — cross-link only",
    strategicIntelligenceRoute: "/app/strategic-intelligence-foundation-engine",
    strategicIntelligenceDistinction: "Strategic Intelligence Blueprint Phase 79 — cross-link only",
    growthRoute: "/app/growth-evolution-engine",
    growthDistinction: "Growth & Evolution A.81 — post-adversity learning cross-link",
    continuityRoute: "/app/continuity",
    continuityDistinction: "Continuity Phase 80 / Blueprint Phase 73 — backup ownership and incident mode",
    securityRoute: "/app/security-trust-engine",
    securityDistinction: "Security & Trust A.18 / Blueprint Phase 30 — security transparency",
    incidentRoute: "/app/incident-response-coordination-engine",
    incidentDistinction: "Incident Response A.51 — coordinated response, distinct from risk awareness",
    predictiveRoute: "/app/predictive-insights-engine",
    predictiveDistinction: "Predictive Operations Blueprint Phase 74 — forecasts cross-link",
    curiosityRoute: "/app/curiosity-discovery-engine",
    curiosityDistinction: "Opportunity Exploration Blueprint Phase 80 — risk/opportunity balance",
    simulationRoute: "/app/simulations",
    simulationDistinction: "Simulation Decision Lab Phase 78 — safe scenario modeling",
    selfLoveRoute: "/app/self-love-engine",
    journeyPhrase: "Preparedness often reduces fear more effectively than avoidance.",
    selfLoveBoundary:
      "Self Love supports sustainable leadership reflection — principle only; Risk Navigation stores metadata.",
    preparednessNote: "Preparedness not alarm — uncertainty navigable with wisdom and courage.",
    helperPrefix: "_rnbp_*",
    engineHelperPrefix: "_ore_* — do not collide",
  };
}
