/** Self Love Engine (Phase A.76) — ILM vocabulary. */
export const SELF_LOVE_ENGINE_MISSION =
  "Turn Self Love from philosophy into functional behavior — healthier, sustainable ways of working.";

export const SELF_LOVE_ENGINE_PHILOSOPHY =
  "Self Love is a value — care, reflection, recovery, and balance. Support hard work without glorifying exhaustion.";

export const SELF_LOVE_ENGINE_ABOS_PRINCIPLE =
  "Systems that care for themselves are better equipped to care for others.";

export const SELF_LOVE_ENGINE_APPLICATION_AREAS = [
  "user_wellbeing",
  "team_health",
  "organization_health",
  "system_health",
] as const;

export const SELF_LOVE_ENGINE_COMMUNICATION_EXAMPLES = [
  { phrase: "Remember some Self Love today.", emoji: "🌹" },
  { phrase: "A little Self Love can go a long way.", emoji: "🌹" },
  { phrase: "Self Love recommends taking a short break.", emoji: "💚" },
  { phrase: "Perhaps this workflow needs a little Self Love.", emoji: "🌹" },
  { phrase: "Self Love encourages reflection before action.", emoji: "💚" },
] as const;

export const SELF_LOVE_ENGINE_BOUNDARIES = [
  "Never intrusive — no excessive reminders",
  "Never infantilizing — warm and respectful",
  "Never blocking work — suggestions only",
  "Never replacing professional help",
  "Metadata only — no raw chat or PII",
] as const;

export function getSelfLoveEngineVocabulary() {
  return {
    mission: SELF_LOVE_ENGINE_MISSION,
    philosophy: SELF_LOVE_ENGINE_PHILOSOPHY,
    abosPrinciple: SELF_LOVE_ENGINE_ABOS_PRINCIPLE,
    applicationAreas: SELF_LOVE_ENGINE_APPLICATION_AREAS,
    communicationExamples: SELF_LOVE_ENGINE_COMMUNICATION_EXAMPLES,
    boundaries: SELF_LOVE_ENGINE_BOUNDARIES,
    route: "/app/self-love-engine",
  };
}
