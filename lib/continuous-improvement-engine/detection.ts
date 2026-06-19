/** Phase 574 — Organizational learning intent detection for Companion routing. */

const ORGANIZATIONAL_LEARNING_PATTERNS = [
  /\blessons learned\b/i,
  /\bwhat have we learned\b/i,
  /\bwhat mistakes keep repeating\b/i,
  /\bcontinuous improvement\b/i,
  /\bimprovement report\b/i,
  /\blearning report\b/i,
  /\bsuccess stor(y|ies)\b/i,
  /\bretrospective\b/i,
  /\brepeated (?:delay|mistake|issue)\b/i,
  /\bwhat worked\b/i,
  /\bwhat failed\b/i,
];

export function detectOrganizationalLearningIntent(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  return ORGANIZATIONAL_LEARNING_PATTERNS.some((pattern) => pattern.test(text));
}

export const ORGANIZATIONAL_LEARNING_ROUTE = "/app/learning-center";
