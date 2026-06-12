export const IMPLEMENTATION_BLUEPRINT_PHASE12_MISSION =
  "Help organizations prioritize effectively, reduce friction, and maintain steady progress on what matters.";

export const IMPLEMENTATION_BLUEPRINT_PHASE12_PHILOSOPHY =
  "Not all tasks are equal — focus on what matters, reduce friction, and make steady sustainable progress.";

export const IMPLEMENTATION_BLUEPRINT_PHASE12_ABOS_PRINCIPLE =
  "Focus on what matters — sustainable progress beats constant urgency.";

export const IMPLEMENTATION_BLUEPRINT_PHASE12_PRIORITY_LEVELS = [
  "critical",
  "high",
  "medium",
  "low",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE12_VISION_PHRASES = [
  "Prioritize effectively — focus on what matters, not everything at once.",
  "Clear ownership and gentle follow-up beat constant urgency.",
  "Steady progress compounds — celebrate completions along the way.",
  "Transparent recommendations build trust — humans always decide.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE12_BELL_EXAMPLES = [
  "🔔 Critical task completed — the team moved something important forward.",
  "🔔 All weekly priorities reviewed — steady progress this week.",
  "🔔 Meeting action items converted to tracked tasks — clear ownership set.",
] as const;

export function getImplementationBlueprintPhase12Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE12_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE12_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE12_ABOS_PRINCIPLE,
    priorityLevels: IMPLEMENTATION_BLUEPRINT_PHASE12_PRIORITY_LEVELS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE12_VISION_PHRASES,
    bellExamples: IMPLEMENTATION_BLUEPRINT_PHASE12_BELL_EXAMPLES,
    engineRoute: "/app/unified-task-follow-up-engine",
    enginePhase: "A.62",
    blueprintPhase: "Phase 12 — Task & Priority Engine Foundation",
    priorityFocusDistinction:
      "Priority & Focus Engine A.80 at /app/priority-focus-engine — cross-link only, do not merge with A.62",
    pameDistinction: "PAME personal tasks at /app/assistant — distinct from organization_tasks",
    selfLoveBoundary: "Self Love is a principle — not a feature toggle. No ™ in product copy.",
  };
}
