export type IdentityTrait = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type SignatureElement = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type ModuleConsistencyEntry = {
  id?: string;
  module_key?: string;
  label?: string;
  route?: string;
  identity_aligned?: boolean;
  last_reviewed_at?: string | null;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type FoxExchangeExample = {
  title?: string;
  setup?: string;
  response?: string;
  note?: string;
  [key: string]: unknown;
};

export type SuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
  [key: string]: unknown;
};

export type CompanionCharacteristic = {
  key?: string;
  emoji?: string;
  label?: string;
  description?: string;
  route?: string | null;
  doc?: string;
  phase?: string;
  principle_note?: string;
  [key: string]: unknown;
};

export type CommunicationStandard = {
  key?: string;
  label?: string;
  rule?: string;
  [key: string]: unknown;
};

export type PlayfulMoment = {
  key?: string;
  emoji?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type SelfLoveImplementation = {
  principle?: string;
  not_a_toggle?: boolean;
  boundary_note?: string;
  influences?: string[];
  naming_doc?: string;
  [key: string]: unknown;
};

export type CompanionMemoryRules = {
  principle?: string;
  allowed?: string[];
  forbidden?: string[];
  metadata_only?: boolean;
  [key: string]: unknown;
};

export type OrgConfigurationBoundaries = {
  configurable?: { key?: string; label?: string; via?: string }[];
  consistent?: string[];
  boundary_note?: string;
  [key: string]: unknown;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  distinction?: string;
  [key: string]: unknown;
};

export type LabelReplacement = {
  avoid?: string;
  use?: string;
  example?: string;
  old?: string;
  new?: string;
  [key: string]: unknown;
};

export type FaqItem = {
  key?: string;
  question?: string;
  answer?: string;
  [key: string]: unknown;
};

export type AipifyFirstLanguagePolicy = {
  doc?: string;
  distinction_note?: string;
  core_principle?: string;
  marketing_principle?: string;
  abos_principle?: string;
  label_replacements?: LabelReplacement[];
  applies_to_surfaces?: string[];
  technical_exceptions?: string[];
  companion_phrases?: string[];
  implementation_requirements?: string[];
  faq_items?: FaqItem[];
  vision_phrases?: string[];
  support_panel_examples?: LabelReplacement[];
  companion_naming_policy?: CompanionNamingPolicy;
  cross_links?: string[];
  ilm_corpus?: string;
  ilm_module?: string;
  kc_faq?: string;
  [key: string]: unknown;
};

export type CompanionNamingPolicy = {
  doc?: string;
  principle?: string;
  label_replacements?: LabelReplacement[];
  support_panel_examples?: LabelReplacement[];
  companion_philosophy?: string[];
  vision_phrases?: string[];
  faq_items?: FaqItem[];
  [key: string]: unknown;
};

export type CapabilityGapExamples = {
  avoid?: string[];
  prefer?: string[];
  [key: string]: unknown;
};

export type CompanionIdentitySettings = {
  organization_id?: string;
  enabled?: boolean;
  signature_elements_enabled?: boolean;
  bell_moments_enabled?: boolean;
  self_love_refs_enabled?: boolean;
  playful_when_appropriate?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type HumanPartnershipQuestion = {
  emoji?: string;
  key?: string;
  question?: string;
  description?: string;
};

export type HumanPartnershipObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type HumanPartnershipEvolutionStage = {
  stage?: number;
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type HumanPartnershipBlueprintSection = {
  principle?: string;
  questions?: HumanPartnershipQuestion[];
  reflection_note?: string;
  principles?: Array<{ key?: string; label?: string; emoji?: string; description?: string }>;
  dimensions?: Array<{ key?: string; label?: string; description?: string }>;
  stages?: HumanPartnershipEvolutionStage[];
  examples?: Array<{ emoji?: string; key?: string; prompt?: string; consideration?: string }>;
  encourage?: string[];
  avoid?: string[];
  quotes?: string[];
  practices?: string[];
  routes?: Record<string, string>;
  organizations_should_understand?: string[];
  leaders_should_know?: string[];
  forbidden?: string[];
  required?: string[];
  boundary_note?: string;
  progression_note?: string;
  journey_phrase?: string;
  route?: string;
  phase?: string;
  audit_note?: string;
  [key: string]: unknown;
};

export type HumanPartnershipIntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type HumanPartnershipEngagementSummary = {
  modules_tracked?: number;
  modules_aligned?: number;
  companion_identity_enabled?: boolean;
  objectives_count?: number;
  partnership_questions_count?: number;
  evolution_principles_count?: number;
  personalization_dimensions_count?: number;
  relationship_stages_count?: number;
  companion_guidance_examples?: number;
  integration_links_count?: number;
  privacy_note?: string;
};

export type HumanAiPartnershipCompanionEvolutionBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: HumanPartnershipObjective[];
  partnership_questions?: HumanPartnershipBlueprintSection;
  companion_evolution_principles?: HumanPartnershipBlueprintSection;
  personalization_principles?: HumanPartnershipBlueprintSection;
  healthy_dependency_principles?: HumanPartnershipBlueprintSection;
  companion_guidance?: HumanPartnershipBlueprintSection;
  relationship_evolution_stages?: HumanPartnershipBlueprintSection;
  self_love_connection?: HumanPartnershipBlueprintSection;
  leadership_connection?: HumanPartnershipBlueprintSection;
  trust_connection?: HumanPartnershipBlueprintSection;
  privacy_principles?: HumanPartnershipBlueprintSection;
  dogfooding?: Record<string, unknown>;
  success_criteria?: SuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: HumanPartnershipIntegrationLink[];
  engagement_summary?: HumanPartnershipEngagementSummary;
  privacy_note?: string;
};

export type CompanionIdentityEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  modules_tracked?: number;
  modules_aligned?: number;
  enabled?: boolean;
  learning_journey_philosophy?: string;
  vision_rose_phrase?: string;
  learning_journey_standard_note?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  companion_identity_engine_note?: string;
  companion_naming_policy?: CompanionNamingPolicy;
  aipify_first_language_policy?: AipifyFirstLanguagePolicy;
  implementation_blueprint_phase99?: ImplementationBlueprintMeta;
  human_partnership_mission?: string;
  human_partnership_vision?: string;
  human_partnership_abos_principle?: string;
  human_partnership_engagement_summary?: HumanPartnershipEngagementSummary;
  human_partnership_note?: string;
  human_partnership_distinction_note?: string;
  [key: string]: unknown;
};

export type CompanionIdentityEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  core_identity_traits?: IdentityTrait[];
  communication_style_rules?: string[];
  personality_traits?: string[];
  signature_elements?: SignatureElement[];
  fox_exchange?: FoxExchangeExample;
  module_consistency?: ModuleConsistencyEntry[];
  self_love_note?: string;
  learning_journey_philosophy?: string;
  learning_journey_abos_principle?: string;
  capability_gap_examples?: CapabilityGapExamples;
  growth_principle_phrases?: string[];
  vision_rose_phrase?: string;
  learning_journey_standard_note?: string;
  settings?: CompanionIdentitySettings;
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  implementation_blueprint?: ImplementationBlueprintMeta;
  companion_identity_engine_note?: string;
  companion_characteristics?: CompanionCharacteristic[];
  communication_standards?: CommunicationStandard[];
  playful_moments?: PlayfulMoment[];
  self_love_implementation?: SelfLoveImplementation;
  companion_memory_rules?: CompanionMemoryRules;
  org_configuration_boundaries?: OrgConfigurationBoundaries;
  dogfooding?: Record<string, unknown>;
  success_criteria?: SuccessCriterion[];
  vision_phrases?: string[];
  companion_naming_policy?: CompanionNamingPolicy;
  aipify_first_language_policy?: AipifyFirstLanguagePolicy;
  implementation_blueprint_phase99?: ImplementationBlueprintMeta;
  human_partnership_mission?: string;
  human_partnership_philosophy?: string;
  human_partnership_abos_principle?: string;
  human_partnership_vision?: string;
  human_partnership_distinction_note?: string;
  human_partnership_objectives?: HumanPartnershipObjective[];
  human_partnership_questions?: HumanPartnershipBlueprintSection;
  human_partnership_evolution_principles?: HumanPartnershipBlueprintSection;
  human_partnership_personalization?: HumanPartnershipBlueprintSection;
  human_partnership_healthy_dependency?: HumanPartnershipBlueprintSection;
  human_partnership_companion_guidance?: HumanPartnershipBlueprintSection;
  human_partnership_evolution_stages?: HumanPartnershipBlueprintSection;
  human_partnership_self_love?: HumanPartnershipBlueprintSection;
  human_partnership_leadership?: HumanPartnershipBlueprintSection;
  human_partnership_trust?: HumanPartnershipBlueprintSection;
  human_partnership_privacy?: HumanPartnershipBlueprintSection;
  human_partnership_dogfooding?: Record<string, unknown>;
  human_partnership_success_criteria?: SuccessCriterion[];
  human_partnership_vision_phrases?: string[];
  human_partnership_integration_links?: HumanPartnershipIntegrationLink[];
  human_partnership_engagement_summary?: HumanPartnershipEngagementSummary;
  human_partnership_note?: string;
  human_ai_partnership_companion_evolution_blueprint?: HumanAiPartnershipCompanionEvolutionBlueprint;
  [key: string]: unknown;
};

export type CompanionIdentityExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  core_identity_traits?: IdentityTrait[];
  communication_style_rules?: string[];
  personality_traits?: string[];
  signature_elements?: SignatureElement[];
  module_consistency?: ModuleConsistencyEntry[];
  settings?: CompanionIdentitySettings;
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
