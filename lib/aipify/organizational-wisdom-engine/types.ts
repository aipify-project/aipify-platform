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
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  relationship?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  required?: string[];
  boundary_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  route?: string;
  boundary_note?: string;
};

export type ReflectionWorkspace = {
  id?: string;
  workspace_key?: string;
  title?: string;
  reflection_topic?: string;
  status?: string;
  cross_link_route?: string;
};

export type EthicsReview = {
  id?: string;
  review_key?: string;
  workspace_key?: string;
  title?: string;
  who_benefits_summary?: string;
  who_harmed_summary?: string;
  status?: string;
};

export type CultureSnapshot = {
  id?: string;
  snapshot_key?: string;
  theme_area?: string;
  title?: string;
  theme_summary?: string;
  signal_strength?: string;
  status?: string;
};

export type WisdomPractice = {
  id?: string;
  practice_key?: string;
  practice_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  cross_link_route?: string;
};

export type EngagementSummary = {
  wisdom_maturity_score?: number;
  active_reflection_workspaces?: number;
  ethics_reviews?: number;
  culture_theme_snapshots?: number;
  wisdom_practices_count?: number;
  wisdom_center_capabilities_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
};

export type OrganizationalWisdomBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  wisdom_center?: Record<string, unknown>;
  ethical_intelligence_engine?: Record<string, unknown>;
  values_alignment_engine?: Record<string, unknown>;
  multi_perspective_framework?: Record<string, unknown>;
  wisdom_companion?: Record<string, unknown>;
  decision_ethics_review?: Record<string, unknown>;
  culture_insight_engine?: Record<string, unknown>;
  wisdom_practices_library?: Record<string, unknown>;
  companion_limitations?: Record<string, unknown>;
  self_love_in_wisdom?: SelfLoveConnection;
  ethical_governance_integration?: Record<string, unknown>;
  cross_links?: IntegrationLink[];
  limitation_principles?: LimitationPrinciples;
  companion_adaptation?: Record<string, unknown>;
  success_metrics?: Array<Record<string, unknown>>;
  engagement_summary?: EngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
};

export type OrganizationalWisdomCard = {
  has_customer: boolean;
  wisdom_maturity_score?: number;
  active_reflection_workspaces?: number;
  ethics_reviews?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  wisdom_center_enabled?: boolean;
  implementation_blueprint_phase129?: ImplementationBlueprintMeta;
  organizational_wisdom_mission?: string;
  organizational_wisdom_abos_principle?: string;
  organizational_wisdom_engagement_summary?: EngagementSummary;
  organizational_wisdom_vision_note?: string;
  [key: string]: unknown;
};

export type OrganizationalWisdomDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  wisdom_center_enabled?: boolean;
  ethical_reflection_enabled?: boolean;
  values_alignment_enabled?: boolean;
  decision_reflection_enabled?: boolean;
  perspective_expansion_enabled?: boolean;
  governance_integration_enabled?: boolean;
  culture_insights_enabled?: boolean;
  philosophy?: string;
  distinction_note?: string;
  safety_note?: string;
  wisdom_maturity_score?: number;
  active_reflection_workspaces?: number;
  ethics_reviews?: number;
  culture_theme_snapshots?: number;
  wisdom_practices_count?: number;
  wisdom_center_capabilities_count?: number;
  ethical_questions_count?: number;
  values_dimensions_count?: number;
  perspective_groups_count?: number;
  reflection_workspaces: ReflectionWorkspace[];
  ethics_reviews_list: EthicsReview[];
  culture_snapshots: CultureSnapshot[];
  wisdom_practices: WisdomPractice[];
  ethical_question_scaffolds?: Array<Record<string, unknown>>;
  values_dimension_scaffolds?: Array<Record<string, unknown>>;
  perspective_group_scaffolds?: Array<Record<string, unknown>>;
  decision_ethics_prompt_scaffolds?: Array<Record<string, unknown>>;
  culture_insight_area_scaffolds?: Array<Record<string, unknown>>;
  wisdom_practice_scaffolds?: Array<Record<string, unknown>>;
  integration_links?: IntegrationLink[];
  implementation_blueprint_phase129?: ImplementationBlueprintMeta;
  organizational_wisdom_blueprint?: OrganizationalWisdomBlueprint;
  organizational_wisdom_mission?: string;
  organizational_wisdom_philosophy?: string;
  organizational_wisdom_abos_principle?: string;
  organizational_wisdom_objectives?: BlueprintObjective[];
  wisdom_center?: Record<string, unknown>;
  ethical_intelligence_engine?: Record<string, unknown>;
  values_alignment_engine?: Record<string, unknown>;
  multi_perspective_framework?: Record<string, unknown>;
  wisdom_companion?: Record<string, unknown>;
  decision_ethics_review?: Record<string, unknown>;
  culture_insight_engine?: Record<string, unknown>;
  wisdom_practices_library?: Record<string, unknown>;
  companion_limitations?: Record<string, unknown>;
  self_love_in_wisdom?: SelfLoveConnection;
  ethical_governance_integration?: Record<string, unknown>;
  owebp129_cross_links?: IntegrationLink[];
  limitation_principles?: LimitationPrinciples;
  companion_adaptation?: Record<string, unknown>;
  engagement_summary?: EngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  success_metrics?: Array<Record<string, unknown>>;
  organizational_wisdom_vision?: string;
  privacy_note?: string;
  [key: string]: unknown;
};
