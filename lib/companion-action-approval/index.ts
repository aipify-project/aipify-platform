export * from "./types";
export * from "./parse";
export * from "./labels";

export const COMPANION_ACTION_LIFECYCLE = [
  "draft",
  "proposed",
  "awaiting_approval",
  "approved",
  "rejected",
  "executing",
  "completed",
  "failed",
  "cancelled",
  "expired",
] as const;

export const COMPANION_ACTION_CATEGORIES = [
  "documents",
  "communication",
  "scheduling",
  "reporting",
  "knowledge",
  "integrations",
  "commerce",
  "operations",
  "external_services",
  "companion_actions",
] as const;

export const COMPANION_RISK_LEVELS = ["low", "medium", "high", "critical"] as const;
