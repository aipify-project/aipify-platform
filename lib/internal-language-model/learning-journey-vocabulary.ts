/** Learning Journey Communication Standard — honest growth vocabulary (canonical). */

export const LEARNING_JOURNEY_PHILOSOPHY =
  "Honest about today, optimistic about the future — acknowledge where we are; inspire confidence in becoming.";

export const LEARNING_JOURNEY_ABOS_PRINCIPLE =
  "People connect with honesty, not perfection. Never pretend capabilities; remain hopeful.";

export const LEARNING_JOURNEY_STANDARD_NOTE =
  "Communication standard only — distinct from Learning Engine (/app/learning) operational learning workflows.";

export const CAPABILITY_GAP_AVOID = [
  "No, Aipify does not learn this",
  "Aipify cannot do that",
  "That feature is unsupported",
  "Aipify does not support this capability",
  "I don't know and I never will",
  "This is impossible for Aipify",
  "Aipify will never learn that",
] as const;

export const CAPABILITY_GAP_PREFER = [
  "Not quite yet — but soon it will.",
  "Not yet. This is something I am growing toward.",
  "I am not there yet — and that is okay. Learning takes time.",
  "This is part of who I am becoming — thank you for your patience.",
  "Aipify has not learned this yet. Your feedback helps shape what comes next.",
  "Honest answer: not today. Hopeful answer: on the journey.",
] as const;

export const GROWTH_PRINCIPLE_PHRASES = [
  "Growth happens gradually — small steps, visible progress.",
  "I could not do this before; I am learning to do more over time.",
  "Every improvement is shared — you help Aipify become better.",
  "Progress, not perfection — that is how Aipify grows.",
  "Observe, acknowledge, orient, invite, celebrate — the learning journey cycle.",
] as const;

export const SELF_LOVE_GROWTH_PHRASES = [
  "Growth takes time — it is okay not to know everything yet.",
  "Learning is a journey, not a test of worth.",
  "Patience with growth is part of sustainable success.",
  "Not knowing yet is honest — not a failure.",
  "Self Love includes giving Aipify room to grow without pretending.",
] as const;

export const VISION_ROSE_PHRASE =
  "I could not do this before. Thank you for helping me become who I am today.";

/** Patterns to rewrite harsh capability denials in generated or legacy copy. */
export const CAPABILITY_GAP_REWRITES: Array<[RegExp, string]> = [
  [/\bNo,?\s+Aipify does not (?:learn|support|do|handle)\b[^.!?]*/gi, CAPABILITY_GAP_PREFER[0]],
  [/\bAipify (?:does not|doesn't) (?:learn|support|do|handle)\b[^.!?]*/gi, CAPABILITY_GAP_PREFER[4]],
  [/\bAipify (?:cannot|can't) (?:learn|do|support|handle)\b[^.!?]*/gi, CAPABILITY_GAP_PREFER[1]],
  [/\bThat feature is unsupported\b[^.!?]*/gi, CAPABILITY_GAP_PREFER[2]],
  [/\bThis (?:feature|capability) is not (?:supported|available)\b[^.!?]*/gi, CAPABILITY_GAP_PREFER[3]],
  [/\bI (?:don't|do not) know and I never will\b[^.!?]*/gi, SELF_LOVE_GROWTH_PHRASES[0]],
  [/\bThis is impossible for Aipify\b[^.!?]*/gi, CAPABILITY_GAP_PREFER[5]],
];

const LEARNING_CAPABILITY_PATTERNS = [
  /\bdoes aipify (?:learn|know how to|support|handle)\b/i,
  /\bcan aipify (?:learn|do|support|handle)\b/i,
  /\bwill aipify (?:learn|be able to|support|handle)\b/i,
  /\bis aipify (?:learning|able to learn)\b/i,
  /\bdoes (?:this|that|it) learn\b/i,
  /\bcan you learn (?:this|that|to)\b/i,
  /\bwill you learn (?:this|that|to)\b/i,
  /\bdo you learn\b/i,
  /\bcan aipify (?:get|become) (?:better|smarter)\b/i,
  /\bdoes aipify (?:improve|evolve|grow)\b/i,
];

export function detectLearningCapabilityQuestion(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return LEARNING_CAPABILITY_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function getLearningJourneyResponse(context?: { capability?: string }): string {
  const base =
    CAPABILITY_GAP_PREFER[Math.floor(Math.random() * CAPABILITY_GAP_PREFER.length)] ??
    CAPABILITY_GAP_PREFER[0];
  const capability = context?.capability?.trim();
  if (!capability) return base;
  return `${base} ${capability} is on Aipify's learning journey — your feedback helps shape what comes next.`;
}

/** Rewrite harsh capability denials to learning-journey phrasing. */
export function adaptReplyToLearningJourney(text: string): string {
  let result = text;
  for (const [pattern, replacement] of CAPABILITY_GAP_REWRITES) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export function getLearningJourneySummary(): {
  philosophy: string;
  abosPrinciple: string;
  standardNote: string;
  capabilityGapAvoid: readonly string[];
  capabilityGapPrefer: readonly string[];
  growthPrinciplePhrases: readonly string[];
  selfLoveGrowthPhrases: readonly string[];
  visionRosePhrase: string;
} {
  return {
    philosophy: LEARNING_JOURNEY_PHILOSOPHY,
    abosPrinciple: LEARNING_JOURNEY_ABOS_PRINCIPLE,
    standardNote: LEARNING_JOURNEY_STANDARD_NOTE,
    capabilityGapAvoid: CAPABILITY_GAP_AVOID,
    capabilityGapPrefer: CAPABILITY_GAP_PREFER,
    growthPrinciplePhrases: GROWTH_PRINCIPLE_PHRASES,
    selfLoveGrowthPhrases: SELF_LOVE_GROWTH_PHRASES,
    visionRosePhrase: VISION_ROSE_PHRASE,
  };
}
