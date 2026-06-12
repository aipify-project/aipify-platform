export const IMPLEMENTATION_BLUEPRINT_PHASE20_MISSION =
  "Accessible desktop companion — support, awareness, and assistance throughout the workday; available when needed, not intrusive.";

export const IMPLEMENTATION_BLUEPRINT_PHASE20_PHILOSOPHY =
  "Support available naturally; present without demanding attention.";

export const IMPLEMENTATION_BLUEPRINT_PHASE20_ABOS_PRINCIPLE =
  "Best companions contribute meaningfully when needed — they do not compete for attention.";

export const IMPLEMENTATION_BLUEPRINT_PHASE20_VISION_PHRASES = [
  "Trusted presence throughout the workday — support within reach without demanding attention.",
  "Best companions contribute meaningfully when needed — they do not compete for attention.",
  "Available when needed, not intrusive — calm notifications, explainable sources, user-controlled modes.",
  "Since Last Time — pick up where you left off with trends, not noise.",
  "Sustainable productivity — celebrate progress, suggest breaks, reduce notification fatigue.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE20_COMPANION_EXPERIENCES = [
  "🌹 Good morning — here is what matters today.",
  "🔔 Your team closed three high-priority tasks since yesterday — steady progress worth noting.",
  "🦉 Before your afternoon review — quality and integration signals surfaced since your last visit.",
  "❤️ It has been a busy week — would a short break help before the next priority block?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE20_MINI_PANEL_KEYS = [
  "ask_anything",
  "tasks",
  "notifications",
  "knowledge_center",
  "support_queues",
  "executive_summaries",
] as const;

export function getImplementationBlueprintPhase20Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE20_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE20_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE20_ABOS_PRINCIPLE,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE20_VISION_PHRASES,
    companionExperiences: IMPLEMENTATION_BLUEPRINT_PHASE20_COMPANION_EXPERIENCES,
    miniPanelKeys: IMPLEMENTATION_BLUEPRINT_PHASE20_MINI_PANEL_KEYS,
    engineRoute: "/app/desktop",
    enginePhase: "Phase 61",
    blueprintPhase: "Phase 20 — Desktop Companion Engine",
    commandCenterDistinction: "Desktop Command Center Phase 27 — native Tauri client at /app/command-center",
    proactiveCompanionDistinction: "Proactive Companion A.79 — observes and recommends at /app/proactive-companion-engine",
    companionPresenceDistinction: "Companion Presence A.67 — presence indicator at /app/companion-presence-indicator-engine",
    briefingDistinction: "Briefing Phase 60 already in get_desktop_companion_card — extend, do not duplicate",
    selfLoveBoundary: "Self Love is a principle — not a feature toggle. No ™ in product copy.",
    sinceLastTimeNote: "Reuses _ocf_since_last_time_summary when organization context available — counts only, no PII",
  };
}
