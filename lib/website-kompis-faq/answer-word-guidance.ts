/**
 * Soft editorial guidance for FAQ answer length in the APP editor only.
 * Not a storage, publish, or visitor-runtime limit.
 */

export const FAQ_ANSWER_WORD_TARGET = 150;
export const FAQ_ANSWER_WORD_WARNING_THRESHOLD = 130;

export type FaqAnswerWordGuidanceTone = "ok" | "warning" | "over";

export type FaqAnswerWordGuidance = {
  wordCount: number;
  remaining: number;
  overBy: number;
  /** 0–1, visually capped at 100% even when over target. */
  progressRatio: number;
  tone: FaqAnswerWordGuidanceTone;
  target: typeof FAQ_ANSWER_WORD_TARGET;
  warningThreshold: typeof FAQ_ANSWER_WORD_WARNING_THRESHOLD;
};

/** Whitespace-separated nonempty tokens; newlines and paste included via the same split. */
export function countFaqAnswerWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter((part) => part.length > 0).length;
}

export function getFaqAnswerWordGuidance(text: string): FaqAnswerWordGuidance {
  const wordCount = countFaqAnswerWords(text);
  const remaining = FAQ_ANSWER_WORD_TARGET - wordCount;
  const overBy = Math.max(0, wordCount - FAQ_ANSWER_WORD_TARGET);
  const progressRatio = Math.min(1, wordCount / FAQ_ANSWER_WORD_TARGET);
  let tone: FaqAnswerWordGuidanceTone = "ok";
  if (wordCount > FAQ_ANSWER_WORD_TARGET) {
    tone = "over";
  } else if (wordCount >= FAQ_ANSWER_WORD_WARNING_THRESHOLD) {
    tone = "warning";
  }
  return {
    wordCount,
    remaining,
    overBy,
    progressRatio,
    tone,
    target: FAQ_ANSWER_WORD_TARGET,
    warningThreshold: FAQ_ANSWER_WORD_WARNING_THRESHOLD,
  };
}
