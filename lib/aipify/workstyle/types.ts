export const COMMUNICATION_STYLES = [
  "professional",
  "warm_professional",
  "playful",
  "executive",
  "technical",
] as const;

export const NOTIFICATION_STYLES = ["minimal", "balanced", "proactive", "critical_only"] as const;

export const LEARNING_STYLES = [
  "articles",
  "videos",
  "mini_guides",
  "walkthroughs",
  "step_by_step",
] as const;

export const EXPLANATION_STYLES = ["simple", "operational", "technical"] as const;

export const COLLABORATION_STYLES = [
  "independent",
  "collaborative",
  "approval_oriented",
  "guided",
] as const;

export const DESKTOP_STYLES = [
  "morning_briefings",
  "afternoon_summaries",
  "minimal",
  "full_assistant",
] as const;

export const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;

export type WorkstyleProfile = {
  communication_style: string;
  notification_style: string;
  learning_style: string;
  explanation_style: string;
  collaboration_style: string;
  desktop_style: string;
  personalization_enabled: boolean;
  humor_enabled: boolean;
  recommendation_frequency: string;
};

export type UserPreference = {
  preference_type: string;
  preference_value: string;
  source?: string;
  confidence_level?: string;
};

export type PreferenceSuggestion = {
  id: string;
  suggestion: string;
  preference_type: string;
  suggested_value: string;
  confidence_level: string;
  status?: string;
};

export type WorkstyleCard = {
  has_customer: boolean;
  communication_style?: string;
  personalization_enabled?: boolean;
  philosophy?: string;
  user_control_mandatory?: boolean;
};

export type PersonalizationSettings = {
  has_customer: boolean;
  user_control_mandatory?: boolean;
  no_surveillance?: boolean;
  profile?: WorkstyleProfile;
  org_policy?: Record<string, unknown>;
  preferences: UserPreference[];
  suggestions: PreferenceSuggestion[];
  dimensions?: Record<string, string[]>;
  integrations?: Record<string, string>;
};

export type WorkstyleGreeting = {
  message?: string;
  communication_style?: string;
  desktop_style?: string;
  personalization_enabled?: boolean;
  user_control_mandatory?: boolean;
};
