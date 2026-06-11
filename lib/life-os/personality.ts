export const LIFE_PERSONALITIES = [
  "minimal",
  "professional",
  "supportive",
  "highly_proactive",
] as const;

export type LifePersonality = (typeof LIFE_PERSONALITIES)[number];

export const PROACTIVITY_LEVELS = ["low", "balanced", "high"] as const;
export type ProactivityLevel = (typeof PROACTIVITY_LEVELS)[number];

export const NOTIFICATION_FREQUENCIES = ["minimal", "balanced", "frequent"] as const;
export type NotificationFrequency = (typeof NOTIFICATION_FREQUENCIES)[number];

export function isLifePersonality(value: string): value is LifePersonality {
  return (LIFE_PERSONALITIES as readonly string[]).includes(value);
}

/** Tone hint for client copy — user always decides. */
export function personalityTone(personality: LifePersonality): "brief" | "warm" | "formal" | "eager" {
  switch (personality) {
    case "minimal":
      return "brief";
    case "professional":
      return "formal";
    case "highly_proactive":
      return "eager";
    default:
      return "warm";
  }
}
