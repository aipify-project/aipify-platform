export const IMPLEMENTATION_BLUEPRINT_PHASE50_MISSION =
  "Help Sales Experts see the meaningful arc of their Aipify journey — reflection, contribution awareness, authentic milestones, and sustainable success that celebrates character and service, not revenue alone.";

export const IMPLEMENTATION_BLUEPRINT_PHASE50_PHILOSOPHY =
  "Legacy is lived through relationships and consistent care. Milestones should feel authentic. Recognition celebrates contribution and growth — never vanity metrics or comparison shame.";

export const IMPLEMENTATION_BLUEPRINT_PHASE50_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) partners build lasting value when they can pause, reflect, and see how their work helped organizations — humans decide what matters; Aipify surfaces honest metadata.";

export const IMPLEMENTATION_BLUEPRINT_PHASE50_OBJECTIVE_KEYS = [
  "reflection",
  "contribution_awareness",
  "milestones",
  "growth_visibility",
  "storytelling",
  "sustainable_success",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE50_TIMELINE_KEYS = [
  "first_customer",
  "first_demo",
  "first_renewal",
  "first_mentee",
  "first_international_customer",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE50_RECOGNITION_KEYS = [
  "community_builder",
  "trusted_advisor",
  "five_year_milestone",
  "legacy_contributor",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE50_COMPANION_EXAMPLES = [
  "🌹 Your journey includes organizations you helped adopt Aipify thoughtfully — that contribution matters.",
  "🔔 Your first customer milestone is part of your legacy — celebrate the relationship, not just the subscription.",
  "🦉 Demonstrations you prepared with honesty become part of how prospects remember ethical sales.",
  "❤️ Mentorship you offered voluntarily strengthens the whole Sales Expert community.",
  "🌍 International customers reflect trust in your guidance beyond your home region.",
] as const;

export function getImplementationBlueprintPhase50Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE50_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE50_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE50_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE50_OBJECTIVE_KEYS,
    timelineKeys: IMPLEMENTATION_BLUEPRINT_PHASE50_TIMELINE_KEYS,
    recognitionKeys: IMPLEMENTATION_BLUEPRINT_PHASE50_RECOGNITION_KEYS,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE50_COMPANION_EXAMPLES,
    engineRoute: "/app/sales-expert-engine",
    enginePhase: "A.95",
    blueprintPhase: "Phase 50 — Sales Legacy & Success Engine",
    legacyTab: "legacy",
    legacyTabMenu: "Legacy / Journey",
    omeRoute: "/app/memory",
    omePhase: "Phase 50 OME",
    legacyEngineRoute: "/app/legacy-engine",
    legacyEnginePhase: "A.86",
    organizationalResiliencePhase: "A.50",
    performanceRecognitionPhase: 41,
    communityMentorshipPhase: 47,
    operationsPhase: 48,
    gratitudeRoute: "/app/gratitude-recognition-engine",
    gratitudePhase: "A.89",
    selfLoveRoute: "/app/self-love-engine",
    selfLovePhase: "A.76",
    impactRoute: "/app/impact-engine",
    impactPhase: "A.85",
    distinctionNote:
      "Blueprint Phase 50 is Sales Expert personal/business legacy in the partner portal only — distinct from OME Phase 50, Legacy Engine A.86, and Organizational Resilience A.50.",
    metadataOnly: true,
    authenticTone: "authentic_not_boastful",
  };
}
