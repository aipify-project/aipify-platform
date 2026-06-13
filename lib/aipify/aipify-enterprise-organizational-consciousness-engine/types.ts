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

export type AipifyEnterpriseOrganizationalConsciousnessEngineEngagementSummary = {
  aipify_enterprise_organizational_consciousness_score?: number;
  enabled?: boolean;
  enterprise_organizational_consciousness_mode?: string;
  enterprise_consciousness_index_level?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  enterprise_organizational_consciousness_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type AipifyEnterpriseOrganizationalConsciousnessEngineBlueprint = {
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
  engagement_summary?: AipifyEnterpriseOrganizationalConsciousnessEngineEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type AipifyEnterpriseOrganizationalConsciousnessEngineCard = {
  has_customer: boolean;
  aipify_enterprise_organizational_consciousness_score?: number;
  enabled?: boolean;
  enterprise_organizational_consciousness_mode?: string;
  enterprise_consciousness_index_level?: number;
  reflections_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  aipify_enterprise_organizational_consciousness_mission?: string;
  aipify_enterprise_organizational_consciousness_abos_principle?: string;
  aipify_enterprise_organizational_consciousness_engagement_summary?: AipifyEnterpriseOrganizationalConsciousnessEngineEngagementSummary;
  aipify_enterprise_organizational_consciousness_note?: string;
  aipify_enterprise_organizational_consciousness_vision_note?: string;
};

export type AipifyEnterpriseOrganizationalConsciousnessEngineDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  enterprise_organizational_consciousness_mode?: string;
  enterprise_consciousness_index_level?: number;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  aipify_enterprise_organizational_consciousness_score?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  enterprise_organizational_consciousness_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  executive_reviews: ExecutiveReview[];
  reflections: ReflectionEntry[];
  scaffold_notes: ScaffoldNote[];
  integration_links: IntegrationLink[];
  era_opener_summary?: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  aipify_enterprise_organizational_consciousness_blueprint?: AipifyEnterpriseOrganizationalConsciousnessEngineBlueprint;
  aipify_enterprise_organizational_consciousness_mission?: string;
  aipify_enterprise_organizational_consciousness_philosophy?: string;
  aipify_enterprise_organizational_consciousness_abos_principle?: string;
  aipify_enterprise_organizational_consciousness_objectives?: BlueprintObjective[];
  center_meta?: Record<string, unknown>;
  engine_meta?: Record<string, unknown>;
  framework_meta?: Record<string, unknown>;
  executive_reviews_meta?: Record<string, unknown>;
  companion_meta?: Record<string, unknown>;
  sub_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  aeocebp281_integration_links?: IntegrationLink[];
  aeocebp281_era_opener_summary?: IntegrationLink[];
  aipify_enterprise_organizational_consciousness_engagement_summary?: AipifyEnterpriseOrganizationalConsciousnessEngineEngagementSummary;
  aipify_enterprise_organizational_consciousness_success_criteria?: AbosSuccessCriterion[];
  aipify_enterprise_organizational_consciousness_vision?: string;
  aipify_enterprise_organizational_consciousness_vision_phrases?: string[];
  aipify_enterprise_organizational_consciousness_privacy_note?: string;
  aipify_enterprise_organizational_consciousness_dogfooding?: string;
  aipify_enterprise_organizational_consciousness_engine_note?: string;
  aipify_enterprise_organizational_consciousness_distinction_note?: string;
};
