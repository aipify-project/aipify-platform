export type ProactiveCompanionCategoryKey =
  | "operational"
  | "support"
  | "knowledge"
  | "executive"
  | "team_awareness";

export type ProactiveCompanionNudge = {
  id?: string;
  category?: ProactiveCompanionCategoryKey | string;
  summary?: string;
  suggested_action?: string;
  priority?: string;
  status?: string;
  snoozed_until?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ProactiveCompanionSettings = {
  organization_id?: string;
  enabled?: boolean;
  enabled_categories?: string[];
  default_frequency?: string;
  default_communication_style?: string;
  default_channels?: string[];
  max_nudges_per_day?: number;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type ProactiveCompanionUserPreferences = {
  organization_id?: string;
  user_id?: string;
  frequency?: string;
  channels?: string[];
  quiet_hours?: Record<string, unknown>;
  enabled_categories?: string[];
  communication_style?: string;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type ProactiveCompanionAssistanceCategory = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type ProactiveCompanionStyleExample = {
  style?: string;
  example?: string;
  [key: string]: unknown;
};

export type ProactiveObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type ProactiveExampleCategory = {
  domain?: string;
  label?: string;
  signals?: string[];
};

export type ProactiveExamplesBlueprint = {
  principle?: string;
  categories?: ProactiveExampleCategory[];
};

export type CompanionExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type BlueprintBoundaries = {
  principle?: string;
  should_avoid?: string[];
  preserved_a79?: string[];
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_know?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type DogfoodingBlueprint = {
  principle?: string;
  aipify_group?: Record<string, unknown>;
  unonight?: Record<string, unknown>;
};

export type ProactiveEngagementSummary = {
  nudges_total?: number;
  pending_nudges?: number;
  snoozed_nudges?: number;
  acted_nudges?: number;
  dismissed_nudges?: number;
  nudges_last_30d?: number;
  categories_used?: number;
  audit_events_total?: number;
  dismissals_last_30d?: number;
  preference_changes?: number;
  engine_enabled?: boolean;
  max_nudges_per_day?: number;
  user_frequency?: string;
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
  prior_blueprint?: string;
  prior_doc?: string;
  route?: string;
  mapping_note?: string;
};

export type CompanionPresencePrinciples = {
  principle?: string;
  qualities?: string[];
  should_avoid?: string[];
  companion_presence_route?: string;
  companion_presence_phase?: string;
  orb_note?: string;
};

export type OperationalAwarenessDomain = {
  key?: string;
  label?: string;
  signals?: string[];
  route?: string;
};

export type OperationalAwareness = {
  principle?: string;
  domains?: OperationalAwarenessDomain[];
  workflow_phase?: number;
  workflow_route?: string;
  boundary?: string;
};

export type ConnectionExamples = {
  principle?: string;
  examples?: Array<{ emoji?: string; text?: string }>;
  route?: string;
  phase?: string | number;
  phases?: number[];
  boundary?: string;
  command_center_route?: string;
};

export type SelfLoveWellbeing = {
  principle?: string;
  practices?: string[];
  route?: string;
  phase?: string;
  ethics_route?: string;
  ethics_phase?: number;
  boundary_note?: string;
};

export type PresenceSettingsBlueprint = {
  principle?: string;
  proactive_companion_settings?: Array<Record<string, unknown>>;
  companion_presence_settings?: Array<Record<string, unknown>>;
  escalation?: Record<string, unknown>;
  tag_route?: string;
  tag_note?: string;
};

export type PresenceSummary = {
  pending_nudges?: number;
  snoozed_nudges?: number;
  nudges_last_30d?: number;
  categories_used?: number;
  connected_devices?: number;
  online_devices?: number;
  companion_indicator_enabled?: boolean;
  proactive_engine_enabled?: boolean;
  max_nudges_per_day?: number;
  privacy_note?: string;
};

export type ProactiveCompanionEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  pending_nudges?: number;
  enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: ProactiveEngagementSummary;
  presence_summary?: PresenceSummary;
  blueprint_note?: string;
  [key: string]: unknown;
};

export type ProactiveCompanionEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  self_love_note?: string;
  distinction_note?: string;
  assistance_categories?: ProactiveCompanionAssistanceCategory[];
  companion_style_examples?: ProactiveCompanionStyleExample[];
  boundaries?: string[];
  settings?: ProactiveCompanionSettings;
  user_preferences?: ProactiveCompanionUserPreferences;
  preference_summary?: Record<string, unknown>;
  active_nudges?: ProactiveCompanionNudge[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  implementation_blueprint?: ImplementationBlueprintMeta;
  proactive_assistance_note?: string;
  blueprint_philosophy?: string;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  vision?: string;
  blueprint_distinction_note?: string;
  proactive_objectives?: ProactiveObjective[];
  proactive_examples?: ProactiveExamplesBlueprint;
  companion_examples?: CompanionExample[];
  blueprint_boundaries?: BlueprintBoundaries;
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: ProactiveEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
  companion_presence_mission?: string;
  companion_presence_philosophy?: string;
  companion_presence_abos_principle?: string;
  phase56_distinction_note?: string;
  companion_presence_principles?: CompanionPresencePrinciples;
  phase56_objectives?: ProactiveObjective[];
  proactive_support_examples?: CompanionExample[];
  operational_awareness?: OperationalAwareness;
  sales_expert_connection?: ConnectionExamples;
  executive_connection?: ConnectionExamples;
  self_love_wellbeing?: SelfLoveWellbeing;
  presence_settings?: PresenceSettingsBlueprint;
  presence_summary?: PresenceSummary;
  phase56_trust_connection?: TrustConnection;
  phase56_dogfooding?: DogfoodingBlueprint;
  phase56_success_criteria?: AbosSuccessCriterion[];
  phase56_vision_phrases?: string[];
  phase56_integration_links?: IntegrationLink[];
  [key: string]: unknown;
};

export type ProactiveCompanionExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  settings?: ProactiveCompanionSettings;
  preference_summary?: Record<string, unknown>;
  assistance_categories?: ProactiveCompanionAssistanceCategory[];
  boundaries?: string[];
  active_nudges?: ProactiveCompanionNudge[];
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
