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

export type ExecutiveTrustReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  captured_at?: string;
};

export type RelationshipHealthEntry = {
  id: string;
  health_key?: string;
  health_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  captured_at?: string;
};

export type TrustRepairRecord = {
  id: string;
  repair_key?: string;
  repair_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  created_at?: string;
};

export type TrustMemoryEntry = {
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

export type SocialCohesionEngagementSummary = {
  social_cohesion_score?: number;
  enabled?: boolean;
  trust_development_mode?: string;
  trust_reviews_count?: number;
  relationship_health_count?: number;
  repair_records_count?: number;
  trust_memory_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  no_trust_scores?: boolean;
  not_manipulation?: boolean;
};

export type SocialCohesionBlueprint = {
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
  social_cohesion_center?: Record<string, unknown>;
  trust_development_engine?: Record<string, unknown>;
  relationship_health_framework?: Record<string, unknown>;
  executive_trust_reviews?: Record<string, unknown>;
  trust_companion?: Record<string, unknown>;
  social_cohesion_engine?: Record<string, unknown>;
  repair_restoration_framework?: Record<string, unknown>;
  trust_memory_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: SocialCohesionEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type SocialCohesionCard = {
  has_customer: boolean;
  social_cohesion_score?: number;
  enabled?: boolean;
  trust_development_mode?: string;
  trust_reviews_count?: number;
  philosophy?: string;
  trust_reflection_enabled?: boolean;
  relationship_health_enabled?: boolean;
  human_oversight_required?: boolean;
  reflection_opt_in?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  social_cohesion_mission?: string;
  social_cohesion_abos_principle?: string;
  social_cohesion_engagement_summary?: SocialCohesionEngagementSummary;
  social_cohesion_note?: string;
  social_cohesion_vision_note?: string;
};

export type SocialCohesionDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  trust_development_mode?: string;
  trust_reflection_enabled?: boolean;
  relationship_health_enabled?: boolean;
  repair_programs_enabled?: boolean;
  executive_reviews_enabled?: boolean;
  human_oversight_required?: boolean;
  reflection_opt_in?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  social_cohesion_score?: number;
  trust_reviews_count?: number;
  relationship_health_count?: number;
  repair_records_count?: number;
  trust_memory_count?: number;
  trust_reviews: ExecutiveTrustReview[];
  relationship_health: RelationshipHealthEntry[];
  repair_records: TrustRepairRecord[];
  trust_memory_entries: TrustMemoryEntry[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  social_cohesion_blueprint?: SocialCohesionBlueprint;
  social_cohesion_mission?: string;
  social_cohesion_philosophy?: string;
  social_cohesion_abos_principle?: string;
  social_cohesion_objectives?: BlueprintObjective[];
  social_cohesion_center_meta?: Record<string, unknown>;
  trust_development_engine_meta?: Record<string, unknown>;
  relationship_health_framework_meta?: Record<string, unknown>;
  executive_trust_reviews_meta?: Record<string, unknown>;
  trust_companion_meta?: Record<string, unknown>;
  social_cohesion_engine_meta?: Record<string, unknown>;
  repair_restoration_framework_meta?: Record<string, unknown>;
  trust_memory_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  cstcebp169_integration_links?: IntegrationLink[];
  social_cohesion_engagement_summary?: SocialCohesionEngagementSummary;
  social_cohesion_success_criteria?: AbosSuccessCriterion[];
  social_cohesion_vision?: string;
  social_cohesion_vision_phrases?: string[];
  social_cohesion_privacy_note?: string;
  social_cohesion_dogfooding?: string;
  social_cohesion_engine_note?: string;
  social_cohesion_distinction_note?: string;
};
