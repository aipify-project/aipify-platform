/** Phase 577 — Digital twin simulation intent detection for Companion routing. */

const DIGITAL_TWIN_SIMULATION_PATTERNS = [
  /\bdigital twin\b/i,
  /\bbusiness simulation\b/i,
  /\bwhat if\b/i,
  /\bwhat happens if\b/i,
  /\bscenario simulation\b/i,
  /\bimpact analysis\b/i,
  /\bcapacity (?:gap|model)\b/i,
  /\bsimulation briefing\b/i,
  /\bdecision preview\b/i,
  /\bforecast (?:impact|scenario)\b/i,
  /\brun simulation\b/i,
];

export function detectDigitalTwinSimulationIntent(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  return DIGITAL_TWIN_SIMULATION_PATTERNS.some((pattern) => pattern.test(text));
}

export const DIGITAL_TWIN_SIMULATION_ROUTE = "/app/digital-twin-center";
export const DIGITAL_TWIN_WHAT_IF_ROUTE = "/app/digital-twin-center/what-if";
