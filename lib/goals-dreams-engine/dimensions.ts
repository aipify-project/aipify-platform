export const GOAL_CATEGORIES = [
  "personal_development",
  "career",
  "financial",
  "family",
  "health",
  "education",
  "lifestyle",
] as const;

export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export const GOAL_TIMEFRAMES = [
  "short_term",
  "medium_term",
  "long_term",
  "lifelong",
] as const;

export type GoalTimeframe = (typeof GOAL_TIMEFRAMES)[number];

export const ACCOUNTABILITY_LEVELS = [
  "minimal",
  "occasional",
  "regular",
  "highly_supportive",
] as const;

export type AccountabilityLevel = (typeof ACCOUNTABILITY_LEVELS)[number];

export const GOAL_STATUSES = ["active", "paused", "completed", "archived"] as const;

export const MILESTONE_STATUSES = [
  "planned",
  "in_progress",
  "completed",
  "paused",
  "archived",
] as const;

export const ACTION_STATUSES = ["pending", "in_progress", "completed"] as const;
