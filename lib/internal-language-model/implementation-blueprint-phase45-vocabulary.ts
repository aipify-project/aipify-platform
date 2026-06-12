export const IMPLEMENTATION_BLUEPRINT_PHASE45_MISSION =
  "Equip Sales Experts with supportive coaching, enablement guidance, and sustainable pacing — never punitive judgment.";

export const IMPLEMENTATION_BLUEPRINT_PHASE45_PHILOSOPHY =
  "Coaching strengthens confidence. Guidance should inspire thoughtful action. Success should never come at the expense of wellbeing or integrity.";

export const IMPLEMENTATION_BLUEPRINT_PHASE45_ABOS_PRINCIPLE =
  "People thrive when they feel equipped and respected. Coaching should reinforce professional growth, not pressure.";

export const IMPLEMENTATION_BLUEPRINT_PHASE45_COMPANION_ROLE_KEYS = [
  "mentor",
  "strategist",
  "motivator",
  "companion",
  "performance_advisor",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE45_ACTIVITY_KEYS = [
  "contact_local_businesses",
  "follow_ups",
  "schedule_demo",
  "revisit_inactive",
  "ask_introductions",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE45_OBJECTION_EXAMPLES = [
  "We do not have time",
  "We already use another system",
  "We cannot afford it",
  "We need to think about it",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE45_BRIEFING_EXAMPLES = [
  "You have opportunities that may benefit from a thoughtful follow-up this week.",
  "A few customer relationships may be ready for a renewal conversation.",
  "Your outreach this week is steady — consistency often matters more than intensity.",
  "Small, reliable steps forward often build the strongest partnerships.",
] as const;

export function getImplementationBlueprintPhase45Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE45_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE45_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE45_ABOS_PRINCIPLE,
    companionRoleKeys: IMPLEMENTATION_BLUEPRINT_PHASE45_COMPANION_ROLE_KEYS,
    activityKeys: IMPLEMENTATION_BLUEPRINT_PHASE45_ACTIVITY_KEYS,
    objectionExamples: IMPLEMENTATION_BLUEPRINT_PHASE45_OBJECTION_EXAMPLES,
    briefingExamples: IMPLEMENTATION_BLUEPRINT_PHASE45_BRIEFING_EXAMPLES,
    engineRoute: "/app/sales-expert-engine",
    enginePhase: "A.95",
    blueprintPhase: "Phase 45 — Sales Coach & Enablement Engine",
    selfLoveRoute: "/app/self-love-engine",
    selfLovePhase: "A.76",
    certificationRoute: "/app/certification-achievement-engine",
    certificationPhase: "A.37",
    learningTrainingRoute: "/app/learning-training-engine",
    learningTrainingPhase: "A.36",
    performanceRecognitionPhase: 41,
    simulationLabRoute: "/app/simulations",
    distinctionNote:
      "Distinct from Performance & Recognition Phase 41 — Phase 45 is daily coaching and enablement within /app/sales-expert-engine Coach tab. Never punitive or shaming.",
  };
}
