/** Phase 578 — Organizational execution intent detection for Companion routing. */

const EXECUTION_OUTCOME_PATTERNS = [
  /\bexecution (?:center|briefing|health|scorecard)\b/i,
  /\bwhat is (?:behind schedule|blocked)\b/i,
  /\bwhat requires attention\b/i,
  /\bhighest risk initiative\b/i,
  /\boverdue actions?\b/i,
  /\bblocked actions?\b/i,
  /\binitiative (?:status|owner)\b/i,
  /\baccountability\b/i,
  /\boutcome tracking\b/i,
  /\bmeeting to execution\b/i,
];

export function detectExecutionOutcomeIntent(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  return EXECUTION_OUTCOME_PATTERNS.some((pattern) => pattern.test(text));
}

export const EXECUTION_OUTCOME_ROUTE = "/app/execution-center";
