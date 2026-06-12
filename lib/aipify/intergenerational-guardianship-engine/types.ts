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

export type ExecutiveGuardianshipReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  captured_at?: string;
};

export type ContinuityReflection = {
  id: string;
  reflection_key?: string;
  reflection_type?: string;
  title?: string;
  reflection_summary?: string;
  status?: string;
  created_at?: string;
};

export type LegacyResilienceEntry = {
  id: string;
  entry_key?: string;
  entry_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  created_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  must_not?: string[];
};

export type GuardianshipEngagementSummary = {
  guardianship_score?: number;
  enabled?: boolean;
  guardianship_mode?: string;
  executive_reviews_count?: number;
  continuity_reflections_count?: number;
  legacy_entries_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_ownership_control?: boolean;
  companion_does_not_define_values?: boolean;
};

export type IntergenerationalGuardianshipBlueprint = {
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
  guardianship_center?: Record<string, unknown>;
  human_continuity_engine?: Record<string, unknown>;
  intergenerational_responsibility_framework?: Record<string, unknown>;
  executive_guardianship_reviews?: Record<string, unknown>;
  guardianship_companion?: Record<string, unknown>;
  values_preservation_engine?: Record<string, unknown>;
  legacy_resilience_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: GuardianshipEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type IntergenerationalGuardianshipCard = {
  has_customer: boolean;
  guardianship_score?: number;
  enabled?: boolean;
  guardianship_mode?: string;
  executive_reviews_count?: number;
  philosophy?: string;
  continuity_reflection_enabled?: boolean;
  values_preservation_enabled?: boolean;
  human_oversight_required?: boolean;
  reflection_opt_in?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  intergenerational_guardianship_mission?: string;
  intergenerational_guardianship_abos_principle?: string;
  intergenerational_guardianship_engagement_summary?: GuardianshipEngagementSummary;
  intergenerational_guardianship_note?: string;
  intergenerational_guardianship_vision_note?: string;
};

export type IntergenerationalGuardianshipDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  guardianship_mode?: string;
  continuity_reflection_enabled?: boolean;
  values_preservation_enabled?: boolean;
  legacy_resilience_enabled?: boolean;
  executive_reviews_enabled?: boolean;
  human_oversight_required?: boolean;
  reflection_opt_in?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  guardianship_score?: number;
  executive_reviews_count?: number;
  continuity_reflections_count?: number;
  legacy_entries_count?: number;
  executive_reviews: ExecutiveGuardianshipReview[];
  continuity_reflections: ContinuityReflection[];
  legacy_entries: LegacyResilienceEntry[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  intergenerational_guardianship_blueprint?: IntergenerationalGuardianshipBlueprint;
  intergenerational_guardianship_mission?: string;
  intergenerational_guardianship_philosophy?: string;
  intergenerational_guardianship_abos_principle?: string;
  intergenerational_guardianship_objectives?: BlueprintObjective[];
  guardianship_center_meta?: Record<string, unknown>;
  human_continuity_engine_meta?: Record<string, unknown>;
  intergenerational_responsibility_framework_meta?: Record<string, unknown>;
  executive_guardianship_reviews_meta?: Record<string, unknown>;
  guardianship_companion_meta?: Record<string, unknown>;
  values_preservation_engine_meta?: Record<string, unknown>;
  legacy_resilience_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  ighcebp172_integration_links?: IntegrationLink[];
  intergenerational_guardianship_engagement_summary?: GuardianshipEngagementSummary;
  intergenerational_guardianship_success_criteria?: AbosSuccessCriterion[];
  intergenerational_guardianship_vision?: string;
  intergenerational_guardianship_vision_phrases?: string[];
  intergenerational_guardianship_privacy_note?: string;
  intergenerational_guardianship_dogfooding?: string;
  intergenerational_guardianship_engine_note?: string;
  intergenerational_guardianship_distinction_note?: string;
};
