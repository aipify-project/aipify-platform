/** Phase 580 — Resource capacity intent detection for Companion routing. */

const RESOURCE_CAPACITY_PATTERNS = [
  /\bresource (?:center|capacity|report)\b/i,
  /\bwho has capacity\b/i,
  /\bwhich teams? (?:are|is) overloaded\b/i,
  /\bworkload balancing\b/i,
  /\bcapacity forecast\b/i,
  /\bresource (?:risk|allocation)\b/i,
  /\bunderutili[sz]ed\b/i,
  /\boverload(?:ed)?\b/i,
  /\bwho should own this project\b/i,
  /\bteam utilization\b/i,
];

export function detectResourceCapacityIntent(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  return RESOURCE_CAPACITY_PATTERNS.some((pattern) => pattern.test(text));
}

export const RESOURCE_CAPACITY_ROUTE = "/app/resource-center";
