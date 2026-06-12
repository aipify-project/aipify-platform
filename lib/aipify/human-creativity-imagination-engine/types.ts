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

export type HumanCreativityImaginationEngagementSummary = {
  human_creativity_imagination_score?: number;
  enabled?: boolean;
  amplification_mode?: string;
  creativity_readiness_level?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  imagination_scaffolds_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_worth_scoring?: boolean;
};

export type HumanCreativityImaginationBlueprint = {
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
  engagement_summary?: HumanCreativityImaginationEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type HumanCreativityImaginationCard = {
  has_customer: boolean;
  human_creativity_imagination_score?: number;
  enabled?: boolean;
  amplification_mode?: string;
  creativity_readiness_level?: number;
  reflections_count?: number;
  philosophy?: string;
  purpose_reflection_enabled?: boolean;
  agency_preservation_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  human_creativity_imagination_mission?: string;
  human_creativity_imagination_abos_principle?: string;
  human_creativity_imagination_engagement_summary?: HumanCreativityImaginationEngagementSummary;
  human_creativity_imagination_note?: string;
  human_creativity_imagination_vision_note?: string;
};

export type HumanCreativityImaginationDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  amplification_mode?: string;
  creativity_readiness_level?: number;
  purpose_reflection_enabled?: boolean;
  belonging_reflection_enabled?: boolean;
  agency_preservation_enabled?: boolean;
  identity_discovery_enabled?: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  human_creativity_imagination_score?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  imagination_scaffolds_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  executive_reviews: ExecutiveReview[];
  reflections: ReflectionEntry[];
  scaffold_notes: ScaffoldNote[];
  integration_links: IntegrationLink[];
  era_opener_summary?: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  human_creativity_imagination_blueprint?: HumanCreativityImaginationBlueprint;
  human_creativity_imagination_mission?: string;
  human_creativity_imagination_philosophy?: string;
  human_creativity_imagination_abos_principle?: string;
  human_creativity_imagination_objectives?: BlueprintObjective[];
  center_meta?: Record<string, unknown>;
  engine_meta?: Record<string, unknown>;
  framework_meta?: Record<string, unknown>;
  executive_reviews_meta?: Record<string, unknown>;
  companion_meta?: Record<string, unknown>;
  sub_engine_meta?: Record<string, unknown>;
  supporting_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  hciabp174_integration_links?: IntegrationLink[];
  hciabp174_era_opener_summary?: IntegrationLink[];
  human_creativity_imagination_engagement_summary?: HumanCreativityImaginationEngagementSummary;
  human_creativity_imagination_success_criteria?: AbosSuccessCriterion[];
  human_creativity_imagination_vision?: string;
  human_creativity_imagination_vision_phrases?: string[];
  human_creativity_imagination_privacy_note?: string;
  human_creativity_imagination_dogfooding?: string;
  human_creativity_imagination_engine_note?: string;
  human_creativity_imagination_distinction_note?: string;
};
