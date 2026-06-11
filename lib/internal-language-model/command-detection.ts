import { pickClosingPhrase } from "./describe";
import { COMMAND_CORE_PRINCIPLE, USER_COMMAND_VOCABULARY } from "./command-vocabulary";
import type { UserCommandGuidance, UserCommandKey } from "./types";

const COMMAND_PATTERNS: Array<{ pattern: RegExp; key: UserCommandKey }> = [
  {
    pattern: /\b(?:open|check|review|look at).{0,30}\b(?:email|inbox|mail)\b/i,
    key: "email_overview",
  },
  {
    pattern: /\b(?:create|make|add).{0,20}\btasks?\b.{0,30}\b(?:from|in).{0,20}\b(?:email|message)/i,
    key: "email_tasks",
  },
  {
    pattern: /\bcreate tasks from\b/i,
    key: "email_tasks",
  },
  {
    pattern: /\b(?:check|review|look at).{0,30}\bcalendar\b/i,
    key: "calendar_availability",
  },
  {
    pattern: /\bfind (?:a |some )?time\b/i,
    key: "calendar_availability",
  },
  {
    pattern: /\b(?:check|review|look at).{0,30}\b(?:support|ticket|case)/i,
    key: "support_priority",
  },
  {
    pattern: /\btoday(?:'s|s)? support\b/i,
    key: "support_priority",
  },
  {
    pattern: /\b(?:look at|review|check).{0,30}\bleads?\b/i,
    key: "sales_follow_up",
  },
  {
    pattern: /\bfollow[- ]?up plan\b/i,
    key: "sales_follow_up",
  },
  {
    pattern: /\bapprove (?:everything|all).{0,30}\b(?:aipify|suggested|pending)/i,
    key: "bulk_approve",
  },
  {
    pattern: /\b(?:let aipify|have aipify).{0,40}\b(?:automatically|auto|handle this)/i,
    key: "automation_rule",
  },
  {
    pattern: /\b(?:from now on|automatically from now)\b/i,
    key: "automation_rule",
  },
];

function buildCommandReply(key: UserCommandKey): string {
  const entry = USER_COMMAND_VOCABULARY[key];
  const categories =
    entry.categories && entry.categories.length > 0
      ? `\n\nI can organize results into categories such as: ${entry.categories.slice(0, 5).join(", ")}.`
      : "";

  const approvalNote = entry.requiresApproval
    ? "\n\nI can prepare this for approval — I will not take action without your confirmation."
    : "";

  return `${entry.safeResponse}${categories}${approvalNote}\n\n${COMMAND_CORE_PRINCIPLE}`;
}

export function detectUserCommandIntent(message: string): UserCommandGuidance | null {
  const trimmed = message.trim();
  if (!trimmed) return null;

  const match = COMMAND_PATTERNS.find(({ pattern }) => pattern.test(trimmed));
  if (!match) return null;

  const entry = USER_COMMAND_VOCABULARY[match.key];
  return {
    detected: true,
    commandKey: match.key,
    reply: buildCommandReply(match.key),
    riskLevel: entry.riskLevel,
    requiresApproval: entry.requiresApproval,
    integration: entry.integration,
    dashboardPath: entry.dashboardPath,
    closingPhrase: entry.requiresApproval
      ? pickClosingPhrase(0)
      : pickClosingPhrase(1),
  };
}
