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

export type DialogueReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  dialogue_signal?: string;
  captured_at?: string;
};

export type DialogueProgram = {
  id: string;
  program_key?: string;
  program_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  dialogue_signal?: string;
  captured_at?: string;
};

export type DialogueMemoryEntry = {
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

export type ConstructiveDialogueEngagementSummary = {
  constructive_dialogue_score?: number;
  dialogue_readiness_level?: number;
  dialogue_maturity_stage?: string;
  dialogue_programs_count?: number;
  dialogue_reviews_count?: number;
  dialogue_memory_count?: number;
  era_phases_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_forced_agreement?: boolean;
  not_dialogue_surveillance?: boolean;
};

export type ConstructiveDialogueBlueprint = {
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
  constructive_dialogue_center?: Record<string, unknown>;
  peacebuilding_engine?: Record<string, unknown>;
  conflict_navigation_framework?: Record<string, unknown>;
  executive_dialogue_reviews?: Record<string, unknown>;
  dialogue_companion?: Record<string, unknown>;
  perspective_expansion_engine?: Record<string, unknown>;
  relationship_resilience_engine?: Record<string, unknown>;
  dialogue_memory_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: ConstructiveDialogueEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type ConstructiveDialogueCard = {
  has_customer: boolean;
  constructive_dialogue_score?: number;
  dialogue_readiness_level?: number;
  dialogue_reviews_count?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  reflection_opt_in?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  constructive_dialogue_mission?: string;
  constructive_dialogue_abos_principle?: string;
  constructive_dialogue_engagement_summary?: ConstructiveDialogueEngagementSummary;
  constructive_dialogue_note?: string;
  constructive_dialogue_vision_note?: string;
};

export type ConstructiveDialogueDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  dialogue_readiness_level?: number;
  dialogue_maturity_stage?: string;
  reflection_opt_in?: boolean;
  human_oversight_required?: boolean;
  governance_visibility?: string;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  constructive_dialogue_score?: number;
  dialogue_programs_count?: number;
  dialogue_reviews_count?: number;
  dialogue_memory_count?: number;
  dialogue_programs: DialogueProgram[];
  dialogue_reviews: DialogueReview[];
  dialogue_memory_entries: DialogueMemoryEntry[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  constructive_dialogue_blueprint?: ConstructiveDialogueBlueprint;
  constructive_dialogue_mission?: string;
  constructive_dialogue_philosophy?: string;
  constructive_dialogue_abos_principle?: string;
  constructive_dialogue_objectives?: BlueprintObjective[];
  constructive_dialogue_center_meta?: Record<string, unknown>;
  peacebuilding_engine_meta?: Record<string, unknown>;
  conflict_navigation_framework_meta?: Record<string, unknown>;
  executive_dialogue_reviews_meta?: Record<string, unknown>;
  dialogue_companion_meta?: Record<string, unknown>;
  perspective_expansion_engine_meta?: Record<string, unknown>;
  relationship_resilience_engine_meta?: Record<string, unknown>;
  dialogue_memory_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  cpdebp168_integration_links?: IntegrationLink[];
  constructive_dialogue_engagement_summary?: ConstructiveDialogueEngagementSummary;
  constructive_dialogue_success_criteria?: AbosSuccessCriterion[];
  constructive_dialogue_vision?: string;
  constructive_dialogue_vision_phrases?: string[];
  constructive_dialogue_privacy_note?: string;
  constructive_dialogue_dogfooding?: string;
  constructive_dialogue_engine_note?: string;
  constructive_dialogue_distinction_note?: string;
};
