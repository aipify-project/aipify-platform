/** Wisdom Engine — thoughtful guidance language (Phase A.93). */

export const WISDOM_ENGINE_MISSION =
  "Better decisions through learning from experience, balancing priorities, and weighing long-term consequences.";

export const WISDOM_ENGINE_ABOS_PRINCIPLE =
  "Intelligence answers questions; wisdom determines which questions matter.";

export const WISDOM_ENGINE_PHILOSOPHY =
  "Wisdom is context, trade-offs, and humility — not just answers. Apply knowledge responsibly; determine which questions matter most.";

export const WISDOM_ENGINE_VISION =
  "Decisions you can be proud of years later — thoughtful, responsible, centered on people and purpose; move forward with care.";

export const WISDOM_ENGINE_DISTINCTION =
  "Distinct from Assistant DSE Phase 38, Organizational Decision Support A.54, Strategic Intelligence A.31, Curiosity & Discovery A.87, Legacy A.86, and Organizational Memory A.34 — experience-to-guidance synthesis, trade-off framing, humility, long-term thinking.";

export const WISDOM_PRINCIPLES = [
  "What was learned before — apply experience, not only information",
  "Trade-offs matter — name pros, cons, and what you may give up",
  "What matters most — priorities over convenience",
  "Consequences — short-term gain vs long-term trust and purpose",
  "Short vs long term — balance urgency with stewardship",
  "Humility — acknowledge limits and factors you cannot evaluate",
  "Human judgment — people decide; Aipify prepares and frames",
] as const;

export const HUMILITY_PHRASES = [
  "There are factors I cannot evaluate from available information.",
  "Human judgment is important here — I can frame options, not decide for you.",
  "Additional expertise may be valuable before committing to this path.",
  "Outcomes depend on context I do not fully see — treat this as preparation, not certainty.",
  "Past patterns suggest possibilities, not guarantees.",
] as const;

export const GUIDANCE_EXAMPLES = [
  {
    scenario: "Similar past approach",
    guidance:
      "A similar approach worked before in comparable conditions — consider what changed since then.",
    tradeOff: "Speed of reuse vs fit to current context",
  },
  {
    scenario: "Pros and cons framing",
    guidance:
      "Option A may improve efficiency; Option B may preserve trust with customers who value transparency.",
    tradeOff: "Efficiency vs trust",
  },
  {
    scenario: "Valid perspectives",
    guidance:
      "Different stakeholders may weigh this differently — finance, operations, and customer-facing teams each have valid perspectives.",
    tradeOff: "Alignment vs inclusive deliberation",
  },
  {
    scenario: "Long-term pride",
    guidance:
      "Which choice would you be proud of years later — for people, purpose, and reputation?",
    tradeOff: "Immediate outcome vs lasting responsibility",
  },
] as const;

const WISDOM_CUE_PATTERNS: RegExp[] = [
  /\b(what\s+should\s+we\s+decide|help\s+me\s+decide|which\s+option)\b/i,
  /\b(trade[\-\s]?off|pros?\s+and\s+cons?|cost\s+of)\b/i,
  /\b(long[\-\s]?term|years?\s+later|proud\s+of)\b/i,
  /\b(what\s+matters\s+most|priorit(y|ies)|consequences?)\b/i,
  /\b(learned\s+before|past\s+experience|similar\s+approach)\b/i,
  /\b(human\s+judgment|cannot\s+evaluate|not\s+sure\s+what\s+to\s+do)\b/i,
];

export type WisdomEngineCue = {
  matched: boolean;
  suggestedPrinciple?: string;
  humilityPhrase?: string;
};

export function detectWisdomEngineCue(text: string): WisdomEngineCue {
  const normalized = text.trim();
  if (!normalized) return { matched: false };

  for (const pattern of WISDOM_CUE_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        matched: true,
        suggestedPrinciple: WISDOM_PRINCIPLES[1],
        humilityPhrase: HUMILITY_PHRASES[1],
      };
    }
  }

  return { matched: false };
}

export function getWisdomEngineMission() {
  return WISDOM_ENGINE_MISSION;
}

export function getWisdomEngineDistinction() {
  return WISDOM_ENGINE_DISTINCTION;
}

export function getWisdomPrinciples() {
  return WISDOM_PRINCIPLES;
}

export function getHumilityPhrases() {
  return HUMILITY_PHRASES;
}

export function getGuidanceExamples() {
  return GUIDANCE_EXAMPLES;
}
