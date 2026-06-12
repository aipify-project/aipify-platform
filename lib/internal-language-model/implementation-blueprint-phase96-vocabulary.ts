export const IMPLEMENTATION_BLUEPRINT_PHASE96_MISSION =
  "Healthier workplaces — support wellbeing, engagement, and sustainable performance without sacrificing humanity.";

export const IMPLEMENTATION_BLUEPRINT_PHASE96_PHILOSOPHY =
  "People are not machines — wellbeing supports performance; sustainable engagement outlasts burnout cycles.";

export const IMPLEMENTATION_BLUEPRINT_PHASE96_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — exceptional work should not require sacrificing humanity; employee experience is a strategic capability, not a surveillance metric.";

export const IMPLEMENTATION_BLUEPRINT_PHASE96_VISION =
  "Building an environment where people can do exceptional work without sacrificing their humanity.";

export const IMPLEMENTATION_BLUEPRINT_PHASE96_SELF_LOVE_QUOTE =
  "You do not need to earn rest through exhaustion.";

export const IMPLEMENTATION_BLUEPRINT_PHASE96_OBJECTIVE_KEYS = [
  "employee_engagement_awareness",
  "wellbeing_support_not_control",
  "sustainable_performance",
  "recognition_and_appreciation",
  "companion_reflection",
  "employee_journey_support",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE96_EXPERIENCE_QUESTIONS = [
  "🦉 What employee experience patterns deserve thoughtful leadership attention?",
  "🌹 What moments of appreciation and recognition strengthen engagement?",
  "❤️ How can wellbeing support feel caring rather than intrusive?",
  "🔔 What sustainable pacing signals may indicate recovery is needed?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE96_WELLBEING_OBSERVATIONS = [
  "🌹 Engagement and recognition patterns show healthy team appreciation — aggregate metadata only.",
  "❤️ Wellbeing awareness supports sustainable performance — not mental health diagnosis or surveillance.",
  "🦉 Aggregate workload patterns may warrant a thoughtful conversation about pacing — never blame.",
  "🔔 Recovery windows and sustainable rhythms deserve leadership attention.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE96_COMPANION_CHECK_INS = [
  "🌹 Gentle reflection on meaningful progress — acknowledging effort matters.",
  "❤️ Wellbeing Companion supports — never judges, scores, or diagnoses.",
  "🦉 Sustainable excellence includes recovery — pace thoughtfully.",
  "🔔 Rest contributes to long-term excellence — optional recovery reminders.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE96_PRIVACY_LIMITATIONS = [
  "Hidden monitoring",
  "Mental health diagnosis or clinical labeling",
  "Surveillance scoring of individuals or teams",
  "Intrusive mandatory wellness tracking",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE96_VISION_PHRASES = [
  "Building an environment where people can do exceptional work without sacrificing their humanity.",
  "Wellbeing supports performance — people are not machines.",
  "Wellbeing Companion reflects — never surveils, diagnoses, or intrudes.",
  "Recognition and recovery are strategic employee experience priorities.",
  "Trust through transparent aggregate signals — humans decide action.",
] as const;

export function getImplementationBlueprintPhase96Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE96_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE96_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE96_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE96_VISION,
    selfLoveQuote: IMPLEMENTATION_BLUEPRINT_PHASE96_SELF_LOVE_QUOTE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE96_OBJECTIVE_KEYS,
    experienceQuestions: IMPLEMENTATION_BLUEPRINT_PHASE96_EXPERIENCE_QUESTIONS,
    wellbeingObservations: IMPLEMENTATION_BLUEPRINT_PHASE96_WELLBEING_OBSERVATIONS,
    companionCheckIns: IMPLEMENTATION_BLUEPRINT_PHASE96_COMPANION_CHECK_INS,
    privacyLimitations: IMPLEMENTATION_BLUEPRINT_PHASE96_PRIVACY_LIMITATIONS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE96_VISION_PHRASES,
    engineRoute: "/app/organizational-health-engine",
    enginePhase: "Phase A.56 (extends Blueprint Phase 61)",
    blueprintPhase: "Phase 96 — Employee Experience & Wellbeing Companion Engine",
    companionName: "Wellbeing Companion",
    notLabel: "AI wellness bot",
    innovationLabDistinction:
      "Innovation Lab & Experimentation repo Phase 96 at /app/innovation-lab — phase number collision only.",
    companionDeviceDistinction:
      "Companion Device Ecosystem Phase A.96 at /app/companion-device-ecosystem-engine — device orchestration collision.",
    selfLoveRoute: "/app/self-love-engine",
    gratitudeRoute: "/app/gratitude-recognition-engine",
    presenceComfortRoute: "/app/presence-comfort-protocol",
    humanSuccessRoute: "/app/human-success",
    attentionGuardianRoute: "/app/assistant/attention",
    purposeValuesRoute: "/app/purpose-values-engine",
    inclusionRoute: "/app/inclusion-humanity-engine",
    learningTrainingRoute: "/app/learning-training-engine",
    ekeRoute: "/app/settings/employee-knowledge",
    privacyNote:
      "Employee experience and wellbeing metadata only — optional Wellbeing Companion reflection, no surveillance, no diagnosis, no PII.",
  };
}
