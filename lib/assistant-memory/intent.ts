import { detectMemoryIntent, type MemoryIntent } from "./memory-intent-dataset";

export type AssistantIntent =
  | "remember"
  | "remind_later"
  | "schedule"
  | "follow_up"
  | "general";

/** Map detailed memory intent to legacy assistant intent for API compatibility. */
export function toAssistantIntent(memoryIntent: MemoryIntent): AssistantIntent {
  switch (memoryIntent) {
    case "create_reminder":
    case "important_date":
    case "long_term_memory":
      return "remember";
    case "follow_up":
    case "procrastination_support":
      return "follow_up";
    case "contact_someone":
    case "task_reminder":
    case "health_reminder":
    case "financial_reminder":
    case "travel_planning":
      return "remind_later";
    case "schedule":
      return "schedule";
    case "daily_assistance":
    case "evening_reflection":
    case "general":
    default:
      return "general";
  }
}

/** @deprecated Use MEMORY_INTENT_RULES — kept for backward compatibility */
export const REMEMBER_INTENT_PATTERNS = [
  /remember (this|that)/i,
  /don'?t let me forget/i,
  /this is important/i,
  /remind me (later|about|to)/i,
] as const;

export function detectAssistantIntent(message: string): AssistantIntent {
  return toAssistantIntent(detectMemoryIntent(message));
}

export function detectAssistantIntentDetailed(message: string): {
  memoryIntent: MemoryIntent;
  assistantIntent: AssistantIntent;
} {
  const memoryIntent = detectMemoryIntent(message);
  return {
    memoryIntent,
    assistantIntent: toAssistantIntent(memoryIntent),
  };
}
