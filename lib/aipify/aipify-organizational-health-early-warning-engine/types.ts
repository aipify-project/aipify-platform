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

export type AipifyOrganizationalHealthEarlyWarningEngineEngagementSummary = {
  aipify_organizational_health_early_warning_score?: number;
  enabled?: boolean;
  organizational_health_mode?: string;
  early_warning_sensitivity_level?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  health_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type AipifyOrganizationalHealthEarlyWarningEngineBlueprint = {
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
  engagement_summary?: AipifyOrganizationalHealthEarlyWarningEngineEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type AipifyOrganizationalHealthEarlyWarningEngineCard = {
  has_customer: boolean;
  aipify_organizational_health_early_warning_score?: number;
  enabled?: boolean;
  organizational_health_mode?: string;
  early_warning_sensitivity_level?: number;
  reflections_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  aipify_organizational_health_early_warning_mission?: string;
  aipify_organizational_health_early_warning_abos_principle?: string;
  aipify_organizational_health_early_warning_engagement_summary?: AipifyOrganizationalHealthEarlyWarningEngineEngagementSummary;
  aipify_organizational_health_early_warning_note?: string;
  aipify_organizational_health_early_warning_vision_note?: string;
};

export type AipifyOrganizationalHealthEarlyWarningEngineDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  organizational_health_mode?: string;
  early_warning_sensitivity_level?: number;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  aipify_organizational_health_early_warning_score?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  health_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  executive_reviews: ExecutiveReview[];
  reflections: ReflectionEntry[];
  scaffold_notes: ScaffoldNote[];
  integration_links: IntegrationLink[];
  era_opener_summary?: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  aipify_organizational_health_early_warning_blueprint?: AipifyOrganizationalHealthEarlyWarningEngineBlueprint;
  aipify_organizational_health_early_warning_mission?: string;
  aipify_organizational_health_early_warning_philosophy?: string;
  aipify_organizational_health_early_warning_abos_principle?: string;
  aipify_organizational_health_early_warning_objectives?: BlueprintObjective[];
  center_meta?: Record<string, unknown>;
  engine_meta?: Record<string, unknown>;
  framework_meta?: Record<string, unknown>;
  executive_reviews_meta?: Record<string, unknown>;
  companion_meta?: Record<string, unknown>;
  sub_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  aohewbp198_integration_links?: IntegrationLink[];
  aohewbp198_era_opener_summary?: IntegrationLink[];
  aipify_organizational_health_early_warning_engagement_summary?: AipifyOrganizationalHealthEarlyWarningEngineEngagementSummary;
  aipify_organizational_health_early_warning_success_criteria?: AbosSuccessCriterion[];
  aipify_organizational_health_early_warning_vision?: string;
  aipify_organizational_health_early_warning_vision_phrases?: string[];
  aipify_organizational_health_early_warning_privacy_note?: string;
  aipify_organizational_health_early_warning_dogfooding?: string;
  aipify_organizational_health_early_warning_engine_note?: string;
  aipify_organizational_health_early_warning_distinction_note?: string;
};
