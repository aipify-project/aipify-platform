/** Phase 573 — Decision memory intent detection for Companion routing. */

const DECISION_MEMORY_PATTERNS = [
  /\bhave we done this before\b/i,
  /\bwhat happened last time\b/i,
  /\bwhat options were considered\b/i,
  /\bwho approved\b/i,
  /\bwhy did we choose\b/i,
  /\bwhy did we (?:launch|enter|change)\b/i,
  /\bdecision (?:history|memory|registry|briefing)\b/i,
  /\bwhat were the outcomes\b/i,
  /\borganizational reasoning\b/i,
  /\bdecision intelligence\b/i,
];

export function detectDecisionMemoryIntent(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  return DECISION_MEMORY_PATTERNS.some((pattern) => pattern.test(text));
}

export const DECISION_MEMORY_ROUTE = "/app/decisions";
