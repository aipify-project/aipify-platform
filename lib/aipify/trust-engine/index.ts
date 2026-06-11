export * from "./types";
export * from "./parse";

export const TRUST_ENGINE_MODULE_PATH = "aipify-core/trust-engine";
export const TRUST_ENGINE_PHILOSOPHY =
  "No important decision without explanation. Trust increases as understanding increases.";
export const TRUST_ENGINE_SAFETY_NOTE =
  "Explanations never expose secrets, API keys, or cross-tenant information.";

export const EXPLANATION_TEMPLATE = [
  "Decision Summary",
  "Reasoning",
  "Information Used",
  "Rules Applied",
  "Confidence Level",
  "Alternatives Considered",
  "Recommended Next Actions",
] as const;
