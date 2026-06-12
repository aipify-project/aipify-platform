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

export type StewardshipReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  reflection_signal?: string;
  captured_at?: string;
};

export type OpportunityInitiative = {
  id: string;
  initiative_key?: string;
  initiative_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  created_at?: string;
};

export type ProsperityMemoryEntry = {
  id: string;
  memory_key?: string;
  memory_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  captured_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  must_not?: string[];
};

export type SharedProsperityEngagementSummary = {
  shared_prosperity_score?: number;
  prosperity_readiness_level?: number;
  prosperity_maturity_stage?: string;
  stewardship_reviews_count?: number;
  opportunity_initiatives_count?: number;
  prosperity_memory_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_employee_surveillance?: boolean;
  not_resource_allocation?: boolean;
};

export type SharedProsperityBlueprint = {
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
  shared_prosperity_center?: Record<string, unknown>;
  stewardship_engine?: Record<string, unknown>;
  shared_prosperity_framework?: Record<string, unknown>;
  executive_stewardship_reviews?: Record<string, unknown>;
  stewardship_companion?: Record<string, unknown>;
  opportunity_development_engine?: Record<string, unknown>;
  ecosystem_health_engine?: Record<string, unknown>;
  prosperity_memory_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  era_cross_links?: IntegrationLink[];
  extended_cross_links?: IntegrationLink[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: SharedProsperityEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type SharedProsperityCard = {
  has_customer: boolean;
  shared_prosperity_score?: number;
  prosperity_readiness_level?: number;
  stewardship_reviews_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  reflection_opt_in?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  shared_prosperity_mission?: string;
  shared_prosperity_abos_principle?: string;
  shared_prosperity_engagement_summary?: SharedProsperityEngagementSummary;
  shared_prosperity_note?: string;
  shared_prosperity_vision_note?: string;
};

export type SharedProsperityDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  prosperity_readiness_level?: number;
  prosperity_maturity_stage?: string;
  reflection_opt_in?: boolean;
  stewardship_review_enabled?: boolean;
  opportunity_development_enabled?: boolean;
  prosperity_memory_enabled?: boolean;
  human_oversight_required?: boolean;
  governance_visibility?: string;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  shared_prosperity_score?: number;
  stewardship_reviews_count?: number;
  opportunity_initiatives_count?: number;
  prosperity_memory_count?: number;
  stewardship_reviews: StewardshipReview[];
  opportunity_initiatives: OpportunityInitiative[];
  prosperity_memory_entries: ProsperityMemoryEntry[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  shared_prosperity_blueprint?: SharedProsperityBlueprint;
  shared_prosperity_mission?: string;
  shared_prosperity_philosophy?: string;
  shared_prosperity_abos_principle?: string;
  shared_prosperity_objectives?: BlueprintObjective[];
  shared_prosperity_center_meta?: Record<string, unknown>;
  stewardship_engine_meta?: Record<string, unknown>;
  shared_prosperity_framework_meta?: Record<string, unknown>;
  executive_stewardship_reviews_meta?: Record<string, unknown>;
  stewardship_companion_meta?: Record<string, unknown>;
  opportunity_development_engine_meta?: Record<string, unknown>;
  ecosystem_health_engine_meta?: Record<string, unknown>;
  prosperity_memory_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  cspebp167_era_cross_links?: IntegrationLink[];
  cspebp167_extended_cross_links?: IntegrationLink[];
  cspebp167_integration_links?: IntegrationLink[];
  shared_prosperity_engagement_summary?: SharedProsperityEngagementSummary;
  shared_prosperity_success_criteria?: AbosSuccessCriterion[];
  shared_prosperity_vision?: string;
  shared_prosperity_vision_phrases?: string[];
  shared_prosperity_privacy_note?: string;
  shared_prosperity_dogfooding?: string;
  shared_prosperity_engine_note?: string;
  shared_prosperity_distinction_note?: string;
};
