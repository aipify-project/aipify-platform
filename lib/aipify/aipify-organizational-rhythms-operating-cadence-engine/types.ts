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

export type AipifyOrganizationalRhythmsOperatingCadenceEngineEngagementSummary = {
  aipify_organizational_rhythms_operating_cadence_score?: number;
  enabled?: boolean;
  operating_cadence_mode?: string;
  cadence_discipline_level?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  cadence_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type AipifyOrganizationalRhythmsOperatingCadenceEngineBlueprint = {
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
  engagement_summary?: AipifyOrganizationalRhythmsOperatingCadenceEngineEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type AipifyOrganizationalRhythmsOperatingCadenceEngineCard = {
  has_customer: boolean;
  aipify_organizational_rhythms_operating_cadence_score?: number;
  enabled?: boolean;
  operating_cadence_mode?: string;
  cadence_discipline_level?: number;
  reflections_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  aipify_organizational_rhythms_operating_cadence_mission?: string;
  aipify_organizational_rhythms_operating_cadence_abos_principle?: string;
  aipify_organizational_rhythms_operating_cadence_engagement_summary?: AipifyOrganizationalRhythmsOperatingCadenceEngineEngagementSummary;
  aipify_organizational_rhythms_operating_cadence_note?: string;
  aipify_organizational_rhythms_operating_cadence_vision_note?: string;
};

export type AipifyOrganizationalRhythmsOperatingCadenceEngineDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  operating_cadence_mode?: string;
  cadence_discipline_level?: number;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  aipify_organizational_rhythms_operating_cadence_score?: number;
  executive_reviews_count?: number;
  reflections_count?: number;
  cadence_notes_count?: number;
  active_reflections_count?: number;
  era_phases_count?: number;
  executive_reviews: ExecutiveReview[];
  reflections: ReflectionEntry[];
  scaffold_notes: ScaffoldNote[];
  integration_links: IntegrationLink[];
  era_opener_summary?: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  aipify_organizational_rhythms_operating_cadence_blueprint?: AipifyOrganizationalRhythmsOperatingCadenceEngineBlueprint;
  aipify_organizational_rhythms_operating_cadence_mission?: string;
  aipify_organizational_rhythms_operating_cadence_philosophy?: string;
  aipify_organizational_rhythms_operating_cadence_abos_principle?: string;
  aipify_organizational_rhythms_operating_cadence_objectives?: BlueprintObjective[];
  center_meta?: Record<string, unknown>;
  engine_meta?: Record<string, unknown>;
  framework_meta?: Record<string, unknown>;
  executive_reviews_meta?: Record<string, unknown>;
  companion_meta?: Record<string, unknown>;
  sub_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  aorocebp210_integration_links?: IntegrationLink[];
  aorocebp210_era_opener_summary?: IntegrationLink[];
  aipify_organizational_rhythms_operating_cadence_engagement_summary?: AipifyOrganizationalRhythmsOperatingCadenceEngineEngagementSummary;
  aipify_organizational_rhythms_operating_cadence_success_criteria?: AbosSuccessCriterion[];
  aipify_organizational_rhythms_operating_cadence_vision?: string;
  aipify_organizational_rhythms_operating_cadence_vision_phrases?: string[];
  aipify_organizational_rhythms_operating_cadence_privacy_note?: string;
  aipify_organizational_rhythms_operating_cadence_dogfooding?: string;
  aipify_organizational_rhythms_operating_cadence_engine_note?: string;
  aipify_organizational_rhythms_operating_cadence_distinction_note?: string;
};
