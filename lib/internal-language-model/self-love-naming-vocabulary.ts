/** Preferred user-facing term — two words, no trademark symbol. */
export const SELF_LOVE_PREFERRED_TERM = "Self Love";

/** Engine module label for docs and roadmap references. */
export const SELF_LOVE_ENGINE_LABEL = "Self Love Engine (A.76)";

export const SELF_LOVE_AVOID_TERMS = [
  "Self Love™",
  "SelfLove™",
  "SELF LOVE™",
  "Self Love Engine™",
  "SelfLove",
] as const;

export const SELF_LOVE_USAGE_EXAMPLES = [
  "Perhaps this workflow needs a little Self Love.",
  "Remember some Self Love today.",
  "Self Love recommends taking a short break.",
  "A little Self Love can go a long way.",
  "Self Love encourages reflection before action.",
] as const;

export const SELF_LOVE_PURPOSE =
  "Balance, wellbeing, reflection, sustainable growth, and compassion.";

export const SELF_LOVE_ABOS_PRINCIPLE =
  "Natural, warm, human, and approachable — never overly commercialized.";

export const SELF_LOVE_VISION =
  "A recognizable expression of care through experience, not heavy marketing.";

export const SELF_LOVE_HUMAN_CONTROL =
  "Self Love never performs irreversible actions without explicit human approval.";

/** Rewrite legacy or trademarked Self Love copy to the preferred standard. */
export const SELF_LOVE_NAMING_REWRITES: Array<[RegExp, string]> = [
  [/\bSelf Love Engine \(A\.76 planned\)\b/g, SELF_LOVE_ENGINE_LABEL],
  [/\bSelf Love Engine™\b/g, SELF_LOVE_ENGINE_LABEL],
  [/\bSelf Love™\b/g, SELF_LOVE_PREFERRED_TERM],
  [/\bSelfLove™\b/g, SELF_LOVE_PREFERRED_TERM],
  [/\bSELF LOVE™\b/g, SELF_LOVE_PREFERRED_TERM],
  [/\bSelfLove\b/g, SELF_LOVE_PREFERRED_TERM],
];

export function getSelfLoveNamingStandard() {
  return {
    preferredTerm: SELF_LOVE_PREFERRED_TERM,
    engineLabel: SELF_LOVE_ENGINE_LABEL,
    avoidTerms: SELF_LOVE_AVOID_TERMS,
    usageExamples: SELF_LOVE_USAGE_EXAMPLES,
    purpose: SELF_LOVE_PURPOSE,
    abosPrinciple: SELF_LOVE_ABOS_PRINCIPLE,
    vision: SELF_LOVE_VISION,
    humanControl: SELF_LOVE_HUMAN_CONTROL,
  };
}

export function adaptReplyToSelfLoveNaming(text: string): string {
  let result = text;
  for (const [pattern, replacement] of SELF_LOVE_NAMING_REWRITES) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
