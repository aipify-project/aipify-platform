export type GratitudeMomentTypeInfo = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type RedRoseExchangeLine = {
  role?: string;
  text?: string;
  [key: string]: unknown;
};

export type RedRoseMoment = {
  trigger_phrase?: string;
  example_exchange?: RedRoseExchangeLine[];
  feature_description?: string;
  digital_rose_symbol?: string;
  [key: string]: unknown;
};

export type BoundaryPhrases = {
  avoid?: string[] | unknown[];
  prefer?: string[] | unknown[];
  [key: string]: unknown;
};

export type GratitudeMoment = {
  id?: string;
  moment_type?: string;
  summary?: string;
  recognition_target_role?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type RecentRosesSummary = {
  count?: number;
  last_sent_at?: string | null;
  [key: string]: unknown;
};

export type SuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
  [key: string]: unknown;
};

export type RecognitionCategory = {
  key?: string;
  label?: string;
  focus?: string[];
  moment_type_keys?: string[];
  examples?: string[];
  [key: string]: unknown;
};

export type BellMomentsBlueprint = {
  emoji?: string;
  label?: string;
  principle?: string;
  frequency_note?: string;
  examples?: Array<{ key?: string; text?: string; [key: string]: unknown }>;
  disabled_when?: string[];
  [key: string]: unknown;
};

export type RecognitionRosesBlueprint = {
  emoji?: string;
  label?: string;
  principle?: string;
  boundary_note?: string;
  examples?: Array<{ key?: string; text?: string; [key: string]: unknown }>;
  digital_rose_symbol?: string;
  [key: string]: unknown;
};

export type SelfRecognitionBlueprint = {
  principle?: string;
  examples?: string[];
  target_role?: string;
  self_love_note?: string;
  [key: string]: unknown;
};

export type SelfLoveConnection = {
  principle?: string;
  not_a_toggle?: boolean;
  influences?: string[];
  naming_doc?: string;
  boundary_note?: string;
  [key: string]: unknown;
};

export type TrustConnection = {
  principle?: string;
  prefer?: string[];
  avoid?: string[];
  audit_note?: string;
  [key: string]: unknown;
};

export type OrgConfigurationBoundaries = {
  configurable?: Array<{ key?: string; label?: string; via?: string; [key: string]: unknown }>;
  consistent?: string[];
  boundary_note?: string;
  [key: string]: unknown;
};

export type ImplementationBlueprintMeta = {
  phase?: string | number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  [key: string]: unknown;
};

export type GratitudeRecognitionSettings = {
  organization_id?: string;
  enabled?: boolean;
  digital_rose_enabled?: boolean;
  gratitude_moments_enabled?: boolean;
  redirect_romantic_language?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type GratitudeRecognitionCard = {
  has_organization: boolean;
  philosophy?: string;
  moment_count?: number;
  rose_count?: number;
  pending_moments?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type HumanMomentsObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
  [key: string]: unknown;
};

export type HumanMomentsCompanionExample = {
  emoji?: string;
  key?: string;
  text?: string;
  example?: string;
  [key: string]: unknown;
};

export type HumanMomentsBlueprintSection = {
  emoji?: string;
  label?: string;
  principle?: string;
  examples?: HumanMomentsCompanionExample[] | string[];
  companion_examples?: HumanMomentsCompanionExample[];
  milestones?: Array<{ years?: number; label?: string; example?: string; [key: string]: unknown }>;
  avoid?: string[];
  settings_keys?: string[];
  settings_key?: string;
  future_scaffold?: string;
  boundary?: string;
  tiers?: Array<{ key?: string; label?: string; route?: string; [key: string]: unknown }>;
  controls?: Array<{ key?: string; label?: string; [key: string]: unknown }>;
  qualities?: string[];
  practices?: string[];
  cultural_note?: string;
  trust_note?: string;
  settings_table?: string;
  consent_required?: boolean;
  [key: string]: unknown;
};

export type HumanMomentsSettings = {
  id?: string;
  organization_id?: string;
  user_id?: string;
  birthday_visible?: boolean;
  birthday_notifications_enabled?: boolean;
  anniversary_visible?: boolean;
  anniversary_notifications_enabled?: boolean;
  certification_celebrations_enabled?: boolean;
  community_contributions_visible?: boolean;
  personal_achievements_visible?: boolean;
  sales_milestones_visible?: boolean;
  display_preference?: string;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type HumanMomentsSummary = {
  human_moment_count?: number;
  celebration_counts_by_category?: Record<string, number>;
  consent_summary?: Record<string, number>;
  privacy_note?: string;
  summary_text?: string;
  [key: string]: unknown;
};

export type IntegrationLinkItem = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  [key: string]: unknown;
};

export type OrganizationalRecognitionObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
  [key: string]: unknown;
};

export type OrganizationalRecognitionMomentCategory = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
  cross_link?: string;
  [key: string]: unknown;
};

export type CompanionRecognitionPrompt = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
  [key: string]: unknown;
};

export type OrganizationalRecognitionSection = {
  emoji?: string;
  label?: string;
  principle?: string;
  categories?: OrganizationalRecognitionMomentCategory[];
  prompts?: CompanionRecognitionPrompt[];
  gestures?: Array<{ key?: string; label?: string; emoji?: string; description?: string; [key: string]: unknown }>;
  practices?: Array<{ emoji?: string; key?: string; label?: string; description?: string; [key: string]: unknown }> | string[];
  dimensions?: Array<{ emoji?: string; key?: string; label?: string; description?: string; [key: string]: unknown }>;
  milestones?: Array<{ emoji?: string; key?: string; label?: string; description?: string; [key: string]: unknown }>;
  insights?: Array<{ emoji?: string; key?: string; label?: string; description?: string; [key: string]: unknown }>;
  quotes?: string[];
  must_avoid?: string[];
  required?: string[];
  users_should_see?: string[];
  operators_should_understand?: string[];
  boundary_note?: string;
  [key: string]: unknown;
};

