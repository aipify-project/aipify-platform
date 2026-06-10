/** Executive Feed — continuous operational awareness (Phase 26). */

export type ExecutiveFeedEntry = {
  id: string;
  time_label: string;
  message: string;
  level: string;
  created_at: string;
};

export const EXECUTIVE_FEED_EXAMPLES = [
  { time: "08:30", message: "Good morning. Aipify resolved 14 support conversations overnight." },
  { time: "11:20", message: "Aipify completed scheduled maintenance successfully." },
  { time: "14:15", message: "A recommendation is awaiting approval." },
  { time: "17:00", message: "Daily summary is ready." },
] as const;
