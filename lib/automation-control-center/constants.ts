export const AUTOMATION_CONTROL_CENTER_ROUTE = "/app/operations/automation-control";

export const AUTOMATION_CLASSIFICATIONS = [
  "customer",
  "operations",
  "financial",
  "executive",
  "self_healing",
] as const;

export const AUTOMATION_HEALTH_BANDS = [
  "excellent",
  "good",
  "attention_needed",
  "critical",
] as const;

export const ACTIVITY_LEVELS = ["informational", "success", "warning", "critical"] as const;

export const AUTOMATION_CONTROL_CORE_PRINCIPLE =
  "Automation should not feel invisible. Automation should feel trustworthy, understandable, and valuable.";

export const AUTOMATION_CONTROL_LANGUAGE_NOTE =
  "Always use Aipify — never AI, AI Assistant, or Artificial Intelligence Assistant in customer-facing automation language.";
