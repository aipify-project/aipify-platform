export const IMPLEMENTATION_BLUEPRINT_PHASE44_MISSION =
  "Help Sales Experts nurture long-term customer partnerships through renewal awareness, health insights, and consultative expansion — never aggressive upsell.";

export const IMPLEMENTATION_BLUEPRINT_PHASE44_PHILOSOPHY =
  "Renewals should feel intentional, not accidental. Customer health metadata supports care — never surveillance or blame.";

export const IMPLEMENTATION_BLUEPRINT_PHASE44_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) partnerships grow when organizations succeed — humans decide, Aipify prepares renewal conversations with clarity.";

export const IMPLEMENTATION_BLUEPRINT_PHASE44_OBJECTIVE_KEYS = [
  "renewal_awareness",
  "health_monitoring",
  "expansion_recommendations",
  "success_planning",
  "risk_support",
  "relationships",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE44_PLAYBOOK_KEYS = [
  "thirty_days",
  "fourteen_days",
  "renewal_week",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE44_COMPANION_EXAMPLES = [
  "🔔 Two customer relationships may benefit from a renewal conversation in the next 30 days — here is what Aipify noticed from follow-up metadata.",
  "🌹 A customer recently renewed — a thoughtful check-in may strengthen the partnership.",
  "🔔 An anniversary is approaching — celebrate progress before discussing next year.",
  "🌹 Onboarding readiness looks strong — a success review may be a natural next step.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE44_VISION_PHRASES = [
  "Long-term partnerships grow through honest preparation — renewals should feel intentional, not accidental.",
  "Customer health is metadata for care — never surveillance or blame.",
  "Expansion when it genuinely helps — consultative conversations, sustainable growth.",
  "Celebrate progress 🌹🔔 — relationships matter as much as subscriptions.",
] as const;

export function getImplementationBlueprintPhase44Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE44_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE44_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE44_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE44_OBJECTIVE_KEYS,
    playbookKeys: IMPLEMENTATION_BLUEPRINT_PHASE44_PLAYBOOK_KEYS,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE44_COMPANION_EXAMPLES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE44_VISION_PHRASES,
    engineRoute: "/app/sales-expert-engine",
    enginePhase: "A.95",
    blueprintPhase: "Phase 44 — Customer Renewal & Expansion Engine",
    tabKey: "renewalExpansion",
    revenueIntelligenceRoute: "/app/commercial",
    revenueIntelligencePhase: 39,
    customerSuccessRoute: "/app/customer-success-engine",
    customerSuccessPhase: "A.26",
    partnerSuccessRoute: "/app/partner-success-engine",
    partnerSuccessPhase: "A.73",
    businessPacksRoute: "/app/business-packs-foundation-engine",
    businessPacksPhase: "A.43",
    selfLoveRoute: "/app/self-love-engine",
    selfLovePhase: "A.76",
    performanceRecognitionPhase: 41,
    coachEnablementPhase: 45,
    aefDistinction:
      "Autonomous Execution Framework Phase 44 (/app/action-center) — controlled business action execution, not partner renewal coaching",
    distinctionNote:
      "Distinct from AEF Phase 44 — Phase 44 Renewal & Expansion tab supports partner customer relationships; AEF executes approved tenant actions.",
    metadataOnly: true,
    consultativeTone: "Expansion recommendations are consultative — never aggressive upsell.",
  };
}
