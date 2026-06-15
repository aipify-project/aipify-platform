export const FORECAST_SURFACES = ["super", "partner"] as const;
export type ForecastSurface = (typeof FORECAST_SURFACES)[number];

export const PIPELINE_STAGES = [
  "discovery",
  "demonstration",
  "proposal",
  "negotiation",
  "verbal_agreement",
  "closed_won",
  "closed_lost",
] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const FORECAST_PERIODS = [
  "next_30_days",
  "next_quarter",
  "next_6_months",
  "next_12_months",
] as const;
export type ForecastPeriod = (typeof FORECAST_PERIODS)[number];

export const SCENARIO_KEYS = ["conservative", "expected", "ambitious"] as const;
export type ScenarioKey = (typeof SCENARIO_KEYS)[number];

export const GOAL_PERIODS = ["monthly", "quarterly", "annual"] as const;
export type GoalPeriod = (typeof GOAL_PERIODS)[number];

export const EXPANSION_TYPES = [
  "additional_users",
  "higher_tier_plan",
  "additional_modules",
  "multi_domain",
  "enterprise_transition",
] as const;
export type ExpansionType = (typeof EXPANSION_TYPES)[number];

export const DEFAULT_PROBABILITIES: Record<string, number> = {
  discovery: 10,
  demonstration: 25,
  proposal: 50,
  negotiation: 75,
  verbal_agreement: 90,
};
