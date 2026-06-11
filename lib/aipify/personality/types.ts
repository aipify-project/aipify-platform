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

export type PersonalityCard = {
  has_customer: boolean;
  personality_mode?: string;
  humor_enabled?: boolean;
  philosophy?: string;
  default_mode?: string;
};

export type PersonalityDashboard = {
  has_customer: boolean;
  personality_mode?: string;
  humor_enabled?: boolean;
  emoji_enabled?: boolean;
  max_emojis_normal?: number;
  max_emojis_celebration?: number;
  humor_currently_allowed?: boolean;
  crisis_mode_active?: boolean;
  golden_rule?: string;
  philosophy?: string;
  personality_modes?: PersonalityModeInfo[];
  humor_appropriate?: string[];
  humor_never?: string[];
  emoji_guidelines?: {
    recommended?: string[];
    normal_limit?: number;
    celebration_limit?: number;
  };
  example_messages?: PersonalityMessage[];
  integrations?: Record<string, string>;
  safeguards?: Record<string, boolean>;
};

export type PersonalitySettingsResult = {
  personality_mode?: string;
  humor_enabled?: boolean;
  emoji_enabled?: boolean;
  golden_rule?: string;
};
