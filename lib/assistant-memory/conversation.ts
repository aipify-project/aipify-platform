import type { PameMemoryType } from "./categories";
import { buildClarificationQuestion } from "./clarification";
import { confidenceFromIntent } from "./confidence";
import {
  detectMemoryIntent,
  permissionPromptForIntent,
  type MemoryIntent,
} from "./memory-intent-dataset";
import { detectRelationshipSignal } from "@/lib/relationship-intelligence/detection";
import { defaultEventReminders } from "./reminders";
import { toAssistantIntent, type AssistantIntent } from "./intent";

export type MemoryDraft = {
  category: PameMemoryType;
  title: string;
  summary: string;
  event_date: string | null;
  intent: AssistantIntent;
  memory_intent?: MemoryIntent;
  reminder_offsets: string[];
  expires_at: string | null;
  recurrence: string | null;
  confidence_level: "high" | "medium" | "low";
  person_name?: string | null;
  relationship?: string | null;
};

export type AssistantTurnResult = {
  reply: string;
  intent: AssistantIntent;
  memory_intent?: MemoryIntent;
  memoryDraft: MemoryDraft | null;
  askBeforeRemembering: boolean;
  followUpOptions?: string[];
  confidence_level: "high" | "medium" | "low";
  suggestLifeDashboard?: boolean;
};

const MONTH_PATTERN =
  /\b(january|february|march|april|may|june|july|august|september|october|november|december|januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)\s+(\d{1,2})(?:\.|st|nd|rd|th)?\b/i;

const MONTH_ONLY_PATTERN =
  /\b(in |next )?(january|february|march|april|may|june|july|august|september|october|november|december|januar|februar|mars|mai|juni|juli|august|oktober|desember)\b/i;

function inferPameCategory(message: string, memoryIntent: MemoryIntent): PameMemoryType {
  if (memoryIntent === "important_date" || memoryIntent === "long_term_memory") {
    return "important_people";
  }
  if (memoryIntent === "health_reminder" || memoryIntent === "financial_reminder") {
    return "habits";
  }
  if (memoryIntent === "travel_planning") {
    return "events";
  }
  if (
    memoryIntent === "procrastination_support" ||
    memoryIntent === "follow_up"
  ) {
    return "tasks";
  }

  if (/wife|husband|daughter|son|mother|father|friend|colleague|birthday|anniversary/i.test(message)) {
    return "important_people";
  }
  if (/doctor|appointment|school|holiday|travel|celebration|meeting/i.test(message)) {
    return "events";
  }
  if (/call|renew|schedule|buy|follow up|next week|insurance|service/i.test(message)) {
    return "tasks";
  }
  if (/weekly|daily|monthly|medication|exercise|routine|every/i.test(message)) {
    return "habits";
  }
  if (/save money|learn|business|health|goal|improve/i.test(message)) {
    return "goals";
  }
  return "tasks";
}

function extractPerson(message: string): { name: string | null; relationship: string | null } {
  const rsi = detectRelationshipSignal(message);
  const nameMatch = message.match(
    /\b(?:call|contact|follow up with|message|reach out to)\s+([A-Z][a-z]+)\b/
  );
  return {
    name: nameMatch?.[1] ?? rsi.personName ?? rsi.relationship,
    relationship: rsi.relationship,
  };
}

function extractEventDate(message: string): string | null {
  const match = message.match(MONTH_PATTERN);
  if (match) {
    const monthRaw = match[1].toLowerCase();
    const day = match[2].padStart(2, "0");
    const monthIndex = monthToIndex(monthRaw);
    if (!monthIndex) return null;
    const year = new Date().getFullYear();
    return `${year}-${String(monthIndex).padStart(2, "0")}-${day}`;
  }

  const monthOnly = message.match(MONTH_ONLY_PATTERN);
  if (monthOnly) {
    const monthIndex = monthToIndex(monthOnly[2].toLowerCase());
    if (monthIndex) {
      const year = new Date().getFullYear();
      return `${year}-${String(monthIndex).padStart(2, "0")}-01`;
    }
  }

  if (/next week/i.test(message)) {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }
  if (/next month/i.test(message)) {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  }

  return null;
}

function monthToIndex(monthRaw: string): number | null {
  const monthMap: Record<string, number> = {
    january: 1, januar: 1, february: 2, februar: 2, march: 3, mars: 3,
    april: 4, may: 5, mai: 5, june: 6, juni: 6, july: 7, juli: 7,
    august: 8, september: 9, october: 10, oktober: 10, november: 11, december: 12, desember: 12,
  };
  return monthMap[monthRaw] ?? null;
}

