export const COMMUNICATION_STYLES = [
  "minimal",
  "professional",
  "friendly",
  "conversational",
  "supportive",
  "motivational",
  "formal",
  "warm",
  "humorous",
] as const;

export type CommunicationStyle = (typeof COMMUNICATION_STYLES)[number];

export const PROACTIVITY_LEVELS = [
  "passive",
  "reactive",
  "balanced",
  "proactive",
  "highly_proactive",
] as const;

export type ProactivityLevel = (typeof PROACTIVITY_LEVELS)[number];

export const IDENTITY_TONES = [
  "direct",
  "encouraging",
  "calm",
  "energetic",
  "neutral",
  "supportive",
] as const;

export type IdentityTone = (typeof IDENTITY_TONES)[number];

export const NAME_USAGE_OPTIONS = [
  "always",
  "occasional",
  "avoid",
  "professional_title",
] as const;

export type NameUsage = (typeof NAME_USAGE_OPTIONS)[number];

export const IDENTITY_MODES = [
  "minimal",
  "professional",
  "supportive",
  "companion",
  "custom",
] as const;

export type IdentityMode = (typeof IDENTITY_MODES)[number];

export const SOCIAL_STYLES = [
  "professional_assistant",
  "trusted_organizer",
  "friendly_companion",
  "executive_advisor",
  "life_coordinator",
] as const;

export type SocialInteractionStyle = (typeof SOCIAL_STYLES)[number];

export const RESPONSE_LENGTHS = ["short", "balanced", "detailed"] as const;
export type ResponseLength = (typeof RESPONSE_LENGTHS)[number];

export const NOTIFICATION_STYLES = ["minimal", "balanced", "frequent"] as const;
export type NotificationStyle = (typeof NOTIFICATION_STYLES)[number];

/** Preset bundles for identity modes */
export const IDENTITY_MODE_PRESETS: Record<
  Exclude<IdentityMode, "custom">,
  Partial<{
    communication_style: CommunicationStyle;
    proactivity_level: ProactivityLevel;
    tone: IdentityTone;
    response_length: ResponseLength;
    social_interaction_style: SocialInteractionStyle;
  }>
> = {
  minimal: {
    communication_style: "minimal",
    proactivity_level: "passive",
    tone: "neutral",
    response_length: "short",
    social_interaction_style: "professional_assistant",
  },
  professional: {
    communication_style: "professional",
    proactivity_level: "reactive",
    tone: "direct",
    response_length: "balanced",
    social_interaction_style: "executive_advisor",
  },
  supportive: {
    communication_style: "supportive",
    proactivity_level: "balanced",
    tone: "supportive",
    response_length: "balanced",
    social_interaction_style: "trusted_organizer",
  },
  companion: {
    communication_style: "conversational",
    proactivity_level: "proactive",
    tone: "encouraging",
    response_length: "balanced",
    social_interaction_style: "friendly_companion",
  },
};
