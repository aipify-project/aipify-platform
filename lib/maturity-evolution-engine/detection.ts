/** Phase 575 — Organizational maturity intent detection for Companion routing. */

const MATURITY_EVOLUTION_PATTERNS = [
  /\bmaturity (?:score|level|center|briefing|report)\b/i,
  /\bcapability maturity\b/i,
  /\bwhere are we weakest\b/i,
  /\bwhat should improve first\b/i,
  /\bwhat capability limits growth\b/i,
  /\borganizational readiness\b/i,
  /\bevolution score\b/i,
  /\bcapability gap\b/i,
  /\bmaturity roadmap\b/i,
  /\bassess(?:ment)? (?:our )?capabilities\b/i,
];

export function detectMaturityEvolutionIntent(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  return MATURITY_EVOLUTION_PATTERNS.some((pattern) => pattern.test(text));
}

export const MATURITY_EVOLUTION_ROUTE = "/app/maturity";