function buildTitle(message: string): string {
  const trimmed = message.trim();
  if (trimmed.length <= 80) return trimmed;
  return `${trimmed.slice(0, 77)}…`;
}

function defaultOffsetsForIntent(memoryIntent: MemoryIntent, hasDate: boolean): string[] {
  if (!hasDate) {
    if (memoryIntent === "procrastination_support" || memoryIntent === "follow_up") {
      return ["7_days_before", "same_day"];
    }
    return ["7_days_before"];
  }
  return defaultEventReminders();
}

function shouldCreateDraft(memoryIntent: MemoryIntent): boolean {
  return !["daily_assistance", "evening_reflection", "schedule", "general"].includes(
    memoryIntent
  );
}

export function buildAssistantTurn(
  message: string,
  askBeforeRemembering = true
): AssistantTurnResult {
  const memoryIntent = detectMemoryIntent(message);
  const intent = toAssistantIntent(memoryIntent);
  const rsi = detectRelationshipSignal(message);
  const category =
    rsi.detected && memoryIntent !== "task_reminder"
      ? "important_people"
      : inferPameCategory(message, memoryIntent);
  const eventDate = extractEventDate(message);
  const person = extractPerson(message);
  const confidence = confidenceFromIntent(intent, message);
  const needsConfirm =
    askBeforeRemembering && (confidence !== "high" || rsi.askToRemember);

  if (memoryIntent === "daily_assistance") {
    return {
      intent: "general",
      memory_intent: memoryIntent,
      memoryDraft: null,
      askBeforeRemembering: false,
      suggestLifeDashboard: true,
      reply:
        "I can help with that. Your Life dashboard has today's overview, priorities, and what needs attention — open it anytime, or tell me what you'd like remembered.",
      confidence_level: "low",
    };
  }

  if (memoryIntent === "evening_reflection") {
    return {
      intent: "general",
      memory_intent: memoryIntent,
      memoryDraft: null,
      askBeforeRemembering: false,
      suggestLifeDashboard: true,
      reply:
        "Let's look at your day. Your Life dashboard has an evening review — what's still pending, and whether you'd like to move anything to tomorrow.",
      confidence_level: "low",
    };
  }

  if (memoryIntent === "schedule") {
    return {
      intent,
      memory_intent: memoryIntent,
      memoryDraft: null,
      askBeforeRemembering: false,
      reply:
        "Calendar integration with Google, Apple, and Outlook is planned. I can remember the details and remind you until then.",
      confidence_level: "low",
    };
  }

  if (shouldCreateDraft(memoryIntent) || rsi.detected) {
    const memoryDraft: MemoryDraft = {
      category,
      title: buildTitle(message),
      summary: message.trim(),
      event_date: eventDate,
      intent,
      memory_intent: memoryIntent,
      reminder_offsets: defaultOffsetsForIntent(memoryIntent, Boolean(eventDate)),
      expires_at: null,
      recurrence:
        category === "habits" ||
        memoryIntent === "health_reminder" ||
        memoryIntent === "financial_reminder" ||
        /annual|yearly|monthly/i.test(message)
          ? memoryIntent === "financial_reminder"
            ? "monthly"
            : "annual"
          : null,
      confidence_level: confidence,
      person_name: person.name,
      relationship: person.relationship,
    };

    const reply =
      rsi.thoughtfulPrompt ??
      permissionPromptForIntent(memoryIntent) ??
      buildClarificationQuestion({
        category,
        hasDate: Boolean(eventDate),
        hasPerson: Boolean(person.name),
        missingReminder: Boolean(eventDate),
      });

    return {
      intent,
      memory_intent: memoryIntent,
      memoryDraft,
      askBeforeRemembering: needsConfirm,
      followUpOptions: eventDate
        ? ["Two weeks before", "One week before", "Day before"]
        : memoryIntent === "procrastination_support"
          ? ["Keep reminding me", "Check in next week", "Day before deadline"]
          : undefined,
      reply,
      confidence_level: confidence,
    };
  }

  if (/^yes\.?$/i.test(message.trim()) || /^ja\.?$/i.test(message.trim())) {
    return {
      intent: "general",
      memoryDraft: null,
      askBeforeRemembering: false,
      reply: "How about two weeks before, one week before, and the day before?",
      confidence_level: "medium",
    };
  }

  return {
    intent: "general",
    memory_intent: memoryIntent,
    memoryDraft: null,
    askBeforeRemembering: false,
    reply:
      "I'm listening. Tell me what matters — birthdays, follow-ups, or things you don't want to forget.",
    confidence_level: "low",
  };
}
