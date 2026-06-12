export const PERSONALITY_MODES = ["professional", "warm_professional", "playful"] as const;

export const HUMOR_APPROPRIATE_CONTEXTS = [
  "greeting",
  "milestone",
  "task_complete",
  "friendly_reminder",
  "learning",
  "positive_reinforcement",
  "support_low_risk",
  "celebration",
  "value_highlight",
] as const;

export const HUMOR_FORBIDDEN_CONTEXTS = [
  "security_incident",
  "crisis_mode",
  "compliance_investigation",
  "legal_matter",
  "hr_serious",
  "emotional_distress",
  "incident_response",
] as const;

export const RECOMMENDED_EMOJIS = ["🙂", "😊", "😄", "🎉", "🚀"] as const;

export type PersonalityMode = (typeof PERSONALITY_MODES)[number];

export type PersonalityMessage = {
  message?: string;
  context?: string;
  template_key?: string;
  personality_mode?: string;
  humor_allowed?: boolean;
  emoji_enabled?: boolean;
  golden_rule?: string;
  error?: string;
};

export type PersonalityModeInfo = {
  mode: string;
  label: string;
  description: string;
  recommended?: boolean;
};

export type HumorPrinciples = {
  should?: string[];
  should_never?: string[];
};

export type ExampleExchange = {
  user_says?: string;
  aipify_responds?: string;
};

export type TrustBoundary = {
  avoid?: string;
  prefer?: string;
};

export type IntegrationLink = {
  label: string;
  route: string;
  description: string;
};

export type BellPersonalityMoment = {
  context?: string;
  emoji?: string;
  text?: string;
};

export type FoxExchange = {
  user_says?: string;
  aipify_responds?: string;
  follow_up?: string;
};

export type PlayfulMomentsSeed = {
  core_idea?: string;
  bell_personality_moments?: BellPersonalityMoment[];
  when_to_use?: string[];
  when_not_to_use?: string[];
  memory_principle?: string;
  self_love_examples?: string[];
  abos_connection?: string;
  final_principle?: string;
  fox_exchange?: FoxExchange;
};

export type RecurringJoke = {
  key: string;
  enabled?: boolean;
};

export type BellMomentResult = {
  context?: string;
  emoji?: string;
  text?: string;
  signature?: string;
  metadata_only?: boolean;
};

export type SuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ImplementationObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type CommunicationPreference = {
  key?: string;
  label?: string;
  maps_to_mode?: string;
  description?: string;
  recommended?: boolean;
};

export type HarmlessMemoryPrinciples = {
  principle?: string;
  allowed?: string[];
  forbidden?: string[];
  storage?: string;
  metadata_only?: boolean;
};

export type PlayfulMomentType = {
  key?: string;
  emoji?: string;
  label?: string;
  description?: string;
};

export type BlueprintPlayfulMoments = {
  types?: PlayfulMomentType[];
  fox_exchange?: FoxExchange;
  boundary_note?: string;
};

export type HumorBoundaries = {
  never?: string[];
  timing_note?: string;
  principle?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  influences?: string[];
  naming_doc?: string;
  naming_note?: string;
};

export type TrustConnection = {
  principle?: string;
  avoid?: string[];
  prefer?: string[];
};

export type DogfoodingInfo = {
  principle?: string;
  aipify_group?: { slug?: string; role?: string; focus?: string[] };
  unonight?: { slug?: string; role?: string; focus?: string[] };
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  distinction?: string;
};

export type PersonalityCard = {
  has_customer: boolean;
  personality_mode?: string;
  humor_enabled?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  default_mode?: string;
  distinction_note?: string;
  playful_moments_enabled?: boolean;
  bell_moments_enabled?: boolean;
  playful_moments_seed?: PlayfulMomentsSeed;
  implementation_blueprint?: ImplementationBlueprintMeta;
  humor_personal_connection_note?: string;
};

export type PersonalityDashboard = {
  has_customer: boolean;
  personality_mode?: string;
  humor_enabled?: boolean;
  emoji_enabled?: boolean;
  playful_moments_enabled?: boolean;
  bell_moments_enabled?: boolean;
  recurring_jokes?: RecurringJoke[];
  playful_memory_prefs?: Record<string, unknown>;
  playful_currently_allowed?: boolean;
  max_emojis_normal?: number;
  max_emojis_celebration?: number;
  humor_currently_allowed?: boolean;
  crisis_mode_active?: boolean;
  golden_rule?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  personality_modes?: PersonalityModeInfo[];
  humor_appropriate?: string[];
  humor_never?: string[];
  humor_principles?: HumorPrinciples;
  personal_connection_notes?: string[];
  example_exchanges?: ExampleExchange[];
  self_love_note?: string;
  trust_boundaries?: TrustBoundary[];
  emoji_guidelines?: {
    recommended?: string[];
    normal_limit?: number;
    celebration_limit?: number;
  };
  example_messages?: PersonalityMessage[];
  integrations?: Record<string, string>;
  integration_links?: IntegrationLink[];
  safeguards?: Record<string, boolean>;
  distinction_note?: string;
  playful_moments_seed?: PlayfulMomentsSeed;
  implementation_blueprint?: ImplementationBlueprintMeta;
  humor_personal_connection_note?: string;
  implementation_objectives?: ImplementationObjective[];
  communication_preferences?: CommunicationPreference[];
  harmless_memory_principles?: HarmlessMemoryPrinciples;
  playful_moments?: BlueprintPlayfulMoments;
  humor_boundaries?: HumorBoundaries;
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  dogfooding?: DogfoodingInfo;
  success_criteria?: SuccessCriterion[];
  vision_phrases?: string[];
};

export type PersonalitySettingsResult = {
  personality_mode?: string;
  humor_enabled?: boolean;
  emoji_enabled?: boolean;
  playful_moments_enabled?: boolean;
  bell_moments_enabled?: boolean;
  recurring_jokes?: RecurringJoke[];
  playful_memory_prefs?: Record<string, unknown>;
  golden_rule?: string;
};
