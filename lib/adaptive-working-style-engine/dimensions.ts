export const WORKING_PROFILES = [
  "executive",
  "operations",
  "support",
  "sales",
  "focus",
  "custom",
] as const;

export type WorkingProfile = (typeof WORKING_PROFILES)[number];

export const DETAIL_LEVELS = ["compact", "standard", "detailed"] as const;

export type DetailLevel = (typeof DETAIL_LEVELS)[number];

export const AWSE_REMINDER_FREQUENCIES = [
  "minimal",
  "balanced",
  "proactive",
  "highly_proactive",
] as const;

export type AwseReminderFrequency = (typeof AWSE_REMINDER_FREQUENCIES)[number];

export const SUMMARY_TIMES = ["morning", "midday", "evening", "none"] as const;

export type PreferredSummaryTime = (typeof SUMMARY_TIMES)[number];

export const ADAPTATION_SIGNAL_TYPES = [
  "recommendation_accepted",
  "recommendation_rejected",
  "reminder_dismissed",
  "reminder_completed",
  "detailed_view_selected",
  "compact_view_selected",
  "summary_opened",
  "suggestion_ignored",
] as const;

export type AdaptationSignalType = (typeof ADAPTATION_SIGNAL_TYPES)[number];

export const FORBIDDEN_INFERENCE_CATEGORIES = [
  "medical_conditions",
  "political_beliefs",
  "religious_beliefs",
  "sexual_orientation",
  "private_family_matters",
  "sensitive_personal_characteristics",
  "hidden_behavioral_profiling",
] as const;

export const AWSE_ALLOWED_PLANS = ["business", "enterprise"] as const;

export const AWSE_ADAPTIVE_LEARNING_PLANS = ["business", "enterprise"] as const;

export const AWSE_ENTERPRISE_PLANS = ["enterprise"] as const;
