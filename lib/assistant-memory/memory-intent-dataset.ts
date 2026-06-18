/**
 * Human Memory Intent Dataset v1.0
 * Teaches understanding — not commands.
 * @see HUMAN_MEMORY_INTENT_DATASET.md
 */

export const MEMORY_INTENTS = [
  "create_reminder",
  "important_date",
  "follow_up",
  "contact_someone",
  "task_reminder",
  "long_term_memory",
  "health_reminder",
  "financial_reminder",
  "travel_planning",
  "procrastination_support",
  "daily_assistance",
  "evening_reflection",
  "schedule",
  "general",
] as const;

export type MemoryIntent = (typeof MEMORY_INTENTS)[number];

export type IntentRule = {
  intent: MemoryIntent;
  patterns: RegExp[];
  /** Higher = checked first when multiple match */
  priority: number;
};

/**
 * Patterns derived from Human Memory Intent Dataset v1.0 examples.
 * Ordered by priority within detectMemoryIntent (highest first).
 */
export const MEMORY_INTENT_RULES: IntentRule[] = [
  {
    intent: "evening_reflection",
    priority: 100,
    patterns: [
      /did i complete everything/i,
      /what still needs my attention/i,
      /help me plan tomorrow/i,
      /what should i move to another day/i,
      /did i forget anything important/i,
      /summarize my day/i,
      /how productive was i today/i,
      /what should i focus on next/i,
    ],
  },
  {
    intent: "daily_assistance",
    priority: 95,
    patterns: [
      /what should i focus on today/i,
      /help me organize my day/i,
      /anything important coming up/i,
      /what have i forgotten/i,
      /what needs my attention this week/i,
      /help me prioritize/i,
      /give me an overview/i,
      /is there anything urgent/i,
      /how does tomorrow look/i,
      /what should i prepare for/i,
    ],
  },
  {
    intent: "create_reminder",
    priority: 90,
    patterns: [
      /remember this for me/i,
      /help me remember/i,
      /don'?t let me forget/i,
      /do not let me forget/i,
      /this is important/i,
      /please remind me later/i,
      /going to forget this/i,
      /keep track of this/i,
      /please remember this/i,
      /need help remembering/i,
      /this matters/i,
      /should probably write this down/i,
      /keep this in mind/i,
      /make sure i don'?t forget/i,
      /need to remember/i,
      /remind me when the time comes/i,
      /save this for me/i,
      /keep an eye on this/i,
      /don'?t want to forget/i,
      /stay on my radar/i,
      /remember this until/i,
      /remember (this|that)/i,
      /remind me (later|about|to|when)/i,
      /\bi will\b/i,
      /\bi need to\b/i,
      /remember to call/i,
      /remember that/i,
    ],
  },
  {
    intent: "important_date",
    priority: 85,
    patterns: [
      /birthday (is |on |next)/i,
      /has a birthday/i,
      /turns \d+/i,
      /wedding anniversary/i,
      /anniversary is/i,
      /starts school/i,
      /turns seventy|turns \w+ next year/i,
      /celebrate .+ years together/i,
      /remember my .+ birthday/i,
      /family gathering/i,
      /graduation/i,
      /recital/i,
      /important family/i,
    ],
  },
  {
    intent: "procrastination_support",
    priority: 80,
    patterns: [
      /know i'?ll put this off/i,
      /need help getting this done/i,
      /don'?t let me ignore this/i,
      /always postpone/i,
      /put this off forever/i,
      /keep checking in with me/i,
      /stay accountable/i,
      /need a little push/i,
      /keep reminding me until/i,
      /keep nudging me/i,
      /life gets busy/i,
      /help me follow through/i,
      /help me stay on top/i,
    ],
  },
  {
    intent: "follow_up",
    priority: 75,
    patterns: [
      /check in with me/i,
      /ask me about this again/i,
      /follow through on this/i,
      /make sure i actually do/i,
      /keep me accountable/i,
      /ask me if i'?ve done/i,
      /check whether i'?ve completed/i,
      /follow up if i haven'?t/i,
      /haven'?t taken care of it/i,
      /follow up on/i,
      /did you ever send/i,
      /have you heard back/i,
      /planned to contact/i,
      /still unpaid/i,
      /you planned to contact/i,
    ],
  },
  {
    intent: "contact_someone",
    priority: 70,
    patterns: [
      /remind me to call/i,
      /should call my/i,
      /forget to contact/i,
      /follow up with \w+/i,
      /remind me to send/i,
      /promised .+ get back/i,
      /check in with (dad|mom|mother|father)/i,
      /reach out to/i,
      /remind me to message/i,
      /forget to contact him/i,
      /call .+ this week/i,
    ],
  },
  {
    intent: "health_reminder",
    priority: 65,
    patterns: [
      /take my medication/i,
      /annual check-?up/i,
      /doctor'?s appointment/i,
      /remind me to exercise/i,
      /dental cleaning/i,
      /health goals/i,
      /drink more water/i,
      /stretch during work/i,
      /refill my prescription/i,
      /book the dentist/i,
    ],
  },
  {
    intent: "financial_reminder",
    priority: 60,
    patterns: [
      /pay the .+ bill/i,
      /review my finances/i,
      /transfer money to savings/i,
      /check my subscriptions/i,
      /mortgage payment/i,
      /submit my taxes/i,
      /organized financially/i,
      /reminder before major expenses/i,
      /pay the insurance/i,
      /pay the electricity/i,
    ],
  },
  {
    intent: "travel_planning",
    priority: 55,
    patterns: [
      /renew my passport/i,
      /book flights/i,
      /travel insurance/i,
      /remind me to pack/i,
      /check in online/i,
      /prepare for the trip/i,
      /packing checklist/i,
      /hotel booking/i,
      /forget the hotel/i,
    ],
  },
  {
    intent: "task_reminder",
    priority: 50,
    patterns: [
      /renew my passport/i,
      /book the car service/i,
      /pay the insurance/i,
      /order more medication/i,
      /submit that report/i,
      /schedule an appointment/i,
      /remember this errand/i,
      /keep track of this/i,
      /slipping through the cracks/i,
      /i need to .+/i,
      /i have to .+/i,
    ],
  },
  {
    intent: "long_term_memory",
    priority: 45,
    patterns: [
      /\b(loves?|prefers?|hates?|enjoys?)\b/i,
      /always buy .+ early/i,
      /work best in the morning/i,
      /prefer .+ over/i,
      /weekend getaway/i,
      /reminders a week in advance/i,
      /don'?t like last-?minute/i,
      /forget administrative tasks/i,
      /extra reminders for/i,
      /mentioned wanting/i,
    ],
  },
  {
    intent: "schedule",
    priority: 40,
    patterns: [/calendar/i, /appointment/i, /meeting/i, /schedule/i],
  },
];

export function detectMemoryIntent(message: string): MemoryIntent {
  const trimmed = message.trim();
  if (!trimmed) return "general";

  const sorted = [...MEMORY_INTENT_RULES].sort((a, b) => b.priority - a.priority);

  for (const rule of sorted) {
    for (const pattern of rule.patterns) {
      if (pattern.test(trimmed)) return rule.intent;
    }
  }

  return "general";
}

/** Suggested permission-style clarification from dataset. */
export function permissionPromptForIntent(intent: MemoryIntent): string | null {
  switch (intent) {
    case "create_reminder":
    case "important_date":
    case "task_reminder":
      return "Would you like me to remember this?";
    case "follow_up":
    case "procrastination_support":
      return "Would you like me to follow up on this?";
    case "contact_someone":
      return "When should I remind you?";
    case "long_term_memory":
      return "Should I save this for you?";
    case "health_reminder":
    case "financial_reminder":
    case "travel_planning":
      return "Would you like a reminder?";
    default:
      return null;
  }
}
