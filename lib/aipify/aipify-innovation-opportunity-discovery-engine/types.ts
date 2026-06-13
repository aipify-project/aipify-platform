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

export type ExecutiveReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  readiness_signal?: string;
  captured_at?: string;
};

export type ReflectionEntry = {
  id: string;
  reflection_key?: string;
  reflection_type?: string;
  title?: string;
  reflection_summary?: string;
  status?: string;
  created_at?: string;
};

export type ScaffoldNote = {
  id: string;
  note_key?: string;
  note_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  created_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type AipifyInnovationOpportunityDiscoveryEngineEngagementSummary = {
  aipify_innovation_opportunity_discovery_score?: number;
  enabled?: boolean;
  innovation_discovery_mode?: string;
  innovation_maturity_level?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  discovery_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type AipifyInnovationOpportunityDiscoveryEngineBlueprint = {
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
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  era_opener_summary?: IntegrationLink[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: AipifyInnovationOpportunityDiscoveryEngineEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type AipifyInnovationOpportunityDiscoveryEngineCard = {
  has_customer: boolean;
  aipify_innovation_opportunity_discovery_score?: number;
  enabled?: boolean;
  innovation_discovery_mode?: string;
  innovation_maturity_level?: number;
  reflections_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  aipify_innovation_opportunity_discovery_mission?: string;
  aipify_innovation_opportunity_discovery_abos_principle?: string;
  aipify_innovation_opportunity_discovery_engagement_summary?: AipifyInnovationOpportunityDiscoveryEngineEngagementSummary;
  aipify_innovation_opportunity_discovery_note?: string;
  aipify_innovation_opportunity_discovery_vision_note?: string;
};

export type AipifyInnovationOpportunityDiscoveryEngineDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  innovation_discovery_mode?: string;
  innovation_maturity_level?: number;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  aipify_innovation_opportunity_discovery_score?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  discovery_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  executive_reviews: ExecutiveReview[];
  reflections: ReflectionEntry[];
  scaffold_notes: ScaffoldNote[];
  integration_links: IntegrationLink[];
  era_opener_summary?: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  aipify_innovation_opportunity_discovery_blueprint?: AipifyInnovationOpportunityDiscoveryEngineBlueprint;
  aipify_innovation_opportunity_discovery_mission?: string;
  aipify_innovation_opportunity_discovery_philosophy?: string;
  aipify_innovation_opportunity_discovery_abos_principle?: string;
  aipify_innovation_opportunity_discovery_objectives?: BlueprintObjective[];
  center_meta?: Record<string, unknown>;
  engine_meta?: Record<string, unknown>;
  framework_meta?: Record<string, unknown>;
  executive_reviews_meta?: Record<string, unknown>;
  companion_meta?: Record<string, unknown>;
  sub_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  aiodebp212_integration_links?: IntegrationLink[];
  aiodebp212_era_opener_summary?: IntegrationLink[];
  aipify_innovation_opportunity_discovery_engagement_summary?: AipifyInnovationOpportunityDiscoveryEngineEngagementSummary;
  aipify_innovation_opportunity_discovery_success_criteria?: AbosSuccessCriterion[];
  aipify_innovation_opportunity_discovery_vision?: string;
  aipify_innovation_opportunity_discovery_vision_phrases?: string[];
  aipify_innovation_opportunity_discovery_privacy_note?: string;
  aipify_innovation_opportunity_discovery_dogfooding?: string;
  aipify_innovation_opportunity_discovery_engine_note?: string;
  aipify_innovation_opportunity_discovery_distinction_note?: string;
};
