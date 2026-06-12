export const MEETING_COMPANION_TEAMS_PRIVACY_PRE_MEETING_PROMPT =
  "Your Teams meeting starts soon. Would you like me to join and help?";

export const MEETING_COMPANION_TEAMS_PRIVACY_POST_MEETING_PROMPT =
  "Would you like me to save or send this meeting summary?";

export const MEETING_COMPANION_TEAMS_PRIVACY_COMPANION_NAME = "Aipify Companion";

export const MEETING_COMPANION_TEAMS_PRIVACY_ABOS_PRINCIPLE =
  "Preserve what matters without violating trust — privacy first, consent always, value when approved.";

export const MEETING_COMPANION_TEAMS_PRIVACY_JOIN_OPTIONS = [
  "Join + take notes",
  "Join + action items",
  "Join + summary",
  "Do not join",
  "Never join this type",
] as const;

export const MEETING_COMPANION_TEAMS_PRIVACY_SAVE_PREFERENCES = [
  "Do not save",
  "Private notes only",
  "Meeting summary",
  "Decisions + actions",
  "Knowledge Center",
  "Organizational Memory",
] as const;

export const MEETING_COMPANION_TEAMS_PRIVACY_POST_MEETING_OPTIONS = [
  "Save privately",
  "Send to participants",
  "Save to Knowledge Center",
  "Create tasks",
  "Delete everything",
  "Edit first",
] as const;

export const MEETING_COMPANION_TEAMS_PRIVACY_PROHIBITED = [
  "Join without approval",
  "Secretly record",
  "Store raw audio/video by default",
  "Save content without approval",
  "Send summaries without review when required",
  "Access private meetings without permission",
] as const;

export const MEETING_COMPANION_TEAMS_PRIVACY_VISION_PHRASES = [
  "Trusted meeting companion — helps when invited.",
  "Explains clearly what Aipify will and will not do.",
  "Respects privacy — default do not save.",
  "Visible as Aipify Companion — never secret recording.",
  "Value when approved — notes, summaries, and actions on your terms.",
] as const;

export const MEETING_COMPANION_TEAMS_PRIVACY_FAQ = [
  {
    question: "Does Aipify join meetings automatically?",
    answer:
      "No. Aipify asks before joining. User or organization consent rules apply — never auto-join without approval.",
  },
  {
    question: "Does Aipify record meetings?",
    answer:
      "No raw audio or video by default. Aipify captures approved notes and summary metadata only when you consent.",
  },
  {
    question: "Can participants see Aipify?",
    answer:
      "Yes. When approved, Aipify appears as Aipify Companion — visible to all participants. Aipify never joins hidden.",
  },
  {
    question: "Can I delete meeting notes?",
    answer:
      "Yes. You can delete or adjust meeting notes per your permissions and organization retention policies.",
  },
  {
    question: "Can Aipify create tasks from meetings?",
    answer:
      "Yes, when approved. Aipify drafts tasks — you review and confirm before creation via Unified Tasks A.62.",
  },
  {
    question: "Can Aipify save meeting knowledge?",
    answer:
      "Yes, with approval. Save to Knowledge Center or Organizational Memory when you choose — default is do not save.",
  },
] as const;

export function getMeetingCompanionTeamsPrivacyVocabulary() {
  return {
    preMeetingPrompt: MEETING_COMPANION_TEAMS_PRIVACY_PRE_MEETING_PROMPT,
    postMeetingPrompt: MEETING_COMPANION_TEAMS_PRIVACY_POST_MEETING_PROMPT,
    companionName: MEETING_COMPANION_TEAMS_PRIVACY_COMPANION_NAME,
    abosPrinciple: MEETING_COMPANION_TEAMS_PRIVACY_ABOS_PRINCIPLE,
    joinOptions: MEETING_COMPANION_TEAMS_PRIVACY_JOIN_OPTIONS,
    savePreferences: MEETING_COMPANION_TEAMS_PRIVACY_SAVE_PREFERENCES,
    postMeetingOptions: MEETING_COMPANION_TEAMS_PRIVACY_POST_MEETING_OPTIONS,
    prohibitedActions: MEETING_COMPANION_TEAMS_PRIVACY_PROHIBITED,
    visionPhrases: MEETING_COMPANION_TEAMS_PRIVACY_VISION_PHRASES,
    faq: MEETING_COMPANION_TEAMS_PRIVACY_FAQ,
    engineRoute: "/app/meeting-collaboration-intelligence-engine",
    calendarsRoute: "/app/assistant/calendars",
    calendarsDistinction: "Context Engine handles calendar OAuth — MCIE consumes meeting awareness cross-link only",
    unifiedTaskRoute: "/app/unified-task-follow-up-engine",
    knowledgeCenterRoute: "/app/knowledge-center-engine",
    organizationalMemoryRoute: "/app/organizational-memory-engine",
    doc: "MEETING_COMPANION_TEAMS_INTEGRATION_PRIVACY_STANDARD.md",
    teamsStatus: "privacy_standard_defined",
    liveConnection: false,
    defaultSave: "do_not_save",
    privacyNote: "No raw audio/video by default — metadata and approved summaries only.",
  };
}

export function detectMeetingCompanionTeamsPrivacyCue(text: string): boolean {
  const normalized = text.toLowerCase();
  const cues = [
    "teams meeting",
    "join my meeting",
    "meeting companion",
    "record meeting",
    "aipify companion",
    "meeting privacy",
    "save meeting summary",
    "join and help",
    "teams integration",
  ];
  return cues.some((cue) => normalized.includes(cue));
}
