import { buildFunctionReply, buildReplacementReply, pickClosingPhrase } from "./describe";
import { FUNCTION_VOCABULARY } from "./vocabulary";
import type { AipifyFeatureGuidance, AipifyFunctionKey } from "./types";

const FEATURE_PATTERNS: Array<{ pattern: RegExp; key: AipifyFunctionKey }> = [
  { pattern: /\baction center\b/i, key: "action_center" },
  { pattern: /\bautonomous execution\b/i, key: "autonomous_execution_framework" },
  { pattern: /\bexecution framework\b/i, key: "autonomous_execution_framework" },
  { pattern: /\bknowledge engine\b/i, key: "knowledge_engine" },
  { pattern: /\bemployee knowledge\b/i, key: "knowledge_engine" },
  { pattern: /\bsupport assistant\b/i, key: "support_assistant" },
  { pattern: /\badmin assistant\b/i, key: "admin_assistant" },
  { pattern: /\bbusiness insights\b/i, key: "business_insights_engine" },
  { pattern: /\bcontinuous improvement\b/i, key: "continuous_improvement_engine" },
  { pattern: /\bobserver mode\b/i, key: "observer_mode" },
  { pattern: /\bassistant mode\b/i, key: "assistant_mode" },
  { pattern: /\boperator mode\b/i, key: "operator_mode" },
  { pattern: /\bautonomous mode\b/i, key: "autonomous_mode" },
  { pattern: /\baudit log\b/i, key: "audit_log" },
  { pattern: /\bapproval (?:flow|workflow)\b/i, key: "approval_flow" },
  { pattern: /\bsafety system\b/i, key: "safety_system" },
  { pattern: /\bwhat is aipify\b/i, key: "aipify" },
  { pattern: /\bwhat does aipify do\b/i, key: "aipify" },
  { pattern: /\bhow does aipify work\b/i, key: "aipify" },
];

const REPLACEMENT_PATTERNS = [
  /\breplace(?:s|ing)? (?:my |our )?(?:employees?|staff|team|support)\b/i,
  /\bwill aipify (?:replace|take over)\b/i,
  /\brun(?:s|ning)? (?:my |our )?company\b/i,
];

export function detectAipifyFeatureIntent(message: string): AipifyFeatureGuidance | null {
  const trimmed = message.trim();
  if (!trimmed) return null;

  const asksAboutReplacement = REPLACEMENT_PATTERNS.some((p) => p.test(trimmed));
  if (asksAboutReplacement) {
    const key: AipifyFunctionKey = /\bsupport\b/i.test(trimmed)
      ? "support_assistant"
      : "aipify";
    const entry = FUNCTION_VOCABULARY[key];
    return {
      detected: true,
      functionKey: key,
      reply: buildReplacementReply(entry),
      dashboardPath: entry.dashboardPath,
      closingPhrase: pickClosingPhrase(5),
    };
  }

  const match = FEATURE_PATTERNS.find(({ pattern }) => pattern.test(trimmed));
  if (!match) return null;

  const entry = FUNCTION_VOCABULARY[match.key];
  return {
    detected: true,
    functionKey: match.key,
    reply: buildFunctionReply(entry),
    dashboardPath: entry.dashboardPath,
    closingPhrase: pickClosingPhrase(match.key === "action_center" ? 0 : 1),
  };
}
