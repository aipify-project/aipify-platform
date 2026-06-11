import type { PameMemoryType } from "./categories";
import { buildClarificationQuestion } from "./clarification";
import { confidenceFromIntent } from "./confidence";
import {
  detectMemoryIntent,
  permissionPromptForIntent,
  type MemoryIntent,
} from "./memory-intent-dataset";
import { detectSchedulingIntent } from "@/lib/context-engine/scheduling";
import type { EventDraft } from "@/lib/context-engine/types";
import { detectFocusIntent } from "@/lib/attention-guardian/detection";
import { detectDecisionIntent } from "@/lib/decision-support-engine/detection";
import { detectEmployeeKnowledgeIntent } from "@/lib/employee-knowledge-engine/detection";
import { detectAipifyFeatureIntent } from "@/lib/internal-language-model/detection";
import { detectGoalIntent } from "@/lib/goals-dreams-engine/detection";
import type { GoalDraft } from "@/lib/goals-dreams-engine/types";
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
  suggestContextDashboard?: boolean;
  eventDraft?: EventDraft | null;
  schedulingFollowUp?: string[];
  goalDraft?: GoalDraft | null;
  suggestGoalsDashboard?: boolean;
  goalFollowUp?: string[];
  suggestAttentionDashboard?: boolean;
  focusProposal?: { title: string; session_type: string; ends_at_hint: string | null } | null;
  suggestDecisionsDashboard?: boolean;
  suggestEmployeeKnowledgeDashboard?: boolean;
  decisionGuidance?: {
    decision_type: string;
    domain: string;
    reasoning: string[];
    confidence: string;
    trade_offs?: string[];
  } | null;
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

  const featureIntent = detectAipifyFeatureIntent(message);
  if (featureIntent?.detected) {
    const dashboardNote = featureIntent.dashboardPath
      ? `\n\nYou can open the relevant dashboard when you're ready.`
      : "";
    const closing = featureIntent.closingPhrase ? `\n\n${featureIntent.closingPhrase}` : "";
    return {
      intent: "general",
      memory_intent: memoryIntent,
      memoryDraft: null,
      askBeforeRemembering: false,
      reply: `${featureIntent.reply}${dashboardNote}${closing}`,
      confidence_level: "high",
    };
  }

  const decisionIntent = detectDecisionIntent(message);
  if (decisionIntent?.detected) {
    const reasoningBlock =
      decisionIntent.reasoning.length > 0
        ? `\n\nI'm thinking about this because:\n${decisionIntent.reasoning.map((r) => `· ${r}`).join("\n")}`
        : "";
    const tradeOffBlock =
      decisionIntent.trade_offs && decisionIntent.trade_offs.length > 0
        ? `\n\nTrade-offs to consider:\n${decisionIntent.trade_offs.map((t) => `· ${t}`).join("\n")}`
        : "";
    return {
      intent: "general",
      memory_intent: memoryIntent,
      memoryDraft: null,
      askBeforeRemembering: false,
      suggestDecisionsDashboard: true,
      suggestContextDashboard: true,
      decisionGuidance: {
        decision_type: decisionIntent.decision_type,
        domain: decisionIntent.domain,
        reasoning: decisionIntent.reasoning,
        confidence: decisionIntent.confidence,
        trade_offs: decisionIntent.trade_offs,
      },
      reply: `${decisionIntent.prompt}${reasoningBlock}${tradeOffBlock}\n\nYou make the final decision — I'm here to clarify, not decide for you.`,
      confidence_level:
        decisionIntent.confidence === "high"
          ? "high"
          : decisionIntent.confidence === "low"
            ? "low"
            : "medium",
    };
  }

  const employeeKnowledgeIntent = detectEmployeeKnowledgeIntent(message);
  if (employeeKnowledgeIntent?.detected) {
    return {
      intent: "general",
      memory_intent: memoryIntent,
      memoryDraft: null,
      askBeforeRemembering: false,
      suggestEmployeeKnowledgeDashboard: true,
      reply: `${employeeKnowledgeIntent.prompt}\n\nYou make the final decision — I'm here to guide, not replace your judgment. Open Employee Knowledge in Settings for approved procedures and step-by-step guidance.`,
      confidence_level: "medium",
    };
  }

  if (memoryIntent === "daily_assistance") {
    return {
      intent: "general",
      memory_intent: memoryIntent,
      memoryDraft: null,
      askBeforeRemembering: false,
      suggestLifeDashboard: true,
      suggestContextDashboard: true,
      suggestDecisionsDashboard: true,
      reply:
        "I can help with that. Your Context dashboard has today's briefing, connected calendars, and what needs attention — your Decisions dashboard can help prioritize what matters most. Tell me what you'd like scheduled.",
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
      suggestContextDashboard: true,
      reply:
        "Let's look at your day. Your Context dashboard has an evening review — what's still pending, and whether you'd like to reschedule anything.",
      confidence_level: "low",
    };
  }

  const focusIntent = detectFocusIntent(message);
  if (focusIntent?.detected) {
    return {
      intent: "general",
      memory_intent: memoryIntent,
      memoryDraft: null,
      askBeforeRemembering: true,
      suggestAttentionDashboard: true,
      focusProposal: {
        title: focusIntent.title,
        session_type: focusIntent.session_type,
        ends_at_hint: focusIntent.ends_at_hint,
      },
      reply: focusIntent.prompt,
      confidence_level: "high",
    };
  }

  const goalIntent = detectGoalIntent(message);
  if (goalIntent?.detected && goalIntent.draft) {
    return {
      intent: "general",
      memory_intent: memoryIntent,
      memoryDraft: null,
      goalDraft: goalIntent.draft,
      askBeforeRemembering: !goalIntent.draft.needs_clarification,
      suggestGoalsDashboard: true,
      goalFollowUp: goalIntent.follow_up_options,
      reply: goalIntent.prompt,
      confidence_level: goalIntent.draft.needs_clarification ? "medium" : "high",
    };
  }

  const scheduling = detectSchedulingIntent(message);
  if (memoryIntent === "schedule" || scheduling?.detected) {
    const proposal = scheduling ?? {
      detected: true,
      title: buildTitle(message),
      event_date: extractEventDate(message),
      suggested_purpose: "personal" as const,
      suggested_calendar_name: "personal calendar",
      prompt: "Would you like me to add this to your calendar?",
    };
    const eventDraft: EventDraft = {
      title: proposal.title,
      description: message.trim(),
      event_type: /remind/i.test(message) ? "reminder" : "appointment",
      calendar_purpose: proposal.suggested_purpose,
      starts_at: proposal.event_date ? `${proposal.event_date}T09:00:00.000Z` : null,
      all_day: Boolean(proposal.event_date),
    };
    return {
      intent,
      memory_intent: memoryIntent,
      memoryDraft: null,
      eventDraft,
      askBeforeRemembering: true,
      suggestContextDashboard: true,
      schedulingFollowUp: proposal.follow_up_options,
      reply: proposal.prompt,
      confidence_level: confidence,
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
      "I'm listening. Tell me what matters — goals you're working toward, birthdays, follow-ups, or things you don't want to forget.",
    confidence_level: "low",
  };
}
