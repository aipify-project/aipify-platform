export * from "./types";
export * from "./parse";
export * from "./contexts";
export { UNONIGHT_BRIEFING_EVENTS } from "./presets/unonight-briefing";
export { collectPresetEvents, presetEventsToRpcPayload } from "./collectors";
export {
  collectBriefingEventsJob,
  generateSinceLastLoginJob,
  generateDailyBriefJob,
  markBriefingViewedJob,
} from "./jobs";

export const BRIEFING_MODULE_PATH = "aipify-core/modules/briefing/phase-60";
export const BRIEFING_CORE_PRINCIPLE =
  "Dette har skjedd siden sist. Dette er viktig. Dette bør du gjøre nå.";
export const BRIEFING_PRIVACY_NOTE =
  "Briefings summarize verified module activity only — calm, prioritized, permission-safe. No hallucinated events.";
