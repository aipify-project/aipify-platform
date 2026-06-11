import type { NbleEntry, NbleIntentKey } from "./types";

export const NBLE_CORE_PRINCIPLE =
  "People describe outcomes. Systems describe actions. Aipify translates human outcomes into safe business actions.";

export const NBLE_VISION =
  "People should speak naturally. Aipify should understand responsibly. Humans should remain in control.";

export const NBLE_SAFETY_PHILOSOPHY = [
  "Understanding does not equal permission.",
  "Preparing does not equal approval.",
  "Approval does not equal unrestricted execution.",
  "Execution must always remain within approved boundaries.",
] as const;

export const NBLE_RESPONSE_TRAITS = [
  "helpful",
  "professional",
  "calm",
  "supportive",
  "practical",
  "transparent",
  "efficient",
  "responsible",
] as const;

export const NBLE_AVOID_TRAITS = [
  "robotic",
  "arrogant",
  "aggressive",
  "overconfident",
  "unpredictable",
  "secretive",
] as const;

/** Canonical business concepts and industry synonym groups. */
export const INDUSTRY_TERM_GROUPS = {
  lead: ["lead", "prospect", "opportunity", "deal"],
  ticket: ["ticket", "case", "request", "issue", "inquiry"],
  customer: ["customer", "client", "member", "patient", "guest"],
  meeting: ["meeting", "consultation", "appointment", "call"],
  task: ["task", "assignment", "follow-up", "follow up", "action item"],
} as const;

export type IndustryConcept = keyof typeof INDUSTRY_TERM_GROUPS;

/** Company-specific phrases understood as equivalent ticket/case creation. */
export const COMPANY_EQUIVALENT_ACTIONS: Array<{
  phrases: string[];
  concept: IndustryConcept;
}> = [
  { phrases: ["make a ticket", "register an inquiry", "create a case", "log a case"], concept: "ticket" },
  { phrases: ["book a meeting", "schedule a call", "set up a consultation"], concept: "meeting" },
  { phrases: ["add a follow-up", "create an action item", "assign a task"], concept: "task" },
];

