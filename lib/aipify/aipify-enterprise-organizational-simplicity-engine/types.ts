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

export type AipifyEnterpriseOrganizationalSimplicityEngineEngagementSummary = {
  aipify_enterprise_organizational_simplicity_score?: number;
  enabled?: boolean;
  enterprise_organizational_simplicity_mode?: string;
  enterprise_simplicity_index_level?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  enterprise_organizational_simplicity_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type AipifyEnterpriseOrganizationalSimplicityEngineBlueprint = {
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
  engagement_summary?: AipifyEnterpriseOrganizationalSimplicityEngineEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type AipifyEnterpriseOrganizationalSimplicityEngineCard = {
  has_customer: boolean;
  aipify_enterprise_organizational_simplicity_score?: number;
  enabled?: boolean;
  enterprise_organizational_simplicity_mode?: string;
  enterprise_simplicity_index_level?: number;
  reflections_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  aipify_enterprise_organizational_simplicity_mission?: string;
  aipify_enterprise_organizational_simplicity_abos_principle?: string;
  aipify_enterprise_organizational_simplicity_engagement_summary?: AipifyEnterpriseOrganizationalSimplicityEngineEngagementSummary;
  aipify_enterprise_organizational_simplicity_note?: string;
  aipify_enterprise_organizational_simplicity_vision_note?: string;
};

export type AipifyEnterpriseOrganizationalSimplicityEngineDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  enterprise_organizational_simplicity_mode?: string;
  enterprise_simplicity_index_level?: number;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  aipify_enterprise_organizational_simplicity_score?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  enterprise_organizational_simplicity_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  executive_reviews: ExecutiveReview[];
  reflections: ReflectionEntry[];
  scaffold_notes: ScaffoldNote[];
  integration_links: IntegrationLink[];
  era_opener_summary?: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  aipify_enterprise_organizational_simplicity_blueprint?: AipifyEnterpriseOrganizationalSimplicityEngineBlueprint;
  aipify_enterprise_organizational_simplicity_mission?: string;
  aipify_enterprise_organizational_simplicity_philosophy?: string;
  aipify_enterprise_organizational_simplicity_abos_principle?: string;
  aipify_enterprise_organizational_simplicity_objectives?: BlueprintObjective[];
  center_meta?: Record<string, unknown>;
  engine_meta?: Record<string, unknown>;
  framework_meta?: Record<string, unknown>;
  executive_reviews_meta?: Record<string, unknown>;
  companion_meta?: Record<string, unknown>;
  sub_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  aeosebp277_integration_links?: IntegrationLink[];
  aeosebp277_era_opener_summary?: IntegrationLink[];
  aipify_enterprise_organizational_simplicity_engagement_summary?: AipifyEnterpriseOrganizationalSimplicityEngineEngagementSummary;
  aipify_enterprise_organizational_simplicity_success_criteria?: AbosSuccessCriterion[];
  aipify_enterprise_organizational_simplicity_vision?: string;
  aipify_enterprise_organizational_simplicity_vision_phrases?: string[];
  aipify_enterprise_organizational_simplicity_privacy_note?: string;
  aipify_enterprise_organizational_simplicity_dogfooding?: string;
  aipify_enterprise_organizational_simplicity_engine_note?: string;
  aipify_enterprise_organizational_simplicity_distinction_note?: string;
};
