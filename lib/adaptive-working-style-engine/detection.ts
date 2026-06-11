import { buildAdaptationSuggestion } from "./adaptation";
import type { AwseStyleCueResult, AwseStyleCueKey } from "./types";

const STYLE_CUE_PATTERNS: Array<{ pattern: RegExp; key: AwseStyleCueKey; priority?: number }> = [
  {
    pattern: /\b(?:just |only )?(?:give me |show me )?(?:the )?highlights?\b/i,
    key: "prefer_compact",
    priority: 9,
  },
  {
    pattern: /\b(?:keep it |make it )?(?:short|brief|concise)\b/i,
    key: "prefer_compact",
    priority: 8,
  },
  {
    pattern: /\b(?:explain (?:this |it )?more (?:clearly|detail)|more detail|in more depth)\b/i,
    key: "prefer_detailed",
    priority: 9,
  },
  {
    pattern: /\b(?:stop|fewer|less|too many) remind(?:ing|ers?)\b/i,
    key: "reduce_reminders",
    priority: 9,
  },
  {
    pattern: /\b(?:need more help staying on top|remind me more|more reminders)\b/i,
    key: "increase_reminders",
    priority: 9,
  },
];

const CUE_REPLIES: Record<AwseStyleCueKey, string> = {
  prefer_compact:
    "I can keep summaries compact — highlights and recommended actions only. You can set this as your default in Working Style settings.",
  prefer_detailed:
    "I can provide more detailed context and explanations. You can set this as your default in Working Style settings.",
  reduce_reminders:
    "I can reduce reminder frequency to respect your preferences. You can adjust this anytime in Working Style settings.",
  increase_reminders:
    "I can provide more proactive follow-up support. You can adjust reminder frequency in Working Style settings.",
};

const CUE_SUGGESTIONS: Record<AwseStyleCueKey, string> = {
  prefer_compact: buildAdaptationSuggestion("compact_preferred"),
  prefer_detailed: buildAdaptationSuggestion("detailed_preferred"),
  reduce_reminders: buildAdaptationSuggestion("fewer_reminders"),
  increase_reminders: buildAdaptationSuggestion("more_reminders"),
};

export function detectAdaptiveStyleCue(message: string): AwseStyleCueResult | null {
  const trimmed = message.trim();
  if (!trimmed) return null;

  const matches = STYLE_CUE_PATTERNS.filter(({ pattern }) => pattern.test(trimmed));
  if (matches.length === 0) return null;

  matches.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const key = matches[0].key;

  return {
    detected: true,
    cueKey: key,
    reply: `${CUE_REPLIES[key]}\n\n${CUE_SUGGESTIONS[key]}`,
    suggested_detail_level:
      key === "prefer_compact" ? "compact" : key === "prefer_detailed" ? "detailed" : undefined,
    suggested_reminder_frequency:
      key === "reduce_reminders"
        ? "minimal"
        : key === "increase_reminders"
          ? "proactive"
          : undefined,
  };
}
