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
  readiness_signal?: string;
  captured_at?: string;
};

export type FlourishingSnapshot = {
  id: string;
  snapshot_key?: string;
  dimension_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  captured_at?: string;
};

export type LivingMemoryEntry = {
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

export type LivingEnterpriseEngagementSummary = {
  living_enterprise_score?: number;
  living_readiness_level?: number;
  maturity_stage?: string;
  stewardship_reviews_count?: number;
  flourishing_snapshots_count?: number;
  living_memory_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_employee_surveillance?: boolean;
};

export type LivingEnterpriseBlueprint = {
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
  living_enterprise_center?: Record<string, unknown>;
  transcendence_engine?: Record<string, unknown>;
  living_systems_framework?: Record<string, unknown>;
  enterprise_flourishing_engine?: Record<string, unknown>;
  transcendence_companion?: Record<string, unknown>;
  stewardship_maturity_engine?: Record<string, unknown>;
  collective_flourishing_framework?: Record<string, unknown>;
  living_memory_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  era_capstone_summary?: IntegrationLink[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: LivingEnterpriseEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type LivingEnterpriseCard = {
  has_customer: boolean;
  living_enterprise_score?: number;
  living_readiness_level?: number;
  stewardship_reviews_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  reflection_opt_in?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  living_enterprise_mission?: string;
  living_enterprise_abos_principle?: string;
  living_enterprise_engagement_summary?: LivingEnterpriseEngagementSummary;
  living_enterprise_note?: string;
  living_enterprise_vision_note?: string;
};

export type LivingEnterpriseDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  living_readiness_level?: number;
  maturity_stage?: string;
  reflection_opt_in?: boolean;
  flourishing_review_enabled?: boolean;
  living_memory_enabled?: boolean;
  human_oversight_required?: boolean;
  governance_visibility?: string;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  living_enterprise_score?: number;
  stewardship_reviews_count?: number;
  flourishing_snapshots_count?: number;
  living_memory_count?: number;
  stewardship_reviews: StewardshipReview[];
  flourishing_snapshots: FlourishingSnapshot[];
  living_memory_entries: LivingMemoryEntry[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  living_enterprise_blueprint?: LivingEnterpriseBlueprint;
  living_enterprise_mission?: string;
  living_enterprise_philosophy?: string;
  living_enterprise_abos_principle?: string;
  living_enterprise_objectives?: BlueprintObjective[];
  living_enterprise_center_meta?: Record<string, unknown>;
  transcendence_engine_meta?: Record<string, unknown>;
  living_systems_framework_meta?: Record<string, unknown>;
  enterprise_flourishing_engine_meta?: Record<string, unknown>;
  transcendence_companion_meta?: Record<string, unknown>;
  stewardship_maturity_engine_meta?: Record<string, unknown>;
  collective_flourishing_framework_meta?: Record<string, unknown>;
  living_memory_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  letebp160_era_capstone_summary?: IntegrationLink[];
  letebp160_extended_cross_links?: IntegrationLink[];
  letebp160_integration_links?: IntegrationLink[];
  living_enterprise_engagement_summary?: LivingEnterpriseEngagementSummary;
  living_enterprise_success_criteria?: AbosSuccessCriterion[];
  living_enterprise_vision?: string;
  living_enterprise_vision_phrases?: string[];
  living_enterprise_privacy_note?: string;
  living_enterprise_dogfooding?: string;
  living_enterprise_engine_note?: string;
  living_enterprise_distinction_note?: string;
};
