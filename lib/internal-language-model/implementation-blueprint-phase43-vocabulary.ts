export const IMPLEMENTATION_BLUEPRINT_PHASE43_MISSION =
  "Help Sales Experts schedule meetings professionally, follow up consistently, and prepare thoughtfully — trust through consistency.";

export const IMPLEMENTATION_BLUEPRINT_PHASE43_PHILOSOPHY =
  "Follow-up demonstrates professionalism. Booking should feel personal and respectful — never pressure or mass outreach.";

export const IMPLEMENTATION_BLUEPRINT_PHASE43_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) partners build trust through prepared, consistent engagement — humans decide; Aipify informs and prepares.";

export const IMPLEMENTATION_BLUEPRINT_PHASE43_BOOKING_SESSION_KEYS = [
  "discovery",
  "demo",
  "onboarding",
  "follow_up_consultation",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE43_DEMO_TYPE_KEYS = [
  "support",
  "executive",
  "commerce",
  "community",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE43_CALENDAR_PROVIDER_KEYS = [
  "google",
  "outlook",
  "apple",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE43_COMPANION_NUDGE_KEYS = [
  "thoughtful_follow_up",
  "scheduled_reminder",
  "prep_suggestion",
] as const;

export function getImplementationBlueprintPhase43Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE43_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE43_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE43_ABOS_PRINCIPLE,
    bookingSessionKeys: IMPLEMENTATION_BLUEPRINT_PHASE43_BOOKING_SESSION_KEYS,
    demoTypeKeys: IMPLEMENTATION_BLUEPRINT_PHASE43_DEMO_TYPE_KEYS,
    calendarProviderKeys: IMPLEMENTATION_BLUEPRINT_PHASE43_CALENDAR_PROVIDER_KEYS,
    companionNudgeKeys: IMPLEMENTATION_BLUEPRINT_PHASE43_COMPANION_NUDGE_KEYS,
    bookingUrlPattern: "https://aipify.ai/book/{slug}",
    engineRoute: "/app/sales-expert-engine",
    enginePhase: "A.95",
    blueprintPhase: "Phase 43 — Sales Engagement & Booking Engine",
    contextCalendarsRoute: "/app/assistant/calendars",
    unifiedTasksRoute: "/app/unified-tasks-engine",
    meetingCollaborationRoute: "/app/meeting-collaboration-engine",
    selfLoveRoute: "/app/self-love-engine",
    selfLovePhase: "A.76",
    coachPhase: 45,
    distinctionNote:
      "Distinct from Coach Phase 45/46 and Email Center — Phase 43 is Engagement & Booking tab within /app/sales-expert-engine. Calendar sync is honest OAuth scaffold — not a replacement calendar.",
  };
}
