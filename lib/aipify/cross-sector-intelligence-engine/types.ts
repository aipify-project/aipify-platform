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

export type LearningProgram = {
  id: string;
  program_key?: string;
  program_type?: string;
  title?: string;
  status?: string;
  sector_tags?: string[];
  enrolled_at?: string;
};

export type ResilienceNetwork = {
  id: string;
  network_key?: string;
  network_type?: string;
  title?: string;
  participation_status?: string;
  sector_scope?: string[];
  registered_at?: string;
};

export type PreparednessReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  review_title?: string;
  preparedness_level?: string;
  summary?: string | null;
  reflection_themes?: unknown;
  created_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type CrossSectorIntelligenceEngagementSummary = {
  resilience_score?: number;
  participation_status?: string;
  enabled?: boolean;
  preparedness_level?: string;
  programs_count?: number;
  networks_count?: number;
  active_networks_count?: number;
  preparedness_reviews_count?: number;
  cross_links_count?: number;
  learning_programs_count?: number;
  privacy_note?: string;
  opt_in_required?: boolean;
};

export type CrossSectorIntelligenceBlueprint = {
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
  societal_resilience_center?: Record<string, unknown>;
  cross_sector_intelligence_engine?: Record<string, unknown>;
  preparedness_framework_engine?: Record<string, unknown>;
  collective_resilience_networks?: Record<string, unknown>;
  resilience_companion?: Record<string, unknown>;
  ecosystem_health_engine?: Record<string, unknown>;
  leadership_preparedness_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: CrossSectorIntelligenceEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type CrossSectorIntelligenceCard = {
  has_customer: boolean;
  resilience_score?: number;
  participation_status?: string;
  enabled?: boolean;
  preparedness_level?: string;
  programs_count?: number;
  networks_count?: number;
  philosophy?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  cross_sector_intelligence_mission?: string;
  cross_sector_intelligence_abos_principle?: string;
  cross_sector_intelligence_engagement_summary?: CrossSectorIntelligenceEngagementSummary;
  cross_sector_intelligence_note?: string;
  cross_sector_intelligence_vision_note?: string;
};

export type CrossSectorIntelligenceDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  participation_status?: string;
  preparedness_level?: string;
  leadership_coordination_enabled?: boolean;
  learning_programs_enabled?: boolean;
  network_participation_enabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  resilience_score?: number;
  programs_count?: number;
  networks_count?: number;
  active_networks_count?: number;
  preparedness_reviews_count?: number;
  learning_programs: LearningProgram[];
  resilience_networks: ResilienceNetwork[];
  preparedness_reviews: PreparednessReview[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  cross_sector_intelligence_blueprint?: CrossSectorIntelligenceBlueprint;
  cross_sector_intelligence_mission?: string;
  cross_sector_intelligence_philosophy?: string;
  cross_sector_intelligence_abos_principle?: string;
  cross_sector_intelligence_objectives?: BlueprintObjective[];
  societal_resilience_center_meta?: Record<string, unknown>;
  cross_sector_intelligence_engine_meta?: Record<string, unknown>;
  preparedness_framework_engine_meta?: Record<string, unknown>;
  collective_resilience_networks_meta?: Record<string, unknown>;
  resilience_companion_meta?: Record<string, unknown>;
  ecosystem_health_engine_meta?: Record<string, unknown>;
  leadership_preparedness_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  csiebp162_integration_links?: IntegrationLink[];
  cross_sector_intelligence_engagement_summary?: CrossSectorIntelligenceEngagementSummary;
  cross_sector_intelligence_success_criteria?: AbosSuccessCriterion[];
  cross_sector_intelligence_vision?: string;
  cross_sector_intelligence_vision_phrases?: string[];
  cross_sector_intelligence_privacy_note?: string;
  cross_sector_intelligence_dogfooding?: string;
  cross_sector_intelligence_engine_note?: string;
  cross_sector_intelligence_distinction_note?: string;
};
