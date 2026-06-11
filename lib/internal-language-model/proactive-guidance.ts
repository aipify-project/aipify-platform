import { pickClosingPhrase } from "./describe";
import {
  PROACTIVE_GUIDANCE_FINAL_PRINCIPLE,
  PROACTIVE_GUIDANCE_PRINCIPLE,
  PROACTIVE_GUIDANCE_VOCABULARY,
} from "./proactive-guidance-vocabulary";
import type {
  ProactiveGuidanceEntry,
  ProactiveGuidanceResult,
  ProactiveGuidanceScenarioKey,
  ProactiveGuidanceTrigger,
} from "./types";

const PROACTIVE_GUIDANCE_CUE_PATTERNS: Array<{
  pattern: RegExp;
  key: ProactiveGuidanceScenarioKey;
  priority?: number;
}> = [
  {
    pattern: /\b(?:just |)?send (?:it|this|that)(?: now| anyway)?\b/i,
    key: "email_unreviewed_attachments",
    priority: 8,
  },
  {
    pattern: /\bsend.{0,40}\bwithout (?:review(?:ing)?|check(?:ing)?)\b/i,
    key: "email_unreviewed_attachments",
    priority: 9,
  },
  {
    pattern: /\b(?:reply|send|email).{0,40}\b(?:angry|upset|furious|harsh|heated)\b/i,
    key: "email_emotional_reply",
    priority: 9,
  },
  {
    pattern: /\b(?:send|email|forward).{0,30}\b(?:everyone|whole team|all (?:staff|customers|clients|users))\b/i,
    key: "email_large_recipient_list",
    priority: 9,
  },
  {
    pattern: /\b(?:schedule|book).{0,30}\b(?:anyway|overlap(?:ping)?)\b/i,
    key: "calendar_overlapping_meetings",
    priority: 8,
  },
  {
    pattern: /\b(?:double[- ]book|back[- ]to[- ]back all day)\b/i,
    key: "calendar_no_prep_time",
    priority: 7,
  },
  {
    pattern: /\b(?:automate everything|fully? automatic|without (?:human|approval|oversight))\b/i,
    key: "automation_sensitive_workflow",
    priority: 9,
  },
  {
    pattern: /\b(?:automate|run).{0,30}\b(?:entire|whole|all).{0,20}\b(?:business|company|workflow)/i,
    key: "automation_scope_too_broad",
    priority: 9,
  },
  {
    pattern: /\b(?:delete all|remove everyone|bulk delete|wipe all)\b/i,
    key: "security_sensitive_action",
    priority: 10,
  },
  {
    pattern: /\b(?:grant|give).{0,20}\b(?:full|admin|elevated).{0,15}\b(?:access|permission)/i,
    key: "security_elevated_permissions",
    priority: 9,
  },
  {
    pattern: /\b(?:do it anyway|proceed anyway|ignore (?:the |that )?warning)\b/i,
    key: "autonomy_user_continues",
    priority: 8,
  },
  {
    pattern: /\b(?:skip approval|bypass approval|no approval needed)\b/i,
    key: "autonomy_action_prohibited",
    priority: 9,
  },
];

function buildProactiveGuidanceReply(entry: ProactiveGuidanceEntry): string {
  const acknowledgment =
    entry.domain !== "autonomy"
      ? "I understand what you're trying to achieve. "
      : "";

  const consequenceNote =
    entry.consequence && entry.domain !== "autonomy"
      ? ` Before continuing, you may want to consider that ${entry.consequence.toLowerCase()}`
      : "";

  const alternativeNote =
    entry.saferAlternative && entry.domain !== "autonomy"
      ? ` If you'd like, I can help you explore alternative approaches — for example, ${entry.saferAlternative.toLowerCase()}`
      : "";

  return `${acknowledgment}${entry.response}${consequenceNote}${alternativeNote}.\n\n${PROACTIVE_GUIDANCE_FINAL_PRINCIPLE}`;
}

export function getProactiveGuidance(
  scenarioKey: ProactiveGuidanceScenarioKey,
  trigger: ProactiveGuidanceTrigger = "system_observation"
): ProactiveGuidanceResult {
  const entry = PROACTIVE_GUIDANCE_VOCABULARY[scenarioKey];
  return {
    detected: true,
    scenarioKey,
    reply: buildProactiveGuidanceReply(entry),
    domain: entry.domain,
    trigger,
    dashboardPath: entry.dashboardPath,
    closingPhrase: pickClosingPhrase(entry.domain === "autonomy" ? 0 : 2),
  };
}

function findProactiveGuidanceCue(message: string): ProactiveGuidanceScenarioKey | null {
  const matches = PROACTIVE_GUIDANCE_CUE_PATTERNS.filter(({ pattern }) => pattern.test(message));
  if (matches.length === 0) return null;

  matches.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return matches[0].key;
}

export function detectProactiveGuidanceCue(message: string): ProactiveGuidanceResult | null {
  const trimmed = message.trim();
  if (!trimmed) return null;

  const scenarioKey = findProactiveGuidanceCue(trimmed);
  if (!scenarioKey) return null;

  return getProactiveGuidance(scenarioKey, "user_message");
}

export function getProactiveGuidancePrinciple(): string {
  return PROACTIVE_GUIDANCE_PRINCIPLE;
}