export const NATURAL_BUSINESS_VOCABULARY: Record<NbleIntentKey, NbleEntry> = {
  email_behind: {
    key: "email_behind",
    label: "Behind on email",
    humanPhrase: "I've fallen behind on emails.",
    meanings: [
      "Review inbox",
      "Prioritize messages",
      "Identify urgent replies",
      "Prepare drafts",
      "Suggest tasks",
    ],
    response:
      "I can review your inbox, prioritize what needs attention, and prepare suggestions for urgent replies and follow-up tasks. I will not send or reply without your approval.",
    domain: "email",
    mapsToCommand: "email_overview",
  },
  email_overview_natural: {
    key: "email_overview_natural",
    label: "Email overview (natural)",
    humanPhrase: "Open my email and create an overview.",
    meanings: ["Access connected email", "Review messages", "Create summary"],
    response:
      "I can review your connected email and organize what requires attention. I will not send, delete or reply to messages without your approval.",
    domain: "email",
    mapsToCommand: "email_overview",
  },
  email_unanswered: {
    key: "email_unanswered",
    label: "Unanswered emails",
    humanPhrase: "What do I need to answer today?",
    meanings: ["Find unanswered emails", "Identify priorities"],
    response:
      "I can identify messages that appear to require your response and organize them by urgency.",
    domain: "email",
    mapsToCommand: "email_overview",
  },
  email_cleanup: {
    key: "email_cleanup",
    label: "Inbox cleanup",
    humanPhrase: "Clean up my inbox.",
    meanings: ["Categorize messages", "Suggest organization"],
    response:
      "I can prepare an inbox organization plan and show you the proposed changes before anything is applied.",
    domain: "email",
  },
  email_forgotten: {
    key: "email_forgotten",
    label: "Forgotten follow-ups",
    humanPhrase: "Did I forget anyone?",
    meanings: ["Identify unanswered conversations", "Detect follow-ups"],
    response:
      "I found conversations that may require follow-up and have organized them for your review.",
    domain: "email",
  },
  calendar_time: {
    key: "calendar_time",
    label: "Available time",
    humanPhrase: "When do I have time?",
    meanings: ["Check availability", "Suggest time slots"],
    response: "I can review your calendar and suggest available time slots.",
    domain: "calendar",
    mapsToCommand: "calendar_availability",
    dashboardPath: "/app/assistant/calendars",
  },
  calendar_prepare: {
    key: "calendar_prepare",
    label: "Meeting preparation",
    humanPhrase: "Prepare me for today's meetings.",
    meanings: ["Review meetings", "Gather context", "Summarize agenda"],
    response:
      "I can summarize your upcoming meetings and provide relevant context to help you prepare.",
    domain: "calendar",
    dashboardPath: "/app/assistant/calendars",
  },
  calendar_fit: {
    key: "calendar_fit",
    label: "Find calendar space",
    humanPhrase: "Can you fit this in somewhere?",
    meanings: ["Find calendar space"],
    response: "I can suggest suitable time slots based on your existing schedule.",
    domain: "calendar",
    mapsToCommand: "calendar_availability",
    dashboardPath: "/app/assistant/calendars",
  },
  task_focus: {
    key: "task_focus",
    label: "Daily focus",
    humanPhrase: "What should I focus on today?",
    meanings: ["Prioritize workload"],
    response: "I can review your outstanding items and suggest priorities for today.",
    domain: "task_management",
    dashboardPath: "/app/action-center",
  },
  task_overwhelmed: {
    key: "task_overwhelmed",
    label: "Overwhelmed",
    humanPhrase: "I'm overwhelmed.",
    meanings: ["Organize work", "Reduce stress"],
    response:
      "I can help organize your workload and identify the most important actions to focus on first.",
    domain: "task_management",
  },
  task_back_on_track: {
    key: "task_back_on_track",
    label: "Back on track",
    humanPhrase: "Get me back on track.",
    meanings: ["Review tasks", "Rebuild priorities"],
    response:
      "I can create a structured overview of your responsibilities and suggest a practical action plan.",
    domain: "task_management",
    dashboardPath: "/app/action-center",
  },
  support_burning: {
    key: "support_burning",
    label: "Urgent support",
    humanPhrase: "What's burning right now?",
    meanings: ["Find urgent support cases"],
    response: "I can identify support cases that may require immediate attention.",
    domain: "support",
    mapsToCommand: "support_priority",
    dashboardPath: "/app/settings/support-operations",
  },
  support_important: {
    key: "support_important",
    label: "Important support items",
    humanPhrase: "Anything important?",
    meanings: ["Review support queue"],
    response:
      "I can summarize the most significant developments and highlight cases that should be reviewed.",
    domain: "support",
    mapsToCommand: "support_priority",
    dashboardPath: "/app/settings/support-operations",
  },
  support_who_first: {
    key: "support_who_first",
    label: "Support prioritization",
    humanPhrase: "Who needs help first?",
    meanings: ["Prioritize customers"],
    response: "I can identify customers with urgent needs based on the available information.",
    domain: "support",
    mapsToCommand: "support_priority",
    dashboardPath: "/app/settings/support-operations",
  },
  sales_who_call: {
    key: "sales_who_call",
    label: "Lead prioritization",
    humanPhrase: "Who should I call?",
    meanings: ["Prioritize leads"],
    response: "I can identify leads that may benefit most from follow-up.",
    domain: "sales",
    mapsToCommand: "sales_follow_up",
    dashboardPath: "/app/action-center",
  },
  sales_slipping: {
    key: "sales_slipping",
    label: "At-risk deals",
    humanPhrase: "What deals are slipping away?",
    meanings: ["Detect sales risk"],
    response: "I can identify opportunities that appear to require additional attention.",
    domain: "sales",
    mapsToCommand: "sales_follow_up",
    dashboardPath: "/app/action-center",
  },
  sales_where_time: {
    key: "sales_where_time",
    label: "Sales time optimization",
    humanPhrase: "Where should I spend my time?",
    meanings: ["Optimize effort"],
    response: "I can help prioritize activities that are likely to create the greatest impact.",
    domain: "sales",
    mapsToCommand: "sales_follow_up",
    dashboardPath: "/app/action-center",
  },
  action_show_approval: {
    key: "action_show_approval",
    label: "Pending approvals",
    humanPhrase: "Show me what needs approval.",
    meanings: ["Display pending actions"],
    response: "I can provide an overview of actions awaiting approval.",
    domain: "action_center",
    dashboardPath: "/app/action-center",
  },
  action_automate: {
    key: "action_automate",
    label: "Automation evaluation",
    humanPhrase: "Can we automate this?",
    meanings: ["Evaluate automation"],
    response:
      "I can assess whether this process is suitable for automation and explain the associated safeguards.",
    domain: "action_center",
    mapsToCommand: "automation_rule",
    dashboardPath: "/app/action-center",
  },
  action_take_care: {
    key: "action_take_care",
    label: "Safe execution level",
    humanPhrase: "Can Aipify take care of this?",
    meanings: ["Determine safe execution level"],
    response:
      "I can determine whether this can be prepared, approved or automated within your current permissions.",
    domain: "action_center",
    dashboardPath: "/app/action-center",
  },
  emotional_stressed: {
    key: "emotional_stressed",
    label: "Stressed",
    humanPhrase: "I'm stressed.",
    meanings: ["Reduce cognitive load"],
    response:
      "I can help organize your priorities and identify the most important next steps.",
    domain: "emotional",
  },
  emotional_where_start: {
    key: "emotional_where_start",
    label: "Where to start",
    humanPhrase: "I don't know where to start.",
    meanings: ["Create structure"],
    response: "I can help you break this down into manageable actions.",
    domain: "emotional",
  },
  emotional_behind: {
    key: "emotional_behind",
    label: "Feeling behind",
    humanPhrase: "I feel behind.",
    meanings: ["Review responsibilities"],
    response:
      "I can create an overview of outstanding items and suggest where to begin.",
    domain: "emotional",
  },
};

export function getNaturalBusinessVocabulary(key: NbleIntentKey): NbleEntry {
  return NATURAL_BUSINESS_VOCABULARY[key];
}

export function normalizeBusinessConcept(term: string): IndustryConcept | null {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return null;

  for (const [concept, synonyms] of Object.entries(INDUSTRY_TERM_GROUPS)) {
    if (synonyms.some((synonym) => normalized.includes(synonym))) {
      return concept as IndustryConcept;
    }
  }

  return null;
}

export function detectCompanyEquivalentAction(message: string): IndustryConcept | null {
  const lower = message.toLowerCase();
  for (const { phrases, concept } of COMPANY_EQUIVALENT_ACTIONS) {
    if (phrases.some((phrase) => lower.includes(phrase))) {
      return concept;
    }
  }
  return null;
}
