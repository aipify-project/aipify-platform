export type OrganizationStatedValue = {
  id?: string;
  value_key?: string;
  label?: string;
  description?: string;
  operational_hints?: string[] | unknown[];
  sort_order?: number;
  active?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ValuesAlignmentSignal = {
  id?: string;
  value_key?: string;
  signal_type?: string;
  summary?: string;
  alignment_score?: number | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type ValuesReflection = {
  id?: string;
  prompt?: string;
  context_summary?: string | null;
  suggested_considerations?: string[] | unknown[];
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type PurposeValuesSettings = {
  organization_id?: string;
  enabled?: boolean;
  purpose_statement?: string | null;
  purpose_questions?: string[] | unknown[];
  celebrate_value_aligned_wins?: boolean;
  reflection_enabled?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type PurposeFrameworkItem = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type ExampleValue = {
  value_key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type ValuesAssistanceExample = {
  value_key?: string;
  example?: string;
  [key: string]: unknown;
};

export type DecisionSupportExample = {
  prompt?: string;
  consideration?: string;
  [key: string]: unknown;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type PurposeDiscoveryQuestion = {
  emoji?: string;
  key?: string;
  question?: string;
  description?: string;
};

export type PurposeDiscovery = {
  principle?: string;
  questions?: PurposeDiscoveryQuestion[];
};

export type ValuesExploration = {
  principle?: string;
  dimensions?: BlueprintObjective[];
  example_values?: string[];
};

export type ValueInAction = {
  value_key?: string;
  label?: string;
  behaviors?: string[];
};

export type DecisionAlignmentPrompt = {
  emoji?: string;
  prompt?: string;
  consideration?: string;
};

export type DecisionAlignment = {
  principle?: string;
  prompts?: DecisionAlignmentPrompt[];
};

export type OrganizationalStorytelling = {
  principle?: string;
  story_types?: BlueprintObjective[];
  metadata_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  boundary_note?: string;
};

export type LeadershipInsights = {
  principle?: string;
  insight_types?: BlueprintObjective[];
  dialogue_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type DogfoodingBlueprint = {
  principle?: string;
  aipify_group?: Record<string, unknown>;
  unonight?: Record<string, unknown>;
};

export type PurposeValuesEngagementSummary = {
  active_stated_values?: number;
  recent_alignment_signals?: number;
  pending_reflections?: number;
  has_purpose_statement?: boolean;
  purpose_discovery_questions?: number;
  values_in_action_examples?: number;
  privacy_note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type PurposeValuesEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_values?: number;
  pending_reflections?: number;
  enabled?: boolean;
  implementation_blueprint_phase64?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: PurposeValuesEngagementSummary;
  blueprint_note?: string;
  values_note?: string;
  [key: string]: unknown;
};

export type PurposeValuesEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  purpose_framework?: PurposeFrameworkItem[];
  example_values?: ExampleValue[];
  values_aware_assistance_examples?: ValuesAssistanceExample[];
  decision_support_examples?: DecisionSupportExample[];
  culture_support_areas?: string[];
  self_love_note?: string;
  trust_engine_note?: string;
  growth_evolution_note?: string;
  settings?: PurposeValuesSettings;
  stated_values?: OrganizationStatedValue[];
  recent_signals?: ValuesAlignmentSignal[];
  pending_reflections?: ValuesReflection[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  implementation_blueprint_phase64?: ImplementationBlueprintMeta;
  purpose_values_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_objectives?: BlueprintObjective[];
  purpose_discovery?: PurposeDiscovery;
  values_exploration?: ValuesExploration;
  values_in_action?: ValueInAction[];
  decision_alignment?: DecisionAlignment;
  organizational_storytelling?: OrganizationalStorytelling;
  self_love_connection?: SelfLoveConnection;
  leadership_insights?: LeadershipInsights;
  trust_connection?: TrustConnection;
  dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: PurposeValuesEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
  [key: string]: unknown;
};

export type PurposeValuesExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  settings?: PurposeValuesSettings;
  purpose_framework?: PurposeFrameworkItem[];
  stated_values?: OrganizationStatedValue[];
  recent_signals?: ValuesAlignmentSignal[];
  pending_reflections?: ValuesReflection[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
