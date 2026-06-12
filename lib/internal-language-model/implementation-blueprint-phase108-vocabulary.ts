export const IMPLEMENTATION_BLUEPRINT_PHASE108_MISSION =
  "Strengthen customer relationships through journey understanding — experiences, needs, and opportunities.";

export const IMPLEMENTATION_BLUEPRINT_PHASE108_PHILOSOPHY =
  "Customers remember experiences, not transactions — clarity, confidence, and emotional connection. Customer success comes before expansion.";

export const IMPLEMENTATION_BLUEPRINT_PHASE108_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — customer success not extraction. Aipify Customer Success Companion informs and prepares journey mapping, experience optimization, onboarding intelligence, adoption milestones, and advocacy identification; humans decide every engagement and expansion conversation.";

export const IMPLEMENTATION_BLUEPRINT_PHASE108_VISION =
  "We understand our customers more deeply than ever before.";

export const IMPLEMENTATION_BLUEPRINT_PHASE108_OBJECTIVE_KEYS = [
  "journey_mapping",
  "experience_optimization",
  "relationship_strengthening",
  "lifecycle_intelligence",
  "opportunity_identification",
  "long_term_success",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE108_JOURNEY_STAGES = [
  "awareness",
  "interest",
  "evaluation",
  "purchase",
  "onboarding",
  "adoption",
  "expansion",
  "advocacy",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE108_JOURNEY_INSIGHTS = [
  "🦉 Context before action — journey stage clarity before outreach",
  "🌹 Experience quality — celebrate progress, not pressure gaps",
  "🔔 Pause before push — customer success before expansion",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE108_ADOPTION_INTELLIGENCE = [
  "🦉 Adoption strength — explainable usage and confidence components",
  "🌹 Capability expansion readiness — expansion follows value",
  "🔔 Support before scale — adoption gaps need human support first",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE108_COMPANION_GUIDANCE_EXAMPLES = [
  "🦉 Would a journey summary help before your next customer check-in?",
  "🌹 Shall Aipify prepare a celebration note for early success milestones?",
  "🔔 Would deferring expansion conversation until the next success review feel wise?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE108_PRIVACY_FORBIDDEN = [
  "Manipulative journey design or dark patterns that pressure expansion",
  "Hidden profiling or scoring customers cannot see or question",
  "Sales-only optimization that ignores wellbeing and adoption gaps",
  "Ignoring customer wellbeing for short-term renewal or upsell targets",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE108_SELF_LOVE_QUOTES = [
  "Every customer journey moves at a human pace — patience and curiosity beat pressure and urgency.",
  "Celebrating one customer success deeply matters more than chasing the next expansion conversation.",
  "Customers are people — journey intelligence supports relationships, not extraction.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE108_VISION_PHRASES = [
  "We understand our customers more deeply than ever before.",
  "Customers remember experiences, not transactions — clarity, confidence, emotional connection.",
  "Customer success comes before expansion — expansion follows value.",
  "Aipify Customer Success Companion informs and prepares — humans maintain relationships.",
] as const;

export function getImplementationBlueprintPhase108Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE108_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE108_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE108_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE108_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE108_OBJECTIVE_KEYS,
    journeyStages: IMPLEMENTATION_BLUEPRINT_PHASE108_JOURNEY_STAGES,
    journeyInsights: IMPLEMENTATION_BLUEPRINT_PHASE108_JOURNEY_INSIGHTS,
    adoptionIntelligence: IMPLEMENTATION_BLUEPRINT_PHASE108_ADOPTION_INTELLIGENCE,
    companionGuidanceExamples: IMPLEMENTATION_BLUEPRINT_PHASE108_COMPANION_GUIDANCE_EXAMPLES,
    privacyForbidden: IMPLEMENTATION_BLUEPRINT_PHASE108_PRIVACY_FORBIDDEN,
    selfLoveQuotes: IMPLEMENTATION_BLUEPRINT_PHASE108_SELF_LOVE_QUOTES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE108_VISION_PHRASES,
    engineRoute: "/app/customer-lifecycle",
    enginePhase: "Repo Phase 86 Customer Lifecycle & Success Orchestration",
    blueprintPhase: "Phase 108 — Customer Journey Intelligence Engine",
    autonomousOpsDistinction:
      "Blueprint Phase 86 Autonomous Operations at /app/workflow-orchestration-engine — NOT customer journey",
    customerSuccessDistinction:
      "Customer Success Engine A.26 at /app/customer-success-engine — health scoring cross-link",
    growthPartnerDistinction:
      "Growth Partner Blueprint Phase 107 at /app/partners — partner-assisted onboarding",
    meetingCompanionDistinction:
      "Meeting Companion Blueprint Phase 72 / A.61 at /app/meeting-collaboration-intelligence-engine",
    companionName: "Customer Success Companion",
    notGenericAi: "not generic AI sales bot",
    selfLoveRoute: "/app/self-love-engine",
    selfLoveBoundary:
      "Self Love supports wellbeing rhythms — principle only; Journey Intelligence stores customer success metadata.",
    privacyNote:
      "Metadata only — no manipulative journey design, no hidden profiling, no pressure expansion. Humans decide; Aipify Customer Success Companion informs and prepares.",
  };
}
