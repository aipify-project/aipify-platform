export type MorningBriefingSummary = {
  greeting: string;
  headline: string;
  bullets: string[];
  generated_at: string;
};

export const MORNING_BRIEFING_TEMPLATE = {
  greeting: "Greeting",
  headline: "Aipify is monitoring your business.",
  bulletKeys: [
    "support_resolved",
    "no_critical_incidents",
    "recommendations_prepared",
    "activity_change",
  ] as const,
};
