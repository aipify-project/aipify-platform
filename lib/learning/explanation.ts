import type { AllowedLearningSource } from "./sources";

export function buildLearningExplanation(
  patternType: string,
  source: AllowedLearningSource,
  metadata?: Record<string, unknown>
): string {
  const hour = metadata?.preferred_hour as number | undefined;
  const dismissRate = metadata?.dismiss_rate as number | undefined;

  if (patternType === "executive_summary_timing" && hour != null) {
    return `Aipify noticed that you approve executive summaries before ${String(hour).padStart(2, "0")}:00 and adjusted delivery timing.`;
  }

  if (patternType === "notification_frequency" && dismissRate != null) {
    return `Aipify reduced notification frequency because similar alerts were dismissed ${dismissRate}% of the time.`;
  }

  if (source === "approved_recommendation") {
    return "Aipify learned from an approved recommendation and will suggest similar improvements.";
  }

  if (source === "notification_engagement") {
    return "Aipify adjusted presence notifications based on how you engage with alerts.";
  }

  if (source === "user_preference") {
    return "Aipify adapted behaviour based on your saved preferences.";
  }

  return "Aipify recorded an approved pattern to improve future suggestions.";
}
