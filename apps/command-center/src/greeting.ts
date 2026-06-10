export type GreetingPeriod = "morning" | "afternoon" | "evening" | "late";

export function getLocalHour(timezone: string, now = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone || "UTC",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  return Number(parts.find((part) => part.type === "hour")?.value ?? 0);
}

export function getGreetingPeriod(hour: number): GreetingPeriod {
  if (hour >= 5 && hour <= 10) return "morning";
  if (hour >= 11 && hour <= 16) return "afternoon";
  if (hour >= 17 && hour <= 22) return "evening";
  return "late";
}

export function greetingForTimezone(timezone: string, now = new Date()): string {
  const period = getGreetingPeriod(getLocalHour(timezone, now));
  if (period === "morning") return "Good morning";
  if (period === "afternoon") return "Good afternoon";
  if (period === "evening") return "Good evening";
  return "Working late? Aipify is still monitoring your business.";
}
