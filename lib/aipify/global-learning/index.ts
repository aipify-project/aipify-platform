export * from "./types";
export * from "./parse";

export const GLOBAL_LEARNING_MODULE_PATH = "aipify-core/global-learning";
export const GLOBAL_LEARNING_PHILOSOPHY =
  "Aipify learns from patterns — never from customer secrets.";
export const GLOBAL_LEARNING_SAFETY_NOTE =
  "Only anonymized, structured signals contribute to Global Learning. No raw customer data leaves your tenant.";

export const INTELLIGENCE_LEVELS = {
  local: "Customer-specific learning within tenant boundaries.",
  organizational: "Cross-team insights shared internally within your organization.",
  global: "Anonymous pattern-based improvements to Aipify Core (opt-in).",
} as const;
