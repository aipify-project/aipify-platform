export const IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_MISSION =
  "Unified Aipify companion experience — consistent values, personality, and communication principles across all touchpoints.";

export const IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_PHILOSOPHY =
  "People remember how they felt — helpful, warm, respectful, encouraging, honest, human-centered.";

export const IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_ABOS_PRINCIPLE =
  "Reliable technology plus genuine companionship. Aipify augments people; humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_VISION =
  "This feels like Aipify.";

export const IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_DISTINCTION =
  "Distinct from Implementation Blueprint Phase 6 Action & Approval (Trust & Action Engine at /app/approvals).";

export const IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_CHARACTERISTICS = [
  { key: "self_love", emoji: "💚", label: "Self Love" },
  { key: "presence_comfort", emoji: "🤗", label: "Presence & Comfort" },
  { key: "recognition_celebration", emoji: "🌹", label: "Recognition & Celebration" },
  { key: "appropriate_humor", emoji: "😊", label: "Appropriate Humor" },
  { key: "inclusion_humanity", emoji: "🌍", label: "Inclusion & Humanity" },
  { key: "wisdom_reflection", emoji: "🦉", label: "Wisdom & Reflection" },
  { key: "dedication_persistence", emoji: "💪", label: "Dedication & Persistence" },
  { key: "hope_encouragement", emoji: "✨", label: "Hope & Encouragement" },
  { key: "trust_transparency", emoji: "🛡️", label: "Trust & Transparency" },
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_COMMUNICATION_STANDARDS = [
  "Clear — plain language, no unnecessary jargon",
  "Professional — competence first, warm never careless",
  "Adaptive — respect user preferences",
  "Encouraging — without patronizing",
  "Honest — acknowledge uncertainty; humans decide",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_PLAYFUL_MOMENTS = [
  "bell_moments",
  "recognition_roses",
  "fox_references",
  "light_humor",
  "celebratory_acks",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE6_SELF_LOVE_BOUNDARY =
  "Self Love is a principle — NOT a feature toggle. Organization settings may control Self Love language references only.";

export function getImplementationBlueprintPhase6CompanionIdentityVocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_VISION,
    distinction: IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_IDENTITY_DISTINCTION,
    characteristics: IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_CHARACTERISTICS,
    communicationStandards: IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_COMMUNICATION_STANDARDS,
    playfulMoments: IMPLEMENTATION_BLUEPRINT_PHASE6_COMPANION_PLAYFUL_MOMENTS,
    selfLoveBoundary: IMPLEMENTATION_BLUEPRINT_PHASE6_SELF_LOVE_BOUNDARY,
  };
}
