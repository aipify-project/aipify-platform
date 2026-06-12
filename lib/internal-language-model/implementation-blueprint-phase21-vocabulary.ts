export const IMPLEMENTATION_BLUEPRINT_PHASE21_MISSION =
  "Extend Aipify beyond the desk — thoughtful mobile companion experiences; available wherever people work.";

export const IMPLEMENTATION_BLUEPRINT_PHASE21_PHILOSOPHY =
  "Mobile creates clarity, not distraction — the right information at the right moment.";

export const IMPLEMENTATION_BLUEPRINT_PHASE21_ABOS_PRINCIPLE =
  "Companionship is not limited to a desk — support travels with people who need it.";

export const IMPLEMENTATION_BLUEPRINT_PHASE21_VISION_PHRASES = [
  "Trusted presence throughout the day — traveling, meetings, away from desk.",
  "Mobile creates clarity, not distraction — right information at the right moment.",
  "One thoughtful interaction at a time — companionship not limited to a desk.",
  "Informed without overwhelm — relevant, configurable, respectful notifications.",
  "Support travels with people who need it — wherever work happens.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE21_COMPANION_EXPERIENCES = [
  "🌹 Good morning — here is what matters today.",
  "🔔 Milestone reached — steady progress worth noting.",
  "🦉 Before your review — executive highlights surfaced since your last visit.",
  "❤️ It has been an intense week — would a quiet moment help?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE21_MOBILE_DASHBOARD_KEYS = [
  "todays_priorities",
  "open_tasks",
  "support_activity",
  "executive_highlights",
  "bell_moments",
  "recognition_opportunities",
] as const;

export function getImplementationBlueprintPhase21Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE21_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE21_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE21_ABOS_PRINCIPLE,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE21_VISION_PHRASES,
    companionExperiences: IMPLEMENTATION_BLUEPRINT_PHASE21_COMPANION_EXPERIENCES,
    mobileDashboardKeys: IMPLEMENTATION_BLUEPRINT_PHASE21_MOBILE_DASHBOARD_KEYS,
    engineRoute: "/app/notification-communication-engine",
    enginePhase: "A.17",
    blueprintPhase: "Phase 21 — Mobile Companion Engine",
    desktopCompanionDistinction: "Desktop Companion Phase 61 / Blueprint Phase 20 — desk companion at /app/desktop",
    commandCenterDistinction: "Desktop Command Center Phase 27 — native Tauri client at /app/command-center",
    companionPresenceDistinction: "Companion Presence A.67 — mobile-web orb at /app/settings/companion-presence",
    proactiveCompanionDistinction: "Proactive Companion A.79 — observes and recommends at /app/proactive-companion-engine",
    nativeMobileNote: "Native mobile app not built yet — A.17 is the mobile-ready communication layer",
    selfLoveBoundary: "Self Love is a principle — not a feature toggle. No ™ in product copy.",
    sinceLastTimeNote: "Wraps _ocf_since_last_time_summary when Phase 18 migration applied — counts only, no PII",
  };
}
