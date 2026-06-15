import type {
  ExpansionType,
  ForecastPeriod,
  ForecastSurface,
  GoalPeriod,
  PipelineStage,
  ScenarioKey,
} from "./constants";

export type ForecastOverview = {
  forecasted_monthly_revenue: number;
  forecasted_annual_revenue: number;
  active_opportunities_value: number;
  expected_commissions: number;
  renewal_opportunities: number;
  expansion_opportunities: number;
  weighted_pipeline_value: number;
};

export type PipelineOpportunity = {
  id: string;
  company_name: string;
  pipeline_stage: PipelineStage;
  estimated_value: number;
  expected_close_date: string | null;
  opportunity_type: string;
  weighted_value: number;
};

export type PipelineForecast = {
  qualified: number;
  proposal_stage: number;
  negotiation_stage: number;
  weighted_value: number;
  opportunities: PipelineOpportunity[];
};

export type RenewalForecast = {
  id: string;
  customer_name: string;
  renewal_date: string;
  renewal_value: number;
  renewal_probability: number;
  requires_attention: boolean;
};

export type ExpansionForecast = {
  id: string;
  customer_name: string;
  expansion_type: ExpansionType;
  estimated_value: number;
  probability: number;
};

export type ForecastGoal = {
  id: string;
  goal_period: GoalPeriod;
  period_key: string;
  target_revenue: number;
  current_revenue: number;
  progress_pct: number;
};

export type ForecastScenario = {
  scenario_key: ScenarioKey;
  forecast_period: ForecastPeriod;
  projected_revenue: number;
  projected_commissions: number;
};

export type ForecastRecommendation = {
  key: string;
  message_key: string;
};

export type ForecastAuditEntry = {
  id: string;
  event_type: string;
  summary: string;
  created_at: string;
};

export type GrowthPartnerForecastCenter = {
  has_access: boolean;
  surface?: ForecastSurface;
  tenant_id?: string;
  overview?: ForecastOverview;
  pipeline?: PipelineForecast;
  renewals?: RenewalForecast[];
  expansions?: ExpansionForecast[];
  goals?: ForecastGoal[];
  scenarios?: ForecastScenario[];
  forecast_periods?: string[];
  probability_assumptions?: Record<string, number>;
  recommendations?: ForecastRecommendation[];
  audit?: ForecastAuditEntry[];
  partners?: Array<{ tenant_id: string; forecasted_annual: number; weighted_pipeline: number }>;
  principle?: string;
};

export type GrowthPartnerForecastLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  overview: Record<string, string>;
  sections: Record<string, string>;
  table: Record<string, string>;
  pipelineStages: Record<string, string>;
  forecastPeriods: Record<string, string>;
  scenarios: Record<string, string>;
  goalPeriods: Record<string, string>;
  expansionTypes: Record<string, string>;
  probabilities: Record<string, string>;
  recommendations: Record<string, string>;
  quickActions: Record<string, string>;
  youDecide: string;
};
