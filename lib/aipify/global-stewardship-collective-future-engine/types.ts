export type BlueprintObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  phase?: number;
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  relationship?: string;
  description?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type ExecutiveStewardshipReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  readiness_signal?: string;
  captured_at?: string;
};

export type StewardshipFutureScenario = {
  id: string;
  scenario_key?: string;
  scenario_type?: string;
  title?: string;
  summary?: string;
  horizon?: string;
  status?: string;
  captured_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  must_not?: string[];
};

export type GlobalStewardshipEngagementSummary = {
  stewardship_score?: number;
  stewardship_maturity_level?: number;
  readiness_level?: string;
  executive_reviews_count?: number;
  future_scenarios_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_employee_surveillance?: boolean;
};

export type GlobalStewardshipBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  global_stewardship_center?: Record<string, unknown>;
  collective_future_engine?: Record<string, unknown>;
  long_term_thinking_framework?: Record<string, unknown>;
  stewardship_companion?: Record<string, unknown>;
  collective_resilience_engine?: Record<string, unknown>;
  executive_stewardship_reviews?: Record<string, unknown>;
  legacy_intelligence_engine?: Record<string, unknown>;
  global_responsibility_principles?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  era_capstone_summary?: IntegrationLink[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: GlobalStewardshipEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type GlobalStewardshipCard = {
  has_customer: boolean;
  stewardship_score?: number;
  stewardship_maturity_level?: number;
  executive_reviews_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  reflection_opt_in?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  global_stewardship_mission?: string;
  global_stewardship_abos_principle?: string;
  global_stewardship_engagement_summary?: GlobalStewardshipEngagementSummary;
  global_stewardship_note?: string;
  global_stewardship_vision_note?: string;
};

export type GlobalStewardshipDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  stewardship_maturity_level?: number;
  readiness_level?: string;
  reflection_opt_in?: boolean;
  executive_review_enabled?: boolean;
  scenario_planning_enabled?: boolean;
  human_oversight_required?: boolean;
  governance_visibility?: string;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  stewardship_score?: number;
  executive_reviews_count?: number;
  future_scenarios_count?: number;
  executive_reviews: ExecutiveStewardshipReview[];
  future_scenarios: StewardshipFutureScenario[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  global_stewardship_blueprint?: GlobalStewardshipBlueprint;
  global_stewardship_mission?: string;
  global_stewardship_philosophy?: string;
  global_stewardship_abos_principle?: string;
  global_stewardship_objectives?: BlueprintObjective[];
  global_stewardship_center_meta?: Record<string, unknown>;
  collective_future_engine_meta?: Record<string, unknown>;
  long_term_thinking_framework_meta?: Record<string, unknown>;
  stewardship_companion_meta?: Record<string, unknown>;
  collective_resilience_engine_meta?: Record<string, unknown>;
  executive_stewardship_reviews_meta?: Record<string, unknown>;
  legacy_intelligence_engine_meta?: Record<string, unknown>;
  global_responsibility_principles_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  gscfebp150_era_capstone_summary?: IntegrationLink[];
  gscfebp150_extended_cross_links?: IntegrationLink[];
  gscfebp150_integration_links?: IntegrationLink[];
  global_stewardship_engagement_summary?: GlobalStewardshipEngagementSummary;
  global_stewardship_success_criteria?: AbosSuccessCriterion[];
  global_stewardship_vision?: string;
  global_stewardship_vision_phrases?: string[];
  global_stewardship_privacy_note?: string;
  global_stewardship_dogfooding?: string;
  global_stewardship_engine_note?: string;
  global_stewardship_distinction_note?: string;
};
