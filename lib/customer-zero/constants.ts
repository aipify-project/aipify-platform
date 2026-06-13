export const CUSTOMER_ZERO_ROUTE = "/platform/pilot-operations";

export const PILOT_LEVELS = [1, 2, 3, 4] as const;

export const PILOT_LEVEL_NAMES: Record<(typeof PILOT_LEVELS)[number], string> = {
  1: "Observe",
  2: "Recommend",
  3: "Assist",
  4: "Execute",
};

export const READINESS_STATES = [
  "learning",
  "partially_ready",
  "ready_to_assist",
  "ready_to_execute",
] as const;

export const READINESS_DIMENSIONS = [
  "knowledge_coverage",
  "operational_understanding",
  "faq_readiness",
  "support_readiness",
  "moderation_readiness",
  "action_readiness",
  "automation_readiness",
] as const;

export const CUSTOMER_ZERO_CORE_PRINCIPLE =
  "Before Aipify serves the world, Aipify must successfully serve its own ecosystem.";

export const CUSTOMER_ZERO_PRINCIPLE =
  "If Aipify cannot successfully help Unonight, Aipify is not ready for external customers.";

export const UNONIGHT_SLUG = "unonight";
