export const BRAND_IDENTITY_PRINCIPLE =
  "Aipify is the product name. Artificial Intelligence is the underlying technology.";

export const BRAND_PERSONALITY_TRAITS = [
  "helpful",
  "professional",
  "calm",
  "trustworthy",
  "proactive",
  "respectful",
  "human-centered",
] as const;

export const BRAND_ADDRESS_RESPONSES = {
  greeting_aipify: "Hello. How can Aipify help you today?",
  greeting_ai_alias: "Hello. Aipify is ready to help.",
  generic_help: "Yes. Aipify can help with that.",
  report_request: "Yes. Aipify can generate reports in multiple formats.",
} as const;

export type BrandAddressIntent = keyof typeof BRAND_ADDRESS_RESPONSES;

/** i18n keys under `customerApp.brandIdentity.address.*`. */
export const BRAND_ADDRESS_I18N_KEYS: Record<BrandAddressIntent, string> = {
  greeting_aipify: "brandIdentity.address.greetingAipify",
  greeting_ai_alias: "brandIdentity.address.greetingAiAlias",
  generic_help: "brandIdentity.address.genericHelp",
  report_request: "brandIdentity.address.reportRequest",
};

/** Patterns to rewrite in generated or legacy copy. */
export const BRAND_SELF_REFERENCE_REWRITES: Array<[RegExp, string]> = [
  [/\bThe AI has\b/gi, "Aipify has"],
  [/\bThe AI recommends\b/gi, "Aipify recommends"],
  [/\bThe AI thinks\b/gi, "Aipify suggests"],
  [/\bThe AI decided\b/gi, "Aipify prepared a recommendation"],
  [/\bAI recommends\b/gi, "Aipify recommends"],
  [/\bAI has\b/gi, "Aipify has"],
  [/\bArtificial Intelligence has\b/gi, "Aipify has"],
  [/\bThe system believes\b/gi, "Aipify indicates"],
  [/\bThe algorithm recommends\b/gi, "Aipify recommends"],
  [/\bThe machine has\b/gi, "Aipify has"],
];
