export const IMPLEMENTATION_BLUEPRINT_PHASE18_MISSION =
  "Centralized operational experience — visibility, coordination, and control across modules.";

export const IMPLEMENTATION_BLUEPRINT_PHASE18_PHILOSOPHY =
  "Operational clarity creates confidence — reduce noise, increase focus, enable informed action.";

export const IMPLEMENTATION_BLUEPRINT_PHASE18_ABOS_PRINCIPLE =
  "Reduce noise, increase focus — one operations center for cross-module operational awareness.";

export const IMPLEMENTATION_BLUEPRINT_PHASE18_MODULE_KEYS = [
  "support_overview",
  "task_overview",
  "knowledge_overview",
  "executive_overview",
  "recognition_overview",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE18_VISION_PHRASES = [
  "Operational clarity creates confidence — one place to see what needs attention.",
  "Reduce noise, increase focus — module overviews show counts, not everything at once.",
  "Humans decide — Aipify aggregates, explains, and prepares.",
  "Since Last Time — pick up where you left off with trends across support, tasks, and knowledge.",
  "Calm coordination beats alert fatigue.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE18_COMPANION_EXAMPLES = [
  "🔔 Your team resolved 12 support cases since your last visit — steady progress worth noting.",
  "🌹 Three teammates completed high-priority tasks this week — would you like to send recognition?",
  "🦉 Before the weekly operations review — here is what changed across support, tasks, and knowledge.",
] as const;

export function getImplementationBlueprintPhase18Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE18_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE18_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE18_ABOS_PRINCIPLE,
    moduleKeys: IMPLEMENTATION_BLUEPRINT_PHASE18_MODULE_KEYS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE18_VISION_PHRASES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE18_COMPANION_EXAMPLES,
    engineRoute: "/app/operations-center-foundation-engine",
    enginePhase: "A.32",
    blueprintPhase: "Phase 18 — Operations Center Engine Foundation",
    operationsDashboardDistinction:
      "Operations Dashboard A.9 — role-aware widgets, distinct from Operations Center Foundation A.32",
    commandCenterDistinction: "Command Center Phase 26 — presence and notifications, not event coordination",
    aocDistinction: "AOC Phase 79 — autonomous operations watchers at /app/operations",
    executiveInsightsDistinction: "Executive Insights A.35 — executive summaries; Since Last Time pattern reused",
    selfLoveBoundary: "Self Love is a principle — not a feature toggle. No ™ in product copy.",
    sinceLastTimeNote:
      "Counts only — previous login, auth.last_sign_in_at, presence engagement, or 7-day fallback",
  };
}
