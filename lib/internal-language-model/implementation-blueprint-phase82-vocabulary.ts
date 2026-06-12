export const IMPLEMENTATION_BLUEPRINT_PHASE82_MISSION =
  "Strengthen self-awareness, decision quality, and long-term effectiveness through guided reflection and thoughtful executive practices.";

export const IMPLEMENTATION_BLUEPRINT_PHASE82_PHILOSOPHY =
  "The strongest leaders pause to learn from experience — reflection transforms experience into wisdom; sustainable leadership is not about being the fastest mover.";

export const IMPLEMENTATION_BLUEPRINT_PHASE82_ABOS_PRINCIPLE =
  "Leadership development emerges when people reflect upon experience thoughtfully and consistently — growth, not evaluation.";

export const IMPLEMENTATION_BLUEPRINT_PHASE82_OBJECTIVE_KEYS = [
  "leadership_reflection",
  "perspective_building",
  "decision_learning",
  "personal_growth",
  "executive_wellbeing",
  "sustainable_leadership",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE82_REFLECTION_PROMPTS = [
  "🦉 Which decisions this period had the most positive impact — and what does that teach you about your leadership?",
  "🌹 What challenges taught you something important — even when outcomes were imperfect?",
  "❤️ If you could revisit one leadership moment — what would you approach differently, with compassion?",
  "🔔 What accomplishments deserve recognition — for your team and for your own leadership growth?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE82_COMPANION_GUIDANCE = [
  "🦉 Your quarter held meaningful experiences — would a gentle reflection summary help you notice what they are teaching you?",
  "🌹 Meaningful growth often happens quietly — what progress deserves recognition in your leadership journey?",
  "❤️ Leadership learning often happens through imperfect circumstances — what compassion would you offer yourself from this period?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE82_VISION_PHRASES = [
  "I am becoming a better leader because I take time to understand what my experiences are teaching me.",
  "Wiser, grounded, compassionate leaders.",
  "Reflection transforms experience into wisdom.",
  "Extraordinary leaders are rarely perfect. They remain willing to learn.",
  "Growth, not evaluation — executive reflections stay private unless intentionally shared.",
] as const;

export function getImplementationBlueprintPhase82Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE82_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE82_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE82_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE82_OBJECTIVE_KEYS,
    reflectionPrompts: IMPLEMENTATION_BLUEPRINT_PHASE82_REFLECTION_PROMPTS,
    companionGuidance: IMPLEMENTATION_BLUEPRINT_PHASE82_COMPANION_GUIDANCE,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE82_VISION_PHRASES,
    engineRoute: "/app/executive-insights-engine",
    enginePhase: "A.35",
    blueprintPhase: "Phase 82 — Executive Reflection Engine",
    phase13Blueprint: "Phase 13 — Executive Insights Engine Foundation",
    phase59Blueprint: "Phase 59 — Strategic Thinking Engine",
    phase66Blueprint: "Phase 66 — Executive Companion Engine",
    humanSuccessDistinction:
      "Experience, Adoption & Human Success repo Phase 82 at /app/human-success — repo phase number collision with ABOS blueprint 82",
    purposeValuesRoute: "/app/purpose-values-engine",
    purposeValuesDistinction:
      "Purpose & Values Engine A.82 / Blueprint Phase 64 — organizational values reflection, not executive leadership reflection",
    selfLoveRoute: "/app/self-love-engine",
    wisdomRoute: "/app/wisdom-engine",
    gratitudeRoute: "/app/gratitude-recognition-engine",
    legacyRoute: "/app/legacy-engine",
    personalDseRoute: "/app/assistant/decisions",
    learningPhrase: "Extraordinary leaders are rarely perfect. They remain willing to learn.",
    privacyNote: "Executive reflections private unless intentionally shared — growth not evaluation.",
    noJournalStorageNote: "No new tables for raw reflection journal content — privacy-first scaffold only.",
  };
}
