import { detectMemoryIntent } from "./memory-intent-dataset";

export const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;

export type MemoryConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

const HIGH_CONFIDENCE_PATTERNS = [
  /remember (this|that)|remember this for me/i,
  /don'?t let me forget|make sure i don'?t forget/i,
  /please remind me|remind me (later|to|when)/i,
  /please remember|save this for me/i,
  /keep track of this|keep this in mind/i,
  /this is important|this matters/i,
];

const MEDIUM_CONFIDENCE_PATTERNS = [
  /i should|i need to|i have to|i always postpone/i,
  /follow up|check in|probably|help me remember/i,
  /birthday|anniversary|call .+/i,
];

export function confidenceFromIntent(
  intent: string,
  message: string
): MemoryConfidenceLevel {
  if (HIGH_CONFIDENCE_PATTERNS.some((p) => p.test(message))) {
    return "high";
  }

  const memoryIntent = detectMemoryIntent(message);
  if (
    memoryIntent === "create_reminder" ||
    memoryIntent === "important_date" ||
    memoryIntent === "procrastination_support"
  ) {
    return "high";
  }

  if (MEDIUM_CONFIDENCE_PATTERNS.some((p) => p.test(message))) {
    return "medium";
  }

  if (
    memoryIntent === "follow_up" ||
    memoryIntent === "contact_someone" ||
    memoryIntent === "task_reminder" ||
    memoryIntent === "long_term_memory" ||
    memoryIntent === "health_reminder" ||
    memoryIntent === "financial_reminder" ||
    memoryIntent === "travel_planning"
  ) {
    return "medium";
  }

  if (intent === "remember" || intent === "remind_later" || intent === "follow_up") {
    return "medium";
  }

  return "low";
}

export function shouldAutoStore(confidence: MemoryConfidenceLevel): boolean {
  return confidence === "high";
}

export function shouldAskConfirmation(confidence: MemoryConfidenceLevel): boolean {
  return confidence !== "high";
}
