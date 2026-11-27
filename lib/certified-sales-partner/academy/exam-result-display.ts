/**
 * Client-safe helpers for Academy exam result presentation.
 * Never invents correct/total counts when only a percentage is known.
 */

export type ExamScoreDisplayInput = {
  scorePct: number | null | undefined;
  correct: number | null | undefined;
  total: number | null | undefined;
  /** Template: "{correct} of {total} correct ({score}%)" */
  scoreWithCounts: string;
  /** Template: "Result: {score}% — passed" */
  scorePercentOnly: string;
};

/** True when both counts are verified non-negative integers with total > 0. */
export function hasVerifiedExamCounts(
  correct: number | null | undefined,
  total: number | null | undefined,
): correct is number {
  return (
    typeof correct === "number" &&
    Number.isFinite(correct) &&
    correct >= 0 &&
    typeof total === "number" &&
    Number.isFinite(total) &&
    total > 0 &&
    correct <= total
  );
}

/**
 * Formats the score line for a passed (or failed) result.
 * Returns null when no score percentage is available — never "0 of —".
 */
export function formatExamScoreDisplay(input: ExamScoreDisplayInput): string | null {
  if (typeof input.scorePct !== "number" || !Number.isFinite(input.scorePct)) return null;
  const score = Math.round(input.scorePct);
  if (hasVerifiedExamCounts(input.correct, input.total)) {
    return input.scoreWithCounts
      .replace(/\{correct\}/g, String(input.correct))
      .replace(/\{total\}/g, String(input.total))
      .replace(/\{score\}/g, String(score));
  }
  return input.scorePercentOnly.replace(/\{score\}/g, String(score));
}

const NORDIC_TZ = "Europe/Oslo";

function localeTag(locale: string): string {
  switch (locale) {
    case "no":
      return "nb-NO";
    case "sv":
      return "sv-SE";
    case "da":
      return "da-DK";
    case "pl":
      return "pl-PL";
    case "uk":
      return "uk-UA";
    case "es":
      return "es-ES";
    default:
      return "en-GB";
  }
}

/**
 * Locale-correct calendar date for certificate/exam display.
 * Nordic locales use Europe/Oslo; others use UTC. Never returns a raw ISO string when parseable.
 */
export function formatExamPassedAtDisplay(iso: string, locale: string): string {
  const raw = iso.trim();
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  const timeZone = locale === "no" || locale === "sv" || locale === "da" ? NORDIC_TZ : "UTC";
  try {
    return new Intl.DateTimeFormat(localeTag(locale), {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone,
    }).format(date);
  } catch {
    return raw.slice(0, 10);
  }
}
