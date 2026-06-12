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

export type HumanDignityHumilityEngagementSummary = {
  human_dignity_technological_humility_score?: number;
  enabled?: boolean;
  humility_mode?: string;
  dignity_readiness_level?: number;
  executive_reviews_count?: number;
  dignity_reflections_count?: number;
  compassion_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_worth_scoring?: boolean;
};

export type HumanDignityHumilityBlueprint = {
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
  meaning_identity_center?: Record<string, unknown>;
  human_identity_engine?: Record<string, unknown>;
  meaning_preservation_framework?: Record<string, unknown>;
  executive_humanity_reviews?: Record<string, unknown>;
  meaning_companion?: Record<string, unknown>;
  belonging_engine?: Record<string, unknown>;
  agency_preservation_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  era_opener_summary?: IntegrationLink[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: HumanDignityHumilityEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type HumanDignityHumilityCard = {
  has_customer: boolean;
  human_dignity_technological_humility_score?: number;
  enabled?: boolean;
  humility_mode?: string;
  dignity_readiness_level?: number;
  dignity_reflections_count?: number;
  philosophy?: string;
  purpose_reflection_enabled?: boolean;
  agency_preservation_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  human_dignity_technological_humility_mission?: string;
  human_dignity_technological_humility_abos_principle?: string;
  human_dignity_technological_humility_engagement_summary?: HumanDignityHumilityEngagementSummary;
  human_dignity_technological_humility_note?: string;
  human_dignity_technological_humility_vision_note?: string;
};

export type HumanDignityHumilityDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  humility_mode?: string;
  dignity_readiness_level?: number;
  purpose_reflection_enabled?: boolean;
  belonging_reflection_enabled?: boolean;
  agency_preservation_enabled?: boolean;
  identity_discovery_enabled?: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  human_dignity_technological_humility_score?: number;
  executive_reviews_count?: number;
  dignity_reflections_count?: number;
  compassion_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  executive_reviews: ExecutiveReview[];
  dignity_reflections: ReflectionEntry[];
  compassion_notes: ScaffoldNote[];
  integration_links: IntegrationLink[];
  era_opener_summary?: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  human_dignity_technological_humility_blueprint?: HumanDignityHumilityBlueprint;
  human_dignity_technological_humility_mission?: string;
  human_dignity_technological_humility_philosophy?: string;
  human_dignity_technological_humility_abos_principle?: string;
  human_dignity_technological_humility_objectives?: BlueprintObjective[];
  dignity_center_meta?: Record<string, unknown>;
  human_dignity_engine_meta?: Record<string, unknown>;
  technological_humility_framework_meta?: Record<string, unknown>;
  executive_humility_reviews_meta?: Record<string, unknown>;
  dignity_companion_meta?: Record<string, unknown>;
  compassion_engine_meta?: Record<string, unknown>;
  human_value_framework_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  hdthbp177_integration_links?: IntegrationLink[];
  hdthbp177_era_opener_summary?: IntegrationLink[];
  human_dignity_technological_humility_engagement_summary?: HumanDignityHumilityEngagementSummary;
  human_dignity_technological_humility_success_criteria?: AbosSuccessCriterion[];
  human_dignity_technological_humility_vision?: string;
  human_dignity_technological_humility_vision_phrases?: string[];
  human_dignity_technological_humility_privacy_note?: string;
  human_dignity_technological_humility_dogfooding?: string;
  human_dignity_technological_humility_engine_note?: string;
  human_dignity_technological_humility_distinction_note?: string;
};
