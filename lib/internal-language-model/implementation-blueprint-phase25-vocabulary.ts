export const IMPLEMENTATION_BLUEPRINT_PHASE25_MISSION =
  "Move beyond reactive assistance — timely, valuable support before users ask; anticipate needs responsibly.";

export const IMPLEMENTATION_BLUEPRINT_PHASE25_PHILOSOPHY =
  "The most valuable assistance arrives before difficulties escalate — proactive, not intrusive.";

export const IMPLEMENTATION_BLUEPRINT_PHASE25_ABOS_PRINCIPLE =
  "Best companions help prepare before emergencies — preparation creates confidence.";

export const IMPLEMENTATION_BLUEPRINT_PHASE25_PROACTIVE_OBJECTIVE_KEYS = [
  "early_risk_detection",
  "opportunity_identification",
  "reminder_generation",
  "workflow_improvement",
  "follow_up_recommendations",
  "knowledge_gap_awareness",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE25_PROACTIVE_EXAMPLE_DOMAINS = [
  "support",
  "operational",
  "knowledge",
  "executive",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE25_VISION_PHRASES = [
  "Move from reactive assistance to intentional leadership — glad Aipify brought that early.",
  "The most valuable assistance arrives before difficulties escalate — proactive, not intrusive.",
  "Preparation creates confidence — best companions help prepare before emergencies.",
  "Developments surface early; proactive resolution reduces urgency and builds trust.",
  "Peace of mind through timely guidance — helpful never overwhelming.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE25_COMPANION_EXAMPLES = [
  "🦉 Support response times rose — the trend deserves attention before backlog grows.",
  "🌹 Three approval steps overlap — an opportunity to simplify when you review.",
  "🔔 Two tasks share a deadline — a small handoff now may prevent a bottleneck.",
  "❤️ Before your meeting — three priorities that matter most today.",
] as const;

export function getImplementationBlueprintPhase25Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE25_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE25_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE25_ABOS_PRINCIPLE,
    proactiveObjectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE25_PROACTIVE_OBJECTIVE_KEYS,
    proactiveExampleDomains: IMPLEMENTATION_BLUEPRINT_PHASE25_PROACTIVE_EXAMPLE_DOMAINS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE25_VISION_PHRASES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE25_COMPANION_EXAMPLES,
    engineRoute: "/app/proactive-companion-engine",
    enginePhase: "Phase A.79",
    blueprintPhase: "Phase 25 — Proactive Assistance Engine",
    companionPresenceDistinction:
      "Companion Presence A.67 — floating orb at /app/settings/companion-presence, not proactive nudges",
    ilmGuidanceDistinction:
      "ILM proactive guidance — language patterns in lib/internal-language-model/proactive-guidance.ts",
    notificationDistinction:
      "Notification Communication A.17 — delivery at /app/notification-communication-engine",
    dedicationDistinction: "Dedication Engine A.91 — follow-through philosophy at /app/dedication-engine",
    selfLoveBoundary:
      "Self Love prevents crises and reduces urgency — principle only; Proactive Companion stores metadata nudges.",
  };
}
