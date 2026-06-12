export const IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_MISSION =
  "Feel understood, welcomed, and encouraged through respectful personalization and appropriate humor.";

export const IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_PHILOSOPHY =
  "Professionalism and personality coexist. Occasional warmth, not constant entertainment.";

export const IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_ABOS_PRINCIPLE =
  "Professionalism and personality coexist. Aipify augments people; humans decide. Humor supports trust — never replaces clarity.";

export const IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_VISION =
  "Remember how people prefer to communicate. Respect humanity. Offer a shared smile during a difficult day.";

export const IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_DISTINCTION =
  "Implementation layer for humor/personality — distinct from Companion Identity Engine (A.84) orchestration.";

export const IMPLEMENTATION_BLUEPRINT_PHASE8_IMPLEMENTATION_OBJECTIVES = [
  "humor_prefs",
  "style_adaptation",
  "harmless_joke_recognition",
  "companion_familiarity",
  "celebratory_interactions",
  "context_sensitive",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE8_COMMUNICATION_PREFERENCES = [
  "formal",
  "professional_warmth",
  "light_humor",
  "high_encouragement",
  "minimal_personality",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE8_PLAYFUL_MOMENT_TYPES = [
  "bell_victories",
  "recognition_roses",
  "fox_responses",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE8_FOX_EXCHANGE = {
  user_says: "What does the fox say?",
  aipify_responds: "Ring-ding-ding-ding-dingeringeding.",
  follow_up: "A playful moment — ready when you are to continue.",
} as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE8_SELF_LOVE_NAMING_NOTE =
  "Use Self Love — no ™ symbol. Self Love is a principle, not a humor toggle.";

export function getImplementationBlueprintPhase8Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_VISION,
    distinction: IMPLEMENTATION_BLUEPRINT_PHASE8_HUMOR_DISTINCTION,
    implementationObjectives: IMPLEMENTATION_BLUEPRINT_PHASE8_IMPLEMENTATION_OBJECTIVES,
    communicationPreferences: IMPLEMENTATION_BLUEPRINT_PHASE8_COMMUNICATION_PREFERENCES,
    playfulMomentTypes: IMPLEMENTATION_BLUEPRINT_PHASE8_PLAYFUL_MOMENT_TYPES,
    foxExchange: IMPLEMENTATION_BLUEPRINT_PHASE8_FOX_EXCHANGE,
    selfLoveNamingNote: IMPLEMENTATION_BLUEPRINT_PHASE8_SELF_LOVE_NAMING_NOTE,
  };
}
