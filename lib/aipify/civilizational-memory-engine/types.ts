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

export type MemoryArchive = {
  id: string;
  archive_key?: string;
  archive_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  cross_org_shareable?: boolean;
  captured_at?: string;
};

export type StewardshipReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  curation_signal?: string;
  captured_at?: string;
};

export type LegacyEntry = {
  id: string;
  entry_key?: string;
  entry_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  legacy_engine_cross_link?: boolean;
  captured_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  must_not?: string[];
};

export type CivilizationalMemoryEngagementSummary = {
  civilizational_memory_score?: number;
  preservation_readiness_level?: number;
  curation_stage?: string;
  archives_count?: number;
  stewardship_reviews_count?: number;
  legacy_entries_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  discernment_required?: boolean;
  not_digital_clutter?: boolean;
};

export type CivilizationalMemoryBlueprint = {
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
  civilizational_memory_center?: Record<string, unknown>;
  knowledge_preservation_engine?: Record<string, unknown>;
  wisdom_curation_framework?: Record<string, unknown>;
  institutional_memory_networks?: Record<string, unknown>;
  memory_companion?: Record<string, unknown>;
  knowledge_stewardship_engine?: Record<string, unknown>;
  legacy_library_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: CivilizationalMemoryEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type CivilizationalMemoryCard = {
  has_customer: boolean;
  civilizational_memory_score?: number;
  preservation_readiness_level?: number;
  archives_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  discernment_required?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  civilizational_memory_mission?: string;
  civilizational_memory_abos_principle?: string;
  civilizational_memory_engagement_summary?: CivilizationalMemoryEngagementSummary;
  civilizational_memory_note?: string;
  civilizational_memory_vision_note?: string;
};

export type CivilizationalMemoryDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  preservation_readiness_level?: number;
  curation_stage?: string;
  discernment_required?: boolean;
  cross_org_sharing_opt_in?: boolean;
  human_oversight_required?: boolean;
  governance_visibility?: string;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  civilizational_memory_score?: number;
  archives_count?: number;
  stewardship_reviews_count?: number;
  legacy_entries_count?: number;
  memory_archives: MemoryArchive[];
  stewardship_reviews: StewardshipReview[];
  legacy_entries: LegacyEntry[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  civilizational_memory_blueprint?: CivilizationalMemoryBlueprint;
  civilizational_memory_mission?: string;
  civilizational_memory_philosophy?: string;
  civilizational_memory_abos_principle?: string;
  civilizational_memory_objectives?: BlueprintObjective[];
  civilizational_memory_center_meta?: Record<string, unknown>;
  knowledge_preservation_engine_meta?: Record<string, unknown>;
  wisdom_curation_framework_meta?: Record<string, unknown>;
  institutional_memory_networks_meta?: Record<string, unknown>;
  memory_companion_meta?: Record<string, unknown>;
  knowledge_stewardship_engine_meta?: Record<string, unknown>;
  legacy_library_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  gcmebp163_integration_links?: IntegrationLink[];
  civilizational_memory_engagement_summary?: CivilizationalMemoryEngagementSummary;
  civilizational_memory_success_criteria?: AbosSuccessCriterion[];
  civilizational_memory_vision?: string;
  civilizational_memory_vision_phrases?: string[];
  civilizational_memory_privacy_note?: string;
  civilizational_memory_dogfooding?: string;
  civilizational_memory_engine_note?: string;
  civilizational_memory_distinction_note?: string;
};