export type OrganizationalRecognitionSummary = {
  organizational_recognition_count?: number;
  rose_count?: number;
  pending_recognition_moments?: number;
  recognition_counts_by_category?: Record<string, number>;
  companion_prompts_documented?: number;
  privacy_note?: string;
  summary_text?: string;
  [key: string]: unknown;
};

export type OrganizationalRecognitionAppreciationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: OrganizationalRecognitionObjective[];
  recognition_moments?: OrganizationalRecognitionSection;
  companion_recognition_prompts?: OrganizationalRecognitionSection;
  peer_recognition?: OrganizationalRecognitionSection;
  leadership_recognition?: OrganizationalRecognitionSection;
  customer_appreciation?: OrganizationalRecognitionSection;
  sales_expert_recognition?: OrganizationalRecognitionSection;
  self_love_connection?: OrganizationalRecognitionSection;
  leadership_insights?: OrganizationalRecognitionSection;
  trust_connection?: OrganizationalRecognitionSection;
  privacy_principles?: OrganizationalRecognitionSection;
  dogfooding?: Record<string, unknown>;
  success_criteria?: SuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLinkItem[];
  recognition_summary?: OrganizationalRecognitionSummary;
  privacy_note?: string;
  [key: string]: unknown;
};

export type GratitudeRecognitionDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  implementation_blueprint_phase53?: ImplementationBlueprintMeta;
  implementation_blueprint_phase97?: ImplementationBlueprintMeta;
  gratitude_recognition_engine_note?: string;
  recognition_categories?: RecognitionCategory[];
  bell_moments?: BellMomentsBlueprint;
  recognition_roses?: RecognitionRosesBlueprint;
  self_recognition?: SelfRecognitionBlueprint;
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  org_configuration_boundaries?: OrgConfigurationBoundaries;
  dogfooding?: Record<string, unknown>;
  success_criteria?: SuccessCriterion[];
  vision_phrases?: string[];
  gratitude_moment_types?: GratitudeMomentTypeInfo[];
  red_rose_moment?: RedRoseMoment;
  boundary_phrases?: BoundaryPhrases;
  self_love_note?: string;
  trust_note?: string;
  settings?: GratitudeRecognitionSettings;
  recent_moments?: GratitudeMoment[];
  recent_roses?: RecentRosesSummary;
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  human_moments_mission?: string;
  human_moments_philosophy?: string;
  human_moments_abos_principle?: string;
  human_moments_objectives?: HumanMomentsObjective[];
  birthday_experiences?: HumanMomentsBlueprintSection;
  professional_anniversaries?: HumanMomentsBlueprintSection;
  certification_celebrations?: HumanMomentsBlueprintSection;
  community_contributions?: HumanMomentsBlueprintSection;
  human_moments_self_love_connection?: HumanMomentsBlueprintSection;
  companion_principles?: HumanMomentsBlueprintSection;
  privacy_principles?: HumanMomentsBlueprintSection;
  human_moments_settings?: HumanMomentsSettings;
  human_moments_summary?: HumanMomentsSummary;
  human_moments_dogfooding?: Record<string, unknown>;
  lehmbp_integration_links?: IntegrationLinkItem[];
  human_moments_success_criteria?: SuccessCriterion[];
  human_moments_vision_phrases?: string[];
  human_moments_distinction_note?: string;
  organizational_recognition_engine_note?: string;
  organizational_recognition_appreciation_blueprint?: OrganizationalRecognitionAppreciationBlueprint;
  organizational_recognition_distinction_note?: string;
  organizational_recognition_mission?: string;
  organizational_recognition_philosophy?: string;
  organizational_recognition_abos_principle?: string;
  organizational_recognition_objectives?: OrganizationalRecognitionObjective[];
  recognition_moments?: OrganizationalRecognitionSection;
  companion_recognition_prompts?: OrganizationalRecognitionSection;
  peer_recognition?: OrganizationalRecognitionSection;
  leadership_recognition?: OrganizationalRecognitionSection;
  customer_appreciation?: OrganizationalRecognitionSection;
  sales_expert_recognition?: OrganizationalRecognitionSection;
  organizational_self_love_connection?: OrganizationalRecognitionSection;
  leadership_insights?: OrganizationalRecognitionSection;
  organizational_trust_connection?: OrganizationalRecognitionSection;
  organizational_privacy_principles?: OrganizationalRecognitionSection;
  organizational_recognition_dogfooding?: Record<string, unknown>;
  oraebp97_integration_links?: IntegrationLinkItem[];
  organizational_recognition_summary?: OrganizationalRecognitionSummary;
  organizational_recognition_success_criteria?: SuccessCriterion[];
  organizational_recognition_vision?: string;
  organizational_recognition_vision_phrases?: string[];
  organizational_recognition_privacy_note?: string;
  [key: string]: unknown;
};

export type GratitudeRecognitionExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  gratitude_moment_types?: GratitudeMomentTypeInfo[];
  red_rose_moment?: RedRoseMoment;
  boundary_phrases?: BoundaryPhrases;
  self_love_note?: string;
  trust_note?: string;
  settings?: GratitudeRecognitionSettings;
  recent_moments?: GratitudeMoment[];
  recent_roses?: RecentRosesSummary;
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type DigitalRoseResult = {
  success?: boolean;
  rose_id?: string;
  recipient_display_label?: string;
  message_summary?: string;
  rose_sent_at?: string;
  [key: string]: unknown;
};
