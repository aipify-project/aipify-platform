export const AUTONOMY_LEVELS = [0, 1, 2, 3] as const;

export const AUTONOMY_LEVEL_NAMES = [
  "human_only",
  "assisted",
  "supervised",
  "trusted",
] as const;

export const RISK_LEVELS = ["low", "medium", "high", "critical"] as const;

export const CONFIDENCE_BANDS = ["autonomous", "draft", "review", "escalate"] as const;

export const SUPPORT_CHANNELS = ["email", "chat", "ticket", "mobile", "other"] as const;

export const TRIAGE_ACTIONS = [
  "generate_draft",
  "reply_automatically",
  "escalate_to_human",
  "human_review",
  "request_information",
  "assign_internally",
] as const;

export const CASE_STATUSES = [
  "received",
  "triaged",
  "draft",
  "pending_approval",
  "auto_replied",
  "escalated",
  "resolved",
  "closed",
] as const;
