export const IMPLEMENTATION_BLUEPRINT_PHASE36_MISSION =
  "People move between devices; Aipify follows naturally without disruption — a unified companion experience across the surfaces they already use.";

export const IMPLEMENTATION_BLUEPRINT_PHASE36_PHILOSOPHY =
  "Companion intelligence should feel continuous, not fragmented. Device-specific engines own their surfaces; the ecosystem engine orchestrates cross-device readiness and honest roadmap status.";

export const IMPLEMENTATION_BLUEPRINT_PHASE36_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) companion intelligence meets people where they work — desktop, mobile, and future surfaces — with human control on every device.";

export const IMPLEMENTATION_BLUEPRINT_PHASE36_VISION_PHRASES = [
  "Aipify follows you — naturally, without disruption.",
  "One companion experience across the devices you already use.",
  "Continuity is designed — not accidental sync.",
  "Future devices will join the ecosystem with the same trust boundaries.",
  "Your attention is protected on every surface.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE36_CONTINUITY_EXAMPLES = [
  "🌹 Continue where you left off on another device — context follows, not surveillance.",
  "🦉 Cross-device notes and summaries help you pick up without repeating yourself.",
  "🔔 Important follow-ups surface on the device you are using — never duplicated noise.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE36_VOICE_PRINCIPLES = [
  "Respectful — never interrupt inappropriately",
  "Context-aware — understands what you are doing, not everything you do",
  "Privacy-conscious — metadata only; no ambient recording",
  "Helpful — concise phrases that prepare, not perform",
] as const;

export function getImplementationBlueprintPhase36Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE36_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE36_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE36_ABOS_PRINCIPLE,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE36_VISION_PHRASES,
    continuityExamples: IMPLEMENTATION_BLUEPRINT_PHASE36_CONTINUITY_EXAMPLES,
    voicePrinciples: IMPLEMENTATION_BLUEPRINT_PHASE36_VOICE_PRINCIPLES,
    engineRoute: "/app/companion-device-ecosystem-engine",
    enginePhase: "A.96",
    blueprintPhase: "Phase 36 — Companion Device Ecosystem Engine",
    desktopCompanionRoute: "/app/desktop",
    mobileCompanionRoute: "/app/notification-communication-engine",
    commandCenterRoute: "/app/command-center",
    companionPresenceRoute: "/app/settings/companion-presence",
    distinctionNote:
      "Orchestration hub only — does NOT duplicate Desktop Companion, Mobile Companion (A.17), Command Center (Tauri), or Companion Presence (A.67).",
    metadataOnly: "No keystroke logging, screen monitoring, or ambient surveillance.",
  };
}
