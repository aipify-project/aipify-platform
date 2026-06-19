/** Phase 572 — Know-Who intent detection for Companion routing. */

const KNOW_WHO_PATTERNS = [
  /\bwho knows\b/i,
  /\bwho understands\b/i,
  /\bwho built\b/i,
  /\bwho handled\b/i,
  /\bwho owns\b/i,
  /\bwho should i ask\b/i,
  /\bwho can approve\b/i,
  /\bwho can help\b/i,
  /\bwho has solved\b/i,
  /\bwho should review\b/i,
  /\bwho should join\b/i,
  /\bfind (?:an? )?expert\b/i,
  /\bknow-who\b/i,
  /\bknow who\b/i,
  /\bexpertise (?:center|directory|report)\b/i,
];

export function detectKnowWhoIntent(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  return KNOW_WHO_PATTERNS.some((pattern) => pattern.test(text));
}

export const KNOW_WHO_ROUTE = "/app/expertise";
