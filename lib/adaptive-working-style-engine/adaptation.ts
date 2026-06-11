import type { DetailLevel, WorkingProfile } from "./dimensions";
import type { AwseUserPreferences } from "./types";

export const AWSE_CORE_PRINCIPLE =
  "People work differently. Aipify should adapt responsibly. Humans remain in control.";

const PROFILE_SUMMARY_FOCUS: Record<WorkingProfile, string> = {
  executive: "Strategic highlights — risks, opportunities, decisions requiring approval, and key metrics.",
  operations: "Task-focused overview — pending actions, bottlenecks, and team coordination.",
  support: "Queue overview — urgent cases, escalations, suggested replies, and response times.",
  sales: "Opportunity overview — follow-ups, lead scoring, revenue opportunities, and proposal status.",
  focus: "Minimal notifications — critical items only to protect concentrated work.",
  custom: "Personalized overview based on your configured preferences.",
};

export function getDailySummaryFocus(profile: WorkingProfile): string {
  return PROFILE_SUMMARY_FOCUS[profile];
}

export function applyDetailLevelToText(text: string, level: DetailLevel): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;

  if (level === "detailed") {
    return trimmed;
  }

  const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (level === "compact") {
    const compact = sentences.slice(0, 2).join(" ");
    return compact || trimmed.slice(0, 220);
  }

  return sentences.slice(0, 4).join(" ") || trimmed;
}

export function buildTransparencyNote(preferences: AwseUserPreferences): string {
  return `Your working profile is ${preferences.working_profile} with ${preferences.detail_level} detail and ${preferences.reminder_frequency} reminders. You can change or disable adaptation anytime in Working Style settings.`;
}

export function buildAdaptationSuggestion(
  signal: "compact_preferred" | "detailed_preferred" | "fewer_reminders" | "more_reminders"
): string {
  switch (signal) {
    case "compact_preferred":
      return "I've noticed you often prefer concise summaries. Would you like me to make compact summaries your default format?";
    case "detailed_preferred":
      return "I've noticed you often request more explanation. Would you like me to make detailed summaries your default format?";
    case "fewer_reminders":
      return "I've noticed reminders may feel frequent. Would you like me to reduce reminder frequency?";
    case "more_reminders":
      return "I've noticed you appreciate more follow-up support. Would you like me to increase reminder frequency?";
    default:
      return "Would you like me to adjust your working style preferences based on what I've observed?";
  }
}

export function profileDefaultDetailLevel(profile: WorkingProfile): DetailLevel {
  if (profile === "executive" || profile === "focus") return "compact";
  if (profile === "operations" || profile === "support") return "standard";
  return "standard";
}

export function profileDefaultReminderFrequency(
  profile: WorkingProfile
): AwseUserPreferences["reminder_frequency"] {
  if (profile === "focus") return "minimal";
  if (profile === "executive" || profile === "sales") return "balanced";
  if (profile === "support" || profile === "operations") return "proactive";
  return "balanced";
}
