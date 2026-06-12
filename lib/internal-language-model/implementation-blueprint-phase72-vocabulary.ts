export const IMPLEMENTATION_BLUEPRINT_PHASE72_MISSION =
  "Capture decisions, commitments, and insights from meetings; strengthen collaboration and accountability.";

export const IMPLEMENTATION_BLUEPRINT_PHASE72_PHILOSOPHY =
  "Meeting value = shared understanding + clear next steps — better meetings, not more meetings.";

export const IMPLEMENTATION_BLUEPRINT_PHASE72_ABOS_PRINCIPLE =
  "Meetings create shared understanding leading to meaningful action — not conversation alone. Aipify informs and prepares; humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE72_OBJECTIVE_KEYS = [
  "meeting_summaries",
  "decision_tracking",
  "action_item_creation",
  "follow_up_reminders",
  "meeting_continuity",
  "collaboration_improvement",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE72_SUPPORTED_PLATFORMS = [
  "Microsoft Teams / Outlook / 365",
  "Google Meet / Calendar / Workspace",
  "Zoom",
  "Slack",
  "Discord",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE72_DECISION_EXAMPLES = [
  "🔔 Pilot timing confirmed for next quarter",
  "🌹 Training materials update approved",
  "🔔 Budget allocation direction agreed — details pending approval",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE72_COMPANION_INSIGHTS = [
  "🦉 Several action items concentrate on one area — would ownership review help?",
  "🌹 Meaningful objectives progressed in recent meetings",
  "🔔 Some action items lack assigned owners — clarity strengthens follow-through",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE72_CONTINUITY_EXAMPLES = [
  "🦉 Three topics from last week's sync remain open — shall I summarize before today's meeting?",
  "🌹 Two commitments from the executive review are due this week — available for your prep.",
  "🦉 The pilot timing decision connects to three open action items — would context help?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE72_VISION_PHRASES = [
  "Our meetings have become significantly more effective.",
  "Clarity, connection, and progress — shared understanding leads to meaningful action.",
  "Better meetings, not more meetings.",
  "Decisions are visible — follow-through strengthens collaboration.",
  "Several meaningful outcomes emerged from today's discussions.",
] as const;

export function getImplementationBlueprintPhase72Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE72_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE72_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE72_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE72_OBJECTIVE_KEYS,
    supportedPlatforms: IMPLEMENTATION_BLUEPRINT_PHASE72_SUPPORTED_PLATFORMS,
    decisionExamples: IMPLEMENTATION_BLUEPRINT_PHASE72_DECISION_EXAMPLES,
    companionInsights: IMPLEMENTATION_BLUEPRINT_PHASE72_COMPANION_INSIGHTS,
    continuityExamples: IMPLEMENTATION_BLUEPRINT_PHASE72_CONTINUITY_EXAMPLES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE72_VISION_PHRASES,
    engineRoute: "/app/meeting-collaboration-intelligence-engine",
    enginePhase: "Phase A.61",
    blueprintPhase: "Phase 72 — Meeting Companion & Collaboration Engine",
    globalLearningRoute: "/app/global-learning",
    globalLearningDistinction: "Global Learning Network repo Phase 72 — cross-tenant learning, NOT meeting companion",
    agentsRoute: "/app/agents",
    agentsDistinction: "Multi-Agent Collaboration repo Phase 74 — agent orchestration, NOT human meetings",
    calendarsRoute: "/app/assistant/calendars",
    calendarsDistinction: "Context Engine calendars — cross-link only, never replaces calendars",
    unifiedTaskRoute: "/app/unified-task-follow-up-engine",
    unifiedTaskDistinction: "Unified Task A.62 — create_task_from_source cross-link for action items",
    stakeholderRoute: "/app/stakeholder-communication-engine",
    documentOutputRoute: "/app/document-output-engine",
    selfLoveRoute: "/app/self-love-engine",
    journeyPhrase: "Several meaningful outcomes emerged from today's discussions.",
    selfLoveBoundary:
      "Self Love supports healthy pacing and progress recognition — principle only; Meeting Companion stores metadata.",
    privacyNote:
      "Org controls recording permissions, consent, access boundaries, and retention — metadata only, no raw transcripts.",
    consentNote: "Recording and summary features require organizational consent — never silent capture.",
    platformScaffoldNote: "Future platform integrations — scaffold metadata only, no fake live connections.",
  };
}
