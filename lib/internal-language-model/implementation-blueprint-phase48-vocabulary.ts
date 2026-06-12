export const IMPLEMENTATION_BLUEPRINT_PHASE48_MISSION =
  "Help independent Sales Experts see revenue, goals, capacity, and service obligations clearly — so they can build sustainable Aipify businesses.";

export const IMPLEMENTATION_BLUEPRINT_PHASE48_PHILOSOPHY =
  "Operational visibility supports planning. Forecasts inform; they never pressure. You operate your own business — Aipify augments awareness.";

export const IMPLEMENTATION_BLUEPRINT_PHASE48_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) partners thrive with honest metadata, sustainable pacing, and human judgment — not automated business management.";

export const IMPLEMENTATION_BLUEPRINT_PHASE48_OBJECTIVE_KEYS = [
  "revenue_visibility",
  "goal_management",
  "capacity_awareness",
  "forecasting_support",
  "service_tracking",
  "operational_awareness",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE48_GOAL_KEYS = [
  "monthly_new_customers",
  "monthly_revenue_aspiration",
  "certification_progress",
  "learning_sessions",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE48_SUPPORTED_CURRENCIES = [
  "NOK",
  "EUR",
  "USD",
  "SEK",
  "DKK",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE48_COMPANION_EXAMPLES = [
  "🌹 You have several onboarding projects — consider spacing implementations for quality and wellbeing.",
  "❤️ Block preparation time before training sessions — sustainable experts deliver better outcomes.",
  "🦉 Before accepting new opportunities, review follow-ups and onboarding load — it is okay to defer.",
  "🦉 Commission trends suggest a quieter month ahead — a good time for learning and certification.",
  "🔔 Forecasted commissions are estimates — adjust plans without guilt if reality differs.",
] as const;

export function getImplementationBlueprintPhase48Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE48_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE48_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE48_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE48_OBJECTIVE_KEYS,
    goalKeys: IMPLEMENTATION_BLUEPRINT_PHASE48_GOAL_KEYS,
    supportedCurrencies: IMPLEMENTATION_BLUEPRINT_PHASE48_SUPPORTED_CURRENCIES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE48_COMPANION_EXAMPLES,
    engineRoute: "/app/sales-expert-engine",
    enginePhase: "A.95",
    blueprintPhase: "Phase 48 — Sales Operations & Business Management Engine",
    valueRealizationRoute: "/app/value-realization-engine",
    valueRealizationPhase: "A.48",
    commercialRoute: "/app/commercial",
    revenueIntelligencePhase: 39,
    performancePhase: 41,
    renewalPhase: 44,
    goalsOkrRoute: "/app/goals-okr-engine",
    goalsOkrPhase: "A.65",
    personalProductivityRoute: "/app/personal-productivity-engine",
    personalProductivityPhase: "A.70",
    resourcePlanningRoute: "/app/resource-planning-engine",
    resourcePlanningPhase: "A.63",
    selfLoveRoute: "/app/self-love-engine",
    selfLovePhase: "A.76",
    distinctionNote:
      "Distinct from Value Realization Engine Phase A.48 — Blueprint Phase 48 Sales Operations extends Sales Expert OS Operations tab for independent partner business visibility.",
    forecastTone: "inform_not_pressure",
  };
}
