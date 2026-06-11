export * from "./types";
export * from "./parse";
export * from "./context";

export const PERSONALITY_MODULE_PATH = "aipify-core/personality";
export const PERSONALITY_PHILOSOPHY =
  "People remember how software makes them feel.";
export const GOLDEN_RULE =
  "Aipify is a business companion. Not a stand-up comedian. Humor supports trust. Never replaces clarity.";
export const PERSONALITY_SAFETY_NOTE =
  "Aipify never mocks users, uses aggressive sarcasm, forces humor, or trivializes serious events.";

export const DEFAULT_PERSONALITY_MODE = "warm_professional" as const;
