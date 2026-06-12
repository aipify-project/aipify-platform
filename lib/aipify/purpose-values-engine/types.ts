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

export type ReflectionQuestionSet = {
  principle?: string;
  questions?: PurposeDiscoveryQuestion[];
  reflection_note?: string;
};

export type CulturalObservation = {
  emoji?: string;
  key?: string;
  label?: string;
  description?: string;
};

export type CulturalObservations = {
  principle?: string;
  observations?: CulturalObservation[];
  boundary_note?: string;
};

export type OnboardingConnection = {
  principle?: string;
  practices?: string[];
  install_route?: string;
  eke_route?: string;
  boundary_note?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type CompanionGuidance = {
  principle?: string;
  companion_name?: string;
  not_label?: string;
  examples?: CompanionGuidanceExample[];
  boundary_note?: string;
};

export type RecognitionConnection = {
  principle?: string;
  dimensions?: BlueprintObjective[];
  gratitude_route?: string;
  boundary_note?: string;
};

export type LeadershipConnection = {
  principle?: string;
  practices?: string[];
  strategic_alignment_route?: string;
  boundary_note?: string;
};

export type PrivacyPrinciples = {
  principle?: string;
  forbidden?: string[];
  required?: string[];
  boundary_note?: string;
};

export type PurposeValuesCulturalAlignmentBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  purpose_questions?: ReflectionQuestionSet;
  values_reflection_questions?: ReflectionQuestionSet;
  cultural_observations?: CulturalObservations;
  onboarding_connection?: OnboardingConnection;
  companion_guidance?: CompanionGuidance;
  recognition_connection?: RecognitionConnection;
  self_love_connection?: SelfLoveConnection;
  leadership_connection?: LeadershipConnection;
  trust_connection?: TrustConnection;
  privacy_principles?: PrivacyPrinciples;
  dogfooding?: DogfoodingBlueprint;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: Record<string, unknown>;
  privacy_note?: string;
};

export type CulturalAlignmentEngagementSummary = {
  purpose_questions?: number;
  values_reflection_questions?: number;
  cultural_observations?: number;
  companion_guidance_examples?: number;
  recognition_dimensions?: number;
  privacy_forbidden_count?: number;
  integration_links?: number;
  phase64_engagement?: PurposeValuesEngagementSummary;
  privacy_note?: string;
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
  implementation_blueprint_phase95?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: PurposeValuesEngagementSummary;
  blueprint_note?: string;
  values_note?: string;
  cultural_alignment_mission?: string;
  cultural_alignment_abos_principle?: string;
  cultural_alignment_engagement_summary?: CulturalAlignmentEngagementSummary;
  cultural_alignment_note?: string;
  cultural_alignment_vision_note?: string;
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
  implementation_blueprint_phase95?: ImplementationBlueprintMeta;
  purpose_values_cultural_alignment_note?: string;
  purpose_values_cultural_alignment_blueprint?: PurposeValuesCulturalAlignmentBlueprint;
  cultural_alignment_distinction_note?: string;
  cultural_alignment_mission?: string;
  cultural_alignment_philosophy?: string;
  cultural_alignment_abos_principle?: string;
  cultural_alignment_objectives?: BlueprintObjective[];
  cultural_alignment_purpose_questions?: ReflectionQuestionSet;
  cultural_alignment_values_reflection_questions?: ReflectionQuestionSet;
  cultural_alignment_cultural_observations?: CulturalObservations;
  cultural_alignment_onboarding_connection?: OnboardingConnection;
  cultural_alignment_companion_guidance?: CompanionGuidance;
  cultural_alignment_recognition_connection?: RecognitionConnection;
  cultural_alignment_self_love_connection?: SelfLoveConnection;
  cultural_alignment_leadership_connection?: LeadershipConnection;
  cultural_alignment_trust_connection?: TrustConnection;
  cultural_alignment_privacy_principles?: PrivacyPrinciples;
  cultural_alignment_dogfooding?: DogfoodingBlueprint;
  cultural_alignment_integration_links?: IntegrationLink[];
  cultural_alignment_engagement_summary?: CulturalAlignmentEngagementSummary;
  cultural_alignment_success_criteria?: AbosSuccessCriterion[];
  cultural_alignment_vision?: string;
  cultural_alignment_vision_phrases?: string[];
  cultural_alignment_privacy_note?: string;
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
