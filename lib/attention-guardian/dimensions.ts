export const ATTENTION_STATES = [
  "focused",
  "balanced",
  "overloaded",
  "distracted",
  "recovery_needed",
  "planning_required",
] as const;

export type AttentionState = (typeof ATTENTION_STATES)[number];

export const FOCUS_SESSION_TYPES = [
  "deep_work",
  "creative",
  "strategic_planning",
  "reflection",
  "family",
  "exercise",
  "recovery",
  "personal_development",
] as const;

export type FocusSessionType = (typeof FOCUS_SESSION_TYPES)[number];

export const BLOCK_TYPES = [
  "deep_work",
  "exercise",
  "planning",
  "preparation",
  "family",
  "recovery",
  "personal_development",
] as const;

export const INTERRUPTION_HANDLING = [
  "allow_all",
  "batch_non_essential",
  "delay_low_priority",
  "silence_optional",
] as const;

export const FOCUS_PERIODS = ["morning", "afternoon", "evening", "flexible"] as const;

export const PROACTIVITY_LEVELS = ["minimal", "balanced", "proactive"] as const;
