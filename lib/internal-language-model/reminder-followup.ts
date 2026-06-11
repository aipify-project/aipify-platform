import { pickClosingPhrase } from "./describe";
import {
  REMINDER_FOLLOWUP_FINAL_PRINCIPLE,
  REMINDER_FOLLOWUP_VISION,
  REMINDER_FOLLOWUP_VOCABULARY,
} from "./reminder-followup-vocabulary";
import type {
  ReminderFollowupEntry,
  ReminderFollowupResult,
  ReminderFollowupScenarioKey,
  ReminderFollowupTrigger,
} from "./types";

const REMINDER_FOLLOWUP_CUE_PATTERNS: Array<{
  pattern: RegExp;
  key: ReminderFollowupScenarioKey;
  priority?: number;
}> = [
  {
    pattern: /\b(?:good morning|morning (?:briefing|overview|summary))\b/i,
    key: "daily_morning_summary",
    priority: 9,
  },
  {
    pattern: /\b(?:what should i know (?:before|to start)|start(?:ing)? (?:my|the) day)\b/i,
    key: "daily_morning_summary",
    priority: 7,
  },
  {
    pattern: /\b(?:midday|mid-day|quick review).{0,30}\b(?:today|attention)\b/i,
    key: "daily_midday_summary",
    priority: 8,
  },
  {
    pattern: /\b(?:end of (?:the )?day|before (?:i )?finish(?:ing)?|wrap(?:ping)? up).{0,30}\b(?:priorit|review|remaining)/i,
    key: "daily_end_of_day_summary",
    priority: 9,
  },
  {
    pattern: /\b(?:evening review|review (?:my )?day)\b/i,
    key: "daily_end_of_day_summary",
    priority: 8,
  },
  {
    pattern: /\b(?:weekly review|coming week|next week).{0,30}\b(?:priorit|unfinished|summary)/i,
    key: "daily_weekly_review",
    priority: 8,
  },
  {
    pattern: /\bweekly review\b/i,
    key: "daily_weekly_review",
    priority: 9,
  },
  {
    pattern: /\b(?:what still (?:needs|deserves)|still (?:needs|deserves)).{0,20}\b(?:attention|follow[- ]?up)/i,
    key: "productivity_daily_review",
    priority: 8,
  },
  {
    pattern: /\b(?:what(?:'s| is) still waiting|pending follow[- ]?ups?)\b/i,
    key: "contact_promised_followup",
    priority: 8,
  },
  {
    pattern: /\b(?:overdue tasks?|tasks? (?:that are )?overdue)\b/i,
    key: "task_overdue",
    priority: 9,
  },
  {
    pattern: /\b(?:unsent draft|draft (?:i )?never sent)\b/i,
    key: "email_unsent_draft",
    priority: 9,
  },
  {
    pattern: /\b(?:welcome back|while i was (?:away|out|off))\b/i,
    key: "memory_returning_absence",
    priority: 9,
  },
  {
    pattern: /\b(?:what changed since|since i (?:was )?last (?:here|active))\b/i,
    key: "memory_returning_absence",
    priority: 8,
  },
  {
    pattern: /\b(?:summarize|summary of).{0,30}\b(?:previous|prior|earlier).{0,20}\b(?:discussion|conversation|decision)/i,
    key: "memory_forget_context",
    priority: 8,
  },
  {
    pattern: /\b(?:help me remember|what (?:was|were) my reminders|show my reminders)\b/i,
    key: "memory_user_asks_reminders",
    priority: 8,
  },
  {
    pattern: /\b(?:unread messages?|messages? (?:i )?haven'?t read)\b/i,
    key: "unread_accumulating",
    priority: 7,
  },
  {
    pattern: /\b(?:high[- ]priority tasks?|urgent tasks? (?:pending|waiting))\b/i,
    key: "task_high_priority_pending",
    priority: 8,
  },
  {
    pattern: /\b(?:meeting follow[- ]?up|after (?:the )?meeting).{0,20}\b(?:not done|incomplete|missing)/i,
    key: "meeting_followup_missing",
    priority: 8,
  },
  {
    pattern: /\b(?:upcoming meeting|meeting (?:is )?approaching|prepare for (?:my )?meeting)\b/i,
    key: "meeting_approaching",
    priority: 8,
  },
  {
    pattern: /\b(?:birthday|anniversary).{0,20}\b(?:approaching|coming up|soon)\b/i,
    key: "relationship_customer_birthday",
    priority: 7,
  },
  {
    pattern: /\b(?:commitments?|promises?).{0,20}\b(?:overdue|past due)\b/i,
    key: "promise_multiple_overdue",
    priority: 8,
  },
];

function buildReminderFollowupReply(entry: ReminderFollowupEntry): string {
  const gentlePrefix =
    entry.domain !== "positive" && entry.domain !== "daily_assistant"
      ? "I noticed there may still be something worth your attention. "
      : "";

  return `${gentlePrefix}${entry.response}\n\n${REMINDER_FOLLOWUP_FINAL_PRINCIPLE}`;
}

export function getReminderFollowupLanguage(
  scenarioKey: ReminderFollowupScenarioKey,
  trigger: ReminderFollowupTrigger = "system_observation"
): ReminderFollowupResult {
  const entry = REMINDER_FOLLOWUP_VOCABULARY[scenarioKey];
  return {
    detected: true,
    scenarioKey,
    reply: buildReminderFollowupReply(entry),
    domain: entry.domain,
    trigger,
    dashboardPath: entry.dashboardPath,
    closingPhrase: pickClosingPhrase(entry.domain === "positive" ? 1 : 2),
  };
}

function findReminderFollowupCue(message: string): ReminderFollowupScenarioKey | null {
  const matches = REMINDER_FOLLOWUP_CUE_PATTERNS.filter(({ pattern }) =>
    pattern.test(message)
  );
  if (matches.length === 0) return null;

  matches.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return matches[0].key;
}

export function detectReminderFollowupCue(message: string): ReminderFollowupResult | null {
  const trimmed = message.trim();
  if (!trimmed) return null;

  if (/\bremind me to\b/i.test(trimmed) || /\bremember to\b/i.test(trimmed)) {
    return null;
  }

  const scenarioKey = findReminderFollowupCue(trimmed);
  if (!scenarioKey) return null;

  return getReminderFollowupLanguage(scenarioKey, "user_message");
}

export function getReminderFollowupVision(): string {
  return REMINDER_FOLLOWUP_VISION;
}
