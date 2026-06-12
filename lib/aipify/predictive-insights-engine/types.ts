export type OrganizationPredictiveInsight = {
  id?: string;
  prediction_type?: string;
  confidence?: string;
  risk_level?: string;
  status?: string;
  summary?: string;
  recommended_action?: string;
  source_engine?: string;
  metadata?: Record<string, unknown>;
  dismissed_at?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
  signal?: string;
  description?: string;
};

export type CompanionGuidance = {
  principle?: string;
  examples?: CompanionGuidanceExample[];
};

export type OperationalPatternRecognition = {
  principle?: string;
  patterns?: CompanionGuidanceExample[];
  metadata_note?: string;
};

export type ResourceAwareness = {
  principle?: string;
  dimensions?: BlueprintObjective[];
  cross_links?: Record<string, string>;
  awareness_note?: string;
};

export type BottleneckForecasting = {
  principle?: string;
  forecasts?: CompanionGuidanceExample[];
  boundary_note?: string;
};

export type ScenarioObservations = {
  principle?: string;
  scenarios?: BlueprintObjective[];
  exploration_note?: string;
};

export type ExecutiveInsightsBlueprint = {
  principle?: string;
  insight_types?: BlueprintObjective[];
  dialogue_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  journey_phrase?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  forbidden?: string[];
  required?: string[];
  boundary_note?: string;
};

export type DogfoodingBlueprint = {
  principle?: string;
  aipify_group?: Record<string, unknown>;
  unonight?: Record<string, unknown>;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type PredictiveOperationsEngagementSummary = {
  active_insights?: number;
  high_risk_insights?: number;
  critical_insights?: number;
  prediction_type_count?: number;
  dismissed_insights?: number;
  pattern_signals?: number;
  bottleneck_forecasts?: number;
  companion_examples?: number;
  privacy_note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type PredictiveInsightsEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_insights?: number;
  high_risk_insights?: number;
  critical_insights?: number;
  prediction_type_count?: number;
  implementation_blueprint_phase74?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: PredictiveOperationsEngagementSummary;
  blueprint_note?: string;
  preparedness_note?: string;
  [key: string]: unknown;
};

export type PredictiveInsightsEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  sections?: {
    active_insights?: OrganizationPredictiveInsight[];
    by_prediction_type?: Record<string, unknown>[];
    by_risk_level?: Record<string, unknown>[];
  };
  settings?: Record<string, unknown>;
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  implementation_blueprint_phase74?: ImplementationBlueprintMeta;
  predictive_operations_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_objectives?: BlueprintObjective[];
  operational_pattern_recognition?: OperationalPatternRecognition;
  resource_awareness?: ResourceAwareness;
  bottleneck_forecasting?: BottleneckForecasting;
  scenario_observations?: ScenarioObservations;
  executive_insights_blueprint?: ExecutiveInsightsBlueprint;
  companion_guidance?: CompanionGuidance;
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  limitation_principles?: LimitationPrinciples;
  dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: PredictiveOperationsEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
  [key: string]: unknown;
};

export type PredictiveInsightsExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  insights?: OrganizationPredictiveInsight[];
  summary?: Record<string, unknown>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};
