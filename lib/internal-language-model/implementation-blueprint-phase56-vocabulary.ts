export const IMPLEMENTATION_BLUEPRINT_PHASE56_MISSION =
  "Unify companion presence awareness with responsible proactive assistance — timely guidance that observes context, respects preferences, and prepares humans before urgency arrives.";

export const IMPLEMENTATION_BLUEPRINT_PHASE56_PHILOSOPHY =
  "Presence means being thoughtfully available — not always visible. Aipify observes operational context, recognizes help opportunities, and offers respectful nudges without interruption, fear, or dependency.";

export const IMPLEMENTATION_BLUEPRINT_PHASE56_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) companions observe, inform, and recommend — humans decide. Companion presence and proactive assistance work together: awareness without surveillance, guidance without pressure.";

export const IMPLEMENTATION_BLUEPRINT_PHASE56_OBJECTIVE_KEYS = [
  "proactive_recommendations",
  "contextual_reminders",
  "timely_assistance",
  "prioritization",
  "human_nudges",
  "respectful_interventions",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE56_VISION_PHRASES = [
  "Aipify feels present when it matters — thoughtful, not intrusive.",
  "The best companions observe quietly and speak when help truly matters.",
  "Presence plus proactive assistance — awareness without surveillance, guidance without pressure.",
  "Preparation before urgency — glad Aipify brought that early.",
  "Peace of mind through respectful nudges — helpful never overwhelming.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE56_PROACTIVE_SUPPORT_EXAMPLES = [
  "🦉 Support response times rose — the trend deserves attention before backlog grows.",
  "🌹 Renewal review window opens — Aipify prepared a metadata summary when you have a moment.",
  "🔔 Two commitments share the same deadline — a small handoff now may prevent a bottleneck.",
  "❤️ Before your meeting — three priorities that matter most today. Everything else can wait.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE56_OPERATIONAL_AWARENESS_DOMAINS = [
  "support",
  "deadlines",
  "commitments",
  "renewals",
  "approvals",
  "knowledge_review",
] as const;

export function getImplementationBlueprintPhase56Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE56_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE56_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE56_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE56_OBJECTIVE_KEYS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE56_VISION_PHRASES,
    proactiveSupportExamples: IMPLEMENTATION_BLUEPRINT_PHASE56_PROACTIVE_SUPPORT_EXAMPLES,
    operationalAwarenessDomains: IMPLEMENTATION_BLUEPRINT_PHASE56_OPERATIONAL_AWARENESS_DOMAINS,
    engineRoute: "/app/proactive-companion-engine",
    enginePhase: "Phase A.79",
    priorBlueprintPhase: "Phase 25 — Proactive Assistance Engine",
    blueprintPhase: "Phase 56 — Companion Presence & Proactive Assistance Engine",
    companionPresenceDistinction:
      "Companion Presence A.67 — floating orb at /app/settings/companion-presence; Phase 56 is proactive guidance layer, not orb UI",
    tagDistinction: "Attention Guardian TAG — personal focus mode at /app/assistant/attention",
    personalProductivityDistinction:
      "Personal Productivity A.70 — individual patterns at /app/personal-productivity-engine",
    commandCenterDistinction: "Command Center A.26 — consumes proactive signals at /app/command-center",
    salesExpertRoute: "/app/sales-expert-engine",
    executiveInsightsRoute: "/app/executive-insights-engine",
    selfLoveRoute: "/app/self-love-engine",
    ethicsRoute: "/app/ai-ethics-responsible-use-engine",
    workflowRoute: "/app/workflow-orchestration-engine",
    trustActionsRoute: "/app/approvals",
    highRiskNote: "High-risk actions require explicit approval — proactive nudges never auto-execute.",
  };
}
