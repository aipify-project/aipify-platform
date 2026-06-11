export const GOAL_CATEGORIES = [
  "sales",
  "support",
  "operations",
  "marketing",
  "hr",
  "custom",
] as const;

export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export const GOAL_STATUSES = [
  "not_started",
  "on_track",
  "needs_attention",
  "at_risk",
  "behind_schedule",
  "completed",
  "archived",
] as const;

export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const GOAL_PRIORITIES = ["critical", "high", "standard", "low"] as const;

export type GoalPriority = (typeof GOAL_PRIORITIES)[number];

export const SGE_ALLOWED_PLANS = ["business", "enterprise"] as const;

export const SGE_ENTERPRISE_PLANS = ["enterprise"] as const;
