/** Aipify Brand Rule — there is only one Aipify. */

export const AIPIFY_SINGLE_IDENTITY_PRINCIPLE =
  "There is only one Aipify. Users interact with Aipify. Skills, Centers, Specialists, and Companions are extensions of Aipify — not separate assistants or multiple AIs.";

export const AIPIFY_SINGLE_IDENTITY_RULES = [
  "Do not create multiple AIs.",
  "Do not introduce separate assistant identities.",
  "All capabilities belong to Aipify.",
  "Users interact with Aipify.",
  "Aipify remains the single trusted companion throughout the platform.",
] as const;

/** Copy patterns that imply separate AI products or assistant fleets. */
export const FORBIDDEN_SEPARATE_IDENTITY_PHRASES = [
  "multiple AIs",
  "multiple AI tools",
  "separate AI",
  "separate assistant",
  "another AI",
  "another assistant",
  "our AI assistant",
  "your AI assistant",
  "AI assistant named",
  "collection of AI tools",
  "AI tools you manage",
  "fleet of assistants",
  "army of copilots",
  "AI workforce",
  "Each AI",
  "This AI can",
  "The AI assistant",
] as const;

/** Capability framing — extensions of Aipify, not standalone AIs. */
export const AIPIFY_CAPABILITY_FRAMING = {
  skill: "An Aipify capability you can activate",
  center: "An Aipify operational center",
  specialist: "An Aipify specialist capability",
  companion: "Aipify — your trusted business companion",
} as const;

export const AIPIFY_SINGLE_IDENTITY_REWRITES: Array<[RegExp, string]> = [
  [/\bmultiple AIs\b/gi, "Aipify capabilities"],
  [/\bmultiple AI tools\b/gi, "Aipify capabilities"],
  [/\bseparate AI assistant\b/gi, "Aipify capability"],
  [/\bseparate assistant identity\b/gi, "Aipify capability"],
  [/\bseparate AI tool\b/gi, "Aipify capability"],
  [/\bseparate AI\b/gi, "Aipify capability"],
  [/\banother AI assistant\b/gi, "another Aipify capability"],
  [/\banother AI\b/gi, "another Aipify capability"],
  [/\banother assistant\b/gi, "another Aipify capability"],
  [/\bour AI assistant\b/gi, "Aipify"],
  [/\byour AI assistant\b/gi, "Aipify"],
  [/\bAI assistant named\b/gi, "Aipify capability"],
  [/\bcollection of AI tools\b/gi, "Aipify platform capabilities"],
  [/\bAI tools you manage\b/gi, "Aipify capabilities you activate"],
  [/\bfleet of assistants\b/gi, "Aipify capabilities"],
  [/\bEach AI\b/gi, "Each Aipify capability"],
  [/\bThis AI can\b/gi, "Aipify can"],
  [/\bThe AI assistant\b/gi, "Aipify"],
  [/\bAI assistants\b/gi, "Aipify capabilities"],
  [/\ban AI assistant\b/gi, "Aipify"],
];
