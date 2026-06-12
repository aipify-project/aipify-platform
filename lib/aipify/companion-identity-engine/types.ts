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
