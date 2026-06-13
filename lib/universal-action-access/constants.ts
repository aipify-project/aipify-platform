/** Universal Action Access Framework — foundational platform principle. */

export const UAAF_CORE_PRINCIPLE =
  "Aipify can do anything it has permission and access to do.";

export const UAAF_VISION_STATEMENT =
  "Aipify is a trusted companion capable of acting responsibly within the permissions, governance structures, and boundaries established by the people and organizations it serves.";

export const UAAF_ACTION_PHILOSOPHY_FROM = "I found the answer.";
export const UAAF_ACTION_PHILOSOPHY_TO = "I've taken care of it.";

export const UAAF_ACTION_CATEGORIES = [
  "personal",
  "business",
  "commerce",
  "workforce",
  "device",
  "future",
] as const;

export const UAAF_APPROVAL_LEVELS = [
  "automatic",
  "user_confirmation",
  "multi_step_approval",
] as const;

export const UAAF_FUNDAMENTAL_RULES = [
  "permission_first",
  "governance_by_default",
  "human_control",
] as const;

export const UAAF_ACTION_OFFER_PROMPTS = {
  print: { en: "Should I print this for you?", no: "Skal jeg printe dette ut for deg?" },
  email: { en: "Would you like me to send this email?", no: "Skal jeg sende denne e-posten?" },
  taxi: { en: "Should I order a taxi for your meeting?", no: "Skal jeg bestille taxi til møtet ditt?" },
  flowers: { en: "Would you like me to send flowers?", no: "Skal jeg sende blomster?" },
  calendar: { en: "Should I add this to your calendar?", no: "Skal jeg legge dette til i kalenderen din?" },
} as const;

export const UAAF_ROUTE = "/app/settings/action-access";
