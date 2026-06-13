export const COMPANION_ORCHESTRATION_ROUTE = "/app/companion/orchestration";

export const ORCHESTRATION_SENSITIVITY_LEVELS = [
  "conservative",
  "balanced",
  "proactive",
] as const;

export const ORCHESTRATION_NOTIFICATION_LEVELS = [
  "minimal",
  "important",
  "all",
] as const;

export const COMPANION_REGISTRY_STATUSES = [
  "installed",
  "enabled",
  "disabled",
  "pending",
  "restricted",
] as const;

export const ORCHESTRATION_CORE_PRINCIPLE =
  "Users should interact with Aipify — not with dozens of separate modules. Companions are capabilities. Aipify is the relationship.";

export const ORCHESTRATION_VISION =
  "People do not think in modules. People think in moments, responsibilities, and relationships.";

export const ORCHESTRATION_RESPONSE_PRINCIPLE =
  "Never expose internal orchestration. Users see Aipify — not individual companion module names in coordinated responses.";
